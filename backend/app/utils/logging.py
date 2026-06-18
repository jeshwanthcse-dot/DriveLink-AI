import logging
import sys
from typing import Any

import structlog

from app.config.settings import settings


def setup_logging() -> None:
    """Configures centralized structured logging for the application using structlog."""
    log_level_str = settings.LOG_LEVEL.upper()
    log_level = getattr(logging, log_level_str, logging.INFO)

    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    if settings.DEBUG:
        # Local development: human-friendly console output
        renderer = structlog.dev.ConsoleRenderer(colors=True)
    else:
        # Enterprise production: structured JSON log format
        renderer = structlog.processors.JSONRenderer()

    structlog.configure(
        processors=shared_processors + [renderer],
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        cache_logger_on_first_use=True,
    )

    # Re-route standard logging to stdout formatted cleanly
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=log_level,
    )

    logger = structlog.get_logger("app.bootstrap")
    logger.info(
        "centralized_logging_initialized",
        log_level=log_level_str,
        debug_mode=settings.DEBUG,
    )

