import { validateNotificationPayload } from '../utils/validator.js';
import { sendEmailAction } from '../actions/sendEmail.js';
import { config } from '../config/index.js';

const TEMPLATES = {
  welcome: (vars) => ({
    subject: `Welcome to ${vars.platformName || 'Engineering Portal'}, ${vars.userName || 'Engineer'}!`,
    html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Welcome, ${vars.userName || 'Engineer'}!</h2><p>Your account has been provisioned successfully.</p></div>`,
    text: `Welcome, ${vars.userName || 'Engineer'}! Your account has been provisioned successfully.`
  }),
  system_alert: (vars) => ({
    subject: `[ALERT - ${vars.severity || 'INFO'}] ${vars.alertName || 'System Notification'}`,
    html: `<div style="font-family: monospace; color: #b91c1c;"><h3>System Alert</h3><p>${vars.message || 'No details provided.'}</p></div>`,
    text: `System Alert: ${vars.message || 'No details provided.'}`
  }),
  order_receipt: (vars) => ({
    subject: `Receipt for Order #${vars.orderId || 'N/A'}`,
    html: `<div><h2>Order Confirmed</h2><p>Amount: ${vars.amount || '$0.00'}</p></div>`,
    text: `Order #${vars.orderId || 'N/A'} confirmed. Amount: ${vars.amount || '$0.00'}`
  }),
  password_reset: (vars) => ({
    subject: 'Password Reset Request',
    html: `<div><p>Use code: <strong>${vars.code || '000000'}</strong></p></div>`,
    text: `Use password reset code: ${vars.code || '000000'}`
  })
};

export class NotificationService {
  static async processNotification(payload) {
    const validation = validateNotificationPayload(payload);
    if (!validation.valid) {
      const err = new Error('Payload validation failed');
      err.status = 400;
      err.details = validation.errors;
      throw err;
    }

    const { to, subject, templateId, variables = {} } = payload;
    const templateRenderer = TEMPLATES[templateId] || TEMPLATES.welcome;
    const rendered = templateRenderer(variables);

    const emailResult = await sendEmailAction({
      to,
      subject: subject || rendered.subject,
      htmlBody: rendered.html,
      textBody: rendered.text,
      from: config.smtp.from
    });

    return {
      status: 'queued',
      trackingId: emailResult.messageId,
      recipient: to,
      template: templateId,
      timestamp: new Date().toISOString(),
      previewUrl: emailResult.previewUrl
    };
  }
}
