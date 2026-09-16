# Agent Instructions

You are working inside the **WAT framework** (Workflows, Agents, Tools) for the **Aeitron AI Automation Agency OS**. This architecture separates concerns so that probabilistic AI handles reasoning and coordination while deterministic code handles execution. That separation is what ensures the system remains robust, predictable, and scalable.

---

## 🚨 MANDATORY CARDINAL RULES

### Rule 1: Immediate Git Commit & Push After Every Change
Every single time you make or modify code, scripts, configurations, or workflows:
1. **Verify & Validate:** Test that the changes compile/run without regressions.
2. **Stage & Commit:** Stage all modified/new files with a clear, descriptive conventional commit message (`feat:`, `fix:`, `refactor:`, `docs:`).
3. **Push to GitHub Immediately:** Push to `origin <branch>` right away. Never leave uncommitted or unpushed work behind at the end of a turn.

```bash
git add <files>
git commit -m "feat(module): descriptive explanation of change"
git push origin <branch>
```

---

### Rule 2: Always Write Production-Level Code (Senior Engineering Mindset)

#### What "Production-Level Code" Actually Means
A piece of code is only truly production-ready when it does not just work on the "happy path," but explicitly handles what happens when things **fail**.

> **The difference between Junior and Senior Engineers:**  
> A junior engineer's code works when everything goes right. A senior engineer's code is engineered for when things go wrong.

Every single decision, check, and line of code must answer one fundamental question:  
**"If this check or line is not here, what breaks in the real world under failure or load?"**

---

## 🏛️ The 8 Pillars of Production-Level Code

### 1. Error Handling Everywhere
* Every external interaction (Database query, external API call, file system I/O, network socket) can and will eventually fail.
* **Core Mindset:** *"Assume the network is inherently unreliable."*
* Never just wrap code in a generic try/catch. Explicitly distinguish between:
  - **Retry:** Transient network hiccups, rate limits with backoff (`exponential backoff with jitter`).
  - **Fail-Fast:** Invalid client parameters, missing required credentials, unrecoverable states.
  - **Fallback:** Graceful degradation (e.g., serving cached data, returning a default safe response, queuing for background processing).

### 2. Input Validation & Boundary Checks
* **Core Mindset:** *"Never trust external input."*
* Every user input, webhook payload, query param, and even environment variable must be validated.
* Always handle:
  - `null`, `undefined`, empty strings, and missing keys.
  - Negative numbers, zero, oversized arrays, or out-of-range numerical bounds.
  - Unexpected data types or malformed payloads.

### 3. Structured Logging & Observability
* In a production environment, you **cannot** attach an interactive debugger. When an issue occurs, your logs are your only lifeline.
* Use structured logging (JSON or tagged context) with:
  - Timestamp (ISO 8601 UTC)
  - Log level (`DEBUG`, `INFO`, `WARN`, `ERROR`)
  - Request ID / Correlation ID
  - Contextual metadata (User ID, action name, resource ID) — **NEVER** log passwords, tokens, or raw PII.

### 4. Externalized Configuration & Secret Hygiene
* Zero hardcoded credentials, API keys, database connection strings, URLs, or magic numbers in the codebase.
* All configuration must be externalized via `.env` files or environment variables.
* Guard against missing configs at application boot time (validate that required environment variables exist before running).

### 5. Comprehensive Testing Coverage
* Do not just test that the happy path returns `200 OK`.
* Write tests for:
  - Boundary conditions and invalid inputs.
  - Failure cases (simulated network outage, 500 error from 3rd party APIs).
  - Concurrency, race conditions, and idempotency.

### 6. Performance & Scalability Considerations
* Code that runs fine for 10 users in development can crash under 100,000 users in production.
* Watch out for:
  - **N+1 query problems:** Batch database lookups or use joins.
  - **Memory leaks:** Unclosed connections, unbounded in-memory caches, retaining event listeners.
  - **Unbounded loops/queries:** Always paginate database and API queries with strict limits.
  - **Non-blocking async:** Never execute CPU-heavy or blocking synchronous calls inside an async event loop.

### 7. Security by Default
* Security is not an afterthought or a patch; it must be built into the first draft:
  - **SQL Injection:** Always use parameterized queries or trusted ORMs. Never concatenate strings into SQL queries.
  - **XSS & Injection:** Sanitize and escape all HTML and external outputs.
  - **Auth & Access Control:** Verify authentication and authorization boundaries on every protected operation.
  - **Data Exposure:** Never return sensitive fields (password hashes, secret keys, internal IDs) in API responses.

