# Project Index — Level 1: Beginner

Detailed technical briefs for all projects in this tier.


---

### Project 01: Automated Email Notification System
- **Directory**: [`01-automated-email-notification-system`](./01-automated-email-notification-system)
- **Status**: `Completed`
- **Core Technology**: Node.js, Express, Nodemailer, Ethereal/SMTP, HMAC, Docker
- **Summary**: Transactional email notification service ingesting authenticated webhooks, compiling HTML templates, and dispatching notifications with retry resilience.
- **Problem Solved**: Distributed applications need a centralized, decoupled email notification endpoint that validates incoming events and guarantees delivery without exposing internal SMTP credentials to multiple services.
- **Key Concepts**: Webhook triggers, HMAC-SHA256 signature verification, JSON payload validation, HTML templating, exponential backoff, rate limiting, Docker containerization.


---

### Project 02: Google Sheets Data Automation
- **Directory**: [`02-google-sheets-data-automation`](./02-google-sheets-data-automation)
- **Status**: `Planned`
- **Core Technology**: Python, Google Sheets API, OAuth 2.0 / Service Account, Cron, JSON
- **Summary**: Bidirectional spreadsheet automation extracting, validating, and updating rows based on cron schedules and incoming webhooks.
- **Problem Solved**: Operational teams manually maintain spreadsheets, leading to out-of-sync inventory, duplicated entries, and lack of audit logging.
- **Key Concepts**: OAuth 2.0 service accounts, batch API reads/writes, rate limit pacing, cell validation, cron scheduling, data delta detection.


---

### Project 03: Form Submission Automation
- **Directory**: [`03-form-submission-automation`](./03-form-submission-automation)
- **Status**: `Planned`
- **Core Technology**: Node.js, Express, SQLite, Joi/Zod, Nodemailer, Slack Webhook
- **Summary**: High-throughput form ingestion service validating fields, preventing duplicate submissions, and dispatching multi-channel alerts.
- **Problem Solved**: Website contact and inquiry forms receive spam, duplicate submissions, and need instant routing to sales without server lag.
- **Key Concepts**: Input sanitization, honeypot spam detection, hash-based deduplication, async notification dispatch, SQLite audit storage.


---

### Project 04: Automated File Management System
- **Directory**: [`04-automated-file-management-system`](./04-automated-file-management-system)
- **Status**: `Planned`
- **Core Technology**: Python, Watchdog, Shutil, Cron, S3 SDK (Boto3/MinIO)
- **Summary**: File system automation watching directories, sorting incoming files by MIME type, compressing aged archives, and syncing to remote storage.
- **Problem Solved**: Application servers and shared drives accumulate gigabytes of disorganized logs, reports, and uploads without automated lifecycle policies.
- **Key Concepts**: File system event watching, MIME detection, gzip compression, automated retention rules, object storage backup.


---

### Project 05: Multi-API Data Integration System
- **Directory**: [`05-multi-api-data-integration-system`](./05-multi-api-data-integration-system)
- **Status**: `Planned`
- **Core Technology**: Node.js, Axios, Express, JSON Schema, Redis/In-Memory Cache
- **Summary**: Aggregator service querying diverse external REST APIs, normalizing inconsistent schemas, and providing a unified consolidated payload.
- **Problem Solved**: Frontend dashboards and microservices must query multiple third-party APIs with differing authentication, pagination, and data formats.
- **Key Concepts**: Parallel HTTP requests, token-bucket rate limiting, circuit breaking, JSON data normalization, cache invalidation.
