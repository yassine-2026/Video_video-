import { AIProvider } from './aiProvider';
import { RunwayProvider } from './runway.provider';
import { LumaProvider } from './luma.provider';
import { PikaProvider } from './pika.provider';

export const providers: AIProvider[] = [
  new RunwayProvider(),
  new LumaProvider(),
  new PikaProvider(),
];

export function getProviderByName(name: string): AIProvider | undefined {
  return providers.find(p => p.name === name);
}
