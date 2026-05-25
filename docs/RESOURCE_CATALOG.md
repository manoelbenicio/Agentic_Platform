# AgentVerse — Resource Catalog

> All available skills, templates, and historical data for the brainstorming & design phases.

---

## 1. Dashboard Templates & Data Skills
**Path**: `C:\VMs\Projetos\Web_MD_Viewer\dashboards_templates\data_skills\`

| Category | Key Files | Purpose |
|----------|-----------|---------|
| Dashboard Design | `dashboard-design__SKILL.md`, `dashboard-playbook__SKILL.md` | Structured dashboard design workflows |
| Visualization | `visualization__SKILL.md`, `chart-visualization.md`, `d3js.md` | Chart selection, D3.js patterns |
| Layout | `layout_patterns.md`, `dashboard-layout-planner.md`, `responsive-design.md` | Grid systems, responsive patterns |
| Analytics | `analytics-expert.md`, `analytics-metrics.md`, `analytics-data-analysis.md` | KPI frameworks, metrics design |
| UI/UX | `ui-ux-expert.md`, `software-ui-ux-design.md`, `design-expert__SKILL.md` | Design system creation |
| Working Dashboards | `cashflow_dashboard.html` (56KB), `dashboard_qbr_personal.html` (104KB), `Cost_Center_Dashboard.html` (46KB), `PnL_Dashboard.html` (25KB), `dashboard_followup.html` (69KB) | Production-ready reference implementations |

**Total**: 59 files

---

## 2. Expert Skills Library
**Path**: `C:\VMs\Projetos\Web_MD_Viewer\data_expert_skills\`

### Multi-Agent & Orchestration
| Skill | Size | Focus |
|-------|------|-------|
| `multi-agent-brainstorming__SKILL.md` | 6KB | **THE brainstorming process** (Designer, Skeptic, Guardian, Advocate, Arbiter) |
| `multi-agent-architect__SKILL.md` | 13KB | LangGraph/LangChain/DeepAgents system design |
| `multi-agent-patterns__SKILL.md` | 15KB | Production orchestration patterns |
| `multi-agent-task-orchestrator__SKILL.md` | 6KB | Task orchestration strategies |
| `agent-orchestration-improve-agent__SKILL.md` | 11KB | Agent improvement patterns |
| `agent-orchestration-multi-agent-optimize__SKILL.md` | 7KB | Multi-agent optimization |
| `agent-orchestrator__SKILL.md` | 10KB | Core orchestrator design |
| `autonomous-agent-patterns__SKILL.md` | 24KB | Autonomous agent design |
| `autonomous-agents__SKILL.md` | 31KB | Autonomous agent systems |

### Agent Infrastructure
| Skill | Size | Focus |
|-------|------|-------|
| `agent-memory-systems__SKILL.md` | 32KB | Memory architectures |
| `agent-tool-builder__SKILL.md` | 20KB | Tool creation patterns |
| `agentflow__SKILL.md` | 8KB | Flow orchestration |
| `agentfolio__SKILL.md` | 5KB | Agent portfolio management |
| `agents-md__SKILL.md` | 5KB | AGENTS.md standard |
| `agentic-actions-auditor__SKILL.md` | 21KB | Action audit trails |
| `agenttrace-session-audit__SKILL.md` | 6KB | Session tracing |

### Dashboard & Visualization
| Skill | Size | Focus |
|-------|------|-------|
| `dashboard-design__SKILL.md` | 10KB | Dashboard design methodology |
| `dashboard-playbook__SKILL.md` | 3KB | Dashboard playbook |
| `autoviz__SKILL.md` | 5KB | Auto-visualization |
| `visualization__SKILL.md` | 2KB | Core visualization |
| `funnel-analyzer__SKILL.md` | 3KB | Funnel analysis |
| `fortune500-executive-dashboard.md` | 10KB | Enterprise dashboard reference |

### AI & Product
| Skill | Size | Focus |
|-------|------|-------|
| `ai-product__SKILL.md` | 21KB | AI product design |
| `ai-engineer__SKILL.md` | 9KB | AI engineering patterns |
| `ai-agents-architect__SKILL.md` | 9KB | AI agent architecture |
| `steve-jobs__SKILL.md` | 28KB | Product vision methodology |

**Total**: 265 files

---

## 3. Orchestrator (Historical System)
**Path**: `C:\VMs\Projetos\Web_MD_Viewer\orchestrator\`

### Architecture
- **Backend**: `server.js` (26KB) — Node.js/Express orchestrator server
- **Core**: 
  - `dispatcher.js` (21KB) — Priority queue, Jaccard dedup, heartbeat detection, quality gates
  - `registry.js` (7KB) — Agent hierarchy management
  - `state.js` (12KB) — State persistence with checkpoints
- **Frontend**: Next.js + TypeScript app with Tailwind CSS
- **Config**: `orchestrator-config.json` — Max 3 sub-agents, 1hr timeout, 3 retries

### Agent Registry (17 agents across 4 tiers)
| Tier | Agents | Roles |
|------|--------|-------|
| 0 | Owner | Human override authority |
| 1 | Opus 4.7 (Kiro) | Top-level orchestrator + tie-break |
| 2 | Opus 4.6, Codex Leads ×3, Gemini Lead | Architect, No-regress, Build/dep, Forensics, Cross-check |
| 3 | Codex Subs ×9, Gemini Subs ×2 | Workers: diff analysis, error classification, graph parsing |

### State Data
- 12 task events logged (all PENDING status)
- Created: 2026-05-24T22:23:48Z
- Quality gates: Git diff required, test pass required, build required

---

## 4. Key Working Dashboards (HTML References)
| Dashboard | Path | Size | Features |
|-----------|------|------|----------|
| QBR Personal | `dashboards_templates/data_skills/dashboard_qbr_personal.html` | 104KB | Quarterly business review |
| Cashflow | `dashboards_templates/data_skills/cashflow_dashboard.html` | 56KB | Cash flow analysis |
| Follow-up | `dashboards_templates/data_skills/dashboard_followup.html` | 69KB | Task follow-up tracking |
| Cost Center | `dashboards_templates/data_skills/Cost_Center_Dashboard.html` | 46KB | Cost center analytics |
| P&L | `dashboards_templates/data_skills/PnL_Dashboard.html` | 25KB | Profit & Loss dashboard |
| Cost Center (expert) | `data_expert_skills/Cost_Center_Dashboard.html` | 46KB | Cost center analytics |
| P&L (expert) | `data_expert_skills/PnL_Dashboard.html` | 25KB | P&L analytics |
| Cashflow (expert) | `data_expert_skills/cashflow_dashboard.html` | 56KB | Cashflow analytics |

---

> **Usage**: These resources feed into Phase 3 (Multi-Agent Brainstorming) to design the AgentVerse platform features.
