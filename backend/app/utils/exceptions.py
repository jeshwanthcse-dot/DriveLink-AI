from typing import Any

import structlog
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError

from app.utils.response import error_response

logger = structlog.get_logger("app.exceptions")


class AppException(Exception):
    """Base application exception for all business and domain errors."""
    def __init__(self, message: str, status_code: int = 500, details: Any = None) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class NotFoundException(AppException):
    """Triggered when a resource is not found."""
    def __init__(self, message: str = "Resource not found", details: Any = None) -> None:
        super().__init__(message, status_code=404, details=details)


class ValidationException(AppException):
    """Triggered when request payload validation fails at the business layer."""
    def __init__(self, message: str = "Validation failed", details: Any = None) -> None:
        super().__init__(message, status_code=422, details=details)


class UnauthorizedException(AppException):
    """Triggered when client authentication is missing or invalid."""
    def __init__(self, message: str = "Unauthorized access", details: Any = None) -> None:
        super().__init__(message, status_code=401, details=details)


class ForbiddenException(AppException):
    """Triggered when client is authenticated but lacks required permissions."""
    def __init__(self, message: str = "Forbidden access", details: Any = None) -> None:
        super().__init__(message, status_code=403, details=details)


def register_exception_handlers(app: FastAPI) -> None:
    """Binds global and custom error handlers to the FastAPI app instance."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        logger.warning(
            "domain_exception_handled",
            path=request.url.path,
            status_code=exc.status_code,
            message=exc.message,
            details=str(exc.details) if exc.details else None
        )
        return error_response(
            message=exc.message,
            details=exc.details,
            status_code=exc.status_code
        )

    @app.exception_handler(RequestValidationError)
    async def pydantic_validation_exception_handler(request: Request, exc: RequestValidationError):
        # Format Pydantic validation errors cleanly
        errors = exc.errors()
        formatted_errors = [
            {"loc": " -> ".join(map(str, err["loc"])), "msg": err["msg"], "type": err["type"]}
            for err in errors
        ]
        logger.warning(
            "request_validation_failed",
            path=request.url.path,
            errors=formatted_errors
        )
        return error_response(
            message="Request validation failed",
            details=formatted_errors,
            status_code=422
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception(
            "unhandled_server_exception",
            path=request.url.path,
            error=str(exc)
        )
        # Hide internal error details in production to prevent leaking system information
        details = str(exc) if app.debug else "Internal server error"
        return error_response(
            message="An unexpected error occurred on the server.",
            details=details,
            status_code=500
        )
