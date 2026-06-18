# 🤖 Driver AI Assistant Module

This module is responsible for the AI assistant integrated into the Driver client application.

## Responsibility

- Provide advice to drivers regarding deliveries, schedules, and earnings.
- Answer queries specifically relating to:
  - Driver profile
  - Driver deliveries
  - Driver ratings
  - Completed deliveries
- Never share data between this assistant and the organization assistant (strict sandboxing).
- Interface with the Gemini API for natural language queries.

## Future Plans

- Implement retrieval-augmented generation (RAG) over driver's historical deliveries.
- Implement real-time routing query helper functions using Google Maps API.
