# Project Specification: Automated File Management System

---

### 1. Problem Statement
Application servers and shared drives accumulate gigabytes of disorganized logs, reports, and uploads without automated lifecycle policies.

### 2. Target Users
System administrators, DevOps engineers, content managers.

### 3. Learning Objectives
- Design and implement resilient automation workflows for Automated File Management System.
- Apply robust error handling, schema validation, and logging hygiene.
- Package services in Docker containers for reproducible local and cloud deployment.
- Implement comprehensive automated test suites to verify trigger-action contracts.

### 4. Prerequisites
- Proficient in JavaScript/Node.js or Python fundamentals.
- Understanding of HTTP methods, headers, status codes, and JSON schemas.
- Familiarity with Git version control, Docker containers, and environment variables.

### 5. Concepts Covered
File system event watching, MIME detection, gzip compression, automated retention rules, object storage backup.

### 6. Tools and Technology
- **Runtime / Framework**: Python, Watchdog, Shutil, Cron, S3 SDK (Boto3/MinIO)
- **Data Stores**: In-Memory / SQLite / PostgreSQL / Redis
- **Containerization**: Docker, Docker Compose
- **Testing**: Jest / Mocha / Pytest, Supertest

### 7. Functional Requirements
- **FR-01**: Ingest incoming triggers through configured endpoints or schedules (File system creation event (watchdog) or daily cron archive run.).
- **FR-02**: Validate payload format against strict JSON schemas before processing.
- **FR-03**: Execute core action operations (Inspect new file, detect type, move to categorized subfolder, compress files older than 30 days, upload to S3 bucket.).
- **FR-04**: Emit structured execution logs capturing timestamp, duration, and delivery status.
- **FR-05**: Provide liveness and readiness health check endpoints (`GET /health`).

### 8. Non-Functional Requirements
- **NFR-01 (Performance)**: Webhook ingress must acknowledge callers within 200ms.
- **NFR-02 (Reliability)**: Automatic retry with exponential backoff for transient network errors.
- **NFR-03 (Security)**: Zero plain-text credentials in logs or source code.
- **NFR-04 (Maintainability)**: Clear separation between trigger listeners, services, and actions.

### 9. Workflow Design
```
[ Trigger: File system creation event (watchdog) or daily cron archive run. ]
                  |
                  v
       [ Input Validation ] ---- (Invalid) ----> [ Return 400 Bad Request ]
                  |
              (Valid)
                  v
       [ Service Business Logic ]
                  |
                  v
       [ Action: Inspect new file, detect type, move to categorized subfolder, compress files older than 30 days, upload to S3 bucket. ]
                  |
                  v
       [ Structured Log & Return Status ]
```

### 10. Trigger Definitions
- **Type**: File system creation event (watchdog) or daily cron archive run.
- **Method**: HTTP POST / Scheduled Cron / Event Subscription
- **Authentication**: Header verification (HMAC or Bearer token)

### 11. Actions and Integrations
- **Primary Actions**: Inspect new file, detect type, move to categorized subfolder, compress files older than 30 days, upload to S3 bucket.
- **External Dependencies**: Mock endpoints / sandbox APIs / SMTP / Cloud services

### 12. Input and Output Data Formats
- **Input Format**: Local directory paths, file system change notifications.
- **Output Format**: Structured directory tree, compressed .tar.gz archives, transfer logs.

### 13. Error Handling
- Invalid payload: HTTP `400 Bad Request` with detailed schema validation errors.
- Authentication failure: HTTP `401 Unauthorized` or `403 Forbidden`.
- Upstream service error: Retry 3 times with exponential backoff (1s, 2s, 4s) before logging to dead-letter queue.

### 14. Authentication Requirements
- Webhook endpoints require cryptographic HMAC validation or Bearer API keys.
- Secret keys loaded exclusively from environment variables.

### 15. Security Requirements
- Reject payloads exceeding 1MB.
- Sanitize all string fields against script injection.
- Never log authorization headers or private credentials.

### 16. Testing Requirements
- **Unit Tests**: Test payload schema validator with valid and boundary inputs.
- **Integration Tests**: Verify trigger-to-action execution with mock upstream services.
- **Error Tests**: Verify proper status codes on invalid signatures and missing fields.

### 17. Implementation Milestones
- **Milestone 1**: Scaffolding, configuration, and environment setup.
- **Milestone 2**: Ingress trigger and validation middleware implementation.
- **Milestone 3**: Core service logic and action handlers.
- **Milestone 4**: Automated test suite and Docker containerization.

### 18. Expected Deliverables
- Working application code in `src/`.
- Sanitized workflow JSON definitions in `workflows/`.
- Automated test runner in `tests/`.
- Container definition in `deployment/` (Dockerfile & docker-compose.yml).
- Completed practical lab reports in `reports/`.

### 19. Completion Criteria
- All automated unit and integration tests passing.
- Zero credentials or tokens in git history.
- Docker image builds and executes successfully.
- Lab reports documented with terminal outputs.

### 20. Advanced Extensions
- Introduce distributed Redis queues for high-throughput buffering.
- Add OpenTelemetry distributed tracing spans.
- Implement automated dead-letter queue re-drive utility.
