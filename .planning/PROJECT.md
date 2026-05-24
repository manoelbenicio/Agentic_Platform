# AgentVerse Command Center

## What This Is

AgentVerse is an enterprise-grade SaaS platform for managing autonomous software entities — from LLM-powered AI agents (OpenAI, Anthropic, Google) to RPA bots and integration workers — through a vendor-agnostic command center. It provides hierarchical team management with an immersive 3D visualization layer and a full-stack FinOps engine with cost tracking, optimization, automated remediation, and budget enforcement. Designed for Fortune 500 enterprises, launching in the Brazilian market (Portuguese) with global English expansion.

## Core Value

**A CTO must see every agent, every cost, every risk — in one glance — and trust the platform to enforce budgets automatically.** If everything else fails, real-time cost visibility and budget enforcement across all agent vendors must work.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Agent CRUD — create, read, update, delete any agent type (LLM, RPA, custom)
- [ ] Vendor-agnostic gateway — route to OpenAI, Anthropic, Google, AWS Bedrock, Azure AI, custom endpoints
- [ ] Hierarchical org chart — agents organized in teams with roles, permissions, and reporting lines
- [ ] Squad management — senior agent leads N technician agents on a project with a budget
- [ ] 3D globe command center — interactive WebGL globe with agent markers, connection arcs, cost heatmaps
- [ ] Neural topology view — force-directed graph showing agent relationships and data flows
- [ ] Real-time agent monitoring — WebSocket-driven live status, health, and activity feeds
- [ ] FinOps cost tracking — real-time cost per agent, per vendor, per team, per project
- [ ] FinOps optimization — recommendations to reduce spend (model downsizing, caching, batching)
- [ ] FinOps automated remediation — auto-throttle, auto-scale, auto-pause agents exceeding budgets
- [ ] FinOps budget enforcement — hard and soft limits per team/project/org with alert escalation
- [ ] Subscription billing — 3-5 tiers (Starter/Pro/Enterprise) with Stripe integration
- [ ] Multi-tenant architecture — workspace isolation, row-level security, RBAC
- [ ] Enterprise SSO — SAML, OIDC, SCIM via Keycloak
- [ ] Executive dashboard — KPIs, trends, anomalies, "boardroom mode" for projector display
- [ ] Pre-built agent marketplace — curated agents ready to deploy
- [ ] BYOA (Bring Your Own Agent) — customers register and manage their own agents
- [ ] Audit logging — complete trail of agent actions, cost events, and user operations
- [ ] Portuguese (pt-BR) interface — primary language at launch
- [ ] Export/Reports — PDF, CSV, scheduled executive summaries

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Mobile native apps (iOS/Android) — web responsive first, native deferred to v2
- White-label / reseller features — enterprise-direct sales model, no reseller channel in v1
- Agent development IDE — platform manages agents, doesn't build them; use CrewAI/LangGraph externally
- ML-powered cost forecasting — deferred to v2; v1 focuses on rules-based optimization
- Air-gapped deployment — on-prem option supports private cloud, not fully air-gapped

## Context

### Market Position
The AI agent management space is fragmented. Tools like AgentOps, Helicone, LangSmith focus on observability; FinOps tools like Cloudability focus on cloud infra costs. No platform unifies agent lifecycle management with agent-specific FinOps. AgentVerse fills this gap.

### Prior Art
Web_MD_Viewer v1.0 Fortune 500 Modernization (completed 2026-05-22) established the Indra Intelligence design language — dark mode, glassmorphism, Inter + JetBrains Mono typography, premium dashboard patterns. AgentVerse inherits this visual DNA.

### Skills Arsenal
- **191 files** in `project_skills/` — agent orchestration, architecture, DevOps, security, prompt engineering
- **63 files** in `data_expert_skills/` — dashboards, visualization, UI/UX, design systems, Fortune 500 patterns
- Key skills: `fortune500-executive-dashboard`, `chartjs-d3-visualization-expert`, `shadcn-ui-expert`, `dashboard-design`, `saas-mvp-launcher`, `saas-multi-tenant`, `multi-agent-architect`, `cloud-architect`

### Technology Direction
Based on 5 architecture proposals evaluated:
- **Frontend:** Next.js 15 + shadcn/ui + Tailwind CSS v4 (custom design system)
- **3D Engine:** Three.js + React Three Fiber + Globe.gl
- **Charts:** D3.js custom + Recharts
- **Backend:** Hybrid — Go services (agent management) + Python FastAPI (FinOps ML)
- **Database:** PostgreSQL (Supabase for MVP) → CockroachDB (scale)
- **AI Gateway:** LiteLLM (vendor-agnostic proxy)

## Constraints

- **Agent limit**: Maximum 2 subagents per parallel operation — strict resource management
- **GSD protocol**: Every phase follows GSD workflow — no phase bypassing, no shortcuts
- **Visual standard**: Every screen must pass the "Boardroom Test" — Fortune 500 C-Level quality
- **Performance**: <2s initial render, 60fps on 3D views, <100ms API responses
- **Language**: Portuguese (pt-BR) primary, i18n architecture from day one for English expansion
- **Security**: SOC2-ready architecture even if certification is deferred
- **Delivery**: User approval required before each phase execution

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Enterprise-first target market | Higher contract value, longer LTV, justifies premium development | — Pending |
| Portuguese (pt-BR) first language | BR market entry strategy, competitive gap in local enterprise AI tools | — Pending |
| Hybrid deployment (SaaS + on-prem option) | Fortune 500 demands data sovereignty options | — Pending |
| Hierarchical org chart for agent teams | Enterprises think in org structures, not flat lists | — Pending |
| 3-5 subscription tiers (not usage-based) | Enterprise procurement prefers predictable pricing | — Pending |
| Full FinOps from v1 (not just tracking) | FinOps is the retention engine — tracking alone is commodity | — Pending |
| Hybrid agent model (pre-built + BYOA) | Maximum flexibility, marketplace creates network effects | — Pending |
| Next.js 15 + shadcn/ui frontend | Proven stack, premium component library, SSR for SEO | — Pending |
| Three.js + Globe.gl for 3D command center | Industry standard for WebGL globe visualization | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-24 after initialization*
