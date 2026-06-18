import datetime
from enum import StrEnum
from typing import Any, Generic, TypeVar
from pydantic import BaseModel, ConfigDict, Field
from app.models.enums import VerificationStatus

T = TypeVar('T')


class OCRDocumentType(StrEnum):
    DRIVING_LICENSE = "DRIVING_LICENSE"
    VEHICLE_RC = "VEHICLE_RC"
    INSURANCE = "INSURANCE"
    AADHAAR = "AADHAAR"
    PAN = "PAN"
    VEHICLE_PERMIT = "VEHICLE_PERMIT"
    FITNESS_CERTIFICATE = "FITNESS_CERTIFICATE"
    PUC = "PUC"
    FASTAG_RECEIPT = "FASTAG_RECEIPT"
    OTHER = "OTHER"


class NormalizedDocument(BaseModel):
    """Unified document representation outputted by the Universal Normalization Engine."""
    document_type: OCRDocumentType
    document_number: str | None = Field(None, max_length=100)
    holder_name: str | None = Field(None, max_length=255)
    holder_id: str | None = Field(None, max_length=100)
    vehicle_number: str | None = Field(None, max_length=50)
    policy_number: str | None = Field(None, max_length=100)
    permit_number: str | None = Field(None, max_length=100)
    issue_date: datetime.date | None = None
    expiry_date: datetime.date | None = None
    issuing_authority: str | None = Field(None, max_length=255)
    
    # Confidence metrics
    confidence_score: float = 0.0
    missing_fields: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    
    verification_status: VerificationStatus = VerificationStatus.PENDING
    raw_text: str = ""
    metadata: dict[str, Any] = Field(default_factory=dict)

    # Added optional fields for Sprint 13.2 refinement
    issuer: str | None = Field(None, max_length=255)
    document_category: str | None = Field(None, max_length=100)
    issuing_country: str | None = Field(None, max_length=100)
    source_provider: str | None = Field(None, max_length=100)
    processing_time_ms: float | None = None
    normalized_version: str = "1.0"

    model_config = ConfigDict(from_attributes=True)


class OCRTextData(BaseModel):
    """Stage response containing raw OCR text output."""
    raw_text: str


class ClassificationData(BaseModel):
    """Stage response containing classified document type."""
    document_type: OCRDocumentType


class ParsedDocumentData(BaseModel):
    """Stage response containing parsed fields extracted from raw text."""
    document_number: str | None = None
    holder_name: str | None = None
    holder_id: str | None = None
    vehicle_number: str | None = None
    policy_number: str | None = None
    permit_number: str | None = None
    issue_date: datetime.date | None = None
    expiry_date: datetime.date | None = None
    issuing_authority: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ValidationSummary(BaseModel):
    """Stage response containing validation details and recommendation."""
    verification_status: VerificationStatus
    confidence_score: float
    missing_fields: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    recommendation: str


class AIResponse(BaseModel, Generic[T]):
    """Standard generic wrapper returned by every stage of the OCR normalization engine."""
    success: bool
    message: str
    data: T
    metadata: dict[str, Any] = Field(default_factory=dict)
    warnings: list[str] = Field(default_factory=list)
    processing_time: float
