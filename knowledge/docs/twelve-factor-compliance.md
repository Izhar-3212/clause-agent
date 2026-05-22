# Twelve-Factor Compliance

MyAgenticPlatform validates every generated MAP Spec project against a 100-check compliance framework. The framework is based on the Twelve-Factor App methodology but extended with AI-specific policy rules.

## Why Compliance Checking?

AI-generated specs and code can contain subtle violations of production best practices — hardcoded config values, missing environment variable declarations, synchronous operations that should be async, or missing health check endpoints. The compliance checker catches these before code is generated.

## The Two Rule Sets

### Technical Rules (57 checks)

Technical rules use pattern matching against the spec content. They fire automatically based on what is present or absent in the YAML.

The checks are grouped into 12 factors:

| Factor | Example Technical Checks |
|--------|--------------------------|
| I — Codebase | Single repo per service; no monorepo entanglement |
| II — Dependencies | All dependencies declared explicitly; no implicit system packages |
| III — Config | No hardcoded values; all config via environment variables |
| IV — Backing Services | External services treated as attached resources |
| V — Build/Release/Run | Build and runtime stages clearly separated |
| VI — Processes | Stateless processes; no in-memory session state |
| VII — Port Binding | Service exposes itself via a port; no web server dependency |
| VIII — Concurrency | Scale via process model, not threading within one process |
| IX — Disposability | Fast startup; graceful shutdown; crash recovery |
| X — Dev/Prod Parity | Dev and prod environments as similar as possible |
| XI — Logs | Logs as event streams; no log file management in app |
| XII — Admin Processes | Admin tasks as one-off processes alongside the main app |

Each factor has multiple pattern-matching rules. A factor with no violations receives a PASS badge.

### Policy Rules (43 checks)

Policy rules enforce higher-level architectural decisions that cannot be inferred from patterns alone. They require the spec to explicitly address specific concerns.

Examples:
- API specs must declare an `auth` field — no implicit public endpoints
- Data specs must have a `softDelete` field — hard deletes are prohibited
- Rules specs must have `aiInstruction` — business rules must be enforcement-directed
- Quality specs must specify a monitoring requirement — no spec without alerting

Policy violations indicate that a spec is structurally incomplete, not just stylistically wrong.

## Violation Limits

To prevent noisy reports, violations are capped at **2 per factor per rule set**. A spec with 10 violations of Factor III (Config) reports only 2. This keeps the report focused on the most critical issues.

## The Compliance Report

After Phase 2 generation, a TwelveFactorReport is written to:

```
outputs/{projectId}/validation/TwelveFactorReport-{timestamp}.json
```

The report contains:
- Pass/fail status per factor
- Total check count (technical + policy)
- Individual violations with the rule ID, description, and which spec triggered it
- An overall compliance score (percentage of checks passed)

The dashboard displays compliance badges — one per factor — on the project detail page.

## What a Violation Looks Like

```json
{
  "factor": "III",
  "name": "Config",
  "ruleId": "III-TECH-02",
  "description": "API spec contains a hardcoded URL value in a parameter default",
  "spec": "API-001-get-video-stream.yaml",
  "severity": "warning"
}
```

Severity levels:
- `error` — Will cause problems in production; must fix before code generation
- `warning` — Should fix; acceptable to defer to next iteration
- `info` — Informational; no action required

## Fixing Violations

Most violations fix themselves when you update the relevant spec. Re-run the compliance check after editing. The 10+ auto-correction patterns in `autoCorrectSpec()` prevent many common violations from ever reaching the compliance report.

## Phase 1 vs Phase 2 Compliance

- **Phase 1** runs both technical and policy rules against the markdown artifacts (as a preliminary check)
- **Phase 2** runs technical rules only against the generated YAML specs (policy violations in YAML are caught by the Zod validator instead)

This prevents double-reporting and keeps the Phase 2 compliance report focused on structural correctness.
