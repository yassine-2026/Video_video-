import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger';
import { videoQueue } from './queue';

const TEMP_DIR = path.resolve(process.cwd(), 'temp');
const MAX_AGE_MS = 1000 * 60 * 60; // 1 hour

export function cleanupTempDirectory() {
  if (!fs.existsSync(TEMP_DIR)) {
    return;
  }

  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();

    let deletedCount = 0;
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > MAX_AGE_MS) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      } catch (err: any) {
        logger.warn(`Failed to process/delete file ${filePath}: ${err.message}`);
      }
    }

    if (deletedCount > 0) {
      logger.info(`Cleaned up ${deletedCount} old files from temp directory.`);
    }
  } catch (error: any) {
    logger.error(`Error during temp directory cleanup: ${error.message}`);
  }
}

// Start periodic cleanup
export function startPeriodicCleanup() {
  // Run every 30 minutes
  setInterval(() => {
    cleanupTempDirectory();
    videoQueue.cleanupOldJobs();
  }, 30 * 60 * 1000);
  logger.info('Periodic cleanup scheduled (temp files & jobs).');
}
