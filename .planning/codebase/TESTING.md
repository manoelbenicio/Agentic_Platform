# Testing

> Mapped: 2026-05-22

## Test Framework

Node.js built-in test runner (`node --test`) — no external test framework.

## Test Files

| File | Location | Size | Purpose |
|------|----------|------|---------|
| `test_doc_engine.js` | Root + `Web_MD_Viewer/` | ~6KB each | Document engine/parser tests |
| `test_fallback_render.js` | Root + `Web_MD_Viewer/` | ~7KB each | Fallback Markdown renderer tests |

## Test Runner

Defined in `Web_MD_Viewer/package.json`:
```json
"test": "node --test tests/test_cockpit_parsers.js tests/test_server_endpoints.js tests/test_server_path_traversal.js"
```

⚠ Note: The referenced `tests/` directory with cockpit-specific tests may not exist yet (no `tests/` directory was found during mapping). The test files in root and `Web_MD_Viewer/` are standalone.

## Test Coverage

- **Document engine**: Parser correctness tests
- **Fallback renderer**: Custom Markdown→HTML rendering edge cases
- **Cockpit parsers**: Markdown governance file parsing (referenced in package.json)
- **Server endpoints**: API endpoint response validation (referenced in package.json)
- **Path traversal**: Security test for static file serving (referenced in package.json)

## What's NOT Tested

- No browser/E2E tests (no Playwright, Cypress, or Puppeteer)
- No UI component tests
- No visual regression tests
- No performance benchmarks
- No CI/CD pipeline configuration
