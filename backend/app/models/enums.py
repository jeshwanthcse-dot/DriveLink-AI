from enum import StrEnum


class DocumentType(StrEnum):
    LICENSE = "LICENSE"
    INSURANCE = "INSURANCE"
    RC = "RC"
    AADHAAR = "AADHAAR"
    PAN = "PAN"
    OTHER = "OTHER"


class VerificationStatus(StrEnum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"
    MANUAL_REVIEW = "MANUAL_REVIEW"



class DeliveryStatus(StrEnum):
    PENDING = "PENDING"
    MATCHING = "MATCHING"
    ACCEPTED = "ACCEPTED"
    IN_TRANSIT = "IN_TRANSIT"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class PriorityLevel(StrEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class CallStatus(StrEnum):
    INITIATED = "INITIATED"
    CONNECTED = "CONNECTED"
    COMPLETED = "COMPLETED"
    BUSY = "BUSY"
    NO_ANSWER = "NO_ANSWER"
    FAILED = "FAILED"


class SafetyAlertStatus(StrEnum):
    INITIATED = "INITIATED"
    ESCALATED = "ESCALATED"
    RESOLVED = "RESOLVED"
