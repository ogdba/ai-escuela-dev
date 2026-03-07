import type { Lesson } from "./types";

export const promptopsGuardrailsLessons: Lesson[] = [
  {
    id: "po-1-versionado",
    moduleId: "promptops-guardrails",
    number: 1,
    title: "PromptOps: versionado y gestión de prompts",
    duration: "20 min",
    objectives: [
      "Implementar un sistema de versionado de prompts como infraestructura",
      "Definir políticas de cambio y rollback para prompts",
      "Integrar prompts versionados en tu flujo de desarrollo",
    ],
    sections: [
      {
        title: "Prompts como infraestructura",
        content: [
          "Un prompt en producción es tan crítico como una migración de base de datos. Un cambio de una palabra puede romper el 30% de las respuestas.",
          "PromptOps es la disciplina de versionar, probar, desplegar y monitorear prompts como código de infraestructura.",
          "Principios: inmutabilidad (cada versión es inmutable), trazabilidad (quién cambió qué y cuándo), y rollback instantáneo.",
        ],
        code: {
          language: "typescript",
          code: `// Registry de prompts con versionado semántico
interface PromptConfig {
  id: string;
  version: string;        // semver: major.minor.patch
  template: string;
  model: string;
  temperature: number;
  maxTokens: number;
  createdBy: string;
  createdAt: string;
  changelog: string;
  tags: string[];
}

// Almacenamiento inmutable — archivo JSON versionado en Git
const PROMPT_REGISTRY: PromptConfig[] = [
  {
    id: "code-review",
    version: "2.1.0",
    template: \`Revisa este código {language}. Busca bugs de seguridad y rendimiento.
Responde en JSON: {{ "findings": [{{ "severity", "line", "issue", "fix" }}] }}\`,
    model: "claude-sonnet-4-6",
    temperature: 0,
    maxTokens: 2048,
    createdBy: "dev-team",
    createdAt: "2025-06-15",
    changelog: "Agrega severity levels y formato JSON estricto",
    tags: ["code-review", "security"],
  },
];

function getActivePrompt(id: string): PromptConfig | undefined {
  // Devuelve la versión más reciente
  return PROMPT_REGISTRY
    .filter(p => p.id === id)
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
    .at(0);
}

function getPromptVersion(id: string, version: string): PromptConfig | undefined {
  return PROMPT_REGISTRY.find(p => p.id === id && p.version === version);
}`,
          caption: "Versiona prompts en Git junto con tu código. Cada PR que cambie un prompt debe incluir evals.",
        },
      },
      {
        title: "Plantillas parametrizadas",
        content: [
          "Nunca hardcodees valores en prompts. Usa plantillas con variables que se resuelven en runtime.",
          "Las variables comunes: {language}, {context}, {userInput}, {maxItems}, {format}.",
          "Las plantillas permiten reusar el mismo prompt para diferentes idiomas, formatos y contextos.",
        ],
        code: {
          language: "typescript",
          code: `// Motor de plantillas simple pero robusto
function renderPrompt(
  template: string,
  variables: Record<string, string>
): string {
  let rendered = template;
  const missingVars: string[] = [];

  // Encontrar todas las variables en el template
  const varPattern = /\\{(\\w+)\\}/g;
  let match: RegExpExecArray | null;
  while ((match = varPattern.exec(template)) !== null) {
    const varName = match[1];
    if (varName in variables) {
      rendered = rendered.replace(match[0], variables[varName]);
    } else {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(\`Variables faltantes en prompt: \${missingVars.join(", ")}\`);
  }

  return rendered;
}

// Uso
const prompt = renderPrompt(
  "Revisa este código {language}. Máximo {maxFindings} hallazgos.\\n{code}",
  { language: "TypeScript", maxFindings: "5", code: fileContent }
);`,
          caption: "Lanza error si faltan variables. Mejor fallar rápido que enviar un prompt incompleto al modelo.",
        },
        tip: "Para plantillas complejas con condicionales, considera usar una librería como Handlebars o Mustache en lugar de reemplazos manuales.",
      },
    ],
    exercise: {
      instruction:
        "Diseña un sistema de prompts versionados para una API de soporte técnico con 3 prompts: clasificador de tickets, generador de respuestas, y detector de urgencia. Incluye: schema de configuración, al menos 2 versiones de cada prompt, y un mecanismo de rollback.",
      hints: [
        "Usa semver: patch para fixes de typos, minor para mejoras, major para cambios de formato",
        "El rollback puede ser tan simple como apuntar a una versión anterior",
        "Incluye metadata de model y temperature en cada versión",
      ],
    },
  },
  {
    id: "po-2-guardrails",
    moduleId: "promptops-guardrails",
    number: 2,
    title: "Guardrails: validación de entradas y salidas",
    duration: "25 min",
    objectives: [
      "Implementar validación de entrada contra inyección y contenido malicioso",
      "Validar salidas del modelo contra schemas definidos",
      "Construir filtros de PII y contenido sensible",
    ],
    sections: [
      {
        title: "Validación de entradas",
        content: [
          "Toda entrada del usuario debe pasar por validación ANTES de llegar al prompt. Es tu primera línea de defensa.",
          "Valida: longitud máxima (evita abuse de tokens), caracteres permitidos, formato esperado.",
          "Detecta patrones de inyección: instrucciones embebidas, cambios de rol, delimitadores falsos.",
        ],
        code: {
          language: "typescript",
          code: `// Guardrails de entrada
interface InputGuard {
  name: string;
  check: (input: string) => { safe: boolean; reason?: string };
}

const inputGuards: InputGuard[] = [
  {
    name: "max-length",
    check: (input) => ({
      safe: input.length <= 5000,
      reason: input.length > 5000 ? "Input excede 5000 caracteres" : undefined,
    }),
  },
  {
    name: "injection-patterns",
    check: (input) => {
      const patterns = [
        /ignore (all |previous |above )?instructions/i,
        /you are now/i,
        /system:\\s/i,
        /\\[INST\\]/i,
        /<\\|im_start\\|>/i,
      ];
      const match = patterns.find(p => p.test(input));
      return {
        safe: !match,
        reason: match ? \`Patrón de inyección detectado: \${match.source}\` : undefined,
      };
    },
  },
  {
    name: "encoding-check",
    check: (input) => {
      // Detecta caracteres de control y Unicode adversarial
      const suspicious = /[\\x00-\\x08\\x0B-\\x0C\\x0E-\\x1F\\u200B-\\u200F\\u2028-\\u202F]/;
      return {
        safe: !suspicious.test(input),
        reason: suspicious.test(input) ? "Caracteres de control sospechosos" : undefined,
      };
    },
  },
];

function validateInput(input: string): { safe: boolean; violations: string[] } {
  const violations: string[] = [];
  for (const guard of inputGuards) {
    const result = guard.check(input);
    if (!result.safe) violations.push(\`[\${guard.name}] \${result.reason}\`);
  }
  return { safe: violations.length === 0, violations };
}`,
          caption: "Ejecuta TODOS los guards, no solo el primero que falle. Quieres visibilidad completa.",
        },
      },
      {
        title: "Validación de salidas con schemas",
        content: [
          "El modelo puede devolver cualquier cosa. Tu código debe validar que la salida cumple el schema esperado.",
          "Usa Zod, Joi, o JSON Schema para definir la estructura esperada y validar automáticamente.",
          "Si la salida no es válida: reintenta una vez con instrucciones más específicas, y si falla de nuevo, usa el fallback.",
        ],
        code: {
          language: "typescript",
          code: `import { z } from "zod";

// Schema de salida esperada
const ReviewOutputSchema = z.object({
  findings: z.array(z.object({
    severity: z.enum(["critical", "warning", "info"]),
    line: z.number().int().positive(),
    issue: z.string().min(10).max(200),
    fix: z.string().min(10).max(500),
  })).max(10),
});

type ReviewOutput = z.infer<typeof ReviewOutputSchema>;

async function safeCallLLM(prompt: string): Promise<ReviewOutput> {
  const raw = await llm.generate(prompt);

  // Intentar parsear JSON del response
  let parsed: unknown;
  try {
    // Extraer JSON si viene envuelto en markdown
    const jsonMatch = raw.match(/\\\`\\\`\\\`json?\\n?([\\s\\S]*?)\\\`\\\`\\\`/) ?? [null, raw];
    parsed = JSON.parse(jsonMatch[1] ?? raw);
  } catch {
    // Retry con instrucción más específica
    const retryRaw = await llm.generate(
      prompt + "\\n\\nIMPORTANTE: Responde SOLO con JSON válido, sin markdown."
    );
    parsed = JSON.parse(retryRaw);
  }

  // Validar contra schema
  return ReviewOutputSchema.parse(parsed);
}`,
          caption: "Patrón: parse → validate → use. Nunca uses la salida raw sin validación.",
        },
      },
      {
        title: "Filtros de PII y contenido sensible",
        content: [
          "PII (Personally Identifiable Information): emails, teléfonos, SSN, tarjetas de crédito, direcciones.",
          "El modelo puede generar o repetir PII que estaba en el contexto. Filtra ANTES de mostrar al usuario.",
          "También filtra contenido tóxico, URLs sospechosas, y código potencialmente peligroso en las salidas.",
        ],
        code: {
          language: "typescript",
          code: `// Filtro de PII para salidas del modelo
interface PIIFilter {
  name: string;
  pattern: RegExp;
  replacement: string;
}

const piiFilters: PIIFilter[] = [
  { name: "email", pattern: /[\\w.-]+@[\\w.-]+\\.\\w{2,}/g, replacement: "[EMAIL_REDACTED]" },
  { name: "phone", pattern: /\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{3,4}[-.\\s]?\\d{3,4}/g, replacement: "[PHONE_REDACTED]" },
  { name: "credit-card", pattern: /\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b/g, replacement: "[CARD_REDACTED]" },
  { name: "ip-address", pattern: /\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b/g, replacement: "[IP_REDACTED]" },
];

function sanitizeOutput(text: string): { sanitized: string; redactions: string[] } {
  let sanitized = text;
  const redactions: string[] = [];

  for (const filter of piiFilters) {
    const matches = sanitized.match(filter.pattern);
    if (matches) {
      redactions.push(\`\${filter.name}: \${matches.length} instancias redactadas\`);
      sanitized = sanitized.replace(filter.pattern, filter.replacement);
    }
  }

  return { sanitized, redactions };
}`,
          caption: "Ejecuta filtros de PII como último paso antes de devolver la respuesta al usuario.",
        },
        tip: "Los filtros regex son un baseline. Para producción real, usa un servicio de DLP (Data Loss Prevention) como Google DLP API o AWS Macie.",
      },
    ],
    exercise: {
      instruction:
        "Construye un pipeline completo de guardrails para un chatbot: (1) validación de entrada (longitud, inyección, encoding), (2) llamada al LLM con retry, (3) validación de salida con schema Zod, (4) filtro de PII. El pipeline debe devolver una respuesta segura o un mensaje de fallback.",
      hints: [
        "Usa un patrón pipe/chain donde cada paso puede abortar el flujo",
        "El fallback debe ser genérico y seguro: 'No pude procesar tu solicitud. Intenta reformular.'",
        "Loguea cada violación para análisis posterior",
      ],
    },
  },
  {
    id: "po-3-fallbacks",
    moduleId: "promptops-guardrails",
    number: 3,
    title: "Circuit breakers, fallbacks y contención",
    duration: "20 min",
    objectives: [
      "Implementar circuit breakers para llamadas a LLMs",
      "Diseñar fallbacks útiles cuando el modelo falla",
      "Crear playbooks de contención ante degradación",
    ],
    sections: [
      {
        title: "Circuit breaker para LLMs",
        content: [
          "Un circuit breaker previene llamadas a un servicio que está fallando. Protege tu app de cascadas de errores.",
          "Estados: CLOSED (normal), OPEN (bloqueado, usa fallback), HALF-OPEN (prueba si se recuperó).",
          "Para LLMs: abre el circuito si las últimas N llamadas fallan, o si la latencia supera un umbral.",
        ],
        code: {
          language: "typescript",
          code: `class LLMCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private maxFailures: number = 5,
    private resetTimeMs: number = 30_000,
  ) {}

  async call<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailure > this.resetTimeMs) {
        this.state = "half-open";
      } else {
        console.warn("[CircuitBreaker] OPEN — usando fallback");
        return fallback();
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback();
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();
    if (this.failures >= this.maxFailures) {
      this.state = "open";
      console.error(\`[CircuitBreaker] OPEN después de \${this.failures} fallos\`);
    }
  }
}

// Uso
const breaker = new LLMCircuitBreaker(3, 60_000);
const result = await breaker.call(
  () => llm.generate(prompt),
  () => "Lo siento, el servicio no está disponible. Intenta en unos minutos."
);`,
          caption: "El circuit breaker evita que tu app se quede colgada esperando un LLM que está caído.",
        },
      },
      {
        title: "Diseño de fallbacks útiles",
        content: [
          "Un fallback no es solo un mensaje de error. Puede ser una respuesta cached, un modelo más simple, o una acción alternativa.",
          "Jerarquía de fallbacks: (1) retry con el mismo modelo, (2) modelo alternativo más rápido/barato, (3) respuesta cacheada, (4) mensaje genérico.",
          "Cada nivel de fallback debe ser transparente al usuario cuando sea apropiado.",
        ],
        code: {
          language: "typescript",
          code: `// Fallback chain con múltiples niveles
async function resilientLLMCall(prompt: string): Promise<string> {
  // Nivel 1: modelo principal
  try {
    return await callModel("claude-sonnet-4-6", prompt, { timeout: 10_000 });
  } catch (e) {
    console.warn("Modelo principal falló, intentando alternativo...");
  }

  // Nivel 2: modelo más rápido/barato
  try {
    return await callModel("claude-haiku-4-5-20251001", prompt, { timeout: 5_000 });
  } catch (e) {
    console.warn("Modelo alternativo falló, buscando cache...");
  }

  // Nivel 3: respuesta cacheada similar
  const cached = await responseCache.findSimilar(prompt, { threshold: 0.85 });
  if (cached) {
    return cached.response + "\\n\\n_Nota: respuesta basada en una consulta similar anterior._";
  }

  // Nivel 4: mensaje genérico
  return "No pude procesar tu solicitud en este momento. " +
    "Por favor intenta de nuevo en unos minutos o contacta soporte.";
}`,
          caption: "Cada nivel degrada gracefully. El usuario recibe algo útil en lugar de un error 500.",
        },
        tip: "Cachea respuestas exitosas por hash del prompt. Muchos usuarios hacen las mismas preguntas.",
      },
    ],
    exercise: {
      instruction:
        "Implementa un sistema completo con: (1) circuit breaker configurable, (2) cadena de 3 niveles de fallback, (3) logging de cada fallback activado, (4) métrica de salud (% de requests que usan fallback en los últimos 5 minutos).",
      hints: [
        "El circuit breaker debe ser por endpoint, no global",
        "Usa un ring buffer para trackear los últimos N resultados",
        "La métrica de salud ayuda a decidir cuándo escalar o alertar",
      ],
    },
  },
];
