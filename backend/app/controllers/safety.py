import uuid
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.services.safety_service import SafetyService
from app.utils.response import success_response
from app.schemas.safety_alert import AISafetyAlertResponse


class SafetyController:
    """Controller layer handling HTTP-to-domain coordination for Safety Alerts/Statistics operations."""

    def __init__(self, db: Session) -> None:
        self.service = SafetyService(db)

    def list_alerts(self, skip: int = 0, limit: int = 100) -> JSONResponse:
        """Retrieves safety alerts and returns JSON success response."""
        alerts = self.service.list_alerts(skip, limit)
        response_data = [
            AISafetyAlertResponse.model_validate(a).model_dump(mode="json")
            for a in alerts
        ]
        return success_response(
            message="Safety alerts retrieved successfully",
            data=response_data,
        )

    def get_alert_by_id(self, alert_id: uuid.UUID) -> JSONResponse:
        """Retrieves details of a specific safety alert by UUID."""
        alert = self.service.get_alert_by_id(alert_id)
        response_schema = AISafetyAlertResponse.model_validate(alert)
        return success_response(
            message="Safety alert retrieved successfully",
            data=response_schema.model_dump(mode="json"),
        )

    def close_alert(self, alert_id: uuid.UUID) -> JSONResponse:
        """Closes an active safety alert."""
        alert = self.service.close_alert(alert_id)
        response_schema = AISafetyAlertResponse.model_validate(alert)
        return success_response(
            message="Safety alert closed and resolved successfully",
            data=response_schema.model_dump(mode="json"),
        )

    def get_statistics(self) -> JSONResponse:
        """Compiles safety metrics."""
        stats = self.service.get_statistics()
        return success_response(
            message="Safety statistics compiled successfully",
            data=stats,
        )
