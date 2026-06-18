import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.controllers.safety import SafetyController
from app.database.database import get_db

router = APIRouter(prefix="/safety", tags=["safety"])


def get_safety_controller(db: Session = Depends(get_db)) -> SafetyController:
    """Dependency injection helper to load SafetyController."""
    return SafetyController(db)


@router.get("/alerts")
async def list_alerts(
    skip: int = 0,
    limit: int = 100,
    controller: SafetyController = Depends(get_safety_controller),
) -> JSONResponse:
    """Lists safety alerts logged on the platform with pagination."""
    return controller.list_alerts(skip, limit)


@router.get("/alerts/{id}")
async def get_alert(
    id: uuid.UUID,
    controller: SafetyController = Depends(get_safety_controller),
) -> JSONResponse:
    """Retrieves standard safety alert details by UUID."""
    return controller.get_alert_by_id(id)


@router.patch("/alerts/{id}/close")
async def close_alert(
    id: uuid.UUID,
    controller: SafetyController = Depends(get_safety_controller),
) -> JSONResponse:
    """Resolves and closes an active safety alert."""
    return controller.close_alert(id)


@router.get("/statistics")
async def get_statistics(
    controller: SafetyController = Depends(get_safety_controller),
) -> JSONResponse:
    """Retrieves analytical safety statistics."""
    return controller.get_statistics()
