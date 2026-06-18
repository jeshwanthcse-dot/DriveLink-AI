from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import v1_router
from app.config.settings import settings
from app.database.connection import check_db_connection
from app.middleware.logging import LoggingMiddleware
from app.utils.exceptions import register_exception_handlers
from app.utils.logging import setup_logging

# Initialize centralized structured logging
setup_logging()
logger = structlog.get_logger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Events
    logger.info("app_starting", app_name=settings.APP_NAME, version=settings.APP_VERSION)
    
    # Check Database connection (Log status, but do not block startup so that mocks/tests can run)
    db_ok = check_db_connection()
    if not db_ok:
        logger.warning(
            "database_offline_warning",
            message="App starts without active DB. Verify DATABASE_URL."
        )
    
    # Launch background monitor task for Sprint 14
    import asyncio
    from app.services.background_monitor import run_background_monitor
    monitor_task = asyncio.create_task(run_background_monitor())
    
    yield
    
    # Shutdown Events
    logger.info("app_shutting_down")
    monitor_task.cancel()
    try:
        await monitor_task
    except asyncio.CancelledError:
        pass



# Instantiate FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise Driver Exchange & Logistics Marketplace Backend API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    # Restrict to configured origins in actual settings in production
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request-Response execution timer and structured logging middleware
app.add_middleware(LoggingMiddleware)

# Bind custom application and validation exceptions
register_exception_handlers(app)


# Root API routing
@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """Returns application description and document pointers."""
    return {
        "message": "DriveLink AI Backend Running",
        "docs": "/docs",
        "version": settings.APP_VERSION,
    }


# Include V1 Routers
app.include_router(v1_router, prefix="/api/v1")
