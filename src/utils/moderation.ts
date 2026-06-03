import { generateText } from 'ai';
import { google } from '@/utils/google';

export interface ModerationResult {
  flagged: boolean;
  reason?: string;
}

/**
 * Screen user prompts using the Google Gemini model to flag and block inappropriate,
 * dangerous, hateful, explicit, or abusive queries before hitting heavy generation tasks.
 */
export async function moderatePrompt(prompt: string): Promise<ModerationResult> {
  if (!prompt || !prompt.trim()) {
    return { flagged: false };
  }

  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system:
        'You are an AI safety agent designed to flag inappropriate or abusive content. ' +
        'Analyze the user prompt. Classify whether it violates guidelines (harassment, hate speech, explicit sexual content, self-harm instruction, illegal acts, cyberattacks, or weapon instructions). ' +
        'Respond ONLY in strict JSON format: {"flagged": boolean, "reason": "string or null"}.',
      prompt: prompt,
    });

    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.substring(7);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();

    const result = JSON.parse(cleanedText);

    return {
      flagged: !!result.flagged,
      reason: result.reason || undefined,
    };
  } catch (error) {
    console.error('AI Moderation screening failed, defaulting to bypass:', error);
    return { flagged: false };
  }
}
