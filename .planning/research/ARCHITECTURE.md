# Architecture Research — AgentVerse Command Center

> **Research Date:** 2026-05-24
> **Context:** Enterprise AI Agent Management + FinOps SaaS platform
> **References:** CrewAI, LangGraph, AutoGen, OpenCost, Cloudability, Finout architectures

---

## System Components

| Component | Purpose | Technology | Dependencies |
|-----------|---------|------------|-------------|
| **Web Application** | User-facing dashboard, 3D command center, executive views | Next.js 15 + shadcn/ui + Tailwind v4 | Auth Service, API Gateway |
| **3D Command Center** | Interactive globe with agent markers, connection arcs, cost heatmaps | React Three Fiber v9 + Globe.gl + Drei | WebSocket/SSE feeds, Agent Service |
| **Neural Topology View** | Force-directed graph of agent relationships and data flows | D3.js (force simulation) + React | Agent Service, Team Service |
| **API Gateway** | Unified entry point, rate limiting, tenant routing, auth verification | Go (custom) or Kong | Auth Service, all backend services |
| **Agent Management Service** | Agent CRUD, lifecycle management, health monitoring, squad coordination | Go | Database, AI Gateway, Event Bus |
| **AI Gateway (LLM Proxy)** | Vendor-agnostic routing to OpenAI/Anthropic/Google/Bedrock/Azure | LiteLLM (self-hosted) | Cost Metering, Agent Service |
| **FinOps Engine** | Cost tracking, optimization recommendations, budget enforcement | Python FastAPI | Database, Event Bus, AI Gateway |
| **FinOps Remediation** | Auto-throttle, auto-scale, auto-pause budget-exceeding agents | Go (worker) | Agent Service, FinOps Engine, Event Bus |
| **Billing Service** | Subscription management, usage metering, invoice generation | Stripe Billing API + Go adapter | Database, FinOps Engine |
| **Auth Service** | SSO (SAML/OIDC), SCIM provisioning, RBAC, session management | Keycloak | Database (dedicated) |
| **Tenant Service** | Workspace provisioning, tenant isolation, org hierarchy | Go | Database, Auth Service |
| **Marketplace Service** | Pre-built agent catalog, BYOA registration, deployment | Go | Agent Service, Database |
| **Notification Service** | Alert escalation, email/Slack/webhook notifications | Go (worker) | Event Bus, External APIs |
| **Audit Service** | Immutable audit trail of all actions, cost events, user operations | Go (consumer) | Event Bus, Database (append-only) |
| **Export Service** | PDF/CSV generation, scheduled executive summaries | Python (worker) | Database, Notification Service |
| **Event Bus** | Asynchronous event backbone for all inter-service communication | NATS JetStream | — (infrastructure) |
| **Cache Layer** | Session cache, hot data cache, rate limiting counters | Redis | — (infrastructure) |
| **Primary Database** | Multi-tenant data store with RLS | PostgreSQL (Supabase) | — (infrastructure) |
| **Blob Storage** | Agent artifacts, export files, user uploads | Supabase Storage / S3 | — (infrastructure) |

---

## Data Flow

### 1. Agent Execution Flow
```
User/Schedule → API Gateway → Agent Management Service → AI Gateway (LiteLLM)
                                                              ↓
                                                   OpenAI / Anthropic / Google / Bedrock
                                                              ↓
                                                   LiteLLM logs: tokens, cost, latency
                                                              ↓
                                              Event Bus (NATS) → FinOps Engine (aggregation)
                                                              ↓
                                              Budget Check → [OK] → Response to Agent
                                                           → [EXCEEDED] → Remediation Service
                                                                            ↓
                                                                   Auto-throttle/pause + Alert
```

### 2. Real-time Monitoring Flow
```
Agent Management Service → Event Bus (NATS JetStream)
        ↓                           ↓
  Agent status change       FinOps cost event
        ↓                           ↓
   SSE Gateway              SSE Gateway
        ↓                           ↓
   3D Globe (markers)       Cost Dashboard (charts)
   Neural Topology          Executive KPIs
   Activity Feed            Budget Alerts
```

### 3. Authentication + Tenant Resolution Flow
```
User Login → Keycloak (SAML/OIDC) → JWT with tenant_id + roles
        ↓
  API Gateway extracts JWT → Sets tenant context
        ↓
  All downstream services → PostgreSQL RLS enforces tenant_id
        ↓
  Every query automatically filtered by tenant
```

### 4. Billing Flow
```
FinOps Engine → Usage aggregation (per tenant/team/project)
        ↓
  Stripe Meters API → Real-time usage recording
        ↓
  Stripe Billing → Invoice generation (based on subscription tier + overages)
        ↓
  Webhooks → Billing Service → Update tenant entitlements
```

### 5. FinOps Cost Attribution Pipeline
```
LiteLLM (raw cost data) → NATS JetStream
        ↓
  FinOps Engine consumes events:
    1. Enrich with agent metadata (team, project, vendor)
    2. Aggregate by: agent / team / project / vendor / time
    3. Store in cost_events table (append-only, partitioned by month)
    4. Compare against budgets (soft/hard limits)
    5. Generate optimization recommendations
    6. Publish alerts/remediation events
```

