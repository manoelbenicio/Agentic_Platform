# Stack Research — AgentVerse Command Center

> **Research Date:** 2026-05-24
> **Context:** Enterprise AI Agent Management + FinOps platform targeting Fortune 500, launching in pt-BR market
> **Prior Art:** Indra Intelligence design language from Web_MD_Viewer v1.0

---

## Recommended Stack

| Layer | Technology | Version | Confidence | Rationale |
|-------|-----------|---------|------------|-----------|
| **Framework** | Next.js | 15.x (latest stable) | 🟢 High | App Router + RSC stable; Turbopack default bundler; Partial Prerendering (PPR) now stable for mixing static/dynamic; React 19 integration with `use`, `useFormStatus`, `useOptimistic`; Server Actions for type-safe mutations; `next/form` for enhanced form handling. Caching now opt-in (no more stale data bugs). |
| **UI Components** | shadcn/ui | Registry (copy-paste model) | 🟢 High | 50+ core components (Radix-based, accessible); no version lock-in — you own the code; CLI supports registry composition, package imports, target aliases, partial preset apply; ecosystem of 1000+ compatible blocks via 21st.dev, Magic UI, shadcnblocks. |
| **Styling** | Tailwind CSS | 4.x | 🟢 High | Complete Rust-based rewrite (Oxide engine): 5x faster full builds, 100x+ faster incremental; CSS-first config via `@theme` (no `tailwind.config.js`); zero-config content detection; built-in Lightning CSS (no PostCSS/Autoprefixer needed); native container queries, cascade layers, OKLCH colors, 3D transforms. |
| **3D Engine** | React Three Fiber + Drei | v9 (@react-three/fiber) | 🟢 High | Production-ready, industry standard for React 3D; supports React 19; WebGPU support via async `gl` prop; Drei companion provides production-ready abstractions (OrbitControls, Environment, useGLTF); minimal overhead vs vanilla Three.js. |
| **3D Globe** | Globe.gl | react-globe.gl | 🟢 High | High-level declarative wrapper over Three.js; handles spherical math, coordinate conversion automatically; supports points, arcs, hex bins, choropleth, custom 3D objects; hover/click callbacks; programmatic camera via `pointOfView()`; atmosphere and custom texture support. |
| **Charts (Standard)** | Recharts | 2.x | 🟢 High | Industry standard for React dashboards; declarative component API native to React; excellent for standard chart types (bar, line, pie, area); fast developer velocity for KPI dashboards, executive views, FinOps cost charts. |
| **Charts (Custom)** | D3.js | 7.x | 🟡 Medium | Only for bespoke visualizations that Recharts cannot handle — force-directed graphs (neural topology view), custom heatmaps, unique geospatial overlays. Steep learning curve; avoid for standard charts (anti-pattern in enterprise). |
| **Database (MVP)** | Supabase (PostgreSQL) | Latest | 🟢 High | Full BaaS: Auth + Storage + Realtime + Edge Functions; PostgreSQL with RLS for multi-tenancy; integrated ecosystem reduces vendor count; predictable performance on paid plans (always-on compute, no cold starts); perfect for rapid MVP. |
| **Database (Scale)** | CockroachDB | Latest | 🟡 Medium | Migration path when global multi-region active-active writes needed; wire-compatible with PostgreSQL; native horizontal scaling; "virtual cluster" for multi-tenant isolation; built-in fault tolerance. Only needed at Fortune 500 scale. |
| **AI Gateway** | LiteLLM | Latest | 🟢 High | Open-source, vendor-agnostic proxy; 100+ providers via unified OpenAI-compatible API; self-hosted (data sovereignty); no licensing fees; flexible for budget/cost tracking integration; strong Python community; perfect for FinOps cost metering at the proxy level. |
| **Billing** | Stripe Billing | API v2025 | 🟢 High | Supports flat-rate, per-seat, usage-based, tiered, and hybrid pricing; Meters API for real-time usage aggregation; Stripe Scripts + Workflows for custom billing logic; contract/quote management; Smart Retries + dunning for revenue recovery; 135+ currencies, 100+ payment methods; global tax automation. |
| **Auth/SSO** | Keycloak | Latest | 🟢 High | Open-source; SAML + OIDC + SCIM included natively (no feature gating); full data ownership; deep customization via Java SPIs; predictable cost (free + infra); no per-MAU pricing cliff; enterprise-grade at scale. Operational burden offset by platform team ownership. |
| **Real-time (Monitoring)** | SSE (Server-Sent Events) | HTTP Standard | 🟢 High | Uni-directional server→client; built-in auto-reconnection + event ID tracking; works with existing HTTP infrastructure (load balancers, proxies); lower overhead than WebSocket for read-heavy dashboards; perfect for agent status feeds, cost alerts, activity streams. |
| **Real-time (Control)** | WebSocket | RFC 6455 | 🟢 High | Bi-directional full-duplex; needed for interactive agent control panel (start/stop/configure agents); binary data support; complement to SSE in hybrid architecture. |
| **Event Broker** | NATS JetStream | Latest | 🟡 Medium | Lightweight durable streaming; low operational overhead vs Kafka; persistence + replay + consumer groups; single binary deployment; 1-5ms latency; ideal for agent events, cost events, audit trail. Sweet spot between Redis Pub/Sub (ephemeral) and Kafka (heavyweight). |
| **Backend (Agent Mgmt)** | Go | 1.22+ | 🟢 High | Superior concurrency via goroutines (thousands of concurrent agent connections); compiled to single static binary (cloud-native); predictable latency; industry standard for infrastructure services (K8s, Docker, Terraform ecosystem alignment). |
| **Backend (FinOps ML)** | Python FastAPI | 0.115+ | 🟢 High | Best ecosystem for ML/data processing; async support; type-safe with Pydantic; natural fit for FinOps optimization algorithms, cost forecasting (v2), anomaly detection. |
| **Language** | TypeScript | 5.x | 🟢 High | Full-stack type safety; shared types between Next.js frontend and API routes; excellent DX with IDE support. |
| **i18n** | next-intl | Latest | 🟢 High | Built for Next.js App Router; server component support; pt-BR primary with i18n architecture for English expansion. |

