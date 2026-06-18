import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.driver import Driver
from app.models.delivery import Delivery
from app.models.safety_alert import AISafetyAlert
from app.models.call_log import AICallLog
from app.services.tracking_service import TrackingService

class DriverPerformanceCalculator:
    """Calculates driver performance scores (0-100) using core metrics (Sprint 15)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.tracking_service = TrackingService(db)

    def calculate_score(self, driver_id: uuid.UUID) -> dict:
        """Runs the calculation on driver history variables."""
        driver = self.db.get(Driver, driver_id)
        if not driver:
            return {
                "performance_score": 0.0,
                "completed_deliveries_count": 0,
                "safety_alerts_count": 0,
                "average_rating": 0.0,
                "idle_time_total_minutes": 0.0,
            }

        score = 80.0 # base baseline score

        # 1. Completed Deliveries (Reward +2.5 per delivery, max +20)
        completed_deliveries = self.db.scalars(
            select(Delivery).where(
                Delivery.driver_id == driver_id,
                Delivery.status == "completed"
            )
        ).all()
        comp_count = len(completed_deliveries)
        score += min(comp_count * 2.5, 20.0)

        # 2. Driver Rating (Max 20 penalty)
        rating = driver.rating or 4.0
        rating_penalty = (5.0 - rating) * 10.0
        score -= min(rating_penalty, 20.0)

        # 3. Safety Alerts (Max 25 penalty)
        alerts = self.db.scalars(
            select(AISafetyAlert).where(AISafetyAlert.driver_id == driver_id)
        ).all()
        alerts_count = len(alerts)
        score -= min(alerts_count * 10.0, 25.0)

        # 4. Late Deliveries (Max 20 penalty)
        # Find deliveries where actual completion time exceeded original estimates
        late_count = 0
        for d in completed_deliveries:
            if d.pickup_time and d.delivery_time and d.estimated_duration:
                actual_duration = (d.delivery_time - d.pickup_time).total_seconds() / 60.0
                if actual_duration > d.estimated_duration * 1.15:
                    late_count += 1
        score -= min(late_count * 10.0, 20.0)

        # 5. Vehicle Idle Time / Stops (Max 15 penalty)
        # Sum current stop duration and simulated historical idle minutes
        total_idle_min = 0.0
        for d in completed_deliveries:
            # Check telemetry stops
            duration = self.tracking_service.calculate_stop_duration(d.id)
            total_idle_min += duration
        
        score -= min(total_idle_min * 0.1, 15.0)

        # 6. IVR Responses (Max 10 penalty for failed or unresolved calls)
        calls = self.db.scalars(
            select(AICallLog).where(
                AICallLog.driver_id == driver_id,
                AICallLog.call_type == "safety_check"
            )
        ).all()
        missed_count = sum(1 for c in calls if c.call_status != "COMPLETED")
        score -= min(missed_count * 5.0, 10.0)

        # Cap score between 0 and 100
        performance_score = min(max(score, 0.0), 100.0)

        return {
            "performance_score": round(performance_score, 1),
            "completed_deliveries_count": comp_count,
            "safety_alerts_count": alerts_count,
            "average_rating": rating,
            "idle_time_total_minutes": round(total_idle_min, 1),
        }
