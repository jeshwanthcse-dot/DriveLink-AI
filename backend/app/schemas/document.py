import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field
from app.models.enums import DocumentType, VerificationStatus


class DriverDocumentBase(BaseModel):
    driver_id: uuid.UUID
    document_number: str | None = Field(None, max_length=100)
    # Validation using domain model StrEnums
    document_type: DocumentType
    verification_status: VerificationStatus = VerificationStatus.PENDING
    document_url: str = Field(..., max_length=500)
    confidence_score: float | None = None
    expiry_date: datetime.datetime


class DriverDocumentCreate(DriverDocumentBase):
    pass


class DriverDocumentUpdate(BaseModel):
    driver_id: uuid.UUID | None = None
    document_number: str | None = Field(None, max_length=100)
    document_type: DocumentType | None = None
    verification_status: VerificationStatus | None = None
    document_url: str | None = Field(None, max_length=500)
    confidence_score: float | None = None
    expiry_date: datetime.datetime | None = None


class DriverDocumentResponse(DriverDocumentBase):
    id: uuid.UUID
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
