import time
import uuid
from collections.abc import Awaitable, Callable

import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger("app.middleware.request")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log HTTP request metadata, processing time, status, and failures."""

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        # Extract or generate request correlation ID
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(correlation_id=correlation_id)

        start_time = time.perf_counter()

        client_host = request.client.host if request.client else "unknown"
        logger.info(
            "request_started",
            method=request.method,
            path=request.url.path,
            client_ip=client_host,
            query_params=str(request.query_params),
        )

        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000.0

            logger.info(
                "request_completed",
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=round(duration_ms, 2),
            )

            # Return correlation ID in header
            response.headers["X-Correlation-ID"] = correlation_id
            return response

        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            logger.error(
                "request_failed",
                method=request.method,
                path=request.url.path,
                error=str(exc),
                duration_ms=round(duration_ms, 2),
            )
            raise exc
