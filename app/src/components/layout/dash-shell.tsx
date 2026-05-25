import { cn } from "@/lib/utils"
import { DashSidebar } from "@/components/layout/sidebar"
import { DashTopbar } from "@/components/layout/topbar"

interface DashShellProps {
  children: React.ReactNode
  theme?: "dark" | "graphite"
  density?: "spacious" | "compact"
  layout?: "sidebar" | "topbar"
  className?: string
}

export function DashShell({
  children,
  theme = "dark",
  density = "spacious",
  layout = "sidebar",
  className,
}: DashShellProps) {
  return (
    <div
      className={cn("dash-shell flex min-h-screen", className)}
      data-theme={theme}
      data-density={density}
      data-layout={layout}
    >
      {/* A11y: Skip to content */}
      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo
      </a>

      {/* Sidebar */}
      <DashSidebar />

      {/* Main area */}
      <main
        id="main-content"
        className={cn(
          "dash-main flex min-h-screen flex-1 flex-col",
          "ml-[260px]"
        )}
      >
        {/* Topbar */}
        <DashTopbar />

        {/* Content */}
        <div className="dash-content flex-1 p-6 px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
