import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.rc")


def parse_rc(text: str) -> dict:
    """Extracts Registration Number, Owner Name, Vehicle Number, and Expiry (Valid Until) Date from RC text."""
    logger.debug("parsing_rc_document")
    text_upper = text.upper()

    # Registration Number (acts as both registration number and vehicle number on RC)
    reg_num = None
    reg_match = re.search(r"REGISTRATION\s*(?:NO|NUMBER)?\s*:\s*([A-Z]{2}[- ]?\d{2}[- ]?[A-Z]{1,2}[- ]?\d{4})", text_upper)
    if reg_match:
        reg_num = reg_match.group(1).strip()

    # Owner Name
    owner_name = None
    owner_match = re.search(r"(?:OWNER|REGISTERED\s+OWNER)\s*(?:NAME)?\s*:\s*([A-Z. ]{3,50})", text_upper)
    if owner_match:
        owner_name = owner_match.group(1).strip()

    # Expiry Date (Valid Until)
    valid_until = None
    date_matches = re.findall(r"(\d{2}[-/]\d{2}[-/]\d{4})", text_upper)
    
    parsed_dates = []
    for d_str in date_matches:
        for fmt in ("%d-%m-%Y", "%d/%m/%Y"):
            try:
                parsed_dates.append(datetime.datetime.strptime(d_str, fmt).date())
                break
            except ValueError:
                continue

    if parsed_dates:
        parsed_dates.sort()
        valid_until = parsed_dates[-1]  # RC validity is usually the furthest date in the future

    return {
        "document_number": reg_num,
        "holder_name": owner_name,
        "vehicle_number": reg_num,
        "expiry_date": valid_until,
        "metadata": {
            "valid_until": valid_until.isoformat() if valid_until else None,
        },
    }
