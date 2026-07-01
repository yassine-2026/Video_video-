import axios from 'axios';
import { AIProvider, VideoGenerationParams, VideoGenerationResult } from './aiProvider';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { getFileUrlOrDataUri } from '../utils/fileHelper';

export class RunwayProvider implements AIProvider {
  name = 'Runway';
  
  private get headers() {
    return {
      'Authorization': `Bearer ${env.RUNWAY_API_KEY}`,
      'X-Runway-Version': '2024-11-06',
      'Content-Type': 'application/json'
    };
  }

  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult> {
    if (!env.RUNWAY_API_KEY) {
      throw new Error('RUNWAY_API_KEY is not configured');
    }

    try {
      const payload: any = {
        promptText: params.prompt,
        model: 'gen3a_turbo',
      };
      
      if (params.imageUrl) {
        const fileUrl = getFileUrlOrDataUri(params.imageUrl);
        if (fileUrl) {
          payload.promptImage = fileUrl;
        }
      }
      
      const response = await axios.post('https://api.dev.runwayml.com/v1/image_to_video', payload, { headers: this.headers });
      
      return {
        id: response.data.id,
        status: 'pending',
        provider: this.name
      };
    } catch (error: any) {
      logger.error({ err: error.response?.data || error.message }, 'Runway API Error');
      throw new Error(`Runway generation failed: ${error.response?.data?.error?.message || error.response?.data?.message || error.message}`);
    }
  }

  async checkStatus(jobId: string): Promise<VideoGenerationResult> {
    try {
      const response = await axios.get(`https://api.dev.runwayml.com/v1/tasks/${jobId}`, { headers: this.headers });
      const data = response.data;
      
      let status: 'pending' | 'processing' | 'completed' | 'failed' = 'processing';
      if (data.status === 'SUCCEEDED') status = 'completed';
      else if (data.status === 'FAILED') status = 'failed';
      else if (data.status === 'PENDING') status = 'pending';

      return {
        id: jobId,
        status,
        videoUrl: Array.isArray(data.output) ? data.output[0] : data.output,
        error: data.failure || data.failureCode,
        provider: this.name
      };
    } catch (error: any) {
      throw new Error(`Runway status check failed: ${error.message}`);
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    try {
       await axios.post(`https://api.dev.runwayml.com/v1/tasks/${jobId}/cancel`, {}, { headers: this.headers });
    } catch (error: any) {
       logger.warn(`Could not cancel Runway job ${jobId}: ${error.message}`);
    }
  }
}
