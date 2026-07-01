import axios from 'axios';
import { AIProvider, VideoGenerationParams, VideoGenerationResult } from './aiProvider';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class PikaProvider implements AIProvider {
  name = 'Pika';
  
  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult> {
    logger.info(`[Provider: Pika] Pika does not currently offer a public API for video generation.`);
    throw new Error('Pika API is not supported. Please use Runway or Luma.');
  }

  async checkStatus(jobId: string): Promise<VideoGenerationResult> {
    throw new Error('Pika API is not supported.');
  }

  async cancelJob(jobId: string): Promise<void> {
    // Do nothing
  }
}
