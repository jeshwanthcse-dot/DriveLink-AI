import datetime
import uuid
import structlog
from sqlalchemy.orm import Session
from app.models.safety_alert import AISafetyAlert
from app.repositories.delivery import DeliveryRepository
from app.repositories.notification import NotificationRepository
from app.repositories.safety import SafetyRepository
from app.repositories.tracking import TrackingRepository
from app.schemas.notification import NotificationCreate
from app.schemas.safety_alert import AISafetyAlertCreate, AISafetyAlertUpdate

logger = structlog.get_logger("app.ai.safety_monitor")


class SafetyMonitorAgent:
    """Safety Monitoring Agent detecting vehicle anomalies and triggering IVR verification."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.safety_repo = SafetyRepository(db)
        self.notif_repo = NotificationRepository(db)
        self.tracking_repo = TrackingRepository(db)
        self.delivery_repo = DeliveryRepository(db)
        # Import dynamically to avoid immediate import circles during bootstrap loading
        from app.ai.voice_ivr.manager import VoiceCallManager
        self.call_manager = VoiceCallManager(db)

    def evaluate_movement(self, delivery_id: uuid.UUID) -> AISafetyAlert | None:
        """
        Analyzes GPS log history for stationary threshold exceedances.
        If threshold exceeded, initiates IVR call flow, logs alerts, and notifies organizations.
        """
        delivery = self.delivery_repo.get_by_id(delivery_id)
        if not delivery or not delivery.driver_id:
            logger.warning("safety_check_skipped_invalid_delivery", delivery_id=str(delivery_id))
            return None

        logger.info("safety_movement_evaluation_started", delivery_id=str(delivery_id))

        # Check latest GPS tracking logs
        logs = self.tracking_repo.filter(delivery_id=delivery_id)

        # Simple threshold detection logic:
        # If the latest 3 logs show speed == 0.0, trigger stationary alert
        trigger_alert = False
        if len(logs) >= 3:
            recent_logs = logs[-3:]
            if all(log.speed == 0.0 for log in recent_logs):
                trigger_alert = True

        if not trigger_alert:
            logger.info("safety_movement_evaluation_normal", delivery_id=str(delivery_id))
            return None

        logger.warning(
            "safety_stationary_threshold_exceeded",
            delivery_id=str(delivery_id),
            driver_id=str(delivery.driver_id),
        )

        trigger_reason = "Vehicle stationary for consecutive telemetry intervals with 0 speed."
        utc_now = datetime.datetime.now(datetime.timezone.utc)

        # 1. Create safety alert record
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

            # 2. Trigger Voice IVR Call Flow via CallManager
            driver_phone = delivery.driver.phone if delivery.driver else "+919999999999"
            call_log = self.call_manager.trigger_safety_check_call(
                delivery_id=delivery_id,
                driver_id=delivery.driver_id,
                organization_id=delivery.organization_id,
                phone=driver_phone,
                safety_alert_id=alert.id,
            )

            # 3. Store Driver Response and Resolve Status
            ivr_status = "COMPLETED" if call_log.call_status == "COMPLETED" else "FAILED"
            driver_response = call_log.driver_response
            resolved = False

            # If driver explicitly responded they are safe, resolve the alert
            if driver_response and "safe" in driver_response.lower():
                resolved = True

            self.safety_repo.update(
                alert.id,
                AISafetyAlertUpdate(
                    ivr_status=ivr_status,
                    driver_response=driver_response,
                    resolved=resolved,
                ),
            )

            # 4. Notify Organization
            notif_title = f"AI Safety Alert - Delivery {str(delivery_id)[:8]}"
            notif_msg = (
                f"Driver safety check triggered. Reason: {trigger_reason}. "
                f"Call status: {ivr_status}. Driver response: '{driver_response or 'No Response'}'. "
                f"Alert Resolution: {'RESOLVED' if resolved else 'PENDING OPERATOR ACTION'}."
            )

            self.notif_repo.create(
                NotificationCreate(
                    organization_id=delivery.organization_id,
                    title=notif_title,
                    message=notif_msg,
                    type="warning" if not resolved else "info",
                    is_read=False,
                )
            )

            self.db.commit()
            self.db.refresh(alert)
            return alert

        except Exception as exc:
            self.db.rollback()
            logger.error("safety_alert_execution_failed", error=str(exc))
            raise exc
