# Requirements — Web_MD_Viewer Full Modernization

## v1 Requirements

### Design System (DSS)
- [ ] **DSS-01**: Each file has a self-contained `<style>` block with complete Indra Intelligence design tokens (colors, typography, spacing, shadows)
- [ ] **DSS-02**: Dark mode as default with CSS custom properties (`--indra-cyan`, `--indra-success`, `--indra-warning`, `--indra-error`, `--indra-gold`)
- [ ] **DSS-03**: Inter (UI) + JetBrains Mono (code) loaded via Google Fonts CDN
- [ ] **DSS-04**: Glassmorphism panels with backdrop-filter blur and gradient backgrounds
- [ ] **DSS-05**: Consistent SVG icon system inline (no icon fonts)

### Navigation & Layout (NAV)
- [ ] **NAV-01**: Interactive sidebar TOC generated from document heading structure
- [ ] **NAV-02**: Active section tracking with scroll-spy highlighting in TOC
- [ ] **NAV-03**: Smooth scrolling to sections on TOC click
- [ ] **NAV-04**: Collapsible sidebar for mobile and focused reading mode
- [ ] **NAV-05**: Bilingual navigation labels (Portuguese content, English section headers/labels)
- [ ] **NAV-06**: Responsive layout: phone (<768px), tablet (768-1024px), desktop (>1024px)

### Theme & Visual (THM)
- [ ] **THM-01**: Dark/light theme toggle with smooth CSS transition
- [ ] **THM-02**: Theme preference persisted in localStorage
- [ ] **THM-03**: Executive hero section with document title, metadata pills, and summary KPIs
- [ ] **THM-04**: Animated section reveals on scroll (IntersectionObserver)
- [ ] **THM-05**: Micro-interactions: hover effects, button feedback, panel transitions
- [ ] **THM-06**: Premium progress indicators (reading progress bar, section completion)

### Content Features (CNT)
- [ ] **CNT-01**: Section collapse/expand with smooth accordion animation
- [ ] **CNT-02**: Code block syntax highlighting via highlight.js CDN
- [ ] **CNT-03**: Table formatting with zebra striping, sticky headers, horizontal scroll
- [ ] **CNT-04**: Mermaid diagram rendering (if source contains diagrams)
- [ ] **CNT-05**: Callout/blockquote styling (info, warning, critical, success variants)
- [ ] **CNT-06**: Image/figure handling with captions and zoom-on-click

### Editing & Export (EDT)
- [ ] **EDT-01**: In-browser content editing toggle (contenteditable mode)
- [ ] **EDT-02**: Export as HTML button (generates clean standalone HTML)
- [ ] **EDT-03**: Print button with @media print optimized layout
- [ ] **EDT-04**: Print layout: clean white background, no sidebar, proper page breaks, headers/footers

### Quality & Performance (QUA)
- [ ] **QUA-01**: Each file works standalone (open directly in browser, no server)
- [ ] **QUA-02**: All inline — no external CSS file dependencies
- [ ] **QUA-03**: Semantic HTML5 structure (nav, main, article, section, aside, header, footer)
- [ ] **QUA-04**: ARIA accessibility attributes on interactive elements
- [ ] **QUA-05**: Fast initial render (<2s on localhost)
- [ ] **QUA-06**: Content restructured for optimal readability and C-Level scanning

### Per-File Content Rewrite (FIL)
- [ ] **FIL-01**: `AI_Engine/index.html` — AI Engine landing page fully rewritten
- [ ] **FIL-02**: `AI_Engine/agentificacaoDeOfertas.html` — Offer agentification spec fully rewritten
- [ ] **FIL-03**: `AI_Engine/arquitetura-alto-nivel.html` — High-level architecture fully rewritten
- [ ] **FIL-04**: `AI_Engine/especificacao-funcional.html` — Functional specification fully rewritten
- [ ] **FIL-05**: `AI_Engine/estrategia-implementacao.html` — Implementation strategy fully rewritten
- [ ] **FIL-06**: `AI_Engine/qualificacao-rfp-neoenergia-backoffice-whatsapp.html` — RFP qualification fully rewritten
- [ ] **FIL-07**: `Web_MD_Viewer/index.html` — PMO Cockpit interface fully rewritten

## v2 Requirements (Deferred)

- Automated PDF export (server-side rendering)
- Multi-language toggle (full EN/PT-BR switch)
- Version history / change tracking
- Real-time collaborative editing

## Out of Scope

- Root `index.html` (MD Viewer) — already premium quality
- `viewer.js`, `cockpit.js`, `cockpit-server.js` — application logic not in scope
- Creating shared external CSS files — files must be self-contained
- Content translation — only navigation/labels get English, business content stays PT-BR
- Mobile app or PWA packaging

## Traceability

| REQ-ID | Phase |
|--------|-------|
| (filled during roadmap creation) | |

---
*Last updated: 2026-05-22 after requirements definition*