---

## Alternatives Considered

| Layer | Alternative | Why Not |
|-------|------------|---------|
| **UI Components** | Material UI (MUI) | Heavier bundle; opinionated design system conflicts with custom Indra Intelligence design language; harder to customize deeply |
| **UI Components** | Ant Design | Enterprise-focused but heavy; design language doesn't align with glassmorphism/dark mode aesthetic; Chinese-first documentation |
| **Styling** | CSS Modules | Less productive for rapid prototyping; utility-first approach of Tailwind better for design system consistency |
| **Charts** | Observable Plot | Excellent for data exploration but still evolving for React integration; less mature ecosystem for production dashboards |
| **Charts** | Apache ECharts | Powerful for massive datasets (100k+ points) but less React-native; overkill for standard dashboard charts |
| **Charts** | Visx | Low-level D3 primitives for React; more complexity than Recharts for standard charts without enough benefit |
| **Database** | PlanetScale | No free tier; foreign key limitations due to Vitess sharding; less PostgreSQL ecosystem depth |
| **Database** | Neon | Excellent serverless Postgres with instant branching + scale-to-zero, but Supabase provides full BaaS (Auth, Storage, Realtime) reducing total vendor count; Neon better for composable stacks |
| **AI Gateway** | Portkey | Enterprise-grade with better observability, guardrails, SOC2/ISO/HIPAA — but commercial/managed pricing at scale; less flexibility for custom FinOps metering; consider for v2 if self-managed ops becomes burdensome |
| **AI Gateway** | Bifrost (Maxim AI) | <11us overhead, excellent performance — but less community adoption; newer entrant; LiteLLM's open-source flexibility preferred for v1 |
| **Auth** | Auth0 (Okta) | Fastest time-to-market but SAML/SCIM gated behind Enterprise plans; MAU-based pricing escalates rapidly; vendor lock-in risk; less control over identity data |
| **Auth** | Clerk | Excellent DX but limited enterprise SSO features compared to Keycloak; less SAML/SCIM depth for Fortune 500 requirements |
| **Event Broker** | Apache Kafka | Unmatched for massive-scale event sourcing/data pipelines but operational complexity too high for MVP; KRaft still heavy; consider if event volume exceeds NATS JetStream capacity |
| **Event Broker** | Redis Pub/Sub | Ultra-simple, already in stack — but no persistence; messages lost on disconnect; insufficient for audit trail and FinOps events that require replay |
| **Backend** | Node.js (Express/Fastify) | Unified JS stack is appealing but event-loop model struggles with CPU-intensive tasks; goroutines handle thousands of concurrent agent connections more efficiently |
| **Real-time** | GraphQL Subscriptions | Good DX but adds GraphQL complexity; SSE + WebSocket hybrid is simpler and more performant for monitoring use case |

---

