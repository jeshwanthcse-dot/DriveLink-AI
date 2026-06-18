import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.license")


def parse_license(text: str) -> dict:
    """Extracts License Number, Holder Name, DOB, Issue and Expiry Dates from Driving License text."""
    logger.debug("parsing_driving_license")
    text_upper = text.upper()

    # Document number extraction
    doc_num = None
    num_match = re.search(r"(?:LICENSE|LICENCE)\s*(?:NO|NUMBER)?\s*:\s*([A-Z0-9\- ]{5,20})", text_upper)
    if num_match:
        doc_num = num_match.group(1).strip()

    # Holder Name extraction
    holder_name = None
    name_match = re.search(r"NAME\s*:\s*([A-Z. ]{3,50})", text_upper)
    if name_match:
        holder_name = name_match.group(1).strip()

    # DOB extraction
    dob_str = None
    dob_match = re.search(r"DOB\s*:\s*(\d{2}[-/]\d{2}[-/]\d{4})", text_upper)
    if dob_match:
        dob_str = dob_match.group(1).strip()

    # Expiry and Issue Date extraction
    issue_date = None
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

    # Categorize dates (Earliest is issue date, latest is expiry date)
    parsed_dates = list(set(parsed_dates))
    parsed_dates.sort()
    
    if len(parsed_dates) >= 2:
        issue_date = parsed_dates[0]
        expiry_date = parsed_dates[-1]
    elif len(parsed_dates) == 1:
        # If only one date is found, assume it is expiry if in future
        today = datetime.date.today()
        if parsed_dates[0] > today:
            expiry_date = parsed_dates[0]
        else:
            issue_date = parsed_dates[0]

    return {
        "document_number": doc_num,
        "holder_name": holder_name,
        "issue_date": issue_date,
        "expiry_date": expiry_date,
        "metadata": {
            "dob": dob_str,
            "extracted_dates_count": len(parsed_dates),
        },
    }
