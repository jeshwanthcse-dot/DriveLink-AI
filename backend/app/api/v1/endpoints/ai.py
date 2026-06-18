import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.controllers.ai import AIController
from app.controllers.analytics import AnalyticsController
from app.database.database import get_db
from app.schemas.ai import CopilotChatPayload, RouteOptimizationInput

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])


def get_ai_controller(db: Session = Depends(get_db)) -> AIController:
    """Dependency injection helper to load AIController."""
    return AIController(db)


def get_analytics_controller(db: Session = Depends(get_db)) -> AnalyticsController:
    """Dependency injection helper to load AnalyticsController."""
    return AnalyticsController(db)


@router.post("/route/optimize")
async def optimize_route(
    payload: RouteOptimizationInput,
    controller: AIController = Depends(get_ai_controller),
) -> JSONResponse:
    """Computes optimized delivery order sequence and overall distance metrics."""
    return controller.optimize_route(payload)


@router.get("/eta/{delivery_id}")
async def get_predicted_eta(
    delivery_id: uuid.UUID,
    controller: AIController = Depends(get_ai_controller),
) -> JSONResponse:
    """Retrieves predicted ETA, confidence score, and delay risk status for a delivery."""
    return controller.predict_eta(delivery_id)


@router.get("/risk/{delivery_id}")
async def get_delivery_risk(
    delivery_id: uuid.UUID,
    controller: AIController = Depends(get_ai_controller),
) -> JSONResponse:
    """Calculates live risk score (0-100) and risk level for a delivery."""
    return controller.evaluate_risk(delivery_id)


@router.post("/copilot/chat")
async def copilot_chat(
    payload: CopilotChatPayload,
    controller: AIController = Depends(get_ai_controller),
) -> JSONResponse:
    """Processes Copilot chat messages and returns AI summaries."""
    return controller.copilot_chat(payload)


@router.get("/dashboard")
async def get_dashboard_summary(
    controller: AnalyticsController = Depends(get_analytics_controller),
) -> JSONResponse:
    """Retrieves standard analytics summary details for the AI Dashboard."""
    return controller.get_overview()


@router.get("/insights")
async def get_ai_insights(
    controller: AIController = Depends(get_ai_controller),
) -> JSONResponse:
    """Retrieves AI insights reporting details generated using Gemini Summaries."""
    return controller.get_insights()
