import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Centralized Google Generative AI SDK provider configured with env variable fallback
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '',
});
