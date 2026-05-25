# External Integrations

> Mapped: 2026-05-22

## External APIs

| Integration | Type | Location | Notes |
|-------------|------|----------|-------|
| Google Fonts | CDN | `index.html`, `Web_MD_Viewer/index.html` | Inter + JetBrains Mono typefaces |
| jsDelivr CDN | CDN | `index.html` | marked, DOMPurify, highlight.js, mermaid |
| AWS Pricing (local) | REST/JSON | `viewer.js` → `./aws_pricing.json` | Static fallback; fetches local JSON file |

## No External Services

The application has **no backend API calls to external services**:
- No authentication provider
- No database (all data is file-system or in-memory)
- No cloud storage
- No analytics or tracking

## Internal APIs (Cockpit Server)

The cockpit server (`Web_MD_Viewer/cockpit-server.js`) exposes a REST API on `localhost:7777`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Server health check |
| `/api/cockpit/snapshot` | GET | Full dashboard snapshot (fleet, KPIs, activity, phases) |
| `/api/fleet` | GET | AI agent fleet status and lifecycle |
| `/api/agents/roster` | GET | Active agents from CHECKIN_BOARD.md |
| `/api/checkin-board` | GET | Parsed check-in board data |
| `/api/activity-log` | GET | Activity log with `?since=` and `?limit=` params |
| `/api/file-locks` | GET | Active file locks from FILE_LOCK_TABLE.md |
| `/api/handoffs` | GET | Agent handoff graph and history |
| `/api/prompts/list` | GET | Dispatch prompt files listing |
| `/api/prompts/:id/content` | GET | Individual prompt content |
| `/api/phases/state` | GET | Phase tracker state |

## Data Sources

The cockpit server reads governance Markdown files from `.planning/milestones/M2_card_first_revision_v2/governance/`:
- `CHECKIN_BOARD.md` — agent status tables
- `ACTIVITY_LOG.md` — timestamped operation log
- `FILE_LOCK_TABLE.md` — concurrent file lock tracking
- `HANDOFF_LOG.md` — inter-agent handoff stream

## Browser Storage

| Storage | Key | Purpose |
|---------|-----|---------|
| `localStorage` | `indra_menu_items` | Persisted sidebar menu configuration |
| `localStorage` | (theme) | Dark/light mode preference |
