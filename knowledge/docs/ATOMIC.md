# MAP Spec v1.1.0 — Atomic Specification Standard

> This document defines the Atomic Spec extension to MAP Spec v1.0.0.
> Atomic Specs are the recommended approach for all new projects.

---

## What Changed in v1.1.0

MAP Spec v1.0.0 defined 7 layers, each as a single large YAML file.
While correct and complete, large spec files create a fundamental problem:

**The Drift Problem**

When an AI receives a large specification file containing multiple features,
endpoints, components, or rules simultaneously, it makes cross-concern
decisions — mixing logic from one feature into another, importing patterns
from one endpoint into a different one, or applying one rule inconsistently
across contexts.

The larger the spec file, the more opportunity for drift.

MAP Spec v1.1.0 solves this with **Atomic Specs**.

---

## The Atomic Spec Principle

> One file. One concern. Zero ambiguity.

An Atomic Spec is the smallest meaningful unit of specification. It describes
exactly one thing — one feature flow, one API endpoint, one database table,
one UI component, one business rule, one test suite.

**The Atomic Guarantee:**
An AI consuming a single Atomic Spec file has no context about anything
outside that file. It cannot drift. It cannot cross-contaminate. It can
only implement exactly what is specified.

**The Dumbest Model Standard:**
Every Atomic Spec must be written so that the least capable AI model
can implement it correctly. If a weak model can follow it, any model can.
Clarity is not a courtesy — it is a requirement.

---

## File Structure — v1.0.0 vs v1.1.0

### v1.0.0 (Monolithic)
```
specs/
  spec.manifest.json
  meta.spec.yaml
  functional.spec.yaml      ← entire functional layer in one file
  api.spec.yaml             ← all endpoints in one file
  data.spec.yaml            ← all tables in one file
  ui.spec.yaml              ← all components in one file
  rules.spec.yaml           ← all rules in one file
  quality.spec.yaml         ← all test suites in one file
```

### v1.1.0 (Atomic)
```
specs/
  spec.manifest.json        ← updated with atomic index
  meta.spec.yaml            ← unchanged (meta is always single file)
  
  functional/
    FEAT-001-user-registration.yaml
    FEAT-001-user-login.yaml
    FEAT-001-password-reset.yaml
    FEAT-002-create-todo.yaml
    FEAT-002-edit-todo.yaml
    FEAT-002-delete-todo.yaml
    FEAT-003-offline-create.yaml
    FEAT-003-offline-sync.yaml

  api/
    API-001-POST-auth-register.yaml
    API-002-POST-auth-login.yaml
    API-003-POST-auth-logout.yaml
    API-004-GET-todos.yaml
    API-005-POST-todos.yaml
    API-006-PATCH-todo.yaml
    API-007-DELETE-todo.yaml

  data/
    TABLE-users.yaml
    TABLE-todos.yaml
    TABLE-sync-log.yaml

  ui/
    COMP-001-RegisterForm.yaml
    COMP-002-LoginForm.yaml
    COMP-003-TodoList.yaml
    COMP-004-TodoItem.yaml
    COMP-005-OfflineIndicator.yaml

  rules/
    RULE-001-password-hashing.yaml
    RULE-002-jwt-expiry.yaml
    RULE-003-account-lockout.yaml
    RULE-004-soft-delete-only.yaml
    RULE-005-user-data-isolation.yaml

  quality/
    SUITE-001-auth-integration.yaml
    SUITE-002-todos-unit.yaml
    SUITE-003-offline-e2e.yaml
```

---

## Atomic Unit Definitions

### What Makes a Good Atomic Unit

An atomic unit must satisfy all of these:

1. **Single concern** — describes exactly one thing
2. **Self-contained** — can be understood without reading other spec files
3. **Implementable alone** — an AI can produce a working implementation
   from this file without needing other spec files
4. **Testable independently** — the output can be verified in isolation
5. **Nameable in one phrase** — if you cannot name it in 5 words, split it

### What is NOT Atomic

- "User Authentication" (too broad — split into registration, login, logout, password reset)
- "Todo CRUD" (too broad — split into create, read, update, delete)
- "Dashboard Page" (too broad — split into each component)
- "All API Endpoints" (never atomic)

### Decomposition Rules by Layer

**Functional Layer:**
- One file per discrete user action or flow
- A "flow" ends when the user reaches a stable state
- Registration flow: start → form → submit → success/error → done ✓
- Do NOT combine registration + login into one file ✗

**API Layer:**
- One file per endpoint (method + path combination)
- `POST /auth/register` is atomic ✓
- `GET /todos` and `POST /todos` are two files ✓
- Never combine multiple endpoints in one file ✗

