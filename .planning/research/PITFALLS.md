# Pitfalls Research — AgentVerse Command Center

> Research conducted: 2026-05-24
> Sources: Industry reports, SaaS architecture guides, FinOps Foundation, WebGL performance analysis, enterprise SSO documentation

---

## Critical Pitfalls (Will Kill the Project)

### CP-1: Cross-Tenant Data Leakage
**Risk:** A single bug exposes one customer's agent data, costs, or API keys to another tenant. For enterprise Fortune 500 customers, this is an immediate contract termination and potential lawsuit.

**Warning Signs:**
- Queries without `tenant_id` filtering in code reviews
- Cache keys without tenant namespace (Redis)
- Background jobs/queues not carrying tenant context
- Predictable, non-scoped resource IDs (`/agents/123` instead of `/workspaces/{ws_id}/agents/{id}`)

**Prevention Strategy:**
- Enforce PostgreSQL Row-Level Security (RLS) policies on ALL tables from day one
- Tenant context injected at middleware layer, never at query level
- Cache keys MUST include `tenant_id` prefix: `cache:tenant:{id}:resource:{id}`
- Automated cross-tenant penetration tests in CI/CD pipeline
- Composite keys: all resource IDs scoped to workspace

**Phase to Address:** Phase 1 — Foundation. Cannot be retrofitted.

---

### CP-2: Vendor API Key Exposure
**Risk:** AgentVerse stores customer API keys for OpenAI, Anthropic, Google, etc. If these leak, customers face unlimited financial liability on THEIR accounts.

**Warning Signs:**
- API keys stored in plaintext in database
- Keys visible in logs, traces, or error messages
- Keys passed through frontend JavaScript
- No key rotation mechanism

**Prevention Strategy:**
- Encrypt all API keys at rest with per-tenant encryption keys (envelope encryption)
- Never log, trace, or display full API keys — show only last 4 characters
- Keys stored in dedicated secrets table with separate access controls
- Key rotation support from v1
- HSM or cloud KMS integration for key management

**Phase to Address:** Phase 1 — Foundation. Critical security architecture.

---

### CP-3: Runaway Agent Costs Without Enforcement
**Risk:** An agent enters an infinite loop or processes a massive context window, running up thousands of dollars in LLM API costs in minutes. If AgentVerse's budget enforcement has gaps, customers blame the platform.

**Warning Signs:**
- Budget checks only at request start, not during streaming
- No per-minute/per-hour rate limiting (only monthly budgets)
- Budget enforcement is async (checks after the fact, not before)
- No circuit breaker on individual agents

**Prevention Strategy:**
- Budget enforcement at the gateway (LiteLLM proxy) level — synchronous, before the request hits the vendor
- Multi-level budgets: per-request token limit, per-hour rate limit, daily/monthly budget caps
- Circuit breaker pattern: auto-pause agent after N consecutive errors or cost anomalies
- Real-time WebSocket alerts on budget threshold crossings (50%, 75%, 90%, 100%)
- "Kill switch" — ability to instantly halt all agents in a workspace

**Phase to Address:** Phase 2 — Core FinOps. Must be production-ready before first customer.

---

### CP-4: WebSocket Connection Exhaustion at Scale
**Risk:** The real-time monitoring dashboard maintains persistent WebSocket connections per user. At enterprise scale (hundreds of concurrent users per org), the server runs out of file descriptors or memory, causing cascading failures.

**Warning Signs:**
- Server memory growing linearly with connected users
- "Zombie" connections not being cleaned up after browser tab closes
- No connection pooling or multiplexing
- Sticky sessions required but not configured at load balancer

**Prevention Strategy:**
- Use Server-Sent Events (SSE) for unidirectional dashboard updates instead of full WebSocket
- If WebSocket needed, implement Redis Pub/Sub backplane for cross-server message distribution
- Aggressive heartbeat/ping-pong with automatic zombie connection pruning
- Connection limits per tenant to prevent noisy-neighbor monopolization
- Monitor active connections, memory per connection, and message throughput as first-class metrics

