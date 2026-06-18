from fastapi import APIRouter

from app.utils.response import success_response

router = APIRouter(prefix="/ratings", tags=["ratings"])


@router.get("")
async def get_ratings():
    """Placeholder for ratings endpoints (Sprint 11)."""
    return success_response(
        message="Ratings endpoint placeholder - Feature coming in Sprint 11",
        data=[]
    )
