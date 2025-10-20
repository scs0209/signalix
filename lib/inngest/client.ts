import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'signalix',
  ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! } },
});
