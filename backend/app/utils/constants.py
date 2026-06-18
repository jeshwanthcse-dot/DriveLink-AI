from enum import StrEnum


class UserRole(StrEnum):
    DRIVER = "driver"
    ORGANIZATION = "organization"
    ADMIN = "admin"


class DeliveryStatus(StrEnum):
    PENDING = "pending"
    MATCHING = "matching"
    ACCEPTED = "accepted"
    IN_TRANSIT = "in_transit"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# Pagination Defaults
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Cache / TTL Constants (if any in future)
DEFAULT_CACHE_TTL = 300