**Phase to Address:** Phase 2 — Real-time infrastructure.

---

### CP-5: Building Everything Before Validating Anything
**Risk:** Spending months building the 3D globe, marketplace, and advanced FinOps without validating that enterprises will actually pay for agent management. The platform launches fully built but with zero customers.

**Warning Signs:**
- No customer interviews or LOIs (Letters of Intent) before Phase 3
- Feature roadmap driven by "what's cool" rather than "what's painful"
- No usage analytics or telemetry to measure feature adoption
- Entire team focused on building, zero effort on design partners

**Prevention Strategy:**
- Identify 3-5 design partner companies (Brazilian enterprises with AI agents) before Phase 2
- Ship a "walking skeleton" (agent CRUD + cost tracking + basic dashboard) to design partners ASAP
- Measure: Do partners check cost dashboards daily? Do they set budgets? Do they add agents?
- Kill features with zero adoption before investing more engineering time

**Phase to Address:** Phase 1 — Validate core value before building premium features.

---

## Serious Pitfalls (Will Delay Significantly)

### SP-1: Enterprise SSO Integration Underestimation
**Risk:** SSO "works with Okta" but fails with Azure AD, Google Workspace, or customer's custom LDAP. Each enterprise IdP interprets SAML/OIDC differently, requiring weeks of debugging per customer.

**Warning Signs:**
- Only testing with one IdP
- Hardcoded attribute mappings
- No support for IdP-initiated flow
- Certificate expiration with no rotation process

**Prevention Strategy:**
- Use Keycloak as the abstraction layer — all IdP-specific complexity lives in Keycloak config, not app code
- Build flexible attribute mapping engine configurable per tenant
- Support BOTH SP-initiated and IdP-initiated SSO flows
- Implement 3-5 minute clock skew tolerance
- Build SAML assertion decoder in admin panel for debugging
- SCIM: Handle PATCH operations, group sync, and deprovisioning

**Phase to Address:** Phase 3 — Enterprise features. Budget 3-4x the estimated time.

---

### SP-2: 3D Globe Performance on Enterprise Hardware
**Risk:** The stunning Three.js globe runs at 60fps on a developer's RTX 4090 but at 8fps on the CTO's corporate laptop with integrated Intel graphics. The "boardroom test" fails in the actual boardroom.

**Warning Signs:**
- Only testing on high-end development machines
- No GPU capability detection or fallback
- Memory growing over time (WebGL memory leaks — no `.dispose()` calls)
- Draw call count exceeding 500+
- Textures not using power-of-two dimensions

**Prevention Strategy:**
- Implement GPU capability detection at initialization — auto-fallback to 2D map for low-end hardware
- Use `InstancedMesh` for agent markers (one draw call for thousands of markers)
- Manual `.dispose()` on ALL geometries, materials, and textures when updating data
- On-demand rendering — only re-render when data changes or user interacts
- `IntersectionObserver` to pause rendering when canvas is off-screen
- Test on: Intel UHD 630, Apple M1 integrated GPU, and basic enterprise laptops
- LOD (Level of Detail) system: reduce detail for distant elements

**Phase to Address:** Phase 3 — Visualization. Must be prototyped early.

---

### SP-3: Real-Time Cost Data Accuracy
**Risk:** Cost tracking shows $47.32 but the actual OpenAI bill is $52.18. If the numbers don't match vendor invoices, enterprise finance teams will never trust the platform.

**Warning Signs:**
- Using hardcoded token prices instead of fetching from providers
- Not accounting for prompt vs. completion token pricing differences
- Missing cost for embeddings, image generation, audio, or fine-tuned models
- Timezone mismatches in cost aggregation vs. provider billing cycles

