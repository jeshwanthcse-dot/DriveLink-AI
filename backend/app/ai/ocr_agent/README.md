# 📄 OCR Agent Module

This module is responsible for analyzing and extracting fields from driver documents (e.g., driver licenses, transport business licenses).

## Responsibility

- Extract fields such as:
  - Document Holder Name
  - License/Document Number
  - Expiry Date
  - Endorsements / Vehicle Class Permissions
- Standardize metadata structure for validation checks.
- Utilize Gemini's multimodal features to parse scanned PDF or image uploads.
