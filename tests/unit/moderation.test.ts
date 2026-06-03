import { describe, it, expect, vi } from 'vitest';
import { moderatePrompt } from '../../src/utils/moderation';
import { generateText } from 'ai';

// Mock the Vercel AI SDK 'ai'
vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

describe('moderatePrompt helper', () => {
  it('should return flagged: true if Gemini returns flagged: true', async () => {
    vi.mocked(generateText).mockResolvedValueOnce({
      text: '{"flagged": true, "reason": "harassment"}',
    } as any);

    const result = await moderatePrompt('inappropriate content');
    expect(result).toEqual({ flagged: true, reason: 'harassment' });
  });

  it('should return flagged: false if Gemini returns flagged: false', async () => {
    vi.mocked(generateText).mockResolvedValueOnce({
      text: '{"flagged": false, "reason": null}',
    } as any);

    const result = await moderatePrompt('tell me a story about a kitten');
    expect(result).toEqual({ flagged: false, reason: undefined });
  });

  it('should handle markdown code block formatting in JSON response', async () => {
    vi.mocked(generateText).mockResolvedValueOnce({
      text: '```json\n{"flagged": false, "reason": null}\n```',
    } as any);

    const result = await moderatePrompt('tell me a story about a puppy');
    expect(result).toEqual({ flagged: false, reason: undefined });
  });
});
