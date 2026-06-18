import datetime
from pydantic import BaseModel, Field


class ProcessingMetadata(BaseModel):
    """Analytical metadata model to track performance and details of the OCR processing stage."""
    provider: str
    model: str
    timestamp: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    processing_time: float
    document_hash: str
    pipeline_version: str = "1.0"
