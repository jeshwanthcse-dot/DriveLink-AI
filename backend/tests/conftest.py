import os
from collections.abc import AsyncGenerator, Generator

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

# Override config environment variables for testing before loading settings
os.environ["DEBUG"] = "True"
os.environ["DATABASE_URL"] = "postgresql+psycopg2://postgres:postgres@localhost:5432/drivelink_test"
os.environ["LOG_LEVEL"] = "WARNING"  # Quieter logs during test suite runs

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:
    """A standard synchronous FastAPI TestClient fixture."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """An HTTPX AsyncClient for testing asynchronous endpoints."""
    # Note: ASGITransport handles direct routing to the ASGI app without making network calls.
    transport = ASGITransport(app=app) # type: ignore
    async with AsyncClient(transport=transport, base_url="http://test") as test_client:
        yield test_client
