# Design Brief — AgentVerse Command Center

> **Source**: Consolidated from 15 data_expert_skills files + PROJECT.md
> **Date**: 2026-05-24
> **Purpose**: Definitive design reference for ALL implementation phases

---

## Fortune 500 Boardroom Test Criteria

Every screen in AgentVerse must pass the **Boardroom Test**: *If projected on a screen in a Fortune 500 boardroom, would it command respect and immediate comprehension? If not, redesign.*

### Core Principles
1. **Signal over Noise** — Remove everything that doesn't drive a decision
2. **Hierarchy of Attention** — The most critical insight must be visible in <3 seconds
3. **Executive Density** — Maximum insight per pixel without visual clutter
4. **Narrative Flow** — The dashboard tells a story from top-left to bottom-right
5. **Decision Architecture** — Every element maps to an actionable decision

### The "5-Second Scan" Rule
| Timeframe | Executive Must See |
|-----------|-------------------|
| **1 second** | Overall status (GO / NO-GO / CONDITIONAL) |
| **3 seconds** | Top 3 risks or blockers |
| **5 seconds** | Financial exposure and timeline |
| **30 seconds** | Enough context to make a decision or ask a specific question |

### Information Hierarchy (4 Levels)
1. **Level 1 — Hero KPIs**: The 3-5 numbers that matter most (largest, boldest)
2. **Level 2 — Charts**: Trends, comparisons, distributions (primary content area)
3. **Level 3 — Tables**: Detailed breakdowns for drill-down (supporting data)
4. **Level 4 — Footnotes**: Methodology, confidence, caveats (footer)

### Executive Attention Pattern (Z-Scan)
```
┌──────────────────────────────────┐
│  1 → → → → → → → → 2           │  ← First scan: top strip (KPIs)
│  ↓                   ↓           │
│  3                   4           │  ← Second scan: primary content
│  ↓                   ↓           │
│  5 → → → → → → → → 6           │  ← Third scan: supporting data
└──────────────────────────────────┘
```
Place the most critical information at positions 1-2-3.

### Quality Checklist (Every Screen)
- [ ] Passes the 5-second scan test
- [ ] No more than 5 hero KPIs per view
- [ ] All text ≥11px
- [ ] Color contrast meets WCAG 2.1 AA (≥4.5:1 normal text, ≥3:1 large text)
- [ ] Consistent spacing (8px grid system)
- [ ] Numbers use tabular figures (`font-variant-numeric: tabular-nums`)
- [ ] All status indicators use BOTH color AND icon/text
- [ ] Hover states on all interactive elements
- [ ] Source/methodology footnote present
- [ ] Generated timestamp visible
- [ ] Print/export friendly version available

---

## Color System

### Primary Palette (Dark Mode — Mandatory for Executive Dashboards)
```css
/* Backgrounds */
--bg-primary: #0F1117;          /* Deep space black — main background */
--bg-secondary: #1A1D2E;        /* Elevated surface — sidebar, secondary panels */
--bg-tertiary: #242840;         /* Card backgrounds */
--bg-glass: rgba(26, 29, 46, 0.85); /* Glassmorphism panels */

/* Text */
--text-primary: #F0F1F5;        /* High emphasis — headings, KPI values */
--text-secondary: #8B8FA3;      /* Medium emphasis — labels, descriptions */
--text-tertiary: #5C5F73;       /* Low emphasis — timestamps, footnotes */
--text-accent: #60A5FA;         /* Links and interactive elements */

/* Borders */
--border-subtle: rgba(255,255,255,0.06);   /* Card borders, dividers */
--border-active: rgba(96,165,250,0.3);     /* Active/focused element borders */
```

### Semantic Colors (Status & KPI)
```css
--status-excellent: #10B981;    /* Green — On track / Positive / Agent Active */
--status-good: #34D399;         /* Light green — Acceptable / Agent Idle */
--status-warning: #F59E0B;      /* Amber — Needs attention / Budget Warning */
--status-critical: #EF4444;     /* Red — Critical / Blocked / Budget Exceeded */
--status-info: #3B82F6;         /* Blue — Informational / In Progress */
--status-neutral: #6B7280;      /* Grey — N/A / Pending / Offline */
```

### Gradient Accents (Premium Feel)
```css
--gradient-hero: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);       /* Hero sections */
--gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%);    /* Positive trends */
--gradient-warning: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);    /* Warnings */
--gradient-danger: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);     /* Critical alerts */
--gradient-info: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);       /* Information */
--gradient-premium: linear-gradient(135deg, #C084FC 0%, #818CF8 50%, #60A5FA 100%); /* Brand accent */
```

