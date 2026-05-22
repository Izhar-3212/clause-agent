# Getting Started

There are two ways to start with MAP Spec: generating specs from a new brief, or discovering specs from an existing codebase.

## Option A — New Project From Brief

### 1. Submit a Brief

Write a plain-English description of the system you want to build. Two or three paragraphs is enough. Include:

- What the system does
- Who uses it
- Any hard constraints (technology choices, compliance requirements, scale targets)

Example:
> "A video streaming portal where users can watch live broadcasts and on-demand content. There are two subscription tiers: free (ad-supported, SD quality) and premium (ad-free, up to 1080p). Content must be DRM-protected. We expect up to 10,000 concurrent viewers at launch."

### 2. Answer Clarifying Questions

The platform asks clarifying questions about ambiguities in your brief. These typically cover:
- Integrations (which payment provider? which auth system?)
- Scale (how many users on day one vs year one?)
- Regulatory requirements (GDPR? HIPAA? PCI?)
- Out-of-scope items (what are you explicitly not building?)

Answer what you can. Skip questions where you do not have a decision yet — the platform notes them as deferred.

### 3. Review the Mandate

The mandate is a structured summary of your brief and answers. It defines:
- Goals (what success looks like)
- Constraints (hard limits on the design)
- Success criteria (how you will know you are done)
- Out-of-scope items (explicitly not being built)

Read it carefully before approving. The mandate governs every agent that runs after it.

### 4. Confirm the Agent Selection

The platform selects which of the 35 Phase 1 agents are relevant to your project. Review the selection and add or remove agents as needed. A video portal needs the security, DRM, and performance agents. A simple internal tool does not.

### 5. Run Phase 1

Phase 1 runs the selected agents in SDLC order (requirements → architecture → frontend → quality → operations). Each agent produces a markdown artifact. This takes 5–15 minutes depending on how many agents are selected.

Review the artifacts. You can re-run any agent if the output needs improvement.

### 6. Run Phase 2

Phase 2 reads the Phase 1 artifacts and generates atomic YAML specs. The decomposer produces a plan; the 7 spec writers execute it. This produces 80–130 YAML files for a typical project.

After generation, review:
- The manifest (list of all generated specs)
- Any `.broken.yaml` files (specs that failed validation — need manual correction)
- A sample of specs from each layer to verify accuracy

### 7. Use the Specs

Your MAP Spec files are now the contract for code generation. Feed them to your code generation pipeline, your AI coding sessions, or your development team as structured requirements.

---

## Option B — Existing Codebase

### 1. Point Discover at Your Repo

Provide the path to your existing codebase. Discover reads:
- Your API route file
- Your database migration files
- Your TypeScript types file
- Your React components directory

### 2. Review the Grounding Document

Discover writes `CODEBASE-IDENTITY.md` first. Read it before specs are generated — it lists every route, table, interface, and component that was found. Correct any misidentified paths before proceeding.

### 3. Generate Specs

Discover generates one spec per identified entity. Review the `.broken.yaml` files after generation and fix them by hand or by re-running the relevant spec writer with more context.

### 4. Fill In the Gaps

Discover infers what it can from code structure. It cannot infer:
- The business reason behind a rule
- The correct acceptance criteria for a feature
- The intended performance target

Go through the generated specs and fill in these fields before using them for code generation.

---

## YAML Validation

Every spec file must be valid YAML and must pass the MAP Spec Zod schema. To validate a spec manually:

```bash
node -e "
const yaml = require('js-yaml');
const fs = require('fs');
yaml.load(fs.readFileSync('my-spec.yaml', 'utf8'));
console.log('Valid YAML');
"
```

The platform runs `autoCorrectSpec()` on every file before saving, which fixes common LLM output errors automatically. If a file still fails validation after auto-correction, it is saved as `.broken.yaml` and logged.

---

## File Organisation

Specs are stored in:
```
outputs/{projectId}/phase2/
├── manifest.json
├── meta/
├── functional/
├── api/
├── data/
├── ui/
├── rules/
└── quality/
```

Version-control the entire `outputs/` directory alongside your source code. Spec changes should be reviewed in pull requests the same way code changes are.
