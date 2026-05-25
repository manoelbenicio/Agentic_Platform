"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutGrid,
  Users,
  DollarSign,
  Activity,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  separator?: boolean
}

const navItems: NavItem[] = [
  { id: "command-center", label: "Command Center", path: "/", icon: LayoutGrid },
  { id: "esquadroes", label: "Esquadrões", path: "/squads", icon: Users },
  { id: "finops", label: "FinOps", path: "/finops", icon: DollarSign },
  { id: "observabilidade", label: "Observabilidade", path: "/observability", icon: Activity },
  { id: "configuracoes", label: "Configurações", path: "/settings", icon: Settings, separator: true },
]

export function DashSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "dash-sidebar fixed top-0 left-0 z-40 flex h-screen w-[260px] flex-col",
        "border-r border-[var(--indra-border)]",
        "bg-[var(--indra-deep)]"
      )}
    >
      {/* ── Logo Section ── */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M18 2L33 10.5V27.5L18 36L3 27.5V10.5L18 2Z"
              stroke="var(--indra-cyan)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M18 8L27 13V25L18 30L9 25V13L18 8Z"
              fill="var(--indra-cyan)"
              opacity="0.15"
            />
            <path
              d="M18 14L22.5 16.5V22.5L18 25L13.5 22.5V16.5L18 14Z"
              fill="var(--indra-cyan)"
              opacity="0.5"
            />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span
            className="text-[15px] font-bold tracking-[0.04em] text-[var(--indra-white)]"
          >
            AGENTVERSE
          </span>
          <span
            className="text-[10px] font-medium tracking-[0.14em] text-[var(--indra-light)]"
          >
            MINSAIT
          </span>
        </div>
      </div>

      {/* ── Navigation Menu ── */}
      <nav className="sidebar-menu mt-4 flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon

          return (
            <div key={item.id}>
              {/* Separator line before settings */}
              {item.separator && (
                <div className="mx-3 my-3 h-px bg-[var(--indra-border)]" />
              )}

              <Link
                href={item.path}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-md px-4 py-2.5",
                  "text-[13px] font-medium",
                  "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--indra-cyan)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--indra-deep)]",
                  isActive
                    ? "bg-[rgba(0,176,189,0.06)] text-[var(--indra-cyan)]"
                    : "text-[var(--indra-light)] hover:bg-[rgba(255,255,255,0.02)] hover:text-[var(--indra-white)]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active left cyan stripe */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-[60%] w-1 -translate-y-1/2 rounded-r-sm bg-[var(--indra-cyan)]"
                    aria-hidden="true"
                  />
                )}

                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-[var(--indra-cyan)]"
                      : "text-[var(--indra-light)] group-hover:text-[var(--indra-white)]"
                  )}
                />

                <span>{item.label}</span>
              </Link>
            </div>
          )
        })}
      </nav>

      {/* ── Footer spacer ── */}
      <div className="px-6 py-4">
        <div className="text-[10px] text-[var(--indra-light)] opacity-40">
          v1.0.0
        </div>
      </div>
    </aside>
  )
}