### Color Theory Rules
| Palette Type | Usage | Max Colors |
|-------------|-------|------------|
| **Sequential** | Single-hue, varying lightness (ordered data, heatmaps) | 5-7 steps |
| **Diverging** | Two hues meeting at neutral (deviation: +/-) | 2 hues + neutral |
| **Categorical** | Distinct hues for unrelated categories | **6 max** |
| **Highlight** | Grey everything, colorize only what matters | 1-2 accent colors |

### Glassmorphism Card CSS
```css
.glass-card {
  background: rgba(26, 29, 46, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

---

## Typography System

### Font Stack
```css
--font-display: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Scale (Exact Specifications)
| Element | Size | Weight | Letter Spacing | Notes |
|---------|------|--------|----------------|-------|
| Page Title | 28px | 700 (Bold) | -0.02em | `font-display` |
| Section Header | 18px | 600 (Semibold) | -0.01em | `font-display` |
| KPI Value (Hero) | 48px | 800 (Extra Bold) | -0.03em | `font-display`, gradient text |
| KPI Value (Standard) | 32px | 700 (Bold) | -0.02em | `font-display` |
| KPI Label | 12px | 500 (Medium) | 0.05em | **UPPERCASE**, `font-display` |
| Body Text | 14px | 400 (Regular) | 0 | `font-display` |
| Table Header | 11px | 600 (Semibold) | 0.08em | **UPPERCASE**, `font-display` |
| Table Cell | 13px | 400 (Regular) | 0 | `font-display` |
| Table Cell (Numeric) | 13px | 400 (Regular) | 0 | `font-mono`, right-aligned, `tabular-nums` |
| Caption/Meta | 11px | 400 (Regular) | 0.02em | `font-display` — **MINIMUM text size** |

### KPI Hero Number CSS
```css
.kpi-hero {
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #F0F1F5 0%, #8B8FA3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}
```

### Number Formatting (pt-BR Locale)
- Use locale formatting: `R$ 16.699.051,62`
- Use abbreviations for large numbers: `R$ 16,7M`
- Show units: `45-60 FTEs`, `48 meses`
- Show comparison: `▲ +12% vs meta`, `▼ -3 vs benchmark`

---

## Dashboard Layout Rules

### Mandatory 3-Step Design Workflow
> From `dashboard-design__dashboard-design__SKILL.md` — **Do NOT skip steps**

| Step | Goal | Output |
|------|------|--------|
| **Step 1: Understand Requirements** | Define WHAT information is presented and WHY | `spec/1_information_architecture.yaml` |
| **Step 2: Design Layout & Interactions** | Define HOW users navigate and explore data | `spec/2_interaction_ux.yaml` |
| **Step 3: Select Visualizations** | Choose chart types, establish visual consistency | `spec/3_visual_design.yaml` |

