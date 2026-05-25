# AgentVerse — Brainstorming Final Decisions

> **Author**: Arbiter Agent (Orchestrator)  
> **Date**: 2026-05-25  
> **Status**: FINAL — Binding Design Contract  
> **Inputs**:
> - Designer: `BRAINSTORM_PHASE1_DESIGN.md` (120KB, 7 features, 7 cross-cutting concerns)
> - Skeptic: `BRAINSTORM_PHASE2_SKEPTIC.md` (40KB, 38 objections — 8 CRITICAL)
> - Guardian: `BRAINSTORM_PHASE2_GUARDIAN.md` (42KB, 4 BLOCKERS + 14 WARNINGS)
> - Advocate: `BRAINSTORM_PHASE2_ADVOCATE.md` (37KB, 37 usability concerns — 12 HIGH)
> - Expert Skills: 18 skills loaded (~210KB of distilled production knowledge)
> - Image Analysis: 101 images across 6 batches

---

## Executive Summary

The Designer produced an exceptionally ambitious 120KB design covering 7 features across 4 interaction modes. The reviewers collectively identified **113 concerns** — many overlapping on the same fundamental issues. After analysis, the concerns cluster into **5 core tensions** that this document resolves with binding decisions.

### The 5 Core Tensions

| # | Tension | Designer | Skeptic | Guardian | Advocate | Resolution |
|---|---------|----------|---------|----------|----------|------------|
| 1 | Scope vs Timeline | 7 features, 4 modes, 20 weeks | "Decacorn ambition, hackathon timeline" | "Cannot proceed without resolving BLOCKERs" | "No onboarding exists" | **CUT to 3 features + 2 modes for v0.1** |
| 2 | 3D Mode vs Reality | 3D Neural Command Center | "Won't run on enterprise hardware" | "3D assets blow >2s render budget" | "WebGL fails in boardrooms" | **DEFER 3D to v0.3** |
| 3 | Multi-tenancy | tenant_id mentioned but undesigned | "Completely undesigned" | "🔴 BLOCKER-1" | — | **Design first, code second** |
| 4 | Auth/Audit | Not designed | — | "🔴 BLOCKER-3, BLOCKER-4" | — | **Must be in Phase 0** |
| 5 | Usability | Happy path only | — | — | "No error states, no onboarding" | **Add onboarding + error states to Phase 1** |

---

## DECISION 1: Scope Reduction — v0.1 MVP

### APPROVED for v0.1 (12 weeks)

| Feature | Modes | Rationale |
|---------|-------|-----------|
| **F1: Agent Squad Builder** | Dashboard + API | Core value prop — create and manage agent teams |
| **F3: FinOps Command Center** | Dashboard + API | Revenue-critical — billing, cost tracking |
| **F4: Live Observability Matrix** | Dashboard + API + CLI | DevOps essential — heartbeats, logs, traces |

### DEFERRED to v0.2 (weeks 13-20)

| Feature | Reason for Deferral |
|---------|-------------------|
| **F2: Visual Flow Canvas** | Skeptic: "multi-year product disguised as one feature." Arbiter agrees — canvas + debugger + execution engine is 3 products. Defer to v0.2. |
| **F7: Intelligent Scheduling** | Skeptic: "Cron + event + DAG is 3 scheduling systems." Start with cron-only in v0.1, expand later. |

### DEFERRED to v0.3+

| Feature | Reason for Deferral |
|---------|-------------------|
| **F5: Agent Marketplace & BYOA** | Skeptic: "Marketplace is a regulated financial product (rev-sharing, dispute resolution)." Guardian: "BYOA security scanning undefined." Start BYOA-only in v0.2, marketplace in v0.3. |
| **F6: 3D Neural Command Center** | All 3 reviewers flagged this. Skeptic: "0% validated demand." Guardian: "Blows render budget." Advocate: "WebGL fails in boardrooms." Defer entirely. |

### Mode Reduction for v0.1

