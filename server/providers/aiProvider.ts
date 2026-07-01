export interface VideoGenerationParams {
  prompt: string;
  duration: number; // in seconds
  aspectRatio: string; // e.g. "16:9"
  imageUrl?: string;
  quality: string;
  style?: string;
  motionSpeed?: string;
  cameraMotion?: string;
}

export interface VideoGenerationResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  provider?: string;
}

export interface AIProvider {
  name: string;
  generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult>;
  checkStatus(jobId: string): Promise<VideoGenerationResult>;
  cancelJob(jobId: string): Promise<void>;
}
