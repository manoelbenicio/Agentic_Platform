"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface PanelProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  animationDelay?: number
}

export function Panel({
  title,
  subtitle,
  children,
  className,
  animationDelay = 0,
}: PanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: animationDelay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "panel overflow-hidden rounded-lg",
        "border border-[var(--indra-border)]",
        "bg-[var(--indra-card-surface)]",
        "p-6",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:border-[rgba(0,176,189,0.15)]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {/* Panel header */}
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h3 className="text-[16px] font-semibold text-[var(--indra-white)]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-[12px] text-[var(--indra-light)]">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Panel body */}
      {children}
    </motion.section>
  )
}
