import uuid
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.delivery import Delivery
from app.models.driver import Driver
from app.models.safety_alert import AISafetyAlert
from app.models.document import DriverDocument
from app.models.enums import VerificationStatus
from app.services.tracking_service import TrackingService

logger = structlog.get_logger("app.ai.delivery_intelligence.risk")


class DeliveryRiskEvaluator:
    """Calculates live risk score (0-100) and routes it to LOW, MEDIUM, HIGH, or CRITICAL levels (Sprint 15)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.tracking_service = TrackingService(db)

    def calculate_risk(self, delivery_id: uuid.UUID) -> dict:
        """Evaluates telemetry and core parameters to generate risk scores."""
        logger.info("Risk Check Started", delivery_id=str(delivery_id))

        delivery = self.db.get(Delivery, delivery_id)
        if not delivery:
            logger.warning("risk_calc_skipped_delivery_not_found", delivery_id=str(delivery_id))
            return {"score": 0.0, "level": "LOW"}

        score = 0.0

        # 1. Driver Rating Factor (Max 25 penalty)
        driver = self.db.get(Driver, delivery.driver_id) if delivery.driver_id else None
        if driver:
            rating = driver.rating or 4.0
            rating_penalty = (5.0 - rating) * 5.0
            score += min(rating_penalty, 25.0)
        else:
            score += 15.0 # penalty for unassigned driver

        # 2. Safety Alerts Factor (Max 30 penalty)
        # Count safety alerts for this delivery
        alerts = self.db.scalars(
            select(AISafetyAlert).where(AISafetyAlert.delivery_id == delivery_id)
        ).all()
        unresolved_alerts_count = sum(1 for a in alerts if not a.resolved)
        score += min(unresolved_alerts_count * 15.0, 30.0)

        # 3. Vehicle Idle Duration (Max 20 penalty)
        idle_duration = self.tracking_service.calculate_stop_duration(delivery_id)
        if idle_duration > 0:
            score += min(idle_duration * 0.5, 20.0)

        # 4. Document Verification Status (Max 15 penalty)
        if driver:
            docs = self.db.scalars(
                select(DriverDocument).where(DriverDocument.driver_id == driver.id)
            ).all()
            for doc in docs:
                if doc.verification_status == VerificationStatus.EXPIRED:
                    score += 10.0
                elif doc.verification_status == VerificationStatus.REJECTED:
                    score += 15.0
                elif doc.verification_status == VerificationStatus.PENDING:
                    score += 5.0

        # 5. Distance Remaining factor (Max 10 penalty)
        if delivery.distance_km > 100:
            score += 10.0
        elif delivery.distance_km > 50:
            score += 5.0

        # Cap score between 0 and 100
        score = min(max(score, 0.0), 100.0)

        # Risk Level Mapping
        if score < 30.0:
            level = "LOW"
        elif score < 60.0:
            level = "MEDIUM"
        elif score < 85.0:
            level = "HIGH"
        else:
            level = "CRITICAL"

        logger.info(
            "Risk Calculated",
            delivery_id=str(delivery_id),
            score=score,
            level=level,
        )

        return {"score": score, "level": level}
