import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { jadeRouter } from './routes/jade.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.NODE_ENV === 'development') {
          callback(null, true);
          return;
        }
        const allowed = env.CLIENT_ORIGIN.split(',').map((item) => item.trim());
        callback(null, allowed.includes(origin));
      },
      credentials: true
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(
    '/api',
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: '请求过于频繁，请稍后再试。'
        }
      }
    })
  );

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'ok',
      service: 'jade-ai-authenticator',
      time: new Date().toISOString()
    });
  });

  app.use('/api/jade', jadeRouter);

  const clientDist = path.resolve(__dirname, '../public');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, 'index.html'), (error) => {
      if (error) next();
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
