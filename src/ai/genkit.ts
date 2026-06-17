import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Support multiple API keys separated by commas
// In Netlify env, set: GEMINI_API_KEY=key1,key2,key3
const apiKeys = (process.env.GEMINI_API_KEY || '')
  .split(',')
  .map(k => k.trim())
  .filter(k => k.length > 0);

// Pick a random key each time a serverless container starts
// With 3 keys, this spreads load ~33% each
const selectedKey = apiKeys.length > 0 
  ? apiKeys[Math.floor(Math.random() * apiKeys.length)] 
  : undefined;

// Log which key index was selected (no sensitive data)
console.log(`[Genkit] ${apiKeys.length} API key(s) loaded. Using key #${apiKeys.indexOf(selectedKey || '') + 1}`);

export const ai = genkit({
  plugins: [googleAI({ apiKey: selectedKey })],
  model: 'googleai/gemini-2.0-flash',
});