---

## Suggested Build Order

### Phase 1: Foundation (Weeks 1-3)
| Priority | Component | Rationale |
|----------|-----------|-----------|
| 1.1 | **Database schema + RLS policies** | Everything depends on data layer; multi-tenant from day one |
| 1.2 | **Auth Service (Keycloak)** | Needed before any user-facing feature; RBAC foundation |
| 1.3 | **Tenant Service** | Workspace provisioning; tenant context middleware |
| 1.4 | **Next.js shell + Design System** | shadcn/ui + Indra Intelligence tokens; layout, navigation, i18n (pt-BR) |
| 1.5 | **API Gateway** | Unified entry point with auth verification + tenant routing |

### Phase 2: Core Agent Management (Weeks 4-6)
| Priority | Component | Rationale |
|----------|-----------|-----------|
| 2.1 | **Agent Management Service (CRUD)** | Core domain: create, read, update, delete agents |
| 2.2 | **AI Gateway (LiteLLM)** | Vendor-agnostic routing; cost metering at proxy level |
| 2.3 | **Hierarchical Org Chart** | Teams, roles, reporting lines — core UX differentiator |
| 2.4 | **Squad Management** | Senior → technician agent relationships with project budgets |
| 2.5 | **Event Bus (NATS JetStream)** | Foundation for all async communication |

### Phase 3: FinOps Engine (Weeks 7-10)
| Priority | Component | Rationale |
|----------|-----------|-----------|
| 3.1 | **FinOps Cost Tracking** | Real-time cost per agent/vendor/team/project — THE retention feature |
| 3.2 | **Budget Enforcement** | Hard/soft limits with alert escalation — core value prop |
| 3.3 | **FinOps Optimization** | Recommendations: model downsizing, caching, batching |
| 3.4 | **Automated Remediation** | Auto-throttle, auto-scale, auto-pause — competitive moat |
| 3.5 | **Executive Dashboard** | KPIs, trends, anomalies, "boardroom mode" |

### Phase 4: 3D Command Center (Weeks 11-13)
| Priority | Component | Rationale |
|----------|-----------|-----------|
| 4.1 | **3D Globe (basic)** | WebGL globe with agent markers and connection arcs |
| 4.2 | **Cost Heatmaps** | Overlay cost data on globe regions |
| 4.3 | **Neural Topology View** | Force-directed graph of agent relationships |
| 4.4 | **Real-time SSE feeds** | Live agent status, cost events streaming to 3D views |
| 4.5 | **Interactive Controls** | Hover/click details, programmatic camera, "boardroom mode" |

### Phase 5: Marketplace + Billing (Weeks 14-16)
| Priority | Component | Rationale |
|----------|-----------|-----------|
| 5.1 | **Stripe Billing integration** | Subscription tiers (Starter/Pro/Enterprise) |
| 5.2 | **Pre-built Agent Marketplace** | Curated agents ready to deploy |
| 5.3 | **BYOA (Bring Your Own Agent)** | Customer agent registration + management |
| 5.4 | **Audit Logging** | Complete trail — SOC2 readiness |
| 5.5 | **Export/Reports** | PDF, CSV, scheduled executive summaries |

### Phase 6: Enterprise Hardening (Weeks 17-20)
| Priority | Component | Rationale |
|----------|-----------|-----------|
| 6.1 | **SAML/SCIM enterprise SSO** | Full Keycloak enterprise features |
| 6.2 | **Performance optimization** | <2s render, 60fps 3D, <100ms API |
| 6.3 | **English (en-US) i18n** | Global expansion language |
| 6.4 | **On-prem deployment option** | Docker Compose / Helm chart for private cloud |
| 6.5 | **Load testing + security audit** | Enterprise readiness validation |

---

## Multi-Tenant Strategy

### Approach: Hybrid Pool/Silo Model

```
┌──────────────────────────────────────────────────┐
│                   API Gateway                     │
│     (JWT extraction → tenant_id resolution)       │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │ Starter/Pro │  │ Starter/Pro │  │Enterprise│ │
│  │  Tenant A   │  │  Tenant B   │  │ Tenant C │ │
│  └──────┬──────┘  └──────┬──────┘  └────┬─────┘ │
│         │                │               │        │
│  ┌──────▼────────────────▼──────┐  ┌────▼─────┐ │
│  │   Shared PostgreSQL (Pool)    │  │ Dedicated│ │
│  │   RLS: tenant_id on ALL rows  │  │ Database │ │
│  │   Schema: shared              │  │  (Silo)  │ │
│  └───────────────────────────────┘  └──────────┘ │
└──────────────────────────────────────────────────┘
```

### Implementation Details

#### 1. Tenant Context Layer
- Every HTTP request resolved to `tenant_id` via JWT claims
- Middleware sets PostgreSQL session variable: `SET app.current_tenant_id = '<uuid>'`
- All downstream queries automatically filtered by RLS policies

#### 2. Row-Level Security (Defense in Depth)
```sql
CREATE POLICY tenant_isolation ON agents
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

SELECT * FROM agents WHERE tenant_id = $1 AND status = 'active';
```

