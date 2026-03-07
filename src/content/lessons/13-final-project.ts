import type { Lesson } from "./types";

export const finalProjectLessons: Lesson[] = [
  {
    id: "final-1-scope",
    moduleId: "final-project",
    number: 1,
    title: "Definición de alcance y arquitectura del proyecto",
    duration: "30 min",
    objectives: [
      "Definir el alcance de un proyecto que integre al menos 4 módulos del curso",
      "Diseñar la arquitectura incluyendo todas las capas de IA necesarias",
      "Crear un plan de trabajo con milestones y criterios de aceptación",
    ],
    sections: [
      {
        title: "Eligiendo tu proyecto",
        content: [
          "El proyecto final debe integrar al menos 4 módulos del curso. No es un demo — es algo que podrías poner en producción.",
          "Ideas probadas: chatbot de soporte con RAG + guardrails + evals + observabilidad; agente de code review con MCP + seguridad + CI/CD; pipeline de análisis de documentos con modelos locales + cloud + caching.",
          "La clave no es la complejidad del feature, sino la robustez de la implementación: seguridad, testing, observabilidad, y manejo de errores.",
        ],
        code: {
          language: "typescript",
          code: `// Template de propuesta de proyecto
interface ProjectProposal {
  title: string;
  problem: string;          // ¿Qué problema resuelve?
  users: string;            // ¿Quién lo usará?
  modulesIntegrated: string[]; // Mínimo 4 módulos
  architecture: {
    frontend: string;
    backend: string;
    llmProvider: string;
    dataStore: string;
    deployment: string;
  };
  milestones: {
    week: number;
    deliverable: string;
    criteria: string[];     // criterios de aceptación
  }[];
  risks: { risk: string; mitigation: string }[];
}

// Ejemplo de propuesta
const exampleProposal: ProjectProposal = {
  title: "DevHelper — Asistente de soporte técnico con RAG",
  problem: "Los developers pierden 2h/día buscando en docs internas",
  users: "Equipo de ingeniería (20 personas)",
  modulesIntegrated: [
    "rag-fundamentals",
    "promptops-guardrails",
    "ai-evals",
    "observability-cost-latency",
    "ai-security",
  ],
  architecture: {
    frontend: "Next.js con chat UI",
    backend: "API Routes + pipeline RAG",
    llmProvider: "Claude Sonnet (cloud) + Llama 3.1 (fallback local)",
    dataStore: "ChromaDB para vectores, PostgreSQL para metadata",
    deployment: "Vercel + Docker para vector store",
  },
  milestones: [
    {
      week: 1,
      deliverable: "Pipeline RAG funcional con docs del equipo",
      criteria: ["Recall@5 >= 0.80 en golden set", "Responde en < 3 segundos"],
    },
    {
      week: 2,
      deliverable: "Guardrails + security + evals",
      criteria: ["0 prompt injections en test suite", "Evals pasan en CI"],
    },
    {
      week: 3,
      deliverable: "Observabilidad + deploy",
      criteria: ["Dashboard de costos funcional", "Health checks verdes"],
    },
  ],
  risks: [
    { risk: "RAG con baja calidad en docs técnicos", mitigation: "Chunking especializado para código" },
    { risk: "Costos altos por volumen", mitigation: "Cache + modelo local para queries simples" },
  ],
};`,
          caption: "Una propuesta bien definida es la mitad del proyecto. Invierte tiempo aquí antes de escribir código.",
        },
      },
      {
        title: "Diseño de arquitectura",
        content: [
          "Dibuja el diagrama de flujo completo: desde el input del usuario hasta la respuesta final.",
          "Identifica cada punto donde necesitas: validación, cache, logging, error handling.",
          "Define las interfaces entre componentes antes de implementar. Esto permite trabajar en paralelo.",
        ],
        code: {
          language: "typescript",
          code: `// Interfaces del proyecto — definir antes de implementar
interface ChatRequest {
  userId: string;
  message: string;
  sessionId: string;
  context?: string[];
}

interface ChatResponse {
  message: string;
  sources: { title: string; url: string; relevance: number }[];
  cached: boolean;
  latencyMs: number;
  model: string;
}

interface ProjectModules {
  // Módulo RAG
  retriever: {
    search(query: string, topK: number): Promise<Document[]>;
    ingest(docs: RawDocument[]): Promise<void>;
  };

  // Módulo Guardrails
  guard: {
    validateInput(input: string): Promise<ValidationResult>;
    validateOutput(output: string): Promise<ValidationResult>;
  };

  // Módulo Evals
  evaluator: {
    runSuite(goldenSet: GoldenCase[]): Promise<EvalReport>;
    compareVersions(baseline: EvalReport, candidate: EvalReport): ComparisonResult;
  };

  // Módulo Observabilidad
  monitor: {
    trace(fn: () => Promise<unknown>): Promise<{ result: unknown; trace: Trace }>;
    recordCost(entry: CostEntry): void;
    getMetrics(): DashboardMetrics;
  };

  // Módulo Seguridad
  security: {
    sanitizeInput(input: string): SanitizeResult;
    sanitizeOutput(output: string): SanitizeResult;
    auditLog(entry: AuditEntry): void;
  };
}`,
          caption: "Define interfaces primero, implementa después. Esto te permite testear con mocks desde el día 1.",
        },
      },
    ],
    exercise: {
      instruction:
        "Escribe tu propuesta de proyecto final: (1) título y descripción del problema, (2) módulos a integrar (mínimo 4), (3) arquitectura con diagrama ASCII, (4) 3 milestones semanales con criterios de aceptación, (5) 3 riesgos con mitigaciones.",
      hints: [
        "Elige un problema que conozcas bien — tu equipo, tu empresa, tu comunidad",
        "Los módulos más impactantes para demostrar: RAG + Guardrails + Security + Observability",
        "Sé realista con los milestones: 3 semanas de trabajo parcial",
      ],
    },
  },
  {
    id: "final-2-implementation",
    moduleId: "final-project",
    number: 2,
    title: "Implementación y buenas prácticas",
    duration: "30 min",
    objectives: [
      "Implementar el proyecto siguiendo las prácticas del curso",
      "Integrar testing, seguridad y observabilidad desde el inicio",
      "Documentar decisiones técnicas y trade-offs",
    ],
    sections: [
      {
        title: "Checklist de implementación",
        content: [
          "No empieces por el feature más complejo. Empieza por el happy path más simple y agrégale capas.",
          "Orden recomendado: (1) Prompt + LLM call básico, (2) Validación de I/O, (3) Caching, (4) Evals, (5) Security, (6) Observabilidad.",
          "Escribe tests desde el primer día. Un eval que falla te dice que algo cambió; sin eval, no te enteras hasta producción.",
        ],
        code: {
          language: "typescript",
          code: `// Checklist de implementación por capa
const implementationChecklist = {
  core: {
    name: "Funcionalidad core",
    items: [
      "LLM call funcional con prompt versionado",
      "Respuestas en formato estructurado (JSON/schema)",
      "Happy path end-to-end funciona",
    ],
  },
  quality: {
    name: "Calidad y testing",
    items: [
      "Golden set con 20+ casos",
      "Evals pasan con accuracy >= 85%",
      "Unit tests para validadores y utilidades",
      "E2E test para el happy path principal",
    ],
  },
  security: {
    name: "Seguridad",
    items: [
      "Input validation contra injection",
      "Output sanitization (PII, XSS)",
      "Audit log de todas las llamadas al LLM",
      "Rate limiting por usuario",
      "Threat model documentado",
    ],
  },
  observability: {
    name: "Observabilidad",
    items: [
      "Trazas con latencia por paso del pipeline",
      "Métricas de costo por feature y usuario",
      "Health check con canary prompt",
      "Dashboard con P50/P95 y error rate",
    ],
  },
  operations: {
    name: "Operaciones",
    items: [
      "CI pipeline con evals + security scan",
      "Rollback plan documentado y testeado",
      "Fallback chain configurado",
      "README con instrucciones de setup",
    ],
  },
};`,
          caption: "Cada sección del checklist corresponde a un módulo del curso. Tu proyecto debería marcar todos los checkboxes de los módulos que integra.",
        },
      },
      {
        title: "Documentación de decisiones",
        content: [
          "Documenta CADA decisión técnica importante: qué modelo elegiste y por qué, qué chunking strategy, qué threshold de cache.",
          "Usa ADRs (Architecture Decision Records): estado, contexto, decisión, consecuencias.",
          "La documentación no es burocracia — es lo que te salva cuando vuelves al proyecto en 3 meses.",
        ],
        code: {
          language: "typescript",
          code: `// Template de ADR (Architecture Decision Record)
interface ADR {
  id: string;
  title: string;
  status: "proposed" | "accepted" | "deprecated" | "superseded";
  date: string;
  context: string;      // ¿Por qué necesitamos decidir esto?
  decision: string;     // ¿Qué decidimos?
  alternatives: string[]; // ¿Qué más consideramos?
  consequences: {
    positive: string[];
    negative: string[];
  };
}

const adrExample: ADR = {
  id: "ADR-001",
  title: "Usar Claude Sonnet como modelo principal con Haiku como fallback",
  status: "accepted",
  date: "2025-06-01",
  context: "Necesitamos elegir un modelo para el chatbot de soporte. " +
    "Requisitos: buena calidad en español, formato JSON confiable, costo razonable.",
  decision: "Claude Sonnet para requests normales, Claude Haiku para degradación " +
    "y queries clasificadas como simples. Llama 3.1 8B local como último fallback.",
  alternatives: [
    "GPT-4o: buena calidad pero 2x más caro y sin ventaja clara en español",
    "Solo modelo local: insuficiente calidad para queries complejas",
    "Solo Claude Opus: calidad excelente pero costo prohibitivo para el volumen esperado",
  ],
  consequences: {
    positive: [
      "Costo estimado $150/mes para 10K requests",
      "Fallback asegura disponibilidad even si Anthropic API está down",
      "Haiku para queries simples reduce costo ~40%",
    ],
    negative: [
      "Dependencia de 2 proveedores (Anthropic + local)",
      "Complejidad de routing entre modelos",
      "Necesidad de evaluar 3 modelos en CI",
    ],
  },
};`,
          caption: "Un buen ADR se escribe en 15 minutos y ahorra horas de arqueología cuando alguien pregunta '¿por qué usamos X?'.",
        },
      },
    ],
    exercise: {
      instruction:
        "Comienza la implementación de tu proyecto: (1) setup del repositorio con la estructura base, (2) implementa el happy path más simple (prompt → LLM → respuesta), (3) agrega validación de I/O, (4) escribe los primeros 5 test cases de tu golden set, (5) documenta tu primera ADR (elección de modelo).",
      hints: [
        "No intentes hacer todo perfecto desde el inicio. Commit frecuente, mejora iterativa.",
        "El golden set inicial puede tener datos sintéticos — los reemplazarás con datos reales después",
        "La primera ADR es la más importante: define el modelo, su configuración, y los criterios de cambio",
      ],
    },
  },
  {
    id: "final-3-review",
    moduleId: "final-project",
    number: 3,
    title: "Revisión, presentación y próximos pasos",
    duration: "25 min",
    objectives: [
      "Completar la revisión de seguridad del proyecto",
      "Preparar una demo efectiva del proyecto",
      "Definir roadmap de mejoras post-curso",
    ],
    sections: [
      {
        title: "Revisión de seguridad final",
        content: [
          "Antes de presentar, ejecuta una revisión de seguridad completa. Usa el checklist del Módulo 10.",
          "Corre el threat model de tu proyecto. ¿Cuáles son los 3 riesgos principales? ¿Están mitigados?",
          "Ejecuta la suite de prompt injection. Si algún payload pasa, arréglalo antes de presentar.",
        ],
        code: {
          language: "typescript",
          code: `// Checklist de revisión final
const finalReviewChecklist = {
  security: [
    "Prompt injection suite: 0 payloads exitosos",
    "Output sanitization: 0 PII leaks en test suite",
    "Rate limiting: funcional y testeado",
    "Audit log: registra todas las acciones",
    "Threat model: documentado y revisado",
  ],
  quality: [
    "Evals: accuracy >= 85% en golden set",
    "Format validation: 100% outputs válidos",
    "Latencia P95: < 5 segundos",
    "Error rate: < 2%",
  ],
  operations: [
    "Health check: implementado y verificado",
    "Rollback: probado manualmente",
    "CI pipeline: todos los gates pasan",
    "Documentación: README, ADRs, threat model",
  ],
  demo: [
    "Happy path funciona en vivo",
    "Edge case preparado para mostrar guardrails",
    "Dashboard de métricas visible",
    "Failover demostrable (desconectar provider y ver fallback)",
  ],
};`,
          caption: "Si no puedes marcar todos los items de seguridad, identifica los gaps y documéntalos como 'trabajo pendiente'.",
        },
      },
      {
        title: "Presentación y retrospectiva",
        content: [
          "Una buena demo muestra: el problema, la solución, los guardrails en acción, y las métricas.",
          "Muestra un edge case a propósito: qué pasa cuando el LLM se equivoca, cuando hay injection, cuando el servicio está lento.",
          "Incluye una retrospectiva honesta: qué funcionó, qué no, qué harías diferente, qué aprendiste.",
        ],
        tip: "La retrospectiva es la parte más valiosa. Los revisores quieren ver que puedes evaluar críticamente tu propio trabajo, no que pretendas que todo es perfecto.",
      },
      {
        title: "Roadmap post-curso",
        content: [
          "Tu proyecto no termina con la presentación. Define los próximos pasos realistas.",
          "Quick wins: mejoras que puedes hacer en 1-2 horas (agregar más test cases, mejorar un prompt, optimizar cache).",
          "Medium term: features que requieren 1-2 semanas (agregar un nuevo pipeline, mejorar el RAG, integrar un nuevo proveedor).",
          "Long term: evolución a producción real (auth, multi-tenant, scaling, monitoring avanzado).",
        ],
      },
    ],
    exercise: {
      instruction:
        "Completa tu proyecto final: (1) ejecuta la revisión de seguridad completa, (2) graba o documenta una demo de 5 minutos que muestre happy path + edge case + métricas, (3) escribe una retrospectiva de 1 página con: 3 cosas que funcionaron, 3 que mejorarías, y tu roadmap de 3 meses.",
      hints: [
        "La demo es más impactante si muestras un fallo controlado (injection bloqueada, fallback activado)",
        "En la retrospectiva, sé honesto. Decir 'el RAG no fue tan preciso como esperaba' es más valioso que fingir que todo es perfecto",
        "El roadmap debe incluir métricas: 'mejorar accuracy de 85% a 92% en Q3'",
      ],
    },
  },
];