**Prevention Strategy:**
- Maintain a frequently-updated pricing table for all models across all providers
- Support custom pricing overrides per tenant (for negotiated enterprise rates)
- Display "estimated" label on real-time costs; provide reconciliation tools
- Track cost at the gateway level (intercept token counts from provider responses)
- Include ALL cost dimensions: input tokens, output tokens, cached tokens, tool use, image generation
- Build a "cost reconciliation" report that customers can compare against vendor invoices

**Phase to Address:** Phase 2 — FinOps core. Accuracy must be validated.

---

### SP-4: Database Performance Under FinOps Query Load
**Risk:** The FinOps dashboard runs complex aggregation queries against a hot transactional database. At scale, these queries lock tables and degrade the entire platform.

**Warning Signs:**
- Dashboard queries taking >2 seconds
- `SELECT SUM(cost) ... GROUP BY agent_id, DATE(created_at)` running against primary DB
- No materialized views or pre-aggregated tables
- No read replicas

**Prevention Strategy:**
- CQRS pattern: separate write path from read path
- Pre-aggregate cost data into rollup tables (hourly, daily, monthly) via background jobs
- Use TimescaleDB or materialized views for time-series cost data
- Read replicas for all dashboard queries
- Implement query timeouts — no dashboard query should exceed 500ms
- Cache dashboard results with short TTL (30-60 seconds)

**Phase to Address:** Phase 2 — Data architecture.

---

### SP-5: Stripe Billing State Synchronization
**Risk:** Customer upgrades from Pro to Enterprise in Stripe, but the app still shows Pro features. Or worse: customer's payment fails, Stripe knows but the app doesn't.

**Warning Signs:**
- Subscription status stored in app database updated via API polling (not webhooks)
- No idempotent webhook handler
- Hardcoded price IDs in application code

**Prevention Strategy:**
- Stripe is source of truth for billing; app database is a cache updated ONLY via webhooks
- Implement ALL critical webhook events
- Idempotent webhook handler — use event IDs to prevent duplicate processing
- Decouple billing from entitlements
- Enable Stripe Smart Retries and automated dunning emails

**Phase to Address:** Phase 3 — Billing. Design entitlement system in Phase 1.

---

### SP-6: i18n as an Afterthought
**Risk:** The app is built in English, then "translated" to Portuguese. Result: truncated labels, broken layouts, and a "Frankenstein" experience that destroys credibility in the Brazilian market.

**Warning Signs:**
- Hardcoded strings anywhere in the codebase
- UI designed with fixed-width English text
- No translation key system from the start

**Prevention Strategy:**
- Externalize ALL strings from day one using next-intl
- Design all UI components with flexible text containers (no fixed widths)
- Portuguese (pt-BR) is the PRIMARY locale — develop in pt-BR first, English second
- Localize ALL touchpoints: UI, emails, PDFs, error messages, Stripe receipts
- Use `,` (comma) as decimal separator and `.` (dot) as thousands separator for pt-BR
- Date format: DD/MM/YYYY for pt-BR (not MM/DD/YYYY)

**Phase to Address:** Phase 1 — Architecture. i18n framework must be first dependency installed.

---

## Minor Pitfalls (Will Cause Rework)

### MP-1: Noisy Neighbor in Shared Infrastructure
**Risk:** One enterprise tenant with 10,000 agents monopolizes database connections, WebSocket slots, and API gateway bandwidth.

**Prevention Strategy:**
- Per-tenant rate limiting at API gateway
- Per-tenant database connection pools
- Background job queues with tenant-fair scheduling
- Tenant-level metrics and alerts

**Phase to Address:** Phase 2 — Infrastructure.

---

### MP-2: Agent Marketplace Curation Chaos
**Risk:** The marketplace fills with low-quality or broken agents that damage platform credibility.

**Prevention Strategy:**
- Curated marketplace only in v1 — team-vetted agents, no open submissions
- Sandboxed execution environment for all marketplace agents
- Version pinning — customers choose when to upgrade
- Automated security scanning on marketplace agent code

**Phase to Address:** Phase 4 — Marketplace.

---

### MP-3: Dashboard "Chart Soup"
**Risk:** The executive dashboard becomes a wall of 30+ charts with no hierarchy, narrative, or actionable insight.

