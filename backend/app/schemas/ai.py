import datetime
import uuid
from typing import Any
from pydantic import BaseModel, Field


class ETAPredictionResponse(BaseModel):
    estimated_arrival: datetime.datetime
    confidence_score: float
    delay_prediction: str
    eta_minutes: int | None = None
    distance_km: float | None = None
    confidence: float | None = None


class RouteOptimizationInput(BaseModel):
    pickup: str
    drop: str
    delivery_ids: list[uuid.UUID]
    priority: str | None = "medium"


class OptimizedDelivery(BaseModel):
    delivery_id: uuid.UUID
    sequence: int
    pickup_location: str
    drop_location: str
    estimated_distance_km: float
    estimated_duration_min: float


class RouteOptimizationResponse(BaseModel):
    optimized_delivery_order: list[OptimizedDelivery]
    total_estimated_distance_km: float
    total_estimated_duration_min: float


class CopilotChatPayload(BaseModel):
    message: str


class CopilotChatResponse(BaseModel):
    response: str


class RiskScoreResponse(BaseModel):
    delivery_id: uuid.UUID
    score: float
    level: str  # LOW, MEDIUM, HIGH, CRITICAL


class AnalyticsOverviewResponse(BaseModel):
    total_deliveries: int
    completion_rate: float
    total_alerts: int
    active_alerts: int
    resolved_alerts: int
    driver_avg_score: float
    risk_distribution: dict[str, int]


class DriverPerformanceResponse(BaseModel):
    driver_id: uuid.UUID
    full_name: str
    performance_score: float
    completed_deliveries_count: int
    safety_alerts_count: int
    average_rating: float
    idle_time_total_minutes: float


class AIInsightsResponse(BaseModel):
    top_performer: str
    most_delayed_route: str
    highest_risk_driver: str
    longest_idle_vehicle: str
    best_organization_efficiency: str
    summary: str
