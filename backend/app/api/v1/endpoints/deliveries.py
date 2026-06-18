import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.controllers.delivery import DeliveryController
from app.database.database import get_db
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate

router = APIRouter(prefix="/deliveries", tags=["deliveries"])


class DeliveryStatusUpdate(BaseModel):
    status: str


def get_delivery_controller(db: Session = Depends(get_db)) -> DeliveryController:
    """Dependency injection helper to load DeliveryController."""
    return DeliveryController(db)


@router.post("", status_code=201)
async def create_delivery(
    schema: DeliveryCreate,
    controller: DeliveryController = Depends(get_delivery_controller),
) -> JSONResponse:
    """Creates a new logistics delivery request, validating organizations/drivers references."""
    return controller.create_delivery(schema)


@router.get("")
async def list_deliveries(
    skip: int = 0,
    limit: int = 100,
    organization_id: uuid.UUID | None = None,
    driver_id: uuid.UUID | None = None,
    status: str | None = None,
    controller: DeliveryController = Depends(get_delivery_controller),
) -> JSONResponse:
    """Lists logistics delivery requests with dynamic filtering parameters."""
    return controller.list_deliveries(
        skip=skip,
        limit=limit,
        organization_id=organization_id,
        driver_id=driver_id,
        status=status,
    )


@router.get("/{id}")
async def get_delivery(
    id: uuid.UUID,
    controller: DeliveryController = Depends(get_delivery_controller),
) -> JSONResponse:
    """Retrieves delivery status and location details by UUID."""
    return controller.get_delivery_by_id(id)


@router.patch("/{id}")
async def update_delivery(
    id: uuid.UUID,
    schema: DeliveryUpdate,
    controller: DeliveryController = Depends(get_delivery_controller),
) -> JSONResponse:
    """Modifies delivery request particulars."""
    return controller.update_delivery(id, schema)


@router.patch("/{id}/status")
async def update_delivery_status(
    id: uuid.UUID,
    payload: DeliveryStatusUpdate,
    controller: DeliveryController = Depends(get_delivery_controller),
) -> JSONResponse:
    """Transitions a delivery status, automatically generating time checkpoints on IN_TRANSIT and COMPLETED."""
    return controller.update_delivery_status(id, payload.status)