**Prevention Strategy:**
- Design dashboards around decisions, not data
- Use progressive disclosure: top-level KPIs → drill-down details
- Maximum 5-7 top-level metrics on the executive dashboard
- Every chart must answer: "So what?" and "Now what?"
- Boardroom mode: ultra-simplified view with 3-4 key numbers
- Test with actual executives

**Phase to Address:** Phase 2 — Dashboard design.

---

### MP-4: Overengineering the Agent Type System
**Risk:** Building a complex type system leads to deep abstraction layers that are hard to debug.

**Prevention Strategy:**
- Start with a simple, flat agent model: `{id, name, type, config, status, team_id}`
- Use `type` as an enum (LLM, RPA, CUSTOM) with `config` as a flexible JSON field
- Same CRUD endpoints for all agent types — differentiate through config schema
- Add complexity only when you have 3+ concrete examples requiring it

**Phase to Address:** Phase 1 — Data model design.

---

### MP-5: Ignoring Go + Python Service Boundary
**Risk:** The hybrid backend evolves unclear boundaries. Features bounce between services, creating circular dependencies.

**Prevention Strategy:**
- Define clear service contracts via API schemas (OpenAPI) in Phase 1
- Go service owns: Agent CRUD, gateway routing, real-time monitoring, WebSocket/SSE
- Python service owns: Cost aggregation, optimization recommendations, ML pipelines (v2)
- Shared concerns handled by infrastructure layer (API gateway, middleware)
- Each service has its own database schema — no shared tables
- Event-driven communication between services

**Phase to Address:** Phase 1 — Architecture.

---

## Domain-Specific Gotchas

### DG-1: LLM Provider API Inconsistencies
- OpenAI returns `usage.prompt_tokens`; Anthropic returns `usage.input_tokens`
- AWS Bedrock wraps responses in a different envelope format
- Streaming response formats differ completely across providers
- Some providers don't return token counts in streaming mode

**Mitigation:** Lean heavily on LiteLLM for normalization. Extend with AgentVerse middleware.

---

### DG-2: Keycloak Operational Complexity
- Keycloak upgrades can break realm configurations
- Theme customization uses FreeMarker templates — fragile
- SCIM support via extensions (not native)
- High memory footprint (~512MB-1GB minimum)

**Mitigation:** Consider Auth.js for MVP, add Keycloak when first enterprise SSO customer demands it.

---

### DG-3: Globe.gl + React Three Fiber Integration Friction
- Globe.gl creates its own scene, camera, and renderer internally
- React Three Fiber expects to own the canvas and scene graph
- Combining both requires careful architecture

**Mitigation:** Use Globe.gl standalone for globe view AND R3F for other 3D views (separate canvases), or build globe from scratch using R3F + custom shaders.

---

### DG-4: FinOps "Dashboard Fatigue" Syndrome
- Teams check the dashboard once and never return
- Cost data without context is meaningless
- Recommendations without automation require human action that doesn't happen

**Mitigation:** Auto-remediation is key. Anomaly detection. Push alerts to Slack/Teams. Gamification: team cost leaderboards, savings streaks.

---

### DG-5: The "God Agent" Anti-Pattern
- A single agent consuming 80% of a team's budget
- Context window bloat leading to exponential cost growth

**Mitigation:** Build agent health scoring. Warn on high token consumption. Suggest splitting into specialized agents.

---

### DG-6: Brazilian Enterprise Procurement Cycles
- Nota Fiscal (NF-e) electronic invoice is legally required — Stripe alone won't suffice
- Brazilian data residency requirements (LGPD) may require in-country data storage
- Payment in BRL with different credit card installment expectations
- Contract approval cycles average 60-120 days

**Mitigation:** Partner with Brazilian billing provider (Pagar.me, Asaas) for NF-e. Deploy in AWS sa-east-1 or GCP southamerica-east1. Plan for 90-day sales cycles.