| Mode | v0.1 | v0.2 | v0.3 |
|------|------|------|------|
| Dashboard (Web UI) | ✅ | ✅ | ✅ |
| API (REST/WebSocket) | ✅ | ✅ | ✅ |
| CLI | ✅ (F4 only) | ✅ (all features) | ✅ |
| 3D Command Center | ❌ | ❌ | ✅ |

> **Skeptic objection resolved**: "4x mode multiplier" eliminated. v0.1 = 2 modes (Dashboard + API) + CLI for observability only.

---

## DECISION 2: Phase 0 — Architecture Foundation (Weeks 1-3)

**All 4 Guardian BLOCKERs must be resolved before ANY feature code.**

### BLOCKER-1: Multi-Tenant Isolation → RESOLVED

**Decision**: Implement PostgreSQL RLS + middleware tenant scoping as Week 1 priority.

| Component | Implementation |
|-----------|---------------|
| Database | RLS policy on every table: `USING (org_id = current_setting('app.current_org_id')::uuid)` |
| API Middleware | Extract `org_id` from JWT → `SET LOCAL app.current_org_id` per request |
| WebSocket | Validate tenant ownership on connection upgrade |
| Credentials | Envelope encryption via KMS for all stored secrets (`auth_config`, API keys) |
| CI Gate | Reject any migration missing `org_id` unless table is explicitly global |

### BLOCKER-3: Authentication/Authorization → RESOLVED

**Decision**: Clerk for auth (as per SaaS MVP Launcher skill) + custom RBAC.

| Component | Implementation |
|-----------|---------------|
| Auth Provider | Clerk (social login, MFA, session management) |
| RBAC | 4 roles: Owner → Admin → Member → Viewer |
| API Security | JWT validation middleware on every route |
| Feature Gates | Role-based feature access (e.g., FinOps = Admin+) |

### BLOCKER-4: Audit Trail → RESOLVED

**Decision**: Append-only audit log table, queryable via API.

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,  -- 'agent.created', 'squad.deployed', 'budget.exceeded'
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Immutable: no UPDATE or DELETE allowed
CREATE POLICY audit_append_only ON audit_log FOR INSERT WITH CHECK (true);
```

### BLOCKER-2: Bundle Strategy for Performance → RESOLVED

**Decision**: Lazy-load ALL heavy libraries. Dashboard-first architecture.

| Strategy | Implementation |
|----------|---------------|
| Code splitting | Next.js dynamic imports with `{ ssr: false }` for chart-heavy components |
| 3D assets | Not loaded in v0.1 at all (deferred to v0.3) |
| Charts | Recharts loaded per-page, not globally |
| Target | LCP < 2s on 4G (measured via Lighthouse CI) |
| Caching | CDN for static assets, Redis for API responses |

---

## DECISION 3: Onboarding & Error States (Advocate's Top Concern)

**Decision**: Every feature must design 4 states before implementation.

| State | Requirement |
|-------|-------------|
| **Empty** | Illustration + "Create your first agent" CTA + guided wizard link |
| **Loading** | Skeleton loaders matching final layout shape |
| **Error** | Error type, message, retry button, support link |
| **Success** | Confirmation toast + next action suggestion |

### Onboarding Flow (New User → First Value in <5 min)

```
1. Sign up (Clerk) → Select plan
2. Welcome wizard: "What do you want to build?"
   → Option A: "Monitor my existing agents" → Import flow
   → Option B: "Create a new AI agent team" → Squad builder
   → Option C: "Track AI costs" → FinOps setup
