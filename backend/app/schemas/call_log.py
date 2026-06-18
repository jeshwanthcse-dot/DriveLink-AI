import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class AICallLogBase(BaseModel):
    delivery_id: uuid.UUID
    driver_id: uuid.UUID
    organization_id: uuid.UUID
    call_type: str = Field(..., max_length=100)
    trigger_reason: str = Field(..., max_length=500)
    call_status: str = Field(..., max_length=100)
    driver_response: str | None = Field(None, max_length=1000)
    call_duration: float | None = None


class AICallLogCreate(AICallLogBase):
    pass


class AICallLogUpdate(BaseModel):
    delivery_id: uuid.UUID | None = None
    driver_id: uuid.UUID | None = None
    organization_id: uuid.UUID | None = None
    call_type: str | None = Field(None, max_length=100)
    trigger_reason: str | None = Field(None, max_length=500)
    call_status: str | None = Field(None, max_length=100)
    driver_response: str | None = Field(None, max_length=1000)
    call_duration: float | None = None


class AICallLogResponse(AICallLogBase):
    id: uuid.UUID
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
