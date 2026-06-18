import datetime
import uuid
import structlog
from typing import Any
from sqlalchemy.orm import Session
from app.models.safety_alert import AISafetyAlert
from app.repositories.safety import SafetyRepository
from app.repositories.delivery import DeliveryRepository
from app.repositories.notification import NotificationRepository
from app.schemas.safety_alert import AISafetyAlertCreate
from app.services.tracking_service import TrackingService

logger = structlog.get_logger("app.ai.safety_monitor.service")


class RulesEngine:
    """Evaluates telemetry rules to flag idle or stationary vehicles."""

    def __init__(self, tracking_service: TrackingService) -> None:
        self.tracking_service = tracking_service

    def evaluate(self, delivery_id: uuid.UUID) -> dict[str, Any]:
        """Runs the rule checks (speed < 3 kmph and stopped > 20 mins)."""
        duration = self.tracking_service.calculate_stop_duration(delivery_id)
        latest_log = self.tracking_service.get_latest_location(delivery_id)

        # Check speed < 3 kmph and duration > 20 minutes (at same location)
        if latest_log and latest_log.speed < 3.0 and duration > 20.0:
            return {
                "trigger_alert": True,
                "reason": f"Vehicle stopped for {duration:.1f} mins (Speed: {latest_log.speed} kmph) at lat: {latest_log.latitude}, lon: {latest_log.longitude}",
                "duration_minutes": duration,
                "latitude": latest_log.latitude,
                "longitude": latest_log.longitude,
                "alert_type": "STATIONARY",
            }
        return {"trigger_alert": False, "duration_minutes": duration}


class FutureLLMReasoner:
    """Placeholder for future LLM-based safety anomaly reasoner."""

    def analyze(self, telemetry_data: dict[str, Any]) -> dict[str, Any]:
        """AI analysis slot. Defaults to rules approval."""
        return {"llm_approved": True, "llm_confidence": 1.0}


class SafetyAgent:
    """Modular Safety Agent executing the safety checks and decisions."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.tracking_service = TrackingService(db)
        self.rules_engine = RulesEngine(self.tracking_service)
        self.llm_reasoner = FutureLLMReasoner()

    def process_safety_check(self, delivery_id: uuid.UUID) -> dict[str, Any]:
        """Runs safety check pipelines: RulesEngine -> LLM Reasoner -> Decision."""
        # 1. Rules Engine check
        decision = self.rules_engine.evaluate(delivery_id)
        if not decision["trigger_alert"]:
            return {"trigger_alert": False}

        # 2. Future LLM Reasoner check
        llm_analysis = self.llm_reasoner.analyze(decision)
        if not llm_analysis["llm_approved"]:
            return {"trigger_alert": False}

        return decision


class SafetyMonitorService:
    """Coordinates Safety Agent logic, safety alerts generation, and Twilio IVR calls."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.agent = SafetyAgent(db)
        self.safety_repo = SafetyRepository(db)
        self.delivery_repo = DeliveryRepository(db)
        self.notif_repo = NotificationRepository(db)

    def run_safety_check(self, delivery_id: uuid.UUID) -> AISafetyAlert | None:
        """Runs safety check logic for a delivery and triggers an alert if stationary."""
        logger.info("Safety Check Started", delivery_id=str(delivery_id))

        delivery = self.delivery_repo.get_by_id(delivery_id)
        if not delivery or not delivery.driver_id:
            logger.warning("safety_check_skipped_missing_driver", delivery_id=str(delivery_id))
            return None

        # Prevent concurrent multiple calls for the same active alert
        active_alerts = self.safety_repo.filter(delivery_id=delivery_id, resolved=False)
        if active_alerts:
            logger.info("safety_check_alert_already_active", delivery_id=str(delivery_id))
            return None

        # Evaluate safety check via modular SafetyAgent
        decision = self.agent.process_safety_check(delivery_id)
        if not decision.get("trigger_alert"):
            return None

        trigger_reason = decision["reason"]
        utc_now = datetime.datetime.now(datetime.timezone.utc)

        # Generate Safety Alert
        alert_schema = AISafetyAlertCreate(
            delivery_id=delivery_id,
            driver_id=delivery.driver_id,
            organization_id=delivery.organization_id,
            trigger_reason=trigger_reason,
            trigger_time=utc_now,
            ivr_status="INITIATED",
            driver_response=None,
            resolved=False,
        )

        try:
            alert = self.safety_repo.create(alert_schema)
            self.db.commit()
            self.db.refresh(alert)

            logger.info("Safety Alert Created", alert_id=str(alert.id), driver_id=str(delivery.driver_id))

            # Trigger IVR call dynamically using VoiceCallManager
            from app.ai.voice_ivr.manager import VoiceCallManager
            call_manager = VoiceCallManager(self.db)

            driver_phone = delivery.driver.phone if delivery.driver else "+16592096057"
            logger.info("Twilio Call Started", alert_id=str(alert.id), phone=driver_phone)

            # Trigger safety check call
            call_log = call_manager.call_driver(
                delivery_id=delivery_id,
                driver_id=delivery.driver_id,
                organization_id=delivery.organization_id,
                phone=driver_phone,
                safety_alert_id=alert.id,
            )

            # Update alert with Twilio call status
            alert.ivr_status = call_log.call_status
            self.db.commit()
            self.db.refresh(alert)

            return alert

        except Exception as e:
            self.db.rollback()
            logger.error("safety_alert_trigger_failed", error=str(e))
            raise e
