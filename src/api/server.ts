import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { loadKnowledgeBase, KnowledgeChunk } from '../rag/loader';
import { handleChat } from '../chat/handler';
import { logger } from '../logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (process.env.ALLOWED_ORIGINS === '*') {
      return callback(null, true);
    }

    const allowed = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn({ origin, allowed }, 'CORS blocked origin');
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

app.use(express.json({ limit: '10kb' }));

const DOCS_PATH = path.resolve(
  process.env.KNOWLEDGE_BASE_PATH || './knowledge/docs'
);
const EXAMPLES_PATH = path.resolve(
  process.env.EXAMPLES_PATH || './knowledge/examples'
);

let knowledgeBase: KnowledgeChunk[] = [];
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function initialize() {
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.error('ANTHROPIC_API_KEY is not set — Clause will fail all chat requests');
  } else {
    logger.info('ANTHROPIC_API_KEY is set ✓');
  }
  logger.info('Loading Clause knowledge base...');
  knowledgeBase = loadKnowledgeBase(DOCS_PATH, EXAMPLES_PATH);
  logger.info({
    chunks: knowledgeBase.length,
    docsPath: DOCS_PATH,
  }, 'Clause ready');
}

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    agent: 'Clause',
    version: process.env.CLAUSE_VERSION || '1.0.0',
    knowledgeChunks: knowledgeBase.length,
    model: 'claude-haiku-4-5-20251001',
  });
});

app.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory, sessionId } = req.body as {
      message: unknown;
      conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
      sessionId?: string;
    };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'message is required and must be a string',
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: 'message too long (max 1000 chars)',
      });
    }

    if (knowledgeBase.length === 0) {
      return res.status(503).json({
        error: 'Knowledge base not loaded yet',
      });
    }

    const response = await handleChat(
      { message, conversationHistory, sessionId },
      knowledgeBase,
      anthropic
    );

    return res.json(response);

  } catch (err) {
    logger.error({ err }, 'Chat handler error');
    return res.status(500).json({
      error: 'Clause is having trouble right now. Try again shortly.',
    });
  }
});

app.post('/reload-knowledge', async (_req, res) => {
  try {
    knowledgeBase = loadKnowledgeBase(DOCS_PATH, EXAMPLES_PATH);
    res.json({
      message: 'Knowledge base reloaded',
      chunks: knowledgeBase.length,
    });
  } catch (err) {
    logger.error({ err }, 'Knowledge reload failed');
    res.status(500).json({ error: 'Reload failed' });
  }
});

initialize().then(() => {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Clause agent running');
  });
}).catch(err => {
  logger.error({ err }, 'Failed to initialize Clause');
  process.exit(1);
});

export default app;
