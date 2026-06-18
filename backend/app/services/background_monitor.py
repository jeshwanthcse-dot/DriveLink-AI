import asyncio
import structlog
from app.database.database import SessionLocal
from app.models.delivery import Delivery
from app.ai.safety_monitor.service import SafetyMonitorService
from sqlalchemy import select

logger = structlog.get_logger("app.services.background_monitor")


async def run_background_monitor():
    """Loops indefinitely every 60 seconds to execute stationary checks on active deliveries (Sprint 14)."""
    logger.info("background_safety_monitor_started")
    while True:
        try:
            db = SessionLocal()
            try:
                # Fetch active deliveries (e.g. in_transit, accepted)
                stmt = select(Delivery).where(
                    Delivery.status.in_(["in_transit", "accepted", "matching"])
                )
                active_deliveries = db.scalars(stmt).all()
                
                for delivery in active_deliveries:
                    safety_service = SafetyMonitorService(db)
                    safety_service.run_safety_check(delivery.id)
            finally:
                db.close()
        except asyncio.CancelledError:
            logger.info("background_safety_monitor_cancelled")
            break
        except Exception as e:
            logger.error("background_monitor_iteration_failed", error=str(e))
        
        try:
            await asyncio.sleep(60)
        except asyncio.CancelledError:
            logger.info("background_safety_monitor_cancelled")
            break
