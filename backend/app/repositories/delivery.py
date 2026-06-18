import uuid
from collections.abc import Sequence
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from app.models.delivery import Delivery
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate


class DeliveryRepository:
    """SQLAlchemy implementation of the Delivery Repository interface."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, schema: DeliveryCreate) -> Delivery:
        """Creates a new delivery request."""
        db_obj = Delivery(**schema.model_dump())
        self.db.add(db_obj)
        self.db.flush()
        return db_obj

    def update(self, id: uuid.UUID, schema: DeliveryUpdate) -> Delivery | None:
        """Updates an existing delivery record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        self.db.flush()
        return db_obj

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a delivery record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.flush()
        return True

    def get_by_id(self, id: uuid.UUID) -> Delivery | None:
        """Retrieves a delivery by its UUID."""
        return self.db.get(Delivery, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Delivery]:
        """Retrieves all delivery requests with pagination."""
        stmt = select(Delivery).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def search(self, query: str) -> Sequence[Delivery]:
        """Searches delivery records by pickup/drop locations, cargo, or status (case-insensitive)."""
        stmt = select(Delivery).where(
            or_(
                Delivery.pickup_location.ilike(f"%{query}%"),
                Delivery.drop_location.ilike(f"%{query}%"),
                Delivery.cargo_type.ilike(f"%{query}%"),
                Delivery.status.ilike(f"%{query}%"),
            )
        )
        return self.db.scalars(stmt).all()

    def filter(self, **kwargs) -> Sequence[Delivery]:
        """Filters deliveries by arbitrary keywords (e.g., driver_id, status)."""
        stmt = select(Delivery).filter_by(**kwargs)
        return self.db.scalars(stmt).all()
