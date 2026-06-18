import uuid
from collections.abc import Sequence
from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.repositories.organization import OrganizationRepository
from app.schemas.organization import OrganizationCreate, OrganizationUpdate
from app.utils.exceptions import ValidationException, NotFoundException


class OrganizationService:
    """Business service orchestrator for Organization domain use cases."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = OrganizationRepository(db)

    def register_organization(self, schema: OrganizationCreate) -> Organization:
        """Validates duplicate details and registers a new transport firm."""
        if self.repo.filter(email=schema.email):
            raise ValidationException("An organization with this email already exists.")

        try:
            db_obj = self.repo.create(schema)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except Exception as exc:
            self.db.rollback()
            raise exc

    def get_organization(self, id: uuid.UUID) -> Organization:
        """Retrieves a single organization profile or raises 404."""
        db_obj = self.repo.get_by_id(id)
        if not db_obj:
            raise NotFoundException(f"Organization with ID {id} not found.")
        return db_obj

    def list_organizations(self, skip: int = 0, limit: int = 100) -> Sequence[Organization]:
        """Lists registered organization profiles."""
        return self.repo.get_all(skip, limit)

    def update_organization(self, id: uuid.UUID, schema: OrganizationUpdate) -> Organization:
        """Validates profile email modification and updates organization details."""
        db_obj = self.get_organization(id)

        if schema.email and schema.email != db_obj.email:
            if self.repo.filter(email=schema.email):
                raise ValidationException("An organization with this email already exists.")

        try:
            updated_obj = self.repo.update(id, schema)
            self.db.commit()
            if updated_obj:
                self.db.refresh(updated_obj)
            return updated_obj
        except Exception as exc:
            self.db.rollback()
            raise exc
