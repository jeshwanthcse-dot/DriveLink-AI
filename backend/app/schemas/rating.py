import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class RatingBase(BaseModel):
    delivery_id: uuid.UUID
    driver_id: uuid.UUID
    organization_id: uuid.UUID
    rating: int = Field(..., ge=1, le=5)
    review: str | None = Field(None, max_length=1000)


class RatingCreate(RatingBase):
    pass


class RatingUpdate(BaseModel):
    delivery_id: uuid.UUID | None = None
    driver_id: uuid.UUID | None = None
    organization_id: uuid.UUID | None = None
    rating: int | None = Field(None, ge=1, le=5)
    review: str | None = Field(None, max_length=1000)


class RatingResponse(RatingBase):
    id: uuid.UUID
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
