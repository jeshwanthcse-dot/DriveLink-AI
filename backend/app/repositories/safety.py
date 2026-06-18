import uuid
from collections.abc import Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.safety_alert import AISafetyAlert
from app.schemas.safety_alert import AISafetyAlertCreate, AISafetyAlertUpdate


class SafetyRepository:
    """SQLAlchemy implementation of the Safety Alert Repository interface."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: AISafetyAlertCreate) -> AISafetyAlert:
        """Creates a new safety alert record."""
        db_obj = AISafetyAlert(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()
        return db_obj

    def update(self, id: uuid.UUID, schema: AISafetyAlertUpdate) -> AISafetyAlert | None:
        """Updates an existing safety alert record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a safety alert record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> AISafetyAlert | None:
        """Retrieves a safety alert by its UUID."""
        return self.db.get(AISafetyAlert, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[AISafetyAlert]:
        """Retrieves all safety alerts with pagination."""
        stmt = select(AISafetyAlert).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[AISafetyAlert]:
        """Searches safety alerts by trigger reason text."""
        stmt = select(AISafetyAlert).where(AISafetyAlert.trigger_reason.ilike(f"%{query}%"))
        return self.db.scalars(stmt).all()

    def filter(self, **kwargs) -> Sequence[AISafetyAlert]:
        """Filters safety alerts by custom keywords."""
        stmt = select(AISafetyAlert).filter_by(**kwargs)
        return self.db.scalars(stmt).all()