### Executive Dashboard Grid (1920x1080 Target)
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: Logo + Title + Date Range + Status Badge       │  60px
├─────────┬─────────┬─────────┬─────────┬─────────────────┤
│  KPI 1  │  KPI 2  │  KPI 3  │  KPI 4  │    KPI 5       │  140px
│  Hero   │  Hero   │  Hero   │  Hero   │    Hero         │
├─────────┴─────────┴─────────┼─────────┴─────────────────┤
│                             │                           │
│   PRIMARY CHART             │   SECONDARY CHART         │  360px
│   (60% width)               │   (40% width)            │
│                             │                           │
├─────────────────────────────┼─────────────────────────────┤
│                             │                           │
│   DATA TABLE / RISK MATRIX  │   STATUS / PROGRESS       │  340px
│                             │                           │
└─────────────────────────────┴─────────────────────────────┘
│  FOOTER: Confidence Level + Source + Generated At        │  40px
```

### KPI Card Anatomy
```
┌──────────────────────────┐
│  ● Label (uppercase)     │  ← 11px, text-secondary, 0.05em spacing
│                          │
│     3.08                 │  ← 48px, font-weight 800, gradient text
│     /5.00                │  ← 18px, text-tertiary
│                          │
│  ▲ +0.12 vs target       │  ← 12px, status color + icon
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  │  ← sparkline or progress bar
└──────────────────────────┘
```

### Grid System
- **12-column grid** (flexible: divides by 1, 2, 3, 4, 6, 12)
- `row_min_height: 140px`

| Component | Columns | Rows | Height |
|-----------|---------|------|--------|
| KPI Card | 3 | 1 | 140px |
| Small Chart | 4 | 3 | 420px |
| Large Chart | 6 | 4-5 | 560-700px |
| Table | 12 (full) | 4-6 | 560-840px |

---

## Chart Selection Guide for AgentVerse

| Data Type | Chart Type | Library | Rationale |
|-----------|-----------|---------|-----------|
| **Agent status distribution** | Donut chart (3-5 slices) | Recharts | Part-to-whole with low cardinality |
| **Cost over time** | Line chart (area variant) | Recharts | Continuous trend, full-width |
| **Cost by vendor** | Horizontal bar chart | Recharts | Category comparison, label readability |
| **Agent hierarchy** | Force-directed graph / Tree diagram | D3.js custom | Org-chart relationships |
| **Geographic distribution** | 3D Globe with markers + Choropleth | Three.js + Globe.gl | Hero visualization |
| **Budget utilization** | Circular gauge (0-100%) | D3.js custom | Single KPI, immediate comprehension |
| **Real-time metrics** | Sparklines in KPI cards | Recharts | Micro-charts for inline trends |
| **Risk assessment** | Heatmap matrix (Impact x Probability) | D3.js custom | 2D categorical matrix |
| **Cost breakdown (multi-level)** | Treemap | D3.js custom | Hierarchical part-to-whole |
| **Vendor comparison** | Grouped bar chart | Recharts | Side-by-side comparison |
| **SLA/Uptime tracking** | Traffic light + Horizontal bars | Recharts | GO/NO-GO decisions |
| **Trend anomalies** | Line chart with reference lines | D3.js custom | Threshold lines, deviation zones |

---

## Micro-Animation Patterns

### Timing Tokens
```css
--duration-instant: 100ms;    /* Hover feedback, toggle */
--duration-fast: 200ms;       /* Tooltips, small transitions */
--duration-normal: 300ms;     /* Card transitions, navigation */
--duration-slow: 500ms;       /* Panel reveals, page transitions */
--duration-emphasis: 800ms;   /* Chart progressive reveal */
--duration-dramatic: 1200ms;  /* KPI count-up, gauge fill */
```

### Easing Curves
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* Decelerate — most common */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* Symmetric — for loops */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot — playful reveals */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);     /* Material Design standard */
```

### Entry Animations
| Element | Animation | Duration | Stagger |
|---------|-----------|----------|---------|
| Cards | `fadeInUp` (translateY 16px→0, opacity 0→1) | 300ms ease-out | 60ms per card |
| KPI Numbers | `countUp` from 0 to value | 1200ms ease-out cubic | — |
| Charts | Progressive reveal (SVG stroke-dashoffset) | 600ms-1200ms ease-out | 300ms delay |
| Bar charts | `growUp` (scaleY 0→1, transform-origin: bottom) | 600ms ease-out | — |
| Tables | Row-by-row fade-in | 300ms | 30ms per row |
| Gauge arcs | `fillGauge` stroke-dasharray animation | 1500ms ease-out | 400ms delay |

### Interaction Animations
| Element | Animation | Details |
|---------|-----------|---------|
| Card hover | `translateY(-3px)` + elevated box-shadow | 200ms ease-out |
| Table row hover | Background color transition + left border accent | 100ms ease |
| Critical badge | Pulsing glow (`box-shadow` 0→6px rgba) | 2s ease-in-out infinite |
| Tooltip | Fade + translateY(4px→0) | 200ms ease-out, 200ms delay |

### Performance Rules
1. **Only animate `transform` and `opacity`** — compositor-only, no layout thrash
2. Use `will-change` sparingly
3. **Never animate** `width`, `height`, `top`, `left`
4. Max **20 simultaneous on-screen animations**
5. **Always respect** `prefers-reduced-motion`

---

## Information Architecture

### Recommended Page Hierarchy
```
AgentVerse Command Center
│
├── 🏠 Dashboard (Executive Overview)
│   ├── Hero KPIs: Total Agents, Total Cost (MTD), Budget Utilization %, Active Alerts
│   ├── Primary: Cost trend line (30d) + Agent status donut
│   ├── Secondary: Top 5 cost agents table + Budget status gauges
│   └── Footer: Data freshness, confidence, sources
│
├── 🌐 Command Center (3D Globe)
│   ├── Interactive WebGL globe with agent markers
│   ├── Connection arcs showing agent communications
│   ├── Cost heatmap overlay per region
│   └── Sidebar: Agent quick-stats on marker click
│
├── 🤖 Agents
│   ├── Agent Registry (CRUD list/grid view)
│   ├── Agent Detail (individual agent profile)
│   └── Agent Marketplace (pre-built + BYOA)
│
├── 👥 Teams & Squads
│   ├── Org Chart (hierarchical tree view)
│   ├── Squad Detail (senior + technicians, budget, project)
│   └── Permissions & Roles
│
├── 💰 FinOps Center
│   ├── Cost Analytics (by agent, vendor, team, project)
│   ├── Budget Management (hard/soft limits, alerts)
│   ├── Optimization Recommendations
│   ├── Automated Remediation Rules
│   └── Reports & Export (PDF, CSV, scheduled)
│
├── 🔗 Neural Topology
│   ├── Force-directed graph (agent relationships, data flows)
│   └── Interaction: click node → agent detail
│
├── 📊 Reports
│   ├── Executive Summary (auto-generated)
│   ├── Scheduled Reports
│   └── Custom Report Builder
│
├── 📋 Audit Log
│
└── ⚙️ Settings
    ├── Workspace Configuration
    ├── SSO/SAML/OIDC Setup
    ├── Billing & Subscription
    ├── API Keys & Integrations
    └── Language (pt-BR / en)
```

