import datetime
import time
import uuid
import structlog
from app.models.document import DriverDocument
from app.models.enums import DocumentType
from app.ai.ocr_agent.schemas import NormalizedDocument, OCRDocumentType, AIResponse
from app.ai.ocr_agent.context import PipelineContext

logger = structlog.get_logger("app.ai.ocr_agent.mapper")


class DocumentMapper:
    """Persistence mapper to cleanly map NormalizedDocument schemas to DriverDocument SQLAlchemy entities."""

    @staticmethod
    def map_ocr_type_to_db_type(ocr_type: OCRDocumentType) -> DocumentType:
        """Translates OCRDocumentType enums into core database DocumentType enums."""
        mapping = {
            OCRDocumentType.DRIVING_LICENSE: DocumentType.LICENSE,
            OCRDocumentType.VEHICLE_RC: DocumentType.RC,
            OCRDocumentType.INSURANCE: DocumentType.INSURANCE,
            OCRDocumentType.AADHAAR: DocumentType.AADHAAR,
            OCRDocumentType.PAN: DocumentType.PAN,
        }
        return mapping.get(ocr_type, DocumentType.OTHER)

    def to_db_model(
        self,
        doc: NormalizedDocument,
        driver_id: uuid.UUID,
        document_url: str,
        context: PipelineContext,
    ) -> AIResponse[DriverDocument]:
        """Maps NormalizedDocument details to the SQLAlchemy DriverDocument model."""
        start_time = time.perf_counter()

        db_doc_type = self.map_ocr_type_to_db_type(doc.document_type)

        if doc.expiry_date:
            expiry_dt = datetime.datetime.combine(
                doc.expiry_date,
                datetime.time.min,
                tzinfo=datetime.timezone.utc
            )
        else:
            # For documents without expiry dates, use a default far-future timestamp (100 years out)
            expiry_dt = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365 * 100)

        db_model = DriverDocument(
            id=uuid.uuid4(),
            driver_id=driver_id,
            document_number=doc.document_number,
            document_type=db_doc_type,
            verification_status=doc.verification_status,
            document_url=document_url,
            confidence_score=doc.confidence_score,
            expiry_date=expiry_dt,
        )

        processing_time = time.perf_counter() - start_time

        logger.info(
            "Persistence Mapping Ready",
            request_id=context.request_id,
            driver_id=str(driver_id),
            document_type=db_doc_type.value,
        )

        return AIResponse[DriverDocument](
            success=True,
            message="Successfully mapped NormalizedDocument structure to database entity.",
            data=db_model,
            metadata={
                "request_id": context.request_id,
                "document_id": context.document_id,
            },
            warnings=[],
            processing_time=processing_time,
        )
