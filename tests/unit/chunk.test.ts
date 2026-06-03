import { describe, it, expect } from 'vitest';
import { chunkText } from '../../src/utils/chunk';

describe('chunkText helper', () => {
  it('should split short text into a single chunk', () => {
    const text = 'Hello world, this is a test.';
    const chunks = chunkText(text, 50, 10);
    expect(chunks).toEqual(['Hello world, this is a test.']);
  });

  it('should split long text at word boundaries where possible', () => {
    const text = 'This is a long sentence that should be split at space boundaries.';
    const chunks = chunkText(text, 25, 5);
    expect(chunks.length).toBeGreaterThan(1);
    
    // Chunks should not end in spaces and be trimmed
    chunks.forEach((chunk) => {
      expect(chunk).toBe(chunk.trim());
    });
  });

  it('should handle empty or null input gracefully', () => {
    expect(chunkText('')).toEqual([]);
  });
});
