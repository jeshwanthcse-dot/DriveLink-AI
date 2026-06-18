import time
import structlog
from app.ai.ocr_agent.schemas import AIResponse, OCRDocumentType, OCRTextData, ParsedDocumentData
from app.ai.ocr_agent.context import PipelineContext
from app.ai.ocr_agent.providers.base_provider import BaseOCRProvider
from app.ai.ocr_agent.providers.gemini_provider import GeminiProvider

# Import specific parsers
from app.ai.ocr_agent.parsers.license_parser import parse_license
from app.ai.ocr_agent.parsers.insurance_parser import parse_insurance
from app.ai.ocr_agent.parsers.rc_parser import parse_rc
from app.ai.ocr_agent.parsers.aadhaar_parser import parse_aadhaar
from app.ai.ocr_agent.parsers.pan_parser import parse_pan
from app.ai.ocr_agent.parsers.permit_parser import parse_permit
from app.ai.ocr_agent.parsers.fitness_parser import parse_fitness
from app.ai.ocr_agent.parsers.puc_parser import parse_puc
from app.ai.ocr_agent.parsers.fastag_parser import parse_fastag
from app.ai.ocr_agent.parsers.generic_parser import parse_generic

logger = structlog.get_logger("app.ai.ocr_agent.extractor")


class OCRExtractor:
    """Simulates OCR text extraction and routes raw OCR text to appropriate document type parsers."""

    def __init__(self, provider: BaseOCRProvider | None = None) -> None:
        self.provider = provider or GeminiProvider()

    def extract_text(self, file_bytes: bytes, context: PipelineContext) -> AIResponse[OCRTextData]:
        """Delegates OCR text extraction to the configured provider."""
        return self.provider.extract_text(file_bytes, context)

    def parse_text(self, text: str, doc_type: OCRDocumentType, context: PipelineContext) -> AIResponse[ParsedDocumentData]:
        """Routes the raw OCR text to the corresponding document parser and wraps in AIResponse."""
        start_time = time.perf_counter()
        logger.debug("ocr_parse_text_routing", document_type=doc_type.value)

        if doc_type == OCRDocumentType.DRIVING_LICENSE:
            parsed = parse_license(text)
        elif doc_type == OCRDocumentType.INSURANCE:
            parsed = parse_insurance(text)
        elif doc_type == OCRDocumentType.VEHICLE_RC:
            parsed = parse_rc(text)
        elif doc_type == OCRDocumentType.AADHAAR:
            parsed = parse_aadhaar(text)
        elif doc_type == OCRDocumentType.PAN:
            parsed = parse_pan(text)
        elif doc_type == OCRDocumentType.VEHICLE_PERMIT:
            parsed = parse_permit(text)
        elif doc_type == OCRDocumentType.FITNESS_CERTIFICATE:
            parsed = parse_fitness(text)
        elif doc_type == OCRDocumentType.PUC:
            parsed = parse_puc(text)
        elif doc_type == OCRDocumentType.FASTAG_RECEIPT:
            parsed = parse_fastag(text)
        else:
            parsed = parse_generic(text)

        # Count fields parsed
        fields_parsed_count = sum(1 for v in parsed.values() if v is not None)

        metadata = parsed.get("metadata", {})
        metadata["parser_routed"] = doc_type.value
        metadata["request_id"] = context.request_id

        parsed_data = ParsedDocumentData(
            document_number=parsed.get("document_number"),
            holder_name=parsed.get("holder_name"),
            holder_id=parsed.get("holder_id"),
            vehicle_number=parsed.get("vehicle_number"),
            policy_number=parsed.get("policy_number"),
            permit_number=parsed.get("permit_number"),
            issue_date=parsed.get("issue_date"),
            expiry_date=parsed.get("expiry_date"),
            issuing_authority=parsed.get("issuing_authority"),
            metadata=metadata,
        )

        processing_time = time.perf_counter() - start_time

        logger.info(
            "Document Parsed",
            request_id=context.request_id,
            fields_parsed_count=fields_parsed_count,
        )

        return AIResponse[ParsedDocumentData](
            success=True,
            message=f"Fields parsed successfully for document type {doc_type.value}.",
            data=parsed_data,
            metadata={
                "request_id": context.request_id,
                "document_id": context.document_id,
            },
            warnings=[],
            processing_time=processing_time,
        )
