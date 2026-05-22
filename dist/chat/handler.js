"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = handleChat;
const retriever_1 = require("../rag/retriever");
const systemPrompt_1 = require("./systemPrompt");
const logger_1 = require("../logger");
async function handleChat(request, knowledgeBase, anthropic) {
    const { message, conversationHistory = [], sessionId } = request;
    const relevantChunks = (0, retriever_1.retrieveRelevantChunks)(message, knowledgeBase, 5);
    logger_1.logger.info({
        sessionId,
        query: message.slice(0, 50),
        chunksFound: relevantChunks.length,
        topScore: relevantChunks[0]?.score?.toFixed(2),
    }, 'Clause retrieving context');
    const systemPrompt = (0, systemPrompt_1.buildSystemPrompt)(relevantChunks);
    const messages = [
        ...conversationHistory.map(m => ({
            role: m.role,
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
    logger_1.logger.info({
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
