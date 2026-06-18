# 🎯 Smart Matching Module

This module handles the logic of matching available, qualified drivers to delivery requests created by transport organizations.

## Responsibility

- Implement the smart ranking formula:
  - 40% Rating
  - 30% Distance
  - 20% Experience
  - 10% Completed Deliveries
- Sort eligible drivers in descending order by rank.
- Dispatch notification triggers to the top-ranked drivers.
- Implement auto-assignment to the first driver who accepts (first-come, first-served).
