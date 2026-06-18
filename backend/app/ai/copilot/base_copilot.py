from abc import ABC, abstractmethod


class BaseAICopilot(ABC):
    """Abstract interface defining the contract for AI Copilot LLM providers (SOLID)."""

    @abstractmethod
    def ask_copilot(self, prompt: str, system_instruction: str | None = None) -> str:
        """Sends a query prompt to the configured LLM and returns the text response."""
        pass
