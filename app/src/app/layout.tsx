import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { DashShell } from "@/components/layout/dash-shell"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "AgentVerse | Plataforma de Agentes IA",
  description:
    "Plataforma corporativa de orquestração e observabilidade de agentes de inteligência artificial. Gerencie esquadrões de agentes, monitore custos FinOps e acompanhe métricas em tempo real.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <DashShell>{children}</DashShell>
      </body>
    </html>
  )
}
