import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  [
    "inline-flex items-center gap-2 rounded-full px-3 py-1",
    "text-[11px] font-semibold uppercase tracking-[0.08em]",
    "border",
  ].join(" "),
  {
    variants: {
      variant: {
        go: "border-[var(--indra-success)]/30 bg-[var(--indra-success)]/10 text-[var(--indra-success)]",
        nogo: "border-[var(--indra-error)]/30 bg-[var(--indra-error)]/10 text-[var(--indra-error)] animate-[criticalPulse_2s_ease-in-out_infinite]",
        caution: "border-[var(--indra-warning)]/30 bg-[var(--indra-warning)]/10 text-[var(--indra-warning)]",
        success: "border-[var(--indra-success)]/30 bg-[var(--indra-success)]/10 text-[var(--indra-success)]",
        warning: "border-[var(--indra-warning)]/30 bg-[var(--indra-warning)]/10 text-[var(--indra-warning)]",
        error: "border-[var(--indra-error)]/30 bg-[var(--indra-error)]/10 text-[var(--indra-error)] animate-[criticalPulse_2s_ease-in-out_infinite]",
        info: "border-[var(--indra-cyan)]/30 bg-[var(--indra-cyan)]/10 text-[var(--indra-cyan)]",
        neutral: "border-[var(--indra-border)] bg-[rgba(255,255,255,0.06)] text-[var(--indra-light)]",
      },
    },
    defaultVariants: {
      variant: "go",
    },
  }
)

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children?: React.ReactNode
  label?: string
  className?: string
}

export function StatusBadge({ variant, children, label, className }: StatusBadgeProps) {
  const content = children ?? label
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {/* Glow dot */}
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
          "bg-current shadow-[0_0_6px_currentColor]"
        )}
        aria-hidden="true"
      />
      {content}
    </span>
  )
}
