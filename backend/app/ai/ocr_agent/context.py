import datetime
import uuid
from typing import Any
from pydantic import BaseModel, Field


class PipelineContext(BaseModel):
    """Execution context model that travels through all stages of the OCR engine pipeline."""
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str | None = None
    processing_start_time: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    provider: str = "gemini"
    model: str = "gemini-1.5-flash"
    debug_information: dict[str, Any] = Field(default_factory=dict)
