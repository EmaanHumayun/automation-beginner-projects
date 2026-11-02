# Testing Strategy: Automated File Management System

## 1. Test Categories
- **Unit Tests**: Verify schema validators, hash generators, and utility functions.
- **Integration Tests**: Execute trigger endpoints and verify action handler calls using mock servers.
- **Negative Tests**: Confirm rejection of invalid payloads, expired signatures, and malformed headers.

## 2. Running Tests
```bash
npm test
```
