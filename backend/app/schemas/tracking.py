import datetime
import uuid
from pydantic import BaseModel, ConfigDict


class TrackingLogBase(BaseModel):
    delivery_id: uuid.UUID
    latitude: float
    longitude: float
    speed: float = 0.0
    heading: float | None = None
    accuracy: float | None = None


class TrackingLogCreate(TrackingLogBase):
    pass


class TrackingLogUpdate(BaseModel):
    delivery_id: uuid.UUID | None = None
    latitude: float | None = None
    longitude: float | None = None
    speed: float | None = None
    heading: float | None = None
    accuracy: float | None = None


class TrackingLogResponse(TrackingLogBase):
    id: uuid.UUID
    recorded_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class LiveTrackingPayload(BaseModel):
    driver_id: uuid.UUID
    delivery_id: uuid.UUID
    latitude: float
    longitude: float
    speed: float
    timestamp: datetime.datetime

