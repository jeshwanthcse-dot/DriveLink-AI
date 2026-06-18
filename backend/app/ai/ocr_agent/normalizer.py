import time
import structlog
from typing import Any
from app.ai.ocr_agent.schemas import NormalizedDocument, OCRDocumentType, AIResponse
from app.ai.ocr_agent.context import PipelineContext
from app.models.enums import VerificationStatus

logger = structlog.get_logger("app.ai.ocr_agent.normalizer")


class DocumentNormalizer:
    """Universal Normalizer producing standard NormalizedDocument structures from parsed inputs."""

    def normalize(
        self,
        doc_type: OCRDocumentType,
        raw_text: str,
        parsed_data: dict[str, Any],
        context: PipelineContext,
    ) -> AIResponse[NormalizedDocument]:
        """Maps parsed dictionary fields to standard NormalizedDocument schema and logs normalizer events."""
        start_time = time.perf_counter()
        logger.info("normalization_processing_started", document_type=doc_type.value)

        # Define fields critical for confidence metrics
        required_fields = self._get_required_fields(doc_type)
        
        # Invoke internal confidence evaluation engine
        overall_score, missing, warnings = self._calculate_confidence(parsed_data, required_fields)

        stage_time = time.perf_counter() - start_time
        stage_time_ms = stage_time * 1000.0

        normalized_data = {
            "document_type": doc_type,
            "document_number": parsed_data.get("document_number"),
            "holder_name": parsed_data.get("holder_name"),
            "holder_id": parsed_data.get("holder_id"),
            "vehicle_number": parsed_data.get("vehicle_number"),
            "policy_number": parsed_data.get("policy_number"),
            "permit_number": parsed_data.get("permit_number"),
            "issue_date": parsed_data.get("issue_date"),
            "expiry_date": parsed_data.get("expiry_date"),
            "issuing_authority": parsed_data.get("issuing_authority"),
            "confidence_score": overall_score,
            "missing_fields": missing,
            "warnings": warnings,
            "verification_status": VerificationStatus.PENDING,
            "raw_text": raw_text,
            "metadata": parsed_data.get("metadata", {}),
            
            # Additional metadata mapping for Sprint 13.2 refinement
            "issuer": parsed_data.get("issuing_authority"),
            "document_category": doc_type.value,
            "issuing_country": parsed_data.get("metadata", {}).get("issue_country", "IN"),
            "source_provider": context.provider,
            "processing_time_ms": stage_time_ms,
            "normalized_version": "1.1",
        }

        normalized_doc = NormalizedDocument(**normalized_data)
        
        total_time = time.perf_counter() - start_time

        logger.info(
            "Document Normalized",
            request_id=context.request_id,
            confidence_score=overall_score,
        )

        return AIResponse[NormalizedDocument](
            success=True,
            message="Document normalized successfully.",
            data=normalized_doc,
            metadata={
                "request_id": context.request_id,
                "document_id": context.document_id,
            },
            warnings=warnings,
            processing_time=total_time,
        )

    def _get_required_fields(self, doc_type: OCRDocumentType) -> list[str]:
        """Defines validation checkpoints based on standard verification guidelines."""
        if doc_type == OCRDocumentType.DRIVING_LICENSE:
            return ["document_number", "holder_name", "expiry_date"]
        elif doc_type == OCRDocumentType.INSURANCE:
            return ["policy_number", "vehicle_number", "expiry_date"]
        elif doc_type == OCRDocumentType.VEHICLE_RC:
            return ["document_number", "holder_name", "vehicle_number", "expiry_date"]
        elif doc_type == OCRDocumentType.AADHAAR:
            return ["document_number", "holder_name"]
        elif doc_type == OCRDocumentType.PAN:
            return ["document_number", "holder_name"]
        elif doc_type == OCRDocumentType.VEHICLE_PERMIT:
            return ["permit_number", "expiry_date"]
        elif doc_type == OCRDocumentType.FITNESS_CERTIFICATE:
            return ["document_number", "expiry_date"]
        elif doc_type == OCRDocumentType.PUC:
            return ["document_number", "expiry_date"]
        elif doc_type == OCRDocumentType.FASTAG_RECEIPT:
            return ["vehicle_number", "document_number"]
        return ["document_number"]

    def _calculate_confidence(
        self,
        parsed_data: dict[str, Any],
        required_fields: list[str],
    ) -> tuple[float, list[str], list[str]]:
        """Confidence Engine calculating overall scores, missing parameters and warnings."""
        missing = []
        warnings = []
        filled_count = 0
        total_count = len(required_fields)

        for field in required_fields:
            val = parsed_data.get(field)
            if val is None or val == "":
                meta = parsed_data.get("metadata", {})
                val = meta.get(field)
                
            if val is None or val == "":
                missing.append(field)
                warnings.append(f"Required field '{field}' is missing or unparsed.")
            else:
                filled_count += 1

        # Max confidence base for OCR parser is 0.95, penalized by missing fields
        base_confidence = 0.95
        if total_count > 0:
            overall_score = round((filled_count / total_count) * base_confidence, 2)
        else:
            overall_score = 0.80

        if overall_score < 0.75:
            warnings.append(f"Low overall document confidence score: {overall_score}")

        return overall_score, missing, warnings
