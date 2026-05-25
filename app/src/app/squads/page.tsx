"use client"

import { useState, useMemo } from "react"
import { Users, Bot, Code, Cpu, Plus, Sparkles, FolderKanban, CheckSquare } from "lucide-react"
import { KPICard } from "@/components/ui/kpi-card"
import { Panel } from "@/components/ui/panel"
import { StatusBadge } from "@/components/ui/status-badge"

interface Agent {
  id: string
  nome: string
  esquadrao: string
  framework: "CrewAI" | "LangChain" | "AutoGen" | "Custom Gemini"
  tarefa: string
  projeto: string
  status: "go" | "caution" | "nogo"
  statusLabel: string
}

export default function SquadsPage() {
  // State for the list of agents
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      nome: "FinAnalyst Pro",
      esquadrao: "Financeiro",
      framework: "CrewAI",
      tarefa: "Conciliação de DFs",
      projeto: "Minsait Finance",
      status: "go",
      statusLabel: "Ativo",
    },
    {
      id: "2",
      nome: "SupportBot L1",
      esquadrao: "Atendimento",
      framework: "LangChain",
      tarefa: "Triagem de Suporte",
      projeto: "Customer Care",
      status: "go",
      statusLabel: "Ativo",
    },
    {
      id: "3",
      nome: "DevOps Sentinel",
      esquadrao: "Engenharia",
      framework: "AutoGen",
      tarefa: "Revisão de Codebase",
      projeto: "DevOps Auto",
      status: "go",
      statusLabel: "Ativo",
    },
    {
      id: "4",
      nome: "Marketing Genius",
      esquadrao: "Marketing",
      framework: "CrewAI",
      tarefa: "Geração de Conteúdo",
      projeto: "Sales Campaign",
      status: "caution",
      statusLabel: "Ajustando",
    },
    {
      id: "5",
      nome: "SLA Tracker",
      esquadrao: "Operações",
      framework: "Custom Gemini",
      tarefa: "Monitor de Latência",
      projeto: "System Observability",
      status: "nogo",
      statusLabel: "Erro de Chave",
    },
  ])

  // Form State
  const [nome, setNome] = useState("")
  const [esquadrao, setEsquadrao] = useState("Financeiro")
  const [framework, setFramework] = useState("CrewAI")
  const [tarefa, setTarefa] = useState("Geração de DFs")
  const [projeto, setProjeto] = useState("Minsait Finance")
  const [customPrompt, setCustomPrompt] = useState("")

  // Available options
  const tasks = [
    { name: "Conciliação de DFs", ref: "Geração de DFs", best: "CrewAI" },
    { name: "Triagem de Suporte", ref: "Atendimento L1", best: "LangChain" },
    { name: "Revisão de Codebase", ref: "Automação DevOps", best: "AutoGen" },
    { name: "Monitor de Latência", ref: "Observabilidade", best: "Custom Gemini" },
    { name: "Geração de Conteúdo", ref: "Redação de Posts", best: "CrewAI" },
  ]

  const projects = [
    "Minsait Finance",
    "Customer Care",
    "DevOps Auto",
    "Sales Campaign",
    "System Observability",
  ]

  // Dynamic recommendation based on selected task
  const recommendedFramework = useMemo(() => {
    const matched = tasks.find((t) => t.name === tarefa)
    return matched ? matched.best : "CrewAI"
  }, [tarefa])

  // Apply recommendation to the select input
  const applyRecommendation = () => {
    setFramework(recommendedFramework)
  }

  // Handle agent framework change in the table
  const handleFrameworkChange = (id: string, nextFramework: "CrewAI" | "LangChain" | "AutoGen" | "Custom Gemini") => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, framework: nextFramework } : agent
      )
    )
  }

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return

    const newAgent: Agent = {
      id: String(agents.length + 1),
      nome,
      esquadrao,
      framework: framework as any,
      tarefa,
      projeto,
      status: "go",
      statusLabel: "Ativo",
    }

    setAgents((prev) => [...prev, newAgent])
    setNome("")
    setCustomPrompt("")
  }

  return (
    <main className="min-h-screen px-6 py-6 md:px-8 lg:px-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-[var(--indra-white)]">
          Esquadrões de Agentes
        </h1>
        <p className="mt-0.5 text-[13px] text-[var(--indra-light)]">
          Gerencie esquadrões de inteligência artificial e configure frameworks por tarefas e projetos.
        </p>
      </header>

      {/* KPIs */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total de Esquadrões" value="4" icon={<Users className="h-4 w-4" />} />
        <KPICard label="Agentes Alocados" value={agents.length} icon={<Bot className="h-4 w-4" />} />
        <KPICard label="Frameworks Ativos" value="3" icon={<Code className="h-4 w-4" />} />
        <KPICard
          label="Eficiência Operacional"
          value="94%"
          trend={<span className="text-[var(--indra-success)]">▲ +1.2% SLA</span>}
          icon={<Cpu className="h-4 w-4" />}
        />
      </section>

      {/* Bento Grid layout */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Active Squads Table */}
        <div className="lg:col-span-2">
          <Panel
            title="Esquadrões Ativos"
            subtitle="Lista de agentes orchestrados com flexibilidade de framework."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] text-[var(--indra-white)]">
                <thead>
                  <tr className="border-b border-[var(--indra-border)] bg-[rgba(0,43,58,0.6)] text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--indra-light)]">
                    <th className="px-4 py-3">Agente</th>
                    <th className="px-4 py-3">Esquadrão</th>
                    <th className="px-4 py-3">Framework</th>
                    <th className="px-4 py-3">Tarefa Principal</th>
                    <th className="px-4 py-3">Projeto</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--indra-border)]">
                  {agents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="transition-colors hover:bg-[rgba(0,176,189,0.04)] hover:shadow-[inset_3px_0_0_var(--indra-cyan)]"
                    >
                      <td className="px-4 py-3.5 font-semibold flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--indra-cyan)]/10 text-[var(--indra-cyan)]">
                          <Bot size={13} />
                        </span>
                        {agent.nome}
                      </td>
                      <td className="px-4 py-3.5 text-[var(--indra-light)]">{agent.esquadrao}</td>
                      <td className="px-4 py-3.5">
                        <select
                          value={agent.framework}
                          onChange={(e) =>
                            handleFrameworkChange(
                              agent.id,
                              e.target.value as any
                            )
                          }
                          className="bg-[var(--indra-deep)] border border-[var(--indra-border)] text-xs rounded px-2 py-1 outline-none text-[var(--indra-cyan)] focus:border-[var(--indra-cyan)] cursor-pointer"
                        >
                          <option value="CrewAI">CrewAI</option>
                          <option value="LangChain">LangChain</option>
                          <option value="AutoGen">AutoGen</option>
                          <option value="Custom Gemini">Custom Gemini</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs">{agent.tarefa}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-[var(--indra-light)]">
                        {agent.projeto}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge variant={agent.status} label={agent.statusLabel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Right Column - Create Agent Form */}
        <div>
          <Panel
            title="Nova Configuração de Agente"
            subtitle="Adicione e associe agentes com base nas tarefas requisitadas."
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Agent Name */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Nome do Agente
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Supervisor de Suporte"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 px-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)]"
                />
              </div>

              {/* Task Selector */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Tarefa Vinculada
                </label>
                <select
                  value={tarefa}
                  onChange={(e) => setTarefa(e.target.value)}
                  className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 px-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)] cursor-pointer"
                >
                  {tasks.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Selector */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Projeto Associado
                </label>
                <select
                  value={projeto}
                  onChange={(e) => setProjeto(e.target.value)}
                  className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 px-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)] cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Recommendation Box */}
              <div className="rounded-md border border-[var(--indra-cyan)]/20 bg-[var(--indra-cyan)]/5 p-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[var(--indra-cyan)] font-semibold text-[11px] uppercase tracking-[0.06em]">
                  <Sparkles size={14} />
                  Recomendação de Framework
                </div>
                <p className="text-[11px] text-[var(--indra-light)] leading-relaxed">
                  Com base na tarefa selecionada, o framework ideal recomendado é{" "}
                  <strong className="text-[var(--indra-white)]">{recommendedFramework}</strong>.
                </p>
                <button
                  type="button"
                  onClick={applyRecommendation}
                  className="mt-1 self-start text-[10px] font-bold text-[var(--indra-cyan)] border border-[var(--indra-cyan)]/30 rounded px-2.5 py-0.5 hover:bg-[var(--indra-cyan)] hover:text-[var(--indra-deep)] transition-colors"
                >
                  Aplicar Recomendação
                </button>
              </div>

              {/* Framework Selector */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Framework
                </label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 px-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)] cursor-pointer"
                >
                  <option value="CrewAI">CrewAI</option>
                  <option value="LangChain">LangChain</option>
                  <option value="AutoGen">AutoGen</option>
                  <option value="Custom Gemini">Custom Gemini</option>
                </select>
              </div>

              {/* Esquadrão */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Esquadrão
                </label>
                <select
                  value={esquadrao}
                  onChange={(e) => setEsquadrao(e.target.value)}
                  className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 px-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)] cursor-pointer"
                >
                  <option value="Financeiro">Financeiro</option>
                  <option value="Atendimento">Atendimento</option>
                  <option value="Engenharia">Engenharia</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operações">Operações</option>
                </select>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--indra-light)] block mb-1">
                  Prompt do Sistema (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruções e regras específicas para o agente..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-[var(--indra-deep)] border border-[var(--indra-border)] rounded-md py-1.5 px-3 text-[13px] text-[var(--indra-white)] outline-none focus:border-[var(--indra-cyan)] resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-md bg-[var(--indra-cyan)] py-2 text-xs font-semibold text-[var(--indra-deep)] shadow-[0_4px_12px_rgba(0,176,189,0.2)] transition-all hover:bg-[var(--indra-cyan)]/85"
              >
                <Plus size={14} />
                Adicionar Agente
              </button>
            </form>
          </Panel>
        </div>
      </section>
    </main>
  )
}
