from fastapi import APIRouter

from app.utils.response import success_response

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("")
async def get_documents():
    """Placeholder for OCR document verification endpoints (Sprint 11)."""
    return success_response(
        message="Documents endpoint placeholder - Feature coming in Sprint 11",
        data=[]
    )
