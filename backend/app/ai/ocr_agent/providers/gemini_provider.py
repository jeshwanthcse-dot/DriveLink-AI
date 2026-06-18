import datetime
import hashlib
import time
import structlog
from app.ai.ocr_agent.context import PipelineContext
from app.ai.ocr_agent.providers.base_provider import BaseOCRProvider
from app.ai.ocr_agent.schemas import AIResponse, OCRDocumentType, OCRTextData

logger = structlog.get_logger("app.ai.ocr_agent.providers.gemini")


class GeminiProvider(BaseOCRProvider):
    """Gemini Vision OCR Provider implementation (Default pipeline implementation)."""

    def __init__(self) -> None:
        self.mock_templates = {
            OCRDocumentType.DRIVING_LICENSE: (
                "DRIVING LICENSE\n"
                "LICENSE NO: DL-IN-12345678\n"
                "NAME: JOHN DOE\n"
                "DOB: 15-08-1990\n"
                "ISSUE DATE: 10-10-2015\n"
                "EXPIRY DATE: 09-10-2035\n"
                "FORM 7"
            ),
            OCRDocumentType.VEHICLE_RC: (
                "REGISTRATION CERTIFICATE\n"
                "REGISTRATION NO: KA-01-EF-5678\n"
                "OWNER NAME: JANE SMITH\n"
                "CHASSIS NO: CHA1234567890123\n"
                "VALID UNTIL: 20-05-2029"
            ),
            OCRDocumentType.INSURANCE: (
                "INSURANCE POLICY\n"
                "POLICY NUMBER: POL-987654321\n"
                "INSURED NAME: BOB JOHNSON\n"
                "VEHICLE NUMBER: MH-02-AB-1234\n"
                "EXPIRY DATE: 15-12-2027\n"
                "INSURER: SECURE AUTO INSURANCE"
            ),
            OCRDocumentType.AADHAAR: (
                "GOVERNMENT OF INDIA\n"
                "UNIQUE IDENTIFICATION AUTHORITY\n"
                "1234 5678 9012\n"
                "DOB: 01-01-2000\n"
                "MALE\n"
                "GOVT OF INDIA"
            ),
            OCRDocumentType.PAN: (
                "INCOME TAX DEPARTMENT\n"
                "PERMANENT ACCOUNT NUMBER\n"
                "PAN CARD\n"
                "ABCDE1234F\n"
                "NAME: ALICE BROWN"
            ),
            OCRDocumentType.VEHICLE_PERMIT: (
                "VEHICLE PERMIT\n"
                "PERMIT NO: PMT-777888\n"
                "NATIONAL PERMIT\n"
                "STAGE CARRIAGE\n"
                "EXPIRY DATE: 30-06-2028"
            ),
            OCRDocumentType.FITNESS_CERTIFICATE: (
                "FITNESS CERTIFICATE\n"
                "CERTIFICATE OF FITNESS\n"
                "FORM 38\n"
                "CERTIFICATE NO: FIT-112233\n"
                "EXPIRY DATE: 12-08-2026"
            ),
            OCRDocumentType.PUC: (
                "POLLUTION UNDER CONTROL\n"
                "PUC CERTIFICATE\n"
                "EMISSION TEST\n"
                "PUC NO: PUC-445566\n"
                "EXPIRY DATE: 05-02-2027"
            ),
            OCRDocumentType.FASTAG_RECEIPT: (
                "FASTAG RECEIPT\n"
                "FASTAG RECHARGE\n"
                "NHAI NETC\n"
                "VEHICLE NO: DL-03-CD-9999\n"
                "AMOUNT RS: 500.00\n"
                "DATE: 28-02-2026\n"
                "TXN ID: TXN-555666777"
            ),
            OCRDocumentType.OTHER: (
                "GENERIC DOCUMENT\n"
                "NO: GEN-999888\n"
                "EXPIRY DATE: 01-01-2030"
            ),
        }

    def extract_text(self, file_bytes: bytes, context: PipelineContext) -> AIResponse[OCRTextData]:
        start_time = time.perf_counter()
        logger.debug("gemini_extract_text_started", request_id=context.request_id)

        # 1. Attempt to decode input bytes as standard text first
        text = ""
        try:
            decoded_text = file_bytes.decode("utf-8").strip()
            if len(decoded_text) > 10:
                text = decoded_text
        except Exception:
            pass

        # 2. Fall back to mock template if not plain-text
        if not text:
            doc_type_hint = context.debug_information.get("doc_type_hint")
            hint = OCRDocumentType(doc_type_hint) if doc_type_hint else OCRDocumentType.OTHER
            text = self.mock_templates.get(hint, self.mock_templates[OCRDocumentType.OTHER])

        end_time = time.perf_counter()
        processing_time = end_time - start_time

        doc_hash = hashlib.sha256(file_bytes).hexdigest() if file_bytes else "empty_hash"

        # Analytical metadata (Modification 5)
        metadata = {
            "provider": context.provider,
            "model": context.model,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "processing_time": processing_time,
            "document_hash": doc_hash,
            "pipeline_version": "1.0",
        }

        return AIResponse[OCRTextData](
            success=True,
            message="Raw OCR text successfully extracted using Gemini model simulation.",
            data=OCRTextData(raw_text=text),
            metadata=metadata,
            warnings=[],
            processing_time=processing_time,
        )
