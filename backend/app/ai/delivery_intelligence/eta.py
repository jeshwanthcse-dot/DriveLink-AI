import datetime
import uuid
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.delivery import Delivery
from app.models.driver import Driver
from app.models.safety_alert import AISafetyAlert
from app.services.tracking_service import TrackingService
from app.services.map_service import map_service

logger = structlog.get_logger("app.ai.delivery_intelligence.eta")


class ETAPredictionEngine:
    """Calculates estimated arrival times, confidence scores, and delay predictions (Sprint 16)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.tracking_service = TrackingService(db)

    def predict_eta(self, delivery_id: uuid.UUID) -> dict:
        """Calculates and returns ETA prediction values."""
        logger.info("predicting_eta_started", delivery_id=str(delivery_id))

        delivery = self.db.get(Delivery, delivery_id)
        if not delivery:
            raise ValueError(f"Delivery with ID {delivery_id} not found.")

        # Geocode destination
        drop_coords = None
        geo_drop = map_service.geocode(delivery.drop_location)
        if geo_drop:
            drop_coords = (geo_drop["lat"], geo_drop["lon"])
        else:
            drop_coords = (12.9279, 77.6271)  # Fallback coordinate

        # Determine start coordinates (driver current location if in transit, else pickup location)
        start_coords = None
        driver = self.db.get(Driver, delivery.driver_id) if delivery.driver_id else None

        if delivery.status == "in_transit" and driver and driver.last_known_latitude and driver.last_known_longitude:
            start_coords = (driver.last_known_latitude, driver.last_known_longitude)
        else:
            geo_pickup = map_service.geocode(delivery.pickup_location)
            if geo_pickup:
                start_coords = (geo_pickup["lat"], geo_pickup["lon"])
            elif driver and driver.last_known_latitude and driver.last_known_longitude:
                start_coords = (driver.last_known_latitude, driver.last_known_longitude)
            else:
                start_coords = (12.9716, 77.5946)  # Fallback coordinate

        # Compute route from map service
        route = map_service.get_route(start_coords, drop_coords)
        distance_km = route["distance_km"]
        duration_min = route["duration_min"]

        # Calculate driver average speed from logs
        logs = self.tracking_service.repo.filter(delivery_id=delivery_id)
        avg_speed = 45.0
        speeds = [log.speed for log in logs if log.speed > 5.0]
        if speeds:
            avg_speed = sum(speeds) / len(speeds)

        # Scale base route duration by driver speed ratio (standard route assumes ~45.0 km/h)
        speed_ratio = 45.0 / avg_speed if avg_speed > 0 else 1.0
        speed_ratio = max(0.5, min(speed_ratio, 2.0))
        predicted_duration_min = duration_min * speed_ratio

        # Determine base confidence
        confidence = 0.90 if len(logs) > 10 else 0.70

        # Adjust for safety alerts
        unresolved_alerts = self.db.scalars(
            select(AISafetyAlert).where(
                AISafetyAlert.delivery_id == delivery_id,
                AISafetyAlert.resolved == False
            )
        ).all()

        delay_prediction = "ON_TIME"
        if unresolved_alerts:
            confidence = max(confidence - 0.25, 0.10)
            predicted_duration_min += 15.0
            delay_prediction = "DELAYED"

        # Adjust for idle vehicle stop duration
        stop_duration = self.tracking_service.calculate_stop_duration(delivery_id)
        if stop_duration > 15.0:
            confidence = max(confidence - 0.15, 0.10)
            predicted_duration_min += stop_duration
            delay_prediction = "DELAYED"

        # Check if total predicted duration exceeds original estimate
        original_estimate = delivery.estimated_duration or 60.0
        elapsed_minutes = 0.0
        utc_now = datetime.datetime.now(datetime.timezone.utc)
        if delivery.pickup_time:
            pickup_tz = delivery.pickup_time
            if pickup_tz.tzinfo is None:
                pickup_tz = pickup_tz.replace(tzinfo=datetime.timezone.utc)
            elapsed_minutes = (utc_now - pickup_tz).total_seconds() / 60.0

        total_predicted_duration = elapsed_minutes + predicted_duration_min
        if total_predicted_duration > original_estimate * 1.15:
            delay_prediction = "DELAYED"

        estimated_arrival = utc_now + datetime.timedelta(minutes=predicted_duration_min)

        logger.info(
            "ETA Generated",
            delivery_id=str(delivery_id),
            estimated_arrival=estimated_arrival.isoformat(),
            confidence_score=round(confidence, 2),
            delay_prediction=delay_prediction,
        )

        return {
            "eta_minutes": int(round(predicted_duration_min)),
            "distance_km": round(distance_km, 2),
            "confidence": round(confidence, 2),
            # Backward compatibility fields
            "estimated_arrival": estimated_arrival,
            "confidence_score": round(confidence, 2),
            "delay_prediction": delay_prediction,
        }
