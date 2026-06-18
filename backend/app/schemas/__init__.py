from app.schemas.driver import DriverBase, DriverCreate, DriverUpdate, DriverResponse
from app.schemas.organization import (
    OrganizationBase,
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationResponse,
)
from app.schemas.delivery import DeliveryBase, DeliveryCreate, DeliveryUpdate, DeliveryResponse
from app.schemas.tracking import (
    TrackingLogBase,
    TrackingLogCreate,
    TrackingLogUpdate,
    TrackingLogResponse,
)
from app.schemas.document import (
    DriverDocumentBase,
    DriverDocumentCreate,
    DriverDocumentUpdate,
    DriverDocumentResponse,
)
from app.schemas.photo import (
    DeliveryPhotoBase,
    DeliveryPhotoCreate,
    DeliveryPhotoUpdate,
    DeliveryPhotoResponse,
)
from app.schemas.rating import RatingBase, RatingCreate, RatingUpdate, RatingResponse
from app.schemas.notification import (
    NotificationBase,
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse,
)
from app.schemas.safety_alert import (
    AISafetyAlertBase,
    AISafetyAlertCreate,
    AISafetyAlertUpdate,
    AISafetyAlertResponse,
)
from app.schemas.call_log import (
    AICallLogBase,
    AICallLogCreate,
    AICallLogUpdate,
    AICallLogResponse,
)
from app.schemas.ai import (
    ETAPredictionResponse,
    RouteOptimizationInput,
    OptimizedDelivery,
    RouteOptimizationResponse,
    CopilotChatPayload,
    CopilotChatResponse,
    RiskScoreResponse,
    AnalyticsOverviewResponse,
    DriverPerformanceResponse,
    AIInsightsResponse,
)

__all__ = [
    "DriverBase",
    "DriverCreate",
    "DriverUpdate",
    "DriverResponse",
    "OrganizationBase",
    "OrganizationCreate",
    "OrganizationUpdate",
    "OrganizationResponse",
    "DeliveryBase",
    "DeliveryCreate",
    "DeliveryUpdate",
    "DeliveryResponse",
    "TrackingLogBase",
    "TrackingLogCreate",
    "TrackingLogUpdate",
    "TrackingLogResponse",
    "DriverDocumentBase",
    "DriverDocumentCreate",
    "DriverDocumentUpdate",
    "DriverDocumentResponse",
    "DeliveryPhotoBase",
    "DeliveryPhotoCreate",
    "DeliveryPhotoUpdate",
    "DeliveryPhotoResponse",
    "RatingBase",
    "RatingCreate",
    "RatingUpdate",
    "RatingResponse",
    "NotificationBase",
    "NotificationCreate",
    "NotificationUpdate",
    "NotificationResponse",
    "AISafetyAlertBase",
    "AISafetyAlertCreate",
    "AISafetyAlertUpdate",
    "AISafetyAlertResponse",
    "AICallLogBase",
    "AICallLogCreate",
    "AICallLogUpdate",
    "AICallLogResponse",
    "ETAPredictionResponse",
    "RouteOptimizationInput",
    "OptimizedDelivery",
    "RouteOptimizationResponse",
    "CopilotChatPayload",
    "CopilotChatResponse",
    "RiskScoreResponse",
    "AnalyticsOverviewResponse",
    "DriverPerformanceResponse",
    "AIInsightsResponse",
]

