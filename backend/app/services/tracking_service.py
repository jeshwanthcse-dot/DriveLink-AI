import datetime
import math
import uuid
import structlog
from typing import Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.tracking import TrackingLog
from app.models.driver import Driver
from app.models.delivery import Delivery
from app.repositories.tracking import TrackingRepository
from app.repositories.driver import DriverRepository
from app.repositories.delivery import DeliveryRepository
from app.schemas.tracking import TrackingLogCreate
from app.schemas.driver import DriverUpdate
from app.utils.exceptions import NotFoundException

logger = structlog.get_logger("app.services.tracking_service")


class TrackingService:
    """Business service orchestrator for live tracking telemetry and logs (Sprint 14)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = TrackingRepository(db)
        self.driver_repo = DriverRepository(db)
        self.delivery_repo = DeliveryRepository(db)

    def save_location(
        self,
        driver_id: uuid.UUID,
        delivery_id: uuid.UUID,
        latitude: float,
        longitude: float,
        speed: float,
        timestamp: datetime.datetime,
    ) -> TrackingLog:
        """Saves a new GPS ping, updates driver location telemetry, and emits structlog audits."""
        logger.info(
            "GPS Received",
            driver_id=str(driver_id),
            delivery_id=str(delivery_id),
            latitude=latitude,
            longitude=longitude,
            speed=speed,
        )

        delivery = self.delivery_repo.get_by_id(delivery_id)
        if not delivery:
            raise NotFoundException(f"Delivery with ID {delivery_id} not found.")

        # Create tracking log entry
        schema = TrackingLogCreate(
            delivery_id=delivery_id,
            latitude=latitude,
            longitude=longitude,
            speed=speed,
        )
        tracking_log = self.repo.create(schema)
        # Override recorded_at with the payload's timestamp
        tracking_log.recorded_at = timestamp

        # Update driver live position
        self.driver_repo.update(
            driver_id,
            DriverUpdate(
                last_known_latitude=latitude,
                last_known_longitude=longitude,
                last_seen_at=timestamp,
            ),
        )

        self.db.commit()
        self.db.refresh(tracking_log)

        logger.info(
            "Tracking Updated",
            driver_id=str(driver_id),
            delivery_id=str(delivery_id),
        )
        return tracking_log

    def get_latest_location(self, delivery_id: uuid.UUID) -> TrackingLog | None:
        """Retrieves the most recent GPS ping log for a delivery."""
        logs = self.repo.filter(delivery_id=delivery_id)
        if not logs:
            return None
        return logs[-1]

    def get_driver_history(self, driver_id: uuid.UUID) -> Sequence[TrackingLog]:
        """Retrieves historical tracking coordinates for all active/previous deliveries of the driver."""
        # Find all deliveries assigned to this driver
        deliveries = self.db.scalars(
            select(Delivery).where(Delivery.driver_id == driver_id)
        ).all()
        
        delivery_ids = [d.id for d in deliveries]
        if not delivery_ids:
            return []

        # Return tracking logs associated with those delivery IDs
        stmt = (
            select(TrackingLog)
            .where(TrackingLog.delivery_id.in_(delivery_ids))
            .order_by(TrackingLog.recorded_at.asc())
        )
        return self.db.scalars(stmt).all()

    def calculate_stop_duration(self, delivery_id: uuid.UUID) -> float:
        """Calculates stop duration in minutes for the vehicle on a delivery."""
        logs = self.db.scalars(
            select(TrackingLog)
            .where(TrackingLog.delivery_id == delivery_id)
            .order_by(TrackingLog.recorded_at.desc())
        ).all()

        if not logs:
            return 0.0

        latest_log = logs[0]
        if latest_log.speed >= 3.0:
            return 0.0

        stop_start_time = latest_log.recorded_at

        # Trace backwards to locate the point when the vehicle stopped moving
        for log in logs[1:]:
            dist = self.calculate_distance(
                latest_log.latitude, latest_log.longitude, log.latitude, log.longitude
            )
            # Threshold: speed < 3 kmph and distance within same area (50 meters)
            if log.speed < 3.0 and dist < 0.05:
                stop_start_time = log.recorded_at
            else:
                break

        duration = (latest_log.recorded_at - stop_start_time).total_seconds() / 60.0
        return duration

    def detect_idle_vehicle(self, delivery_id: uuid.UUID) -> bool:
        """Returns True if the vehicle has been stopped/idle for > 20 minutes."""
        duration = self.calculate_stop_duration(delivery_id)
        return duration > 20.0

    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates distance in kilometers between two GPS points using the Haversine formula."""
        R = 6371.0  # Earth's radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c
