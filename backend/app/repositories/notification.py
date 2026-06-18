import uuid
from collections.abc import Sequence
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate


class NotificationRepository:
    """SQLAlchemy implementation of the Notification Repository interface."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: NotificationCreate) -> Notification:
        """Creates a new notification record."""
        db_obj = Notification(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()
        return db_obj

    def update(self, id: uuid.UUID, schema: NotificationUpdate) -> Notification | None:
        """Updates an existing notification record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a notification record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> Notification | None:
        """Retrieves a notification by its UUID."""
        return self.db.get(Notification, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Notification]:
        """Retrieves all notifications with pagination."""
        stmt = select(Notification).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[Notification]:
        """Searches notification records by title, type, or message (case-insensitive)."""
        stmt = select(Notification).where(
            or_(
                Notification.title.ilike(f"%{query}%"),
                Notification.message.ilike(f"%{query}%"),
                Notification.type.ilike(f"%{query}%"),
            )
        )
        return self.db.scalars(stmt).all()

    def filter(self, **kwargs) -> Sequence[Notification]:
        """Filters notifications by arbitrary keywords (e.g., organization_id, is_read)."""
        stmt = select(Notification).filter_by(**kwargs).order_by(Notification.created_at.desc())
        return self.db.scalars(stmt).all()
