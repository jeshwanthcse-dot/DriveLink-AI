import datetime
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.delivery import Delivery
from app.models.safety_alert import AISafetyAlert
from app.models.driver import Driver
from app.ai.delivery_intelligence.risk import DeliveryRiskEvaluator
from app.services.driver_performance import DriverPerformanceCalculator

logger = structlog.get_logger("app.services.analytics_service")


class AnalyticsService:
    """Analytics Engine generating Daily, Weekly, and Monthly statistics (Sprint 15)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.risk_evaluator = DeliveryRiskEvaluator(db)
        self.perf_calculator = DriverPerformanceCalculator(db)

    def get_overview_statistics(self, organization_id: str | None = None) -> dict:
        """Compiles overall delivery, completion rate, alerts, and risk distribution statistics."""
        logger.info("Analytics Generated", organization_id=organization_id)

        # Base queries
        del_stmt = select(Delivery)
        alert_stmt = select(AISafetyAlert)
        
        if organization_id:
            del_stmt = del_stmt.where(Delivery.organization_id == organization_id)
            alert_stmt = alert_stmt.where(AISafetyAlert.organization_id == organization_id)

        deliveries = self.db.scalars(del_stmt).all()
        alerts = self.db.scalars(alert_stmt).all()

        total_deliveries = len(deliveries)
        completed_count = sum(1 for d in deliveries if d.status == "completed")
        completion_rate = (completed_count / total_deliveries * 100.0) if total_deliveries > 0 else 100.0

        total_alerts = len(alerts)
        active_alerts = sum(1 for a in alerts if not a.resolved)
        resolved_alerts = total_alerts - active_alerts

        # Compile risk distribution for active deliveries
        risk_dist = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
        active_deliveries = [d for d in deliveries if d.status not in ["completed", "cancelled"]]
        
        for d in active_deliveries:
            risk = self.risk_evaluator.calculate_risk(d.id)
            level = risk["level"]
            risk_dist[level] = risk_dist.get(level, 0) + 1

        # Calculate driver average score
        drivers = self.db.scalars(select(Driver)).all()
        total_driver_score = 0.0
        driver_count = len(drivers)
        for dr in drivers:
            perf = self.perf_calculator.calculate_score(dr.id)
            total_driver_score += perf["performance_score"]
        
        driver_avg_score = (total_driver_score / driver_count) if driver_count > 0 else 85.0

        return {
            "total_deliveries": total_deliveries,
            "completion_rate": round(completion_rate, 1),
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "resolved_alerts": resolved_alerts,
            "driver_avg_score": round(driver_avg_score, 1),
            "risk_distribution": risk_dist,
        }

    def get_period_statistics(self, period: str, organization_id: str | None = None) -> dict:
        """Returns overview statistics filtered by period (daily, weekly, monthly)."""
        # Determine time threshold
        utc_now = datetime.datetime.now(datetime.timezone.utc)
        if period.lower() == "daily":
            threshold = utc_now - datetime.timedelta(days=1)
        elif period.lower() == "weekly":
            threshold = utc_now - datetime.timedelta(days=7)
        else: # monthly
            threshold = utc_now - datetime.timedelta(days=30)

        # Filters queries by created_at time
        del_stmt = select(Delivery).where(Delivery.created_at >= threshold)
        alert_stmt = select(AISafetyAlert).where(AISafetyAlert.created_at >= threshold)
        
        if organization_id:
            del_stmt = del_stmt.where(Delivery.organization_id == organization_id)
            alert_stmt = alert_stmt.where(AISafetyAlert.organization_id == organization_id)

        deliveries = self.db.scalars(del_stmt).all()
        alerts = self.db.scalars(alert_stmt).all()

        total_deliveries = len(deliveries)
        completed_count = sum(1 for d in deliveries if d.status == "completed")
        completion_rate = (completed_count / total_deliveries * 100.0) if total_deliveries > 0 else 100.0

        total_alerts = len(alerts)
        active_alerts = sum(1 for a in alerts if not a.resolved)
        resolved_alerts = total_alerts - active_alerts

        # Risk distribution
        risk_dist = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
        active_deliveries = [d for d in deliveries if d.status not in ["completed", "cancelled"]]
        for d in active_deliveries:
            risk = self.risk_evaluator.calculate_risk(d.id)
            level = risk["level"]
            risk_dist[level] = risk_dist.get(level, 0) + 1

        return {
            "period": period,
            "total_deliveries": total_deliveries,
            "completion_rate": round(completion_rate, 1),
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "resolved_alerts": resolved_alerts,
            "risk_distribution": risk_dist,
        }
