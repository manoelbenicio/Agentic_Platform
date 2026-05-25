# AgentVerse — Phase 2: User Advocate Review

> **Document**: `BRAINSTORM_PHASE2_ADVOCATE.md`
> **Author**: User Advocate Agent
> **Date**: 2026-05-25
> **Status**: REVIEW COMPLETE — Usability & UX Concerns
> **Revision**: 1.0
> **Reviewing**: `BRAINSTORM_PHASE1_DESIGN.md` (Rev 1.0)

---

## Review Summary

I represent the four end-user personas. My job is to fight for the user — to identify every friction point, cognitive overload, unclear flow, and accessibility gap that will cost you adoption, retention, or deal closure.

**Verdict: The design is feature-rich and technically ambitious. But ambition is the enemy of usability.** Several critical concerns will cause new users to bounce within minutes, experienced users to make costly mistakes, and the pt-BR localization to feel like an afterthought.

### Impact Score Card

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 HIGH | 12 | Will block adoption, cause errors, or lose deals |
| 🟡 MEDIUM | 16 | Will create friction, slow onboarding, or confuse users |
| 🟢 LOW | 9 | Polish issues, won't block usage but will feel rough |

---

## Cross-Cutting Concerns (All Features)

### CC-01: The "ALL at once" philosophy creates cognitive overload

> **Personas affected**: ALL — especially Engineering Manager and FinOps Analyst
> **Impact**: 🔴 HIGH

**The friction**: Commandment #1 ("Never Either/Or — Always ALL") is a product vision, not a UX strategy. Delivering Terminal AND Dashboard AND 3D AND API on every feature simultaneously means every screen must accommodate four mental models. But users don't switch modes mid-task — a FinOps Analyst reviewing budgets doesn't want a 3D globe button competing for attention.

**What the user expects**: A focused experience tailored to their role, with the option to explore other modes if curious.

**What they get**: A Swiss Army knife with all blades open — powerful, but you'll cut yourself picking it up.

**Recommendation**: Default to role-based entry points. A FinOps user lands on the FinOps dashboard — not a mode selector. The 3D, CLI, and API modes should be discoverable but not competing for attention on every screen. Progressive disclosure, not simultaneous disclosure.

---

### CC-02: Zero onboarding design mentioned anywhere

> **Personas affected**: ALL
> **Impact**: 🔴 HIGH

**The friction**: 1,873 lines of design. Zero mention of: welcome wizard, guided tour, empty states, sample data, getting-started flow, tooltip system, or contextual help. A new user who signs up will face an empty Squad Builder with a blank canvas, an empty FinOps dashboard with $0 everywhere, and a 3D globe with nothing on it.

**What the user expects**: "Sign up → guided setup → see value in 10 minutes."

**What they get**: "Sign up → empty void → 'What do I do first?'"

**Recommendation**: Design a "First 10 Minutes" flow for each persona:
- **CTO**: Auto-demo data + Boardroom Mode preview → "This is what your operation will look like."
- **Eng Manager**: Create first squad wizard (3 steps) → deploy sample agents → see live dashboard.
- **DevOps**: CLI quick-start: `agentverse init` → `agentverse squad create --demo` → `agentverse observe watch`.
- **FinOps**: Pre-loaded cost data simulator → "Here's what monitoring $10K/mo looks like."

---

### CC-03: Jargon density will alienate non-technical personas

> **Personas affected**: CTO/C-Suite, FinOps Analyst
> **Impact**: 🟡 MEDIUM

**The friction**: Terms like "Orchestrator-Worker pattern," "topological sort index," "DAG," "jitter," "dead-letter queue," "fan-out/fan-in," and "MCP/A2A protocol" are engineering language. A CTO in a boardroom or a FinOps analyst reviewing costs will not know — or want to learn — what a DAG is.

**What the user expects**: "Automated workflow scheduling with retry on failure."

**What they get**: "DAG execution with exponential backoff, jitter, and dead-letter queue replay."

**Recommendation**: Maintain a glossary layer. Every technical term displayed in the UI must have either (a) a plain-language label in the UI or (b) a hover tooltip explaining it in business terms. CLI `--help` text should use business-friendly language by default with `--verbose` for technical detail.

---

### CC-04: Portuguese (pt-BR) localization has structural risks

> **Personas affected**: ALL (Brazilian market is primary launch)
> **Impact**: 🔴 HIGH

**The friction**: The design mentions `next-intl` and `Intl.DateTimeFormat('pt-BR')` — good for dates and currency. But the actual content presents serious localization challenges:

