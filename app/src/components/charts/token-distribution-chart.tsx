"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { formatNumber } from "@/lib/utils"

const tokenData = [
  { name: "GPT-4o", value: 48000000, color: "var(--indra-cyan)" },
  { name: "Claude 3.5 Sonnet", value: 32000000, color: "var(--indra-teal)" },
  { name: "Gemini Flash", value: 21300000, color: "var(--indra-sky)" },
  { name: "Llama 3.1", value: 10700000, color: "var(--indra-primary)" },
]

const totalTokens = tokenData.reduce((sum, d) => sum + d.value, 0)

function formatTokenAbbreviation(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(".", ",")} M`
  }
  return formatNumber(value)
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: { color: string }
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const pct = ((item.value / totalTokens) * 100).toFixed(1)
  return (
    <div
      className="rounded-lg border border-[var(--indra-border)] px-3 py-2 shadow-xl"
      style={{ background: "var(--indra-dark)", backdropFilter: "blur(12px)" }}
    >
      <p className="text-[11px] font-semibold text-[var(--indra-light)] uppercase tracking-[0.06em]">
        {item.name}
      </p>
      <p
        className="text-sm font-bold font-mono"
        style={{ color: item.payload.color }}
      >
        {formatNumber(item.value)} tokens
      </p>
      <p className="text-[10px] text-[var(--indra-light)]">{pct.replace(".", ",")}% do total</p>
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
    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
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
            className="text-[11px] font-bold text-[var(--indra-white)] font-mono"
          >
            ({formatTokenAbbreviation(entry.payload.value)})
          </span>
        </div>
      ))}
    </div>
  )
}

export function TokenDistributionChart() {
  return (
    <div className="relative w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={tokenData}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {tokenData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center label */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingBottom: 48 }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--indra-light)]">
          Total Tokens
        </p>
        <p
          className="text-[20px] font-bold text-[var(--indra-white)] font-mono"
        >
          {formatTokenAbbreviation(totalTokens)}
        </p>
      </div>
    </div>
  )
}
