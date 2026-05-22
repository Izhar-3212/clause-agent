# Frequently Asked Questions

## General

### What is MAP Spec?

MAP Spec (Multi-Agent Platform Specification) is an open YAML standard for describing software systems. It organises specifications into seven layers — meta, functional, api, data, ui, rules, and quality — with one atomic file per concern. See [What Is MAP Spec?](what-is-map-spec.md) for a full explanation.

### Is MAP Spec free to use?

The MAP Spec standard itself is open and free. The schema, validation tooling, and examples are published at [mapspec.io](https://mapspec.io). MyAgenticPlatform — the SaaS that generates MAP Spec files from a plain-English brief — is a paid product.

### What version of MAP Spec is current?

Version **1.1.0**. All spec files must declare `map-spec: "1.1.0"` at the top.

### Can I write MAP Spec files by hand?

Yes. MAP Spec is a YAML format — you can create and edit files in any text editor. The only requirement is that files pass YAML syntax validation and conform to the layer schema. Use the examples in the `/examples` directory as starting templates.

---

## Technical

### What does "atomic" mean for specs?

Atomic means one spec file = one concern. An API spec for `GET /videos/:videoId/stream` contains only that endpoint. It does not contain the database schema, the component that renders the player, or the business rules governing access. Those each live in their own file in their own layer.

### Why YAML instead of JSON or Markdown?

YAML is readable by both humans and machines. A product manager can read a functional spec in YAML without understanding programming. A Zod validator can parse the same file and reject missing fields. JSON is equally machine-readable but harder to read for humans. Markdown is human-readable but cannot be programmatically validated or queried.

### What happens to specs that fail validation?

Specs that fail validation after auto-correction are saved as `.broken.yaml` alongside the valid specs. They appear in the manifest with a `broken` status. You can edit them manually and re-validate, or re-run the spec writer with additional context.

### Does MAP Spec support custom layers?

No. v1.1.0 supports exactly the seven canonical layers. Custom layer names are normalised to the closest canonical match. If your use case requires a layer that does not fit any of the seven, open a discussion on the MAP Spec GitHub.

### How many specs does a typical project generate?

A typical project generates 80–130 atomic spec files. Projects over 150 specs trigger a warning — this usually means the decomposer was too granular. The warning does not block generation.

---

## MAP Spec Discover

### Can Discover work on any codebase?

Discover is optimised for the MyAgenticPlatform tech stack (Express + TypeScript, Supabase, Next.js). It reads from four specific file locations. Other stacks are partially supported — routes may not be extracted if the routing pattern differs from `server.ts`, and components may not be found outside `dashboard/components/`.

### How accurate is Discover?

Discover achieves 94% accuracy in referencing real code entities (routes, tables, interfaces, components that actually exist) vs hallucinated ones. The CODEBASE-IDENTITY.md grounding document is the main mechanism for this accuracy — agents cannot invent entities that are not listed in it.

### Does Discover modify my codebase?

No. Discover is read-only. It writes output files to `outputs/{projectId}/` only. Your source code is never modified.

---

## Compliance

### What is the twelve-factor compliance check?

A 100-check framework (57 technical + 43 policy) that validates generated specs against production best practices derived from the Twelve-Factor App methodology. See [Twelve-Factor Compliance](twelve-factor-compliance.md) for details.

### Do I have to fix all compliance violations?

No. Violations have severity levels: `error`, `warning`, and `info`. Only `error` violations must be fixed before code generation. `warning` violations are recommended fixes. `info` is informational.

---

## Workflow

### When should I update specs vs update code?

In spec-driven development, specs lead code. When requirements change, update the spec first. When you update code directly (for a quick bug fix), update the relevant spec to match after. Never let specs and code diverge for more than one sprint.

### Can multiple team members work on specs simultaneously?

Yes. Because specs are atomic (one file per concern), two developers editing different specs never produce a merge conflict. Conflicts only arise if two people edit the same spec simultaneously — which is rare and easily resolved since the YAML is diff-friendly.

### Should I commit spec files to git?

Yes. Spec files should be version-controlled alongside source code in the same repository. Changes to specs should be reviewed in pull requests. Spec history tells the story of why architectural decisions were made.