### User Archetypes
| Type | Needs | Dashboard Approach |
|------|-------|-------------------|
| **CTO/Executive** | High-level trends, exceptions, budget status | KPIs, sparklines, alerts — LOW data density |
| **Engineering Manager** | Team performance, agent comparisons, cost analysis | Comparisons, drill-downs — MEDIUM density |
| **DevOps/Platform** | Real-time status, remediation actions | Live metrics, action buttons — MEDIUM-HIGH density |
| **Finance/FinOps** | Deep cost exploration, raw data, exports | Filters, tables, exports — HIGH density |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout | Tailwind |
|-----------|-------|--------|----------|
| **Desktop XL** | ≥1440px | Full grid, all panels, 3D globe | `2xl:` |
| **Desktop** | ≥1280px | Compact grid, 12-col | `xl:` |
| **Desktop (Small)** | ≥1024px | 2-column stack, simplified globe | `lg:` |
| **Tablet Landscape** | ≥768px | 2-column, KPIs stacked 2x2 | `md:` |
| **Tablet Portrait** | ≥576px | Single column, cards stacked | `sm:` |
| **Mobile** | <576px | Single column, minimal | default |

### Priority-Based Responsive Strategy
1. **Hero KPIs** — always visible at every breakpoint
2. **Primary chart** — collapses to summary stats below 768px
3. **Tables** — switch to card-list view below 768px
4. **Secondary panels** — move to accordion below 1024px
5. **3D Globe** — fallback to 2D map below 1024px, hidden below 768px

---

## Design Anti-Patterns to Avoid

### Visual Anti-Patterns
| ❌ Anti-Pattern | ✅ Do Instead |
|----------------|--------------|
| 3D charts (pie, bar, etc.) | Use 2D equivalents |
| More than 6 colors in a single chart | Limit to 6 max categorical colors |
| Decorative elements without data purpose | Every pixel must carry information |
| Text below 11px | 11px minimum, prefer 13px+ |
| Centered text in tables | Left-align text, right-align numbers |
| Rainbow color schemes | Use sequential/diverging palettes |
| More than 3 chart types per dashboard view | Standardize on 2-3 chart types per page |

### Chart Anti-Patterns
| ❌ Never Use | Reason |
|-------------|--------|
| Pie charts with 6+ slices | Impossible to compare slice sizes |
| Dual Y-axis charts | Different scales confuse readers |
| Bar charts not starting at zero | Distorts magnitude comparisons |
| 3D charts of any kind | Occlusion, perspective distortion |

### Content/Label Anti-Patterns
| ❌ Bad | ✅ Good |
|-------|--------|
| "Sales Chart" | "Revenue by Region (Q2 2026)" |
| Raw numbers without units | Always include units: "R$ 45M", "48 meses" |
| Numbers without context | Always show comparison: vs target, vs last period |

---

## Component Patterns

### Spacing Scale (8px Grid)
```typescript
export const spacing = {
  xs: '4px',   // 0.5 x base
  sm: '8px',   // 1 x base
  md: '16px',  // 2 x base
  lg: '24px',  // 3 x base
  xl: '32px',  // 4 x base
  '2xl': '40px', // 5 x base
  '3xl': '48px', // 6 x base
}
```

### Component Architecture (Atomic Design)
```
components/
├── atoms/       → Button, Input, Text, Icon, Badge, Spinner
├── molecules/   → FormField, KPICard, SearchBar, StatusBadge
├── organisms/   → Header, Sidebar, DataTable, ChartPanel, AgentCard
└── templates/   → DashboardLayout, AuthLayout, CommandCenterLayout
```

---

*This design brief is the single source of truth for AgentVerse visual design decisions. All implementation must reference and comply with these specifications.*
