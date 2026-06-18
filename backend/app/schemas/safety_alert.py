import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class AISafetyAlertBase(BaseModel):
    delivery_id: uuid.UUID
    driver_id: uuid.UUID
    organization_id: uuid.UUID
    trigger_reason: str = Field(..., max_length=500)
    trigger_time: datetime.datetime
    ivr_status: str = Field("initiated", max_length=100)
    driver_response: str | None = Field(None, max_length=1000)
    resolved: bool = False


class AISafetyAlertCreate(AISafetyAlertBase):
    pass


class AISafetyAlertUpdate(BaseModel):
    delivery_id: uuid.UUID | None = None
    driver_id: uuid.UUID | None = None
    organization_id: uuid.UUID | None = None
    trigger_reason: str | None = Field(None, max_length=500)
    trigger_time: datetime.datetime | None = None
    ivr_status: str | None = Field(None, max_length=100)
    driver_response: str | None = Field(None, max_length=1000)
    resolved: bool | None = None


class AISafetyAlertResponse(AISafetyAlertBase):
    id: uuid.UUID
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
