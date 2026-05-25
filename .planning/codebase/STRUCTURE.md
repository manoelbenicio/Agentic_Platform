# Directory Structure

> Mapped: 2026-05-22

## Root Layout

```
Web_MD_Viewer/
├── .planning/                    # GSD planning directory (new)
│   └── codebase/                 # Codebase mapping documents
├── AI_Engine/                    # Standalone HTML spec documents
│   ├── Requerimentos/            # Requirements subdirectory
│   ├── index.html                # AI Engine landing page (69KB)
│   ├── agentificacaoDeOfertas.html       # Offer agentification spec (116KB)
│   ├── arquitetura-alto-nivel.html       # High-level architecture (72KB)
│   ├── especificacao-funcional.html      # Functional spec (54KB)
│   ├── estrategia-implementacao.html     # Implementation strategy (69KB)
│   └── qualificacao-rfp-neoenergia-*.html # RFP qualification (63KB)
├── RFP_DOCS/                     # RFP documentation directory
├── Web_MD_Viewer/                # PMO Cockpit sub-application
│   ├── cockpit-server.js         # Node.js HTTP server (25KB)
│   ├── cockpit.js                # Client-side cockpit logic (43KB)
│   ├── cockpit.css               # Cockpit design system (49KB)
│   ├── cockpit-config.json       # Server configuration
│   ├── index.html                # Cockpit HTML (18KB)
│   ├── index_legacy_backup.html  # Legacy backup file
│   ├── package.json              # Node.js package config
│   ├── styles.css                # Base design tokens (15KB)
│   ├── viewer.css                # Viewer components (45KB)
│   ├── viewer.js                 # Viewer logic copy (68KB)
│   ├── test_doc_engine.js        # Document engine tests (6KB)
│   └── test_fallback_render.js   # Fallback renderer tests (7KB)
├── data_expert_skills/           # Data expert skills directory
├── ofertasBPO/                   # BPO offers directory
├── scripts/                      # Supporting scripts directory
├── skills/                       # Skills directory
├── index.html                    # Root MD Viewer app (112KB)
├── viewer.js                     # Root viewer engine (166KB)
├── viewer.css                    # Root viewer design (56KB)
├── styles.css                    # Root base design system (15KB)
├── dashboard.html                # Standalone dashboard (21KB)
├── aws_pricing.json              # AWS pricing fallback data
├── checkin.md                    # Project check-in log
├── test_doc_engine.js            # Document engine tests (6KB)
└── test_fallback_render.js       # Fallback renderer tests (7KB)
```

## Key Locations

| What | Path | Notes |
|------|------|-------|
| Main app entry | `index.html` | Root MD Viewer (1632 lines) |
| Core JS engine | `viewer.js` | 3143 lines, 166KB — monolithic IIFE |
| Cockpit entry | `Web_MD_Viewer/index.html` | 356 lines |
| Cockpit server | `Web_MD_Viewer/cockpit-server.js` | 625 lines, pure Node.js |
| Cockpit client | `Web_MD_Viewer/cockpit.js` | ~43KB |
| AI specs | `AI_Engine/*.html` | 6 standalone HTML documents |
| Design tokens | `styles.css` (root + `Web_MD_Viewer/`) | Shared Indra Intelligence branding |

## File Duplication

⚠ Several files exist in **both** root and `Web_MD_Viewer/`:
- `viewer.js` (root: 166KB vs sub: 68KB — different versions)
- `viewer.css` (root: 56KB vs sub: 45KB — different versions)
- `styles.css` (root: 15KB vs sub: 15KB — likely same)
- `test_doc_engine.js` (root: 6KB vs sub: 6KB — likely same)
- `test_fallback_render.js` (root: 7KB vs sub: 7KB — likely same)

## Naming Conventions

- **HTML files**: descriptive names, kebab-case for AI_Engine (`arquitetura-alto-nivel.html`)
- **JS files**: camelCase for cockpit (`cockpit-server.js`), simple names for root (`viewer.js`)
- **CSS files**: simple descriptive names (`styles.css`, `viewer.css`, `cockpit.css`)
- **No module system**: All JS is either IIFE (client) or CommonJS (server)
