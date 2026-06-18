import datetime
import time
import uuid
import structlog
from sqlalchemy.orm import Session
from app.models.enums import VerificationStatus
from app.repositories.document import DocumentRepository
from app.ai.ocr_agent.schemas import AIResponse, ValidationSummary
from app.ai.ocr_agent.context import PipelineContext

logger = structlog.get_logger("app.ai.validation_agent")


class ValidationAgent:
    """Validation Agent checking metadata constraints, expiry, and duplication."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = DocumentRepository(db)

    def validate_document(
        self,
        driver_id: uuid.UUID,
        doc_number: str | None,
        expiry_date: datetime.datetime,
        confidence_score: float,
        context: PipelineContext,
        missing_fields: list[str] | None = None,
        warnings: list[str] | None = None,
    ) -> AIResponse[ValidationSummary]:
        """
        Evaluates document validity parameters.
        Returns:
            AIResponse[ValidationSummary]: Wrap containing verification details and recommendation.
        """
        start_time = time.perf_counter()
        
        missing = list(missing_fields) if missing_fields else []
        warns = list(warnings) if warnings else []
        
        status = VerificationStatus.VERIFIED
        rec = "Automatically Verified"

        # 1. Check if required fields are missing
        if missing:
            status = VerificationStatus.MANUAL_REVIEW
            rec = "Manual Review Required"
            warns.append("Document lacks some required fields.")

        # 2. Check Expiry (expiry < today/utcnow)
        utc_now = datetime.datetime.now(datetime.timezone.utc)
        if expiry_date < utc_now:
            status = VerificationStatus.EXPIRED
            rec = "Document Expired"
            warns.append(f"Document expired on {expiry_date.isoformat()}.")

        # 3. Check Confidence (can override VERIFIED status to MANUAL_REVIEW or REJECTED)
        # Only apply confidence limits if not already marked EXPIRED
        if status != VerificationStatus.EXPIRED:
            if confidence_score >= 0.90:
                if status != VerificationStatus.MANUAL_REVIEW:
                    status = VerificationStatus.VERIFIED
                    rec = "Automatically Verified"
            elif 0.75 <= confidence_score < 0.90:
                status = VerificationStatus.MANUAL_REVIEW
                rec = "Manual Review Required"
                warns.append(f"Confidence score {confidence_score} requires manual review.")
            else:  # confidence_score < 0.75
                status = VerificationStatus.REJECTED
                rec = "Rejected Due To Low Confidence"
                warns.append(f"Confidence score {confidence_score} is below rejection threshold.")

        # 4. Check Duplicate registered under another driver
        if doc_number:
            existing_docs = self.repo.filter(document_number=doc_number)
            for doc in existing_docs:
                if doc.driver_id != driver_id and doc.verification_status == VerificationStatus.VERIFIED:
                    status = VerificationStatus.REJECTED
                    rec = "Rejected Due to Duplicate Document"
                    warns.append(f"Duplicate document number {doc_number} detected under driver {doc.driver_id}.")
                    break

        validation_time = time.perf_counter() - start_time
        
        logger.info(
            "Validation Completed",
            request_id=context.request_id,
            verification_status=status.value,
            confidence_score=confidence_score,
        )

        summary = ValidationSummary(
            verification_status=status,
            confidence_score=confidence_score,
            missing_fields=missing,
            warnings=warns,
            recommendation=rec,
        )

        return AIResponse[ValidationSummary](
            success=(status in (VerificationStatus.VERIFIED, VerificationStatus.PENDING)),
            message=f"Validation completed. Recommendation: {rec}",
            data=summary,
            metadata={
                "request_id": context.request_id,
                "document_id": context.document_id,
                "validation_time": validation_time,
            },
            warnings=warns,
            processing_time=validation_time,
        )
