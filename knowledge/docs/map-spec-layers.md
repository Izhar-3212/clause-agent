# MAP Spec Layers

Every MAP Spec project is organised into seven layers. Each layer covers a distinct concern. Atomic spec files belong to exactly one layer.

The layer is declared at the top of every spec file:

```yaml
map-spec: "1.1.0"
layer: api
```

## Layer 1 — meta

The meta layer describes the project itself. There is typically one meta spec per project.

**What it contains:**
- Project identity (id, name, description, version, domain)
- Stakeholders and their roles
- Constraints that apply to the entire project
- Integration dependencies (external services)
- Glossary of domain terms

**When to write it:** First. Every other layer references the project context defined here.

See: [example-meta-spec.yaml](../examples/example-meta-spec.yaml)

---

## Layer 2 — functional

The functional layer describes what the system does from the user's perspective. One spec per feature or user journey.

**What it contains:**
- User story ("As a viewer, I want to...")
- Acceptance criteria (Given/When/Then format)
- Priority and phase assignment
- Dependencies on other functional units

**When to write it:** After meta. Before api or data — functional specs define the intent that the technical layers implement.

See: [example-functional-spec.yaml](../examples/example-functional-spec.yaml)

---

## Layer 3 — api

The api layer describes HTTP endpoints. One spec per endpoint.

**What it contains:**
- HTTP method and path
- Authentication requirement
- Parameters (path, query, body) with types and constraints
- Response schemas for every status code (200, 400, 401, 403, 404, 500)
- Rate limits and caching behaviour

**Required field:** `responses` must be present. A spec without responses is invalid.

See: [example-api-spec.yaml](../examples/example-api-spec.yaml)

---

## Layer 4 — data

The data layer describes database tables and their schemas. One spec per table.

**What it contains:**
- Table name
- All columns with types, constraints, defaults, and foreign keys
- Indexes
- Row-level security flag
- Soft delete column (always `deleted_at`)

**Required field:** Every table must have a primary key column with `primaryKey: true`. Data specs without a primary key on the `id` column are auto-corrected.

See: [example-data-spec.yaml](../examples/example-data-spec.yaml)

---

## Layer 5 — ui

The ui layer describes frontend components. One spec per component.

**What it contains:**
- Component type (page, layout, component, widget)
- Framework (React, Vue, etc.)
- Props with types, required flag, and descriptions
- States the component can be in
- Child component dependencies
- Accessibility requirements
- Responsive behaviour

See: [example-ui-spec.yaml](../examples/example-ui-spec.yaml)

---

## Layer 6 — rules

The rules layer describes business logic and enforcement rules. One spec per rule domain.

**What it contains:**
- Individual rules with conditions and actions
- Priority order for rule evaluation
- Exceptions and bypasses
- Audit logging requirements

**Required field:** `aiInstruction` — a directive to the code generation agent explaining how and where to enforce these rules. Specs without `aiInstruction` are auto-corrected with a placeholder.

See: [example-rules-spec.yaml](../examples/example-rules-spec.yaml)

---

## Layer 7 — quality

The quality layer describes non-functional requirements. One spec per quality domain (performance, security, accessibility, etc.).

**What it contains:**
- Performance targets with measurement methodology
- Reliability SLAs
- Testing requirements (unit, integration, load, e2e)
- Monitoring and alerting rules

See: [example-quality-spec.yaml](../examples/example-quality-spec.yaml)

---

## Layer Naming

The validator accepts the following layer identifiers:

| Canonical | Also accepted |
|-----------|--------------|
| `functional` | `feature`, `requirement` |
| `api` | `endpoint`, `routes` |
| `data` | `database`, `schema` |
| `ui` | `frontend`, `component` |
| `rules` | `business-rules`, `logic` |
| `quality` | `qa`, `testing` |

Non-canonical names are auto-corrected to the canonical form before validation.

## Cross-Layer References

Specs reference each other by unit ID. An api spec may reference:
- A functional spec (`satisfies: FUNC-001`) to show which user story it implements
- A rules spec (`enforces: RULE-001`) to show which business rules govern access
- A data spec (`reads: DATA-001`) to show which table it queries

These references are not enforced by the validator in v1.1.0 — they are informational for code generation agents.
