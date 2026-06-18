# 🏢 Organization AI Assistant Module

This module is responsible for the AI assistant integrated into the Transport Organization client dashboard.

## Responsibility

- Answer operator queries regarding current logistics status, routes, and active vehicles.
- Answer queries specifically relating to:
  - Organization deliveries
  - Driver list
  - Reports
  - Tracking
- Never share data between this assistant and the driver assistant (strict sandboxing).
- Interface with the Gemini API to construct business reports and summaries.
