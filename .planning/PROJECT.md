# Web_MD_Viewer — Full Modernization

## What This Is

A comprehensive Fortune 500-grade modernization of 7 HTML documents across the Web_MD_Viewer project. Each file is being rewritten from scratch as a premium, self-contained executive document with interactive navigation, dark/light theming, in-browser editing, print-optimized layouts, and responsive mobile support — all while preserving the original business content in a bilingual (PT-BR + English) format.

## Core Value

Every modernized document must pass the **Boardroom Test** — if projected on a screen in a Fortune 500 C-Level presentation, the quality, interactivity, and visual density must command executive respect without a single pixel feeling "developer-grade" or "template-ish."

## Requirements

### Validated

- ✓ Indra Intelligence brand identity — existing in root app and cockpit
- ✓ Dark mode with glassmorphism — established in `index.html` and `cockpit.css`
- ✓ Inter + JetBrains Mono typography — loaded via Google Fonts
- ✓ Sidebar navigation pattern — proven in both apps
- ✓ KPI card pattern — proven in both apps
- ✓ CSS custom properties for theming — established convention

### Active

- [ ] Full rewrite of all 7 target HTML files
- [ ] Self-contained inline styling per file (no external CSS dependencies)
- [ ] Interactive sidebar TOC with smooth scrolling and active state tracking
- [ ] Dark/light theme toggle with CSS custom property switching
- [ ] Section collapse/expand for deep-dive reading control
- [ ] In-browser content editing with export capability
- [ ] Print-optimized @media print layout for executive presentations
- [ ] Responsive mobile-first layout (breakpoints for phone, tablet, desktop)
- [ ] Bilingual presentation (PT-BR content, English navigation/labels)
- [ ] Executive hero section with document metadata and KPIs
- [ ] Animated section reveals and micro-interactions
- [ ] Code block syntax highlighting (for architecture/schema sections)
- [ ] Table formatting with zebra striping and sticky headers
- [ ] Sequential review: one file at a time, user approval before next

### Out of Scope

- Root `index.html` (MD Viewer app) — already premium quality
- Root `viewer.js`, `viewer.css`, `styles.css` — not in scope
- `cockpit-server.js`, `cockpit.js`, `cockpit.css` — server and client logic not in scope
- External CSS file creation — files must remain self-contained
- Content translation — PT-BR content stays, only navigation/labels get English

## Context

### Target Files (7 total)

| # | File | Current Size | Content Domain |
|---|------|-------------|----------------|
| 1 | `AI_Engine/index.html` | 69KB | AI Engine landing page |
| 2 | `AI_Engine/agentificacaoDeOfertas.html` | 116KB | Offer agentification specification |
| 3 | `AI_Engine/arquitetura-alto-nivel.html` | 72KB | High-level architecture |
| 4 | `AI_Engine/especificacao-funcional.html` | 54KB | Functional specification |
| 5 | `AI_Engine/estrategia-implementacao.html` | 69KB | Implementation strategy |
| 6 | `AI_Engine/qualificacao-rfp-neoenergia-backoffice-whatsapp.html` | 63KB | RFP qualification (Neoenergia) |
| 7 | `Web_MD_Viewer/index.html` | 18KB | PMO Cockpit interface |

### Design Reference

Blend of two proven designs:
- **Executive document feel** from root `index.html` — hero sections, metadata pills, TOC sidebar, glassmorphism panels
- **Operational density** from `Web_MD_Viewer/index.html` (cockpit) — KPI grids, dispatch console, skeleton loading, mission-control aesthetic

### Existing Codebase Map

Full codebase analysis available in `.planning/codebase/` — 7 structured documents covering stack, architecture, structure, conventions, testing, integrations, and concerns.

## Constraints

- **Self-contained**: Each HTML file must work standalone (open directly in browser, no server required)
- **No external CSS**: All styling inline within `<style>` tags in each file
- **CDN-only dependencies**: Google Fonts, highlight.js, mermaid — same CDN stack as root app
- **Sequential delivery**: One file reviewed and approved before starting the next
- **Backward compatibility**: Files must work in modern browsers (Chrome, Edge, Firefox, Safari latest)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Self-contained inline styles | User requires each file to be fully independent — no shared CSS file | — Pending |
| Bilingual navigation | PT-BR audience with English-speaking stakeholders | — Pending |
| Full content rewrite | Current files are not editable, not premium quality | — Pending |
| Sequential review | Quality gate per file to ensure each meets Fortune 500 standard | — Pending |
| Blend of both app designs | Executive gravitas + operational density = maximum impact | — Pending |

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
*Last updated: 2026-05-22 after initialization*
