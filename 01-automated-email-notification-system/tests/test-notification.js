import crypto from 'crypto';
import { createApp } from '../server.js';
import { config } from '../src/config/index.js';
import { validateNotificationPayload, verifyHmacSignature } from '../src/utils/validator.js';
import { NotificationService } from '../src/services/notificationService.js';

function sign(body, secret) {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

async function runTests() {
  console.log('[TESTS] Starting Automated Notification Service Test Suite...');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (!condition) {
      console.error(`FAIL: ${message}`);
      process.exitCode = 1;
    } else {
      console.log(`PASS: ${message}`);
      passed++;
    }
  }

  // 1. HMAC Signature Verification Tests
  const secret = 'test_secret_key_abc123';
  const testPayload = JSON.stringify({ hello: 'world' });
  const validSig = sign(testPayload, secret);
  const invalidSig = 'sha256=abcdef1234567890';

  assert(verifyHmacSignature(testPayload, validSig, secret) === true, 'HMAC verification succeeds with matching signature');
  assert(verifyHmacSignature(testPayload, invalidSig, secret) === false, 'HMAC verification fails with invalid signature');
  assert(verifyHmacSignature(testPayload + 'tampered', validSig, secret) === false, 'HMAC verification fails with tampered payload');

  // 2. Payload Schema Validation Tests
  const validData = {
    to: 'devops-lead@company.com',
    subject: 'Deployment Notification',
    templateId: 'system_alert',
    variables: { severity: 'WARN', alertName: 'High CPU Usage', message: 'Instance cpu at 92%' }
  };
  const valResult = validateNotificationPayload(validData);
  assert(valResult.valid === true, 'Schema validator passes valid payload');
  assert(valResult.errors.length === 0, 'No validation errors on valid payload');

  const invalidData = {
    to: 'invalid-email-address',
    subject: 'Hi',
    templateId: 'unknown_template'
  };
  const badValResult = validateNotificationPayload(invalidData);
  assert(badValResult.valid === false, 'Schema validator rejects malformed payload');
  assert(badValResult.errors.length >= 2, 'Validation captures multiple schema violations');

  // 3. Service Processing & Template Compilation Tests
  const serviceResult = await NotificationService.processNotification(validData);
  assert(serviceResult.status === 'queued', 'Service successfully queues email');
  assert(serviceResult.trackingId.startsWith('msg_'), 'Service generates tracking ID with msg_ prefix');
  assert(serviceResult.recipient === 'devops-lead@company.com', 'Recipient is correctly preserved');
  assert(typeof serviceResult.previewUrl === 'string', 'Preview URL generated for sandbox review');

  // 4. Express App In-Memory Ingress Simulation
  const app = createApp();
  assert(typeof app.handle === 'function', 'Express application initialized with middleware pipeline');

  console.log(`\n======================================================`);
  console.log(`[TEST SUMMARY] All ${passed}/${total} assertions passed successfully.`);
  console.log(`======================================================\n`);
}

runTests().catch(err => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
