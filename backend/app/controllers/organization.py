import uuid
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from app.services.organization import OrganizationService
from app.utils.response import success_response


class OrganizationController:
    """Controller layer handling HTTP-to-domain coordination for Organization actions."""

    def __init__(self, db: Session) -> None:
        self.service = OrganizationService(db)

    def register_organization(self, schema: OrganizationCreate) -> JSONResponse:
        """Invokes service registration and returns standard success response with code 201."""
        org = self.service.register_organization(schema)
        response_schema = OrganizationResponse.model_validate(org)
        return success_response(
            message="Organization registered successfully",
            data=response_schema.model_dump(),
            status_code=201,
        )

    def get_organization_by_id(self, id: uuid.UUID) -> JSONResponse:
        """Retrieves and returns organization profile details."""
        org = self.service.get_organization(id)
        response_schema = OrganizationResponse.model_validate(org)
        return success_response(
            message="Organization retrieved successfully",
            data=response_schema.model_dump(),
        )

    def list_organizations(self, skip: int = 0, limit: int = 100) -> JSONResponse:
        """Retrieves and returns all registered transport firms."""
        orgs = self.service.list_organizations(skip, limit)
        response_data = [OrganizationResponse.model_validate(o).model_dump() for o in orgs]
        return success_response(
            message="Organizations list retrieved successfully",
            data=response_data,
        )

    def update_organization(self, id: uuid.UUID, schema: OrganizationUpdate) -> JSONResponse:
        """Modifies and returns updated organization details."""
        org = self.service.update_organization(id, schema)
        response_schema = OrganizationResponse.model_validate(org)
        return success_response(
            message="Organization updated successfully",
            data=response_schema.model_dump(),
        )
