from twilio.rest import Client
from app.config.settings import settings


class TwilioProvider:

    def __init__(self):

        self.client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
        )

    def call_driver(self, phone_number: str):

        return self.client.calls.create(

            to=phone_number,

            from_=settings.TWILIO_PHONE_NUMBER,

            url=f"{settings.PUBLIC_BACKEND_URL}/api/v1/voice/twiml",

            method="POST",

        )