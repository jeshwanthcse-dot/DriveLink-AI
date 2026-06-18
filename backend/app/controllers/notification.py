import uuid
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.schemas.notification import NotificationResponse
from app.services.notification import NotificationService
from app.utils.response import success_response


class NotificationController:
    """Controller layer handling HTTP-to-domain coordination for Notification actions."""

    def __init__(self, db: Session) -> None:
        self.service = NotificationService(db)

    def list_notifications(
        self,
        skip: int = 0,
        limit: int = 100,
        organization_id: uuid.UUID | None = None,
        is_read: bool | None = None,
    ) -> JSONResponse:
        """Retrieves and returns notifications (with optional pagination, firm ID and read/unread status)."""
        notifications = self.service.list_notifications(
            skip=skip,
            limit=limit,
            organization_id=organization_id,
            is_read=is_read,
        )
        response_data = [NotificationResponse.model_validate(n).model_dump() for n in notifications]
        return success_response(
            message="Notifications list retrieved successfully",
            data=response_data,
        )

    def mark_as_read(self, id: uuid.UUID) -> JSONResponse:
        """Invokes mark-as-read service and returns updated status detail."""
        notification = self.service.mark_as_read(id)
        response_schema = NotificationResponse.model_validate(notification)
        return success_response(
            message="Notification marked as read successfully",
            data=response_schema.model_dump(),
        )
