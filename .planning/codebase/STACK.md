# Technology Stack

> Mapped: 2026-05-22

## Languages & Runtime

| Language | Version | Usage |
|----------|---------|-------|
| JavaScript (ES2020+) | N/A (browser) | Client-side: `viewer.js` (165KB), `cockpit.js` (43KB) |
| JavaScript (Node.js) | >=18.0.0 | Server-side: `cockpit-server.js` (25KB) |
| HTML5 | — | `index.html` (root), `Web_MD_Viewer/index.html` (cockpit) |
| CSS3 | — | `styles.css`, `viewer.css`, `cockpit.css` — custom design system |

## Frameworks & Libraries

**No build-time frameworks** — the project is a zero-build vanilla stack.

### CDN Dependencies (Root App — `index.html`)

| Library | Version | Purpose |
|---------|---------|---------|
| `marked` | 12.0.2 | Markdown→HTML rendering (premium rendering stack) |
| `DOMPurify` | 3.1.6 | XSS sanitization of rendered Markdown |
| `highlight.js` | 11.10.0 | Syntax highlighting (json, yaml, js, ts) |
| `mermaid` | 10.x | Diagram rendering (lazy-loaded on demand) |

### CDN Dependencies (Cockpit — `Web_MD_Viewer/index.html`)

None — the cockpit app is fully self-contained with no CDN dependencies.

### Node.js Dependencies (Server)

**Zero npm dependencies.** Server uses only Node.js built-in modules:
- `http` — HTTP server
- `fs` / `fs/promises` — file system operations
- `path` — path resolution

## Configuration

| File | Location | Purpose |
|------|----------|---------|
| `cockpit-config.json` | `Web_MD_Viewer/` | Server port (7777), host, polling interval, activity log limit |
| `aws_pricing.json` | Root | Static AWS pricing fallback data for cost calculator |
| `package.json` | `Web_MD_Viewer/` | Node scripts (`start`, `test`, `open`) |

## Build & Dev Tools

- **No bundler** — no webpack, vite, or esbuild
- **No transpiler** — no TypeScript, no Babel
- **No package manager lock file** — no `node_modules` in root
- **Server start**: `node cockpit-server.js` (port 7777)
- **Root app**: static files served directly (e.g., `python -m http.server` or any static server)

## Design System

Custom CSS design system with Indra Intelligence branding:
- **Fonts**: Inter (UI), JetBrains Mono (code) via Google Fonts
- **Theme**: Dark mode default with light mode toggle (`data-theme` attribute)
- **CSS Variables**: `--indra-cyan`, `--indra-success`, `--indra-warning`, `--indra-error`, `--indra-gold`, `--indra-light`
- **Visual Style**: Glassmorphism, backdrop-filter blur, gradient panels, SVG icons inline
