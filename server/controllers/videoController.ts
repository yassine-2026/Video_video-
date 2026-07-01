import { Request, Response, NextFunction } from 'express';
import { videoQueue } from '../workers/queue';
import { AppError } from '../utils/error';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, duration, aspectRatio, quality, style, motionSpeed, cameraMotion } = req.body;
    
    if (!prompt) {
      return next(new AppError('Prompt is required', 400));
    }

    const file = req.file; // From multer
    const imageUrl = file ? `/temp/${file.filename}` : undefined;

    const job = await videoQueue.add('generate-video', {
      prompt,
      duration: parseInt(duration) || 5,
      aspectRatio: aspectRatio || '16:9',
      quality: quality || 'high',
      style,
      motionSpeed,
      cameraMotion,
      imageUrl
    });

    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getJobStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await videoQueue.getJob(id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        result: job.result,
        error: job.error,
        createdAt: job.createdAt,
        activeProviderName: job.activeProviderName
      }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await videoQueue.cancelJob(id);
    
    res.status(200).json({
      success: true,
      message: 'Job cancelled'
    });
  } catch (error) {
    next(error);
  }
};