**Data Layer:**
- One file per database table
- Junction tables (many-to-many) get their own file
- Never combine multiple tables in one file ✗

**UI Layer:**
- One file per component
- A page is not atomic — decompose into its components
- `RegisterForm` is atomic ✓
- `AuthPage` containing `RegisterForm` + `LoginForm` is not ✗

**Rules Layer:**
- One file per business rule
- Rules that always travel together may be grouped (e.g. JWT issuance + expiry)
- Security rules are always individual files ✓

**Quality Layer:**
- One file per test suite
- Group tests by domain and type (auth-unit, auth-integration, auth-e2e)
- Never put all tests in one file ✗

---

## Atomic Spec File Schema

Every atomic spec file follows this schema:

```yaml
map-spec: "1.1.0"              # required — must be 1.1.0 for atomic
layer: "functional"            # required — one of the 7 layers
atomic: true                   # required — signals this is an atomic spec

unit:
  id: "FEAT-001-user-registration"    # required — globally unique
  parent: "FEAT-001"                  # required — parent feature/group ID
  name: "User Registration"           # required — human readable
  scope: "single-concern"             # required — always "single-concern"
  priority: "must-have"              # required for functional layer
  status: "draft"                    # required

# Layer-specific content follows below
# (same schema as v1.0.0 but for ONE unit only)
```

### Functional Atomic Spec Example

```yaml
map-spec: "1.1.0"
layer: "functional"
atomic: true

unit:
  id: "FEAT-001-user-registration"
  parent: "FEAT-001"
  name: "User Registration"
  scope: "single-concern"
  priority: "must-have"
  status: "approved"

description: >
  A new user provides their name, email, and password to create an account.
  On success they are authenticated and redirected to the dashboard.
  On failure they see a specific, actionable error message.

userStory:
  as: "new user"
  iWant: "to register with my email and password"
  soThat: "I can access my personal todo lists"

acceptanceCriteria:
  - id: "AC-001-1"
    given: "I am on the /register page"
    when: "I submit a valid name, email, and password"
    then: "I am redirected to /dashboard and my session is active"
    aiNote: "Create JWT on success, store in httpOnly cookie, redirect with 302"

  - id: "AC-001-2"
    given: "I submit an email that already exists"
    when: "the form is submitted"
    then: "I see an inline error below the email field: 'This email is already registered'"
    aiNote: "Return 400 with error code EMAIL_ALREADY_EXISTS. Show error inline, not toast."

  - id: "AC-001-3"
    given: "I submit a password shorter than 8 characters"
    when: "the form is submitted"
    then: "I see inline validation: 'Password must be at least 8 characters'"
    aiNote: "Validate client-side with Zod before API call. Do not submit invalid form."

  - id: "AC-001-4"
    given: "registration succeeds"
    when: "within 60 seconds"
    then: "a welcome email is delivered to the registered address"
    aiNote: "Queue email job after successful INSERT. Do not send inline — use job queue."

dependencies:
  rules: ["RULE-001-password-hashing", "RULE-002-jwt-expiry"]
  api: ["API-001-POST-auth-register"]
  data: ["TABLE-users"]
  ui: ["COMP-001-RegisterForm"]
```

### API Atomic Spec Example

```yaml
map-spec: "1.1.0"
layer: "api"
atomic: true

unit:
  id: "API-001-POST-auth-register"
  parent: "API-auth"
  name: "Register User"
  scope: "single-concern"
  status: "approved"

endpoint:
  method: "POST"
  path: "/api/v1/auth/register"
  description: "Create a new user account"
  auth: false
  rateLimit: "10 requests per minute per IP"
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
        pattern: "must contain 1 uppercase, 1 number"
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
  429:
    description: "Rate limit exceeded"
    body:
      error: "RATE_LIMIT_EXCEEDED"
      retryAfter: "seconds"

sideEffects:
  - "INSERT into users table (password bcrypt hashed)"
  - "Queue welcome email job"
  - "Create session and return JWT"

aiNotes:
  - "Hash password with bcrypt rounds=12 BEFORE INSERT"
  - "Never return password hash in response"
  - "Generate JWT with userId as subject, 7 day expiry"
  - "Check email uniqueness BEFORE hashing password to save compute"

dependencies:
  rules: ["RULE-001-password-hashing", "RULE-002-jwt-expiry"]
  data: ["TABLE-users"]
```

### Rules Atomic Spec Example

