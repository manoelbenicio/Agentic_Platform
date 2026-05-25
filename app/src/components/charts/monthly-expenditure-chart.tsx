"use client"

import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatBRL } from "@/lib/utils"

const chartData = [
  { month: "Jan", gastos: 10250.00, limite: 15000.00 },
  { month: "Fev", gastos: 11800.00, limite: 15000.00 },
  { month: "Mar", gastos: 12400.00, limite: 15000.00 },
  { month: "Abr", gastos: 14100.00, limite: 20000.00 },
  { month: "Mai", gastos: 15600.00, limite: 20000.00 },
  { month: "Jun", gastos: 16451.30, limite: 24000.00 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    dataKey: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="rounded-lg border border-[var(--indra-border)] px-3 py-2.5 shadow-xl flex flex-col gap-1"
      style={{ background: "var(--indra-dark)", backdropFilter: "blur(12px)" }}
    >
      <p className="text-[11px] font-semibold text-[var(--indra-light)] uppercase tracking-[0.06em]">
        Mês: {label}
      </p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-[11px] text-[var(--indra-light)]">
              {item.name}
            </span>
          </div>
          <span
            className="text-xs font-bold font-mono"
            style={{ color: item.color }}
          >
            {formatBRL(item.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function CustomLegend({ payload }: { payload?: any[] }) {
  if (!payload) return null
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          {entry.dataKey === "limite" ? (
            <div className="flex items-center gap-0.5">
              <span className="h-0.5 w-2 bg-[var(--indra-error)]" />
              <span className="h-0.5 w-1 bg-[var(--indra-error)] opacity-40" />
              <span className="h-0.5 w-2 bg-[var(--indra-error)]" />
            </div>
          ) : (
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: entry.color }}
            />
          )}
          <span className="text-[11px] font-medium text-[var(--indra-light)] uppercase tracking-[0.04em]">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MonthlyExpenditureChart() {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={chartData}
          margin={{ top: 12, right: 8, left: -8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="budgetAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--indra-error)" stopOpacity={0.06} />
              <stop offset="95%" stopColor="var(--indra-error)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--indra-cyan)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--indra-primary)" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--indra-light)",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--indra-light)",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
            }}
            tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          
          {/* Budget Limit Area (shaded region) */}
          <Area
            type="monotone"
            dataKey="limite"
            name="Orçamento (Área)"
            stroke="none"
            fill="url(#budgetAreaGradient)"
            legendType="none"
          />

          {/* Actual Expense Bar */}
          <Bar
            dataKey="gastos"
            name="Custo Real (BRL)"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />

          {/* Budget Limit Line */}
          <Line
            type="monotone"
            dataKey="limite"
            name="Limite de Orçamento"
            stroke="var(--indra-error)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
