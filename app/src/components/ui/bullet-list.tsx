"use client"

import { cn } from "@/lib/utils"

export type BulletVariant = "success" | "warning" | "error" | "info"

export interface BulletItem {
  dot: BulletVariant
  title: string
  text: string
  meta?: string
}

export interface BulletListProps {
  items: BulletItem[]
  className?: string
}

const dotStyles: Record<BulletVariant, string> = {
  success: "bg-[var(--indra-success)]",
  warning: "bg-[var(--indra-warning)]",
  error: "bg-[var(--indra-error)] shadow-[0_0_8px_2px_rgba(233,30,99,0.3)]",
  info: "bg-[var(--indra-cyan)]",
}

export function BulletList({ items, className }: BulletListProps) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            "flex items-start gap-3 py-3 px-1",
            i < items.length - 1 && "border-b border-[var(--indra-border)]"
          )}
          style={{
            animation: "fadeInUp 0.4s ease both",
            animationDelay: `${i * 100}ms`,
          }}
        >
          {/* Dot */}
          <span className="mt-1.5 flex-shrink-0">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                dotStyles[item.dot]
              )}
            />
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--indra-white)]">
              {item.title}
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--indra-light)]">
              {item.text}
            </p>
          </div>

          {/* Meta */}
          {item.meta && (
            <span
              className="flex-shrink-0 text-[11px] text-[var(--indra-light)]"
              style={{ fontFamily: "var(--font-mono)", fontFeatureSettings: "'tnum'" }}
            >
              {item.meta}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