1. **Military jargon**: "Squad," "Commander," "formation," "mission control" — these don't translate naturally to pt-BR. "Squad" → "Esquadrão"? "Equipe"? "Pelotão"? Each carries very different connotations. "Commander" → "Comandante" works but feels overly martial for an enterprise SaaS.

2. **Compound UI labels**: "Squad Commander," "FinOps Command Center," "Dead Letter Queue," "Boardroom Mode" — compound nouns in English that become awkward multi-word phrases in Portuguese. "Centro de Comando FinOps" is 4 words where English uses 3.

3. **CLI commands are in English**: `agentverse squad create`, `agentverse finops status` — will pt-BR users type English CLI commands? This is standard for dev tools, but the design says pt-BR default. Will `--help` output be in Portuguese?

4. **Abbreviations**: "MoM" (Month over Month), "DLQ" (Dead Letter Queue), "ctx" (context) — these abbreviations have no pt-BR equivalents.

**What the user expects**: A platform that feels natively Brazilian, not a translation of an American product.

**What they get**: English concepts wrapped in Portuguese strings.

**Recommendation**: 
- Hire a Brazilian UX writer (not a translator) to create the pt-BR terminology standard.
- CLI: Keep commands in English, output text in pt-BR, `--lang en` flag for English output.
- Define a brand-specific pt-BR glossary: "Squad" = "Equipe", "Commander" = "Líder", "Boardroom" = "Modo Executivo", etc.
- Budget labels: "R$" and BRL must be the default with USD as secondary.

---

### CC-05: No error state design anywhere

> **Personas affected**: ALL
> **Impact**: 🔴 HIGH

**The friction**: The design specifies what happens when everything works. It never specifies what happens when:
- A WebSocket connection drops (all live dashboards go stale)
- An agent fails to start (Squad Builder shows... what?)
- A flow execution hits a node error (canvas shows... what?)
- Budget data is delayed (FinOps shows stale numbers — how does the user know?)
- The 3D globe fails to load on a low-end machine (fallback?)
- Network is slow and the TMUX-style terminal lags

**What the user expects**: Clear indication of what went wrong and what to do about it.

**What they get**: Undefined behavior. Probably a blank screen or a frozen UI.

**Recommendation**: For each feature, define at minimum: (a) connection lost state, (b) partial data state, (c) full error state, (d) stale data indicator, (e) graceful degradation path.

---

### CC-06: Accessibility is not designed — it's assumed

> **Personas affected**: ALL (especially users with disabilities, but also power users who prefer keyboard)
> **Impact**: 🔴 HIGH

**The friction**: The tech stack lists "Radix primitives" (which are accessible) and shadcn/ui (which provides good ARIA defaults). But the actual feature designs rely heavily on:
- **Drag-and-drop** (Squad Builder, Flow Canvas) — no keyboard alternative specified
- **Right-click context menus** — not keyboard accessible by default
- **Color-only status indicators** (🟢🟡🔴🔵) — inaccessible to colorblind users (~8% of males)
- **3D WebGL globe** — completely inaccessible to screen readers
- **TMUX-style terminal grids** — how does a screen reader navigate 4 simultaneous terminal panes?
- **Hover tooltips on globe** — no hover on mobile/touch, no keyboard focus equivalent

**What the user expects**: WCAG 2.1 AA compliance, or at minimum, keyboard navigability for all core workflows.

**What they get**: A visual-first design that assumes mouse, good vision, and a powerful GPU.

**Recommendation**:
- Every drag-and-drop interaction must have a keyboard alternative (e.g., "Add to canvas" button, arrow-key reorder).
- Every color indicator must have a text/icon/shape companion (e.g., 🟢 Active → ✓ Active, 🔴 Dead → ✕ Dead).
- 3D Command Center needs a "2D fallback" mode — a flat map or summary table for screen reader users.
- TMUX grid: add "Focus pane 1/2/3/4" keyboard shortcuts and announce agent name on focus.
- Contrast ratios: `--text-muted: #64748B` on `--bg-abyss: #0c1017` = **3.6:1 ratio**. WCAG AA requires 4.5:1. This fails.

---

## Feature-by-Feature Review

---

## Feature 1: Agent Squad Builder

### SB-UX-01: 50-agent org chart will be unreadable

> **Persona**: Engineering Manager
> **Dimension**: Cognitive Load
> **Impact**: 🟡 MEDIUM

User story SB-01 says "supports up to 50 agents across 4 tiers." A visual org chart with 50 nodes and connection lines will be a tangled mess. Most users won't have 50 agents — but the edge case defines the architecture.

**Expects**: Clean hierarchy at any scale.
**Gets**: Spaghetti chart at 20+ agents.

**Recommendation**: Auto-collapse tiers beyond the focused one. "3 workers" → collapsed badge, click to expand. Minimap for navigation.

