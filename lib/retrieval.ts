// Matches a recruiter's question to a pre-written answer.
// With a query embedding it blends semantic and keyword scores; without one
// (the model hasn't loaded or can't load) it uses keywords alone.

import type { Entry } from "../content/knowledge.ts";

/** One stored embedding per question variant: entryId + unit-length vector. */
export type StoredVector = { id: string; text: string; vector: number[] };

export type Match = {
  entry: Entry;
  score: number;
  /** The stored question that matched best, shown to the user for transparency. */
  matched: string;
};

export type Result = {
  /** Best match when confident, otherwise null (use the fallback answer). */
  match: Match | null;
  mode: "semantic" | "keyword";
  /** Next-best entries, used as suggestions when there's no confident match. */
  ranked: Match[];
};

export const SEMANTIC_WEIGHT = 0.8;
export const SEMANTIC_THRESHOLD = 0.5;
export const KEYWORD_THRESHOLD = 0.45;

const STOPWORDS = new Set(
  `a about am an and any are as at be been but by can could did do does for from get give
  has have he her him his how i if in is it its just kind let like me much my of on or our
  please she should show so some tell than that the their them there they this to us was we
  were what when where which who why will with would you your soham sohams banerjee s`.split(/\s+/),
);

function stem(token: string): string {
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/h2o\.ai/g, "h2o")
    .replace(/[’']/g, "")
    .split(/[^a-z0-9+#]+/)
    .filter((token) => token && !STOPWORDS.has(token))
    .map(stem);
}

export function buildIndex(entries: Entry[]) {
  const tokens = new Map<string, Set<string>>();
  const documentFrequency = new Map<string, number>();
  for (const entry of entries) {
    const set = new Set([...entry.questions, ...(entry.keywords ?? [])].flatMap(tokenize));
    tokens.set(entry.id, set);
    for (const token of set) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }
  const idf = (token: string) =>
    Math.log(1 + entries.length / (documentFrequency.get(token) ?? 0.5));
  return { entries, tokens, idf };
}

export type Index = ReturnType<typeof buildIndex>;

/** Share of the question's information (idf-weighted) found in the entry's questions. */
export function keywordScore(query: string, entry: Entry, index: Index): number {
  const queryTokens = [...new Set(tokenize(query))];
  if (queryTokens.length === 0) return 0;
  const entryTokens = index.tokens.get(entry.id);
  let found = 0;
  let total = 0;
  for (const token of queryTokens) {
    const weight = index.idf(token);
    total += weight;
    if (entryTokens?.has(token)) found += weight;
  }
  return found / total;
}

function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

export function search(
  query: string,
  index: Index,
  queryVector?: number[] | null,
  vectors?: StoredVector[] | null,
): Result {
  const semantic = Boolean(queryVector && vectors?.length);

  const ranked: Match[] = index.entries.map((entry) => {
    const keyword = keywordScore(query, entry, index);
    if (!semantic) return { entry, score: keyword, matched: entry.questions[0] };

    let best = -1;
    let matched = entry.questions[0];
    for (const stored of vectors!) {
      if (stored.id !== entry.id) continue;
      const similarity = dot(queryVector!, stored.vector);
      if (similarity > best) {
        best = similarity;
        matched = stored.text;
      }
    }
    return {
      entry,
      score: SEMANTIC_WEIGHT * best + (1 - SEMANTIC_WEIGHT) * keyword,
      matched,
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  const threshold = semantic ? SEMANTIC_THRESHOLD : KEYWORD_THRESHOLD;
  return {
    match: ranked[0] && ranked[0].score >= threshold ? ranked[0] : null,
    mode: semantic ? "semantic" : "keyword",
    ranked,
  };
}
