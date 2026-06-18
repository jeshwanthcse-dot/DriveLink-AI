import re
import structlog

logger = structlog.get_logger("app.ai.ocr_agent.parsers.pan")


def parse_pan(text: str) -> dict:
    """Extracts PAN Number and Holder Name from PAN card text."""
    logger.debug("parsing_pan_document")
    text_upper = text.upper()

    # PAN Number (Standard Indian PAN format: 5 letters, 4 digits, 1 letter)
    pan_num = None
    pan_match = re.search(r"([A-Z]{5}\d{4}[A-Z]{1})", text_upper)
    if pan_match:
        pan_num = pan_match.group(1).strip()

    # Holder Name
    holder_name = None
    name_match = re.search(r"NAME\s*:\s*([A-Z. ]{3,50})", text_upper)
    if name_match:
        holder_name = name_match.group(1).strip()
    else:
        # Heuristics: Line after INCOME TAX DEPARTMENT
        lines = text_upper.split("\n")
        for idx, line in enumerate(lines):
            if "INCOME TAX" in line or "GOVT OF INDIA" in line:
                if idx + 1 < len(lines):
                    candidate = lines[idx + 1].strip()
                    if candidate and not re.search(r"\d", candidate):
                        holder_name = candidate
                        break

    return {
        "document_number": pan_num,
        "holder_id": pan_num,
        "holder_name": holder_name,
        "metadata": {
            "pan_number": pan_num,
        },
    }
