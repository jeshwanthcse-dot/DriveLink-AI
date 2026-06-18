import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class DriverBase(BaseModel):
    full_name: str = Field(..., max_length=255)
    phone: str = Field(..., max_length=50)
    email: str = Field(..., max_length=255)
    vehicle_number: str | None = Field(None, max_length=50)
    vehicle_type: str | None = Field(None, max_length=100)
    license_number: str | None = Field(None, max_length=100)
    availability: bool = True
    verification_status: str = "pending"
    
    # Telemetry tracking fields
    is_online: bool = False
    last_known_latitude: float | None = None
    last_known_longitude: float | None = None
    last_seen_at: datetime.datetime | None = None
    current_delivery_id: uuid.UUID | None = None


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
    full_name: str | None = Field(None, max_length=255)
    phone: str | None = Field(None, max_length=50)
    email: str | None = Field(None, max_length=255)
    vehicle_number: str | None = Field(None, max_length=50)
    vehicle_type: str | None = Field(None, max_length=100)
    license_number: str | None = Field(None, max_length=100)
    rating: float | None = None
    trust_score: float | None = None
    availability: bool | None = None
    verification_status: str | None = Field(None, max_length=50)
    
    is_online: bool | None = None
    last_known_latitude: float | None = None
    last_known_longitude: float | None = None
    last_seen_at: datetime.datetime | None = None
    current_delivery_id: uuid.UUID | None = None


class DriverResponse(DriverBase):
    id: uuid.UUID
    rating: float
    trust_score: float
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
