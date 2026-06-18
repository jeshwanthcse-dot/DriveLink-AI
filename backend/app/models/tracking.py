import datetime
import uuid
from sqlalchemy import DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class TrackingLog(Base):
    __tablename__ = "tracking_logs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    delivery_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("deliveries.id", ondelete="CASCADE"), nullable=False
    )
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    speed: Mapped[float] = mapped_column(Float, default=0.0)
    heading: Mapped[float | None] = mapped_column(Float, nullable=True)
    accuracy: Mapped[float | None] = mapped_column(Float, nullable=True)
    
    recorded_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    # Relationships
    delivery: Mapped["Delivery"] = relationship(back_populates="tracking_logs")
