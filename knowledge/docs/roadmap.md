# Roadmap

This document describes what is built, what is in progress, and what is planned for MAP Spec and MyAgenticPlatform.

## Current — v1.1.0

### What Is Shipped

**Phase 0 — Clarification + Mandate + Agent Selection**
- Clarifier generates targeted questions from the brief
- Mandate writer synthesises brief + answers into a structured contract
- Agent selector picks relevant agents from 35 available

**Phase 1 — 35 AI Agents**
- 35 specialised agents across 7 categories (business, architecture, frontend, security, quality, operations, legal)
- SDLC-ordered execution with dependency management
- Smart agents (structured JSON output) alongside verbose agents (markdown)
- Model routing: Sonnet for complex analysis, Haiku for structured output

**Phase 2 — Atomic YAML Generation**
- Decomposer produces a spec plan from Phase 1 artifacts
- 7 spec writers (one per layer) generate atomic YAML files
- 10+ auto-correction patterns fix common LLM output errors
- Zod schema validation with per-layer schemas
- Broken spec logging (.broken.yaml) for manual recovery
- Batch generation: 5 concurrent (3 for resume)
- reconcileSpecs() post-generation consistency check

**MAP Spec Discover**
- Reverse-engineers specs from existing codebases
- CODEBASE-IDENTITY.md grounding document (prevents hallucination)
- 94% accuracy in referencing real code entities
- Reads routes, migrations, TypeScript interfaces, React components

**Twelve-Factor Compliance**
- 100 checks (57 technical + 43 policy)
- Per-factor badge display in dashboard
- TwelveFactorReport JSON output

**Implementation Board**
- Kanban view of all generated specs
- Backlog organisation by layer and priority
- Roadmap view: Epic → Story → Task hierarchy

---

## In Progress

**MAP Spec v1.2.0 Schema**

Proposed additions to the YAML schema:
- `dependencies` field on api specs (which other endpoints must run first)
- `rollback` field on data specs (migration rollback strategy)
- `variants` field on ui specs (multiple visual states with acceptance criteria)
- `severity` field on rules specs (error vs warning vs info for each rule)

Schema additions are backwards-compatible. v1.1.0 files remain valid under v1.2.0.

**Spec Linter CLI**

A standalone command-line tool for validating MAP Spec files outside the platform:
```bash
mapspec lint ./specs/
mapspec lint api/API-001-*.yaml
```

Useful for CI/CD pipelines — fail the build if any spec is invalid.

**Multi-Language Support**

Phase 2 spec writers currently assume TypeScript + Node.js + React. Planned support:
- Python (FastAPI + SQLAlchemy + React)
- Go (Gin + GORM + React)
- Java (Spring Boot + Hibernate + React)

The spec format is language-agnostic. The spec writers need language-specific prompt variants.

---

## Planned — Phase 3

**Code Generation**

Phase 3 is the next major milestone. It takes Phase 2 specs as contracts and generates production code:

- **Backend routes** from api specs (TypeScript + Express, or target language)
- **Database migrations** from data specs (PostgreSQL via Supabase)
- **React components** from ui specs (Next.js 14 App Router)
- **Business rule enforcement** from rules specs (middleware or service layer)
- **Test scaffolding** from quality specs (Vitest unit + integration tests)

Code generation preserves the atomic principle: one spec → one generated file. Changes to a spec regenerate only the affected file.

**Diff-Safe Regeneration**

When a spec changes, Phase 3 regenerates the affected file and produces a diff. The developer reviews the diff before applying it. This prevents accidental overwrites of manual code changes.

**Spec-Code Sync Check**

A tool that reads the current codebase and the current specs and flags where they have diverged — routes that exist in code but not in specs, tables that exist in migrations but not in data specs, components with props not in their ui spec.

---

## Longer Term

**Team Workspaces**
- Multiple developers working on the same project
- Spec ownership and review assignments
- Audit log of who changed which spec and when

**Spec Templates**
- Pre-built spec sets for common patterns (SaaS auth, payment flows, admin panels)
- Import a template and customise rather than generating from zero

**GitHub Integration**
- Sync specs to a GitHub repository automatically
- Open PRs for spec changes
- Link spec versions to commit hashes

**MAP Spec Registry**
- Public registry of reusable spec units
- Import `@mapspec/stripe-billing` to get a pre-validated payment layer
- Versioned spec packages

---

## Feedback and Requests

The roadmap is driven by what teams actually need. If a feature is blocking your adoption of MAP Spec, open an issue at [mapspec.io](https://mapspec.io) or join the waitlist to access early builds of upcoming features.
