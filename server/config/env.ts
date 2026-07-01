import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  REDIS_URL: process.env.REDIS_URL || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  RUNWAY_API_KEY: process.env.RUNWAY_API_KEY || '',
  LUMA_API_KEY: process.env.LUMA_API_KEY || '',
  PIKA_API_KEY: process.env.PIKA_API_KEY || '',
};
