import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.controllers.notification import NotificationController
from app.database.database import get_db

router = APIRouter(prefix="/notifications", tags=["notifications"])


def get_notification_controller(db: Session = Depends(get_db)) -> NotificationController:
    """Dependency injection helper to load NotificationController."""
    return NotificationController(db)


@router.get("")
async def list_notifications(
    skip: int = 0,
    limit: int = 100,
    organization_id: uuid.UUID | None = None,
    is_read: bool | None = None,
    controller: NotificationController = Depends(get_notification_controller),
) -> JSONResponse:
    """Lists notification records, supporting pagination and organization filtering."""
    return controller.list_notifications(
        skip=skip,
        limit=limit,
        organization_id=organization_id,
        is_read=is_read,
    )


@router.patch("/{id}/read")
async def mark_as_read(
    id: uuid.UUID,
    controller: NotificationController = Depends(get_notification_controller),
) -> JSONResponse:
    """Marks a single notification alert as read."""
    return controller.mark_as_read(id)
