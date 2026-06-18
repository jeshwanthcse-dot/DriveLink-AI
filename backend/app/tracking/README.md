# 📍 Tracking Module

This module handles real-time GPS locations and progress mapping for active deliveries.

## Responsibility

- Keep track of:
  - Latitude & Longitude
  - Speed
  - Timestamp
  - ETA
  - Distance remaining
- Handle offline storage of GPS tracking payloads when the driver device loses connectivity.
- Handle offline-to-online sync workflows.
- Integrate Google Maps Distance Matrix / Directions APIs.
