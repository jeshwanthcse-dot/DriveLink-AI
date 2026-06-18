import uuid
from collections.abc import Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.call_log import AICallLog
from app.schemas.call_log import AICallLogCreate, AICallLogUpdate


class CallLogRepository:
    """SQLAlchemy implementation of the Call Log Repository interface."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: AICallLogCreate) -> AICallLog:
        """Creates a new call log record."""
        db_obj = AICallLog(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()
        return db_obj

    def update(self, id: uuid.UUID, schema: AICallLogUpdate) -> AICallLog | None:
        """Updates an existing call log record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a call log record from database."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> AICallLog | None:
        """Retrieves a call log by its UUID."""
        return self.db.get(AICallLog, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[AICallLog]:
        """Retrieves all call logs with pagination."""
        stmt = select(AICallLog).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[AICallLog]:
        """Searches call logs by trigger reason text."""
        stmt = select(AICallLog).where(AICallLog.trigger_reason.ilike(f"%{query}%"))
        return self.db.scalars(stmt).all()

    def filter(self, **kwargs) -> Sequence[AICallLog]:
        """Filters call logs by custom keywords."""
        stmt = select(AICallLog).filter_by(**kwargs)
        return self.db.scalars(stmt).all()
