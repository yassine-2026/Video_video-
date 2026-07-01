import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export function getFileUrlOrDataUri(localUrlPath: string): string | null {
  if (!localUrlPath) return null;
  
  // If APP_URL is configured and not localhost, we can use it
  if (env.APP_URL && !env.APP_URL.includes('localhost')) {
    return `${env.APP_URL}${localUrlPath}`;
  }

  // Fallback to Data URI for local development
  try {
    const relativePath = localUrlPath.replace(/^\//, ''); // remove leading slash
    const fullPath = path.resolve(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).substring(1);
      const base64 = fs.readFileSync(fullPath).toString('base64');
      return `data:image/${ext};base64,${base64}`;
    }
  } catch (e) {
    return null;
  }
  return null;
}
