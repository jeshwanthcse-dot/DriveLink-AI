import uuid
import structlog
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.schemas.ai import CopilotChatPayload, ETAPredictionResponse, RiskScoreResponse, AIInsightsResponse, RouteOptimizationInput
from app.ai.delivery_intelligence.eta import ETAPredictionEngine
from app.ai.delivery_intelligence.risk import DeliveryRiskEvaluator
from app.ai.delivery_intelligence.insights import AIInsightsGenerator
from app.ai.copilot.gemini_copilot import GeminiAICopilot
from app.services.route_optimizer import RouteOptimizationEngine
from app.utils.response import success_response
from app.models.driver import Driver
from app.models.delivery import Delivery
from app.models.safety_alert import AISafetyAlert

logger = structlog.get_logger("app.controllers.ai")


class AIController:
    """Controller layer handling HTTP-to-domain coordination for all AI services (Sprint 15)."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.eta_engine = ETAPredictionEngine(db)
        self.risk_evaluator = DeliveryRiskEvaluator(db)
        self.insights_generator = AIInsightsGenerator(db)
        self.copilot = GeminiAICopilot()
        self.route_optimizer = RouteOptimizationEngine(db)

    def optimize_route(self, payload: RouteOptimizationInput) -> JSONResponse:
        """Invokes route optimization engine and returns optimized order and metrics."""
        result = self.route_optimizer.optimize_route(
            pickup=payload.pickup,
            drop=payload.drop,
            delivery_ids=payload.delivery_ids,
            priority=payload.priority,
        )
        return success_response(
            message="Route optimized successfully",
            data=result
        )

    def predict_eta(self, delivery_id: uuid.UUID) -> JSONResponse:
        """Invokes prediction engine and returns the predicted ETA details."""
        result = self.eta_engine.predict_eta(delivery_id)
        
        logger.info(
            "ETA Generated",
            delivery_id=str(delivery_id),
            estimated_arrival=result["estimated_arrival"].isoformat(),
            confidence_score=result["confidence_score"],
        )
        
        return success_response(
            message="ETA predicted successfully",
            data={
                "estimated_arrival": result["estimated_arrival"].isoformat(),
                "confidence_score": result["confidence_score"],
                "delay_prediction": result["delay_prediction"],
                "eta_minutes": result["eta_minutes"],
                "distance_km": result["distance_km"],
                "confidence": result["confidence"],
            }
        )

    def evaluate_risk(self, delivery_id: uuid.UUID) -> JSONResponse:
        """Invokes risk score engine and returns calculated risk score & level."""
        result = self.risk_evaluator.calculate_risk(delivery_id)
        
        logger.info(
            "Risk Calculated",
            delivery_id=str(delivery_id),
            score=result["score"],
            level=result["level"],
        )
        
        return success_response(
            message="Delivery risk score calculated successfully",
            data={
                "delivery_id": str(delivery_id),
                "score": result["score"],
                "level": result["level"],
            }
        )

    def copilot_chat(self, payload: CopilotChatPayload, organization_id: uuid.UUID | None = None) -> JSONResponse:
        """Compiles active DB telemetry context and feeds it into the Copilot chat responder."""
        message = payload.message
        
        # Pull telemetry database details to inject context into prompt
        drivers = self.db.scalars(select(Driver)).all()
        deliveries = self.db.scalars(select(Delivery)).all()
        alerts = self.db.scalars(select(AISafetyAlert)).all()
        
        prompt_context = (
            f"Active DB Context Summary:\n"
            f"- Total Driver Profiles: {len(drivers)}\n"
            f"- Total Logistics Deliveries: {len(deliveries)}\n"
            f"- Total Telemetry Safety Alerts: {len(alerts)}\n"
        )
        
        full_prompt = f"{prompt_context}\nUser Request: {message}\nProvide a direct, ops-ready summary answer."
        response_text = self.copilot.ask_copilot(
            full_prompt,
            system_instruction="You are the DriveLink AI Operations Copilot assistant."
        )

        logger.info(
            "Copilot Response",
            query=message,
            response=response_text[:100],
        )

        return success_response(
            message="Copilot chat response successfully generated.",
            data={"response": response_text}
        )

    def get_insights(self) -> JSONResponse:
        """Compiles system summaries and returns AI insights recommendation report."""
        result = self.insights_generator.generate_insights()
        return success_response(
            message="AI Insights report generated successfully",
            data=result,
        )
