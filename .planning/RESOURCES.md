# Resource Paths — Agent Reference

> **Purpose**: Every agent must know where skills, templates, and historical data live.  
> **Rule**: Use these resources BEFORE building from scratch.

---

## 1. Dashboard Templates & Data Skills
```
C:\VMs\Projetos\Web_MD_Viewer\dashboards_templates\data_skills\
```
- 59 files: dashboard design, visualization, layout patterns, analytics, UI/UX
- **5 production HTML dashboards** ready to reference:
  - `dashboard_qbr_personal.html` (104 KB) — Quarterly Business Review
  - `cashflow_dashboard.html` (56 KB) — Cash Flow Analysis
  - `dashboard_followup.html` (69 KB) — Task Follow-up
  - `Cost_Center_Dashboard.html` (46 KB) — Cost Center Analytics
  - `PnL_Dashboard.html` (25 KB) — Profit & Loss

---

## 2. Expert Skills Library
```
C:\VMs\Projetos\Web_MD_Viewer\data_expert_skills\
```
- **265 skill files** covering:

### Must-Use for AgentVerse
| Skill | File | Purpose |
|-------|------|---------|
| Multi-Agent Brainstorming | `multi-agent-brainstorming__SKILL.md` | Structured design review (5 agents) |
| Multi-Agent Architect | `multi-agent-architect__SKILL.md` | LangGraph/LangChain system design |
| Multi-Agent Patterns | `multi-agent-patterns__SKILL.md` | Production orchestration patterns |
| Agent Orchestrator | `agent-orchestrator__SKILL.md` | Core orchestrator design |
| Autonomous Agents | `autonomous-agents__SKILL.md` | Autonomous agent systems (31 KB!) |
| Agent Memory Systems | `agent-memory-systems__SKILL.md` | Memory architectures (32 KB!) |
| Dashboard Design | `dashboard-design__SKILL.md` | Dashboard methodology |
| AI Product | `ai-product__SKILL.md` | AI product design (21 KB) |
| Fortune 500 Dashboard | `fortune500-executive-dashboard.md` | Enterprise dashboard reference |
| Steve Jobs | `steve-jobs__SKILL.md` | Product vision methodology (28 KB!) |

### Also Available
- Agent tool building, evaluation, tracing, auditing
- Cloud architecture (AWS, GCP, multi-cloud)
- SaaS patterns (multi-tenant, MVP launcher)
- Visualization (Chart.js, D3.js, autoviz)
- Testing (TDD, integration, replay)

---

## 3. Orchestrator (Historical System)
```
C:\VMs\Projetos\Web_MD_Viewer\orchestrator\
```
- **server.js** (26 KB) — Node.js/Express orchestrator
- **core/dispatcher.js** (21 KB) — Priority queue, Jaccard dedup, heartbeat, quality gates
- **core/registry.js** (7 KB) — 17-agent hierarchy (4 tiers)
- **core/state.js** (12 KB) — State persistence + checkpoints
- **frontend/** — Next.js + TypeScript dashboard
- **agent-registry.json** — Opus 4.7 → Codex Leads → Codex Workers hierarchy
- **orchestrator-config.json** — Max 3 sub-agents, 1hr timeout, quality gates

---

## 4. Image Analysis Output
```
C:\VMs\Projetos\AgentVerse\docs\image_deep_dive\
```
- 6 completed batch reports (132 KB total)
- 1 batch in progress (Batch A — 27 images)

```
C:\VMs\Projetos\AgentVerse\docs\IMAGE_ANALYSIS_REF.md
```
- Master consolidated reference organized by 13 themes

```
C:\VMs\Projetos\AgentVerse\docs\RESOURCE_CATALOG.md
```
- Full catalog of all available resources

---

## 5. Project Source of Truth
```
C:\VMs\Projetos\AgentVerse\.planning\PROJECT.md
```
- Vision, requirements, constraints, key decisions
- The Three Commandments (ALL modes, Unlimited drill-down, No limitations)
- Technology stack decisions

---

*Read the resources before you build. Don't reinvent what exists.*
