import uuid
from collections.abc import Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.document import DriverDocument
from app.schemas.document import DriverDocumentCreate, DriverDocumentUpdate


class DocumentRepository:
    """SQLAlchemy implementation of the Driver Document Repository."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: DriverDocumentCreate) -> DriverDocument:
        """Creates a new driver document record in the data store."""
        db_obj = DriverDocument(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()
        return db_obj

    def update(self, id: uuid.UUID, schema: DriverDocumentUpdate) -> DriverDocument | None:
        """Updates an existing driver document record in the data store."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None
        
        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)
        
        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a driver document record from the data store."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False
        
        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> DriverDocument | None:
        """Retrieves a driver document record by its unique identifier."""
        return self.db.get(DriverDocument, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[DriverDocument]:
        """Retrieves a list of driver document records with pagination."""
        stmt = select(DriverDocument).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[DriverDocument]:
        """Searches driver document records by document type, status etc."""
        stmt = select(DriverDocument).where(
            DriverDocument.document_number.ilike(f"%{query}%")
        )
        return self.db.scalars(stmt).all()

    def filter(self, **kwargs) -> Sequence[DriverDocument]:
        """Filters driver document records dynamically (e.g. filter by driver_id)."""
        stmt = select(DriverDocument).filter_by(**kwargs)
        return self.db.scalars(stmt).all()

