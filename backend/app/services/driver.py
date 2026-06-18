import uuid
from collections.abc import Sequence
from sqlalchemy.orm import Session
from app.models.driver import Driver
from app.repositories.driver import DriverRepository
from app.schemas.driver import DriverCreate, DriverUpdate
from app.utils.exceptions import ValidationException, NotFoundException


class DriverService:
    """Business service orchestrator for Driver domain use cases."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = DriverRepository(db)

    def register_driver(self, schema: DriverCreate) -> Driver:
        """Validates duplicate details and registers a new driver."""
        if self.repo.filter(email=schema.email):
            raise ValidationException("A driver with this email already exists.")
        if self.repo.filter(phone=schema.phone):
            raise ValidationException("A driver with this phone number already exists.")

        try:
            db_obj = self.repo.create(schema)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except Exception as exc:
            self.db.rollback()
            raise exc

    def get_driver(self, id: uuid.UUID) -> Driver:
        """Retrieves a single driver record or raises a 404 error."""
        db_obj = self.repo.get_by_id(id)
        if not db_obj:
            raise NotFoundException(f"Driver with ID {id} not found.")
        return db_obj

    def list_drivers(self, skip: int = 0, limit: int = 100) -> Sequence[Driver]:
        """Lists driver profiles."""
        return self.repo.get_all(skip, limit)

    def update_driver(self, id: uuid.UUID, schema: DriverUpdate) -> Driver:
        """Validates uniqueness modifications and updates a driver."""
        db_obj = self.get_driver(id)

        if schema.email and schema.email != db_obj.email:
            if self.repo.filter(email=schema.email):
                raise ValidationException("A driver with this email already exists.")
        if schema.phone and schema.phone != db_obj.phone:
            if self.repo.filter(phone=schema.phone):
                raise ValidationException("A driver with this phone number already exists.")

        try:
            updated_obj = self.repo.update(id, schema)
            self.db.commit()
            if updated_obj:
                self.db.refresh(updated_obj)
            return updated_obj
        except Exception as exc:
            self.db.rollback()
            raise exc

    def delete_driver(self, id: uuid.UUID) -> bool:
        """Deletes a driver profile."""
        self.get_driver(id)  # Throws 404 if driver does not exist
        try:
            success = self.repo.delete(id)
            self.db.commit()
            return success
        except Exception as exc:
            self.db.rollback()
            raise exc
