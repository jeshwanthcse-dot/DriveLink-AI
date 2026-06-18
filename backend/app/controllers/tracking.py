import uuid
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.schemas.tracking import TrackingLogCreate, TrackingLogResponse, LiveTrackingPayload
from app.services.tracking import TrackingService
from app.utils.response import success_response


class TrackingController:
    """Controller layer handling HTTP-to-domain coordination for Tracking/GPS actions."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.service = TrackingService(db)

    def record_location(self, schema: TrackingLogCreate) -> JSONResponse:
        """Invokes telemetry recording and returns success payload with code 201."""
        log = self.service.record_location(schema)
        response_schema = TrackingLogResponse.model_validate(log)
        return success_response(
            message="Location recorded successfully",
            data=response_schema.model_dump(),
            status_code=201,
        )

    def record_live_location(self, payload: LiveTrackingPayload) -> JSONResponse:
        """Invokes Sprint 14 telemetry recording and returns success response."""
        from app.services.tracking_service import TrackingService as TrackingServiceV14
        service = TrackingServiceV14(self.db)
        log = service.save_location(
            driver_id=payload.driver_id,
            delivery_id=payload.delivery_id,
            latitude=payload.latitude,
            longitude=payload.longitude,
            speed=payload.speed,
            timestamp=payload.timestamp,
        )
        response_schema = TrackingLogResponse.model_validate(log)
        return success_response(
            message="Live location recorded successfully",
            data=response_schema.model_dump(),
            status_code=201,
        )

    def get_live_location(self, delivery_id: uuid.UUID) -> JSONResponse:
        """Retrieves and returns the latest coordinates payload for a delivery."""
        log = self.service.get_live_location(delivery_id)
        if not log:
            return success_response(
                message="No tracking location recorded yet for this delivery",
                data=None,
            )

        response_schema = TrackingLogResponse.model_validate(log)
        return success_response(
            message="Live location retrieved successfully",
            data=response_schema.model_dump(),
        )

    def get_tracking_history(self, delivery_id: uuid.UUID) -> JSONResponse:
        """Retrieves and returns full telemetry path history for a delivery."""
        logs = self.service.get_tracking_history(delivery_id)
        response_data = [TrackingLogResponse.model_validate(l).model_dump() for l in logs]
        return success_response(
            message="Tracking history retrieved successfully",
            data=response_data,
        )

