"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const mockData = Array.from({ length: 24 }, (_, i) => {
  const base = 12
  const peak = i >= 8 && i <= 18 ? 25 + Math.sin((i - 8) * 0.6) * 18 : base
  const noise = Math.round((Math.random() - 0.5) * 6)
  return {
    hour: `${String(i).padStart(2, "0")}h`,
    agentes: Math.max(4, Math.round(peak + noise)),
  }
})

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border border-[var(--indra-border)] px-3 py-2 shadow-xl"
      style={{ background: "var(--indra-dark)", backdropFilter: "blur(12px)" }}
    >
      <p className="text-[11px] font-medium text-[var(--indra-light)]">
        {label}
      </p>
      <p
        className="text-sm font-bold text-[var(--indra-cyan)]"
        style={{ fontFeatureSettings: "'tnum'" }}
      >
        {payload[0].value} agentes
      </p>
    </div>
  )
}

export function AgentActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={mockData}
        margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
      >
        <defs>
          <linearGradient id="agentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--indra-cyan)"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="var(--indra-cyan)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="hour"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "var(--indra-light)",
            fontSize: 10,
            fontFamily: "var(--font-mono)",
          }}
          interval={2}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "var(--indra-light)",
            fontSize: 10,
            fontFamily: "var(--font-mono)",
          }}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="agentes"
          stroke="var(--indra-cyan)"
          strokeWidth={2}
          fill="url(#agentGradient)"
          dot={false}
          activeDot={{
            r: 4,
            fill: "var(--indra-cyan)",
            stroke: "var(--indra-dark)",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