### 8. Documentation & Readability
* Production code must be maintainable. Code is read far more often than it is written.
* Maintain clean variable and function naming that explains *intent*.
* Preserve clear docstrings and comments explaining the *why* (business logic, architectural trade-offs, bug workarounds) rather than restating the syntax.

---

## 🚫 Absolute Anti-Patterns: What You Must NEVER Do

| Anti-Pattern | Why It Is Dangerous |
| :--- | :--- |
| **Silent Failures / Swallowing Errors** | Leaving an empty `catch` or `except: pass` hides critical bugs and leaves the system in an unknown corrupted state. |
| **Hardcoded Secrets or Credentials** | Pushing API keys, passwords, or tokens to version control creates immediate security vulnerabilities. |
| **"TODO: fix later" on Critical Logic** | Shipping code with deferred error handling, incomplete auth, or missing validations invites production disasters. |
| **Assuming Edge Cases "Won't Happen"** | If an edge case is mathematically or physically possible, it *will* happen in production under real user traffic. |
| **Copy-Paste Duplication** | Repeating code across multiple files makes bug fixes fragile and maintenance expensive. |
| **Blocking Operations in Async Loops** | Calling blocking synchronous I/O blocks the entire thread pool or event loop, choking throughput for all users. |

---

## 🧠 Thinking from First Principles: An Example

First principles means not blindly copying a design because *"that's how everyone does it."* Instead, break down the problem and ask:
- What are the actual failure modes?
- What will happen under heavy traffic or network failure?
- How sensitive is this data?

### Case Study: A User Authentication Function

#### ❌ Prototype-Level (Not Production-Ready)
```python
def login(username, password):
    # DANGEROUS: SQL injection vulnerability, plaintext password comparison,
    # no rate limiting, no error handling, no audit trail.
    user = db.query(f"SELECT * FROM users WHERE username='{username}'")
    if user.password == password:
        return "success"
    return "fail"
```

#### ✅ Production-Level (First Principles Applied)
```python
import bcrypt
import logging
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)

MAX_ATTEMPTS = 5
LOCKOUT_DURATION = timedelta(minutes=15)

class LoginResult:
    def __init__(self, success: bool, user_id: Optional[int] = None, error: Optional[str] = None):
        self.success = success
        self.user_id = user_id
        self.error = error

def login(username: str, password: str) -> LoginResult:
    # 1. Boundary & Input Validation
    if not username or not password or len(username) > 100 or len(password) > 256:
        return LoginResult(success=False, error="Invalid credentials format")

    try:
        # 2. Rate Limiting & Brute-Force Protection
        if is_locked_out(username):
            logger.warning("Login blocked due to lockout", extra={"username": username})
            return LoginResult(success=False, error="Account temporarily locked. Please try again later.")

        # 3. Secure Parameterized Query (No SQL Injection)
        user = db.query_one(
            "SELECT id, password_hash, is_active FROM users WHERE username = %s",
            (username,)
        )

        # 4. Timing-safe password verification
        if not user or not user.is_active or not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
            record_failed_attempt(username)
            logger.info("Failed login attempt", extra={"username": username})
            return LoginResult(success=False, error="Invalid username or password")

        # 5. Success Audit & State Reset
        reset_failed_attempts(username)
        logger.info("Successful login", extra={"user_id": user.id, "username": username})
        return LoginResult(success=True, user_id=user.id)

    except DatabaseConnectionError as e:
        # 6. Graceful Service Degradation & Structured Error Logging
        logger.error("Database connection failure during login", extra={"error": str(e)}, exc_info=True)
        return LoginResult(success=False, error="Authentication service is temporarily unavailable")
    except Exception as e:
        # 7. Fail-safe Catch-all
        logger.critical("Unexpected error during login execution", extra={"error": str(e)}, exc_info=True)
        return LoginResult(success=False, error="An unexpected error occurred")
```

**Key Takeaway:** The production implementation is longer not for the sake of verbosity, but because every single additional line answers a real-world failure mode or security requirement.

---

## The WAT Architecture

### Layer 1: Workflows (The Instructions)
- **Location:** `workflows/`
- Standard Operating Procedures (SOPs) written in clean Markdown.
- Each workflow defines:
  - **Objective:** The business outcome to achieve
  - **Required Inputs:** Parameters, credentials, or datasets needed
  - **Tools Used:** Corresponding scripts from `tools/` or endpoints in `dashboard/`
  - **Steps:** Exact execution order and procedural logic
  - **Expected Outputs:** Artifacts, cloud uploads, or database records
  - **Edge Cases & Failure Modes:** How to handle exceptions, retries, and errors

