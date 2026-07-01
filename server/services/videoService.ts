import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { logger } from '../config/logger';

export class VideoService {
  /**
   * Compresses a video using FFmpeg
   */
  static async compressVideo(inputPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      logger.info(`Starting video compression: ${inputPath} -> ${outputPath}`);
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .outputOptions(['-crf 28', '-preset fast'])
        .output(outputPath)
        .on('end', () => {
          logger.info(`Video compression completed: ${outputPath}`);
          resolve(outputPath);
        })
        .on('error', (err) => {
          logger.error({ err }, 'Video compression failed');
          reject(err);
        })
        .run();
    });
  }

  /**
   * Extracts a thumbnail from a video
   */
  static async extractThumbnail(videoPath: string, outputFolder: string, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      logger.info(`Extracting thumbnail for: ${videoPath}`);
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['50%'],
          filename,
          folder: outputFolder,
          size: '1280x720'
        })
        .on('end', () => {
          logger.info(`Thumbnail extracted to: ${path.join(outputFolder, filename)}`);
          resolve(path.join(outputFolder, filename));
        })
        .on('error', (err) => {
          logger.error({ err }, 'Thumbnail extraction failed');
          reject(err);
        });
    });
  }
}
