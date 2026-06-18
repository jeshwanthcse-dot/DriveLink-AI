import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.fitness")


def parse_fitness(text: str) -> dict:
    """Extracts Fitness Certificate Number and Expiry Date from Certificate text."""
    logger.debug("parsing_fitness_certificate")
    text_upper = text.upper()

    # Fitness Certificate Number
    cert_num = None
    cert_match = re.search(r"(?:CERTIFICATE|CERT)\s*(?:NO|NUMBER)?\s*:\s*([A-Z0-9\- ]{5,30})", text_upper)
    if cert_match:
        cert_num = cert_match.group(1).strip()

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
        "document_number": cert_num,
        "expiry_date": expiry_date,
        "metadata": {
            "fitness_expiry": expiry_date.isoformat() if expiry_date else None,
        },
    }