```yaml
map-spec: "1.1.0"
layer: "rules"
atomic: true

unit:
  id: "RULE-001-password-hashing"
  parent: "RULE-security"
  name: "Password Hashing"
  scope: "single-concern"
  status: "approved"

rule:
  domain: "security"
  statement: "All user passwords must be hashed using bcrypt before storage"
  severity: "critical"
  rationale: >
    Plain text passwords are a critical security vulnerability.
    A database breach with hashed passwords is recoverable.
    A breach with plain text passwords is not.

implementation:
  algorithm: "bcrypt"
  costFactor: 12
  library: "bcryptjs or bcrypt (Node.js)"
  when: "Before any INSERT or UPDATE to the password column"

aiInstruction: >
  Import bcrypt at the top of any file that handles passwords.
  Always call await bcrypt.hash(password, 12) before writing to database.
  Never store the raw password string in any variable beyond the request scope.
  Never log the password value at any log level.
  Never return the hashed password in any API response.

violations:
  - "Storing MD5 or SHA hash instead of bcrypt"
  - "Using bcrypt with cost factor below 10"
  - "Logging password values"
  - "Returning password hash in API response"

appliesTo:
  - "API-001-POST-auth-register"
  - "API-008-POST-auth-change-password"
  - "TABLE-users (password column)"
```

---

## The Decomposition Agent

v1.1.0 introduces a required new agent: the **Decomposer**.

The Decomposer runs before any spec-writer agent. It reads the Phase 1
artifacts and produces a Decomposition Plan — the authoritative map of
every atomic unit to be generated.

### Decomposition Plan Schema

```json
{
  "mapSpec": "1.1.0",
  "projectId": "proj-001",
  "projectName": "Offline-First Todo App",
  "decomposedAt": "2026-05-09T10:00:00Z",
  "totalUnits": 28,
  "layers": {
    "functional": [
      { "id": "FEAT-001-user-registration", "parent": "FEAT-001", "name": "User Registration", "priority": "must-have" },
      { "id": "FEAT-001-user-login",        "parent": "FEAT-001", "name": "User Login",         "priority": "must-have" },
      { "id": "FEAT-001-password-reset",    "parent": "FEAT-001", "name": "Password Reset",     "priority": "should-have" },
      { "id": "FEAT-002-create-todo",       "parent": "FEAT-002", "name": "Create Todo",        "priority": "must-have" },
      { "id": "FEAT-002-complete-todo",     "parent": "FEAT-002", "name": "Complete Todo",      "priority": "must-have" },
      { "id": "FEAT-002-delete-todo",       "parent": "FEAT-002", "name": "Delete Todo",        "priority": "must-have" },
      { "id": "FEAT-003-offline-create",    "parent": "FEAT-003", "name": "Offline Create",     "priority": "must-have" },
      { "id": "FEAT-003-sync-on-reconnect", "parent": "FEAT-003", "name": "Sync on Reconnect",  "priority": "must-have" }
    ],
    "api": [
      { "id": "API-001-POST-auth-register", "parent": "API-auth", "name": "Register User",   "method": "POST", "path": "/auth/register" },
      { "id": "API-002-POST-auth-login",    "parent": "API-auth", "name": "Login User",      "method": "POST", "path": "/auth/login" },
      { "id": "API-003-GET-todos",          "parent": "API-todos", "name": "List Todos",     "method": "GET",  "path": "/todos" },
      { "id": "API-004-POST-todos",         "parent": "API-todos", "name": "Create Todo",    "method": "POST", "path": "/todos" },
      { "id": "API-005-PATCH-todo",         "parent": "API-todos", "name": "Update Todo",    "method": "PATCH","path": "/todos/:id" },
      { "id": "API-006-DELETE-todo",        "parent": "API-todos", "name": "Delete Todo",    "method": "DELETE","path": "/todos/:id" }
    ],
    "data": [
      { "id": "TABLE-users",    "parent": "DATA-core", "name": "Users Table" },
      { "id": "TABLE-todos",    "parent": "DATA-core", "name": "Todos Table" },
      { "id": "TABLE-sync-log", "parent": "DATA-sync", "name": "Sync Log Table" }
    ],
    "ui": [
      { "id": "COMP-001-RegisterForm",      "parent": "UI-auth",  "name": "Register Form" },
      { "id": "COMP-002-LoginForm",         "parent": "UI-auth",  "name": "Login Form" },
      { "id": "COMP-003-TodoList",          "parent": "UI-todos", "name": "Todo List" },
      { "id": "COMP-004-TodoItem",          "parent": "UI-todos", "name": "Todo Item" },
      { "id": "COMP-005-OfflineIndicator",  "parent": "UI-shared","name": "Offline Indicator" }
    ],
    "rules": [
      { "id": "RULE-001-password-hashing",    "parent": "RULE-security", "name": "Password Hashing",   "severity": "critical" },
      { "id": "RULE-002-jwt-expiry",          "parent": "RULE-security", "name": "JWT Expiry",          "severity": "critical" },
      { "id": "RULE-003-account-lockout",     "parent": "RULE-security", "name": "Account Lockout",     "severity": "high" },
      { "id": "RULE-004-soft-delete-only",    "parent": "RULE-data",     "name": "Soft Delete Only",    "severity": "critical" },
      { "id": "RULE-005-user-data-isolation", "parent": "RULE-data",     "name": "User Data Isolation", "severity": "critical" }
    ],
    "quality": [
      { "id": "SUITE-001-auth-integration", "parent": "QUALITY-auth",  "name": "Auth Integration Tests", "type": "integration" },
      { "id": "SUITE-002-todos-unit",       "parent": "QUALITY-todos", "name": "Todos Unit Tests",        "type": "unit" },
      { "id": "SUITE-003-offline-e2e",      "parent": "QUALITY-offline","name": "Offline E2E Tests",       "type": "e2e" }
    ]
  }
}
```

