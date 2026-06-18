from fastapi import APIRouter

from app.config.settings import settings

router = APIRouter()


@router.get("/health", tags=["health"])
async def get_health() -> dict[str, str]:
    """Returns the health status of the backend API service."""
    return {
        "status": "healthy",
        "service": "DriveLink AI Backend",
        "version": settings.APP_VERSION,
    }
