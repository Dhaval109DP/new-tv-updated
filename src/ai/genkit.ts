import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Support multiple API keys separated by commas
const apiKeys = (process.env.GEMINI_API_KEY || '')
  .split(',')
  .map(k => k.trim())
  .filter(k => k.length > 0);

// Pick a random key from the pool (evaluated per serverless container cold-start)
const selectedKey = apiKeys.length > 0 
  ? apiKeys[Math.floor(Math.random() * apiKeys.length)] 
  : undefined;

export const ai = genkit({
  plugins: [googleAI({ apiKey: selectedKey })],
  model: 'googleai/gemini-2.0-flash',
});
