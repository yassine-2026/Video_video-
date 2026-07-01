export interface VideoJob {
  id: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  result?: {
    videoUrl?: string;
    thumbnailUrl?: string;
    provider?: string;
  };
  error?: string;
  createdAt: number;
  activeProviderName?: string;
}
