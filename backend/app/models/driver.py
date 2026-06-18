import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.delivery import Delivery


class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    vehicle_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    vehicle_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    license_number: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    trust_score: Mapped[float] = mapped_column(Float, default=100.0)
    availability: Mapped[bool] = mapped_column(Boolean, default=True)
    verification_status: Mapped[str] = mapped_column(String(50), default="pending")
    
    # Telemetry and active tracking fields
    is_online: Mapped[bool] = mapped_column(Boolean, default=False)
    last_known_latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    last_known_longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    last_seen_at: Mapped[datetime.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Active delivery link
    current_delivery_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("deliveries.id", ondelete="SET NULL", use_alter=True, name="fk_driver_current_delivery"),
        nullable=True,
    )
    
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
    deliveries: Mapped[list["Delivery"]] = relationship(
        back_populates="driver", foreign_keys="[Delivery.driver_id]"
    )
    current_delivery: Mapped["Delivery | None"] = relationship(
        foreign_keys=[current_delivery_id], post_update=True
    )
    documents: Mapped[list["DriverDocument"]] = relationship(
        back_populates="driver", cascade="all, delete-orphan"
    )
