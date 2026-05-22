# MAP Spec Discover

MAP Spec Discover is the reverse-engineering mode of MyAgenticPlatform. Instead of generating specs from a brief, it reads an existing codebase and produces MAP Spec YAML files that reflect what is actually there.

## The Problem It Solves

Most teams cannot start from a blank slate. They have an existing codebase — a production API, a set of React components, a Postgres schema — built before MAP Spec existed. Discover lets those teams adopt spec-driven development without rewriting anything.

It also solves the blank-context problem for AI coding sessions. When a developer opens a new AI session to work on an existing system, the AI starts from zero. It does not know your table names, your naming conventions, your auth patterns, or your business rules. Discover produces grounded context that changes this.

## How Discover Works

Discover reads four sources from the codebase:

| Source | What It Extracts |
|--------|-----------------|
| `src/api/server.ts` | Every route: method, path, handler structure |
| `supabase/migrations/*.sql` | Every table, column, type, and constraint |
| `src/types/index.ts` | Every TypeScript interface and type alias |
| `dashboard/components/*.tsx` | Every React component and its prop types |

### Step 1 — CODEBASE-IDENTITY.md

Before writing any spec, Discover writes a `CODEBASE-IDENTITY.md` grounding document. This document is the single source of truth for what exists in the codebase right now:

- All API routes with their methods and paths
- All database tables and their primary columns
- All TypeScript interfaces
- All React components

The grounding document is passed as context to every spec-writing agent. This prevents hallucination — agents cannot invent routes or tables that do not exist because the grounding document lists only what was found.

Discover achieves 94% accuracy in referencing real code entities (vs hallucinated ones) when using the grounding document.

### Step 2 — Spec Generation by Layer

With the grounding document in place, Discover generates specs layer by layer:

1. **data** — One spec per table found in migrations
2. **api** — One spec per route found in server.ts
3. **ui** — One spec per component found in dashboard/components/
4. **functional** — Inferred from route + component combinations
5. **rules** — Inferred from conditional logic in route handlers
6. **meta** — Synthesised from project name, dependencies, and structure
7. **quality** — Generated as a template with platform-appropriate defaults

Each generated spec goes through the same pipeline as Phase 2 specs: `autoCorrectSpec()` → `validateSpecContent()` → save or `.broken.yaml`.

### Step 3 — Review and Refine

Discover output is a starting point, not a finished product. After generation:

- Review each spec for accuracy
- Fill in acceptance criteria on functional specs (Discover infers them from handler logic, but human review improves them)
- Add business context to rules specs (Discover sees the `if` statement but not the reason for it)
- Set realistic performance targets on quality specs

## What Discover Does Not Do

- Does not read private API keys or secrets (ignores `.env` files)
- Does not read test files (tests describe desired behaviour, not current behaviour)
- Does not execute the code — it reads and analyses statically
- Does not guarantee 100% coverage — files outside the four source locations are not read

## Domain Grouping

By default, Discover groups specs into four domains:

| Domain | Layers included |
|--------|----------------|
| requirements | functional, rules |
| architecture | api, data |
| frontend | ui |
| testing | quality |

This grouping controls which Phase 1 agents are relevant when Discover output feeds into a full platform pipeline.

## When to Use Discover

- When onboarding an existing codebase to MAP Spec for the first time
- After a significant refactor, to bring specs back into sync with code
- When starting a new AI coding session and wanting to provide grounded context
- When auditing an existing system for structural inconsistencies

## Output Structure

```
outputs/{projectId}/phase2/
├── CODEBASE-IDENTITY.md          ← grounding document
├── manifest.json                 ← list of all generated specs
├── data/
│   ├── DATA-001-videos.yaml
│   ├── DATA-002-categories.yaml
│   └── ...
├── api/
│   ├── API-001-get-video-stream.yaml
│   └── ...
├── ui/
│   └── ...
└── ...
```
