import datetime
import structlog
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.call_log import AICallLog
from app.models.safety_alert import AISafetyAlert
from app.models.notification import Notification
from app.models.driver import Driver
from app.models.delivery import Delivery

logger = structlog.get_logger("app.voice_ivr.service")


class VoiceIVRService:
    """Service layer handling driver IVR key response processing and alerts/notifications integrations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    @staticmethod
    def process_driver_response(digit: str):
        """Maps user pressed key to status string (for backward compatibility)."""
        mapping = {
            "1": "SAFE",
            "2": "LOADING",
            "3": "BREAKDOWN",
            "4": "EMERGENCY",
        }
        return mapping.get(digit, "UNKNOWN")

    def handle_driver_response(
        self,
        call_sid: str,
        digits: str,
        phone_number: str | None = None,
        duration: float | None = None,
    ) -> dict:
        """Processes driver digits selection, updates database models, and generates notifications."""
        logger.info(
            "Driver Response Received",
            call_sid=call_sid,
            digits=digits,
            phone=phone_number,
        )

        # 1. Search for matching Call Log by CallSid in trigger_reason
        stmt = select(AICallLog).where(AICallLog.trigger_reason.like(f"%{call_sid}%"))
        call_log = self.db.scalars(stmt).first()

        # Fallback to lookup by phone if CallSid search fails
        if not call_log and phone_number:
            stmt2 = (
                select(AICallLog)
                .where(AICallLog.trigger_reason.like(f"%{phone_number}%"))
                .order_by(AICallLog.created_at.desc())
            )
            call_log = self.db.scalars(stmt2).first()

        if not call_log:
            logger.warning("call_log_not_found_for_response", call_sid=call_sid)
            return {"status": "UNKNOWN", "message": "Call Log Not Found"}

        # Define outcome mappings
        mapping = {
            "1": {"status": "SAFE", "message": "Everything OK", "resolved": True},
            "2": {"status": "LOADING", "message": "Loading / Unloading", "resolved": False},
            "3": {"status": "BREAKDOWN", "message": "Vehicle Breakdown", "resolved": False},
            "4": {"status": "EMERGENCY", "message": "Emergency", "resolved": False},
        }

        outcome = mapping.get(
            digits,
            {"status": "UNKNOWN", "message": f"Invalid Option: {digits}", "resolved": False}
        )

        # 2. Update call log details
        call_log.call_status = "COMPLETED"
        call_log.driver_response = f"Option {digits}: {outcome['message']}"
        if duration is not None:
            call_log.call_duration = duration

        # 3. Locate active safety alert
        alert_stmt = (
            select(AISafetyAlert)
            .where(
                AISafetyAlert.delivery_id == call_log.delivery_id,
                AISafetyAlert.resolved == False,
            )
            .order_by(AISafetyAlert.created_at.desc())
        )
        alert = self.db.scalars(alert_stmt).first()

        driver = self.db.get(Driver, call_log.driver_id)
        delivery = self.db.get(Delivery, call_log.delivery_id)
        driver_name = driver.full_name if driver else "Unknown Driver"
        driver_phone = driver.phone if driver else (phone_number or "Unknown Phone")

        if alert:
            alert.ivr_status = outcome["status"]
            alert.driver_response = outcome["message"]
            alert.resolved = outcome["resolved"]
            
            if outcome["resolved"]:
                logger.info(
                    "Alert Closed",
                    alert_id=str(alert.id),
                    driver_id=str(call_log.driver_id),
                )

        # 4. Generate SAFETY_ALERT Notification
        title = f"AI Safety Alert - {outcome['status']}"
        location_str = "Unknown Location"
        
        if driver and driver.last_known_latitude and driver.last_known_longitude:
            location_str = f"Lat: {driver.last_known_latitude}, Lon: {driver.last_known_longitude}"
        elif delivery:
            location_str = f"Route: {delivery.pickup_location} -> {delivery.drop_location}"

        message_body = (
            f"Description: Driver safety check response received.\n"
            f"Driver: {driver_name} (Phone: {driver_phone})\n"
            f"Delivery ID: {str(call_log.delivery_id)}\n"
            f"Location: {location_str}\n"
            f"Alert Type: SAFETY_ALERT\n"
            f"Call Response: {outcome['message']} (Option: {digits})\n"
            f"Created At: {datetime.datetime.now(datetime.timezone.utc).isoformat()}"
        )

        notification = Notification(
            organization_id=call_log.organization_id,
            title=title,
            message=message_body,
            type="SAFETY_ALERT",
            is_read=False,
        )
        self.db.add(notification)

        self.db.commit()

        logger.info(
            "Organization Notified",
            driver_id=str(call_log.driver_id),
            alert_status=outcome["status"],
        )

        return outcome