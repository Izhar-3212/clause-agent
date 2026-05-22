import { KnowledgeChunk } from './loader';

export interface RetrievedChunk extends KnowledgeChunk {
  score: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter(w => !['the', 'and', 'for', 'with', 'that',
                   'this', 'from', 'have', 'will', 'are',
                   'was', 'been', 'has', 'had', 'not',
                   'but', 'can', 'its', 'you', 'your',
                   'what', 'how', 'why', 'when', 'where',
                   'does', 'did', 'should', 'would', 'could',
                   'use', 'used', 'using'].includes(w));
}

function bm25Score(
  query: string[],
  chunk: KnowledgeChunk,
  avgDocLength: number,
  k1 = 1.5,
  b = 0.75
): number {
  const docTokens = tokenize(chunk.content);
  const docLength = docTokens.length;
  let score = 0;

  for (const term of query) {
    const tf = docTokens.filter(t => t === term).length;
    if (tf === 0) continue;

    const idf = Math.log(1 + 1 / (0.5 + tf));
    const tfNorm = (tf * (k1 + 1)) /
      (tf + k1 * (1 - b + b * docLength / avgDocLength));

    score += idf * tfNorm;
  }

  const keywordMatches = query.filter(
    q => chunk.keywords.some(k => k.includes(q))
  ).length;
  score += keywordMatches * 0.5;

  const queryStr = query.join(' ');
  if (chunk.content.toLowerCase().includes(queryStr)) {
    score += 2.0;
  }

  return score;
}

export function retrieveRelevantChunks(
  query: string,
  chunks: KnowledgeChunk[],
  maxChunks: number = 5
): RetrievedChunk[] {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) return [];

  const avgDocLength = chunks.reduce(
    (sum, c) => sum + tokenize(c.content).length, 0
  ) / chunks.length;

  const scored = chunks.map(chunk => ({
    ...chunk,
    score: bm25Score(queryTokens, chunk, avgDocLength),
  }));

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}
