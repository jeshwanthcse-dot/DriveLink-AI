import datetime
import uuid
from sqlalchemy import DateTime, Enum, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.models.enums import DocumentType, VerificationStatus


class DriverDocument(Base):
    __tablename__ = "driver_documents"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    driver_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False
    )
    # Extracted document registration identifier (e.g. License ID, Aadhaar number)
    document_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    # Using SQLAlchemy Enum to enforce domain boundaries in DB
    document_type: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType, name="documenttype_enum"), nullable=False
    )
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, name="verificationstatus_enum"),
        default=VerificationStatus.PENDING,
        nullable=False,
    )
    document_url: Mapped[str] = mapped_column(String(500), nullable=False)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    expiry_date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    # Relationships
    driver: Mapped["Driver"] = relationship(back_populates="documents")
