import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.insurance")


def parse_insurance(text: str) -> dict:
    """Extracts Policy Number, Insured Name, Vehicle Number, and Expiry Date from Insurance text."""
    logger.debug("parsing_insurance_document")
    text_upper = text.upper()

    # Policy Number
    policy_num = None
    policy_match = re.search(r"POLICY\s*(?:NO|NUMBER)?\s*:\s*([A-Z0-9\- ]{5,30})", text_upper)
    if policy_match:
        policy_num = policy_match.group(1).strip()

    # Insured Name
    insured_name = None
    name_match = re.search(r"INSURED\s*(?:NAME)?\s*:\s*([A-Z. ]{3,50})", text_upper)
    if name_match:
        insured_name = name_match.group(1).strip()

    # Vehicle Number
    vehicle_num = None
    vehicle_match = re.search(r"VEHICLE\s*(?:NO|NUMBER)?\s*:\s*([A-Z]{2}[- ]?\d{2}[- ]?[A-Z]{1,2}[- ]?\d{4})", text_upper)
    if vehicle_match:
        vehicle_num = vehicle_match.group(1).strip()

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
                
    # Sort and pick the latest date as expiry date (typically insurance policies expire in the future)
    if parsed_dates:
        parsed_dates.sort()
        expiry_date = parsed_dates[-1]

    return {
        "policy_number": policy_num,
        "document_number": policy_num,
        "holder_name": insured_name,
        "vehicle_number": vehicle_num,
        "expiry_date": expiry_date,
        "metadata": {
            "policy_expiry": expiry_date.isoformat() if expiry_date else None,
        },
    }
