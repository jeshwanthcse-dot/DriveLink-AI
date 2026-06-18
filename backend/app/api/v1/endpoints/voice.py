from fastapi import APIRouter, Response, Form, Depends
from sqlalchemy.orm import Session
from twilio.twiml.voice_response import VoiceResponse, Gather
from app.database.database import get_db
from app.voice_ivr.service import VoiceIVRService
import structlog

logger = structlog.get_logger("app.api.v1.endpoints.voice")

router = APIRouter(
    prefix="/voice",
    tags=["Voice IVR"],
)


@router.post("/twiml")
async def generate_twiml():
    """Generates the TwiML XML gathering the driver's keypad response for safety checks."""
    response = VoiceResponse()

    gather = Gather(
        num_digits=1,
        action="/api/v1/voice/response",
        method="POST",
    )

    gather.say(
        """
        Hello.

        This is an automated safety check from DriveLink AI.

        We detected your truck has been stationary for more than twenty minutes.

        Press 1 if everything is okay.

        Press 2 if you are loading or unloading.

        Press 3 if your vehicle has broken down.

        Press 4 if this is an emergency.
        """,
        voice="alice",
    )

    response.append(gather)

    return Response(
        content=str(response),
        media_type="application/xml",
    )


@router.post("/response")
async def response_endpoint(
    Digits: str = Form(default=""),
    CallSid: str = Form(default=""),
    To: str = Form(default=""),
    Duration: str = Form(default=None),
    db: Session = Depends(get_db),
):
    """Webhook handling the driver response digit digits, updating DB state, and responding with TwiML."""
    response = VoiceResponse()

    duration_float = None
    if Duration:
        try:
            duration_float = float(Duration)
        except ValueError:
            pass

    # Call VoiceIVRService to process digits, update logs/alerts, and notify organization dashboard
    service = VoiceIVRService(db)
    outcome = service.handle_driver_response(
        call_sid=CallSid,
        digits=Digits,
        phone_number=To,
        duration=duration_float,
    )

    if Digits == "1":
        response.say("Thank you. Your organization has been notified that you are safe.", voice="alice")
    elif Digits == "2":
        response.say("Loading or unloading status has been recorded.", voice="alice")
    elif Digits == "3":
        response.say("Vehicle breakdown recorded. Organization has been notified.", voice="alice")
    elif Digits == "4":
        response.say("Emergency alert has been sent to your organization immediately.", voice="alice")
    else:
        response.say("Invalid input received. Your response status could not be validated.", voice="alice")

    # Log driver response receipt event
    logger.info(
        "Driver Response Received",
        call_sid=CallSid,
        digits=Digits,
        resolved_status=outcome.get("status", "UNKNOWN"),
    )

    return Response(
        content=str(response),
        media_type="application/xml",
    )