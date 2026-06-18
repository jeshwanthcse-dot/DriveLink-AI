from fastapi import APIRouter
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse, Gather

router = APIRouter()


@router.post("/twiml")
async def generate_twiml():

    response = VoiceResponse()

    gather = Gather(

        num_digits=1,

        action="/api/v1/voice/response",

        method="POST"

    )

    gather.say(

        """
        Hello.

        This is an automated safety check from DriveLink AI.

        We detected your vehicle has been stationary for more than twenty minutes.

        Press 1 if everything is okay.

        Press 2 if you are loading or unloading.

        Press 3 if your vehicle has broken down.

        Press 4 if this is an emergency.

        """,

        voice="alice"

    )

    response.append(gather)

    response.redirect("/api/v1/voice/twiml")

    return Response(

        content=str(response),

        media_type="application/xml"

    )