import uuid
from collections.abc import Sequence
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.repositories.notification import NotificationRepository
from app.schemas.notification import NotificationUpdate
from app.utils.exceptions import NotFoundException


class NotificationService:
    """Business service orchestrator for Notification domain use cases."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = NotificationRepository(db)

    def list_notifications(self, skip: int = 0, limit: int = 100, **filters) -> Sequence[Notification]:
        """Lists notification records matching optional filter conditions."""
        clean_filters = {k: v for k, v in filters.items() if v is not None}
        if clean_filters:
            return self.repo.filter(**clean_filters)
        return self.repo.get_all(skip, limit)

    def mark_as_read(self, id: uuid.UUID) -> Notification:
        """Sets is_read state to True on a notification and commits transaction."""
        db_obj = self.repo.get_by_id(id)
        if not db_obj:
            raise NotFoundException(f"Notification with ID {id} not found.")

        try:
            updated_obj = self.repo.update(id, NotificationUpdate(is_read=True))
            self.db.commit()
            if updated_obj:
                self.db.refresh(updated_obj)
            return updated_obj
        except Exception as exc:
            self.db.rollback()
            raise exc
