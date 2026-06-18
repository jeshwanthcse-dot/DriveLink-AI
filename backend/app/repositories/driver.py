import uuid
from collections.abc import Sequence
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate


class DriverRepository:
    """SQLAlchemy implementation of the Driver Repository interface."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: DriverCreate) -> Driver:
        """Creates a new driver record."""
        db_obj = Driver(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()  # Flushes to DB context (Transaction committed at service tier)
        return db_obj

    def update(self, id: uuid.UUID, schema: DriverUpdate) -> Driver | None:
        """Updates an existing driver record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None
        
        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)
        
        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a driver record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False
        
        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> Driver | None:
        """Retrieves a driver by its UUID."""
        return self.db.get(Driver, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Driver]:
        """Retrieves all drivers with pagination."""
        stmt = select(Driver).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[Driver]:
        """Searches driver records by name, email, or phone (case-insensitive)."""
        stmt = select(Driver).where(
            or_(
                Driver.full_name.ilike(f"%{query}%"),
                Driver.email.ilike(f"%{query}%"),
                Driver.phone.ilike(f"%{query}%"),
            )
        )
        return self.db.scalars(stmt).all()

    def filter(self, **kwargs) -> Sequence[Driver]:
        """Filters drivers by arbitrary keywords."""
        stmt = select(Driver).filter_by(**kwargs)
        return self.db.scalars(stmt).all()
