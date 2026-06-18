import datetime
import uuid
from collections.abc import Sequence
from sqlalchemy.orm import Session
from app.models.tracking import TrackingLog
from app.models.enums import DeliveryStatus
from app.repositories.delivery import DeliveryRepository
from app.repositories.driver import DriverRepository
from app.repositories.tracking import TrackingRepository
from app.schemas.delivery import DeliveryUpdate
from app.schemas.driver import DriverUpdate
from app.schemas.tracking import TrackingLogCreate
from app.utils.exceptions import ValidationException, NotFoundException


class TrackingService:
    """Business service orchestrator for live tracking telemetry and logs."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = TrackingRepository(db)
        self.delivery_repo = DeliveryRepository(db)
        self.driver_repo = DriverRepository(db)

    def record_location(self, schema: TrackingLogCreate) -> TrackingLog:
        """Saves a new GPS ping, validating active delivery and updating driver/delivery states."""
        delivery = self.delivery_repo.get_by_id(schema.delivery_id)
        if not delivery:
            raise NotFoundException(f"Delivery with ID {schema.delivery_id} not found.")

        # Block GPS tracking updates on finalized deliveries
        if delivery.status in [DeliveryStatus.COMPLETED.value, DeliveryStatus.CANCELLED.value]:
            raise ValidationException(
                f"Cannot log coordinates for finalized delivery (Status: {delivery.status})."
            )

        try:
            # Save tracking log
            tracking_log = self.repo.create(schema)

            utc_now = datetime.datetime.now(datetime.timezone.utc)
            # Update delivery location audit timestamp
            self.delivery_repo.update(
                delivery.id,
                DeliveryUpdate(last_location_update=utc_now)
            )

            # Update driver's live position telemetry if a driver is assigned
            if delivery.driver_id:
                self.driver_repo.update(
                    delivery.driver_id,
                    DriverUpdate(
                        last_known_latitude=schema.latitude,
                        last_known_longitude=schema.longitude,
                        last_seen_at=utc_now,
                    )
                )

            self.db.commit()
            self.db.refresh(tracking_log)
            return tracking_log
        except Exception as exc:
            self.db.rollback()
            raise exc

    def get_live_location(self, delivery_id: uuid.UUID) -> TrackingLog | None:
        """Retrieves the most recent GPS ping log for a delivery."""
        delivery = self.delivery_repo.get_by_id(delivery_id)
        if not delivery:
            raise NotFoundException(f"Delivery with ID {delivery_id} not found.")

        logs = self.repo.filter(delivery_id=delivery_id)
        if not logs:
            return None
        # Return the last item in the ascending log history list
        return logs[-1]

    def get_tracking_history(self, delivery_id: uuid.UUID) -> Sequence[TrackingLog]:
        """Retrieves all telemetry coordinates logged for a delivery."""
        delivery = self.delivery_repo.get_by_id(delivery_id)
        if not delivery:
            raise NotFoundException(f"Delivery with ID {delivery_id} not found.")

        return self.repo.filter(delivery_id=delivery_id)
