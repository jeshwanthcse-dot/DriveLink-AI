import uuid
from datetime import UTC, datetime


def get_utc_now() -> datetime:
    """Returns the current timezone-aware UTC datetime."""
    return datetime.now(UTC)


def is_valid_uuid(val: str) -> bool:
    """Validates if a string is a valid UUIDv4."""
    try:
        uuid.UUID(val, version=4)
        return True
    except ValueError:
        return False


def format_duration(seconds: float) -> str:
    """Formats a float duration in seconds into a readable string."""
    if seconds < 1.0:
        return f"{seconds * 1000.0:.2f}ms"
    return f"{seconds:.2f}s"
