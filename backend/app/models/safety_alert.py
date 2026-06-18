import datetime
import uuid
from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class AISafetyAlert(Base):
    __tablename__ = "ai_safety_alerts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    delivery_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("deliveries.id", ondelete="CASCADE"), nullable=False
    )
    driver_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    trigger_reason: Mapped[str] = mapped_column(String(500), nullable=False)
    trigger_time: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )
    ivr_status: Mapped[str] = mapped_column(String(100), default="initiated")
    driver_response: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    # Relationships
    delivery: Mapped["Delivery"] = relationship(back_populates="safety_alerts")
