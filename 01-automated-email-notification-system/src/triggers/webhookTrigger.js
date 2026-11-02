import express from 'express';
import { NotificationService } from '../services/notificationService.js';
import { verifyHmacSignature } from '../utils/validator.js';
import { config } from '../config/index.js';

export const webhookRouter = express.Router();

webhookRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'automated-email-notification-system',
    timestamp: new Date().toISOString()
  });
});

webhookRouter.post('/api/v1/notifications/email', async (req, res) => {
  const signature = req.headers['x-hub-signature-256'] || req.headers['x-signature-256'];
  
  // If webhook secret is enforced and signature is provided or in production
  if (config.env === 'production' || signature) {
    const isValid = verifyHmacSignature(req.rawBody || JSON.stringify(req.body), signature, config.webhookSecret);
    if (!isValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing HMAC signature header'
      });
    }
  }

  try {
    const result = await NotificationService.processNotification(req.body);
    return res.status(202).json({
      success: true,
      message: 'Notification accepted and queued for delivery',
      data: result
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error: err.message,
      details: err.details || null
    });
  }
});
