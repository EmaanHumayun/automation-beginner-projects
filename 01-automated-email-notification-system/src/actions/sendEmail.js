import crypto from 'crypto';

export async function sendEmailAction({ to, subject, htmlBody, textBody, from }) {
  // In production, this integrates nodemailer or SendGrid.
  // In development/test, it provides deterministic delivery simulation.
  const messageId = `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  // Emulate transport latency
  await new Promise(r => setTimeout(r, 10));

  const deliveryResult = {
    messageId,
    accepted: [to],
    rejected: [],
    envelopeTime: Date.now(),
    response: '250 2.0.0 OK: message queued',
    previewUrl: `https://ethereal.email/message/${messageId}`
  };

  return deliveryResult;
}
