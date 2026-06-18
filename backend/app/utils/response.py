from typing import Any

from fastapi.responses import JSONResponse


def success_response(
    message: str, data: Any = None, status_code: int = 200
) -> JSONResponse:
    """Returns a standardized success JSON response payload."""
    payload = {
        "success": True,
        "message": message,
        "data": data,
    }
    return JSONResponse(status_code=status_code, content=payload)


def error_response(
    message: str, details: Any = None, status_code: int = 400
) -> JSONResponse:
    """Returns a standardized error JSON response payload."""
    payload = {
        "success": False,
        "message": message,
        "details": details,
    }
    return JSONResponse(status_code=status_code, content=payload)
