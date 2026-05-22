"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const loader_1 = require("../rag/loader");
const handler_1 = require("../chat/handler");
const logger_1 = require("../logger");
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (process.env.ALLOWED_ORIGINS === '*') {
            return callback(null, true);
        }
        const allowed = (process.env.ALLOWED_ORIGINS || '')
            .split(',')
            .map(o => o.trim())
            .filter(Boolean);
        if (allowed.includes(origin)) {
            callback(null, true);
        }
        else {
            logger_1.logger.warn({ origin, allowed }, 'CORS blocked origin');
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
}));
app.use(express_1.default.json({ limit: '10kb' }));
const DOCS_PATH = path.resolve(process.env.KNOWLEDGE_BASE_PATH || './knowledge/docs');
const EXAMPLES_PATH = path.resolve(process.env.EXAMPLES_PATH || './knowledge/examples');
let knowledgeBase = [];
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
async function initialize() {
    if (!process.env.ANTHROPIC_API_KEY) {
        logger_1.logger.error('ANTHROPIC_API_KEY is not set — Clause will fail all chat requests');
    }
    else {
        logger_1.logger.info('ANTHROPIC_API_KEY is set ✓');
    }
    logger_1.logger.info('Loading Clause knowledge base...');
    knowledgeBase = (0, loader_1.loadKnowledgeBase)(DOCS_PATH, EXAMPLES_PATH);
    logger_1.logger.info({
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
        const { message, conversationHistory, sessionId } = req.body;
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
        const response = await (0, handler_1.handleChat)({ message, conversationHistory, sessionId }, knowledgeBase, anthropic);
        return res.json(response);
    }
    catch (err) {
        logger_1.logger.error({ err }, 'Chat handler error');
        return res.status(500).json({
            error: 'Clause is having trouble right now. Try again shortly.',
        });
    }
});
app.post('/reload-knowledge', async (_req, res) => {
    try {
        knowledgeBase = (0, loader_1.loadKnowledgeBase)(DOCS_PATH, EXAMPLES_PATH);
        res.json({
            message: 'Knowledge base reloaded',
            chunks: knowledgeBase.length,
        });
    }
    catch (err) {
        logger_1.logger.error({ err }, 'Knowledge reload failed');
        res.status(500).json({ error: 'Reload failed' });
    }
});
initialize().then(() => {
    app.listen(PORT, () => {
        logger_1.logger.info({ port: PORT }, 'Clause agent running');
    });
}).catch(err => {
    logger_1.logger.error({ err }, 'Failed to initialize Clause');
    process.exit(1);
});
exports.default = app;
