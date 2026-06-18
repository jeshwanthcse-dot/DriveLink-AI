import re
import time
import structlog
from app.ai.ocr_agent.context import PipelineContext
from app.ai.ocr_agent.schemas import AIResponse, OCRDocumentType, ClassificationData

logger = structlog.get_logger("app.ai.ocr_agent.classifier")


class DocumentClassifier:
    """Classifies document type using OCR raw text keywords and regex matches."""

    def classify_text(self, text: str, context: PipelineContext) -> AIResponse[ClassificationData]:
        """Classifies document type from OCR text and logs the classification event."""
        start_time = time.perf_counter()
        text_upper = text.upper()

        doc_type = OCRDocumentType.OTHER

        if re.search(r"DRIVING\s+LICENSE|DRIVERS\s+LICENSE|LICENCE\s+NO|FORM\s+7", text_upper):
            doc_type = OCRDocumentType.DRIVING_LICENSE
        elif re.search(r"REGISTRATION\s+CERTIFICATE|FORM\s+23|MVR\s+REGISTRATION|CHASSIS\s+NO", text_upper):
            doc_type = OCRDocumentType.VEHICLE_RC
        elif re.search(r"POLICY\s+NUMBER|INSURANCE\s+INSURED\s+NAME|INSURER", text_upper):
            doc_type = OCRDocumentType.INSURANCE
        elif re.search(r"UNIQUE\s+IDENTIFICATION\s+AUTHORITY|AADHAAR|MALE|FEMALE|GOVT\s+OF\s+INDIA", text_upper):
            doc_type = OCRDocumentType.AADHAAR
        elif re.search(r"INCOME\s+TAX\s+DEPARTMENT|PERMANENT\s+ACCOUNT\s+NUMBER|PAN\s+CARD", text_upper):
            doc_type = OCRDocumentType.PAN
        elif re.search(r"PERMIT\s+NO|VEHICLE\s+PERMIT|NATIONAL\s+PERMIT|STAGE\s+CARRIAGE", text_upper):
            doc_type = OCRDocumentType.VEHICLE_PERMIT
        elif re.search(r"FITNESS\s+CERTIFICATE|CERTIFICATE\s+OF\s+FITNESS|FORM\s+38", text_upper):
            doc_type = OCRDocumentType.FITNESS_CERTIFICATE
        elif re.search(r"POLLUTION\s+UNDER\s+CONTROL|PUC\s+CERTIFICATE|EMISSION\s+TEST", text_upper):
            doc_type = OCRDocumentType.PUC
        elif re.search(r"FASTAG\s+RECEIPT|FASTAG\s+RECHARGE|NHAI|NETC|M-TAG", text_upper):
            doc_type = OCRDocumentType.FASTAG_RECEIPT

        processing_time = time.perf_counter() - start_time

        logger.info(
            "Document Classified",
            request_id=context.request_id,
            document_type=doc_type.value,
        )

        return AIResponse[ClassificationData](
            success=True,
            message=f"Document identified as {doc_type.value}.",
            data=ClassificationData(document_type=doc_type),
            metadata={
                "request_id": context.request_id,
                "document_id": context.document_id,
            },
            warnings=[],
            processing_time=processing_time,
        )
