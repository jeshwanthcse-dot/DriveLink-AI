import datetime
import uuid
from pydantic import BaseModel, ConfigDict, Field


class OrganizationBase(BaseModel):
    company_name: str = Field(..., max_length=255)
    contact_person: str = Field(..., max_length=255)
    phone: str = Field(..., max_length=50)
    email: str = Field(..., max_length=255)
    address: str = Field(..., max_length=500)


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    company_name: str | None = Field(None, max_length=255)
    contact_person: str | None = Field(None, max_length=255)
    phone: str | None = Field(None, max_length=50)
    email: str | None = Field(None, max_length=255)
    address: str | None = Field(None, max_length=500)


class OrganizationResponse(OrganizationBase):
    id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
