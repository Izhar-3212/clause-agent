# MAP Spec v0.1.0 — The Full Standard

> This document is the authoritative definition of MAP Spec v0.1.0.
> All implementations must conform to this specification.

---

## Table of Contents

1. [Overview](#overview)
2. [Conventions](#conventions)
3. [File Structure](#file-structure)
4. [spec.manifest.json](#specmanifestjson)
5. [Layer 1 — meta.spec.yaml](#layer-1--metaspecyaml)
6. [Layer 2 — functional.spec.yaml](#layer-2--functionalspecyaml)
7. [Layer 3 — api.spec.yaml](#layer-3--apispecyaml)
8. [Layer 4 — data.spec.yaml](#layer-4--dataspecyaml)
9. [Layer 5 — ui.spec.yaml](#layer-5--uispecyaml)
10. [Layer 6 — rules.spec.yaml](#layer-6--rulesspecyaml)
11. [Layer 7 — quality.spec.yaml](#layer-7--qualityspecyaml)
12. [AI Consumption Rules](#ai-consumption-rules)
13. [Validation Rules](#validation-rules)
14. [Changelog](#changelog)

---

## Overview

MAP Spec is a 7-layer specification standard designed for AI-driven software development. Each layer addresses a distinct dimension of a software project. Together they form a complete, unambiguous contract that AI systems can consume to generate accurate, predictable output.

### Core Guarantee

A MAP Spec compliant project provides sufficient information for an AI system to generate production-ready software **without making a single assumption**.

---

## Conventions

- All spec files use **YAML** format except the manifest which uses **JSON**
- Every spec file must include `map-spec: "1.0.0"` as the first field
- IDs are uppercase with hyphens: `FEAT-001`, `API-001`, `RULE-001`
- Severity levels: `critical` | `high` | `medium` | `low`
- Status values: `draft` | `review` | `approved` | `deprecated`
- All timestamps are ISO 8601 format

---

## File Structure

```
project-root/
└── specs/
    ├── spec.manifest.json      ← required
    ├── meta.spec.yaml          ← required
    ├── functional.spec.yaml    ← required
    ├── api.spec.yaml           ← required if project has an API
    ├── data.spec.yaml          ← required if project has a database
    ├── ui.spec.yaml            ← required if project has a UI
    ├── rules.spec.yaml         ← required
    └── quality.spec.yaml       ← required
```

---

## spec.manifest.json

The master index file. Required. Must be valid JSON.

```json
{
  "mapSpec": "1.0.0",
  "projectId": "string — unique project identifier",
  "projectName": "string — human readable name",
  "specVersion": "string — semver e.g. 1.0.0",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp",
  "status": "draft | review | approved",
  "approvedBy": "string | null — approver name or ID",
  "approvedAt": "ISO8601 timestamp | null",
  "phase3Unlocked": "boolean",
  "layers": {
    "meta":       { "file": "meta.spec.yaml",       "status": "draft | complete" },
    "functional": { "file": "functional.spec.yaml", "status": "draft | complete" },
    "api":        { "file": "api.spec.yaml",        "status": "draft | complete | not-applicable" },
    "data":       { "file": "data.spec.yaml",       "status": "draft | complete | not-applicable" },
    "ui":         { "file": "ui.spec.yaml",         "status": "draft | complete | not-applicable" },
    "rules":      { "file": "rules.spec.yaml",      "status": "draft | complete" },
    "quality":    { "file": "quality.spec.yaml",    "status": "draft | complete" }
  }
}
```

---

## Layer 1 — meta.spec.yaml

Defines project identity and technology stack. All other layers reference this.

### Schema

```yaml
map-spec: "1.0.0"           # required — must be first field
layer: "meta"               # required — identifies the layer

project:
  id: string                # required — unique identifier
  name: string              # required — human readable
  version: string           # required — semver
  description: string       # required — one paragraph max
  type: string              # required — web-app | mobile-app | api | cli | library | other
  status: string            # required — draft | active | maintenance | deprecated

stack:
  frontend: string | null   # e.g. "Next.js 14" | null if no frontend
  backend: string | null    # e.g. "Node.js + Express" | null if no backend
  database: string | null   # e.g. "PostgreSQL 15" | null if no database
  auth: string | null       # e.g. "JWT + refresh tokens" | null
  hosting: string | null    # e.g. "Vercel" | null
  styling: string | null    # e.g. "Tailwind CSS" | null
  testing: string | null    # e.g. "Vitest + Playwright" | null
  additional: []            # list of any other tech used

constraints:
  - id: string              # e.g. "CON-001"
    type: string            # performance | security | compliance | budget | timeline
    description: string     # what the constraint is
    value: string           # measurable value e.g. "p95 < 200ms"
```

### Example

```yaml
map-spec: "1.0.0"
layer: "meta"

project:
  id: "proj-001"
  name: "Offline-First Todo App"
  version: "1.0.0"
  description: "A todo application that works offline and syncs when connectivity is restored."
  type: "web-app"
  status: "draft"

stack:
  frontend: "Next.js 14 (App Router)"
  backend: "Node.js + Express"
  database: "PostgreSQL 15"
  auth: "JWT + refresh tokens"
  hosting: "Vercel"
  styling: "Tailwind CSS"
  testing: "Vitest + Playwright"
  additional:
    - "Redis (job queue)"
    - "Resend (email)"

constraints:
  - id: "CON-001"
    type: "performance"
    description: "API response time"
    value: "p95 under 200ms"
  - id: "CON-002"
    type: "compliance"
    description: "Data residency"
    value: "All user data stored in EU region"
```

---

## Layer 2 — functional.spec.yaml

Defines what the software does. Written for both human stakeholder approval and AI consumption.

### Schema

```yaml
map-spec: "1.0.0"
layer: "functional"

features:
  - id: string              # e.g. "FEAT-001" — required
    name: string            # required
    priority: string        # must-have | should-have | nice-to-have
    status: string          # draft | approved | deprecated
    description: string     # required
    userStories:
      - id: string          # e.g. "US-001" — required
        as: string          # user role — required
        iWant: string       # the action — required
        soThat: string      # the benefit — required
        acceptanceCriteria:
          - id: string      # e.g. "AC-001-1" — required
            given: string   # precondition — required
            when: string    # action — required
            then: string    # expected outcome — required
            aiNote: string  # optional — extra instruction for AI
```

### Example

```yaml
map-spec: "1.0.0"
layer: "functional"

features:
  - id: "FEAT-001"
    name: "User Authentication"
    priority: "must-have"
    status: "approved"
    description: "Users can create accounts and authenticate securely."
    userStories:
      - id: "US-001"
        as: "new user"
        iWant: "to register with my email and password"
        soThat: "I can access my personal todo lists"
        acceptanceCriteria:
          - id: "AC-001-1"
            given: "I am on the register page"
            when: "I submit a valid email and password"
            then: "I am redirected to /dashboard"
          - id: "AC-001-2"
            given: "I submit an already registered email"
            when: "the form is submitted"
            then: "I see error code EMAIL_ALREADY_EXISTS"
            aiNote: "Show inline error below email field, not as a toast"
          - id: "AC-001-3"
            given: "registration succeeds"
            when: "within 60 seconds"
            then: "a welcome email is delivered to the registered address"

  - id: "FEAT-002"
    name: "Offline Todo Management"
    priority: "must-have"
    status: "approved"
    description: "Users can create, edit, and delete todos while offline."
    userStories:
      - id: "US-002"
        as: "logged in user"
        iWant: "to create todos while offline"
        soThat: "I can capture tasks without internet access"
        acceptanceCriteria:
          - id: "AC-002-1"
            given: "I am offline"
            when: "I create a todo"
            then: "it appears in my list immediately with a pending sync indicator"
          - id: "AC-002-2"
            given: "I have pending offline todos"
            when: "my connection is restored"
            then: "all pending todos sync automatically within 5 seconds"
            aiNote: "Use service worker background sync API for this"
```

---

## Layer 3 — api.spec.yaml

Defines all API endpoints with exact request/response contracts. AI must not create endpoints not defined here.

### Schema

```yaml
map-spec: "1.0.0"
layer: "api"

global:
  baseUrl: string           # e.g. "/api/v1"
  defaultAuth: string       # e.g. "Bearer JWT"
  defaultContentType: string # e.g. "application/json"
  rateLimiting:
    default: string         # e.g. "100 requests per minute per IP"

endpoints:
  - id: string              # e.g. "API-001" — required
    method: string          # GET | POST | PUT | PATCH | DELETE — required
    path: string            # required e.g. "/auth/register"
    description: string     # required
    auth: boolean           # required — true = needs auth token
    tags: []                # grouping tags e.g. ["auth", "users"]
    request:
      params: {}            # URL path params
      query: {}             # query string params
      body:
        type: string
        required: []
        properties: {}
    responses: {}           # keyed by HTTP status code
    sideEffects: []         # DB operations, emails, jobs triggered
    aiNotes: []             # specific instructions for AI implementation
```

### Example

```yaml
map-spec: "1.0.0"
layer: "api"

global:
  baseUrl: "/api/v1"
  defaultAuth: "Bearer JWT"
  defaultContentType: "application/json"
  rateLimiting:
    default: "100 requests per minute per IP"
    auth: "10 requests per minute per IP"

endpoints:
  - id: "API-001"
    method: "POST"
    path: "/auth/register"
    description: "Register a new user account"
    auth: false
    tags: ["auth"]
    request:
      body:
        type: "object"
        required: ["email", "password", "name"]
        properties:
          email:
            type: "string"
            format: "email"
            maxLength: 255
          password:
            type: "string"
            minLength: 8
            pattern: "min 1 uppercase, min 1 number"
          name:
            type: "string"
            minLength: 1
            maxLength: 100
    responses:
      201:
        description: "User registered successfully"
        body:
          userId: "uuid"
          email: "string"
          name: "string"
          token: "JWT string"
      400:
        description: "Validation failed"
        body:
          error: "EMAIL_ALREADY_EXISTS | INVALID_PASSWORD | MISSING_FIELD"
          message: "string"
          field: "string | null"
    sideEffects:
      - "INSERT into users table"
      - "Queue welcome email via job queue"
    aiNotes:
      - "Hash password with bcrypt rounds=12 before INSERT"
      - "Generate JWT with 7 day expiry"
      - "Never return password hash in response"
```

---

## Layer 4 — data.spec.yaml

Defines the complete database schema. AI must not create tables or columns not defined here.

### Schema

```yaml
map-spec: "1.0.0"
layer: "data"

engine: string              # PostgreSQL | MySQL | MongoDB | SQLite | etc
migrations: boolean         # true = use migration files

tables:
  - name: string            # required
    description: string     # required
    columns:
      - name: string        # required
        type: string        # required — DB native type
        primary: boolean
        unique: boolean
        nullable: boolean
        default: string | null
        foreignKey: string | null  # "table.column"
        note: string        # important implementation note
    indexes:
      - columns: []         # list of column names
        unique: boolean
    relations:
      - type: string        # one-to-one | one-to-many | many-to-many
        target: string      # target table name
        foreignKey: string  # column name
```

### Example

```yaml
map-spec: "1.0.0"
layer: "data"

engine: "PostgreSQL 15"
migrations: true

tables:
  - name: "users"
    description: "Registered user accounts"
    columns:
      - name: "id"
        type: "UUID"
        primary: true
        nullable: false
        default: "gen_random_uuid()"
      - name: "email"
        type: "VARCHAR(255)"
        unique: true
        nullable: false
      - name: "password"
        type: "VARCHAR(255)"
        nullable: false
        note: "Always bcrypt hashed. Never store plain text."
      - name: "name"
        type: "VARCHAR(100)"
        nullable: false
      - name: "email_verified"
        type: "BOOLEAN"
        default: "false"
        nullable: false
      - name: "login_attempts"
        type: "INTEGER"
        default: "0"
        nullable: false
      - name: "locked_until"
        type: "TIMESTAMP"
        nullable: true
      - name: "deleted_at"
        type: "TIMESTAMP"
        nullable: true
        note: "Soft delete only. Never hard delete user records."
      - name: "created_at"
        type: "TIMESTAMP"
        nullable: false
        default: "NOW()"
      - name: "updated_at"
        type: "TIMESTAMP"
        nullable: false
        default: "NOW()"
    indexes:
      - columns: ["email"]
        unique: true
      - columns: ["deleted_at"]
        unique: false
    relations:
      - type: "one-to-many"
        target: "todos"
        foreignKey: "user_id"
```

---

## Layer 5 — ui.spec.yaml

Defines every UI component, its props, states, and behaviour. AI must not invent components or interactions.

### Schema

```yaml
map-spec: "1.0.0"
layer: "ui"

designSystem:
  colorTokens: {}           # semantic color names and values
  typographyScale: {}       # heading and body font specs
  spacingUnit: string       # e.g. "8px base unit"
  borderRadius: string      # e.g. "8px"
  brandFile: string         # reference to brand doc if exists

routes:
  - path: string            # URL path
    component: string       # root component name
    auth: boolean           # requires authentication
    title: string           # page title

components:
  - id: string              # e.g. "COMP-001"
    name: string            # PascalCase component name
    type: string            # page | layout | feature | ui
    description: string
    props: {}               # prop name → type + required + default
    state: {}               # state variable → type + initial value
    renders: []             # child components or elements
    interactions: []        # user actions and their outcomes
    aiNotes: []             # specific AI implementation instructions
```

### Example

```yaml
map-spec: "1.0.0"
layer: "ui"

designSystem:
  colorTokens:
    primary: "#F5A623"
    background: "#0D0F14"
    surface: "#161920"
    textPrimary: "#FFFFFF"
    textSecondary: "#9CA3AF"
    error: "#EF4444"
    success: "#22C55E"
  spacingUnit: "8px"
  borderRadius: "8px"

routes:
  - path: "/register"
    component: "RegisterPage"
    auth: false
    title: "Create Account"
  - path: "/dashboard"
    component: "DashboardPage"
    auth: true
    title: "My Tasks"

components:
  - id: "COMP-001"
    name: "RegisterForm"
    type: "feature"
    description: "Email and password registration form"
    props: {}
    state:
      email:
        type: "string"
        initial: '""'
      password:
        type: "string"
        initial: '""'
      name:
        type: "string"
        initial: '""'
      isLoading:
        type: "boolean"
        initial: "false"
      error:
        type: "string | null"
        initial: "null"
    renders:
      - "Input[type=text] bound to name state"
      - "Input[type=email] bound to email state"
      - "Input[type=password] bound to password state"
      - "Button 'Create Account' — disabled when isLoading=true"
      - "ErrorMessage component — visible when error is not null"
    interactions:
      - trigger: "Button click"
        action: "Call POST /api/v1/auth/register"
        onSuccess: "Redirect to /dashboard"
        onError: "Set error state to response.message"
    aiNotes:
      - "Show inline field-level errors not toast notifications"
      - "Password field must have show/hide toggle"
      - "Disable submit button while isLoading is true"
```

---

## Layer 6 — rules.spec.yaml

Defines business logic guardrails. These are hard constraints the AI must never violate.

### Schema

```yaml
map-spec: "1.0.0"
layer: "rules"

rules:
  - id: string              # e.g. "RULE-001" — required
    domain: string          # required — auth | data | billing | ui | api | security
    name: string            # required — short name
    rule: string            # required — what the rule is
    implementation: string  # required — exactly how to implement it
    severity: string        # required — critical | high | medium | low
    rationale: string       # why this rule exists
    aiInstruction: string   # direct instruction to AI — must be followed exactly
    references: []          # FEAT-001, AC-001-1 etc this rule relates to
```

### Example

```yaml
map-spec: "1.0.0"
layer: "rules"

rules:
  - id: "RULE-001"
    domain: "security"
    name: "Password hashing"
    rule: "All passwords must be hashed before storage"
    implementation: "bcrypt with cost factor 12"
    severity: "critical"
    rationale: "Plain text passwords are a critical security vulnerability"
    aiInstruction: "Import bcrypt. Call bcrypt.hash(password, 12) before any INSERT to users table. Never log or return password values."
    references: ["US-001", "API-001"]

  - id: "RULE-002"
    domain: "data"
    name: "Soft delete only"
    rule: "User records must never be hard deleted"
    implementation: "Set deleted_at = NOW() instead of DELETE"
    severity: "critical"
    rationale: "Data recovery, audit trail, and compliance requirements"
    aiInstruction: "Never generate DELETE FROM users. Always use UPDATE users SET deleted_at = NOW() WHERE id = $1"
    references: ["FEAT-001"]

  - id: "RULE-003"
    domain: "auth"
    name: "Account lockout"
    rule: "Lock account after 5 consecutive failed login attempts"
    implementation: "Set locked_until = NOW() + interval 15 minutes"
    severity: "high"
    rationale: "Prevent brute force attacks"
    aiInstruction: "Increment login_attempts on each failed login. Check if login_attempts >= 5 and set locked_until. Check locked_until > NOW() before allowing login attempt."
    references: ["US-001", "API-002"]

  - id: "RULE-004"
    domain: "offline"
    name: "Offline sync priority"
    rule: "Client changes take priority over server state during sync"
    implementation: "Use client-side timestamp for conflict resolution"
    severity: "high"
    rationale: "Users expect their offline actions to be preserved"
    aiInstruction: "Compare client updated_at with server updated_at. If client timestamp is newer, client version wins. Log conflicts to sync_log table."
    references: ["FEAT-002", "AC-002-2"]
```

---

## Layer 7 — quality.spec.yaml

Defines test cases and quality benchmarks. AI generates tests from this layer.

### Schema

```yaml
map-spec: "1.0.0"
layer: "quality"

coverage:
  minimum: number           # minimum test coverage % required
  critical: []              # paths that must have 100% coverage

performance:
  - id: string              # e.g. "PERF-001"
    metric: string          # what is being measured
    target: string          # measurable target value
    tool: string            # how to measure it

testSuites:
  - id: string              # e.g. "SUITE-001"
    name: string            # suite name
    type: string            # unit | integration | e2e | performance
    cases:
      - id: string          # e.g. "TEST-001"
        description: string # what is being tested
        references: []      # AC IDs this test covers
        given: string       # precondition
        when: string        # action
        then: string        # expected outcome
        priority: string    # critical | high | medium | low
```

### Example

```yaml
map-spec: "1.0.0"
layer: "quality"

coverage:
  minimum: 80
  critical:
    - "src/lib/auth"
    - "src/api/routes/auth"
    - "src/lib/sync"

performance:
  - id: "PERF-001"
    metric: "API p95 response time"
    target: "under 200ms"
    tool: "k6 load test"
  - id: "PERF-002"
    metric: "Offline sync time"
    target: "under 5 seconds on reconnect"
    tool: "Playwright + network throttling"

testSuites:
  - id: "SUITE-001"
    name: "Authentication"
    type: "integration"
    cases:
      - id: "TEST-001"
        description: "Successful user registration"
        references: ["AC-001-1"]
        given: "valid email, password, and name are provided"
        when: "POST /api/v1/auth/register is called"
        then: "response is 201 with userId, email, name, and token"
        priority: "critical"
      - id: "TEST-002"
        description: "Duplicate email registration rejected"
        references: ["AC-001-2"]
        given: "email already exists in users table"
        when: "POST /api/v1/auth/register is called with same email"
        then: "response is 400 with error EMAIL_ALREADY_EXISTS"
        priority: "critical"
      - id: "TEST-003"
        description: "Account lockout after 5 failed logins"
        references: ["RULE-003"]
        given: "valid user account exists"
        when: "POST /api/v1/auth/login is called 5 times with wrong password"
        then: "6th attempt returns 423 with error ACCOUNT_LOCKED"
        priority: "critical"

  - id: "SUITE-002"
    name: "Offline Sync"
    type: "e2e"
    cases:
      - id: "TEST-004"
        description: "Todo created offline syncs on reconnect"
        references: ["AC-002-2"]
        given: "user is logged in and network is disconnected"
        when: "user creates a todo and network is restored"
        then: "todo appears in database within 5 seconds"
        priority: "critical"
```

---

## AI Consumption Rules

When an AI system consumes a MAP Spec project it must follow these rules without exception:

1. **Never create what is not specified** — if a table, endpoint, component, or rule is not in the spec, do not create it
2. **Never deviate from field types** — if spec says `UUID` use `UUID`, not `INTEGER` or `VARCHAR`
3. **Always implement business rules** — every `RULE-*` with severity `critical` or `high` must be implemented
4. **Always reference acceptance criteria** — every implemented feature must satisfy its `AC-*` criteria
5. **aiInstruction fields are mandatory** — treat every `aiInstruction` as a hard requirement, not a suggestion
6. **Ask before assuming** — if any required information is missing from the spec, halt and request clarification
7. **Stack compliance** — only use technologies declared in `meta.spec.yaml stack` section

---

## Validation Rules

A MAP Spec project is valid when:

- [ ] `spec.manifest.json` exists and is valid JSON
- [ ] `meta.spec.yaml` exists with all required fields
- [ ] `functional.spec.yaml` exists with at least one feature
- [ ] All features have at least one user story
- [ ] All user stories have at least one acceptance criterion
- [ ] All endpoint IDs referenced in rules exist in `api.spec.yaml`
- [ ] All table names referenced in rules exist in `data.spec.yaml`
- [ ] All component IDs referenced in routes exist in `ui.spec.yaml`
- [ ] All `critical` rules have an `aiInstruction` field
- [ ] `map-spec` version field is present in every spec file

---

## Changelog

### v0.1.0 (2026-05-09)
- Initial draft of MAP Spec standard
- 7-layer architecture defined
- Full schema for all layers
- AI consumption rules defined
- Validation rules defined

---

*MAP Spec is created and maintained by [MyAgenticPlatform](https://github.com/Izhar3212/MyAgenticPlatform)*
*Standard repository: [github.com/Izhar-3212/map-spec](https://github.com/Izhar-3212/map-spec)*
