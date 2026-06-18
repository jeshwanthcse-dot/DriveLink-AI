import uuid
from collections.abc import Sequence
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class OrganizationRepository:
    """SQLAlchemy implementation of the Organization Repository interface."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: OrganizationCreate) -> Organization:
        """Creates a new organization record."""
        db_obj = Organization(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()
        return db_obj

    def update(self, id: uuid.UUID, schema: OrganizationUpdate) -> Organization | None:
        """Updates an existing organization record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes an organization record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> Organization | None:
        """Retrieves an organization by its UUID."""
        return self.db.get(Organization, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Organization]:
        """Retrieves all organizations with pagination."""
        stmt = select(Organization).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[Organization]:
        """Searches organization records by name, contact, or email (case-insensitive)."""
        stmt = select(Organization).where(
            or_(
                Organization.company_name.ilike(f"%{query}%"),
                Organization.contact_person.ilike(f"%{query}%"),
                Organization.email.ilike(f"%{query}%"),
            )
        )
        return self.db.scalars(stmt).all()

    def filter(self, **kwargs) -> Sequence[Organization]:
        """Filters organizations by arbitrary keywords."""
        stmt = select(Organization).filter_by(**kwargs)
        return self.db.scalars(stmt).all()
