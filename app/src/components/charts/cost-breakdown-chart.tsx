"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { formatBRL } from "@/lib/utils"

const costData = [
  { name: "OpenAI", value: 7820.5, color: "var(--indra-cyan)" },
  { name: "Anthropic", value: 4215.8, color: "var(--indra-teal)" },
  { name: "Google", value: 2890.0, color: "var(--indra-secondary)" },
  { name: "AWS Bedrock", value: 1525.0, color: "var(--indra-primary)" },
]

const total = costData.reduce((sum, d) => sum + d.value, 0)

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { color: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const pct = ((item.value / total) * 100).toFixed(1)
  return (
    <div
      className="rounded-lg border border-[var(--indra-border)] px-3 py-2 shadow-xl"
      style={{ background: "var(--indra-dark)", backdropFilter: "blur(12px)" }}
    >
      <p className="text-[11px] font-medium text-[var(--indra-light)]">
        {item.name}
      </p>
      <p
        className="text-sm font-bold"
        style={{ color: item.payload.color, fontFeatureSettings: "'tnum'" }}
      >
        {formatBRL(item.value)}
      </p>
      <p className="text-[10px] text-[var(--indra-light)]">{pct}% do total</p>
    </div>
  )
}

interface LegendItemProps {
  payload?: Array<{
    value: string
    color: string
    payload: { value: number }
  }>
}

function CustomLegend({ payload }: LegendItemProps) {
  if (!payload) return null
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-[11px] text-[var(--indra-light)]">
            {entry.value}
          </span>
          <span
            className="text-[11px] font-medium text-[var(--indra-white)]"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            {formatBRL(entry.payload.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CostBreakdownChart() {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={costData}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {costData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ paddingBottom: 48 }}>
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--indra-light)]">
            Total
          </p>
          <p
            className="text-lg font-bold text-[var(--indra-white)]"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            {formatBRL(total)}
          </p>
        </div>
      </div>
    </div>
  )
}
