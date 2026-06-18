import uuid
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.schemas.delivery import DeliveryCreate, DeliveryResponse, DeliveryUpdate
from app.services.delivery import DeliveryService
from app.utils.response import success_response


class DeliveryController:
    """Controller layer handling HTTP-to-domain coordination for Delivery actions."""

    def __init__(self, db: Session) -> None:
        self.service = DeliveryService(db)

    def create_delivery(self, schema: DeliveryCreate) -> JSONResponse:
        """Invokes service creation and returns standard success response with code 201."""
        delivery = self.service.create_delivery(schema)
        response_schema = DeliveryResponse.model_validate(delivery)
        return success_response(
            message="Delivery created successfully",
            data=response_schema.model_dump(),
            status_code=201,
        )

    def get_delivery_by_id(self, id: uuid.UUID) -> JSONResponse:
        """Retrieves and returns delivery information details."""
        delivery = self.service.get_delivery(id)
        response_schema = DeliveryResponse.model_validate(delivery)
        return success_response(
            message="Delivery retrieved successfully",
            data=response_schema.model_dump(),
        )

    def list_deliveries(
        self,
        skip: int = 0,
        limit: int = 100,
        organization_id: uuid.UUID | None = None,
        driver_id: uuid.UUID | None = None,
        status: str | None = None,
    ) -> JSONResponse:
        """Lists deliveries with dynamic parameters (firm, driver, status)."""
        deliveries = self.service.list_deliveries(
            skip=skip,
            limit=limit,
            organization_id=organization_id,
            driver_id=driver_id,
            status=status,
        )
        response_data = [DeliveryResponse.model_validate(d).model_dump() for d in deliveries]
        return success_response(
            message="Deliveries list retrieved successfully",
            data=response_data,
        )

    def update_delivery(self, id: uuid.UUID, schema: DeliveryUpdate) -> JSONResponse:
        """Modifies and returns updated delivery record details."""
        delivery = self.service.update_delivery(id, schema)
        response_schema = DeliveryResponse.model_validate(delivery)
        return success_response(
            message="Delivery updated successfully",
            data=response_schema.model_dump(),
        )

    def update_delivery_status(self, id: uuid.UUID, status: str) -> JSONResponse:
        """Transitions delivery status and returns updated state details."""
        delivery = self.service.update_delivery_status(id, status)
        response_schema = DeliveryResponse.model_validate(delivery)
        return success_response(
            message=f"Delivery status transitioned to {status} successfully",
            data=response_schema.model_dump(),
        )
