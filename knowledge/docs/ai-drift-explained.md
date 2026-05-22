# AI Drift Explained

AI drift is the gradual architectural inconsistency that accumulates when a codebase is built with AI coding tools across multiple sessions, developers, or models — without a shared spec contract.

## Why It Happens

Every AI coding session starts with a context window. What goes into that context determines what the AI produces. If two developers describe the same feature in two slightly different ways, they get two slightly different implementations. If the same developer returns to a feature three weeks later, they may not remember (or not include) the exact decisions made in the first session.

The AI is not being careless. It is doing exactly what it was asked — in isolation. The problem is that software systems are not built in isolation.

## What AI Drift Looks Like

These are real patterns that emerge in AI-assisted codebases without spec contracts:

**Naming inconsistency**
```
# Session 1 — developer asks for a user lookup endpoint
GET /users/:userId

# Session 2 — different developer, same feature
GET /user/:id
```

**Schema inconsistency**
```typescript
// File written in Week 1
interface Project { clientId: string; }

// File written in Week 4 (AI did not see Week 1 file)
interface Project { client_id: string; }
```

**Business rule inconsistency**
```typescript
// Auth check in the streaming endpoint
if (!user || user.tier !== 'premium') return 403;

// Auth check in the download endpoint
if (!user) return 401;
// (subscription check was forgotten entirely)
```

**Duplicate abstractions**
```typescript
// utils/format-date.ts (created in March)
export function formatDate(d: Date): string { ... }

// helpers/dates.ts (created in May, AI did not know about utils/)
export function toDateString(date: Date): string { ... }
```

## Why It Gets Worse Over Time

AI drift is self-reinforcing. Each inconsistent file becomes context for future AI sessions. The AI learns from what it sees and produces more files that match the inconsistent patterns. By the time a team notices they have two date-formatting utilities and three different naming conventions for user IDs, fixing it requires touching hundreds of files.

## The Spec Contract Solution

A MAP Spec contract stops drift at the source. Before any code is generated:

- The API endpoint is defined once — method, path, parameter names, response schemas
- The database column is named once — `user_id` everywhere, always
- The business rule is written once — the rule spec is the single source of truth

Every AI session that generates code against these specs reads the same contracts. The implementation details vary (coding style, variable names inside functions) but the architectural decisions are locked.

## MAP Spec Discover

For teams with existing codebases, MAP Spec Discover reverse-engineers specs from the current code. It reads your routes, database migrations, TypeScript interfaces, and React components — and produces a `CODEBASE-IDENTITY.md` grounding document plus atomic spec files that reflect the actual system.

This gives existing codebases a spec contract retroactively, halting further drift without requiring a rewrite.

## Measuring Drift

Signs that a codebase has accumulated significant AI drift:

- More than two naming conventions for the same concept (userId / user_id / uid)
- Business logic duplicated in more than two places
- API endpoints that do the same thing at different paths
- Utility functions with the same purpose in different files
- TypeScript interfaces that overlap but are never reconciled

If any of these are present, starting with MAP Spec Discover is the right first step.
