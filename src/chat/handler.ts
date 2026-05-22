import Anthropic from '@anthropic-ai/sdk';
import { KnowledgeChunk } from '../rag/loader';
import { retrieveRelevantChunks } from '../rag/retriever';
import { buildSystemPrompt } from './systemPrompt';
import { logger } from '../logger';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  sourcesUsed: string[];
  sessionId: string;
}

export async function handleChat(
  request: ChatRequest,
  knowledgeBase: KnowledgeChunk[],
  anthropic: Anthropic
): Promise<ChatResponse> {
  const { message, conversationHistory = [], sessionId } = request;

  const relevantChunks = retrieveRelevantChunks(message, knowledgeBase, 5);

  logger.info({
    sessionId,
    query: message.slice(0, 50),
    chunksFound: relevantChunks.length,
    topScore: relevantChunks[0]?.score?.toFixed(2),
  }, 'Clause retrieving context');

  const systemPrompt = buildSystemPrompt(relevantChunks);

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const responseText = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  const sourcesUsed = [...new Set(relevantChunks.map(c => c.source))];

  logger.info({
    sessionId,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    sourcesUsed,
  }, 'Clause response generated');

  return {
    response: responseText,
    sourcesUsed,
    sessionId: sessionId || `session-${Date.now()}`,
  };
}
