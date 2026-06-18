import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.generic")


def parse_generic(text: str) -> dict:
    """Fallback parser extracting any generic dates, alphanumeric identifiers, and metadata."""
    logger.debug("parsing_generic_document")
    text_upper = text.upper()

    # Generic Document Number: Look for patterns of letters + numbers
    doc_num = None
    num_match = re.search(r"(?:NO|NUMBER|ID|REG)\s*:\s*([A-Z0-9\- ]{5,25})", text_upper)
    if num_match:
        doc_num = num_match.group(1).strip()
    else:
        # Fallback: Find the first 8-15 character alphanumeric word
        words = text_upper.split()
        for w in words:
            clean_w = re.sub(r"[^A-Z0-9\-]", "", w)
            if 8 <= len(clean_w) <= 15 and re.search(r"\d", clean_w) and re.search(r"[A-Z]", clean_w):
                doc_num = clean_w
                break

    # Look for any date
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
        # Assume the furthest date in the future is the expiry
        expiry_date = parsed_dates[-1]

    return {
        "document_number": doc_num,
        "expiry_date": expiry_date,
        "metadata": {
            "generic_parsed_dates_count": len(parsed_dates),
            "fallback_parsing_executed": True,
        },
    }
