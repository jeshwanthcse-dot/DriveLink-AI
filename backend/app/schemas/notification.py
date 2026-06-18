import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class NotificationBase(BaseModel):
    organization_id: uuid.UUID
    title: str = Field(..., max_length=255)
    message: str = Field(..., max_length=1000)
    type: str = Field(..., max_length=100)
    is_read: bool = False


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    organization_id: uuid.UUID | None = None
    title: str | None = Field(None, max_length=255)
    message: str | None = Field(None, max_length=1000)
    type: str | None = Field(None, max_length=100)
    is_read: bool | None = None


class NotificationResponse(NotificationBase):
    id: uuid.UUID
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
