import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.driver import Driver
    from app.models.organization import Organization
    from app.models.tracking import TrackingLog
    from app.models.photo import DeliveryPhoto
    from app.models.rating import Rating
    from app.models.safety_alert import AISafetyAlert
    from app.models.call_log import AICallLog


class Delivery(Base):
    __tablename__ = "deliveries"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    driver_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("drivers.id", ondelete="SET NULL"), nullable=True
    )
    pickup_location: Mapped[str] = mapped_column(String(500), nullable=False)
    drop_location: Mapped[str] = mapped_column(String(500), nullable=False)
    cargo_type: Mapped[str] = mapped_column(String(255), nullable=False)
    priority: Mapped[str] = mapped_column(String(50), default="medium")
    status: Mapped[str] = mapped_column(String(50), default="pending")
    distance_km: Mapped[float] = mapped_column(Float, default=0.0)
    estimated_duration: Mapped[float] = mapped_column(Float, default=0.0)  # in minutes

    # Delivery progress tracking fields
    proof_photo_uploaded: Mapped[bool] = mapped_column(Boolean, default=False)
    pickup_time: Mapped[datetime.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    delivery_time: Mapped[datetime.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_location_update: Mapped[datetime.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="deliveries")
    driver: Mapped["Driver | None"] = relationship(
        back_populates="deliveries", foreign_keys=[driver_id]
    )
    
    tracking_logs: Mapped[list["TrackingLog"]] = relationship(
        back_populates="delivery", cascade="all, delete-orphan"
    )
    photos: Mapped[list["DeliveryPhoto"]] = relationship(
        back_populates="delivery", cascade="all, delete-orphan"
    )
    ratings: Mapped[list["Rating"]] = relationship(
        back_populates="delivery", cascade="all, delete-orphan"
    )
    safety_alerts: Mapped[list["AISafetyAlert"]] = relationship(
        back_populates="delivery", cascade="all, delete-orphan"
    )
    call_logs: Mapped[list["AICallLog"]] = relationship(
        back_populates="delivery", cascade="all, delete-orphan"
    )