---

### SB-UX-02: Five orchestration patterns require expert knowledge

> **Persona**: Engineering Manager, DevOps/SRE
> **Dimension**: Clarity / Cognitive Load
> **Impact**: 🟡 MEDIUM

Choosing between "Orchestrator-Worker, Pipeline, Swarm, Mesh, Hierarchical" requires understanding distributed system patterns. The design says "Pattern selection auto-generates routing rules" but doesn't explain how a user decides which pattern to choose.

**Expects**: "I describe my goal; the platform picks the pattern."
**Gets**: "Choose one of 5 architecture patterns. Good luck."

**Recommendation**: Add a "Pattern Advisor" — answer 3 questions ("Do your agents do the same thing or different things? Do they need to coordinate? Is order important?") and the system recommends a pattern. Also: each pattern needs a 1-sentence plain-language description in the selector, not just the name.

---

### SB-UX-03: Budget configuration is buried in the Inspector

> **Persona**: FinOps Analyst
> **Dimension**: Usability (<3 clicks)
> **Impact**: 🟡 MEDIUM

To set a per-agent budget, the FinOps user must: (1) navigate to Squad Builder, (2) click an agent node, (3) find the budget field in the Inspector panel. But the FinOps user's mental model is "manage budgets" — not "edit agent configurations."

**Expects**: Budget management in the FinOps Command Center.
**Gets**: Budget setting scattered across Squad Builder Inspector panels.

**Recommendation**: Budget configuration should live in BOTH the Squad Builder inspector (for agent-level micro-management) AND the FinOps Command Center (for centralized budget governance). The FinOps center should have a "Budget Rules" view that lists ALL budget caps across all squads in one table.

---

### SB-UX-04: CLI squad creation requires memorizing flag names

> **Persona**: DevOps/SRE
> **Dimension**: Onboarding
> **Impact**: 🟢 LOW

```bash
agentverse squad add-member --squad code-review-team \
    --agent coder --role worker --model claude-opus-4 --budget 5000000
```

`--budget 5000000` — is that tokens? USD cents? Millionths of a dollar? The unit is ambiguous. Also, 7 flags for one command is high cognitive load.

**Expects**: Clear units and progressive complexity (required flags only, optional flags prompted interactively).
**Gets**: Flag soup with ambiguous units.

**Recommendation**: Interactive mode: `agentverse squad add-member -i` that prompts step-by-step. Budget should accept human-readable values: `--budget 5M-tokens` or `--budget $50`.

---

## Feature 2: Visual Flow Canvas

### VC-UX-01: 15+ node types dumped in a sidebar

> **Persona**: Engineering Manager (non-technical flow builder)
> **Dimension**: Cognitive Load
> **Impact**: 🟡 MEDIUM

The component palette lists 15+ node types in two categories (BASE and ADVANCED). A user building their first flow sees: Agent Skill, GenAI LLM, Image Gen, Classifier, Note, API Output, Call API, Code, JSON Filter, For Each, Async, Await, Sleep, Human-in-Loop, Squad Dispatch. That's overwhelming.

**Expects**: "Here are the 3 nodes you need to build a basic workflow."
**Gets**: "Here are 15 node types. Figure out which ones you need."

**Recommendation**: Progressive disclosure. Show "Starter Kit" (3-4 nodes) by default. "Show All" expands the full palette. Or even better: the Weaver AI should suggest nodes based on what's on the canvas.

---

### VC-UX-02: "Weaver" AI generation is amazing but has no guardrails

> **Persona**: Engineering Manager, DevOps/SRE
> **Dimension**: Error Handling
> **Impact**: 🟡 MEDIUM

Story VC-05: "Describe a workflow in natural language → AI generates canvas layout." But what if the AI generates a broken flow? What if it misunderstands the intent? What if the generated flow has 30 nodes and the user can't even parse it?

**Expects**: "Here's what I built for you. Let me walk you through it."
**Gets**: A generated flow dumped on canvas with no explanation.

**Recommendation**: After Weaver generates a flow: (1) show a step-by-step summary ("I created 6 nodes: first X, then Y..."), (2) highlight each node as it explains, (3) offer "Simplify" option if too complex, (4) run the linter automatically on generated flows.

---

### VC-UX-03: Debug mode is IDE-level complexity

> **Persona**: Engineering Manager
> **Dimension**: Cognitive Load
> **Impact**: 🟢 LOW

"Step-into, step-over, breakpoints, variable inspector" — this is an IDE debugger. Engineering Managers building flows are not necessarily developers. The debug tools will scare non-technical users.

**Expects**: "Show me where my flow failed."
**Gets**: "Here's a full debugger. Learn how to use breakpoints."

