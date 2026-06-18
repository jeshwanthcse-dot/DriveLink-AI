import uuid
import structlog
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.services.analytics_service import AnalyticsService
from app.services.driver_performance import DriverPerformanceCalculator
from app.models.driver import Driver
from app.utils.response import success_response

logger = structlog.get_logger("app.controllers.analytics")


class AnalyticsController:
    """Controller layer handling HTTP-to-domain coordination for all logistics analytics (Sprint 15)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.service = AnalyticsService(db)
        self.perf_calculator = DriverPerformanceCalculator(db)

    def get_overview(self, organization_id: uuid.UUID | None = None) -> JSONResponse:
        """Retrieves and returns the overall statistics overview package."""
        org_id_str = str(organization_id) if organization_id else None
        stats = self.service.get_overview_statistics(org_id_str)
        
        logger.info(
            "Analytics Generated",
            organization_id=org_id_str,
        )
        
        return success_response(
            message="Analytics overview statistics compiled successfully",
            data=stats,
        )

    def get_drivers_performance(self) -> JSONResponse:
        """Calculates and returns performance scores for all active driver profiles."""
        drivers = self.db.scalars(select(Driver)).all()
        response_data = []

        for d in drivers:
            perf = self.perf_calculator.calculate_score(d.id)
            response_data.append(
                {
                    "driver_id": str(d.id),
                    "full_name": d.full_name,
                    "performance_score": perf["performance_score"],
                    "completed_deliveries_count": perf["completed_deliveries_count"],
                    "safety_alerts_count": perf["safety_alerts_count"],
                    "average_rating": perf["average_rating"],
                    "idle_time_total_minutes": perf["idle_time_total_minutes"],
                }
            )

        return success_response(
            message="Drivers performance scorecard retrieved successfully",
            data=response_data,
        )

    def get_deliveries_analytics(self) -> JSONResponse:
        """Returns details on risk levels and deliveries summaries."""
        # Retrieve overall stats directly
        stats = self.service.get_overview_statistics()
        
        delivery_analytics = {
            "total_deliveries": stats["total_deliveries"],
            "completion_rate": stats["completion_rate"],
            "risk_distribution": stats["risk_distribution"],
        }
        
        return success_response(
            message="Deliveries analytics retrieved successfully",
            data=delivery_analytics,
        )
