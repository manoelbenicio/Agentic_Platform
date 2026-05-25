"use client"

import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/ui/status-badge"

interface DashTopbarProps {
  title?: string
  className?: string
}

export function DashTopbar({ title = "Command Center", className }: DashTopbarProps) {
  return (
    <header
      className={cn(
        "dash-topbar sticky top-0 z-50 flex h-14 items-center justify-between px-8",
        "border-b border-[var(--indra-border)]",
        "bg-[var(--indra-deep)]",
        className
      )}
    >
      {/* ── Left: Page title ── */}
      <h1 className="text-[16px] font-semibold text-[var(--indra-white)]">
        {title}
      </h1>

      {/* ── Right: Status + Notification + Avatar ── */}
      <div className="flex items-center gap-5">
        {/* Status badge */}
        <StatusBadge variant="go" label="Operacional" />

        {/* Notification bell */}
        <button
          type="button"
          className={cn(
            "relative flex items-center justify-center rounded-md p-2",
            "text-[var(--indra-light)] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "hover:text-[var(--indra-white)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--indra-cyan)]"
          )}
          aria-label="Notificações"
        >
          <Bell size={18} />
          {/* Notification dot */}
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--indra-cyan)]"
            aria-hidden="true"
          />
        </button>

        {/* Avatar circle */}
        <button
          type="button"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            "border-2 border-[var(--indra-cyan)]",
            "bg-[var(--indra-primary)]",
            "text-[11px] font-bold text-[var(--indra-white)]",
            "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "hover:shadow-[0_0_12px_rgba(0,176,189,0.3)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--indra-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--indra-deep)]"
          )}
          aria-label="Menu do usuário"
        >
          AV
        </button>
      </div>
    </header>
  )
}
