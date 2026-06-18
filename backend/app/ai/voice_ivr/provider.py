from abc import ABC, abstractmethod
import random
from typing import Any


class VoiceProviderInterface(ABC):
    """Abstract interface defining the contract for telephony IVR provider integrations (SOLID)."""

    @abstractmethod
    def make_ivr_call(self, to_phone: str, prompt_message: str) -> dict[str, Any]:
        """
        Triggers an outbound IVR voice call.
        Returns:
            dict containing call_status, call_duration (seconds), and driver_response.
        """
        pass


class MockVoiceProvider(VoiceProviderInterface):
    """Telephony simulator for driver safety check calls, bypassing Twilio/Exotel for mock tests."""

    def make_ivr_call(self, to_phone: str, prompt_message: str) -> dict[str, Any]:
        # Simulate realistic telephony states and driver responses
        outcomes = [
            {
                "call_status": "COMPLETED",
                "call_duration": 18.5,
                "driver_response": "Safe - Driver confirmed status is fine.",
            },
            {
                "call_status": "COMPLETED",
                "call_duration": 34.2,
                "driver_response": "Assistance Required - Driver flagged delays / issues.",
            },
            {
                "call_status": "NO_ANSWER",
                "call_duration": 0.0,
                "driver_response": None,
            },
            {
                "call_status": "BUSY",
                "call_duration": 0.0,
                "driver_response": None,
            },
        ]
        # Heavily bias toward 'Safe' response for testing flows
        weights = [0.80, 0.10, 0.05, 0.05]
        return random.choices(outcomes, weights=weights)[0]
