import datetime
import time
import uuid
import structlog
from sqlalchemy.orm import Session

from app.models.enums import DocumentType, VerificationStatus
from app.ai.ocr_agent.schemas import NormalizedDocument, OCRDocumentType, AIResponse
from app.ai.ocr_agent.classifier import DocumentClassifier
from app.ai.ocr_agent.context import PipelineContext
from app.ai.ocr_agent.extractor import OCRExtractor
from app.ai.ocr_agent.normalizer import DocumentNormalizer
from app.ai.ocr_agent.mapper import DocumentMapper
from app.ai.validation_agent.agent import ValidationAgent
from app.schemas.document import DriverDocumentCreate

logger = structlog.get_logger("app.ai.ocr_agent.service")


class OCRNormalizationService:
    """
    Coordinator service integrating OCR Extraction, Classification, Parsing,
    Normalization, and Validation for DriveLink AI documents.
    """

    def __init__(self, db: Session) -> None:
        self.db = db
        self.classifier = DocumentClassifier()
        self.extractor = OCRExtractor()
        self.normalizer = DocumentNormalizer()
        self.validation_agent = ValidationAgent(db)
        self.mapper = DocumentMapper()

    def process_document(
        self,
        file_bytes: bytes,
        driver_id: uuid.UUID,
        doc_type_hint: OCRDocumentType | None = None,
        context: PipelineContext | None = None,
    ) -> AIResponse[NormalizedDocument]:
        """
        Orchestrates the entire OCR document normalization pipeline.
        1. Extract text (delegated to provider)
        2. Classify document type
        3. Route to specific document parser
        4. Normalize fields and compute confidence
        5. Validate using ValidationAgent
        6. Return standard AIResponse wrapping NormalizedDocument
        """
        start_time = time.perf_counter()
        
        # Initialize context if not provided
        context = context or PipelineContext()
        if doc_type_hint:
            context.debug_information["doc_type_hint"] = doc_type_hint.value

        logger.info(
            "Pipeline Started",
            request_id=context.request_id,
            document_id=context.document_id,
        )

        # 1. Extract raw OCR text via provider
        extract_res = self.extractor.extract_text(file_bytes, context)
        raw_text = extract_res.data.raw_text

        # 2. Classify document type
        classify_res = self.classifier.classify_text(raw_text, context)
        doc_type = classify_res.data.document_type

        # Fallback to hint if classification returns OTHER but hint was specified
        if doc_type == OCRDocumentType.OTHER and doc_type_hint:
            logger.info(
                "ocr_classification_fallback_to_hint",
                classified=doc_type.value,
                hint=doc_type_hint.value,
            )
            doc_type = doc_type_hint

        # 3. Route to parser and extract fields
        parse_res = self.extractor.parse_text(raw_text, doc_type, context)
        parsed_data = parse_res.data

        # 4. Normalize structure and calculate confidence
        # Convert ParsedDocumentData schema back to dict for normalizer compat
        parsed_dict = parsed_data.model_dump()
        normalize_res = self.normalizer.normalize(doc_type, raw_text, parsed_dict, context)
        normalized_doc = normalize_res.data

        # 5. Determine datetime representation of expiry for validation checks
        if normalized_doc.expiry_date:
            expiry_dt = datetime.datetime.combine(
                normalized_doc.expiry_date,
                datetime.time.min,
                tzinfo=datetime.timezone.utc
            )
        else:
            expiry_dt = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365 * 100)

        # 6. Execute Validation Agent checks (returns AIResponse[ValidationSummary])
        val_res = self.validation_agent.validate_document(
            driver_id=driver_id,
            doc_number=normalized_doc.document_number,
            expiry_date=expiry_dt,
            confidence_score=normalized_doc.confidence_score,
            context=context,
            missing_fields=normalized_doc.missing_fields,
            warnings=normalized_doc.warnings,
        )
        
        # Sync validation status back to NormalizedDocument
        normalized_doc.verification_status = val_res.data.verification_status

        total_time = time.perf_counter() - start_time

        return AIResponse[NormalizedDocument](
            success=val_res.success,
            message=val_res.message,
            data=normalized_doc,
            metadata={
                "request_id": context.request_id,
                "document_id": context.document_id,
                "overall_validation_recommendation": val_res.data.recommendation,
            },
            warnings=normalized_doc.warnings + val_res.warnings,
            processing_time=total_time,
        )

    @staticmethod
    def map_ocr_type_to_db_type(ocr_type: OCRDocumentType) -> DocumentType:
        """Translates OCRDocumentType to core database DocumentType."""
        return DocumentMapper.map_ocr_type_to_db_type(ocr_type)

    @staticmethod
    def map_normalized_to_db_schema(
        driver_id: uuid.UUID,
        doc: NormalizedDocument,
        document_url: str,
    ) -> DriverDocumentCreate:
        """
        Converts NormalizedDocument to DriverDocumentCreate database schema.
        Routes mapping operation directly through DocumentMapper to ensure centralized persistence mapping.
        """
        context = PipelineContext()
        mapper = DocumentMapper()
        mapped_res = mapper.to_db_model(doc, driver_id, document_url, context)
        db_model = mapped_res.data
        
        return DriverDocumentCreate(
            driver_id=db_model.driver_id,
            document_number=db_model.document_number,
            document_type=db_model.document_type,
            verification_status=db_model.verification_status,
            document_url=db_model.document_url,
            confidence_score=db_model.confidence_score,
            expiry_date=db_model.expiry_date,
        )
