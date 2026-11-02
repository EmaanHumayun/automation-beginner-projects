# Architecture Document: Automated Email Notification System

## System Overview
The Automated Email Notification System separates concerns into four discrete layers:

1. **Trigger Layer (`src/triggers/`)**: Ingests external HTTP webhooks, cron ticks, or queue messages.
2. **Validation Layer (`src/utils/`)**: Enforces JSON schema constraints and validates authentication.
3. **Service Layer (`src/services/`)**: Implements business rules and coordinates actions.
4. **Action Layer (`src/actions/`)**: Executes side effects against databases, SMTP, or external APIs.

```
[ Ingress Trigger ] -> [ Validation ] -> [ Service Logic ] -> [ Outbound Action ]
                             |                  |                     |
                             v                  v                     v
                        [ Reject 400 ]     [ Audit Log ]        [ External API ]
```
