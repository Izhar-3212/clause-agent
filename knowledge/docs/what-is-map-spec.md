# What Is MAP Spec?

MAP Spec (Multi-Agent Platform Specification) is an open YAML standard for defining software systems in a way that is precise enough for AI agents to generate consistent, production-quality code — and human enough for product teams to read, review, and version-control.

## The Core Idea

A MAP Spec project is a collection of atomic YAML files. Each file describes exactly one thing: one API endpoint, one database table, one UI component, one business rule. That atomic structure is intentional.

When an AI agent reads a spec for `/videos/:videoId/stream`, it reads only that file. It knows the method, the parameters, the response shapes, the error codes, the auth requirements, and the rate limits. It does not have to infer them from a 50,000-token codebase. It cannot hallucinate them — the spec is the contract.

## Version

The current stable version is **MAP Spec 1.1.0**.

## Seven Layers

Every MAP Spec project is organised into seven layers, each covering a distinct concern:

| Layer | Describes |
|-------|-----------|
| `meta` | Project identity, constraints, glossary, stakeholders |
| `functional` | User stories and acceptance criteria |
| `api` | HTTP endpoints — method, path, parameters, responses |
| `data` | Database tables, columns, indexes, RLS policies |
| `ui` | React/Vue components, props, states, accessibility |
| `rules` | Business rules and enforcement logic |
| `quality` | Performance targets, testing requirements, SLAs |

## Atomic Principle

One spec file = one concern. An API spec for `GET /videos/:videoId/stream` does not contain the schema for the `videos` table. That lives in a separate data spec. A functional spec for "User Authentication" does not contain the API contract — that lives in the api layer.

This atomicity makes specs:

- **Diff-able** — a changed acceptance criterion shows up as a clear line diff
- **Mergeable** — parallel teams edit different files, no conflicts
- **Targetable** — an AI agent receives exactly the context it needs, nothing more
- **Testable** — each spec can be validated independently against the Zod schema

## What MAP Spec Is Not

MAP Spec is not a code generator on its own. It is the specification contract that sits between a product team's intent and a code generation pipeline. The platform that interprets these specs and generates code is [MyAgenticPlatform](https://myagenticplatform.com) — but the spec format itself is open, and any tool can read and write it.

## The Open Standard

The full schema definition, validation rules, and tooling are open source at [mapspec.io](https://mapspec.io). Teams can use MAP Spec with their own AI pipelines, their own code generators, or simply as a structured documentation format.
