# Concerns

> Mapped: 2026-05-22

## Critical Concerns

### 1. Monolithic JavaScript Files

**Severity**: High
**Files**: `viewer.js` (3143 lines, 166KB), `cockpit.js` (43KB)

The root `viewer.js` is a single IIFE containing ALL application logic — markdown parsing, document rendering, view routing, charting, AWS calculator, UI/UX studio, admin panel, and more. This makes the file:
- Difficult to navigate and modify
- Impossible to tree-shake
- Hard to test in isolation
- Risk of variable name collisions within the closure

**Recommendation**: Modularize into ES modules or at minimum split into logical files.

### 2. File Duplication Between Root and Web_MD_Viewer/

**Severity**: High
**Files**: `viewer.js`, `viewer.css`, `styles.css`, `test_doc_engine.js`, `test_fallback_render.js`

The same files exist in both locations with different sizes, indicating diverged copies. Changes to one copy won't propagate to the other. This creates maintenance burden and inconsistency risk.

**Recommendation**: Determine canonical location; use symlinks or a shared directory.

### 3. Duplicate `DEFAULT_MENU_ITEMS` Definition

**Severity**: Medium
**File**: `viewer.js` — defined at line 6-14 AND lines 142-154

The menu items constant is defined twice in the same file with different values. The second definition shadows the first (both are `const` in the IIFE scope, so the first may cause a runtime error in strict mode).

**Recommendation**: Remove the duplicate and consolidate into a single definition.

## Security Concerns

### 4. No Input Sanitization in Dynamic HTML

**Severity**: Medium
**File**: `viewer.js`

Template literal HTML generation (`innerHTML = ...`) with user content from uploaded files. While DOMPurify is loaded for Markdown rendering, not all paths use it (e.g., `escapeHtml()` is used but may miss edge cases in nested contexts).

### 5. CORS Wide Open on Cockpit Server

**Severity**: Low (localhost only)
**File**: `cockpit-server.js:456`

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

Acceptable for local development, but would be a concern if deployed.

### 6. Path Traversal Risk on Static File Serving

**Severity**: Medium
**File**: `cockpit-server.js:561`

Static file serving resolves paths relative to `__dirname` without comprehensive traversal protection. The `test` script references path traversal tests, suggesting this has been considered.

## Performance Concerns

### 7. Large Inline HTML Files

**Severity**: Low
**Files**: `index.html` (112KB), AI_Engine HTMLs (50-116KB each)

Heavy inline CSS `style=""` attributes bloat the HTML. The AI_Engine files are self-contained HTML documents that could benefit from shared stylesheets.

### 8. No Code Splitting or Lazy Loading

**Severity**: Medium

All JS loads synchronously for the root app. The cockpit uses a single `cockpit.js` file. No dynamic imports or code splitting — user pays the full download cost upfront regardless of which view they use.

## Technical Debt

### 9. No Version Control History

**Severity**: Medium

Git was just initialized — no commit history exists. All current state is untracked.

### 10. No .gitignore

**Severity**: Low

No `.gitignore` file exists to exclude `node_modules/`, `.planning/`, or other generated files.

### 11. Mixed Language UI (PT-BR + English)

**Severity**: Low

The root app mixes Portuguese and English in the UI (`Documentos`, `Questionário` alongside `Dashboard`, `Upload`). The cockpit is fully English. This may be intentional for the target audience.

### 12. No CI/CD or Deployment Configuration

**Severity**: Low (internal tool)

No Dockerfile, no GitHub Actions, no deployment scripts. Manual deployment only.
