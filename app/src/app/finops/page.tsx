"use client"

import { useState } from "react"
import { DollarSign, Wallet, Percent, TrendingDown, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { KPICard } from "@/components/ui/kpi-card"
import { Panel } from "@/components/ui/panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatBRL } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Monthly Expenditure Data
const monthlyData = [
  { month: "Jan", custo: 8430, limit: 15000 },
  { month: "Fev", custo: 9812, limit: 15000 },
  { month: "Mar", custo: 11450, limit: 15000 },
  { month: "Abr", custo: 14120, limit: 20000 },
  { month: "Mai", custo: 16451, limit: 24000 },
]

// LLM Token Usage Distribution Data
const tokenDistribution = [
  { name: "GPT-4o", value: 45, color: "var(--indra-cyan)" },
  { name: "Claude 3.5 Sonnet", value: 30, color: "var(--indra-teal)" },
  { name: "Gemini 1.5 Flash", value: 15, color: "var(--indra-primary)" },
  { name: "Llama 3.1", value: 10, color: "var(--indra-secondary)" },
]

interface Recommendation {
  id: string
  agente: string
  modeloAtual: string
  recomendacao: string
  economia: number
  aplicada: boolean
}

export default function FinOpsPage() {
  // Recommendations state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      agente: "Atendimento L1",
      modeloAtual: "GPT-4o",
      recomendacao: "Substituir por Gemini 1.5 Flash",
      economia: 0.85, // 85% economy
      aplicada: false,
    },
    {
      id: "2",
      agente: "Classificador de Tickets",
      modeloAtual: "Claude 3.5 Sonnet",
      recomendacao: "Migrar para Llama 3.1 8B",
      economia: 0.90, // 90% economy
      aplicada: false,
    },
    {
      id: "3",
      agente: "Gerador de Relatórios",
      modeloAtual: "GPT-4o",
      recomendacao: "Ativar Cache de Prompt Semântico",
      economia: 0.35, // 35% economy
      aplicada: false,
    },
    {
      id: "4",
      agente: "Resumo de Reuniões",
      modeloAtual: "Claude 3.5 Sonnet",
      recomendacao: "Utilizar GPT-4o-mini",
      economia: 0.60, // 60% economy
      aplicada: false,
    },
  ])

  const handleApply = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, aplicada: true } : rec))
    )
  }

  return (
    <main className="min-h-screen px-6 py-6 md:px-8 lg:px-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-[var(--indra-white)]">
          FinOps Command Center
        </h1>
        <p className="mt-0.5 text-[13px] text-[var(--indra-light)]">
          Análise em tempo real de consumo de APIs de IA, limites de orçamentos e sugestões automáticas de redução de custos.
        </p>
      </header>

      {/* KPIs */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Custo Total (Mês)"
          value="R$ 16.451,30"
          change="up"
          changeText="+14% vs abr"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          label="Economia Projetada"
          value="R$ 3.820,00"
          change="down"
          changeText="Projeção Anual"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <KPICard
          label="Custo Médio / Task"
          value="R$ 0,05"
          change="neutral"
          changeText="Estável"
          icon={<Percent className="h-4 w-4" />}
        />
        <KPICard
          label="Consumo Orçamento"
          value="68,5%"
          change="neutral"
          changeText="Cota: R$ 24.000,00"
          icon={<Wallet className="h-4 w-4" />}
        />
      </section>

      {/* Bento Grid: Trend Chart & Model distribution */}
      <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Expenditure trend bar chart */}
        <div className="lg:col-span-2">
          <Panel
            title="Evolução de Gastos vs Limite"
            subtitle="Gráfico de barras acumuladas do ano comparadas aos limites mensais de orçamento."
          >
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--indra-light)" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="var(--indra-light)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `R$ ${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--indra-dark)",
                      borderColor: "var(--indra-border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--indra-light)", fontSize: "11px" }}
                    itemStyle={{ color: "var(--indra-cyan)", fontSize: "12px", fontWeight: "bold" }}
                    formatter={(value: any) => [formatBRL(value), "Valor"]}
                  />
                  <Bar dataKey="custo" fill="var(--indra-cyan)" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="limit" fill="rgba(233,30,99,0.15)" stroke="var(--indra-error)" strokeDasharray="4 4" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* Model distribution pie chart */}
        <div>
          <Panel
            title="Distribuição de Uso (LLMs)"
            subtitle="Porcentagem de tokens processados por modelo de linguagem."
          >
            <div className="h-[280px] w-full flex flex-col justify-between">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {tokenDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--indra-dark)",
                        borderColor: "var(--indra-border)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "var(--indra-cyan)", fontSize: "12px" }}
                      formatter={(value: any) => [`${value}%`, "Volume Tokens"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--indra-light)] px-2">
                {tokenDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* Recommendations Panel */}
      <section>
        <Panel
          title="Otimizações Recomendadas"
          subtitle="Ações automáticas de redução de gastos sugeridas pela AI Engine do AgentVerse."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] text-[var(--indra-white)]">
              <thead>
                <tr className="border-b border-[var(--indra-border)] bg-[rgba(0,43,58,0.6)] text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--indra-light)]">
                  <th className="px-4 py-3">Agente</th>
                  <th className="px-4 py-3">Modelo Atual</th>
                  <th className="px-4 py-3">Recomendação de Otimização</th>
                  <th className="px-4 py-3 text-right">Economia Estimada</th>
                  <th className="px-4 py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--indra-border)]">
                {recommendations.map((rec) => (
                  <tr
                    key={rec.id}
                    className="transition-colors hover:bg-[rgba(0,176,189,0.04)] hover:shadow-[inset_3px_0_0_var(--indra-cyan)]"
                  >
                    <td className="px-4 py-3.5 font-semibold flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--indra-teal)]/10 text-[var(--indra-teal)]">
                        <ArrowUpRight size={13} />
                      </span>
                      {rec.agente}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs">{rec.modeloAtual}</td>
                    <td className="px-4 py-3.5 text-[var(--indra-light)]">{rec.recomendacao}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs text-[var(--indra-success)] font-semibold">
                      {(rec.economia * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {rec.aplicada ? (
                        <span className="inline-flex items-center gap-1 text-[var(--indra-success)] text-xs font-semibold">
                          <CheckCircle2 size={14} />
                          Aplicado
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApply(rec.id)}
                          className="rounded border border-[var(--indra-cyan)]/30 px-3 py-1 text-xs font-bold text-[var(--indra-cyan)] hover:bg-[var(--indra-cyan)] hover:text-[var(--indra-deep)] transition-colors"
                        >
                          Otimizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </main>
  )
}