#### 3. Tier-Based Isolation
| Tier | Data Isolation | Compute Isolation | Custom Domain |
|------|---------------|-------------------|---------------|
| **Starter** | Shared DB + RLS | Shared compute | No |
| **Pro** | Shared DB + RLS | Shared compute (with resource quotas) | Optional |
| **Enterprise** | Dedicated DB (Silo) | Dedicated compute | Yes |

#### 4. Noisy Neighbor Prevention
- Resource quotas per tenant (API rate limits, concurrent agent limits)
- Tenant-aware monitoring (per-tenant latency, throughput, error rates)
- NATS JetStream subjects namespaced by tenant: `agentverse.{tenant_id}.events.*`

---

## Event Architecture

### Event-Driven Design (CQRS-Inspired)

```
┌─────────────────────────────────────────────────────────────┐
│                    COMMAND SIDE (Write)                       │
│                                                              │
│  Agent Service ──→ agent.created / agent.updated / ...       │
│  FinOps Engine ──→ cost.recorded / budget.exceeded / ...     │
│  Auth Service  ──→ user.login / role.changed / ...           │
│  Billing       ──→ subscription.upgraded / payment.failed    │
│                                                              │
│                    ↓ All events → NATS JetStream ↓           │
├─────────────────────────────────────────────────────────────┤
│                    QUERY SIDE (Read)                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ SSE Gateway   │  │ Audit Service │  │ FinOps Aggregator │  │
│  │ (real-time UI)│  │ (append-only) │  │ (cost rollups)    │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Notification  │  │ Remediation  │  │ Export/Reports    │  │
│  │ Service       │  │ Worker       │  │ Worker            │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Event Schema Standard
```json
{
  "id": "uuid-v7",
  "type": "agent.cost.recorded",
  "tenant_id": "uuid",
  "timestamp": "2026-05-24T19:30:00Z",
  "version": 1,
  "source": "finops-engine",
  "data": {
    "agent_id": "uuid",
    "vendor": "openai",
    "model": "gpt-4o",
    "tokens_input": 1500,
    "tokens_output": 800,
    "cost_usd": 0.0345,
    "team_id": "uuid",
    "project_id": "uuid"
  },
  "metadata": {
    "correlation_id": "uuid",
    "user_id": "uuid"
  }
}
```

### NATS JetStream Subject Hierarchy
```
agentverse.{tenant_id}.agents.created
agentverse.{tenant_id}.agents.updated
agentverse.{tenant_id}.agents.deleted
agentverse.{tenant_id}.agents.{agent_id}.status
agentverse.{tenant_id}.agents.{agent_id}.health
agentverse.{tenant_id}.cost.recorded
agentverse.{tenant_id}.cost.budget.warning
agentverse.{tenant_id}.cost.budget.exceeded
agentverse.{tenant_id}.cost.remediation.triggered
agentverse.{tenant_id}.billing.subscription.changed
agentverse.{tenant_id}.audit.*
```

### Key Event Patterns

#### 1. Budget Enforcement (Event-Driven)
```
cost.recorded → FinOps Engine checks budget thresholds
  → 80% consumed → cost.budget.warning → Notification Service → Slack/Email
  → 100% consumed (soft) → cost.budget.exceeded → Alert escalation
  → 100% consumed (hard) → cost.remediation.triggered → Remediation Worker
    → Agent auto-throttled/paused → agent.status.changed → SSE → Dashboard
```

#### 2. Real-time Dashboard Updates
```
Any agent/cost event → NATS → SSE Gateway → Browser EventSource
  → React state update → Recharts re-render / Globe.gl marker update
  Latency target: <500ms event-to-pixel
```

### Observability Strategy
| Pillar | Tool | Purpose |
|--------|------|---------|
| **Metrics** | Prometheus + Grafana | Service health, latency P50/P99, throughput |
| **Traces** | OpenTelemetry + Jaeger | Distributed tracing across Go/Python services |
| **Logs** | Structured JSON → Loki | Centralized log aggregation, tenant-aware filtering |
| **Events** | NATS monitoring | Consumer lag, DLQ depth, throughput per subject |

---

## Architecture Principles

1. **Server-First**: Default to React Server Components; hydrate only interactive "islands"
2. **Vendor-Agnostic**: LiteLLM abstracts all AI providers; never call vendor APIs directly
3. **Defense in Depth**: RLS + application-level tenant filtering + API gateway auth
4. **Event-Driven Core**: All state changes emit events; consumers react independently
5. **FinOps by Design**: Cost metering built into the AI Gateway layer, not bolted on
6. **Start Pool, Graduate Silo**: Shared infrastructure for small tenants; dedicated for enterprise
7. **Observability First**: OpenTelemetry traces from request entry to LLM response and back
8. **Immutable Audit**: Every action produces an auditable, append-only event record
9. **Progressive Enhancement**: SSE for monitoring, WebSocket only where bidirectional needed
10. **Build Order = Risk Order**: Foundation → Core → FinOps → 3D → Marketplace → Hardening
