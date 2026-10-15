/** Pull the figures out of a piece of text so a reply can be checked against the file. */
export function numberTokens(text: string): string[] {
  const found = new Set<string>();
  const patterns = [
    /(?:₹|\$)\s?\d[\d,]*(?:\.\d+)?/g,
    /\d[\d,]*(?:\.\d+)?\s?%/g,
    /\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g,
    /\b\d+\.\d+\b/g,
    /\b\d{3,}\b/g,
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const token = normalizeNumber(match[0]);
      if (token) found.add(token);
    }
  }
  return [...found];
}

function normalizeNumber(raw: string): string {
  const cleaned = raw.replace(/[₹$\s%,]/g, "");
  if (!cleaned || Number.isNaN(Number(cleaned))) return "";
  const numeric = Number(cleaned);
  if (numeric < 10 && !raw.includes(".") && !raw.includes("%") && !raw.includes("₹") && !raw.includes("$")) {
    return "";
  }
  return String(numeric);
}

/** Figures in `answer` that do not appear in `allowed`. */
export function inventedNumbers(answer: string, allowed: string): string[] {
  const known = new Set(numberTokens(allowed));
  return numberTokens(answer).filter((token) => !known.has(token));
}
