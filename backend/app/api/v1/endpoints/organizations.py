import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.controllers.organization import OrganizationController
from app.database.database import get_db
from app.schemas.organization import OrganizationCreate, OrganizationUpdate

router = APIRouter(prefix="/organizations", tags=["organizations"])


def get_org_controller(db: Session = Depends(get_db)) -> OrganizationController:
    """Dependency injection helper to load OrganizationController."""
    return OrganizationController(db)


@router.post("/register", status_code=201)
async def register_organization(
    schema: OrganizationCreate,
    controller: OrganizationController = Depends(get_org_controller),
) -> JSONResponse:
    """Registers a new transport organization firm with email uniqueness validation."""
    return controller.register_organization(schema)


@router.get("")
async def list_organizations(
    skip: int = 0,
    limit: int = 100,
    controller: OrganizationController = Depends(get_org_controller),
) -> JSONResponse:
    """Lists registered organization profiles with pagination."""
    return controller.list_organizations(skip=skip, limit=limit)


@router.get("/{id}")
async def get_organization(
    id: uuid.UUID,
    controller: OrganizationController = Depends(get_org_controller),
) -> JSONResponse:
    """Retrieves organization details by UUID."""
    return controller.get_organization_by_id(id)


@router.patch("/{id}")
async def update_organization(
    id: uuid.UUID,
    schema: OrganizationUpdate,
    controller: OrganizationController = Depends(get_org_controller),
) -> JSONResponse:
    """Modifies an organization's profile details."""
    return controller.update_organization(id, schema)
