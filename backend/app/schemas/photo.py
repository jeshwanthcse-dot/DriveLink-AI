import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class DeliveryPhotoBase(BaseModel):
    delivery_id: uuid.UUID
    photo_url: str = Field(..., max_length=500)
    latitude: float
    longitude: float


class DeliveryPhotoCreate(DeliveryPhotoBase):
    pass


class DeliveryPhotoUpdate(BaseModel):
    delivery_id: uuid.UUID | None = None
    photo_url: str | None = Field(None, max_length=500)
    latitude: float | None = None
    longitude: float | None = None


class DeliveryPhotoResponse(DeliveryPhotoBase):
    id: uuid.UUID
    captured_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
