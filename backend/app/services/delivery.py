import datetime
import uuid
from collections.abc import Sequence
from sqlalchemy.orm import Session
from app.models.delivery import Delivery
from app.models.enums import DeliveryStatus
from app.repositories.delivery import DeliveryRepository
from app.repositories.driver import DriverRepository
from app.repositories.organization import OrganizationRepository
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate
from app.utils.exceptions import ValidationException, NotFoundException


class DeliveryService:
    """Business service orchestrator for Delivery domain use cases."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = DeliveryRepository(db)
        self.org_repo = OrganizationRepository(db)
        self.driver_repo = DriverRepository(db)

    def create_delivery(self, schema: DeliveryCreate) -> Delivery:
        """Validates organization and driver references before creating a delivery request."""
        if not self.org_repo.get_by_id(schema.organization_id):
            raise NotFoundException(f"Organization with ID {schema.organization_id} not found.")

        if schema.driver_id and not self.driver_repo.get_by_id(schema.driver_id):
            raise NotFoundException(f"Driver with ID {schema.driver_id} not found.")

        try:
            db_obj = self.repo.create(schema)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except Exception as exc:
            self.db.rollback()
            raise exc

    def get_delivery(self, id: uuid.UUID) -> Delivery:
        """Retrieves a single delivery request or raises 404."""
        db_obj = self.repo.get_by_id(id)
        if not db_obj:
            raise NotFoundException(f"Delivery with ID {id} not found.")
        return db_obj

    def list_deliveries(self, skip: int = 0, limit: int = 100, **filters) -> Sequence[Delivery]:
        """Lists deliveries with pagination and dynamic filters."""
        clean_filters = {k: v for k, v in filters.items() if v is not None}
        if clean_filters:
            return self.repo.filter(**clean_filters)
        return self.repo.get_all(skip, limit)

    def update_delivery(self, id: uuid.UUID, schema: DeliveryUpdate) -> Delivery:
        """Updates delivery details validating any altered firm/driver ID links."""
        db_obj = self.get_delivery(id)

        if schema.organization_id and schema.organization_id != db_obj.organization_id:
            if not self.org_repo.get_by_id(schema.organization_id):
                raise NotFoundException(f"Organization with ID {schema.organization_id} not found.")

        if schema.driver_id and schema.driver_id != db_obj.driver_id:
            if not self.driver_repo.get_by_id(schema.driver_id):
                raise NotFoundException(f"Driver with ID {schema.driver_id} not found.")

        try:
            updated_obj = self.repo.update(id, schema)
            self.db.commit()
            if updated_obj:
                self.db.refresh(updated_obj)
            return updated_obj
        except Exception as exc:
            self.db.rollback()
            raise exc

    def update_delivery_status(self, id: uuid.UUID, status: str) -> Delivery:
        """Validates and transitions delivery status, recording time checkpoints."""
        db_obj = self.get_delivery(id)

        # Enforce uppercase match matching enums
        normalized_status = status.upper()
        try:
            status_enum = DeliveryStatus(normalized_status)
        except ValueError:
            allowed_statuses = [item.value for item in DeliveryStatus]
            raise ValidationException(
                f"Invalid delivery status: {status}. Allowed values: {allowed_statuses}"
            )

        update_fields = {"status": status_enum.value}
        utc_now = datetime.datetime.now(datetime.timezone.utc)

        if status_enum == DeliveryStatus.IN_TRANSIT:
            update_fields["pickup_time"] = utc_now
        elif status_enum == DeliveryStatus.COMPLETED:
            update_fields["delivery_time"] = utc_now

        update_schema = DeliveryUpdate(**update_fields)

        try:
            updated_obj = self.repo.update(id, update_schema)
            self.db.commit()
            if updated_obj:
                self.db.refresh(updated_obj)
            return updated_obj
        except Exception as exc:
            self.db.rollback()
            raise exc
