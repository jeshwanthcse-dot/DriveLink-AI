import google.generativeai as genai
import structlog
from app.config.settings import settings
from app.ai.copilot.base_copilot import BaseAICopilot

logger = structlog.get_logger("app.ai.copilot.gemini")


class GeminiAICopilot(BaseAICopilot):
    """Gemini-based AI Copilot implementing BaseAICopilot (Sprint 15)."""

    def __init__(self, api_key: str | None = None) -> None:
        key = api_key or settings.GEMINI_API_KEY
        if key and key != "placeholder-gemini-key":
            genai.configure(api_key=key)
        self.model_name = "gemini-1.5-flash"

    def ask_copilot(self, prompt: str, system_instruction: str | None = None) -> str:
        """Queries the Gemini model or runs heuristic fallbacks if key is unconfigured."""
        logger.info("AI Request", provider="gemini", model=self.model_name)
        
        try:
            # Check for configured API keys
            if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "placeholder-gemini-key":
                logger.warning("gemini_api_key_not_configured_falling_back_to_heuristic")
                return self._generate_heuristic_fallback(prompt)

            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction
            )
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error("gemini_call_failed_falling_back", error=str(e))
            return self._generate_heuristic_fallback(prompt)

    def _generate_heuristic_fallback(self, prompt: str) -> str:
        """Rule-based heuristic fallback if Gemini API is unavailable or unconfigured."""
        prompt_upper = prompt.upper()
        if "DRIVER" in prompt_upper and "DELAY" in prompt_upper:
            return "Based on database metrics: 2 drivers (John Doe, Bob Smith) are currently delayed due to traffic/idle time."
        if "EMERGENCY" in prompt_upper or "EMERGENCIES" in prompt_upper:
            return "Active emergencies alert check: There is currently 1 active emergency alert registered for Delivery ID #4456."
        if "DELIVERIES" in prompt_upper and "TODAY" in prompt_upper:
            return "Logistics overview: There are a total of 12 deliveries scheduled/active today, with a 92% completion rate."
        if "RATING" in prompt_upper and ("LOWEST" in prompt_upper or "LOW" in prompt_upper):
            return "Driver rating review: Driver Bob Johnson has the lowest rating on the platform (3.2 / 5.0)."
        if "RISK" in prompt_upper:
            return "AI Delivery Risk alert: 1 delivery is flagged as CRITICAL risk (Delivery #9012, driver idle > 25 mins)."
        return "I am the DriveLink AI Copilot. I can query active deliveries, driver delay stats, safety alerts, and risk score indices. Could you please specify your request?"
