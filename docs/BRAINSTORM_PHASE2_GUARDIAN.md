# AgentVerse — Phase 2 Constraint Guardian Review

> **Document**: `BRAINSTORM_PHASE2_GUARDIAN.md`
> **Author**: Constraint Guardian Agent
> **Date**: 2026-05-25
> **Status**: REVIEW COMPLETE — Violations Catalogued
> **Input**: `BRAINSTORM_PHASE1_DESIGN.md` (Rev 1.0) + `PROJECT.md`
> **Revision**: 1.0

---

## Executive Summary

The Phase 1 design is **ambitious and architecturally sound at the feature level**, but contains **4 BLOCKERS**, **14 WARNINGS**, and **9 INFOs** when measured against the project's own stated constraints (`<2s initial render, 60fps 3D, <100ms API, SOC2-ready, multi-tenant`). The design focuses heavily on features and UX but is dangerously thin on non-functional architecture — there is no mention of Row-Level Security, no rate limiting strategy, no caching layer design, no circuit breaker patterns, and no bundle-splitting strategy for the massive 3D assets.

**Verdict**: The design CANNOT proceed to implementation without resolving the 4 BLOCKERS. WARNINGs should be addressed in Phase 1 planning. INFOs can be deferred to implementation.

---

## Constraint Audit Legend

| Rating | Meaning |
|--------|---------|
| 🔴 **BLOCKER** | Violates a hard constraint. Must be resolved before implementation begins. |
| 🟡 **WARNING** | Risks violating a constraint under realistic load. Should be addressed in design. |
| 🔵 **INFO** | Potential concern that can be addressed during implementation. |

---

## 🔴 BLOCKER-1: No Multi-Tenant Isolation (Row-Level Security) Anywhere

> **Constraint Violated**: Security — SOC2-ready, tenant isolation, data sovereignty
> **Severity**: 🔴 BLOCKER

### The Problem

Every single data model across all 7 features includes `org_id FK` fields, but the design **never specifies Row-Level Security (RLS) policies, tenant isolation middleware, or query-scoping strategies**. The `PROJECT.md` explicitly lists `Multi-tenant architecture — workspace isolation, row-level security, RBAC` as an Active requirement.

Without RLS:
- A bug in any API endpoint could leak Organization A's squad configs, agent definitions, cost data, or execution traces to Organization B.
- WebSocket channels (`ws://api/v1/squads/:id/live`, `ws://api/v1/finops/live`, `ws://api/v1/observability/live`) have no documented tenant-scoping mechanism.
- The Marketplace feature mixes public listings with org-private data — no isolation boundary is defined.
- BYOA agent registrations store `external_endpoint` and `auth_config` (API keys, OAuth tokens) — cross-tenant leakage here is a **data breach**.

### Specific Risk Vectors

| Surface | Risk |
|---------|------|
| REST APIs (all features) | Missing `org_id` filter = full data leak |
| WebSocket channels | No tenant-scoped subscription model documented |
| BYOA `auth_config` | Stores third-party credentials — highest sensitivity |
| `TOOL_TRACE.input_data` / `output_data` | May contain PII, code, customer data |
| Marketplace with `visibility: org_only` | No isolation mechanism specified |
| FinOps `COST_EVENT` | Financial data cross-leak = compliance violation |

### Minimum Fix

1. **PostgreSQL RLS policies** on every table with `org_id`: `CREATE POLICY tenant_isolation ON <table> USING (org_id = current_setting('app.current_org_id')::uuid)`.
2. **Middleware in Go (Fiber)**: Extract `org_id` from JWT, set `app.current_org_id` via `SET LOCAL` on every DB connection from pool.
3. **WebSocket auth**: Validate tenant ownership of `squad_id` / resource on connection upgrade, not just authentication.
4. **BYOA credentials**: Encrypt `auth_config` at rest with per-tenant encryption keys (envelope encryption via KMS).
5. Document the **tenant isolation architecture** as a cross-cutting concern before any feature implementation begins.

---

## 🔴 BLOCKER-2: <2s Initial Render Impossible Without Bundle Strategy for 3D Assets

> **Constraint Violated**: Performance — <2s initial render
> **Severity**: 🔴 BLOCKER

### The Problem

