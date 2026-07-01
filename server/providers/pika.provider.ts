import axios from 'axios';
import { AIProvider, VideoGenerationParams, VideoGenerationResult } from './aiProvider';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class PikaProvider implements AIProvider {
  name = 'Pika';
  
  private get headers() {
    return {
      'Authorization': `Bearer ${env.PIKA_API_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult> {
    if (!env.PIKA_API_KEY) {
      throw new Error('PIKA_API_KEY is not configured');
    }

    try {
      const payload: any = {
        prompt: params.prompt,
        options: {
          aspectRatio: params.aspectRatio,
        }
      };
      
      const response = await axios.post('https://api.pika.art/v1/generate', payload, { headers: this.headers });
      
      return {
        id: response.data.id || response.data.jobId,
        status: 'pending',
        provider: this.name
      };
    } catch (error: any) {
      logger.error({ err: error.response?.data || error.message }, 'Pika API Error');
      throw new Error(`Pika generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async checkStatus(jobId: string): Promise<VideoGenerationResult> {
    try {
      const response = await axios.get(`https://api.pika.art/v1/jobs/${jobId}`, { headers: this.headers });
      const data = response.data;
      
      let status: 'pending' | 'processing' | 'completed' | 'failed' = 'processing';
      if (data.status === 'completed') status = 'completed';
      if (data.status === 'failed') status = 'failed';
      if (data.status === 'queued') status = 'pending';

      return {
        id: jobId,
        status,
        videoUrl: data.videos?.[0]?.url || data.video?.url,
        error: data.error,
        provider: this.name
      };
    } catch (error: any) {
      throw new Error(`Pika status check failed: ${error.message}`);
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    try {
       await axios.post(`https://api.pika.art/v1/jobs/${jobId}/cancel`, {}, { headers: this.headers });
    } catch (error: any) {
       logger.warn(`Could not cancel Pika job ${jobId}: ${error.message}`);
    }
  }
}
