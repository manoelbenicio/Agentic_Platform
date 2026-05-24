# Research Summary — AgentVerse Command Center

> **Synthesized:** 2026-05-24
> **Sources:** STACK.md, ARCHITECTURE.md, FEATURES.md, PITFALLS.md, DESIGN_BRIEF.md

---

## Key Findings

### 1. Market Gap Confirmed
No platform unifies **AI agent lifecycle management** with **agent-specific FinOps**. Tools like AgentOps/Helicone focus on observability; Cloudability/Kubecost focus on infra costs. AgentVerse sits in the intersection — a validated whitespace.

### 2. Stack Confidence: HIGH
All recommended technologies are production-proven in 2026:
- **Next.js 15** (Turbopack default, PPR stable, React 19)
- **shadcn/ui** (50+ components, registry model)
- **Tailwind v4** (Rust-based Oxide engine, 5-100x faster)
- **React Three Fiber v9** (WebGPU + React 19)
- **LiteLLM** (100+ vendors, open-source, self-hosted)
- **Supabase** (PostgreSQL + RLS + Auth + Realtime)
- **Keycloak** (SAML + OIDC + SCIM, no feature gating)

### 3. Build Order = Risk Order
Foundation → Agent CRUD → FinOps → 3D → Marketplace → Hardening

### 4. Top 5 Risks to Mitigate
| # | Risk | Phase |
|---|------|-------|
| 1 | Cross-tenant data leakage | Phase 1 (RLS from day one) |
| 2 | Vendor API key exposure | Phase 1 (envelope encryption) |
| 3 | Runaway agent costs | Phase 2 (synchronous budget enforcement) |
| 4 | 3D globe on enterprise hardware | Phase 3 (GPU detection + fallback) |
| 5 | Building before validating | Phase 1 (design partners ASAP) |

### 5. Competitive Positioning
| Dimension | AgentVerse | Nearest Competitor | Gap |
|-----------|-----------|-------------------|-----|
| Agent org chart | Hierarchical teams + squads | None (flat lists only) | **Unique** |
| 3D command center | WebGL globe + neural topology | None | **Unique** |
| FinOps automated remediation | Auto-throttle/pause/scale | LiteLLM (block only) | **Stronger** |
| Portuguese (pt-BR) | Primary language | All English-first | **First mover** |
| Vendor-agnostic | 100+ via LiteLLM | Portkey (1600+ models) | Parity |
| Cost tracking | Per-agent/team/project | Helicone, AgentOps | Parity |

---

## Actionable Recommendations for Roadmap

### Must-Do in Phase 1 (Foundation)
- [ ] PostgreSQL RLS policies on ALL tables
- [ ] i18n framework (next-intl) with pt-BR primary
- [ ] Design system tokens from DESIGN_BRIEF.md
- [ ] Envelope encryption for vendor API keys
- [ ] 8px grid system + Atomic Design component architecture

### Must-Do in Phase 2 (Core)
- [ ] LiteLLM integration with synchronous budget enforcement
- [ ] CQRS pattern: separate write/read paths for FinOps data
- [ ] SSE for dashboard monitoring (not WebSocket)
- [ ] Pre-aggregate cost data into hourly/daily/monthly rollup tables

### Must-Do in Phase 3 (Visualization)
- [ ] GPU capability detection + 2D fallback
- [ ] On-demand rendering (not 60fps loop)
- [ ] `InstancedMesh` for agent markers
- [ ] Test on Intel UHD 630 + Apple M1

### Defer to v2
- ML-powered cost forecasting
- Air-gapped deployment
- Mobile native apps
- Open marketplace submissions (curated only in v1)

---

## Design System Summary (from DESIGN_BRIEF.md)

| Token | Value |
|-------|-------|
| **Background** | `#0F1117` (primary), `#1A1D2E` (secondary), `#242840` (tertiary) |
| **Text** | `#F0F1F5` (primary), `#8B8FA3` (secondary), `#5C5F73` (tertiary) |
| **Status** | Green `#10B981`, Amber `#F59E0B`, Red `#EF4444`, Blue `#3B82F6` |
| **Font** | Inter (display), JetBrains Mono (code) |
| **Grid** | 12-column, 8px base spacing, 140px row min height |
| **KPI Hero** | 48px, weight 800, letter-spacing -0.03em, gradient text |
| **Animation** | 300ms ease-out default, max 20 simultaneous |

---

*Research phase complete. Ready for REQUIREMENTS.md → ROADMAP.md.*