---

## Updated spec.manifest.json for v1.1.0

```json
{
  "mapSpec": "1.1.0",
  "atomic": true,
  "projectId": "proj-001",
  "projectName": "Offline-First Todo App",
  "specVersion": "1.0.0",
  "createdAt": "2026-05-09T10:00:00Z",
  "updatedAt": "2026-05-09T10:00:00Z",
  "status": "draft",
  "approvedBy": null,
  "approvedAt": null,
  "phase3Unlocked": false,
  "decompositionPlan": "decomposition.json",
  "totalUnits": 28,
  "completedUnits": 28,
  "layers": {
    "meta":       { "file": "meta.spec.yaml",      "status": "complete", "atomic": false },
    "functional": { "dir": "functional/",           "status": "complete", "atomic": true,  "count": 8 },
    "api":        { "dir": "api/",                  "status": "complete", "atomic": true,  "count": 6 },
    "data":       { "dir": "data/",                 "status": "complete", "atomic": true,  "count": 3 },
    "ui":         { "dir": "ui/",                   "status": "complete", "atomic": true,  "count": 5 },
    "rules":      { "dir": "rules/",                "status": "complete", "atomic": true,  "count": 5 },
    "quality":    { "dir": "quality/",              "status": "complete", "atomic": true,  "count": 3 }
  }
}
```

---

## AI Consumption Rules — v1.1.0 Additions

In addition to all v1.0.0 AI consumption rules, atomic spec consumers must:

1. **One file = one implementation unit** — never read multiple atomic spec
   files simultaneously for a single implementation task
2. **Use dependencies field** — the `dependencies` block tells you which
   other atomic specs relate to this one. Read them only for reference types
   (e.g. TABLE schema), never for implementation logic
3. **Honour the parent** — the `parent` field groups related atoms. All
   atoms under the same parent must be consistent with each other
4. **The dumbest model standard** — if your implementation requires
   inferring anything not stated in the file, the spec is incomplete.
   Halt and request clarification rather than assume.

---

## Validation Rules — v1.1.0 Additions

A v1.1.0 Atomic Spec project is valid when:

- [ ] `spec.manifest.json` has `"atomic": true` and `"mapSpec": "1.1.0"`
- [ ] `decomposition.json` exists and all listed units have corresponding files
- [ ] Every atomic spec file has `atomic: true` and `map-spec: "1.1.0"`
- [ ] Every atomic spec has a `unit.id` that matches its filename
- [ ] No atomic spec file contains more than one unit
- [ ] Every `dependencies` reference points to an existing atomic spec file
- [ ] `totalUnits` in manifest matches actual file count
- [ ] Meta layer is still a single file (meta is never atomic)

---

## Backward Compatibility

MAP Spec v1.1.0 is backward compatible with v1.0.0:

- v1.0.0 monolithic specs remain valid
- v1.1.0 atomic specs are the recommended approach
- The `map-spec` version field distinguishes them
- Validators must support both formats

---

## Changelog

### v1.1.0 (2026-05-09)
- Introduced Atomic Spec principle — one file, one concern
- Added Decomposer agent as required first step
- Defined Decomposition Plan JSON schema
- Added `atomic: true` field to spec files and manifest
- Added `dependencies` block to link related atomic specs
- Added `unit` block as wrapper for atomic spec metadata
- Updated manifest to track directories instead of files for atomic layers
- Added "Dumbest Model Standard" as a core principle
- Updated AI Consumption Rules for atomic consumption
- Updated Validation Rules for atomic projects
- Added `violations` field to rules layer atomic specs

### v1.0.0 (2026-05-09)
- Initial MAP Spec standard
- 7-layer architecture
- Monolithic spec files per layer
