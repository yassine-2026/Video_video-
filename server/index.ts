import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import videoRoutes from './routes/videoRoutes';
import { createServer as createViteServer } from 'vite';
import { startPeriodicCleanup } from './workers/cleanup';

async function startServer() {
  const app = express();

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
  });
  
  // Apply the rate limiting middleware to API calls only
  app.use('/api', limiter);

  // Serve temp directory for uploaded images (and potentially downloaded videos in a real app)
  app.use('/temp', express.static(path.resolve(process.cwd(), 'temp')));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running', env: env.NODE_ENV });
  });

  app.use('/api/videos', videoRoutes);

  // Start background workers
  startPeriodicCleanup();

  // Vite Middleware (for development) & Static Serving (for production)
  if (env.NODE_ENV !== 'production') {
    logger.info('Starting Vite middleware for development');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    logger.info('Serving static files from dist');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Handler
  app.use(errorHandler);

  app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`Server started on http://localhost:${env.PORT}`);
  });
}

startServer().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});