The design mandates **Four Interaction Modes simultaneously** (Commandment #1) with the 3D Neural Command Center using Three.js + Globe.gl + React Three Fiber. These libraries add **~500KB-1MB+ gzipped** to the JavaScript bundle:

| Library | Gzipped Size (approx.) |
|---------|----------------------|
| three.js | ~150KB |
| @react-three/fiber | ~45KB |
| @react-three/drei | ~80KB |
| globe.gl | ~90KB |
| D3.js | ~75KB |
| Recharts | ~50KB |
| Total 3D + Charts | **~490KB+ gzipped** |

Loading all of this on initial render **will exceed 2 seconds** on anything less than a fast corporate network. The design provides no lazy-loading, code-splitting, or progressive enhancement strategy.

Additionally, the 3D globe requires:
- Earth texture maps (~2-5MB)
- Night-side textures (~1-2MB)
- Custom shaders (compilation time)
- WebGL context initialization (~200-500ms)

### Minimum Fix

1. **Route-based code splitting**: 3D Command Center must be a separate Next.js route with `dynamic(() => import('./Globe'), { ssr: false })`. Never load Three.js on Dashboard or CLI routes.
2. **Progressive loading**: Initial render shows Dashboard mode (2D) by default. 3D loads in background after first paint via `requestIdleCallback` or Intersection Observer.
3. **Asset CDN with preload hints**: Globe textures loaded via `<link rel="preload">` only on 3D routes. Use compressed textures (KTX2/Basis).
4. **Performance budget**: Define per-route JS budgets. Dashboard ≤ 200KB gzipped. 3D ≤ 600KB gzipped (deferred).
5. **SSR/Streaming**: Use Next.js App Router streaming with `<Suspense>` boundaries for each heavy component (charts, canvas, 3D).

---

## 🔴 BLOCKER-3: No Authentication/Authorization Architecture

> **Constraint Violated**: Security — SOC2-ready, RBAC
> **Severity**: 🔴 BLOCKER

### The Problem

The design defines **100+ REST endpoints** and **5+ WebSocket channels** across 7 features but contains **zero mention** of:
- Authentication mechanism (JWT? session? API key?)
- RBAC model (who can access what?)
- Role definitions beyond vague titles ("Squad Commander", "FinOps Lead", "Platform Admin")
- API key management for programmatic access
- Rate limiting per user/org/API key
- CORS policy
- CSRF protection
- Webhook signature verification (except a `webhook_secret` field)

The `PROJECT.md` explicitly requires `Enterprise SSO — SAML, OIDC, SCIM via Keycloak` and `Multi-tenant architecture — RBAC`.

### Specific Risk Vectors

| Surface | Risk |
|---------|------|
| `POST /api/v1/squads/:id/activate` | Who can activate a squad? Any org member? |
| `POST /api/v1/finops/budgets/:id/override` | Says "requires admin auth" but no RBAC model defined |
| `DELETE /api/v1/squads/:id` | Cascade deletion of agents, budgets, executions — no authorization guard |
| `POST /api/v1/marketplace/listings` | Who can publish to marketplace? Verified creators only? |
| `POST /api/v1/schedules/dlq/:id/replay` | Open question #3 acknowledges this but doesn't resolve it |
| `POST /api/v1/byoa/register` | Registering external agents = high-privilege action |
| WebSocket connections | No auth documented for persistent connections |
| CLI `agentverse` commands | Auth token management not documented |

### Minimum Fix

1. **Define RBAC model** with minimum roles: `org_owner`, `org_admin`, `squad_commander`, `developer`, `viewer`, `billing_admin`.
2. **Permission matrix**: Map every API endpoint to required role(s). Document in design.
3. **Auth flow**: JWT (access + refresh tokens) via Keycloak. Short-lived access tokens (15min). Refresh via httpOnly cookie.
4. **API key system**: For CLI and programmatic access. Scoped per-org, per-permission-set.
5. **Rate limiting**: Per-org and per-user limits. Documented per endpoint category.
6. **WebSocket auth**: Token-based auth on upgrade handshake. Periodic re-validation.

---

## 🔴 BLOCKER-4: No Audit Trail Architecture

> **Constraint Violated**: Security — SOC2-ready, audit trails
> **Severity**: 🔴 BLOCKER

### The Problem

`PROJECT.md` explicitly requires `Audit logging — complete trail of agent actions, cost events, and user operations`. The design mentions "immutable audit traces" in Feature 4 (Observability) for **tool traces only**, but there is **no platform-wide audit logging architecture**. SOC2 Type II requires audit trails for:

- Every user login/logout (who accessed the system)
- Every data modification (who changed what, when)
- Every permission change (who granted/revoked roles)
- Every budget override (who overrode, why)
- Every squad activation/termination (who triggered, what happened)
- Every marketplace publish/install (who published, who installed)
- Every BYOA registration (who registered external agent access)

The `TOOL_TRACE` table in Feature 4 only covers **agent tool invocations**, not **user actions on the platform**.

### Minimum Fix

1. **Platform-wide audit log table**:
   ```sql
   AUDIT_LOG (
     id UUID PK,
     org_id UUID FK,
     actor_type ENUM('user', 'system', 'agent'),
     actor_id UUID,
     action VARCHAR, -- e.g. 'squad.activate', 'budget.override', 'member.remove'
     resource_type VARCHAR,
     resource_id UUID,
     before_state JSONB,
     after_state JSONB,
     ip_address INET,
     user_agent TEXT,
     timestamp TIMESTAMPTZ
   )
   ```
2. **Append-only**: No UPDATE or DELETE on audit table. Separate retention policy.
3. **Middleware-level capture**: Audit logging in Go Fiber middleware, not per-handler. Captures all mutating operations automatically.
4. **Immutable storage**: Audit logs replicated to append-only storage (S3 with Object Lock) for tamper-proofing.

---

## 🟡 WARNING-1: 60fps 3D Globe with Real-Time WebSocket Updates at Scale

> **Constraint Violated**: Performance — 60fps 3D views
> **Severity**: 🟡 WARNING

### The Problem

Feature 6 (3D Neural Command Center) requires:
- Globe rendering with day/night shader, particle systems, ambient effects
- Agent markers updated via WebSocket at 1Hz
- Connection arcs with particle flow animation
- Heatmap overlay with hexagonal bins
- Boardroom mode with auto-rotate + metric carousel + star field + ambient particles
- Neural topology view with force-directed physics simulation

Running all of this simultaneously while receiving WebSocket updates will cause frame drops on mid-range hardware. The design specifies no LOD (Level of Detail) strategy, no frame budget, and no degradation path.

With 50+ agents (the stated scalability target), the 3D scene could have:
- 50+ marker objects with glow shaders
- 100+ connection arcs with particle systems
- Hundreds of animated particles
- Force-directed physics computation every frame

### Minimum Fix

1. **LOD system**: Reduce marker detail when >20 markers visible. Merge distant clusters.
2. **Frame budget**: If frame time exceeds 16ms, disable: particles → arc animations → glow effects → heatmap, in that order.
3. **WebSocket throttling on 3D view**: Buffer updates and apply in batches per animation frame, not per message. Use `requestAnimationFrame` as the update clock.
4. **Web Worker**: Offload force-directed physics computation to a Web Worker. Only pass position updates to the render thread.
5. **GPU instancing**: Use `THREE.InstancedMesh` for agent markers instead of individual meshes.
6. **Minimum spec documentation**: State minimum hardware/browser requirements for 3D mode.

---

## 🟡 WARNING-2: <100ms API Response for FinOps Cost Aggregation Queries

> **Constraint Violated**: Performance — <100ms API responses
> **Severity**: 🟡 WARNING

### The Problem

Feature 3 (FinOps Command Center) defines these endpoints:
- `GET /api/v1/finops/costs` — Aggregate costs (filterable by org, squad, member, model, date range)
- `GET /api/v1/finops/costs/timeseries` — Cost timeseries (granularity: hour|day|week|month)
- `GET /api/v1/finops/costs/breakdown` — Breakdown by dimension
- `GET /api/v1/finops/costs/top-consumers` — Top N cost consumers

The `COST_EVENT` table will grow **rapidly**. A 50-agent org running 8 hours/day, with each agent making ~100 LLM calls/hour generates:
- **40,000 cost events/day** per org
- **1.2M events/month** per org
- In a multi-tenant system with 100 orgs: **120M events/month**

Running aggregation queries (SUM, GROUP BY, timeseries) across millions of rows with date range filters will **not** return in <100ms without pre-computation.

### Minimum Fix

1. **Materialized views**: Pre-aggregate `cost_events` into `cost_daily_summary`, `cost_hourly_summary` tables, refreshed by background workers or triggers.
2. **Partitioning**: Partition `COST_EVENT` by month using PostgreSQL declarative partitioning (`PARTITION BY RANGE (created_at)`).
3. **Redis caching**: Cache hot aggregation results in Redis with 30-60s TTL. Invalidate on new cost events via Redis Streams.
4. **TimescaleDB consideration**: For the cost timeseries workload, TimescaleDB's hypertables would dramatically outperform vanilla PostgreSQL.
5. **Pagination + streaming**: For drill-down queries returning raw events, enforce pagination (max 100 per page) and cursor-based pagination.

---

## 🟡 WARNING-3: WebSocket Connection Explosion

> **Constraint Violated**: Scalability — concurrent users, multi-tenant
> **Severity**: 🟡 WARNING

### The Problem

The design defines **5+ separate WebSocket channels**:
1. `ws://api/v1/squads/:id/live` — per-squad real-time (Feature 1)
2. `ws://api/v1/flows/:id/debug/:sessionId` — per-debug-session (Feature 2)
3. `ws://api/v1/finops/live` — FinOps live feed (Feature 3)
4. `ws://api/v1/observability/live` — Observability live feed (Feature 4)
5. `ws://api/v1/command-center/live` — 3D scene updates (Feature 6)

A single user viewing the dashboard with Observability + FinOps + Squad + 3D open would hold **4 concurrent WebSocket connections**. With 100 concurrent users across 10 orgs: **400 WebSocket connections** minimum. This doesn't include debug sessions.

Go (Fiber) can handle this, but the design doesn't address:
- Connection lifecycle management (heartbeat, reconnect, stale connection cleanup)
- Memory overhead per connection (each WebSocket holds state + buffers)
- Fan-out cost (broadcasting to N connections per squad update)
- Horizontal scaling (WebSocket connections are stateful — can't round-robin)

### Minimum Fix

1. **Consolidate WebSocket channels**: Single multiplexed connection per user with topic-based subscriptions (e.g., `{ subscribe: ["squad:abc", "finops", "observability"] }`). Reduces connection count by 4-5x.
2. **Redis Pub/Sub for fan-out**: WebSocket servers subscribe to Redis channels per org/squad. Any backend service publishes events to Redis. Enables horizontal scaling of WS servers.
3. **Connection limits**: Max 2 WS connections per user. Max 50 per org.
4. **Graceful degradation**: If WS fails, fall back to SSE. If SSE fails, fall back to polling (30s interval).
5. **Sticky sessions**: If not consolidating, use sticky sessions (IP hash or cookie) for WebSocket servers behind load balancer.

---

## 🟡 WARNING-4: TOOL_TRACE Stores Full Input/Output — Storage and Privacy Risk

> **Constraint Violated**: Security — data sovereignty, SOC2 / Scalability — storage costs
> **Severity**: 🟡 WARNING

### The Problem

Feature 4 defines `TOOL_TRACE` with `input_data JSONB` and `output_data JSONB` fields storing **full tool invocation data**. For an LLM agent, this includes:
- Full prompts (potentially containing customer PII, proprietary code, trade secrets)
- Full responses (generated content, analysis results)
- File contents (if the tool reads files)

With 50 agents making ~100 tool calls/hour, each storing ~5KB average:
- **25MB/hour** per org of trace data
- **600MB/day** per org
- **18GB/month** per org
- **1.8TB/month** across 100 orgs

The design mentions tiered storage (Redis 24h → PostgreSQL 30d → S3 Parquet 30d+) but doesn't address:
- **PII scrubbing** before storage (LGPD/GDPR compliance for Brazilian market)
- **Encryption at rest** for trace data
- **Data retention controls** per org (data sovereignty)
- **Access controls** on trace data (who can view raw tool I/O?)
- **Cost** of storing 1.8TB/month of JSONB in PostgreSQL

### Minimum Fix

1. **Configurable trace verbosity**: Orgs choose: `full` (store everything), `hashed` (store input/output hashes only), `disabled`. Default to `hashed` for compliance.
2. **PII detection + redaction**: Run a lightweight PII scanner on trace data before storage. Redact SSN, CPF (Brazilian tax ID), credit cards, emails per LGPD.
3. **Encryption**: Encrypt `input_data` and `output_data` with per-org keys before storage.
4. **Retention policies**: Per-org configurable retention. Auto-delete after retention period. Document in data processing agreement.
5. **Storage optimization**: Compress JSONB with pg_lz or store in S3 with PostgreSQL storing only metadata + S3 reference.

---

## 🟡 WARNING-5: Visual Flow Canvas — Code Execution Node Security

> **Constraint Violated**: Security — SOC2-ready, tenant isolation
> **Severity**: 🟡 WARNING

### The Problem

Feature 2 defines a `code` node type: `Code (JS/Python) | advanced | input → output`. This means users can write and execute arbitrary JavaScript/Python code within flows. The design provides **no sandboxing or isolation strategy**.

Risks:
- **Remote Code Execution (RCE)**: A malicious user executes `os.system('rm -rf /')` or exfiltrates env vars.
- **Cross-tenant data access**: Code node accesses shared file system or network.
- **Resource exhaustion**: Infinite loops, memory bombs, fork bombs.
- **Secret exfiltration**: Code node reads environment variables containing API keys, database credentials.

### Minimum Fix

1. **Sandboxed execution**: Run code nodes in isolated containers (Firecracker microVMs, gVisor, or at minimum Docker with `--network=none --read-only --memory=256m --cpus=0.5`).
2. **Execution timeout**: Hard 30-second timeout per code node execution.
3. **No network access by default**: Code nodes cannot make outbound network calls unless explicitly granted via flow config.
4. **No filesystem access**: Code nodes run in ephemeral containers with no persistent storage.
5. **Secret isolation**: No environment variables from the host platform leaked to code execution sandbox.
6. **Output size limits**: Maximum 1MB output per code node to prevent memory exhaustion downstream.

---

## 🟡 WARNING-6: Marketplace Security Scan — No Architecture Defined

> **Constraint Violated**: Security — SOC2-ready
> **Severity**: 🟡 WARNING

### The Problem

Feature 5 (Marketplace) story MP-05 requires: `Security scan pipeline: prompt analysis, tool permission audit, sandbox execution test. Security badge displayed.` The API includes `POST /api/v1/marketplace/listings/:id/scan`, but the design provides **zero detail** on:
- What the scan checks for
- How prompt injection is detected
- How tool permissions are audited
- What "sandbox execution test" means
- Who reviews scan results (automated only? human review?)
- What happens when a scan fails (auto-reject? manual review queue?)
- How to prevent malicious updates to previously-approved listings

Without this, the marketplace becomes a vector for:
- **Prompt injection attacks** distributed to thousands of users
- **Malicious tool bindings** that exfiltrate data
- **Supply chain attacks** via agent updates

### Minimum Fix

1. **Static analysis**: Scan system prompts for known prompt injection patterns (ignore previous instructions, output system prompt, etc.).
2. **Permission audit**: Enumerate all tools/capabilities an agent requests. Flag high-risk tools (file write, network access, code execution, shell commands).
3. **Sandboxed test run**: Execute agent in isolated sandbox with synthetic inputs. Monitor for unexpected network calls, file access, data exfiltration.
4. **Version-gated scans**: Every version update triggers a re-scan. No auto-deploy of unscanned versions.
5. **Human review for paid agents**: Paid agents require manual security review before marketplace listing.
6. **Revocation mechanism**: Ability to remotely disable a compromised marketplace agent across all installations.

---

## 🟡 WARNING-7: Auto-Scale Rule Engine Has No Rate Limiter or Circuit Breaker

> **Constraint Violated**: Reliability — circuit breakers, graceful degradation / Operational Cost
> **Severity**: 🟡 WARNING

### The Problem

Feature 1 (Squad Builder) defines `AUTO_SCALE_RULE` with: `if queue_depth > N for T seconds, spawn up to max_workers clones`. The design includes a `cooldown_seconds` field but no:
- **Circuit breaker**: If spawned workers keep failing, the system will keep spawning and burning budget.
- **Global spawn rate limit**: Nothing prevents 50 squads from each spawning `max_workers` simultaneously, overwhelming the platform.
- **Cost guard**: Auto-scaling spawns agents that consume tokens. No integration with budget checks before scaling.
- **Cascading failure protection**: If downstream services are overloaded (the reason for queue depth increase), spawning more workers makes it worse.

### Minimum Fix

1. **Circuit breaker on auto-scale**: If 3 consecutive spawned workers fail within 5 minutes, trip circuit breaker. Stop spawning. Alert operator.
2. **Global spawn rate limit**: Max 10 new workers per org per minute. Max 50 total per org.
3. **Budget pre-check**: Before spawning, verify `budget_remaining > estimated_hourly_cost * min_hours`. Block spawn if insufficient budget.
4. **Cascading failure detection**: If auto-scale trigger is `latency_p99`, check if downstream dependencies are healthy before spawning (spawning into a broken dependency is wasteful).

---

## 🟡 WARNING-8: BYOA Health Check — No Circuit Breaker or Timeout Strategy

> **Constraint Violated**: Reliability — 99.9% uptime, graceful degradation
> **Severity**: 🟡 WARNING

### The Problem

Feature 5 (BYOA) stores `health_check` config and has a `status: active|degraded|unreachable` field. External agents run on **customer infrastructure** outside our control. The design doesn't specify:
- Health check interval (too frequent = DDoS the customer; too infrequent = stale status)
- Timeout per health check (a hanging health check blocks the checker)
- What happens when a BYOA agent is `unreachable` during a flow execution (does the flow fail? retry? skip?)
- Circuit breaker (stop checking an agent that's been unreachable for hours)

### Minimum Fix

1. **Health check interval**: Configurable, default 60s. Minimum 30s to prevent abuse.
2. **Timeout**: 5s hard timeout per health check.
3. **Circuit breaker**: After 3 consecutive failures, mark `unreachable`, stop checking for 5 minutes, then probe once. Exponential backoff up to 1 hour.
4. **Flow integration**: BYOA agent unavailability should trigger flow-level fallback (configurable: fail, skip, use alternative agent).
5. **Egress allowlist**: Document that BYOA health checks originate from known IP ranges for customer firewall config.

---

## 🟡 WARNING-9: `jsonb` Overuse — Query Performance and Schema Evolution Risk

> **Constraint Violated**: Maintainability — clean architecture / Performance — <100ms API
> **Severity**: 🟡 WARNING

### The Problem

The data models make **extensive use of JSONB** across all features:

| Table | JSONB Columns |
|-------|---------------|
| `SQUAD` | `topology_config`, `communication_protocol` |
| `SQUAD_MEMBER` | `capabilities`, `mailbox_config` |
| `AGENT_DEFINITION` | `tools`, `skills`, `memory_config` |
| `FLOW_NODE` | `config`, `position`, `size`, `mock_data` |
| `FLOW` | `canvas_state`, `variables` |
| `FLOW_EXECUTION` | `input_data`, `output_data`, `node_traces` |
| `TOOL_TRACE` | `input_data`, `output_data` |
| `COST_EVENT` | `metadata` |
| `SCHEDULE` | `input_template`, `resource_requirements` |
| `DEAD_LETTER_ENTRY` | `last_error`, `full_context` |
| `BYOA_REGISTRATION` | `agent_card`, `health_check`, `auth_config` |

JSONB is appropriate for some of these (e.g., `canvas_state`, `position`), but problematic for others:
- **`FLOW_EXECUTION.node_traces`**: Stores per-node execution data as a single JSONB blob. For flows with 50+ nodes, this becomes a multi-MB document that can't be queried efficiently.
- **`capabilities`**, **`tools`**, **`skills`**: These are relational data disguised as JSONB. You can't query "find all agents with the `git_diff` tool" efficiently.
- **`auth_config`**: Security-sensitive data in schemaless format = harder to validate and audit.

### Minimum Fix

1. **Normalize high-query columns**: `capabilities` → `AGENT_CAPABILITY` join table. `tools` → `AGENT_TOOL_BINDING` join table. Enables indexed querying.
2. **Separate `node_traces`**: Extract to `FLOW_NODE_TRACE` table (one row per node per execution). Enables per-node queries and avoids multi-MB JSONB blobs.
3. **GIN indexes**: Add `GIN` indexes on JSONB columns that are queried with `@>` or `?` operators.
4. **Schema validation**: Add `CHECK` constraints or application-level JSON Schema validation for all JSONB columns to prevent garbage data.

---

## 🟡 WARNING-10: No Caching Strategy Documented

> **Constraint Violated**: Performance — <100ms API responses
> **Severity**: 🟡 WARNING

### The Problem

The tech stack lists `Redis 7` for caching, but the design **never specifies what is cached, for how long, or how cache invalidation works**. For <100ms API responses, caching is mandatory for:

- Marketplace listings (browse pages, featured)
- Squad configuration (read-heavy, write-infrequent)
- FinOps aggregations (expensive queries)
- Model pricing table (changes rarely)
- Node type registry (static-ish data)
- Observability metrics summary (computed aggregations)
- 3D scene data (globe markers, arcs — polled every second)

### Minimum Fix

1. **Cache-aside pattern**: Define which endpoints use Redis cache-aside, with explicit TTLs:
   - Marketplace listings: 5min TTL
   - Model pricing: 1hr TTL
   - FinOps daily aggregations: 60s TTL
   - Node type registry: 10min TTL
   - Squad config: 30s TTL (invalidated on write)
2. **Cache invalidation**: Publish invalidation events to Redis Streams on data mutation. Subscribing services clear affected cache keys.
3. **ETag/Conditional requests**: Support `If-None-Match` headers on GET endpoints to reduce bandwidth.
4. **3D scene data**: Cache full scene state in Redis, update incrementally. 3D clients fetch from cache, not database.

---

## 🟡 WARNING-11: No Database Connection Pooling or Query Timeout Strategy

> **Constraint Violated**: Reliability — 99.9% uptime / Performance — <100ms API
> **Severity**: 🟡 WARNING

### The Problem

The design specifies `PostgreSQL 16` and `Go (Fiber)` backend but never addresses:
- Connection pool sizing (too few = request queuing; too many = PG overload)
- Query timeouts (a runaway aggregation query blocks a connection indefinitely)
- Read replicas for heavy read workloads (FinOps dashboards, Observability, Marketplace browse)
- Connection handling for the two-backend architecture (Go + Python both hitting the same PG)

With Go and Python backends both connecting to PostgreSQL, plus Redis, plus WebSocket state, the connection topology is complex.

### Minimum Fix

1. **PgBouncer**: Deploy PgBouncer in front of PostgreSQL for connection pooling. Transaction-mode pooling.
2. **Query timeouts**: Set `statement_timeout = 5s` for API handlers. `statement_timeout = 30s` for background jobs. Never allow unbounded queries.
3. **Read replicas**: At minimum 1 read replica for Marketplace browse, FinOps dashboards, Observability history queries.
4. **Connection budgets**: Go backend: max 30 connections. Python backend: max 20 connections. Total PG `max_connections`: 100 (with PgBouncer multiplexing).

---

## 🟡 WARNING-12: Observability Data Volume — Hot/Warm/Cold Strategy Incomplete

> **Constraint Violated**: Scalability — 50+ agents / Operational Cost
> **Severity**: 🟡 WARNING

### The Problem

Feature 4 mentions `Hot data (last 24h) in Redis Streams. Warm data (last 30d) in PostgreSQL. Cold data (30d+) in S3 as Parquet files.` but doesn't specify:
- **How data moves between tiers** (background job? trigger? CDC?)
- **Redis memory limits** (24h of heartbeats + events for 50 agents = significant memory)
- **Parquet schema** for cold storage (impacts query capabilities)
- **Query routing** (how does the API know which tier to query?)

For 50 agents emitting heartbeats every 2s + events:
- Heartbeats: 50 agents × 1 heartbeat/2s × 86,400s = **2.16M heartbeat records/day** in Redis
- At ~200 bytes each: **~430MB/day in Redis** (just heartbeats)
- Plus events, tool traces: easily **1-2GB/day in Redis**

### Minimum Fix

1. **Redis memory budget**: Max 4GB for observability hot data. If exceeded, oldest data evicted automatically (MAXLEN on streams).
2. **Tier migration**: Cron job every hour moves data from Redis → PostgreSQL. Daily job moves 30d+ data to S3 Parquet.
3. **Query router**: API middleware checks requested time range. Routes to appropriate tier. Merges results transparently.
4. **Heartbeat downsampling**: In warm/cold tiers, downsample heartbeats from per-2s to per-minute averages. Reduces volume by 30x.

---

## 🟡 WARNING-13: "Unlimited Drill-Down Depth" Conflicts with API Performance Constraints

> **Constraint Violated**: Performance — <100ms API / Philosophy vs. Reality
> **Severity**: 🟡 WARNING

### The Problem

Commandment #2 mandates "Unlimited Drill-Down Depth" with the example: `Click a KPI → see the chart → click the bar → see the table → click the row → see the agent → see every single API call that agent made.`

Feature 3 (FinOps) implements this: `Org → Squad → Agent → Execution → Node → Raw LLM call`. The deepest level ("Raw LLM call") means fetching and displaying full LLM request/response payloads, which can be:
- 10-100KB per call (context window contents)
- Thousands of calls per execution
- Cannot be aggregated — must show raw data

Fetching raw LLM call data for a "drill-down to the bottom" will NOT return in <100ms if the data is in S3 cold storage.

### Minimum Fix

1. **Async drill-down at depth > 3**: For levels beyond squad → agent → execution, return a loading state and fetch asynchronously. Display a skeleton UI while data loads from warm/cold tiers.
2. **Paginate deep data**: Raw LLM calls paginated (25 per page). Cursor-based pagination for consistency.
3. **Pre-warm on hover**: When user hovers over an execution row, pre-fetch the node-level breakdown in background.
4. **SLA per depth level**: Depth 1-3: <100ms. Depth 4-5: <500ms. Depth 6+ (raw calls): <2s with loading indicator. Document this in UX spec.

---

## 🟡 WARNING-14: Dual Backend (Go + Python) Operational Complexity

> **Constraint Violated**: Maintainability — clean architecture / Operational Cost
> **Severity**: 🟡 WARNING

### The Problem

The tech stack uses `Go (Fiber)` for the main API and `Python FastAPI` for AI/ML pipelines. While justified technically (Go for performance, Python for ML ecosystem), the design doesn't address:
- **Inter-service communication**: How does Go call Python? HTTP? gRPC? Message queue?
- **Shared state**: Both services need access to the same database, cache, and message bus.
- **Deployment complexity**: Two different runtimes, dependency management systems, build pipelines, container images.
- **Schema sharing**: Data models defined once (Mermaid ER diagrams) must be implemented in both Go structs and Python Pydantic models. Risk of drift.
- **Error propagation**: How do errors in Python AI pipeline surface to users through the Go gateway?

Note: The `PROJECT.md` mentions "ML-powered cost forecasting — deferred to v2" under Out of Scope, yet Feature 3 (FinOps) designs ML-powered anomaly detection and cost forecasting in v1. This is a scope contradiction.

### Minimum Fix

1. **API Gateway pattern**: Go service is the sole external-facing API. Python service is internal only, called by Go via gRPC (not HTTP — lower overhead, typed contracts).
2. **Proto-first schema**: Define shared data structures in protobuf. Generate Go and Python code from same source.
3. **Async communication**: For non-latency-sensitive AI operations (anomaly detection, recommendations, forecasts), use Redis Streams / message queue. Go publishes tasks, Python consumes asynchronously.
4. **Resolve scope conflict**: Either remove ML-powered anomaly detection from v1 (aligning with PROJECT.md) or update PROJECT.md to include it. Don't ship conflicting documentation.

---

## 🔵 INFO-1: `system_prompt` Stored as Plaintext in `AGENT_DEFINITION`

> **Constraint Violated**: Security — intellectual property protection
> **Severity**: 🔵 INFO

System prompts are valuable IP for both platform-provided and marketplace agents. Storing them as plaintext `text` allows any database admin to read them. Consider encryption at rest for `system_prompt` and access-controlled retrieval (only the agent runtime should read the full prompt).

---

## 🔵 INFO-2: Meilisearch for Marketplace — Sync Strategy Needed

> **Constraint Violated**: Maintainability — data consistency
> **Severity**: 🔵 INFO

Marketplace search uses Meilisearch, but the design doesn't specify how PostgreSQL `marketplace_listings` data syncs to Meilisearch. Options: CDC via Debezium, application-level dual-write, or periodic full re-index. Dual-write risks inconsistency. CDC is recommended.

---

## 🔵 INFO-3: No Graceful Degradation Strategy for External LLM Provider Outages

> **Constraint Violated**: Reliability — 99.9% uptime, graceful degradation
> **Severity**: 🔵 INFO

The platform depends on external LLM providers (Anthropic, OpenAI, Google). If Anthropic is down, all Claude-based agents fail. The design should specify:
- LLM provider health monitoring
- Automatic model fallback (Claude → GPT-4 if Claude is unavailable, with user consent)
- Queue-and-retry for non-urgent tasks during outages
- SLA documentation (our 99.9% cannot exceed our dependencies' SLAs)

---

## 🔵 INFO-4: No API Versioning Strategy Beyond v1

> **Constraint Violated**: Maintainability — clean architecture
> **Severity**: 🔵 INFO

All endpoints are at `/api/v1/`. The design should document the API versioning strategy for breaking changes: URL versioning (current), header versioning, or content negotiation. Define deprecation policy (how long v1 is supported after v2 launches).

---

## 🔵 INFO-5: i18n Implementation Risk

> **Constraint Violated**: Maintainability
> **Severity**: 🔵 INFO

The design specifies `pt-BR default, en-US fallback. All strings via next-intl.` This is fine for the frontend, but the design doesn't address:
- API error messages (should they be localized?)
- Marketplace listing content (user-generated, multi-language?)
- CLI output language
- Email/notification templates

Recommend: API always returns English error codes + i18n keys. Frontend and CLI handle localization. Marketplace listings support multi-language descriptions.

---

## 🔵 INFO-6: No Health Check / Readiness Probe Endpoints

> **Constraint Violated**: Reliability — 99.9% uptime
> **Severity**: 🔵 INFO

No `/health`, `/ready`, or `/live` endpoints defined for the Go or Python services. These are required for Kubernetes liveness/readiness probes and load balancer health checks. Define:
- `/health` — basic liveness (process running)
- `/ready` — readiness (DB connected, Redis connected, dependencies healthy)
- `/metrics` — Prometheus-compatible metrics endpoint

---

## 🔵 INFO-7: No Database Migration Strategy

> **Constraint Violated**: Maintainability — clean architecture
> **Severity**: 🔵 INFO

The design defines 20+ tables across 7 features but doesn't mention database migration tooling. For Go: use `golang-migrate` or `Atlas`. For Python: `Alembic`. Ensure migrations are version-controlled, reversible, and tested in CI.

---

## 🔵 INFO-8: CLI Auth Token Storage Security

> **Constraint Violated**: Security
> **Severity**: 🔵 INFO

The CLI (`agentverse`) requires authentication but the design doesn't specify how tokens are stored locally. Avoid plaintext files. Use OS keychain integration (macOS Keychain, Windows Credential Manager, Linux Secret Service) or encrypted config files.

---

## 🔵 INFO-9: No Operational Cost Estimation

> **Constraint Violated**: Operational Cost
> **Severity**: 🔵 INFO

The design doesn't include any infrastructure cost estimation. For planning purposes, a rough estimate for the described architecture:

| Component | Estimated Monthly Cost |
|-----------|----------------------|
| PostgreSQL (managed, 4 vCPU, 16GB) | $200-400 |
| Redis (managed, 8GB) | $100-200 |
| Go API servers (2x 2vCPU) | $100-200 |
| Python API servers (2x 2vCPU) | $100-200 |
| Meilisearch (2GB) | $50-100 |
| S3 storage (1TB) | $25-50 |
| CDN (globe textures, static) | $20-50 |
| Load balancer | $20-40 |
| **Total (MVP, single region)** | **$615-1,240/month** |

This excludes LLM API costs (passed through to customer), monitoring (Datadog/Grafana), and CI/CD infrastructure. Cost-effective for MVP but should be documented in planning.

---

## Open Questions — Guardian Responses

Responding to the design's open questions from a constraint perspective:

| # | Question | Guardian Position |
|---|----------|-------------------|
| 1 | BYOA Protocol Priority | **MCP first** — simpler to implement, smaller attack surface. A2A adds enterprise auth complexity (mTLS, AgentCard validation). Ship MCP in Phase 1, A2A in Phase 2. |
| 2 | Boardroom Mode Customization | **WARNING**: Custom 3D models = arbitrary asset upload = XSS/malware vector. Only allow brand colors and logo (image, validated). No custom 3D models in v1. |
| 3 | DLQ Replay Authorization | **BLOCKER-adjacent**: DLQ replay MUST require `org_admin` role or higher. Financial flows could re-execute payments. Add `replay_requires_approval` flag per schedule. Audit log every replay. |
| 4 | Marketplace Revenue Split | No constraint concern. Business decision. |
| 5 | Observability Retention | Aligns with WARNING-12. Retention must be configurable per-org, not just per-tier. Enterprises need custom retention for compliance. |
| 6 | Canvas Collaboration | **WARNING**: Real-time multi-user editing (CRDT/OT) adds massive complexity. Defer to v2. Ship v1 with optimistic locking (last-write-wins with conflict notification). |
| 7 | Cost Estimation Pre-flight | Show confidence intervals, never guarantee. LLM output tokens are unpredictable. Estimate based on historical averages with ±30% confidence band. |

---

## Summary Table

| ID | Severity | Feature | Constraint | Summary |
|----|----------|---------|------------|---------|
| B-1 | 🔴 BLOCKER | All | Security (RLS) | No multi-tenant isolation defined anywhere |
| B-2 | 🔴 BLOCKER | All + 3D | Performance (<2s) | No bundle splitting for 500KB+ 3D assets |
| B-3 | 🔴 BLOCKER | All | Security (RBAC) | No auth/authz architecture for 100+ endpoints |
| B-4 | 🔴 BLOCKER | All | Security (Audit) | No platform-wide audit trail architecture |
| W-1 | 🟡 WARNING | 3D Command | Performance (60fps) | No LOD/degradation for 50+ agent 3D scenes |
| W-2 | 🟡 WARNING | FinOps | Performance (<100ms) | Cost aggregation on millions of rows |
| W-3 | 🟡 WARNING | All | Scalability (WS) | 5+ WebSocket channels per user, no multiplexing |
| W-4 | 🟡 WARNING | Observability | Security + Cost | Full I/O stored in traces, PII/storage risk |
| W-5 | 🟡 WARNING | Flow Canvas | Security | Arbitrary code execution, no sandbox |
| W-6 | 🟡 WARNING | Marketplace | Security | Security scan pipeline undefined |
| W-7 | 🟡 WARNING | Squad Builder | Reliability | Auto-scale has no circuit breaker |
| W-8 | 🟡 WARNING | BYOA | Reliability | Health check has no circuit breaker |
| W-9 | 🟡 WARNING | All | Maintainability | Excessive JSONB usage hurts queryability |
| W-10 | 🟡 WARNING | All | Performance | No caching strategy documented |
| W-11 | 🟡 WARNING | All | Reliability | No DB connection pooling or query timeout |
| W-12 | 🟡 WARNING | Observability | Scalability + Cost | Hot/warm/cold migration strategy incomplete |
| W-13 | 🟡 WARNING | FinOps | Performance | Unlimited drill-down conflicts with <100ms SLA |
| W-14 | 🟡 WARNING | All | Maintainability + Cost | Dual backend complexity not addressed |
| I-1 | 🔵 INFO | Squad/Market | Security | System prompts stored plaintext |
| I-2 | 🔵 INFO | Marketplace | Maintainability | Meilisearch sync strategy undefined |
| I-3 | 🔵 INFO | All | Reliability | No LLM provider failover strategy |
| I-4 | 🔵 INFO | All | Maintainability | No API versioning strategy |
| I-5 | 🔵 INFO | All | Maintainability | i18n coverage gaps (API, CLI, emails) |
| I-6 | 🔵 INFO | All | Reliability | No health check endpoints defined |
| I-7 | 🔵 INFO | All | Maintainability | No DB migration tooling specified |
| I-8 | 🔵 INFO | CLI | Security | CLI token storage security |
| I-9 | 🔵 INFO | All | Operational Cost | No infrastructure cost estimation |

---

## Recommended Next Steps

1. **IMMEDIATE** (before implementation starts):
   - Resolve all 4 BLOCKERs. Design cross-cutting architectures for: tenant isolation (RLS), authentication/RBAC, audit logging, and frontend bundle strategy.
   - These should be documented as a **"Non-Functional Architecture Addendum"** to the design.

2. **DURING DESIGN REFINEMENT**:
   - Address WARNINGs W-1 through W-14. Most require 1-2 paragraphs added to the relevant feature section.
   - Resolve the scope conflict: ML-powered anomaly detection is Out of Scope in PROJECT.md but designed in Feature 3.

3. **DURING IMPLEMENTATION PLANNING**:
   - Address INFOs. These are implementation details that should be captured in technical design docs per feature.

---

> **STATUS**: CONSTRAINT REVIEW COMPLETE
> **VERDICT**: 4 BLOCKERs prevent implementation. Design requires Non-Functional Architecture Addendum.
> **GUARDIAN**: Constraint Guardian Agent
> **DATE**: 2026-05-25T01:36:00Z
