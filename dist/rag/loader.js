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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadKnowledgeBase = loadKnowledgeBase;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;
function extractKeywords(text) {
    const mapSpecTerms = [
        'map spec', 'mapspec', 'atomic spec', 'ai drift', 'drift',
        'spec driven', 'layer', 'meta', 'functional', 'api', 'data',
        'ui', 'rules', 'quality', 'aiinstruction', 'mandate',
        'phase 0', 'phase 1', 'phase 2', 'phase 3',
        'decomposer', 'agent', 'discover', 'codebase',
        'twelve factor', '12 factor', 'validation', 'correction',
        'yaml', 'atomic', 'endpoint', 'table', 'component',
        'acceptance criteria', 'user story', 'business rule',
        'myagenticplatform', 'claude', 'haiku', 'sonnet',
        'waitlist', 'hosted', 'pricing', 'free', 'mit',
    ];
    const textLower = text.toLowerCase();
    return mapSpecTerms.filter(term => textLower.includes(term));
}
function chunkText(text, source, sourceType, section) {
    const chunks = [];
    let start = 0;
    let chunkIndex = 0;
    while (start < text.length) {
        const end = Math.min(start + CHUNK_SIZE, text.length);
        const content = text.slice(start, end).trim();
        if (content.length > 50) {
            chunks.push({
                id: `${source}-chunk-${chunkIndex}`,
                source,
                sourceType,
                section,
                content,
                keywords: extractKeywords(content),
                charStart: start,
                charEnd: end,
            });
            chunkIndex++;
        }
        if (end >= text.length)
            break;
        start = end - CHUNK_OVERLAP;
    }
    return chunks;
}
function extractSections(markdown) {
    const sections = [];
    const lines = markdown.split('\n');
    let currentHeading = 'Introduction';
    let currentContent = [];
    for (const line of lines) {
        if (line.startsWith('## ') || line.startsWith('# ')) {
            if (currentContent.length > 0) {
                sections.push({
                    heading: currentHeading,
                    content: currentContent.join('\n').trim(),
                });
            }
            currentHeading = line.replace(/^#+\s/, '');
            currentContent = [];
        }
        else {
            currentContent.push(line);
        }
    }
    if (currentContent.length > 0) {
        sections.push({
            heading: currentHeading,
            content: currentContent.join('\n').trim(),
        });
    }
    return sections;
}
function loadKnowledgeBase(docsPath, examplesPath) {
    const chunks = [];
    if (fs.existsSync(docsPath)) {
        const docFiles = fs.readdirSync(docsPath).filter(f => f.endsWith('.md'));
        for (const file of docFiles) {
            const content = fs.readFileSync(path.join(docsPath, file), 'utf8');
            const sections = extractSections(content);
            for (const section of sections) {
                const sectionChunks = chunkText(section.content, file, 'doc', section.heading);
                chunks.push(...sectionChunks);
            }
            console.log(`Loaded: ${file} → ${sections.length} sections`);
        }
    }
    if (fs.existsSync(examplesPath)) {
        const yamlFiles = fs.readdirSync(examplesPath)
            .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
        for (const file of yamlFiles) {
            const content = fs.readFileSync(path.join(examplesPath, file), 'utf8');
            const exampleChunks = chunkText(`Example MAP Spec file: ${file}\n\n${content}`, file, 'example', file.replace('.yaml', '').replace('example-', ''));
            chunks.push(...exampleChunks);
            console.log(`Loaded: ${file} → ${exampleChunks.length} chunks`);
        }
    }
    console.log(`\nKnowledge base loaded: ${chunks.length} total chunks`);
    return chunks;
}