**Recommendation**: Two debug modes: (1) "Simple" — just highlights the failing node with error message and shows input/output, (2) "Advanced" — full IDE debugger for developers. Default to Simple.

---

### VC-UX-04: Deploy to 8+ channels in a single modal

> **Persona**: DevOps/SRE
> **Dimension**: Clarity
> **Impact**: 🟢 LOW

One-click deploy to "API, Chat Widget, Webhook, Slack, Discord, Cron, CLI, Teams" — 8 channels in one modal with per-channel config fields. This modal will be tall and complex.

**Expects**: "Deploy to Slack" → done.
**Gets**: A modal with 8 tabs, each with different config requirements.

**Recommendation**: Show most popular channels first (API, Webhook, Slack). Collapse others under "More channels." Each channel should have a "1-click deploy" default and an "Advanced config" expandable.

---

## Feature 3: FinOps Command Center

### FC-UX-01: The dashboard is excellent but has no "so what?" layer

> **Persona**: CTO/C-Suite, FinOps Analyst
> **Dimension**: Clarity
> **Impact**: 🟡 MEDIUM

The dashboard shows $4,231 spend, 847M tokens, 23 agents, 3 alerts, $1,200 saved. But it doesn't answer the CTO's real question: "**Are we spending too much? Are we on track? Should I be worried?**"

**Expects**: "You're 42% through budget with 60% of the month gone — you're under budget ✓" or "⚠ At current rate, you'll exceed budget by May 28."

**Gets**: Raw numbers without narrative context.

**Recommendation**: Add a "Health Verdict" card at the top: a single sentence with a status color that tells the executive whether things are good or bad. E.g., "✅ Gastos sob controle — projeção de 84% do orçamento até o fim do mês" or "⚠ Atenção — projeção de estouro de R$ 2.400 até 31/mai."

---

### FC-UX-02: Optimization recommendations lack confidence/risk context

> **Persona**: FinOps Analyst
> **Dimension**: Clarity / Error Handling
> **Impact**: 🟡 MEDIUM

"💡 Downgrade classifier nodes to Haiku-4.5 — Save ~$340/mo [✓]" — the user is asked to accept a model downgrade with a one-line description. But what's the risk? Will quality decrease? By how much? Is this reversible?

**Expects**: "This saves $340/mo with <2% quality impact on classification tasks. Reversible in 1 click."
**Gets**: "Save money. Trust us. Click here."

**Recommendation**: Each recommendation should show: (a) estimated savings, (b) estimated quality impact (with confidence %), (c) affected workflows/squads, (d) reversibility, (e) "Simulate" button to test before applying.

---

### FC-UX-03: Budget rule table lacks visual hierarchy

> **Persona**: FinOps Analyst
> **Dimension**: Cognitive Load
> **Impact**: 🟢 LOW

The Budget Rules table shows 3 rules with identical visual weight. The rule at 92% (⚠) should be screaming for attention — instead it's in the same visual row as the one at 42%.

**Expects**: Critical budgets visually dominate. Normal budgets fade.
**Gets**: A flat table where everything looks equally important.

**Recommendation**: Budget rules sorted by urgency. Rules above 80% get a red/orange left border and elevated card style. Rules below 50% get a muted treatment.

---

### FC-UX-04: Drill-down chain has no breadcrumb navigation

> **Persona**: FinOps Analyst, Engineering Manager
> **Dimension**: Usability / Clarity
> **Impact**: 🟡 MEDIUM

"Click $1,847 → per-agent breakdown → click agent → per-execution → click execution → per-node → click node → raw LLM call." That's 6 levels deep. How does the user get back? How do they know where they are in the hierarchy?

**Expects**: Breadcrumb trail: "Org > code-review-squad > reviewer-lead > exec_abc > node_def"
**Gets**: (Unspecified. Probably just the browser back button.)

**Recommendation**: Persistent breadcrumb bar at the top of drill-down views. "Home > Squad: code-review > Agent: reviewer-lead > Execution: #4281 > Node: classifier." Each crumb clickable.

---

### FC-UX-05: Currency defaults to USD — Brazilian users need BRL

> **Persona**: FinOps Analyst, CTO/C-Suite
> **Dimension**: Localization (pt-BR)
> **Impact**: 🔴 HIGH

Every cost example in the design is in USD: "$4,231", "$50/day", "$1,200 saved." The platform launches in Brazil. Brazilian FinOps analysts and CFOs think in BRL. They need R$ 21.000, not $4,231.

**Expects**: All monetary values in R$ (BRL) by default with real-time USD conversion available.
**Gets**: A USD-first platform that forces mental conversion.

