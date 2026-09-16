# AGENT.md — Aeitron AI Engineering Standards

This file defines the non-negotiable engineering standards for all code written in this repository. Every agent, contributor, or automated tool working on this codebase must follow these rules without exception unless explicitly told otherwise by the project owner.

## Mandatory Git Workflow: Immediate Commit & Push
- **Every change must be committed and pushed immediately:** Whenever any code, script, documentation, or configuration is added or modified, verify it, stage it, create a descriptive git commit, and push it directly to GitHub (`git push origin master`).
- Never leave uncommitted or unpushed work behind at the end of any interaction or task.

---

## Core Principle

No prototypes, no placeholders, no pseudocode, no "TODO: fix later" — unless explicitly requested. Every piece of code written here is assumed to run in production, in front of real customers, handling real automation workflows. Treat every function as if it will be called under load, with malformed input, during a network partition, at 3 AM with no one watching.

Before writing any code, ask: **what breaks this, and have I handled it?** If you can't answer that, the code isn't done.

---

## 1. Error Handling

- Every external call (DB query, HTTP request, file I/O, third-party API, queue operation) MUST be wrapped in explicit error handling. Never assume a call succeeds.
- No empty `catch` blocks. No swallowed errors. Every catch either recovers, retries with backoff, or re-throws with added context.
- Distinguish between **retryable** errors (network timeout, 503, rate limit) and **non-retryable** errors (validation failure, 401, malformed payload). Don't retry things that will never succeed.
- Use typed/custom error classes (`ValidationError`, `ExternalServiceError`, `AuthError`, etc.) instead of throwing generic `Error` or raw strings.
- Every async function that can fail must have a defined failure contract — what does the caller get back on failure? Don't let errors bubble up unhandled to the top of the stack.

```typescript
// Not acceptable
async function fetchClient(id: string) {
  const res = await api.get(`/clients/${id}`);
  return res.data;
}

// Acceptable
async function fetchClient(id: string): Promise<Result<Client, ExternalServiceError>> {
  try {
    const res = await api.get(`/clients/${id}`, { timeout: 5000 });
    return { ok: true, value: res.data };
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return { ok: false, error: new NotFoundError(`Client ${id} not found`) };
    }
    logger.error("fetchClient failed", { clientId: id, err });
    return { ok: false, error: new ExternalServiceError("Client service unreachable", { cause: err }) };
  }
}
```

---

## 2. Input Validation

- Never trust external input — API payloads, query params, webhook bodies, env vars, file uploads. Validate at the boundary, before the data enters business logic.
- Use a schema validator (Zod is the standard here) for every API route, every webhook handler, every job payload.
- Reject early. Don't let invalid data travel deep into the call stack before failing.
- Sanitize anything that touches a DB query, shell command, or HTML output.

```typescript
const createAutomationSchema = z.object({
  name: z.string().min(1).max(120),
  trigger: z.enum(["webhook", "schedule", "manual"]),
  clientId: z.string().uuid(),
  config: z.record(z.unknown()).refine(isValidConfigShape, "Invalid config shape"),
});

router.post("/automations", async (req, res) => {
  const parsed = createAutomationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  // proceed only with validated data
});
```

---

## 3. Logging & Observability

- Use structured logging (JSON, not `console.log` strings) with a proper logger (pino/winston). Every log line should carry context: `requestId`, `userId`/`clientId`, `route`, timestamp.
- Log at the right level: `error` for actual failures, `warn` for degraded-but-recovered situations, `info` for significant business events (automation triggered, workflow completed), `debug` for local dev only.
- Never log secrets, tokens, passwords, or full request bodies containing PII.
- Every request should be traceable end-to-end through a `requestId`/`correlationId` propagated across service calls and background jobs.
- Add metrics for anything that matters to the business: automation success/failure rate, job queue depth, API latency per route.

---

## 4. Configuration & Secrets

