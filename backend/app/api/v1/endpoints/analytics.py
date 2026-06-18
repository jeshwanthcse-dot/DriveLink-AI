from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.controllers.analytics import AnalyticsController
from app.database.database import get_db

router = APIRouter(prefix="/analytics", tags=["logistics analytics"])


def get_analytics_controller(db: Session = Depends(get_db)) -> AnalyticsController:
    """Dependency injection helper to load AnalyticsController."""
    return AnalyticsController(db)


@router.get("/overview")
async def get_analytics_overview(
    controller: AnalyticsController = Depends(get_analytics_controller),
) -> JSONResponse:
    """Retrieves high-level analytics overview aggregates."""
    return controller.get_overview()


@router.get("/drivers")
async def get_drivers_performance(
    controller: AnalyticsController = Depends(get_analytics_controller),
) -> JSONResponse:
    """Retrieves full performance scorecards for active driver profiles."""
    return controller.get_drivers_performance()


@router.get("/deliveries")
async def get_deliveries_analytics(
    controller: AnalyticsController = Depends(get_analytics_controller),
) -> JSONResponse:
    """Retrieves logistics metrics focused on completion rate and risk distribution."""
    return controller.get_deliveries_analytics()