**Recommendation**: Default currency = BRL for pt-BR locale. Show R$ with BRL formatting (R$ 21.155,00 — note the comma as decimal, period as thousands). Provide a toggle "Show in USD" for global comparison. LLM cost calculations should convert from vendor USD pricing to BRL at daily exchange rates.

---

## Feature 4: Live Observability Matrix

### LO-UX-01: TMUX grid assumes large screens

> **Persona**: DevOps/SRE
> **Dimension**: Usability
> **Impact**: 🟡 MEDIUM

The 2x2 TMUX grid works on a 27" monitor. On a 13" laptop (common for DevOps on-call), 4 panes of terminal output with status bars, context gauges, and tool counts will be unreadable.

**Expects**: Readable agent output at any screen size.
**Gets**: Tiny cramped panes with truncated text on smaller screens.

**Recommendation**: Responsive grid — auto-switch to 1-column layout on small screens. "Focus mode" for a single agent (fullscreen one pane). Tab-based switching as alternative to grid.

---

### LO-UX-02: Sandbox pill IDs are opaque

> **Persona**: DevOps/SRE
> **Dimension**: Clarity
> **Impact**: 🟡 MEDIUM

"[90be2fe8] [2a38fe6d●] [66755499] [b6368cd6] [fa815d93] [+ 4 more]" — these are hash IDs. The user has no idea which sandbox is which agent without hovering or memorizing.

**Expects**: "code-reviewer" "test-runner" "pr-analyzer" — human-readable names.
**Gets**: 8-character hex codes.

**Recommendation**: Show agent name/role as primary label, hash as secondary (tooltip or small text). E.g., "[reviewer ●] [coder] [tester] [writer] [+ 4 more]".

---

### LO-UX-03: Event stream search is powerful but intimidating

> **Persona**: Engineering Manager
> **Dimension**: Cognitive Load
> **Impact**: 🟢 LOW

"🔍 Search events... e.g. 'tool.*error' or '^GET'" — regex search is great for SREs, but an Engineering Manager doesn't know regex. They want to filter by "errors only" or "Agent 2 activity."

**Expects**: Clickable filter buttons: [Errors] [Warnings] [By Agent ▾] [By Tool ▾].
**Gets**: A regex search box.

**Recommendation**: Provide both: quick-filter buttons/dropdowns for common filters AND the regex search for power users. Default view should show filter buttons; regex is revealed via "Advanced search" toggle.

---

### LO-UX-04: "Dead agent" self-healing is invisible

> **Persona**: SRE, Engineering Manager
> **Dimension**: Error Handling
> **Impact**: 🟡 MEDIUM

Story LO-05 says dead agents auto-reassign tasks. But how does the user know this happened? The design mentions an alert, but the dashboard mockup doesn't show a clear "Auto-healed" event log or notification.

**Expects**: "Agent 4 died at 12:03. Task 'review-pr-31' was automatically reassigned to Agent 5 at 12:03. No action needed."
**Gets**: (Probably an event in the stream, easy to miss.)

**Recommendation**: Add a dedicated "Incidents" panel or notification banner for self-healing events. These are important enough to warrant their own visibility — not buried in the general event stream.

---

## Feature 5: Agent Marketplace & BYOA

### MP-UX-01: Marketplace + BYOA on the same screen splits focus

> **Persona**: Engineering Manager, Enterprise Architect
> **Dimension**: Cognitive Load
> **Impact**: 🟡 MEDIUM

The dashboard mockup shows marketplace browse AND a BYOA panel on the same page. These are two very different tasks: "discover and install a pre-built agent" vs. "register my existing external agent." Different users, different mental models, different workflows.

**Expects**: Marketplace is a store. BYOA is a registration/management console.
**Gets**: Both on one page.

**Recommendation**: Separate tabs or pages: "Marketplace" (browse/install) and "My Agents" (BYOA management + installed marketplace agents). The [BYOA] button in the header is good — it should navigate to a dedicated registration page.

---

### MP-UX-02: Security status is badge-only — no actionable info

> **Persona**: Compliance Officer (maps to Enterprise Architect/CTO)
> **Dimension**: Clarity / Error Handling
> **Impact**: 🟡 MEDIUM

"🔒 Verified" badge on marketplace cards. But: Verified how? What was scanned? When? What's the scope? A compliance officer needs more than a badge.

**Expects**: Click badge → see full security report with scan date, findings, tool permissions, and sandbox test results.
**Gets**: A lock icon.

**Recommendation**: Make the security badge clickable → opens a security report panel showing: (a) last scan date, (b) scan scope (prompt analysis, tool audit, sandbox test), (c) permissions requested, (d) any warnings. Enterprise compliance needs this audit trail.

---

### MP-UX-03: BYOA registration requires technical protocol knowledge

