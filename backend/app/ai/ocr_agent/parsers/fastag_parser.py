import datetime
import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.fastag")


def parse_fastag(text: str) -> dict:
    """Extracts Vehicle Number, Amount, Date, and Transaction ID from Fastag receipt text."""
    logger.debug("parsing_fastag_receipt")
    text_upper = text.upper()

    # Vehicle Number
    vehicle_num = None
    vehicle_match = re.search(r"VEHICLE\s*(?:NO|NUMBER)?\s*:\s*([A-Z]{2}[- ]?\d{2}[- ]?[A-Z]{1,2}[- ]?\d{4})", text_upper)
    if vehicle_match:
        vehicle_num = vehicle_match.group(1).strip()

    # Amount (Float number)
    amount = None
    amount_match = re.search(r"(?:AMOUNT|PAID|AMT)\s*(?:RS|\$|:)?\s*(\d+(?:\.\d{2})?)", text_upper)
    if amount_match:
        try:
            amount = float(amount_match.group(1))
        except ValueError:
            pass

    # Date
    txn_date = None
    date_matches = re.findall(r"(\d{2}[-/]\d{2}[-/]\d{4})", text_upper)
    if date_matches:
        for fmt in ("%d-%m-%Y", "%d/%m/%Y"):
            try:
                txn_date = datetime.datetime.strptime(date_matches[0], fmt).date()
                break
            except ValueError:
                continue

    # Transaction ID
    txn_id = None
    txn_match = re.search(r"(?:TXN|TRANSACTION|REF)\s*(?:ID|NO|NUMBER)?\s*:\s*([A-Z0-9\- ]{5,30})", text_upper)
    if txn_match:
        txn_id = txn_match.group(1).strip()

    return {
        "vehicle_number": vehicle_num,
        "document_number": txn_id,  # Map transaction ID to doc_number for tracking
        "metadata": {
            "fastag_amount": amount,
            "fastag_date": txn_date.isoformat() if txn_date else None,
            "fastag_transaction_id": txn_id,
        },
    }