### Layer 2: Agents (The Decision-Maker & Coordinator)
- **Role:** You sit at this layer. You are responsible for intelligent coordination, decision-making, and validation.
- Read the relevant SOP in `workflows/`, verify prerequisites, call deterministic tools in the correct sequence, handle unexpected failures, and ask clarifying questions when needed.
- Connect intent to structured execution without attempting to manually hallucinate or perform complex data operations directly.

### Layer 3: Tools (The Execution Engine)
- **Location:** `tools/` (Python execution scripts) and `dashboard/` (Vite + React UI & Express backend).
- Deterministic, testable scripts for API calls, data transformations, database queries, spreadsheet synchronizations, and reporting.
- Credentials and API keys are stored in `.env` and never hardcoded.

---

## How to Operate

### 1. Check Existing Tools & Workflows First
Before building any new script or workflow:
- Check `workflows/` for existing SOPs.
- Inspect `tools/` for existing Python scripts (`sync_google_sheets.py`, `export_data.py`, `generate_report.py`, `send_email.py`, etc.).
- Only create new tools or workflows when no existing implementation covers the task.

### 2. Learn and Adapt on Failure
When an operation or script errors:
- Inspect the full stack trace and error message.
- Identify the root cause (e.g., API rate limits, schema mismatch, missing environment variable).
- Fix the script or parameter handling and verify the solution.
- *Important:* If a fix involves paid API credits or destructive changes, confirm with the user before re-running.
- Update the corresponding workflow in `workflows/` with any new discovery (e.g., rate limit delays, token refresh nuances) to prevent future failures.

### 3. Maintain Documentation & Workflow Integrity
- Workflows are living documents that must stay updated as the platform evolves.
- When refining tools or fixing bugs, keep the documentation synchronized.
- Never delete or arbitrarily overwrite existing workflows without user consent.

---

## The Self-Improvement Loop

Every failure is an opportunity to strengthen the system:
1. **Identify** what broke and why.
2. **Fix** the underlying tool or configuration.
3. **Verify** that the fix works reliably.
4. **Document** the lesson and update the workflow SOP.
5. **Proceed** with an improved, resilient platform.

---

## Project Structure & Conventions

```
Aeitron-AI-Finance-dashboard/
├── .tmp/                    # Temporary scratch files, cache, and exports (disposable)
├── dashboard/               # Frontend & Backend Application
│   ├── src/                 # React UI components, views, styles, state
│   ├── server.js            # Express backend server
│   ├── package.json         # Node dependencies & scripts
│   └── vite.config.js       # Vite build configuration
├── tools/                   # Deterministic Python scripts (execution layer)
│   ├── sync_google_sheets.py
│   ├── export_data.py
│   ├── generate_report.py
│   ├── send_email.py
│   ├── email_templates.py
│   ├── utils.py
│   └── requirements.txt
├── workflows/               # Markdown SOPs (workflows layer)
│   ├── dashboard_management.md
│   ├── data_export.md
│   ├── email_notifications.md
│   ├── google_sheets_sync.md
│   └── report_generation.md
├── .env                     # Secrets & environment variables (NEVER commit)
├── CLAUDE.md                # Claude-specific instructions
├── AGENT.md                 # Universal agent operating instructions & standards
├── README.md                # Project documentation
└── start-server.bat         # Windows quick-start launcher
```

### Core Principles:
- **Separation of Concerns:** Keep business logic in workflows, execution in tools, and UI in the dashboard.
- **Data Safety:** Local processing files in `.tmp/` are temporary. Persistent deliverables belong in verified storage or connected cloud services (e.g., Google Sheets, database).
- **Security:** Never commit API keys, service account JSON files, or `.env` secrets to version control.

---

## Pre-Flight Checklist for Every Code Change

Before completing any task or claiming code is ready:
- [ ] **Error Handling:** Are external calls protected with proper retries/fallbacks?
- [ ] **Validation:** Is all user/external input validated before processing?
- [ ] **Observability:** Are structured logs in place without leaking sensitive data?
- [ ] **Configuration:** Are all secrets and variables loaded from `.env`?
- [ ] **Tests & Verification:** Has the code been tested against edge cases and failure paths?
- [ ] **Clean Code:** Are there zero `TODO: fix later`, zero silent catches, and zero dead code?
- [ ] **Git Push:** Has the change been committed with a clear message and pushed to GitHub?
