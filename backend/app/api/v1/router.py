from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai,
    deliveries,
    documents,
    drivers,
    health,
    notifications,
    organizations,
    ratings,
    tracking,
    voice,
    safety,
    analytics,
)

v1_router = APIRouter()

# Register all v1 endpoints
v1_router.include_router(health.router)
v1_router.include_router(drivers.router)
v1_router.include_router(organizations.router)
v1_router.include_router(deliveries.router)
v1_router.include_router(tracking.router)
v1_router.include_router(ratings.router)
v1_router.include_router(documents.router)
v1_router.include_router(notifications.router)
v1_router.include_router(ai.router)
v1_router.include_router(voice.router)
v1_router.include_router(safety.router)
v1_router.include_router(analytics.router)