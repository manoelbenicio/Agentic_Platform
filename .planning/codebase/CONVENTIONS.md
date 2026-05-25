# Code Conventions

> Mapped: 2026-05-22

## JavaScript Style

### Client-Side (viewer.js, cockpit.js)

- **Module pattern**: IIFE `(function() { 'use strict'; ... })()` — no ES modules
- **DOM access**: `const $ = id => document.getElementById(id)` shorthand
- **State**: Plain object (`const state = { ... }`) — no reactive framework
- **Event handling**: Direct `addEventListener` + event delegation on containers
- **String building**: Template literals for HTML generation (no JSX, no template engine)
- **Naming**: camelCase for functions/variables, UPPER_SNAKE for constants
- **No semicolons**: Not enforced — mixed usage
- **No linter config**: No `.eslintrc`, `.prettierrc`, or similar

### Server-Side (cockpit-server.js)

- **Module system**: CommonJS (`require()` / `module.exports`)
- **HTTP server**: Raw `http.createServer()` — no Express
- **Async**: `async/await` with `fs/promises`
- **Error handling**: try/catch blocks, errors logged to console and returned as JSON
- **API pattern**: Single handler with pathname switch/case routing

## CSS Style

- **Custom properties**: Extensive use of CSS variables for theming
- **No methodology**: Not BEM, not OOCSS — descriptive class names (`kpi-card`, `panel-header`, `nav-item`)
- **Inline styles**: Heavy use of inline `style=""` attributes in HTML (especially `index.html`)
- **No preprocessor**: No SASS/LESS — vanilla CSS only
- **Responsive**: Media queries present but not comprehensive
- **Animations**: CSS transitions (`transition: all 0.25s var(--ease-out)`) and keyframes

## HTML Style

- **Semantic HTML5**: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- **ARIA attributes**: Present on key elements (`aria-label`, `role="tablist"`, `aria-live`)
- **Language**: Root app is `lang="pt-BR"`, cockpit is `lang="en"`
- **Theme**: `data-theme="dark"` attribute on `<html>` for CSS variable switching
- **SVG icons**: All inline — no icon font or sprite sheet

## Error Handling

- **Client**: `try/catch` around localStorage, file reads, and fetch calls
- **Server**: `try/catch` per API route with console.error logging
- **Fallbacks**: AWS pricing has static fallback if API fetch fails; Markdown rendering has custom fallback if CDN libraries fail to load
- **No global error handler**: No `window.onerror` or `unhandledrejection`

## Comments & Documentation

- **Section separators**: `// ─── SECTION NAME ───` pattern in viewer.js
- **JSDoc**: Not used
- **Inline comments**: Sparse, mostly for section headers
- **checkin.md**: Project progress log (manual, not auto-generated)
