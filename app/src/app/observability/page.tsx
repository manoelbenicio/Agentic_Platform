"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bot,
  Terminal,
  Activity,
  Trash2,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Columns2,
  Rows2,
  Cpu,
  Clock,
  Sparkles,
  Zap,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw
} from "lucide-react"

import { KPICard } from "@/components/ui/kpi-card"
import { Panel } from "@/components/ui/panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from "recharts"
import { motion, AnimatePresence } from "motion/react"

/* ─── DATA TYPES & STRUCTS ────────────────────────────────────── */

interface TaskStep {
  label: "Planejamento" | "Execução de Ferramenta" | "Validação" | "Finalização"
  logPattern: string
  type: "INFO" | "DEBUG" | "WARN" | "ERROR" | "SUCCESS"
  latency: number
  throughput: number
  cpu: number
  cost?: number
}

interface AgentTask {
  name: string
  steps: TaskStep[]
}

interface AgentState {
  id: "Financeiro" | "Dev" | "Compliance"
  name: string
  model: string
  status: "idle" | "planning" | "running" | "verifying" | "success" | "error" | "warning"
  currentTaskName: string
  stepIndex: number
  accumulatedCost: number
  activeError: boolean
}

interface LogEntry {
  id: string
  time: string
  level: "INFO" | "DEBUG" | "WARN" | "ERROR" | "SUCCESS"
  agentId: "Financeiro" | "Dev" | "Compliance" | "System"
  agentName: string
  message: string
}

interface MetricPoint {
  time: string
  latency: number
  throughput: number
  cpu: number
}

/* ─── MOCK DATABASE OF AGENT SEQUENCES ───────────────────────── */

const AGENT_TASKS: Record<"Financeiro" | "Dev" | "Compliance", AgentTask[]> = {
  Financeiro: [
    {
      name: "Rebalanceamento Q1",
      steps: [
        { label: "Planejamento", logPattern: "Iniciando análise de rentabilidade da carteira Q1...", type: "INFO", latency: 240, throughput: 300, cpu: 15 },
        { label: "Planejamento", logPattern: "Carregando modelo GPT-4o para consolidação de ativos...", type: "DEBUG", latency: 1500, throughput: 180, cpu: 45 },
        { label: "Execução de Ferramenta", logPattern: "Executando query SQL: SELECT asset_id, yield, volatility, weight FROM portfolio_assets WHERE status = 'active'", type: "DEBUG", latency: 850, throughput: 0, cpu: 65 },
        { label: "Execução de Ferramenta", logPattern: "Retornados 18 ativos moderados e 6 de alto risco para processamento.", type: "INFO", latency: 320, throughput: 420, cpu: 25 },
        { label: "Validação", logPattern: "Aviso: Ativo COGN3 apresenta desvio padrão superior ao limite de tolerância (18.4% > 15%).", type: "WARN", latency: 450, throughput: 510, cpu: 30 },
        { label: "Validação", logPattern: "Simulando alocação ótima via Markowitz (fronteira eficiente)...", type: "DEBUG", latency: 1200, throughput: 380, cpu: 80 },
        { label: "Finalização", logPattern: "Modelo de alocação de portfólio validado com índice Sharpe de 1.84.", type: "INFO", latency: 400, throughput: 450, cpu: 20 },
        { label: "Finalização", logPattern: "Análise concluída em 4.2s. Custo: R$ 0,38", type: "SUCCESS", latency: 180, throughput: 620, cpu: 12, cost: 0.38 }
      ]
    },
    {
      name: "Projeção de Dividendos",
      steps: [
        { label: "Planejamento", logPattern: "Mapeando cronograma de pagamento de proventos do setor elétrico...", type: "INFO", latency: 180, throughput: 320, cpu: 12 },
        { label: "Execução de Ferramenta", logPattern: "Chamando API de RI das empresas para raspagem de fatos relevantes...", type: "DEBUG", latency: 1800, throughput: 120, cpu: 55 },
        { label: "Execução de Ferramenta", logPattern: "Consolidando rendimentos de TAEE11, EGIE3 e TRPL4.", type: "INFO", latency: 340, throughput: 400, cpu: 22 },
        { label: "Validação", logPattern: "Verificando se datas-com coincidem com feriados bancários nacional.", type: "DEBUG", latency: 500, throughput: 310, cpu: 18 },
        { label: "Finalização", logPattern: "Relatório gerado contendo yield projetado de 8.2% a.a.", type: "INFO", latency: 280, throughput: 490, cpu: 15 },
        { label: "Finalização", logPattern: "Projeção concluída em 3.2s. Custo: R$ 0,22", type: "SUCCESS", latency: 120, throughput: 700, cpu: 10, cost: 0.22 }
      ]
    }
  ],
  Dev: [
    {
      name: "Refatorar Middleware",
      steps: [
        { label: "Planejamento", logPattern: "Iniciando análise de cobertura e vulnerabilidades do middleware de autenticação (auth.ts)...", type: "INFO", latency: 200, throughput: 280, cpu: 14 },
        { label: "Planejamento", logPattern: "Carregando modelo Claude 3.5 Sonnet para inspeção estática...", type: "DEBUG", latency: 1600, throughput: 200, cpu: 48 },
        { label: "Execução de Ferramenta", logPattern: "Lendo arquivo 'src/middlewares/auth.ts' (184 linhas)...", type: "DEBUG", latency: 450, throughput: 80, cpu: 32 },
        { label: "Execução de Ferramenta", logPattern: "Aviso: Encontrado segredo jwt_secret hardcoded em variável de fallback.", type: "WARN", latency: 320, throughput: 310, cpu: 20 },
        { label: "Validação", logPattern: "Substituindo segredo por process.env.JWT_SECRET com validação zod...", type: "DEBUG", latency: 980, throughput: 410, cpu: 60 },
        { label: "Validação", logPattern: "Executando suíte de testes: vitest run auth.spec.ts", type: "DEBUG", latency: 2200, throughput: 0, cpu: 85 },
        { label: "Validação", logPattern: "Todos os 12 testes unitários passaram com sucesso.", type: "INFO", latency: 300, throughput: 550, cpu: 18 },
        { label: "Finalização", logPattern: "Refatoração de segurança concluída. Lint OK (0 erros, 2 avisos).", type: "INFO", latency: 250, throughput: 480, cpu: 14 },
        { label: "Finalização", logPattern: "Refatoração concluída em 5.4s. Custo: R$ 0,48", type: "SUCCESS", latency: 150, throughput: 680, cpu: 8, cost: 0.48 }
      ]
    },
    {
      name: "Leak de Memória",
      steps: [
        { label: "Planejamento", logPattern: "Analisando perfilador de memória do Node.js (heap dump)...", type: "INFO", latency: 310, throughput: 240, cpu: 20 },
        { label: "Execução de Ferramenta", logPattern: "Identificado leak de closures no escopo de assinaturas do EventEmitter.", type: "WARN", latency: 400, throughput: 290, cpu: 25 },
        { label: "Execução de Ferramenta", logPattern: "Modificando chamadas 'emitter.on' para 'emitter.once' em conexões WebSocket.", type: "DEBUG", latency: 1100, throughput: 320, cpu: 50 },
        { label: "Validação", logPattern: "Simulando 1000 conexões concorrentes para testes de estresse.", type: "DEBUG", latency: 2800, throughput: 0, cpu: 95 },
        { label: "Finalização", logPattern: "Uso de memória estabilizado em 142MB (queda de 65%).", type: "INFO", latency: 350, throughput: 520, cpu: 22 },
        { label: "Finalização", logPattern: "Correção de leak concluída em 6.1s. Custo: R$ 0,68", type: "SUCCESS", latency: 190, throughput: 610, cpu: 12, cost: 0.68 }
      ]
    }
  ],
  Compliance: [
    {
      name: "Auditoria LGPD",
      steps: [
        { label: "Planejamento", logPattern: "Iniciando varredura automatizada nos logs do banco de dados de produção...", type: "INFO", latency: 150, throughput: 350, cpu: 12 },
        { label: "Planejamento", logPattern: "Instanciando validador Gemini Pro para detecção de PII (Personally Identifiable Information)...", type: "DEBUG", latency: 1400, throughput: 210, cpu: 40 },
        { label: "Execução de Ferramenta", logPattern: "Verificando tabelas de logs: transacoes_pagamento, interacoes_suporte.", type: "DEBUG", latency: 900, throughput: 110, cpu: 50 },
        { label: "Validação", logPattern: "Erro Crítico: Encontrado CPF e Endereço IP expostos em texto claro no log de auditoria #12948!", type: "ERROR", latency: 550, throughput: 420, cpu: 35 },
        { label: "Validação", logPattern: "Alerta emitido para a equipe de Infraestrutura via Webhook do Teams.", type: "WARN", latency: 400, throughput: 480, cpu: 22 },
        { label: "Validação", logPattern: "Substituindo dados sensíveis com hash SHA-256 e aplicando regex de máscara de dados.", type: "DEBUG", latency: 1300, throughput: 390, cpu: 70 },
        { label: "Finalização", logPattern: "Varredura concluída. Logs mascarados. Certificado de Compliance emitido.", type: "INFO", latency: 320, throughput: 510, cpu: 16 },
        { label: "Finalização", logPattern: "Auditoria concluída em 5.7s. Custo: R$ 0,18", type: "SUCCESS", latency: 140, throughput: 720, cpu: 9, cost: 0.18 }
      ]
    }
  ]
}

