from abc import ABC, abstractmethod
from app.ai.ocr_agent.context import PipelineContext
from app.ai.ocr_agent.schemas import AIResponse, OCRTextData


class BaseOCRProvider(ABC):
    """Abstract Base Class representing an OCR provider."""

    @abstractmethod
    def extract_text(self, file_bytes: bytes, context: PipelineContext) -> AIResponse[OCRTextData]:
        """Extracts raw text from the provided document file bytes using the pipeline context."""
        pass
