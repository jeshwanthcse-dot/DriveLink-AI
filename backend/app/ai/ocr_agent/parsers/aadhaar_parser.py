import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.aadhaar")


def parse_aadhaar(text: str) -> dict:
    """Extracts UID (Aadhaar number), Holder Name, and DOB from Aadhaar card text."""
    logger.debug("parsing_aadhaar_document")
    text_upper = text.upper()

    # UID (12-digit number, often grouped as 4-4-4)
    uid = None
    uid_match = re.search(r"(\d{4}\s*\d{4}\s*\d{4})", text_upper)
    if uid_match:
        uid = uid_match.group(1).strip()

    # Holder Name
    holder_name = None
    name_match = re.search(r"GOVERNMENT\s+OF\s+INDIA\s*\n\s*([A-Z. ]{3,50})", text_upper)
    if name_match:
        holder_name = name_match.group(1).strip()
    else:
        # Fallback Name heuristics: lines before DOB
        lines = text_upper.split("\n")
        for idx, line in enumerate(lines):
            if "DOB" in line or "YEAR OF BIRTH" in line:
                if idx > 0:
                    holder_name = lines[idx - 1].strip()
                    break

    # DOB
    dob = None
    dob_match = re.search(r"(?:DOB|DATE\s+OF\s+BIRTH|YOB)\s*:\s*(\d{2}[-/]\d{2}[-/]\d{4}|\d{4})", text_upper)
    if dob_match:
        dob = dob_match.group(1).strip()

    return {
        "document_number": uid,
        "holder_id": uid,
        "holder_name": holder_name,
        "metadata": {
            "dob": dob,
        },
    }
