# Glossary

## A

**Acceptance Criteria**
Testable conditions that define when a functional unit is complete. Written in Given/When/Then format in the functional layer. Required field — specs without acceptance criteria are auto-corrected with a placeholder.

**aiInstruction**
A required field on rules specs. Directs the code generation agent on how and where to enforce the business rules defined in the spec. Without this field, agents may enforce rules inconsistently or in the wrong layer.

**Atomic Spec**
A MAP Spec file that describes exactly one concern — one endpoint, one table, one component, or one rule domain. Atomicity prevents specs from becoming monolithic and keeps AI context windows focused.

**Auto-Correction**
The `autoCorrectSpec()` pipeline that runs before every spec is saved. Applies 10+ correction patterns to fix common LLM output errors: code fence removal, tab normalisation, duplicate key removal, missing required fields, and more.

## B

**Broken Spec**
A spec file saved as `.broken.yaml` because it failed validation after auto-correction. Broken specs appear in the manifest with a `broken` status and must be manually corrected or re-generated.

## C

**CODEBASE-IDENTITY.md**
The grounding document written by MAP Spec Discover before any specs are generated. Lists every route, table, TypeScript interface, and React component found in the existing codebase. Prevents AI hallucination by anchoring spec content to real entities.

**Compliance Report**
A JSON report (`TwelveFactorReport-{timestamp}.json`) produced after Phase 2 that shows pass/fail status for all 100 twelve-factor compliance checks. Displayed as badges in the dashboard.

## D

**Decomposer**
The first agent in Phase 2. Reads all Phase 1 markdown artifacts and produces a decomposition — a structured plan of every unit that needs a spec, organised by layer. The 7 spec writers use this plan as their work queue.

**Discover**
MAP Spec Discover. The reverse-engineering mode that reads an existing codebase and generates MAP Spec YAML files reflecting the current system. Writes a CODEBASE-IDENTITY.md grounding document first.

## G

**Grounding Document**
See CODEBASE-IDENTITY.md. Any document provided to an AI agent to prevent hallucination by anchoring its output to known, verified facts.

## L

**Layer**
One of the seven organisational categories in MAP Spec: meta, functional, api, data, ui, rules, quality. Every spec file belongs to exactly one layer, declared as `layer: <name>` at the top of the file.

## M

**Mandate**
The structured output of Phase 0. Synthesises the user's brief and answers to clarifying questions into goals, constraints, success criteria, and out-of-scope items. Governs all Phase 1 agents.

**MAP Spec**
Multi-Agent Platform Specification. The open YAML standard for describing software systems in a way that is both human-readable and machine-parseable. Current version: 1.1.0.

**Manifest**
A `manifest.json` file in the Phase 2 output directory that lists every generated spec — its ID, layer, file path, and status (valid or broken).

## P

**Phase 0**
The clarification phase. Runs the clarifier, mandate writer, and agent selector. Produces a mandate and an approved agent list.

**Phase 1**
The artifact generation phase. Runs up to 35 specialised AI agents, each producing a markdown document analysing the system from one perspective.

**Phase 2**
The spec generation phase. Runs the decomposer and 7 spec writers to produce atomic YAML files from the Phase 1 artifacts.

**Phase 3**
The code generation phase. Not yet built. Will use Phase 2 specs as contracts for generating production code.

**Policy Rules**
43 compliance checks that enforce architectural decisions requiring explicit declaration in specs (auth fields, soft delete fields, monitoring requirements). Complement the 57 technical pattern-matching rules.

## R

**reconcileSpecs()**
A post-generation function that runs after all Phase 2 specs are created. Checks for cross-spec consistency — for example, that every API spec that references a table has a corresponding data spec.

**Soft Delete**
The practice of marking records as deleted via a `deleted_at` timestamp rather than removing them from the database. Required in all MAP Spec data layers — hard deletes are prohibited.

## S

**Spec Writer**
One of the 7 Phase 2 agents, each responsible for one MAP Spec layer. Takes the decomposer's plan and relevant Phase 1 artifacts and generates atomic YAML files for its layer.

## T

**Technical Rules**
57 compliance checks that use pattern matching against spec content to detect twelve-factor violations. Run automatically based on what is present or absent in the YAML.

**Twelve-Factor App**
A methodology for building software-as-a-service applications, published at 12factor.net. MAP Spec's compliance framework extends the twelve factors with AI-specific policy rules.

## U

**Unit**
A single concern described by one atomic spec file. Identified by a unit ID (e.g., `FUNC-001`, `API-001`, `DATA-001`). The unit ID is unique within a project and used for cross-spec references.

## V

**validateSpecContent()**
The Zod schema validation function that runs after `autoCorrectSpec()`. Checks that a spec conforms to the layer schema — correct field names, required fields present, valid enum values.