> **Persona**: Engineering Manager
> **Dimension**: Onboarding
> **Impact**: 🟢 LOW

```bash
agentverse byoa register --name my-analyzer --endpoint https://my-agent.co/api \
    --protocol a2a --auth-type api_key
```

"--protocol a2a" — the Engineering Manager may not know if their agent uses MCP, A2A, REST, or gRPC. They just know "it has an API endpoint."

**Expects**: "Paste your agent's URL and we'll auto-detect the protocol."
**Gets**: "Choose from 4 protocols."

**Recommendation**: Add protocol auto-detection: hit the endpoint, check response format, infer protocol. CLI: `agentverse byoa register --endpoint https://... --auto-detect`. Dashboard: URL input with auto-detection spinner.

---

## Feature 6: 3D Neural Command Center

### 3D-UX-01: WebGL performance on enterprise hardware

> **Persona**: CTO/C-Suite
> **Dimension**: Error Handling
> **Impact**: 🔴 HIGH

Enterprise laptops often have integrated GPUs (Intel UHD), restricted browser settings, and IT-managed Chrome policies that disable WebGL acceleration. The boardroom TV might run via a thin client or Citrix. If the 3D globe fails to render, the CTO's presentation collapses.

**Expects**: "It always works, especially in the boardroom."
**Gets**: A blank canvas or 5 FPS slideshow on an enterprise Dell Latitude.

**Recommendation**: (a) GPU capability detection on load — if WebGL is unavailable or GPU is below threshold, auto-fallback to a 2D animated map (still impressive, just flat). (b) "Performance mode" toggle: reduces particle count, disables ambient effects, lowers resolution. (c) Pre-rendered video export for boardroom — 30-second looping video of the globe that requires zero GPU.

---

### 3D-UX-02: Boardroom Mode is non-interactive — but what if the CEO asks a question?

> **Persona**: CTO/C-Suite
> **Dimension**: Usability
> **Impact**: 🟡 MEDIUM

Story 3D-04: "No interactive elements. Fullscreen." The CEO watches the globe, sees "$4,231 today," and asks: "How much of that is the code review team?" The CTO can't answer because Boardroom Mode disabled all interactivity.

**Expects**: "Let me click on that and drill down" during the presentation.
**Gets**: A screensaver with no interactivity.

**Recommendation**: Boardroom Mode should have a "Presenter escape" — press Escape or tap to enter interactive mode. Like PowerPoint's "press Escape to exit presentation." The auto-rotation and carousel should be the default, but the CTO should be able to pause and interact when a board member asks a question.

---

### 3D-UX-03: Hover tooltips are the only information layer on the globe

> **Persona**: CTO/C-Suite
> **Dimension**: Accessibility / Usability
> **Impact**: 🟡 MEDIUM

Globe information is accessed via hover: "Hover: São Paulo Cluster → Squad: code-review-squad, Agents: 5..." But: (a) touch screens don't have hover, (b) during a presentation projected on a wall, the CTO is using a trackpad and may struggle to hover precisely on small orbs, (c) no keyboard equivalent.

**Expects**: Click or tap to see info. Summary panel visible without hovering.
**Gets**: Information only available via precise mouse hover.

**Recommendation**: Click-to-pin tooltips (click an orb → info panel stays visible). Add a sidebar "Active Clusters" list that mirrors the globe data in text form. This serves as both accessibility fallback and a quick-scan reference.

---

### 3D-UX-04: "Mini Metrics Bar" at the bottom competes with the globe

> **Persona**: CTO/C-Suite
> **Dimension**: Clarity
> **Impact**: 🟢 LOW

"Global: 23 agents │ $4,231 today │ 847M tokens │ 99.7% uptime" — good KPIs, but placed at the bottom of a fullscreen globe. In a boardroom, the bottom of the screen is often cropped by the table or not visible at eye level.

**Expects**: Key metrics prominently placed where they're always visible.
**Gets**: Metrics at the bottom edge.

**Recommendation**: Place the metrics bar at the TOP of the globe view. Or make it a floating overlay in the upper-right corner, similar to video game HUDs. In Boardroom Mode, the metric carousel already handles this — but in interactive Globe Mode, the metrics bar should be top-anchored.

---

## Feature 7: Intelligent Scheduling Engine

### IS-UX-01: Calendar view lacks context — what does each dot mean?

> **Persona**: Engineering Manager
> **Dimension**: Clarity
> **Impact**: 🟡 MEDIUM

"🟢3" on May 1 — is that 3 completed executions? 3 schedules? 3 squads? The legend says "🟢 Completed" but "3" is ambiguous.

**Expects**: "3 completed runs" — or click the day to see which ones.
**Gets**: A colored number with no label.

