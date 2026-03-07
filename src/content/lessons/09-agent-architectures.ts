import type { Lesson } from "./types";

export const agentArchitecturesLessons: Lesson[] = [
  {
    id: "agent-1-patterns",
    moduleId: "agent-architectures",
    number: 1,
    title: "Patrones fundamentales: ReAct, Plan-Execute-Verify",
    duration: "25 min",
    objectives: [
      "Implementar el patrón ReAct para agentes que razonan y actúan",
      "Construir un loop Plan-Execute-Verify con control de pasos",
      "Entender cuándo usar cada patrón según la complejidad de la tarea",
    ],
    sections: [
      {
        title: "¿Qué es un agente de IA?",
        content: [
          "Un agente es un sistema que usa un LLM para decidir qué acciones tomar, las ejecuta, observa los resultados, y repite hasta completar la tarea.",
          "A diferencia de un chatbot (una pregunta → una respuesta), un agente puede tomar múltiples pasos, usar herramientas, y corregir su propio curso.",
          "Los agentes son poderosos pero peligrosos: pueden ejecutar acciones reales (crear archivos, hacer requests, modificar datos). Los guardrails son obligatorios.",
        ],
        code: {
          language: "typescript",
          code: `// Loop agéntico básico
interface AgentAction {
  tool: string;
  params: Record<string, unknown>;
  reasoning: string;
}

interface AgentStep {
  thought: string;
  action: AgentAction | null;
  observation: string;
}

async function agentLoop(
  task: string,
  tools: Map<string, (params: Record<string, unknown>) => Promise<string>>,
  maxSteps: number = 10
): Promise<{ steps: AgentStep[]; finalAnswer: string }> {
  const steps: AgentStep[] = [];
  let context = \`Tarea: \${task}\\n\\n\`;

  for (let i = 0; i < maxSteps; i++) {
    // El LLM decide qué hacer
    const decision = await llm.generate(\`\${context}
Herramientas disponibles: \${[...tools.keys()].join(", ")}

Responde en JSON:
{ "thought": "tu razonamiento", "action": { "tool": "nombre", "params": {} } | null, "finalAnswer": "respuesta final si ya terminaste" | null }\`);

    const parsed = JSON.parse(decision);

    if (parsed.finalAnswer) {
      return { steps, finalAnswer: parsed.finalAnswer };
    }

    // Ejecutar la acción
    const tool = tools.get(parsed.action.tool);
    if (!tool) throw new Error(\`Tool desconocido: \${parsed.action.tool}\`);

    const observation = await tool(parsed.action.params);
    steps.push({
      thought: parsed.thought,
      action: parsed.action,
      observation,
    });

    context += \`Paso \${i + 1}: \${parsed.thought}\\nAcción: \${parsed.action.tool}\\nResultado: \${observation}\\n\\n\`;
  }

  return { steps, finalAnswer: "Límite de pasos alcanzado sin resolver la tarea." };
}`,
          caption: "maxSteps es tu guardrail más importante. Sin él, un agente puede loopar infinitamente.",
        },
      },
      {
        title: "Plan-Execute-Verify",
        content: [
          "En lugar de decidir paso a paso (ReAct), el agente primero genera un plan completo, luego ejecuta cada paso, y finalmente verifica.",
          "Ventaja: el plan es revisable por un humano antes de ejecutar. Desventaja: menos adaptable a resultados inesperados.",
          "Ideal para tareas con pasos predecibles: 'migrar esta API', 'refactorizar este módulo', 'configurar CI/CD'.",
        ],
        code: {
          language: "typescript",
          code: `// Patrón Plan-Execute-Verify
interface Plan {
  goal: string;
  steps: { description: string; tool: string; params: Record<string, unknown> }[];
}

async function planExecuteVerify(
  task: string,
  tools: Map<string, (params: Record<string, unknown>) => Promise<string>>
): Promise<{ plan: Plan; results: string[]; verified: boolean }> {
  // PLAN: generar plan completo
  const planResponse = await llm.generate(\`Crea un plan paso a paso para: \${task}
Herramientas: \${[...tools.keys()].join(", ")}
Responde en JSON: { "goal": "", "steps": [{ "description": "", "tool": "", "params": {} }] }\`);
  const plan: Plan = JSON.parse(planResponse);

  // EXECUTE: ejecutar cada paso del plan
  const results: string[] = [];
  for (const step of plan.steps) {
    const tool = tools.get(step.tool);
    if (!tool) throw new Error(\`Tool no encontrado: \${step.tool}\`);
    const result = await tool(step.params);
    results.push(result);
  }

  // VERIFY: el LLM verifica si el resultado cumple el objetivo
  const verifyResponse = await llm.generate(\`Objetivo: \${plan.goal}
Resultados de ejecución: \${results.join("\\n")}
¿Se cumplió el objetivo? Responde JSON: { "verified": true/false, "issues": [] }\`);
  const verification = JSON.parse(verifyResponse);

  return { plan, results, verified: verification.verified };
}`,
          caption: "La fase de Verify detecta si faltó algo. Si no pasa, puedes re-planificar automáticamente.",
        },
      },
    ],
    exercise: {
      instruction:
        "Implementa un agente Plan-Execute-Verify que pueda resolver tareas de desarrollo simples. Usa tools mock: readFile, writeFile, runCommand, searchCode. La tarea: 'Agrega un test para la función calculateTotal en utils.ts'.",
      hints: [
        "El plan debería ser: 1) leer la función, 2) analizar qué testear, 3) escribir el test, 4) ejecutar el test",
        "Verifica que el test existe y pasa correctamente",
        "Simula las respuestas de los tools para no necesitar archivos reales",
      ],
    },
  },
  {
    id: "agent-2-memory",
    moduleId: "agent-architectures",
    number: 2,
    title: "Memoria, orquestación y agentes especializados",
    duration: "25 min",
    objectives: [
      "Implementar memoria a corto y largo plazo para agentes",
      "Diseñar sistemas multi-agente con orquestador",
      "Gestionar handoffs entre agentes especializados",
    ],
    sections: [
      {
        title: "Memoria para agentes",
        content: [
          "Short-term memory: los pasos anteriores de la conversación actual. Limitada por la ventana de contexto.",
          "Long-term memory: información persistente entre sesiones. Puede ser un vector store, una base de datos, o archivos.",
          "Working memory: datos temporales que el agente necesita durante una tarea pero que no persisten.",
        ],
        code: {
          language: "typescript",
          code: `// Sistema de memoria por capas
interface MemorySystem {
  shortTerm: ShortTermMemory;
  longTerm: LongTermMemory;
  working: WorkingMemory;
}

class ShortTermMemory {
  private messages: { role: string; content: string }[] = [];
  private maxTokens: number;

  constructor(maxTokens = 50000) { this.maxTokens = maxTokens; }

  add(role: string, content: string) {
    this.messages.push({ role, content });
    this.trim();
  }

  private trim() {
    // Estimación: mantener dentro del budget de tokens
    while (this.estimateTokens() > this.maxTokens && this.messages.length > 2) {
      this.messages.splice(1, 1); // mantener el primero (system), borrar los más viejos
    }
  }

  private estimateTokens(): number {
    return this.messages.reduce((sum, m) => sum + m.content.length / 4, 0);
  }

  getContext(): string {
    return this.messages.map(m => \`[\${m.role}] \${m.content}\`).join("\\n");
  }
}

class LongTermMemory {
  // Backed by vector store para búsqueda semántica
  async store(key: string, content: string, metadata: Record<string, string>) {
    await vectorStore.upsert({ id: key, content, metadata });
  }

  async recall(query: string, topK = 5): Promise<string[]> {
    const results = await vectorStore.search(query, { topK });
    return results.map(r => r.content);
  }
}

class WorkingMemory {
  private data = new Map<string, unknown>();

  set(key: string, value: unknown) { this.data.set(key, value); }
  get<T>(key: string): T | undefined { return this.data.get(key) as T; }
  clear() { this.data.clear(); }
}`,
          caption: "Short-term se limpia al final de la tarea. Long-term persiste entre sesiones. Working memory es el scratchpad.",
        },
      },
      {
        title: "Multi-agente: orquestador + especialistas",
        content: [
          "En lugar de un agente que sepa todo, usa un orquestador que delegue a agentes especializados.",
          "Cada agente especialista tiene: su propio system prompt, sus propias tools, y un scope limitado.",
          "El orquestador decide a quién delegar basándose en la tarea, y combina los resultados.",
        ],
        code: {
          language: "typescript",
          code: `// Sistema multi-agente con orquestador
interface SpecialistAgent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  tools: string[];
  handle: (task: string) => Promise<string>;
}

const specialists: SpecialistAgent[] = [
  {
    id: "code-writer",
    name: "Code Writer",
    description: "Escribe y modifica código",
    systemPrompt: "Eres un programador experto. Solo escribes código, no explicas.",
    tools: ["readFile", "writeFile", "searchCode"],
    handle: async (task) => { /* implementación */ return ""; },
  },
  {
    id: "test-writer",
    name: "Test Writer",
    description: "Escribe y ejecuta tests",
    systemPrompt: "Eres un QA engineer. Escribes tests exhaustivos.",
    tools: ["readFile", "writeFile", "runTests"],
    handle: async (task) => { /* implementación */ return ""; },
  },
  {
    id: "reviewer",
    name: "Code Reviewer",
    description: "Revisa código por bugs y seguridad",
    systemPrompt: "Eres un security reviewer. Encuentras bugs y vulnerabilidades.",
    tools: ["readFile", "searchCode"],
    handle: async (task) => { /* implementación */ return ""; },
  },
];

async function orchestrate(task: string): Promise<string> {
  // El orquestador decide la secuencia
  const planPrompt = \`Tarea: \${task}
Agentes disponibles: \${specialists.map(s => \`\${s.id}: \${s.description}\`).join(", ")}
¿Qué agentes necesitas y en qué orden? Responde JSON: [{ "agentId": "", "subtask": "" }]\`;

  const plan = JSON.parse(await llm.generate(planPrompt));
  const results: string[] = [];

  for (const step of plan) {
    const agent = specialists.find(s => s.id === step.agentId);
    if (!agent) continue;
    const result = await agent.handle(step.subtask);
    results.push(\`[\${agent.name}]: \${result}\`);
  }

  return results.join("\\n\\n");
}`,
          caption: "El orquestador no ejecuta tareas — solo decide quién las ejecuta y en qué orden.",
        },
        tip: "Limita la comunicación entre agentes. Si el code-writer necesita feedback del reviewer, que pase por el orquestador. Evita loops directos entre agentes.",
      },
    ],
    exercise: {
      instruction:
        "Diseña un sistema multi-agente para un flujo de 'fix bug': (1) agente Investigador que lee logs y código, (2) agente Developer que implementa el fix, (3) agente Tester que verifica el fix. Define los system prompts, tools, y el flujo de orquestación.",
      hints: [
        "El Investigador necesita: readLogs, searchCode, readFile",
        "El Developer necesita: readFile, editFile",
        "El Tester necesita: readFile, runTests",
        "El orquestador debe pasar el contexto del Investigador al Developer, y el fix del Developer al Tester",
      ],
    },
  },
  {
    id: "agent-3-safety",
    moduleId: "agent-architectures",
    number: 3,
    title: "Seguridad en agentes: límites, self-checks y aprobación humana",
    duration: "25 min",
    objectives: [
      "Implementar límites estrictos para acciones de agentes",
      "Construir self-checks que detecten alucinaciones y loops",
      "Diseñar puntos de aprobación humana para acciones críticas",
    ],
    sections: [
      {
        title: "Límites y guardrails para agentes",
        content: [
          "Un agente sin límites puede: ejecutar infinitas acciones, gastar dinero sin control, modificar datos sensibles, y escalar privilegios.",
          "Límites obligatorios: máximo de pasos, timeout total, presupuesto de tokens/dinero, lista de tools permitidos.",
          "Principio de blast radius: ¿cuál es el peor caso si el agente se sale de control? Diseña para minimizarlo.",
        ],
        code: {
          language: "typescript",
          code: `// Configuración de seguridad para agentes
interface AgentSafetyConfig {
  maxSteps: number;           // máximo pasos antes de abortar
  maxDurationMs: number;      // timeout total
  maxTokenBudget: number;     // máximo tokens consumidos
  maxCostUSD: number;         // máximo gasto
  allowedTools: string[];     // whitelist de tools
  blockedActions: string[];   // patrones bloqueados
  requireApproval: string[];  // tools que requieren aprobación humana
}

const safeDefaults: AgentSafetyConfig = {
  maxSteps: 15,
  maxDurationMs: 5 * 60 * 1000, // 5 minutos
  maxTokenBudget: 100_000,
  maxCostUSD: 1.00,
  allowedTools: ["readFile", "searchCode", "runTests"],
  blockedActions: ["rm -rf", "DROP TABLE", "force push", "sudo"],
  requireApproval: ["writeFile", "createPR", "deploy"],
};

class SafeAgent {
  private stepsUsed = 0;
  private tokensUsed = 0;
  private startTime = Date.now();

  constructor(private config: AgentSafetyConfig) {}

  canProceed(): { allowed: boolean; reason?: string } {
    if (this.stepsUsed >= this.config.maxSteps)
      return { allowed: false, reason: "Límite de pasos alcanzado" };
    if (Date.now() - this.startTime > this.config.maxDurationMs)
      return { allowed: false, reason: "Timeout del agente" };
    if (this.tokensUsed > this.config.maxTokenBudget)
      return { allowed: false, reason: "Presupuesto de tokens excedido" };
    return { allowed: true };
  }

  canUseTool(tool: string): { allowed: boolean; needsApproval: boolean; reason?: string } {
    if (!this.config.allowedTools.includes(tool))
      return { allowed: false, needsApproval: false, reason: \`Tool '\${tool}' no permitido\` };
    const needsApproval = this.config.requireApproval.includes(tool);
    return { allowed: true, needsApproval };
  }

  isBlockedAction(command: string): boolean {
    return this.config.blockedActions.some(p => command.includes(p));
  }
}`,
          caption: "Un agente seguro verifica límites ANTES de cada acción, no después.",
        },
      },
      {
        title: "Aprobación humana (human-in-the-loop)",
        content: [
          "Para acciones de alto impacto (escribir código, crear PRs, deployar), el agente debe pedir permiso antes de ejecutar.",
          "El agente presenta: qué quiere hacer, por qué, y cuál es el impacto esperado. El humano aprueba o rechaza.",
          "Si el humano rechaza, el agente debe poder re-planificar o abortar gracefully.",
        ],
        code: {
          language: "typescript",
          code: `// Human-in-the-loop para acciones críticas
interface ApprovalRequest {
  action: string;
  reasoning: string;
  impact: string;
  reversible: boolean;
}

interface ApprovalResponse {
  approved: boolean;
  feedback?: string;
}

// En una app real, esto sería un webhook, UI, o notificación
async function requestHumanApproval(
  request: ApprovalRequest
): Promise<ApprovalResponse> {
  console.log("\\n=== APROBACIÓN REQUERIDA ===");
  console.log(\`Acción: \${request.action}\`);
  console.log(\`Razón: \${request.reasoning}\`);
  console.log(\`Impacto: \${request.impact}\`);
  console.log(\`Reversible: \${request.reversible ? "Sí" : "No"}\`);
  console.log("===========================\\n");

  // Simular aprobación (en prod: esperar input real)
  return { approved: true };
}

// Uso en el agente
async function safeExecute(
  tool: string,
  params: Record<string, unknown>,
  safety: SafeAgent
): Promise<string> {
  const check = safety.canUseTool(tool);
  if (!check.allowed) throw new Error(check.reason);

  if (check.needsApproval) {
    const approval = await requestHumanApproval({
      action: \`Ejecutar \${tool} con params: \${JSON.stringify(params)}\`,
      reasoning: "El agente necesita esta acción para completar la tarea",
      impact: tool === "deploy" ? "Alto — cambios en producción" : "Medio",
      reversible: !["deploy", "deleteFile"].includes(tool),
    });

    if (!approval.approved) {
      return \`Acción denegada por el usuario: \${approval.feedback ?? "sin feedback"}\`;
    }
  }

  return await tools.get(tool)!(params);
}`,
          caption: "El human-in-the-loop es tu último guardrail. Nunca lo omitas para acciones irreversibles.",
        },
      },
    ],
    exercise: {
      instruction:
        "Construye un agente de 'DevOps helper' que pueda: leer logs, buscar en código, y proponer fixes. Implementa: (1) safety config con límites estrictos, (2) aprobación humana para cualquier escritura, (3) detección de loops (si el agente repite la misma acción 3 veces, aborta), (4) resumen de acciones tomadas al finalizar.",
      hints: [
        "Para detección de loops: mantén un historial de acciones y compara",
        "El resumen final ayuda al humano a auditar qué hizo el agente",
        "Si el agente aborda por loop, incluye las últimas 3 acciones en el error para debugging",
      ],
    },
  },
];
