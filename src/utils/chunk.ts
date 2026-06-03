/**
 * Helper to split a long string into smaller text chunks,
 * ensuring slice boundaries occur at word space limits where possible.
 */
export function chunkText(text: string, chunkSize: number = 800, overlap: number = 100): string[] {
  const chunks: string[] = [];
  if (!text) return chunks;

  let startIndex = 0;
  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    
    // Don't slice in the middle of a word; find the nearest space
    if (endIndex < text.length) {
      const spaceIndex = text.lastIndexOf(' ', endIndex);
      if (spaceIndex > startIndex) {
        endIndex = spaceIndex;
      }
    }
    
    const chunk = text.slice(startIndex, endIndex).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    
    // Move starting index back by the overlap amount (ensuring forward progress)
    const nextIndex = endIndex - overlap;
    if (nextIndex <= startIndex) {
      startIndex = endIndex;
    } else {
      startIndex = nextIndex;
    }
  }
  return chunks;
}