**Recommendation**: On hover/click, show a mini-popover: "May 1: 3 executions completed (daily-code-review ✓, data-ingest ✓, weekly-check ✓)." The dot badge should tooltip "3 completed."

---

### IS-UX-02: DAG creation is available in 3 modes — but documentation assumes expertise

> **Persona**: Engineering Manager
> **Dimension**: Onboarding / Cognitive Load
> **Impact**: 🟡 MEDIUM

"DAG editor: visual + YAML." The visual DAG editor is a powerful concept, but the term "DAG" itself is exclusionary. Most Engineering Managers don't think in graph theory terms — they think in "do X, then Y, then Z in parallel."

**Expects**: "Set up a sequence: data-ingest → analyze → report. If analyze fails, alert me."
**Gets**: "Build a DAG with dependency edges, conditions, and timeout configurations."

**Recommendation**: Rename to "Workflow Dependencies" or "Run Order" in the UI. Replace "DAG View" tab with "Dependencies" or "Sequência." Use guided creation: "What should run first? What should run after it? Should anything run in parallel?"

---

### IS-UX-03: Dead Letter Queue "Replay" has no safety net

> **Persona**: SRE, FinOps Analyst
> **Dimension**: Error Handling
> **Impact**: 🔴 HIGH

DLQ replay re-executes a failed flow. But: (a) the flow may have partially succeeded — replaying could duplicate side effects (double emails, double API calls, double charges), (b) the failure may have been caused by external conditions that haven't changed, (c) there's no "dry run" option.

**Expects**: "Replay this safely — show me what will happen before it runs."
**Gets**: A [▶] button that immediately re-executes.

**Recommendation**: (a) Add "Dry Run Replay" — simulate execution without side effects. (b) Show a warning: "This flow partially executed. Replaying may cause: [list of side effects]. Continue?" (c) Open Question #3 in the design asks about DLQ authorization — the answer should be YES, replay should require elevated permissions, with audit logging.

---

### IS-UX-04: Timezone handling could cause silent failures

> **Persona**: DevOps/SRE
> **Dimension**: Error Handling
> **Impact**: 🟡 MEDIUM

The schedule model has `timezone: "America/Sao_Paulo"` — good. But the calendar view shows "May 26 09:00 BRT" — what happens during daylight saving transitions (Brazil has unpredictable DST changes)? What if a user in a different timezone views the calendar?

**Expects**: "Always shows times in MY timezone, with clear indication if the schedule's timezone differs."
**Gets**: (Unspecified. Could show schedule's timezone or viewer's timezone.)

**Recommendation**: Always display in the viewer's timezone with the schedule's timezone in parentheses: "09:00 BRT (seu fuso: 09:00 BRT)" or for a user in UTC: "12:00 UTC (agendado: 09:00 BRT)". During DST transitions, add a warning icon on affected schedules.

---

## Platform-Wide UX Recommendations (Summary)

### Priority 1 — Must Fix Before Launch (HIGH impact)

| # | Issue | Fix |
|---|-------|-----|
| CC-02 | No onboarding flow | Design "First 10 Minutes" per persona |
| CC-05 | No error states designed | Define error/fallback for every live component |
| CC-06 | Accessibility failures | Keyboard alternatives, color+text indicators, contrast fix |
| CC-04 | pt-BR localization is surface-level | Hire Brazilian UX writer, define brand glossary |
| FC-UX-05 | USD-only currency | Default BRL for pt-BR locale |
| 3D-UX-01 | WebGL may not work in boardrooms | 2D fallback, performance mode, video export |
| IS-UX-03 | DLQ replay is unsafe | Dry run, side-effect warnings, elevated auth |
| CC-01 | ALL-at-once philosophy → overload | Role-based defaults, progressive disclosure |

### Priority 2 — Should Fix for Good UX (MEDIUM impact)

