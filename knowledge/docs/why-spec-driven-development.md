# Why Spec-Driven Development?

Software teams have always written specs. The problem is that traditional specs — Word documents, Confluence pages, Notion wikis — are not machine-readable. They inform humans but are invisible to the AI tools that now write most of the code.

Spec-driven development closes that gap. The spec is not documentation written after the code — it is the precise, versioned, machine-readable contract that comes before the code and governs everything that follows.

## The Problem With Prompt-Driven Development

When a team builds with AI today, they typically write a prompt, get code, and iterate. That works for a single feature in a single session. It breaks down the moment:

- A second developer opens a new chat and builds the same feature differently
- The AI generates a `/users` endpoint in one session and a `/user` endpoint in another
- A database column added in Week 1 is named `userId` in one file and `user_id` in another
- A business rule about subscription tiers is implemented four different ways across four components

This problem is called **AI drift**. Without a spec contract, each AI session starts from zero — and zero means inconsistency.

## What a Spec Contract Gives You

A MAP Spec file for `GET /videos/:videoId/stream` specifies:

- The exact HTTP method and path
- Every parameter, its type, whether it is required
- Every possible response code and its schema
- The auth requirement (bearer token)
- The rate limit
- The rule IDs that govern access

Any AI agent — in any session, on any machine — reading that spec generates the same endpoint. Not identical code, but consistent architecture. The contract is honoured.

## Spec-Driven vs Test-Driven

Test-driven development (TDD) gives you confidence that existing code behaves correctly. Spec-driven development gives you confidence that the code you are about to generate is the right code. They complement each other — specs define what to build, tests verify it was built correctly.

## The Development Loop

In spec-driven development:

1. **Specify** — Write or generate atomic YAML specs for the feature
2. **Review** — Product, engineering, and design review specs before any code is written
3. **Generate** — AI agents use specs as grounded context to write consistent code
4. **Validate** — Tests verify the code matches the spec
5. **Iterate** — Spec changes drive code changes, not the other way around

## Why YAML?

YAML is readable by both humans and machines. A product manager can read an acceptance criteria list. A Zod validator can parse the same file and reject malformed entries. A code generator can load the file and access `unit.responses[200].schema` directly.

JSON would also work. Markdown would not — it is not structured enough for programmatic access. YAML hits the right balance of readability and structure.

## The Compounding Return

The value of specs compounds over time. A team six months into spec-driven development has a versioned library of contracts. New features reference existing data specs instead of re-inventing table schemas. New AI sessions start with a grounded understanding of the entire system — not a blank slate. The codebase gets more consistent as it gets larger, not less.