## What NOT to Use (and Why)

| Technology | Why NOT |
|-----------|---------|
| **Firebase** | Proprietary Google lock-in; limited PostgreSQL features; RLS not as flexible; not suitable for enterprise on-prem/hybrid deployment requirement |
| **MongoDB** | Document DB not ideal for relational multi-tenant data with complex joins (FinOps cost attribution, hierarchical org charts); ACID compliance concerns for financial data |
| **Prisma** | ORM overhead; struggles with PostgreSQL RLS policies; raw SQL/Drizzle preferred for multi-tenant performance-critical queries |
| **tRPC** | Couples frontend/backend tightly; doesn't work for Go backend services; REST/gRPC better for polyglot microservice architecture |
| **Electron** | Desktop app not in scope; web-first approach with Next.js handles all requirements |
| **WebGL 1.0** | Deprecated; WebGPU is baseline in all major browsers as of early 2026; Three.js + R3F v9 support WebGPU natively |
| **Webpack** | Turbopack is now the default bundler in Next.js 15; significantly slower than Turbopack for both cold starts and HMR |
| **Socket.io** | Abstraction overhead; native WebSocket API + SSE provide better performance and control; Socket.io's fallback transports unnecessary in 2026 |
| **Redux** | React 19 provides `use`, `useOptimistic`, `useFormStatus`; Server Components eliminate most client state; Zustand preferred for remaining client state |
| **Vercel KV / Upstash** | Redis needed only for caching/sessions, not as primary data store; Supabase + NATS cover real-time needs |

---

## Version Verification

| Technology | Verified Version | Source | Verification Date |
|-----------|-----------------|--------|-------------------|
| Next.js | 15.x (stable, Turbopack default, PPR stable) | nextjs.org | 2026-05-24 |
| Tailwind CSS | 4.x (Oxide engine, CSS-first config) | tailwindcss.com | 2026-05-24 |
| React Three Fiber | v9 (React 19 + WebGPU support) | @react-three/fiber | 2026-05-24 |
| shadcn/ui | Registry model, 50+ core components | shadcn.com | 2026-05-24 |
| Globe.gl | Stable, react-globe.gl available | globe.gl | 2026-05-24 |
| Recharts | 2.x (SVG-based, React component API) | recharts.org | 2026-05-24 |
| D3.js | 7.x (modular, low-level) | d3js.org | 2026-05-24 |
| Supabase | PostgreSQL 15+, Auth v2, Realtime v2 | supabase.com | 2026-05-24 |
| CockroachDB | PostgreSQL wire-compatible, virtual clusters | cockroachlabs.com | 2026-05-24 |
| LiteLLM | 100+ providers, OpenAI-compatible | github.com/BerriAI/litellm | 2026-05-24 |
| Stripe Billing | Meters API, Scripts, Workflows (2025 updates) | stripe.com | 2026-05-24 |
| Keycloak | SAML + OIDC + SCIM native, Java SPIs | keycloak.org | 2026-05-24 |
| NATS JetStream | Durable streaming, single binary | nats.io | 2026-05-24 |
| Go | 1.22+ (goroutines, static binary) | go.dev | 2026-05-24 |
| Python FastAPI | 0.115+ (async, Pydantic v2) | fastapi.tiangolo.com | 2026-05-24 |

---

## Key Integration Notes

### Hybrid Real-time Architecture
- **SSE** for high-volume streaming of dashboard metrics (agent status, cost feeds, activity streams)
- **WebSocket** for interactive agent control actions (start/stop/configure)
- **NATS JetStream** as the internal event backbone connecting Go/Python services to the Next.js frontend

### Database Migration Path
1. **MVP:** Supabase PostgreSQL with RLS (shared-schema, `tenant_id` on every table)
2. **Growth:** Supabase with connection pooling + read replicas
3. **Enterprise Scale:** CockroachDB with virtual clusters per enterprise tenant

### FinOps Cost Metering Pipeline
1. LiteLLM proxy intercepts all AI vendor calls → logs token usage + cost
2. Go agent management service enriches with agent/team/project metadata
3. Events published to NATS JetStream
4. Python FinOps service aggregates, analyzes, generates optimization recommendations
5. Stripe Meters API tracks usage for billing reconciliation

### Design System Integration
- shadcn/ui components customized with Indra Intelligence design tokens
- Tailwind v4 `@theme` directive for design system variables (colors, typography, spacing)
- Inter + JetBrains Mono typography maintained from Web_MD_Viewer
- Dark mode + glassmorphism as default aesthetic
