import uuid
import datetime
import structlog
from typing import Sequence
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.models.safety_alert import AISafetyAlert
from app.models.call_log import AICallLog
from app.repositories.safety import SafetyRepository
from app.schemas.safety_alert import AISafetyAlertUpdate
from app.utils.exceptions import NotFoundException

logger = structlog.get_logger("app.services.safety_service")


class SafetyService:
    """Service layer coordinating Safety Alerts querying, closure, and statistics compilation (Sprint 14)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = SafetyRepository(db)

    def list_alerts(self, skip: int = 0, limit: int = 100) -> Sequence[AISafetyAlert]:
        """Lists safety alert logs with pagination."""
        return self.repo.get_all(skip, limit)

    def get_alert_by_id(self, alert_id: uuid.UUID) -> AISafetyAlert:
        """Retrieves details of a specific safety alert, raising 404 if not found."""
        alert = self.repo.get_by_id(alert_id)
        if not alert:
            raise NotFoundException(f"Safety alert with ID {alert_id} not found.")
        return alert

    def close_alert(self, alert_id: uuid.UUID) -> AISafetyAlert:
        """Resolves/closes an active safety alert and registers closing audit log."""
        alert = self.get_alert_by_id(alert_id)
        
        # Update resolved status
        updated = self.repo.update(
            alert_id,
            AISafetyAlertUpdate(resolved=True, ivr_status="RESOLVED")
        )
        self.db.commit()
        self.db.refresh(updated)

        logger.info(
            "Alert Closed",
            alert_id=str(alert_id),
            driver_id=str(alert.driver_id),
        )
        return updated

    def get_statistics(self) -> dict:
        """Compiles analytical aggregates for the organization safety dashboard."""
        total_alerts = self.db.scalar(select(func.count(AISafetyAlert.id)))
        active_alerts = self.db.scalar(select(func.count(AISafetyAlert.id)).where(AISafetyAlert.resolved == False))
        resolved_alerts = self.db.scalar(select(func.count(AISafetyAlert.id)).where(AISafetyAlert.resolved == True))
        
        emergency_alerts = self.db.scalar(select(func.count(AISafetyAlert.id)).where(AISafetyAlert.ivr_status == "EMERGENCY"))
        breakdown_alerts = self.db.scalar(select(func.count(AISafetyAlert.id)).where(AISafetyAlert.ivr_status == "BREAKDOWN"))
        
        total_ivr_calls = self.db.scalar(
            select(func.count(AICallLog.id)).where(AICallLog.call_type == "safety_check")
        )

        # Average response time calculation for resolved safety alerts
        resolved_list = self.db.scalars(
            select(AISafetyAlert).where(AISafetyAlert.resolved == True)
        ).all()
        
        total_response_time = 0.0
        resolved_count = len(resolved_list)
        for a in resolved_list:
            dt = (a.created_at - a.trigger_time).total_seconds()
            total_response_time += max(dt, 0.0)

        avg_response = 0.0
        if resolved_count > 0:
            avg_response = total_response_time / resolved_count

        return {
            "total_alerts": total_alerts or 0,
            "active_alerts": active_alerts or 0,
            "resolved_alerts": resolved_alerts or 0,
            "emergency_alerts": emergency_alerts or 0,
            "breakdown_alerts": breakdown_alerts or 0,
            "avg_response_time_seconds": avg_response,
            "total_ivr_calls": total_ivr_calls or 0,
        }
