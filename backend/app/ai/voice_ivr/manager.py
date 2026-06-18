import uuid
import structlog
from sqlalchemy.orm import Session
from app.ai.voice_ivr.provider import MockVoiceProvider, VoiceProviderInterface
from app.models.call_log import AICallLog
from app.repositories.call_log import CallLogRepository
from app.schemas.call_log import AICallLogCreate

logger = structlog.get_logger("app.ai.voice_ivr.manager")


class VoiceCallManager:
    """Coordinates IVR dialing, captures provider responses, and registers database log audits."""

    def __init__(self, db: Session, provider: VoiceProviderInterface | None = None) -> None:
        self.db = db
        self.repo = CallLogRepository(db)
        self.provider = provider or MockVoiceProvider()

    def trigger_safety_check_call(
        self,
        delivery_id: uuid.UUID,
        driver_id: uuid.UUID,
        organization_id: uuid.UUID,
        phone: str,
        safety_alert_id: uuid.UUID,
    ) -> AICallLog:
        """Invokes outbound voice check and logs telemetry response call log."""
        logger.info(
            "voice_ivr_safety_check_initiated",
            phone=phone,
            alert_id=str(safety_alert_id),
        )

        prompt_msg = (
            "This is an automated safety alert from DriveLink AI. "
            "Please press 1 if you are safe, or 2 if you require assistance."
        )

        # Trigger IVR call
        result = self.provider.make_ivr_call(phone, prompt_msg)

        log_schema = AICallLogCreate(
            delivery_id=delivery_id,
            driver_id=driver_id,
            organization_id=organization_id,
            call_type="safety_check",
            trigger_reason="Vehicle stationary threshold exceeded.",
            call_status=result["call_status"],
            driver_response=result["driver_response"],
            call_duration=result["call_duration"],
        )

        db_obj = self.repo.create(log_schema)
        self.db.flush()

        logger.info(
            "voice_ivr_safety_check_recorded",
            phone=phone,
            status=result["call_status"],
            driver_response=result["driver_response"],
        )

        return db_obj

    def call_driver(
        self,
        delivery_id: uuid.UUID,
        driver_id: uuid.UUID,
        organization_id: uuid.UUID,
        phone: str,
        safety_alert_id: uuid.UUID,
    ) -> AICallLog:
        """Triggers outbound Twilio IVR call via TwilioProvider and stores the Call Log."""
        # Dynamic import of TwilioProvider to prevent packaging issues
        from app.voice_ivr.twilio_provider import TwilioProvider
        provider = TwilioProvider()

        logger.info(
            "voice_ivr_twilio_call_initiated",
            phone=phone,
            alert_id=str(safety_alert_id),
        )

        try:
            call = provider.call_driver(phone)
            call_sid = call.sid
            status = call.status  # e.g., queued, initiated
        except Exception as e:
            logger.error("twilio_call_trigger_failed", error=str(e))
            call_sid = "FAILED"
            status = "failed"

        log_schema = AICallLogCreate(
            delivery_id=delivery_id,
            driver_id=driver_id,
            organization_id=organization_id,
            call_type="safety_check",
            trigger_reason=f"Call SID: {call_sid} | Phone: {phone} | Alert ID: {str(safety_alert_id)}",
            call_status=status,
            driver_response=None,
            call_duration=0.0,
        )

        db_obj = self.repo.create(log_schema)
        self.db.flush()

        logger.info(
            "voice_ivr_twilio_call_recorded",
            phone=phone,
            call_sid=call_sid,
            status=status,
        )

        return db_obj
