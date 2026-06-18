import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.controllers.driver import DriverController
from app.database.database import get_db
from app.schemas.driver import DriverCreate, DriverUpdate

router = APIRouter(prefix="/drivers", tags=["drivers"])


def get_driver_controller(db: Session = Depends(get_db)) -> DriverController:
    """Dependency injection helper to load DriverController."""
    return DriverController(db)


@router.post("/register", status_code=201)
async def register_driver(
    schema: DriverCreate,
    controller: DriverController = Depends(get_driver_controller),
) -> JSONResponse:
    """Registers a new driver profile with uniqueness validation checks."""
    return controller.register_driver(schema)


@router.get("")
async def list_drivers(
    skip: int = 0,
    limit: int = 100,
    controller: DriverController = Depends(get_driver_controller),
) -> JSONResponse:
    """Lists registered driver profiles with pagination."""
    return controller.list_drivers(skip=skip, limit=limit)


@router.get("/{id}")
async def get_driver(
    id: uuid.UUID,
    controller: DriverController = Depends(get_driver_controller),
) -> JSONResponse:
    """Retrieves standard driver profile details by UUID."""
    return controller.get_driver_by_id(id)


@router.patch("/{id}")
async def update_driver(
    id: uuid.UUID,
    schema: DriverUpdate,
    controller: DriverController = Depends(get_driver_controller),
) -> JSONResponse:
    """Modifies a driver's details, performing uniqueness validations if email/phone changes."""
    return controller.update_driver(id, schema)


@router.delete("/{id}")
async def delete_driver(
    id: uuid.UUID,
    controller: DriverController = Depends(get_driver_controller),
) -> JSONResponse:
    """Removes a driver profile from the platform."""
    return controller.delete_driver(id)