/* Helper to get formatted current time */
const getFormattedTime = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
}

export default function ObservabilityPage() {
  /* ─── STATES ────────────────────────────────────────────────── */
  const [layout, setLayout] = useState<"grid" | "v-split" | "h-split" | "focused">("grid")
  const [activePane, setActivePane] = useState<"logs" | "traces" | "metrics">("logs")
  const [isPaused, setIsPaused] = useState(false)
  const [totalCost, setTotalCost] = useState(16.45)
  const [activeErrors, setActiveErrors] = useState(0)
  const [currentLatency, setCurrentLatency] = useState(412)
  const [currentThroughput, setCurrentThroughput] = useState(452)
  const [inputCommand, setInputCommand] = useState("")

  // Initial Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init-1",
      time: getFormattedTime(),
      level: "INFO",
      agentId: "System",
      agentName: "Sistema",
      message: "Matriz de Observabilidade & TMUX inicializada com sucesso."
    },
    {
      id: "init-2",
      time: getFormattedTime(),
      level: "INFO",
      agentId: "System",
      agentName: "Sistema",
      message: "Estabelecendo stream multiplexado com cluster de agentes 'agentverse-prod-01'..."
    },
    {
      id: "init-3",
      time: getFormattedTime(),
      level: "SUCCESS",
      agentId: "System",
      agentName: "Sistema",
      message: "Conectado. 3 agentes ativos reportando telemetria em tempo real."
    },
    {
      id: "init-4",
      time: getFormattedTime(),
      level: "INFO",
      agentId: "Financeiro",
      agentName: "Analista Financeiro",
      message: "Prontidão confirmada. Modelo associado: GPT-4o."
    },
    {
      id: "init-5",
      time: getFormattedTime(),
      level: "INFO",
      agentId: "Dev",
      agentName: "Developer L2",
      message: "Prontidão confirmada. Modelo associado: Claude 3.5 Sonnet."
    },
    {
      id: "init-6",
      time: getFormattedTime(),
      level: "INFO",
      agentId: "Compliance",
      agentName: "Auditor Compliance",
      message: "Prontidão confirmada. Modelo associado: Gemini Pro."
    }
  ])

  // Agents States
  const [agents, setAgents] = useState<AgentState[]>([
    {
      id: "Financeiro",
      name: "Agente Análise Financeira",
      model: "GPT-4o",
      status: "idle",
      currentTaskName: "",
      stepIndex: -1,
      accumulatedCost: 3.42,
      activeError: false
    },
    {
      id: "Dev",
      name: "Agente Developer L2",
      model: "Claude 3.5",
      status: "idle",
      currentTaskName: "",
      stepIndex: -1,
      accumulatedCost: 5.12,
      activeError: false
    },
    {
      id: "Compliance",
      name: "Agente Auditor Compliance",
      model: "Gemini Pro",
      status: "idle",
      currentTaskName: "",
      stepIndex: -1,
      accumulatedCost: 1.28,
      activeError: false
    }
  ])

  // Chart data
  const [metricsHistory, setMetricsHistory] = useState<MetricPoint[]>([
    { time: "23:09:40", latency: 320, throughput: 420, cpu: 25 },
    { time: "23:09:45", latency: 280, throughput: 310, cpu: 20 },
    { time: "23:09:50", latency: 450, throughput: 510, cpu: 32 },
    { time: "23:09:55", latency: 1200, throughput: 180, cpu: 65 },
    { time: "23:10:00", latency: 850, throughput: 240, cpu: 55 },
    { time: "23:10:05", latency: 340, throughput: 480, cpu: 28 },
    { time: "23:10:10", latency: 290, throughput: 350, cpu: 18 },
    { time: "23:10:15", latency: 1500, throughput: 120, cpu: 75 },
    { time: "23:10:20", latency: 412, throughput: 452, cpu: 30 }
  ])

  const terminalBodyRef = useRef<HTMLDivElement>(null)

  /* Auto-scroll terminal */
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [logs])

  /* Keyboard Shortcuts */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Must use Alt + key
      if (e.altKey) {
        if (e.key === "1") {
          e.preventDefault()
          setLayout("grid")
        } else if (e.key === "2") {
          e.preventDefault()
          setLayout("v-split")
        } else if (e.key === "3") {
          e.preventDefault()
          setLayout("h-split")
        } else if (e.key.toLowerCase() === "z") {
          e.preventDefault()
          setLayout((prev) => (prev === "focused" ? "grid" : "focused"))
        } else if (e.key.toLowerCase() === "p") {
          e.preventDefault()
          setIsPaused((prev) => !prev)
        } else if (e.key.toLowerCase() === "l") {
          e.preventDefault()
          clearLogs()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  /* ─── LIVE SIMULATION INTERVAL ─── */
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      // Pick a random agent to progress
      const agentKeys: ("Financeiro" | "Dev" | "Compliance")[] = ["Financeiro", "Dev", "Compliance"]
      const selectedAgentId = agentKeys[Math.floor(Math.random() * agentKeys.length)]

      setAgents((prevAgents) => {
        return prevAgents.map((agent) => {
          if (agent.id !== selectedAgentId) return agent

          const tasks = AGENT_TASKS[selectedAgentId]
          let nextStepIndex = agent.stepIndex + 1
          let currentTask = tasks.find((t) => t.name === agent.currentTaskName)

          // If no active task or task completed, select a new one
          if (!currentTask || nextStepIndex >= currentTask.steps.length) {
            currentTask = tasks[Math.floor(Math.random() * tasks.length)]
            nextStepIndex = 0
          }

          const step = currentTask.steps[nextStepIndex]
          const nowStr = getFormattedTime()

          // 1. Append Log
          setLogs((prevLogs) => {
            const newLog: LogEntry = {
              id: `${selectedAgentId}-${nowStr}-${nextStepIndex}`,
              time: nowStr,
              level: step.type,
              agentId: selectedAgentId,
              agentName: agent.name.replace("Agente ", ""),
              message: step.logPattern
            }
            // Keep last 60 logs
            return [...prevLogs, newLog].slice(-60)
          })

          // 2. Add Metric Point to Chart
          setMetricsHistory((prevHistory) => {
            const newPoint: MetricPoint = {
              time: nowStr,
              latency: step.latency,
              throughput: step.throughput,
              cpu: step.cpu
            }
            return [...prevHistory, newPoint].slice(-15)
          })

          // 3. Update real-time summary indicators
          setCurrentLatency(step.latency)
          setCurrentThroughput(step.throughput > 0 ? step.throughput : 320)
          if (step.cost) {
            setTotalCost((prev) => parseFloat((prev + step.cost!).toFixed(2)))
          }

          // Handle active errors count
          if (step.type === "ERROR") {
            setActiveErrors((prev) => prev + 1)
            agent.activeError = true
          } else if (nextStepIndex === 0) {
            // clear error flag on new task initialization
            if (agent.activeError) {
              setActiveErrors((prev) => Math.max(0, prev - 1))
              agent.activeError = false
            }
          }

          // Map step label to Agent status
          let status: AgentState["status"] = "running"
          if (step.label === "Planejamento") status = "planning"
          else if (step.label === "Validação") status = "verifying"
          else if (step.label === "Finalização") {
            status = step.type === "SUCCESS" ? "success" : "running"
          }

          return {
            ...agent,
            status,
            currentTaskName: currentTask.name,
            stepIndex: nextStepIndex,
            accumulatedCost: step.cost
              ? parseFloat((agent.accumulatedCost + step.cost).toFixed(2))
              : agent.accumulatedCost
          }
        })
      })
    }, 2200)

    return () => clearInterval(interval)
  }, [isPaused])

  /* ─── ACTIONS ───────────────────────────────────────────────── */
  const clearLogs = () => {
    setLogs([
      {
        id: `clear-${Date.now()}`,
        time: getFormattedTime(),
        level: "INFO",
        agentId: "System",
        agentName: "Sistema",
        message: "Console limpo pelo operador."
      }
    ])
    setActiveErrors(0)
    setAgents((prev) =>
      prev.map((a) => ({ ...a, activeError: false, stepIndex: -1, status: "idle" }))
    )
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCommand.trim()) return

    const cmd = inputCommand.trim().toLowerCase()
    const nowStr = getFormattedTime()

    // Add user command log line
    const userLog: LogEntry = {
      id: `cmd-user-${Date.now()}`,
      time: nowStr,
      level: "INFO",
      agentId: "System",
      agentName: "Operador",
      message: `root@agentverse:~# ${inputCommand}`
    }

    setLogs((prev) => [...prev, userLog])
    setInputCommand("")

    // Parse commands
    setTimeout(() => {
      let sysMessage = ""
      let level: LogEntry["level"] = "INFO"

      switch (cmd) {
        case "help":
          setLogs((prev) => [
            ...prev,
            {
              id: `sys-h-1-${Date.now()}`,
              time: getFormattedTime(),
              level: "INFO",
              agentId: "System",
              agentName: "Sistema",
              message: "Comandos TMUX do Simulador disponíveis:"
            },
            {
              id: `sys-h-2-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  help    - Exibe este menu de ajuda"
            },
            {
              id: `sys-h-3-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  clear   - Limpa o console de logs"
            },
            {
              id: `sys-h-4-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  pause   - Pausa a transmissão em tempo real"
            },
            {
              id: `sys-h-5-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  resume  - Retoma a transmissão em tempo real"
            },
            {
              id: `sys-h-6-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  grid    - Altera o layout para grade padrão"
            },
            {
              id: `sys-h-7-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  splitv  - Altera layout para divisão vertical"
            },
            {
              id: `sys-h-8-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  splith  - Altera layout para divisão horizontal"
            },
            {
              id: `sys-h-9-${Date.now()}`,
              time: getFormattedTime(),
              level: "DEBUG",
              agentId: "System",
              agentName: "Sistema",
              message: "  zoom    - Alterna foco total no terminal (Prefix+z)"
            }
          ])
          return
        case "clear":
          clearLogs()
          return
        case "pause":
          setIsPaused(true)
          sysMessage = "Transmissão pausada via console."
          level = "WARN"
          break
        case "resume":
          setIsPaused(false)
          sysMessage = "Transmissão retomada via console."
          level = "SUCCESS"
          break
        case "grid":
          setLayout("grid")
          sysMessage = "Layout redefinido para Grade (3 painéis)."
          break
        case "splitv":
          setLayout("v-split")
          sysMessage = "Layout dividido verticalmente (Logs & Traces)."
          break
        case "splith":
          setLayout("h-split")
          sysMessage = "Layout dividido horizontalmente (Logs & Métricas)."
          break
        case "zoom":
        case "focus":
          setLayout((prev) => (prev === "focused" ? "grid" : "focused"))
          sysMessage = "Alternando modo de zoom do painel de logs."
          break
        default:
          sysMessage = `Comando desconhecido: '${cmd}'. Digite 'help' para listar os comandos.`
          level = "ERROR"
          break
      }

      setLogs((prev) => [
        ...prev,
        {
          id: `cmd-res-${Date.now()}`,
          time: getFormattedTime(),
          level,
          agentId: "System",
          agentName: "Sistema",
          message: sysMessage
        }
      ])
    }, 150)
  }

  /* Helper to render step badges on traces */
  const renderStepDot = (
    stepLabel: string,
    currentStepIndex: number,
    agentTask: AgentTask | undefined
  ) => {
    if (!agentTask) return <div className="h-2 w-2 rounded-full bg-white/10" />

    // Find indices matching this stepLabel
    const stepIndices = agentTask.steps
      .map((s, idx) => (s.label === stepLabel ? idx : -1))
      .filter((idx) => idx !== -1)

    if (stepIndices.length === 0) return <div className="h-2 w-2 rounded-full bg-white/10" />

    const firstIdx = stepIndices[0]
    const lastIdx = stepIndices[stepIndices.length - 1]

    // Determine status
    if (currentStepIndex < firstIdx) {
      // Pending
      return (
        <div
          className="h-2 w-2 rounded-full bg-white/15 border border-white/20 transition-all duration-300"
          title={`${stepLabel}: Pendente`}
        />
      )
    } else if (currentStepIndex >= firstIdx && currentStepIndex <= lastIdx) {
      // Running
      const currentStepType = agentTask.steps[currentStepIndex].type
      let colorClass = "bg-[var(--indra-cyan)] shadow-[0_0_8px_var(--indra-cyan)]"
      if (currentStepType === "ERROR") {
        colorClass = "bg-[var(--indra-error)] shadow-[0_0_8px_var(--indra-error)] animate-pulse"
      } else if (currentStepType === "WARN") {
        colorClass = "bg-[var(--indra-warning)] shadow-[0_0_8px_var(--indra-warning)]"
      }
      return (
        <div
          className={cn("h-2.5 w-2.5 rounded-full border border-white/30 transition-all duration-300", colorClass)}
          title={`${stepLabel}: Processando`}
        />
      )
    } else {
      // Success or completed
      // Check if any step in this range had error or warning
      const stepsInRange = agentTask.steps.slice(firstIdx, lastIdx + 1)
      const hasError = stepsInRange.some((s) => s.type === "ERROR")
      const hasWarning = stepsInRange.some((s) => s.type === "WARN")

      let colorClass = "bg-[var(--indra-success)]"
      if (hasError) colorClass = "bg-[var(--indra-error)]"
      else if (hasWarning) colorClass = "bg-[var(--indra-warning)]"

      return (
        <div
          className={cn("h-2 w-2 rounded-full transition-all duration-300", colorClass)}
          title={`${stepLabel}: Concluído`}
        />
      )
    }
  }

  return (
    <main className="min-h-screen px-6 py-6 md:px-8 lg:px-8">
      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--indra-white)] flex items-center gap-2">
            Matriz de Observabilidade & TMUX
            <span className="inline-block rounded-full bg-[rgba(0,176,189,0.1)] px-2 py-0.5 text-[10px] font-medium text-[var(--indra-cyan)] border border-[var(--indra-cyan)]/25">
              Live Stream
            </span>
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--indra-light)]">
            Logs em tempo real, traces de execução e terminais splitados de agentes ativos.
          </p>
        </div>

        {/* Global Health Status Badge */}
        <div>
          <StatusBadge variant={activeErrors > 0 ? "error" : "success"}>
            {activeErrors > 0 ? "ALERTA NO SISTEMA" : "SISTEMA OPERACIONAL"}
          </StatusBadge>
        </div>
      </header>

      {/* ─── KPI ROW ────────────────────────────────────────────── */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Latência Corrente"
          value={`${currentLatency} ms`}
          change={currentLatency > 1000 ? "down" : currentLatency > 400 ? "neutral" : "up"}
          changeText={currentLatency > 1000 ? "Lento (LLM Call)" : currentLatency > 400 ? "Médio" : "Rápido"}
          icon={<Clock className="h-4 w-4" />}
          index={0}
        />
        <KPICard
          label="Vazão de Tokens"
          value={`${currentThroughput} tok/s`}
          change="up"
          changeText="+4% vs média"
          icon={<Zap className="h-4 w-4" />}
          index={1}
        />
        <KPICard
          label="Custo Acumulado Session"
          value={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          }).format(totalCost)}
          trend={
            <span className="text-[var(--indra-light)] opacity-70">
              Taxa incremental
            </span>
          }
          icon={<DollarSign className="h-4 w-4" />}
          index={2}
        />
        <KPICard
          label="Erros Ativos"
          value={activeErrors}
          change={activeErrors > 0 ? "down" : "neutral"}
          changeText={activeErrors > 0 ? "Requer Atenção" : "Nenhuma Falha"}
          icon={<AlertTriangle className="h-4 w-4" />}
          index={3}
          className={cn(
            activeErrors > 0 && "border-[var(--indra-error)]/40 shadow-[0_0_12px_rgba(233,30,99,0.15)] bg-[var(--indra-error)]/5"
          )}
        />
      </section>

      {/* ─── TMUX SIMULATOR PANEL ─────────────────────────────────── */}
      <section className="relative">
        <div className="relative w-full overflow-hidden border border-[var(--indra-border)] rounded-lg bg-[#001D27]/95 backdrop-blur-md flex flex-col shadow-2xl">
          
          {/* TMUX Chrome Window Title Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--indra-dark)] border-b border-[var(--indra-border)] select-none">
            <div className="flex items-center gap-1.5">
              {/* Traffic lights */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#E91E63]/70 hover:bg-[#E91E63] cursor-pointer" onClick={clearLogs} title="Limpar Tudo" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF9800]/70 hover:bg-[#FF9800] cursor-pointer" onClick={() => setIsPaused(!isPaused)} title="Pausar Stream" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27AE60]/70 hover:bg-[#27AE60] cursor-pointer" onClick={() => setLayout("grid")} title="Resetar Grade" />
              
              <span className="text-[11px] font-mono text-[var(--indra-light)] ml-3 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[var(--indra-cyan)]" />
                tmux: operator@agentverse-nodes (session: live)
              </span>
            </div>
            
            <div className="text-[10px] font-mono text-[var(--indra-light)]/60 hidden md:block">
              SSH PORT: 2280 | CPU: {isPaused ? "0%" : `${Math.floor(Math.random() * 20) + 15}%`} | MEM: 342.1MB
            </div>
          </div>

          {/* TMUX Internal Toolbar / Control bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[rgba(0,62,80,0.3)] border-b border-[var(--indra-border)]">
            {/* Split controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--indra-light)] mr-1.5 hidden sm:inline">Layout:</span>
              
              <button
                onClick={() => setLayout("grid")}
                className={cn(
                  "h-7 px-2.5 text-[11px] font-mono rounded flex items-center gap-1 transition-all duration-200 border",
                  layout === "grid"
                    ? "bg-[rgba(0,176,189,0.15)] border-[var(--indra-cyan)]/60 text-[var(--indra-cyan)]"
                    : "bg-transparent border-transparent text-[var(--indra-light)] hover:bg-white/5 hover:text-white"
                )}
                title="Grade padrão (Todos os painéis) [Alt+1]"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grade</span>
              </button>

              <button
                onClick={() => setLayout("v-split")}
                className={cn(
                  "h-7 px-2.5 text-[11px] font-mono rounded flex items-center gap-1 transition-all duration-200 border",
                  layout === "v-split"
                    ? "bg-[rgba(0,176,189,0.15)] border-[var(--indra-cyan)]/60 text-[var(--indra-cyan)]"
                    : "bg-transparent border-transparent text-[var(--indra-light)] hover:bg-white/5 hover:text-white"
                )}
                title="Dividir Verticalmente (Logs & Traces) [Alt+2]"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Dividir V</span>
              </button>

              <button
                onClick={() => setLayout("h-split")}
                className={cn(
                  "h-7 px-2.5 text-[11px] font-mono rounded flex items-center gap-1 transition-all duration-200 border",
                  layout === "h-split"
                    ? "bg-[rgba(0,176,189,0.15)] border-[var(--indra-cyan)]/60 text-[var(--indra-cyan)]"
                    : "bg-transparent border-transparent text-[var(--indra-light)] hover:bg-white/5 hover:text-white"
                )}
                title="Dividir Horizontalmente (Logs & Métricas) [Alt+3]"
              >
                <Rows2 className="w-3.5 h-3.5" />
                <span>Dividir H</span>
              </button>

              <button
                onClick={() => setLayout(layout === "focused" ? "grid" : "focused")}
                className={cn(
                  "h-7 px-2.5 text-[11px] font-mono rounded flex items-center gap-1 transition-all duration-200 border",
                  layout === "focused"
                    ? "bg-[rgba(0,176,189,0.2)] border-[var(--indra-cyan)] text-[var(--indra-cyan)]"
                    : "bg-transparent border-transparent text-[var(--indra-light)] hover:bg-white/5 hover:text-white"
                )}
                title="Foco total no Console de Logs (Prefix + z) [Alt+Z]"
              >
                {layout === "focused" ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Minimizar</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Foco Terminal</span>
                  </>
                )}
              </button>
            </div>

            {/* Stream Action Buttons */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={clearLogs}
                className="h-7 px-2.5 text-[11px] font-mono rounded border border-[var(--indra-border)] bg-transparent text-[var(--indra-light)] hover:bg-[var(--indra-error)]/10 hover:border-[var(--indra-error)]/30 hover:text-[var(--indra-error)] flex items-center gap-1 transition-colors"
                title="Limpar todos os logs [Alt+L]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Console</span>
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className={cn(
                  "h-7 px-2.5 text-[11px] font-mono rounded border flex items-center gap-1 transition-colors",
                  isPaused
                    ? "bg-[var(--indra-success)]/10 border-[var(--indra-success)]/30 text-[var(--indra-success)] hover:bg-[var(--indra-success)]/20"
                    : "bg-transparent border-[var(--indra-border)] text-[var(--indra-light)] hover:bg-[var(--indra-warning)]/10 hover:border-[var(--indra-warning)]/30 hover:text-[var(--indra-warning)]"
                )}
                title="Pausar ou Retomar transmissão ao vivo [Alt+P]"
              >
                {isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-[var(--indra-success)]" />
                    <span>Retomar Stream</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar Stream</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TMUX Workspace (Pane grid layout) */}
          <div className="p-3 bg-black/35 flex-1 min-h-[520px] flex flex-col justify-stretch">
            
            <div
              className={cn(
                "w-full h-full flex-1 transition-all duration-300",
                layout === "grid" && "grid grid-cols-1 lg:grid-cols-12 gap-3",
                layout === "v-split" && "grid grid-cols-1 lg:grid-cols-2 gap-3",
                layout === "h-split" && "grid grid-rows-2 gap-3 h-[520px]",
                layout === "focused" && "flex flex-col"
              )}
            >
              
              {/* ─── PANE 1: LOG TERMINAL ─── */}
              <div
                onClick={() => setActivePane("logs")}
                className={cn(
                  "flex flex-col rounded border bg-black/45 transition-all duration-200 focus-within:ring-1 focus-within:ring-[var(--indra-cyan)]/60 cursor-pointer overflow-hidden",
                  layout === "grid" && "lg:col-span-7 xl:col-span-8 h-[520px]",
                  layout === "v-split" && "h-[520px]",
                  layout === "h-split" && "row-span-1 h-full min-h-[250px]",
                  layout === "focused" && "flex-1 h-[520px]",
                  activePane === "logs"
                    ? "border-[rgba(0,176,189,0.35)] shadow-[0_0_15px_rgba(0,176,189,0.12)]"
                    : "border-[var(--indra-border)] hover:border-white/10"
                )}
              >
                {/* Pane header tab */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-[var(--indra-border)] select-none">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isPaused ? "bg-[var(--indra-warning)]" : "bg-[var(--indra-success)]"
                    )} />
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-[var(--indra-white)] uppercase">
                      PANE [0] - stdout & stderr
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[var(--indra-light)] bg-white/5 px-1.5 py-0.5 rounded">
                    bash
                  </span>
                </div>

                {/* Console content */}
                <div
                  ref={terminalBodyRef}
                  className="flex-1 p-4 font-mono text-[12px] leading-relaxed overflow-y-auto max-h-[440px] scrollbar-thin select-text"
                >
                  <div className="flex flex-col gap-1 text-[var(--indra-blue-gray)]">
                    {logs.map((log) => {
                      let levelColor = "text-[var(--indra-cyan)]"
                      if (log.level === "DEBUG") levelColor = "text-[var(--indra-light)] opacity-70"
                      else if (log.level === "WARN") levelColor = "text-[var(--indra-warning)] font-semibold"
                      else if (log.level === "ERROR") levelColor = "text-[var(--indra-error)] font-bold animate-[pulse_1.5s_infinite]"
                      else if (log.level === "SUCCESS") levelColor = "text-[var(--indra-success)] font-semibold"

                      let agentBadge = "text-[var(--indra-light)] bg-white/5 border-white/5"
                      if (log.agentId === "Financeiro") agentBadge = "text-[var(--indra-cyan)] bg-[var(--indra-cyan)]/10 border-[var(--indra-cyan)]/20"
                      else if (log.agentId === "Dev") agentBadge = "text-[var(--indra-success)] bg-[var(--indra-success)]/10 border-[var(--indra-success)]/20"
                      else if (log.agentId === "Compliance") agentBadge = "text-[var(--indra-warning)] bg-[var(--indra-warning)]/10 border-[var(--indra-warning)]/20"

                      return (
                        <div key={log.id} className="flex items-start flex-wrap transition-opacity duration-300">
                          {/* Timestamp */}
                          <span className="text-[var(--indra-light)] opacity-50 mr-2 select-none shrink-0 font-medium">
                            [{log.time}]
                          </span>
                          
                          {/* Level Badge */}
                          <span className={cn("mr-2 shrink-0 select-none uppercase text-[10px] tracking-wide", levelColor)}>
                            {log.level}
                          </span>
                          
                          {/* Agent Origin */}
                          <span className={cn("mr-2 shrink-0 text-[10px] px-1 rounded border font-semibold", agentBadge)}>
                            {log.agentName}
                          </span>
                          
                          {/* Message */}
                          <span className={cn(
                            "flex-1 break-all select-all",
                            log.level === "ERROR" && "text-[var(--indra-error)] font-medium",
                            log.level === "SUCCESS" && "text-[var(--indra-sky)] font-semibold"
                          )}>
                            {log.message}
                          </span>
                        </div>
                      )
                    })}
                    
                    {/* Blinking CLI Cursor at bottom */}
                    <div className="flex items-center mt-1 select-none">
                      <span className="text-[var(--indra-cyan)] mr-1.5">&gt;</span>
                      <span className="text-[var(--indra-light)]/60 text-[11px] tracking-wide italic">
                        {isPaused ? "transmissão pausada..." : "escutando socket de agentes..."}
                      </span>
                      <span className="inline-block w-1.5 h-3.5 bg-[var(--indra-cyan)] animate-[pulse_1s_infinite] ml-1" />
                    </div>
                  </div>
                </div>

                {/* Shell Input Prompt */}
                <form
                  onSubmit={handleCommandSubmit}
                  className="flex items-center gap-1 px-3 py-1.5 bg-black/40 border-t border-[var(--indra-border)]"
                >
                  <span className="text-[var(--indra-success)] font-mono text-[11px] font-semibold shrink-0 select-none">
                    root@agentverse:~#
                  </span>
                  <input
                    type="text"
                    value={inputCommand}
                    onChange={(e) => setInputCommand(e.target.value)}
                    className="bg-transparent border-none outline-none text-[var(--indra-white)] font-mono text-[12px] flex-1 caret-[var(--indra-cyan)] placeholder-white/10"
                    placeholder="Digite um comando (ex: help)..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  <button type="submit" className="hidden" />
                </form>
              </div>

              {/* ─── PANE 2: EXECUTION TRACES ─── */}
              {layout !== "h-split" && (
                <div
                  onClick={() => setActivePane("traces")}
                  className={cn(
                    "flex flex-col rounded border bg-black/45 transition-all duration-200 cursor-pointer overflow-hidden",
                    layout === "grid" && "lg:col-span-5 xl:col-span-4 h-[255px]",
                    layout === "v-split" && "h-[520px]",
                    activePane === "traces"
                      ? "border-[rgba(0,176,189,0.35)] shadow-[0_0_15px_rgba(0,176,189,0.12)]"
                      : "border-[var(--indra-border)] hover:border-white/10"
                  )}
                >
                  {/* Pane header tab */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-[var(--indra-border)] select-none">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[var(--indra-teal)]" />
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-[var(--indra-white)] uppercase">
                        PANE [1] - thought traces
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--indra-light)] bg-white/5 px-1.5 py-0.5 rounded">
                      reasoning
                    </span>
                  </div>

                  {/* Traces tracker content */}
                  <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3.5">
                    {agents.map((agent) => {
                      const tasks = AGENT_TASKS[agent.id]
                      const activeTask = tasks.find((t) => t.name === agent.currentTaskName)
                      
                      let statusBadgeVar: "info" | "caution" | "success" | "error" = "info"
                      let statusLabel = "Ocioso"
                      
                      if (agent.status === "planning") {
                        statusBadgeVar = "info"
                        statusLabel = "Planejando"
                      } else if (agent.status === "running") {
                        statusBadgeVar = "info"
                        statusLabel = "Executando"
                      } else if (agent.status === "verifying") {
                        statusBadgeVar = "caution"
                        statusLabel = "Validando"
                      } else if (agent.status === "success") {
                        statusBadgeVar = "success"
                        statusLabel = "Concluído"
                      } else if (agent.status === "error" || agent.activeError) {
                        statusBadgeVar = "error"
                        statusLabel = "Alerta"
                      }

                      return (
                        <div key={agent.id} className="p-2.5 rounded border border-white/5 bg-white/[0.01] flex flex-col gap-2 transition-all">
                          {/* Agent header row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-bold text-[var(--indra-white)]">
                                {agent.id === "Financeiro" ? "💼 FinAgent" : agent.id === "Dev" ? "🛠️ DevAgent" : "🛡️ CompAgent"}
                              </span>
                              <span className="text-[9px] font-mono text-[var(--indra-light)] bg-white/5 px-1 rounded">
                                {agent.model}
                              </span>
                            </div>
                            <StatusBadge variant={statusBadgeVar} className="scale-90 origin-right">
                              {statusLabel}
                            </StatusBadge>
                          </div>

                          {/* Active Task metadata */}
                          {agent.currentTaskName ? (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between text-[11px] text-[var(--indra-light)]">
                                <span className="truncate max-w-[200px]">
                                  Tarefa: <strong className="text-white font-medium">{agent.currentTaskName}</strong>
                                </span>
                                <span className="font-mono text-[10px] shrink-0 text-[var(--indra-cyan)] bg-[var(--indra-cyan)]/5 px-1 rounded">
                                  acum: R$ {agent.accumulatedCost.toFixed(2)}
                                </span>
                              </div>

                              {/* STEPS TIMELINE STEPS ROW */}
                              <div className="flex items-center gap-1.5 mt-1 select-none">
                                <div className="flex items-center justify-between w-full text-[9px] font-mono text-[var(--indra-light)]/80">
                                  
                                  {/* Step 1: Planejar */}
                                  <div className="flex items-center gap-1">
                                    {renderStepDot("Planejamento", agent.stepIndex, activeTask)}
                                    <span className="hidden sm:inline">Plan</span>
                                  </div>
                                  <div className="flex-1 mx-1.5 h-px bg-white/5" />

                                  {/* Step 2: Executar */}
                                  <div className="flex items-center gap-1">
                                    {renderStepDot("Execução de Ferramenta", agent.stepIndex, activeTask)}
                                    <span className="hidden sm:inline">Exec</span>
                                  </div>
                                  <div className="flex-1 mx-1.5 h-px bg-white/5" />

                                  {/* Step 3: Validar */}
                                  <div className="flex items-center gap-1">
                                    {renderStepDot("Validação", agent.stepIndex, activeTask)}
                                    <span className="hidden sm:inline">Val</span>
                                  </div>
                                  <div className="flex-1 mx-1.5 h-px bg-white/5" />

                                  {/* Step 4: Finalizar */}
                                  <div className="flex items-center gap-1">
                                    {renderStepDot("Finalização", agent.stepIndex, activeTask)}
                                    <span className="hidden sm:inline">Fim</span>
                                  </div>
                                  
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[var(--indra-light)] italic opacity-60">
                              Aguardando próxima tarefa programada...
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── PANE 3: PERFORMANCE METRICS CHART ─── */}
              {layout !== "v-split" && (
                <div
                  onClick={() => setActivePane("metrics")}
                  className={cn(
                    "flex flex-col rounded border bg-black/45 transition-all duration-200 cursor-pointer overflow-hidden",
                    layout === "grid" && "lg:col-span-5 xl:col-span-4 h-[252px]",
                    layout === "h-split" && "row-span-1 h-full min-h-[250px]",
                    activePane === "metrics"
                      ? "border-[rgba(0,176,189,0.35)] shadow-[0_0_15px_rgba(0,176,189,0.12)]"
                      : "border-[var(--indra-border)] hover:border-white/10"
                  )}
                >
                  {/* Pane header tab */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-[var(--indra-border)] select-none">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[var(--indra-cyan)]" />
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-[var(--indra-white)] uppercase">
                        PANE [2] - latency & performance
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--indra-light)] bg-white/5 px-1.5 py-0.5 rounded">
                      charts
                    </span>
                  </div>

                  {/* Chart rendering content */}
                  <div className="flex-1 p-3.5 flex flex-col justify-center">
                    <ResponsiveContainer width="100%" height={layout === "h-split" ? 190 : 180}>
                      <AreaChart
                        data={metricsHistory}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--indra-cyan)" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="var(--indra-cyan)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--indra-success)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--indra-success)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: "var(--indra-light)", fontSize: 9, fontFamily: "var(--font-mono)" }}
                          axisLine={false}
                          tickLine={false}
                          interval="preserveEnd"
                        />
                        <YAxis
                          tick={{ fill: "var(--indra-light)", fontSize: 9, fontFamily: "var(--font-mono)" }}
                          axisLine={false}
                          tickLine={false}
                          width={32}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--indra-dark)",
                            borderColor: "var(--indra-border)",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontFamily: "var(--font-mono)"
                          }}
                          labelStyle={{ color: "var(--indra-light)" }}
                          itemStyle={{ color: "var(--indra-cyan)" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="latency"
                          name="Latência (ms)"
                          stroke="var(--indra-cyan)"
                          strokeWidth={1.5}
                          fillOpacity={1}
                          fill="url(#latencyGradient)"
                          dot={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="cpu"
                          name="CPU (%)"
                          stroke="var(--indra-success)"
                          strokeWidth={1}
                          fillOpacity={0.7}
                          fill="url(#cpuGradient)"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* TMUX Status Bar Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-1 bg-[var(--indra-primary)] border-t border-[var(--indra-border)] text-[10px] font-mono text-[var(--indra-sky)] select-none gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-[var(--indra-cyan)] text-[var(--indra-deep)] font-bold px-1 rounded uppercase">
                [session: live]
              </span>
              <span className={cn(activePane === "logs" ? "text-white font-bold" : "opacity-60")}>
                0:console{activePane === "logs" ? "*" : ""}
              </span>
              <span className="opacity-30">|</span>
              <span className={cn(activePane === "traces" ? "text-white font-bold" : "opacity-60")}>
                1:traces{activePane === "traces" ? "*" : ""}
              </span>
              <span className="opacity-30">|</span>
              <span className={cn(activePane === "metrics" ? "text-white font-bold" : "opacity-60")}>
                2:charts{activePane === "metrics" ? "*" : ""}
              </span>
              <span className="opacity-30 ml-2">Active: [pane {activePane === "logs" ? "0" : activePane === "traces" ? "1" : "2"}]</span>
            </div>
            
            <div className="hidden lg:block text-[9px] text-[var(--indra-sky)]/70">
              Atalhos: <span className="bg-black/25 px-1 py-0.5 rounded text-white">Alt + [1, 2, 3, Z]</span> Mudar Layout | <span className="bg-black/25 px-1 py-0.5 rounded text-white">Alt + P</span> Pausar | <span className="bg-black/25 px-1 py-0.5 rounded text-white">Alt + L</span> Limpar
            </div>

            <div className="flex items-center gap-2">
              <span>{getFormattedTime()}</span>
              <span className={cn(
                "inline-flex items-center gap-1 px-1 rounded font-bold text-[9px]",
                isPaused
                  ? "bg-[var(--indra-warning)]/20 text-[var(--indra-warning)]"
                  : "bg-[var(--indra-success)]/20 text-[var(--indra-success)]"
              )}>
                <span className={cn(
                  "w-1 h-1 rounded-full bg-current",
                  !isPaused && "animate-ping"
                )} />
                {isPaused ? "SUSPENSO" : "AO VIVO"}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SYSTEM OVERVIEW PANELS ───────────────────────────────── */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Info panel - Keyboard shortcuts description */}
        <Panel
          title="Manual do Operador TMUX"
          subtitle="Comandos, teclas de atalho e documentação do simulador de observabilidade"
        >
          <div className="text-[13px] text-[var(--indra-light)] flex flex-col gap-4">
            <p>
              A Matriz de Observabilidade AgentVerse utiliza um simulador completo do multiplexador de terminal <strong>TMUX</strong> para Next.js. O operador pode interagir com o terminal utilizando atalhos de teclado globais ou digitando comandos shell na linha de comando inferior.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 font-mono text-[12px]">
              <div className="p-2.5 rounded border border-[var(--indra-border)] bg-black/20 flex flex-col gap-1">
                <span className="text-[var(--indra-cyan)] font-bold">Atalhos de Teclado (Global)</span>
                <ul className="list-disc pl-4 mt-1 flex flex-col gap-1 text-[11px]">
                  <li><strong className="text-white">Alt + 1</strong>: Layout Grade Padrão</li>
                  <li><strong className="text-white">Alt + 2</strong>: Divisão Vertical (V-Split)</li>
                  <li><strong className="text-white">Alt + 3</strong>: Divisão Horizontal (H-Split)</li>
                  <li><strong className="text-white">Alt + Z</strong>: Foco total no Console (Zoom)</li>
                  <li><strong className="text-white">Alt + P</strong>: Pausar/Retomar fluxo</li>
                  <li><strong className="text-white">Alt + L</strong>: Limpar Console de logs</li>
                </ul>
              </div>

              <div className="p-2.5 rounded border border-[var(--indra-border)] bg-black/20 flex flex-col gap-1">
                <span className="text-[var(--indra-success)] font-bold">Comandos de Shell Emulados</span>
                <ul className="list-disc pl-4 mt-1 flex flex-col gap-1 text-[11px]">
                  <li><strong className="text-white">help</strong>: Abre a ajuda no console</li>
                  <li><strong className="text-white">clear</strong>: Limpa o buffer de mensagens</li>
                  <li><strong className="text-white">pause</strong>: Suspende a emissão de logs</li>
                  <li><strong className="text-white">resume</strong>: Reinicia a transmissão</li>
                  <li><strong className="text-white">grid / splitv / splith</strong>: Redefine layout</li>
                  <li><strong className="text-white">zoom / focus</strong>: Alterna zoom</li>
                </ul>
              </div>
            </div>
            
            <p className="text-[11px] italic text-[var(--indra-light)] opacity-70">
              *Nota: Atalhos baseados na tecla Alt não interferem com os atalhos nativos do navegador se pressionados dentro da área de trabalho do AgentVerse.
            </p>
          </div>
        </Panel>

        {/* Detailed Stats Panel */}
        <Panel
          title="Telemetria de Orquestração"
          subtitle="Métricas operacionais agregadas dos agentes em execução no nó de produção"
        >
          <div className="flex flex-col gap-4 text-[13px]">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded border border-[var(--indra-border)] bg-black/15 flex flex-col text-center">
                <span className="text-[11px] font-semibold text-[var(--indra-light)] uppercase tracking-wider">Erros/Min</span>
                <span className="text-[20px] font-bold text-[var(--indra-error)] font-mono mt-1 tabular-nums">0.24</span>
              </div>
              
              <div className="p-3 rounded border border-[var(--indra-border)] bg-black/15 flex flex-col text-center">
                <span className="text-[11px] font-semibold text-[var(--indra-light)] uppercase tracking-wider">Uptime Canal</span>
                <span className="text-[20px] font-bold text-[var(--indra-success)] font-mono mt-1">99.98%</span>
              </div>

              <div className="p-3 rounded border border-[var(--indra-border)] bg-black/15 flex flex-col text-center">
                <span className="text-[11px] font-semibold text-[var(--indra-light)] uppercase tracking-wider">Fila Socket</span>
                <span className="text-[20px] font-bold text-[var(--indra-cyan)] font-mono mt-1">0 ms</span>
              </div>
            </div>

            <div className="p-3 rounded border border-[var(--indra-border)] bg-black/20 flex flex-col gap-2.5 font-mono text-[12px]">
              <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1">
                <span className="text-[var(--indra-light)] uppercase font-semibold">Agente Ativo</span>
                <span className="text-[var(--indra-light)] uppercase font-semibold">Consumo Tokens / s</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-medium">💼 Analista Financeiro</span>
                <span className="text-[var(--indra-cyan)] tabular-nums">410 t/s</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-medium">🛠️ Developer L2</span>
                <span className="text-[var(--indra-success)] tabular-nums">580 t/s</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-medium">🛡️ Auditor Compliance</span>
                <span className="text-[var(--indra-warning)] tabular-nums">120 t/s</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-[var(--indra-light)] border border-[var(--indra-border)] rounded-md px-3 py-2 bg-[rgba(6,89,110,0.08)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--indra-cyan)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--indra-cyan)]"></span>
              </span>
              <span>
                Canal SSE (Server-Sent Events) conectado e compactado via protocolo GZIP.
              </span>
            </div>
          </div>
        </Panel>

      </section>
    </main>
  )
}