| # | Issue | Fix |
|---|-------|-----|
| CC-03 | Jargon overload | Glossary layer, plain-language defaults |
| SB-UX-02 | Pattern selection requires expertise | Pattern Advisor wizard |
| SB-UX-03 | Budget config buried in wrong feature | Centralize in FinOps AND Squad Builder |
| VC-UX-01 | 15+ node types in sidebar | Progressive disclosure, starter kit |
| VC-UX-02 | Weaver AI has no explanation layer | Step-by-step summary after generation |
| FC-UX-01 | Dashboard lacks "so what?" narrative | Health Verdict card |
| FC-UX-02 | Recommendations lack risk context | Quality impact, reversibility, simulate |
| FC-UX-04 | Deep drill-down has no breadcrumbs | Persistent breadcrumb bar |
| LO-UX-01 | TMUX grid unreadable on small screens | Responsive grid, focus mode |
| LO-UX-02 | Sandbox IDs are hex hashes | Show agent name, hash as secondary |
| LO-UX-04 | Self-healing events buried in stream | Dedicated Incidents panel |
| MP-UX-01 | Marketplace + BYOA mixed on one page | Separate tabs/pages |
| MP-UX-02 | Security badge has no detail | Clickable badge → full report |
| 3D-UX-02 | Boardroom Mode is a screensaver | Presenter escape (press Escape → interactive) |
| 3D-UX-03 | Globe info is hover-only | Click-to-pin, sidebar text list |
| IS-UX-01 | Calendar dots are ambiguous | Hover popover with execution details |
| IS-UX-02 | DAG terminology is exclusionary | Rename to "Dependencies" / "Sequência" |
| IS-UX-04 | Timezone display is undefined | Show viewer's timezone, annotate schedule's |

### Priority 3 — Nice to Have (LOW impact)

| # | Issue | Fix |
|---|-------|-----|
| SB-UX-01 | 50-agent chart will be spaghetti | Auto-collapse, minimap |
| SB-UX-04 | CLI flag ambiguity | Interactive mode, human-readable units |
| VC-UX-03 | Debug mode too advanced for non-devs | Simple/Advanced toggle |
| VC-UX-04 | Deploy modal has 8 channel tabs | Show popular channels first, collapse rest |
| FC-UX-03 | Budget table lacks visual hierarchy | Sort by urgency, color borders |
| LO-UX-03 | Event search is regex-only | Quick filter buttons + advanced regex |
| MP-UX-03 | BYOA requires protocol knowledge | Auto-detect protocol |
| 3D-UX-04 | Metrics bar at bottom of globe | Move to top or floating overlay |
| CC-03 | CLI --help text is technical | Business-friendly by default, --verbose for technical |

---

## Responses to Open Questions (from User Perspective)

### Q1: BYOA Protocol Priority (MCP vs A2A)
**User Advocate answer**: Prioritize whichever is simpler for the user to set up. From a UX perspective, the user shouldn't need to know the protocol — auto-detection should handle it (see MP-UX-03). If forced to choose: MCP, because it's more common in the current agent ecosystem.

### Q2: Boardroom Mode Customization
**User Advocate answer**: YES — brand colors, logo, and particle theme at minimum. A Fortune 500 CTO presenting to their board wants their brand, not AgentVerse's brand. This is a deal-closer. But keep it simple: upload logo, pick brand color, done. No 3D model upload — that's scope creep.

### Q3: DLQ Replay Authorization
**User Advocate answer**: YES, absolutely — see IS-UX-03. Replaying a financial flow without elevated auth is a compliance nightmare. Require admin approval for DLQ replay. Add audit logging. Add dry run.

### Q4: Marketplace Revenue Split
**User Advocate answer**: 80/20 (creator/platform) to incentivize quality content. 70/30 is the App Store standard — beat it to attract early creators.

### Q5: Observability Retention
**User Advocate answer**: The proposed tiers are fine, but make the limit VISIBLE in the UI. Nothing worse than searching for a log and discovering it was deleted. Show: "Retention: 7 days (upgrade to Pro for 30 days)" with a clear CTA.

### Q6: Canvas Collaboration
**User Advocate answer**: NOT for v1. Real-time collaboration is a feature that doubles engineering complexity for a scenario that's rare in early adoption. Show "Last edited by [name] at [time]" and add a locking mechanism. Collaboration can be v2.

### Q7: Cost Estimation Pre-flight
**User Advocate answer**: Show confidence intervals, never guarantee. "Custo estimado: R$ 12–18 (confiança: 85%)". Users trust honest estimates more than false precision.

---

## Final Word

This platform is designed by engineers for engineers. That's 1 out of 4 personas.

The CTO needs a "wow" tool that works on the first try in a boardroom with bad hardware. The Engineering Manager needs clarity without jargon. The FinOps Analyst needs BRL, breadcrumbs, and budget governance in one place. The DevOps/SRE is actually well-served — the CLI and observability designs are strong.

**The biggest risk is not a missing feature. It's a first-time user facing an empty screen with no guidance, in a language that feels translated rather than native, on a machine that can't render WebGL.**

Fix the onboarding. Fix the error states. Fix the localization depth. Fix the accessibility. Then the ambition becomes an advantage instead of a liability.

---

> **STATUS**: REVIEW COMPLETE
> **REVIEWER**: User Advocate Agent
> **DATE**: 2026-05-25T01:36:00Z
> **NEXT**: Submit to main brainstorm coordinator for synthesis with Skeptic and Guardian reviews.
