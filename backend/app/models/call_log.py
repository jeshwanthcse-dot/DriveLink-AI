import datetime
import uuid
from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class AICallLog(Base):
    __tablename__ = "ai_call_logs"

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
    call_type: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., safety_check, dispatch
    trigger_reason: Mapped[str] = mapped_column(String(500), nullable=False)
    call_status: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., completed, busy, no_answer
    driver_response: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    call_duration: Mapped[float | None] = mapped_column(Float, nullable=True)  # in seconds

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    # Relationships
    delivery: Mapped["Delivery"] = relationship(back_populates="call_logs")
