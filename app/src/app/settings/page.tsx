"use client"

import { useState, useEffect } from "react"
import { Panel } from "@/components/ui/panel"
import { KPICard } from "@/components/ui/kpi-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Save, Settings, Moon, Sun, Layers, Layout, Key, ShieldAlert } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [density, setDensity] = useState("spacious")
  const [layout, setLayout] = useState("sidebar")
  const [openaiKey, setOpenaiKey] = useState("••••••••••••••••••••")
  const [anthropicKey, setAnthropicKey] = useState("••••••••••••••••••••")
  const [geminiKey, setGeminiKey] = useState("••••••••••••••••••••")
  const [saved, setSaved] = useState(false)

  // Load initial attributes from html element
  useEffect(() => {
    const html = document.documentElement
    setTheme(html.getAttribute("data-theme") || "dark")
    setDensity(html.getAttribute("data-density") || "spacious")
    setLayout(html.getAttribute("data-layout") || "sidebar")
  }, [])

  const handleSave = () => {
    const html = document.documentElement
    html.setAttribute("data-theme", theme)
    html.setAttribute("data-density", density)
    html.setAttribute("data-layout", layout)
    
    // Save to local storage for persistence
    localStorage.setItem("agentverse-theme", theme)
    localStorage.setItem("agentverse-density", density)
    localStorage.setItem("agentverse-layout", layout)

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="min-h-screen px-6 py-6 md:px-8 lg:px-8">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--indra-white)]">
            Configurações do Sistema
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--indra-light)]">
            Personalize o layout, mude temas e gerencie credenciais de fornecedores de IA.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-md bg-[var(--indra-cyan)] px-4 py-2 text-xs font-semibold text-[var(--indra-deep)] shadow-[0_4px_12px_rgba(0,176,189,0.2)] transition-all hover:bg-[var(--indra-cyan)]/85 hover:shadow-[0_4px_16px_rgba(0,176,189,0.35)]"
        >
          <Save size={14} />
          {saved ? "Salvo!" : "Salvar Configurações"}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Customization Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Panel title="Aparência e Design" subtitle="Controles dinâmicos baseados no Indra Design System.">
            <div className="flex flex-col gap-6">
              {/* Theme Toggle */}
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-3">
                  Tema Visual
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      theme === "dark"
                        ? "border-[var(--indra-cyan)] bg-[rgba(0,176,189,0.06)] text-[var(--indra-white)]"
                        : "border-[var(--indra-border)] bg-[var(--indra-dark)]/40 text-[var(--indra-light)] hover:text-[var(--indra-white)] hover:border-[var(--indra-border)]/80"
                    }`}
                  >
                    <Moon size={18} className={theme === "dark" ? "text-[var(--indra-cyan)]" : ""} />
                    <div>
                      <p className="text-sm font-semibold">Indra Classic Dark</p>
                      <p className="text-[11px] text-[var(--indra-light)] opacity-80 mt-0.5">Deep Blue & Cyan corporativo.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme("graphite")}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      theme === "graphite"
                        ? "border-[var(--indra-cyan)] bg-[rgba(0,176,189,0.06)] text-[var(--indra-white)]"
                        : "border-[var(--indra-border)] bg-[var(--indra-dark)]/40 text-[var(--indra-light)] hover:text-[var(--indra-white)] hover:border-[var(--indra-border)]/80"
                    }`}
                  >
                    <Sun size={18} className={theme === "graphite" ? "text-[var(--indra-cyan)]" : ""} />
                    <div>
                      <p className="text-sm font-semibold">Graphite Platinum</p>
                      <p className="text-[11px] text-[var(--indra-light)] opacity-80 mt-0.5">Tom cinza/carbono minimalista.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Density Toggle */}
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-3">
                  Densidade da Interface
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setDensity("spacious")}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      density === "spacious"
                        ? "border-[var(--indra-cyan)] bg-[rgba(0,176,189,0.06)] text-[var(--indra-white)]"
                        : "border-[var(--indra-border)] bg-[var(--indra-dark)]/40 text-[var(--indra-light)] hover:text-[var(--indra-white)] hover:border-[var(--indra-border)]/80"
                    }`}
                  >
                    <Layers size={18} className={density === "spacious" ? "text-[var(--indra-cyan)]" : ""} />
                    <div>
                      <p className="text-sm font-semibold">Espaçoso (Padrão)</p>
                      <p className="text-[11px] text-[var(--indra-light)] opacity-80 mt-0.5">Foco em legibilidade e respiro visual.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setDensity("compact")}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      density === "compact"
                        ? "border-[var(--indra-cyan)] bg-[rgba(0,176,189,0.06)] text-[var(--indra-white)]"
                        : "border-[var(--indra-border)] bg-[var(--indra-dark)]/40 text-[var(--indra-light)] hover:text-[var(--indra-white)] hover:border-[var(--indra-border)]/80"
                    }`}
                  >
                    <Layers size={18} className={density === "compact" ? "text-[var(--indra-cyan)]" : ""} />
                    <div>
                      <p className="text-sm font-semibold">Compacto</p>
                      <p className="text-[11px] text-[var(--indra-light)] opacity-80 mt-0.5">Mais informação e grids condensados.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Layout Toggle */}
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-3">
                  Modo de Layout
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setLayout("sidebar")}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      layout === "sidebar"
                        ? "border-[var(--indra-cyan)] bg-[rgba(0,176,189,0.06)] text-[var(--indra-white)]"
                        : "border-[var(--indra-border)] bg-[var(--indra-dark)]/40 text-[var(--indra-light)] hover:text-[var(--indra-white)] hover:border-[var(--indra-border)]/80"
                    }`}
                  >
                    <Layout size={18} className={layout === "sidebar" ? "text-[var(--indra-cyan)]" : ""} />
                    <div>
                      <p className="text-sm font-semibold">Sidebar de Navegação</p>
                      <p className="text-[11px] text-[var(--indra-light)] opacity-80 mt-0.5">Sidebar fixa lateral de 260px.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setLayout("topbar")}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      layout === "topbar"
                        ? "border-[var(--indra-cyan)] bg-[rgba(0,176,189,0.06)] text-[var(--indra-white)]"
                        : "border-[var(--indra-border)] bg-[var(--indra-dark)]/40 text-[var(--indra-light)] hover:text-[var(--indra-white)] hover:border-[var(--indra-border)]/80"
                    }`}
                  >
                    <Layout size={18} className={layout === "topbar" ? "text-[var(--indra-cyan)]" : ""} />
                    <div>
                      <p className="text-sm font-semibold">Topbar Horizontal</p>
                      <p className="text-[11px] text-[var(--indra-light)] opacity-80 mt-0.5">Navegação no topo sem menu lateral.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Panel>

          {/* API Keys Panel */}
          <Panel title="API Credentials" subtitle="Configure as chaves dos modelos de linguagem para os esquadrões de agentes.">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  OpenAI API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--indra-light)]">
                      <Key size={14} />
                    </span>
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 pl-9 pr-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Anthropic API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--indra-light)]">
                      <Key size={14} />
                    </span>
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 pl-9 pr-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Google Gemini API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--indra-light)]">
                      <Key size={14} />
                    </span>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 pl-9 pr-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-6">
          <Panel title="Segurança & Cotas" subtitle="Status das integrações globais.">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--indra-border)] pb-3">
                <span className="text-[12px] text-[var(--indra-light)]">Autenticação SSO</span>
                <StatusBadge variant="go" label="Ativo" />
              </div>

              <div className="flex items-center justify-between border-b border-[var(--indra-border)] pb-3">
                <span className="text-[12px] text-[var(--indra-light)]">Auditoria de Logs</span>
                <StatusBadge variant="go" label="Ativo" />
              </div>

              <div className="flex items-center justify-between border-b border-[var(--indra-border)] pb-3">
                <span className="text-[12px] text-[var(--indra-light)]">Criptografia Base</span>
                <StatusBadge variant="go" label="AES-256" />
              </div>

              <div className="rounded-md border border-[var(--indra-error)]/20 bg-[var(--indra-error)]/5 p-4 flex gap-3 mt-2">
                <ShieldAlert className="text-[var(--indra-error)] shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-[12px] font-semibold text-[var(--indra-white)]">Aviso de Chaves</h4>
                  <p className="text-[11px] text-[var(--indra-light)] leading-relaxed mt-0.5">
                    As chaves configuradas acima são salvas em memória local criptografada de forma segura e enviadas apenas para os respectivos Gateways.
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Informações do Sistema" subtitle="Ambiente de execução.">
            <div className="flex flex-col gap-3 font-mono text-[11px] text-[var(--indra-light)]">
              <div className="flex justify-between">
                <span>Versão Next.js:</span>
                <span className="text-[var(--indra-white)]">16.2.6</span>
              </div>
              <div className="flex justify-between">
                <span>React:</span>
                <span className="text-[var(--indra-white)]">19.2.4</span>
              </div>
              <div className="flex justify-between">
                <span>Node.js:</span>
                <span className="text-[var(--indra-white)]">v20.11.1</span>
              </div>
              <div className="flex justify-between">
                <span>Tailwind CSS:</span>
                <span className="text-[var(--indra-white)]">v4.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Database Status:</span>
                <span className="text-[var(--indra-success)]">CONNECTED</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  )
}
