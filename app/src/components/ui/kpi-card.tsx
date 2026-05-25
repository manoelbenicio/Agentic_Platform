"use client"

import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  label: string
  value: string | number
  change?: "up" | "down" | "neutral"
  changeText?: string
  trend?: React.ReactNode
  icon?: React.ReactNode
  index?: number
  animationDelay?: number
  className?: string
}

const changeConfig = {
  up: {
    icon: ArrowUp,
    color: "text-[var(--indra-success)]",
    bg: "bg-[var(--indra-success)]/10",
  },
  down: {
    icon: ArrowDown,
    color: "text-[var(--indra-error)]",
    bg: "bg-[var(--indra-error)]/10",
  },
  neutral: {
    icon: Minus,
    color: "text-[var(--indra-light)]",
    bg: "bg-[var(--indra-light)]/10",
  },
} as const

export function KPICard({
  label,
  value,
  change = "neutral",
  changeText,
  trend,
  icon,
  index = 0,
  animationDelay,
  className,
}: KPICardProps) {
  // Support both index-based animation delay and explicit animationDelay
  const delay = animationDelay ?? index * 0.08
  const hasChange = changeText !== undefined
  const config = changeConfig[change]
  const ChangeIcon = config?.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "kpi-card group relative overflow-hidden rounded-lg",
        "border border-[var(--indra-border)]",
        "bg-[rgba(0,62,80,0.4)] backdrop-blur-md",
        "p-5 pl-7",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:-translate-y-[3px] hover:border-[rgba(0,176,189,0.3)]",
        "hover:shadow-[0_8px_32px_rgba(0,176,189,0.12)]",
        className
      )}
    >
      {/* Left cyan stripe */}
      <span
        className="absolute left-0 top-0 h-full w-1 bg-[var(--indra-cyan)]"
        aria-hidden="true"
      />

      {/* Header: Label + Icon */}
      <div className="mb-2 flex items-center justify-between">
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.08em]",
            "text-[var(--indra-light)]"
          )}
        >
          {label}
        </p>
        {icon && (
          <span className="text-[var(--indra-cyan)] opacity-70 transition-opacity group-hover:opacity-100">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p
        className={cn(
          "text-[32px] font-bold leading-none tracking-tight",
          "text-[var(--indra-white)]",
          "font-[var(--font-mono)] tabular-nums"
        )}
      >
        {value}
      </p>

      {/* Footer: Trend (ReactNode) or Change (from CVA) */}
      {(trend || hasChange) && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend ? (
            <div className="text-[11px] font-medium text-[var(--indra-light)] flex items-center gap-1">
              {trend}
            </div>
          ) : (
            hasChange && ChangeIcon && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                  "text-[11px] font-semibold",
                  config.color,
                  config.bg
                )}
              >
                <ChangeIcon size={12} />
                {changeText}
              </span>
            )
          )}
        </div>
      )}
    </motion.div>
  )
}
