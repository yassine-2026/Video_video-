import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';
import { providers, getProviderByName } from '../providers';
import { AIProvider, VideoGenerationParams, VideoGenerationResult } from '../providers/aiProvider';
import fs from 'fs';
import path from 'path';

export interface Job {
  id: string;
  data: VideoGenerationParams;
  progress: number;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: number;
  providerJobId?: string;
  activeProviderName?: string;
}

class InMemoryQueue {
  private jobs: Map<string, Job> = new Map();

  async add(name: string, data: VideoGenerationParams): Promise<Job> {
    const id = uuidv4();
    const job: Job = {
      id,
      data,
      progress: 0,
      status: 'waiting',
      createdAt: Date.now(),
    };
    this.jobs.set(id, job);
    logger.info(`Job ${id} added to queue`);
    
    setTimeout(() => this.processJob(id), 100);
    
    return job;
  }

  async getJob(id: string): Promise<Job | null> {
    return this.jobs.get(id) || null;
  }

  private cleanupTempFiles(job: Job) {
    if (job.data.imageUrl) {
      try {
        const filePath = path.join(process.cwd(), job.data.imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.info(`Cleaned up temp file: ${filePath}`);
        }
      } catch (err) {
        logger.error({ err }, 'Failed to cleanup temp file');
      }
    }
  }

  private async tryProvider(job: Job, providerIndex: number): Promise<void> {
    if (providerIndex >= providers.length) {
      job.status = 'failed';
      job.error = 'All providers failed or are unavailable';
      logger.error(`Job ${job.id} failed: No more providers to try`);
      this.cleanupTempFiles(job);
      return;
    }

    const provider = providers[providerIndex];
    job.activeProviderName = provider.name;
    job.progress = 10;
    
    const startTime = Date.now();
    logger.info(`[Provider: ${provider.name}] Starting generation for Job ${job.id}`);

    try {
      const result = await provider.generateVideo(job.data);
      job.providerJobId = result.id;
      job.progress = 30;
      job.status = 'active';

      // Poll for completion
      const pollInterval = setInterval(async () => {
        if (job.status !== 'active') {
          clearInterval(pollInterval);
          return;
        }

        try {
          const status = await provider.checkStatus(result.id);
          if (status.status === 'completed') {
            clearInterval(pollInterval);
            job.status = 'completed';
            job.progress = 100;
            job.result = { videoUrl: status.videoUrl, provider: provider.name };
            
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            logger.info(`[Provider: ${provider.name}] Job ${job.id} COMPLETED in ${duration}s`);
            
            this.cleanupTempFiles(job);
          } else if (status.status === 'failed') {
            clearInterval(pollInterval);
            logger.warn(`[Provider: ${provider.name}] Job ${job.id} FAILED during processing: ${status.error}`);
            // Fallback to next provider
            await this.tryProvider(job, providerIndex + 1);
          } else {
            job.progress = Math.min(90, job.progress + 5);
          }
        } catch (error: any) {
          clearInterval(pollInterval);
          logger.warn(`[Provider: ${provider.name}] Job ${job.id} polling error: ${error.message}`);
          await this.tryProvider(job, providerIndex + 1);
        }
      }, 2000);

    } catch (error: any) {
      logger.warn(`[Provider: ${provider.name}] Failed to start generation: ${error.message}`);
      // Fallback to next provider immediately
      await this.tryProvider(job, providerIndex + 1);
    }
  }

  private async processJob(id: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    job.status = 'active';
    await this.tryProvider(job, 0);
  }

  async cancelJob(id: string) {
    const job = this.jobs.get(id);
    if (job) {
      if (job.status === 'active' && job.providerJobId && job.activeProviderName) {
        const provider = getProviderByName(job.activeProviderName);
        if (provider) {
          await provider.cancelJob(job.providerJobId);
        }
      }
      job.status = 'failed';
      job.error = 'Cancelled by user';
      this.cleanupTempFiles(job);
    }
  }
}

export const videoQueue = new InMemoryQueue();

const tempDir = path.resolve(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
