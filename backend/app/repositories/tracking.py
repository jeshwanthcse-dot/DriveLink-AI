import uuid
from collections.abc import Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.tracking import TrackingLog
from app.schemas.tracking import TrackingLogCreate, TrackingLogUpdate


class TrackingRepository:
    """SQLAlchemy implementation of the Tracking Repository interface."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: TrackingLogCreate) -> TrackingLog:
        """Creates a new tracking log entry."""
        db_obj = TrackingLog(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()
        return db_obj

    def update(self, id: uuid.UUID, schema: TrackingLogUpdate) -> TrackingLog | None:
        """Updates an existing tracking log entry."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a tracking log entry."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> TrackingLog | None:
        """Retrieves a tracking log by its UUID."""
        return self.db.get(TrackingLog, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[TrackingLog]:
        """Retrieves all tracking logs with pagination."""
        stmt = select(TrackingLog).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[TrackingLog]:
        """Searches tracking logs by query (Not implemented)."""
        raise NotImplementedError("Search is not supported on tracking telemetry logs.")

    def filter(self, **kwargs) -> Sequence[TrackingLog]:
        """Filters tracking logs dynamically (e.g. by delivery_id)."""
        stmt = select(TrackingLog).filter_by(**kwargs).order_by(TrackingLog.recorded_at.asc())
        return self.db.scalars(stmt).all()
