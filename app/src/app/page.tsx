"use client"

import { Bot, DollarSign, Zap, Shield } from "lucide-react"
import { KPICard } from "@/components/ui/kpi-card"
import { Panel } from "@/components/ui/panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { DataTable, type Column } from "@/components/ui/data-table"
import { BulletList, type BulletItem } from "@/components/ui/bullet-list"
import { AgentActivityChart } from "@/components/charts/agent-activity-chart"
import { CostBreakdownChart } from "@/components/charts/cost-breakdown-chart"

/* ─── KPI DATA ────────────────────────────────────────────── */
const kpis = [
  {
    label: "Agentes Ativos",
    value: "47",
    trend: (
      <span className="text-[var(--indra-success)]">
        ▲ +12 este mês
      </span>
    ),
    icon: <Bot className="h-4 w-4" />,
  },
  {
    label: "Custo Total IA",
    value: "R$ 16.451,30",
    trend: (
      <span className="text-[var(--indra-success)]">
        ▼ −8% vs mês anterior
      </span>
    ),
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    label: "Tasks Executadas",
    value: "2.847",
    trend: (
      <span className="text-[var(--indra-success)]">
        ▲ +340 esta semana
      </span>
    ),
    icon: <Zap className="h-4 w-4" />,
  },
  {
    label: "Uptime Plataforma",
    value: "99,97%",
    trend: (
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--indra-success)]" />
        SLA cumprido
      </span>
    ),
    icon: <Shield className="h-4 w-4" />,
  },
]

/* ─── OPERATIONAL STATUS ──────────────────────────────────── */
const statusItems: BulletItem[] = [
  {
    dot: "success",
    title: "API Gateway",
    text: "Todos os endpoints respondendo dentro do SLA. Latência p99 em 142ms.",
    meta: "142ms",
  },
  {
    dot: "success",
    title: "Cluster de Agentes",
    text: "47 agentes ativos em 3 zonas de disponibilidade. Auto-scaling operante.",
    meta: "3 zonas",
  },
  {
    dot: "warning",
    title: "Fila de Processamento",
    text: "Atraso de 2.3s no consumer de embeddings. Investigação em andamento.",
    meta: "2.3s",
  },
  {
    dot: "error",
    title: "Rate Limit OpenAI",
    text: "Atingindo 87% do rate limit no tier GPT-4o. Avaliar upgrade de plano.",
    meta: "87%",
  },
]

/* ─── TABLE DATA ──────────────────────────────────────────── */
interface AgentExecution {
  agente: string
  modelo: string
  tokens: number
  custo: number
  duracao: string
  status: "success" | "warning" | "error"
  statusLabel: string
}

const executions: AgentExecution[] = [
  { agente: "Análise Financeira", modelo: "GPT-4o", tokens: 12847, custo: 0.38, duracao: "4.2s", status: "success", statusLabel: "Concluído" },
  { agente: "Atendimento L1", modelo: "Claude 3.5", tokens: 8523, custo: 0.21, duracao: "2.8s", status: "success", statusLabel: "Concluído" },
  { agente: "Gerador de Relatórios", modelo: "GPT-4o", tokens: 34210, custo: 1.02, duracao: "12.1s", status: "success", statusLabel: "Concluído" },
  { agente: "Classificador de Tickets", modelo: "Gemini Pro", tokens: 4312, custo: 0.06, duracao: "1.4s", status: "warning", statusLabel: "Lento" },
  { agente: "Extrator de Dados", modelo: "Claude 3.5", tokens: 15780, custo: 0.39, duracao: "5.7s", status: "success", statusLabel: "Concluído" },
  { agente: "Resumo Executivo", modelo: "GPT-4o", tokens: 22140, custo: 0.66, duracao: "8.3s", status: "success", statusLabel: "Concluído" },
  { agente: "Monitor de SLA", modelo: "Gemini Pro", tokens: 3100, custo: 0.04, duracao: "0.9s", status: "error", statusLabel: "Falha" },
  { agente: "Tradutor Jurídico", modelo: "Claude 3.5", tokens: 18950, custo: 0.47, duracao: "6.5s", status: "success", statusLabel: "Concluído" },
]

const columns: Column<AgentExecution>[] = [
  {
    header: "Agente",
    accessor: "agente",
  },
  {
    header: "Modelo",
    accessor: "modelo",
  },
  {
    header: "Tokens",
    accessor: "tokens",
    align: "right",
    mono: true,
    render: (v) => (v as number).toLocaleString("pt-BR"),
  },
  {
    header: "Custo",
    accessor: "custo",
    align: "right",
    mono: true,
    render: (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(v as number),
  },
  {
    header: "Duração",
    accessor: "duracao",
    align: "right",
    mono: true,
  },
  {
    header: "Status",
    accessor: "status",
    align: "center",
    render: (_v, row) => (
      <StatusBadge variant={row.status}>{row.statusLabel}</StatusBadge>
    ),
  },
]

/* ─── PAGE ────────────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-6 md:px-8 lg:px-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-[var(--indra-white)]">
          Central de Comando
        </h1>
        <p className="mt-0.5 text-[13px] text-[var(--indra-light)]">
          Visão geral da plataforma AgentVerse — atualizado em tempo real
        </p>
      </header>

      {/* KPI Row */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} index={i} {...kpi} />
        ))}
      </section>

      {/* Bento Grid: Activity + Cost | Operational Status */}
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-4">
          <Panel title="Atividade de Agentes (24h)" subtitle="Volume de agentes processando por hora">
            <AgentActivityChart />
          </Panel>
          <Panel title="Distribuição de Custos por Vendor" subtitle="Mês corrente — acumulado">
            <CostBreakdownChart />
          </Panel>
        </div>
        <Panel title="Status Operacional" subtitle="Saúde dos subsistemas em tempo real">
          <BulletList items={statusItems} />
        </Panel>
      </section>

      {/* Data Table */}
      <section>
        <Panel
          title="Execuções Recentes de Agentes"
          subtitle="Últimas 8 execuções registradas na plataforma"
        >
          <DataTable columns={columns} data={executions} pageSize={8} />
        </Panel>
      </section>
    </main>
  )
}
