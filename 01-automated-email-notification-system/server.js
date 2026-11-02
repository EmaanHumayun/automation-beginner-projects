import express from 'express';
import { config } from './src/config/index.js';
import { webhookRouter } from './src/triggers/webhookTrigger.js';

export function createApp() {
  const app = express();
  
  // Capture raw body for HMAC verification
  app.use(express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  }));

  app.use(webhookRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  return app;
}

// Only start listener if executed directly as entrypoint
const isMain = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'));
if (isMain && process.env.NODE_ENV !== 'test') {
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[SERVER] Email Notification Automation Service listening on port ${config.port}`);
  });
}
