import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.permit")


def parse_permit(text: str) -> dict:
    """Extracts Permit Number and Expiry Date from Vehicle Permit text."""
    logger.debug("parsing_vehicle_permit")
    text_upper = text.upper()

    # Permit Number
    permit_num = None
    permit_match = re.search(r"PERMIT\s*(?:NO|NUMBER)?\s*:\s*([A-Z0-9\- ]{5,30})", text_upper)
    if permit_match:
        permit_num = permit_match.group(1).strip()

    # Expiry Date
    expiry_date = None
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
        expiry_date = parsed_dates[-1]

    return {
        "permit_number": permit_num,
        "document_number": permit_num,
        "expiry_date": expiry_date,
        "metadata": {
            "permit_expiry": expiry_date.isoformat() if expiry_date else None,
        },
    }