- Zero hardcoded credentials, API keys, DB URLs, or webhook secrets in source code — no exceptions, not even in test files or comments.
- All config loaded from environment variables, validated at startup (fail fast if a required var is missing — don't let the app boot into a broken state).
- Use `.env.example` to document required vars without exposing real values.
- Secrets belong in a secrets manager or platform-level env injection, never committed to git.

```typescript
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "staging", "production"]),
});

export const env = envSchema.parse(process.env); // crashes on boot if misconfigured, which is correct
```

---

## 5. Testing

- Every feature ships with unit tests for business logic, integration tests for API routes/DB interactions, and E2E tests for critical user flows (auth, billing, core automation execution).
- Test failure paths explicitly: what happens when the DB is down, the third-party API times out, the payload is malformed, two requests race on the same resource.
- No merging code where core logic (auth, billing, workflow execution, data mutation) has zero test coverage.
- Mock external services in unit tests; use real (containerized) dependencies in integration tests.
- Security-relevant paths (auth, permission checks, webhook signature verification) require dedicated tests, not just happy-path coverage.

---

## 6. Security

- Parameterized queries only — never string-interpolate values into SQL.
- Verify webhook signatures before processing payloads (Stripe, third-party integrations, etc.) — don't trust the payload just because it arrived on the right endpoint.
- Hash passwords with bcrypt/argon2. Never store or log plaintext credentials.
- Rate-limit auth endpoints and any public-facing automation trigger endpoints.
- Enforce least-privilege on DB roles and API tokens — a service that only reads shouldn't hold write credentials.
- Validate JWT/session tokens on every protected route; don't assume middleware ran correctly without a test proving it.

---

## 7. Performance & Scalability

- No N+1 queries — batch or join instead of looping DB calls.
- No unbounded loops or unpaginated queries on data that grows with usage (client lists, automation logs, execution history).
- Long-running or resource-heavy work (large automations, file processing, bulk operations) goes to a background job queue, never blocks an HTTP request.
- Set explicit timeouts on every outbound HTTP call and DB query — nothing waits forever.
- Consider what happens at 10x current load before merging, not after it breaks in production.

---

## 8. Code Structure & Maintainability

- TypeScript strict mode on. No `any` unless justified with a comment explaining why.
- Business logic separated from route/controller handlers — handlers parse input and call services, they don't contain logic.
- No duplicated logic across files — extract shared code into a proper module.
- Every non-obvious decision gets a comment explaining *why*, not *what* (the code already says what).
- Prefer extending and improving existing modules over rewriting from scratch when working in this codebase.

---

## 9. The WAT Architecture (Workflows, Agents, Tools)

The system is organized into three distinct layers to separate probabilistic reasoning from deterministic execution:

- **Layer 1: Workflows (`workflows/`)** — Markdown SOPs defining objectives, required inputs, execution steps, expected outputs, and edge cases.
- **Layer 2: Agents** — Intelligent decision-maker and orchestrator. Reads workflows, coordinates tool runs, handles failures gracefully, and asks clarifying questions.
- **Layer 3: Tools (`tools/` & `dashboard/`)** — Deterministic, testable scripts (Python / Node.js) executing API calls, DB queries, data transforms, and spreadsheet synchronizations.

---

## Hard Rules — Never Do These

1. Never swallow an error silently (empty catch, catch-and-ignore).
2. Never hardcode a secret, key, or credential.
3. Never ship an endpoint or job handler without input validation.
4. Never leave a `TODO` on error handling, security, or auth logic.
5. Never compare passwords or tokens in plaintext.
6. Never build a SQL query with raw string interpolation.
7. Never merge core logic (auth, billing, workflow execution) without tests covering failure paths.
8. Never block the event loop with a long synchronous operation.
9. Never assume an external service call will succeed.
10. Never log PII, secrets, or full payloads without redaction.
11. Never leave code changes uncommitted or unpushed to GitHub at the end of a turn.

---

## When In Doubt

Ask: *what is the actual failure mode here, what's the real load this will see, and how sensitive is this data?* Don't apply a best practice mechanically — reason from what will actually break, then write the code that prevents it.
