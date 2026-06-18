import re

# E.164 phone validation regex
PHONE_REGEX = re.compile(r"^\+?[1-9]\d{1,14}$")


def validate_phone_number(value: str) -> str:
    """Validates if a phone number matches E.164 standard formatting."""
    if not PHONE_REGEX.match(value):
        raise ValueError("Invalid phone number format. E.164 format expected (e.g., +1234567890).")
    return value


def validate_latitude(value: float) -> float:
    """Validates if a float coordinate represents a valid latitude."""
    if not -90.0 <= value <= 90.0:
        raise ValueError("Latitude must be between -90.0 and 90.0.")
    return value


def validate_longitude(value: float) -> float:
    """Validates if a float coordinate represents a valid longitude."""
    if not -180.0 <= value <= 180.0:
        raise ValueError("Longitude must be between -180.0 and 180.0.")
    return value
