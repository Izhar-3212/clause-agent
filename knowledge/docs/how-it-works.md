# How It Works

MyAgenticPlatform takes a plain-English brief and produces a complete set of atomic MAP Spec YAML files through a four-phase pipeline. Each phase builds on the previous one, moving from intent to structured contracts.

## Overview

```
Plain-English Brief
       │
       ▼
  Phase 0 — Clarification + Mandate + Agent Selection
       │
       ▼
  Phase 1 — 35 AI Agents → 35 Markdown Artifacts
       │
       ▼
  Phase 2 — Decomposer + 7 Spec Writers → Atomic YAML
       │
       ▼
  Phase 3 — Code Generation (roadmap)
```

## Phase 0 — Clarification and Mandate

The user submits a brief: a paragraph or a few sentences describing the system they want to build.

Three agents run in sequence:

1. **Clarifier** — Identifies ambiguities in the brief and generates clarifying questions. The user answers them (or skips them).
2. **Mandate writer** — Synthesises the brief and answers into a structured mandate: goals, constraints, success criteria, and out-of-scope items.
3. **Agent selector** — Reviews the mandate and selects which of the 35 Phase 1 agents are relevant. A simple blog needs fewer agents than an enterprise platform.

The mandate is the contract for Phase 1. Agents cannot go beyond what the mandate defines.

## Phase 1 — 35 AI Agents

Phase 1 runs up to 35 specialised agents, each producing a markdown artifact that analyses the system from one perspective:

| Category | Example Agents |
|----------|---------------|
| Business Analysis | Requirements analyst, stakeholder mapper, risk assessor |
| Architecture | System architect, API designer, database architect |
| Frontend | UX researcher, UI designer, component architect |
| Security | Security analyst, auth designer, compliance checker |
| Quality | QA strategist, performance analyst, test planner |
| Operations | DevOps planner, monitoring designer, deployment strategist |
| Legal | Legal reviewer, data privacy analyst |

Each agent runs independently against the mandate. The outputs are markdown documents — readable by humans, used as source material for Phase 2.

**Model routing:** Complex analysis agents run on Claude Sonnet. Structured output agents run on Claude Haiku. Phase 0 always uses Haiku.

## Phase 2 — Atomic YAML Generation

Phase 2 is where the markdown artifacts become structured MAP Spec YAML.

Two agents run in sequence:

1. **Decomposer** — Reads all Phase 1 artifacts and produces a decomposition: a list of every unit that needs a spec (every endpoint, table, component, rule, etc.) organised by layer.

2. **7 Spec Writers** — One writer per MAP Spec layer (meta, functional, api, data, ui, rules, quality). Each writer takes the decomposition and the relevant Phase 1 artifacts and generates one YAML file per unit.

### Generation Pipeline (per spec file)

```
Spec writer generates YAML
         │
         ▼
autoCorrectSpec() — 10+ correction patterns
(code fence removal, tab normalisation,
 duplicate key removal, missing fields added)
         │
         ▼
validateSpecContent() — Zod schema validation
         │
    ┌────┴────┐
  VALID     INVALID
    │           │
  Save .yaml   Save .broken.yaml
               (logged for review)
```

Specs are generated in batches of 5 concurrently. After all specs are generated, `reconcileSpecs()` checks for cross-spec consistency and fills gaps.

## After Phase 2

The output is a directory of atomic YAML files — one per concern — plus a manifest listing every generated spec. This is the MAP Spec contract for the project.

These specs can be:
- Fed directly into a code generation pipeline (Phase 3, on the roadmap)
- Used as grounded context for any AI coding session
- Version-controlled alongside the codebase
- Reviewed and edited by the team before code generation begins

## MAP Spec Discover

For existing codebases, MAP Spec Discover is an alternative entry point. Instead of starting from a brief, it reads the existing code — routes, migrations, TypeScript interfaces, React components — and reverse-engineers a spec set that reflects the current system.

Discover writes a `CODEBASE-IDENTITY.md` grounding document first, then generates specs layer by layer. This prevents AI hallucination by anchoring every spec to something that actually exists in the codebase.
