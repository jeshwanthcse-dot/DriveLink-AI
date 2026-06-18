from typing import Any

import structlog
from fastapi import Header

logger = structlog.get_logger("app.auth.placeholder")


async def get_current_user(x_mock_user_role: str = Header(default="driver")) -> dict[str, Any]:
    """
    FastAPI dependency injection placeholder for authentication.
    During MVP/Sprint 10, real authentication (JWT) is bypassed.
    This returns mock user details corresponding to the requested role.
    """
    logger.debug("auth_dependency_invoked", requested_role=x_mock_user_role)

    if x_mock_user_role == "organization":
        return {
            "id": "mock-org-uuid-1111",
            "name": "Global Cargo Logistics",
            "email": "ops@globalcargo.com",
            "role": "organization"
        }
    elif x_mock_user_role == "driver":
        return {
            "id": "mock-driver-uuid-2222",
            "name": "John Doe",
            "email": "johndoe@driver.drivelink.ai",
            "role": "driver"
        }
    elif x_mock_user_role == "admin":
        return {
            "id": "mock-admin-uuid-9999",
            "name": "System Admin",
            "email": "admin@drivelink.ai",
            "role": "admin"
        }
    else:
        # If an unknown mock role is requested, default to driver for local dev robustness
        return {
            "id": "mock-driver-uuid-2222",
            "name": "John Doe",
            "email": "johndoe@driver.drivelink.ai",
            "role": "driver"
        }
