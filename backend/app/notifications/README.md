# 🔔 Notifications Module

This module handles messaging notifications (system logs, driver invites, matching, alerts, delivery acceptance) across the application ecosystem.

## Responsibility

- Dispatch Firebase Cloud Messages (FCM) to driver client applications.
- Dispatch real-time websocket/in-app notices to organization dashboard operators.
- Support standard templating for notification messages.
- Maintain status history logs for sent and delivered notification items.
