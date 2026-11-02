import crypto from 'crypto';

export function verifyHmacSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  try {
    const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const signatureBuffer = Buffer.from(signatureHeader);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export function validateNotificationPayload(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Payload must be a non-empty JSON object'] };
  }

  const { to, subject, templateId, variables } = data;

  if (!to || typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    errors.push('Field "to" must be a valid email address');
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    errors.push('Field "subject" must be a string with at least 3 characters');
  }

  const allowedTemplates = ['welcome', 'password_reset', 'order_receipt', 'system_alert'];
  if (!templateId || !allowedTemplates.includes(templateId)) {
    errors.push(`Field "templateId" must be one of: ${allowedTemplates.join(', ')}`);
  }

  if (variables && typeof variables !== 'object') {
    errors.push('Field "variables" must be an object if provided');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
