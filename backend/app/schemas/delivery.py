import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class DeliveryBase(BaseModel):
    organization_id: uuid.UUID
    driver_id: uuid.UUID | None = None
    pickup_location: str = Field(..., max_length=500)
    drop_location: str = Field(..., max_length=500)
    cargo_type: str = Field(..., max_length=255)
    priority: str = Field("medium", max_length=50)
    status: str = Field("pending", max_length=50)
    distance_km: float = 0.0
    estimated_duration: float = 0.0
    
    # Progress tracking fields
    proof_photo_uploaded: bool = False
    pickup_time: datetime.datetime | None = None
    delivery_time: datetime.datetime | None = None
    last_location_update: datetime.datetime | None = None


class DeliveryCreate(DeliveryBase):
    pass


class DeliveryUpdate(BaseModel):
    organization_id: uuid.UUID | None = None
    driver_id: uuid.UUID | None = None
    pickup_location: str | None = Field(None, max_length=500)
    drop_location: str | None = Field(None, max_length=500)
    cargo_type: str | None = Field(None, max_length=255)
    priority: str | None = Field(None, max_length=50)
    status: str | None = Field(None, max_length=50)
    distance_km: float | None = None
    estimated_duration: float | None = None
    
    proof_photo_uploaded: bool | None = None
    pickup_time: datetime.datetime | None = None
    delivery_time: datetime.datetime | None = None
    last_location_update: datetime.datetime | None = None


class DeliveryResponse(DeliveryBase):
    id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
