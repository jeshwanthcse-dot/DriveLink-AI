import uuid
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.schemas.driver import DriverCreate, DriverResponse, DriverUpdate
from app.services.driver import DriverService
from app.utils.response import success_response


class DriverController:
    """Controller layer handling HTTP-to-domain coordination for Driver actions."""

    def __init__(self, db: Session) -> None:
        self.service = DriverService(db)

    def register_driver(self, schema: DriverCreate) -> JSONResponse:
        """Invokes service registration and returns standard success response with code 201."""
        driver = self.service.register_driver(schema)
        response_schema = DriverResponse.model_validate(driver)
        return success_response(
            message="Driver registered successfully",
            data=response_schema.model_dump(),
            status_code=201,
        )

    def get_driver_by_id(self, id: uuid.UUID) -> JSONResponse:
        """Retrieves and returns driver details."""
        driver = self.service.get_driver(id)
        response_schema = DriverResponse.model_validate(driver)
        return success_response(
            message="Driver retrieved successfully",
            data=response_schema.model_dump(),
        )

    def list_drivers(self, skip: int = 0, limit: int = 100) -> JSONResponse:
        """Retrieves and returns all drivers."""
        drivers = self.service.list_drivers(skip, limit)
        response_data = [DriverResponse.model_validate(d).model_dump() for d in drivers]
        return success_response(
            message="Drivers list retrieved successfully",
            data=response_data,
        )

    def update_driver(self, id: uuid.UUID, schema: DriverUpdate) -> JSONResponse:
        """Modifies and returns updated driver details."""
        driver = self.service.update_driver(id, schema)
        response_schema = DriverResponse.model_validate(driver)
        return success_response(
            message="Driver updated successfully",
            data=response_schema.model_dump(),
        )

    def delete_driver(self, id: uuid.UUID) -> JSONResponse:
        """Removes a driver profile and returns confirmation."""
        self.service.delete_driver(id)
        return success_response(
            message="Driver deleted successfully",
            data=None,
        )