3. Guided creation of first agent (with template gallery)
4. First successful agent run = confetti + "You're live!" 🎉
5. Dashboard populated with real data
```

---

## DECISION 4: Accessibility Requirements (Non-Negotiable)

**Decision**: WCAG 2.2 AA compliance mandatory for every component.

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | ≥4.5:1 for all text. Fix `--text-muted` (Advocate flagged 3.6:1 → must be ≥4.5:1) |
| Color-independence | ALL status indicators use color + icon + text label |
| Keyboard nav | Tab order, Enter/Space activation, Escape to close |
| Drag-and-drop | Keyboard alternative for all drag operations (arrow keys + Enter) |
| Focus indicators | 3px visible outline on all focusable elements |
| Touch targets | Minimum 44x44px |
| Screen readers | ARIA labels, live regions for dynamic content |
| Reduced motion | `prefers-reduced-motion` media query respected |
| CI Gate | axe-core audit in CI — zero critical violations to merge |

---

## DECISION 5: Localization — pt-BR First

**Decision**: Brazilian Portuguese is default, not an afterthought.

| Issue (Advocate) | Resolution |
|-----------------|------------|
| Military jargon ("Squad", "Commander") | Use "Equipe" / "Líder" in pt-BR, keep English in EN mode |
| USD examples ($4,231) | Default currency: R$ with `.` thousand separator, `,` decimal |
| Number formatting | `R$ 16.699.051,62` in pt-BR, `$16,699,051.62` in EN |
| i18n framework | `next-intl` with locale-aware date/number formatting |
| Launch market | Brazil first → English second |

---

## DECISION 6: Technical Architecture Simplification

### Skeptic Concern: Go + Python dual backend is over-engineering

**Decision**: Go single backend for v0.1. Python for ML/analysis workers only when needed in v0.2+.

| v0.1 | v0.2+ |
|------|-------|
| Go (Fiber) — API, WebSocket, auth, CRUD | Go (Fiber) — same |
| PostgreSQL + Redis | + Python workers for ML scoring, anomaly detection |
| Next.js 14+ frontend | + Python FastAPI microservice for advanced analytics only |

### Guardian Concern: No caching strategy

**Decision**: 3-tier caching.

| Tier | What | TTL |
|------|------|-----|
| Browser | Static assets (JS, CSS, images) | 1 year (hashed filenames) |
| CDN | API responses for read-heavy endpoints | 30s-5min |
| Redis | Session data, real-time metrics, WebSocket state | 5min-1hr |

### Guardian Concern: JSONB overuse

**Decision**: Structured columns for queried fields. JSONB only for truly dynamic metadata.

```
✅ config JSONB          — dynamic, rarely queried by field
❌ budget_policy JSONB   — MUST be structured columns (daily_limit, alert_threshold, etc.)
❌ capabilities JSONB    — MUST be a proper capabilities table with FK
```

---

## DECISION 7: Revised Timeline — 3 Phases

### Phase 0: Foundation (Weeks 1-3)
- [ ] Multi-tenant architecture (RLS + middleware)
- [ ] Authentication (Clerk integration)
- [ ] Audit trail system
- [ ] Database schema with migrations (Alembic/golang-migrate)
- [ ] CI/CD pipeline (lint → type-check → test → build → deploy)
- [ ] Design system setup (shadcn/ui + design tokens)
- [ ] Onboarding flow wireframes

### Phase 1: Core Features (Weeks 4-10)
- [ ] F1: Agent Squad Builder (Dashboard + API)
- [ ] F3: FinOps Command Center (Dashboard + API)
- [ ] F4: Live Observability Matrix (Dashboard + API + CLI)
- [ ] Onboarding wizard
- [ ] All 4 states per feature (empty/loading/error/success)
- [ ] pt-BR localization
- [ ] WCAG 2.2 AA audit

### Phase 2: Expansion (Weeks 11-16)
- [ ] F2: Visual Flow Canvas (Dashboard + API)
- [ ] F7: Scheduling Engine (cron-only first)
- [ ] BYOA (bring your own agent — no marketplace yet)
- [ ] CLI mode for all features
- [ ] Stripe billing integration

### Phase 3: Premium (Weeks 17-24)
- [ ] F5: Agent Marketplace
- [ ] F6: 3D Neural Command Center
- [ ] Advanced ML features (anomaly detection, cost prediction)
- [ ] Python analysis workers
- [ ] Enterprise SSO (SAML/OIDC)

---

## DECISION 8: Open Questions Resolved

| # | Question | Decision |
|---|----------|----------|
| 1 | Go vs Node.js for backend? | **Go (Fiber)** — performance, concurrency. Node only if team prefers. |
| 2 | Which LLM gateway? | **LiteLLM** — open-source, 100+ providers, self-hosted. |
| 3 | Hosting? | **Vercel (frontend)** + **Railway/Fly.io (Go backend)** + **Supabase (PostgreSQL)**. Scale to AWS/GCP at enterprise. |
| 4 | 3D library? | **Deferred to v0.3.** When implemented: Three.js + React Three Fiber, lazy-loaded. |
| 5 | Pricing model? | **3 tiers for launch**: Free (3 agents), Pro R$197/mo (25 agents), Enterprise (custom). Reduce from 5 to 3 per Skeptic. |
| 6 | CLI framework? | **Cobra (Go)** with JSON/table output modes. |
| 7 | Monitoring? | **Sentry (errors)** + **PostHog (analytics)** + **Upstash (rate limiting)**. |
| 8 | State management? | **Zustand** (global) + **React Query** (server state). |
| 9 | Should marketplace have revenue sharing? | **Not in v0.1-v0.2.** v0.3 marketplace starts with free listings only. Rev-sharing requires legal review. |
| 10 | How to handle Agent failures in production? | **Circuit breaker pattern**: 3 failures in 60s → circuit opens → health check every 30s → auto-recover. Alert via WebSocket + email. |

---

## DECISION 9: What We're NOT Building

| Excluded | Reason |
|----------|--------|
| Image-to-flow "napkin sketch" upload | Skeptic: "Research-grade feature" — YAGNI |
| TMUX-style split terminal views | Skeptic: "Years of TUI work" — basic CLI first |
| ML anomaly detection in v0.1 | Guardian: contradicts PROJECT.md out-of-scope |
| Revenue sharing marketplace | Skeptic: "Regulated financial product" — legal review needed |
| Database-per-tenant isolation | Too complex for <1000 tenants; shared-schema + RLS |
| Real-time 3D globe | Deferred to v0.3 with WebGL capability detection fallback |
| Auto-healing agents | Skeptic: "Risks cascading failures" — manual restart + alerting for v0.1 |

---

## DECISION 10: Success Metrics for v0.1

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | >90 | CI pipeline on every PR |
| WCAG AA Compliance | 0 critical violations | axe-core in CI |
| API Response Time | p95 < 200ms | PostHog + Sentry |
| Test Coverage | >80% | Jest/Vitest + Go test |
| Onboarding completion | >60% of signups complete first agent | PostHog funnel |
| Time to first value | <5 minutes | User testing |
| Uptime | 99.5% (v0.1 target) | Uptime monitoring |

---

## Summary: Before vs After Arbitration

| Dimension | Designer (Before) | Arbiter (After) |
|-----------|-------------------|-----------------|
| Features in v0.1 | 7 | **3** (F1, F3, F4) |
| Interaction modes | 4 (all features) | **2** (Dashboard + API) + CLI for F4 |
| Timeline | 20 weeks | **10 weeks** for v0.1, 24 weeks for all |
| 3D Command Center | Phase 1 | **Phase 3** (v0.3) |
| Marketplace | Phase 2 | **Phase 3** (v0.3) |
| Multi-tenancy | Mentioned | **Designed + Phase 0** |
| Auth/Audit | Missing | **Phase 0 blocker** |
| Onboarding | Missing | **Phase 1 requirement** |
| Error states | Missing | **Mandatory for every feature** |
| Pricing tiers | 5 | **3** |
| Backend | Go + Python | **Go only** (v0.1) |
| 3D bundle size | Unaddressed | **Lazy-loaded, v0.3 only** |

---

> **This document is the binding design contract. All implementation must follow these decisions.**
> 
> Next step: Create detailed Phase 0 implementation plan with task breakdown.
