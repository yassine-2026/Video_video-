import axios from 'axios';
import { AIProvider, VideoGenerationParams, VideoGenerationResult } from './aiProvider';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { getFileUrlOrDataUri } from '../utils/fileHelper';

export class LumaProvider implements AIProvider {
  name = 'Luma';
  
  private get headers() {
    return {
      'Authorization': `Bearer ${env.LUMA_API_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult> {
    if (!env.LUMA_API_KEY) {
      throw new Error('LUMA_API_KEY is not configured');
    }

    try {
      const payload: any = {
        prompt: params.prompt,
      };
      
      if (params.imageUrl) {
         const fileUrl = getFileUrlOrDataUri(params.imageUrl);
         if (fileUrl) {
           payload.image_url = fileUrl;
         }
      }
      
      const response = await axios.post('https://api.lumalabs.ai/dream-machine/v1/generations', payload, { headers: this.headers });
      
      return {
        id: response.data.id,
        status: 'pending',
        provider: this.name
      };
    } catch (error: any) {
      logger.error({ err: error.response?.data || error.message }, 'Luma API Error');
      throw new Error(`Luma generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async checkStatus(jobId: string): Promise<VideoGenerationResult> {
    try {
      const response = await axios.get(`https://api.lumalabs.ai/dream-machine/v1/generations/${jobId}`, { headers: this.headers });
      const data = response.data;
      
      let status: 'pending' | 'processing' | 'completed' | 'failed' = 'processing';
      if (data.state === 'completed') status = 'completed';
      if (data.state === 'failed') status = 'failed';
      if (data.state === 'pending') status = 'pending';

      return {
        id: jobId,
        status,
        videoUrl: data.assets?.video,
        error: data.failure_reason,
        provider: this.name
      };
    } catch (error: any) {
      throw new Error(`Luma status check failed: ${error.message}`);
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    try {
       await axios.delete(`https://api.lumalabs.ai/dream-machine/v1/generations/${jobId}`, { headers: this.headers });
    } catch (error: any) {
       logger.warn(`Could not cancel Luma job ${jobId}: ${error.message}`);
    }
  }
}
