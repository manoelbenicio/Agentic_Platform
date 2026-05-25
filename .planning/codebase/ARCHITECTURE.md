# Architecture

> Mapped: 2026-05-22

## Pattern

**Dual-application monorepo** with two independent client-side apps sharing a common design system, plus a lightweight Node.js API server.

```
┌──────────────────────────────────────────────────────────────┐
│                     Web_MD_Viewer Repo                       │
│                                                              │
│  ┌──────────────────────┐   ┌──────────────────────────────┐ │
│  │   Root App (MD Viewer)│   │   Web_MD_Viewer/ (Cockpit)   │ │
│  │   Static HTML/JS/CSS  │   │   Node.js Server + Client    │ │
│  │                       │   │                              │ │
│  │  index.html           │   │  index.html                  │ │
│  │  viewer.js (165KB)    │   │  cockpit.js (43KB)           │ │
│  │  viewer.css (56KB)    │   │  cockpit.css (49KB)          │ │
│  │  styles.css (15KB)    │   │  cockpit-server.js (25KB)    │ │
│  └──────────────────────┘   └──────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────┐   ┌──────────────────────────────┐ │
│  │   AI_Engine/          │   │   Supporting Files            │ │
│  │   HTML spec docs      │   │   aws_pricing.json            │ │
│  │   (self-contained)    │   │   checkin.md, dashboard.html  │ │
│  └──────────────────────┘   └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Application 1: MD Viewer (Root)

**Purpose**: Premium C-Level executive document viewer for Markdown specs with legacy status-log dashboard.

### Layers

1. **Presentation** — `index.html` defines 7 view containers (Dashboard, Upload, Document, Table, Timeline, Calculator, Q&A + UI/UX Studio, Architecture Studio, Admin)
2. **Engine** — `viewer.js` (3143 lines, IIFE module) handles all logic:
   - State management (plain object `state`)
   - Markdown parser (custom fallback `renderFallback()` + CDN `marked`)
   - Document type classifier (`detectDocType()` — executive vs status log)
   - View router (`switchView()` — CSS show/hide pattern)
   - File drag-drop handling
   - Canvas 2D charting (stacked bar + trend line)
   - AWS cost calculator engine
   - UI/UX Preview Studio compiler
   - Architecture Studio grid renderer
   - Admin panel (menu management)
3. **Design System** — `styles.css` (base tokens) + `viewer.css` (component styles)

### Key Abstractions

| Abstraction | File | Purpose |
|-------------|------|---------|
| `state` object | `viewer.js:17-29` | Central app state (files, entries, page, docs, menus) |
| `switchView()` | `viewer.js:196-290` | SPA router (CSS show/hide, no URL routing) |
| `detectDocType()` | `viewer.js:318-337` | Heuristic classifier: executive doc vs status log |
| `renderFallback()` | `viewer.js:419-480` | Custom Markdown→HTML renderer (TOC, tables, code blocks) |
| `DEFAULT_MENU_ITEMS` | `viewer.js:6-14, 142-154` | Dynamic sidebar navigation (persisted to localStorage) |

### Data Flow

```
User drops .md file → addFiles() → detectDocType()
  ├─ executive → addExecutiveDoc() → renderDocContent() → Document View
  └─ status    → parseStatusLog() → updateKPIs() + renderTable() → Dashboard View
```

## Application 2: PMO Cockpit (`Web_MD_Viewer/`)

**Purpose**: Real-time mission control for 12 parallel AI agents in a multi-model orchestration (M2 milestone).

### Layers

1. **Server** — `cockpit-server.js` (625 lines, Node.js `http` module)
   - Parses Markdown governance files from `.planning/milestones/`
   - Exposes REST API on port 7777
   - Serves static files
   - Zero external dependencies
2. **Client** — `cockpit.js` (43KB) + `index.html`
   - Polls `/api/cockpit/snapshot` every 5s
   - 7 views: Dispatch, Dashboard, Agent Roster, Activity, Phases, Handoffs, Prompts
   - Skeleton loading states, connection loss banner
3. **Design** — `cockpit.css` (49KB) — independent design system, same Indra branding

### Key Abstractions

| Abstraction | File | Purpose |
|-------------|------|---------|
| `FLEET_ROSTER` | `cockpit-server.js:17-30` | Static roster of 12 AI agents |
| `buildFleet()` | `cockpit-server.js:308-445` | Consolidates lifecycle from activity + checkin data |
| `parseCheckinBoard()` | `cockpit-server.js:54-113` | Parses CHECKIN_BOARD.md governance file |
| `parseActivityLog()` | `cockpit-server.js:115-173` | Parses reverse-chronological activity log |

## Application 3: AI Engine (`AI_Engine/`)

**Purpose**: Self-contained HTML documentation specs for agentic architecture and RFP qualification.

These are standalone HTML files (50-116KB each) with embedded CSS — no shared JS or API dependencies.

## Entry Points

| Entry Point | Type | URL |
|-------------|------|-----|
| `index.html` (root) | Static HTML | Any static server (e.g., `http://localhost:8090`) |
| `Web_MD_Viewer/index.html` | Node.js server | `http://localhost:7777` |
| `AI_Engine/index.html` | Static HTML | Direct file open or any server |
