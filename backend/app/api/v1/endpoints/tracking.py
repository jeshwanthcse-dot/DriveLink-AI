import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.controllers.tracking import TrackingController
from app.database.database import get_db
from app.schemas.tracking import TrackingLogCreate, LiveTrackingPayload

router = APIRouter(prefix="/tracking", tags=["tracking"])


def get_tracking_controller(db: Session = Depends(get_db)) -> TrackingController:
    """Dependency injection helper to load TrackingController."""
    return TrackingController(db)


@router.post("/location", status_code=201)
async def record_location(
    schema: TrackingLogCreate,
    controller: TrackingController = Depends(get_tracking_controller),
) -> JSONResponse:
    """Logs a new GPS position ping for a delivery, updating driver status and delivery timestamps."""
    return controller.record_location(schema)


@router.post("/live", status_code=201)
async def record_live_location(
    payload: LiveTrackingPayload,
    controller: TrackingController = Depends(get_tracking_controller),
) -> JSONResponse:
    """Logs driver live GPS ping telemetry for Sprint 14."""
    return controller.record_live_location(payload)


@router.get("/live/{delivery_id}")
async def get_live_location(
    delivery_id: uuid.UUID,
    controller: TrackingController = Depends(get_tracking_controller),
) -> JSONResponse:
    """Gets the most recently recorded live location coordinates for a delivery."""
    return controller.get_live_location(delivery_id)


@router.get("/history/{delivery_id}")
async def get_tracking_history(
    delivery_id: uuid.UUID,
    controller: TrackingController = Depends(get_tracking_controller),
) -> JSONResponse:
    """Gets all historical route path pings logged for a delivery."""
    return controller.get_tracking_history(delivery_id)

