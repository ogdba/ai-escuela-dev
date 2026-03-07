import type { Lesson } from "./types";

export const deploymentLessons: Lesson[] = [
  {
    id: "deploy-1-architecture",
    moduleId: "deployment",
    number: 1,
    title: "Arquitectura de producción para apps con LLM",
    duration: "25 min",
    objectives: [
      "Diseñar una arquitectura escalable para aplicaciones con LLM",
      "Implementar capas de abstracción para independencia de proveedor",
      "Configurar caching, cola de requests y gestión de errores a nivel de infraestructura",
    ],
    sections: [
      {
        title: "Capas de una app con LLM en producción",
        content: [
          "Una app con LLM en producción tiene capas adicionales que un app web tradicional no necesita.",
          "API Gateway → Rate Limiter → Request Queue → LLM Router → Cache Layer → LLM Provider → Output Validator → Response.",
          "Cada capa agrega resiliencia pero también latencia. Optimiza para tu caso de uso.",
        ],
        code: {
          language: "typescript",
          code: `// Arquitectura en capas para producción
// ┌─────────────┐
// │   Client     │
// └──────┬──────┘
//        │
// ┌──────▼──────┐
// │ API Gateway  │ ← Auth, rate limit global
// └──────┬──────┘
//        │
// ┌──────▼──────┐
// │ AI Middleware │ ← Validación, routing, cache check
// └──────┬──────┘
//        │
// ┌──────▼──────┐  ┌────────────┐
// │ LLM Router   │──│ Cache Layer │ (hit? → return)
// └──────┬──────┘  └────────────┘
//        │
// ┌──────▼──────┐  ┌────────────┐
// │ Provider A   │  │ Provider B │ ← Failover
// └──────┬──────┘  └────────────┘
//        │
// ┌──────▼──────┐
// │ Output Guard │ ← Validar, sanitizar, DLP
// └──────┬──────┘
//        │
// ┌──────▼──────┐
// │   Client     │
// └─────────────┘

interface AIMiddleware {
  validateInput(req: Request): Promise<{ valid: boolean; sanitized: string }>;
  checkCache(key: string): Promise<string | null>;
  routeToProvider(model: string): LLMProvider;
  validateOutput(response: string): Promise<{ safe: boolean; output: string }>;
}`,
          caption: "Cada capa tiene un solo responsabilidad. Si una falla, las demás contienen el daño.",
        },
      },
      {
        title: "Abstracción de proveedor",
        content: [
          "Tu código no debe depender directamente de un proveedor (OpenAI, Anthropic, etc.). Usa una capa de abstracción.",
          "Esto te permite: cambiar de proveedor sin tocar lógica de negocio, usar múltiples proveedores simultáneamente, implementar failover.",
          "Define una interfaz común que todos los proveedores implementen.",
        ],
        code: {
          language: "typescript",
          code: `// Interfaz agnóstica de proveedor
interface LLMProvider {
  name: string;
  chat(messages: Message[], config: LLMConfig): Promise<LLMResponse>;
  embed(text: string): Promise<number[]>;
  isAvailable(): Promise<boolean>;
}

interface LLMConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}

interface LLMResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
  latencyMs: number;
  provider: string;
  model: string;
}

// Implementación para Anthropic
class AnthropicProvider implements LLMProvider {
  name = "anthropic";
  async chat(messages: Message[], config: LLMConfig): Promise<LLMResponse> {
    const start = Date.now();
    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages,
    });
    return {
      content: response.content[0].type === "text" ? response.content[0].text : "",
      usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
      latencyMs: Date.now() - start,
      provider: this.name,
      model: config.model,
    };
  }
  async embed(_text: string) { return []; } // Anthropic no tiene embeddings propios
  async isAvailable() { return true; }
}

// Router con failover
class LLMRouter {
  constructor(private providers: LLMProvider[]) {}

  async chat(messages: Message[], config: LLMConfig): Promise<LLMResponse> {
    for (const provider of this.providers) {
      try {
        if (await provider.isAvailable()) {
          return await provider.chat(messages, config);
        }
      } catch (error) {
        console.warn(\`Provider \${provider.name} falló, intentando siguiente...\`);
      }
    }
    throw new Error("Todos los proveedores fallaron");
  }
}`,
          caption: "Con esta abstracción, agregar un nuevo proveedor es implementar una clase, no cambiar todo tu código.",
        },
      },
    ],
    exercise: {
      instruction:
        "Diseña la arquitectura de producción para un chatbot de soporte que maneja 10K requests/día. Incluye: (1) diagrama de capas, (2) implementación del LLM Router con failover, (3) caching strategy, (4) rate limiting por usuario, (5) estimación de costos mensuales para 3 proveedores diferentes.",
      hints: [
        "10K req/día ≈ 7 req/min en promedio, pero los picos pueden ser 3-5x",
        "Para el cache, estima 30-40% hit rate en queries de soporte repetitivas",
        "Incluye un proveedor local (Ollama) como último fallback",
      ],
    },
  },
  {
    id: "deploy-2-cost-cache",
    moduleId: "deployment",
    number: 2,
    title: "Caching inteligente y gestión de costos en producción",
    duration: "25 min",
    objectives: [
      "Implementar caching multicapa para reducir costos 50-70%",
      "Configurar rate limiting escalonado por plan de usuario",
      "Monitorear y optimizar costos en tiempo real",
    ],
    sections: [
      {
        title: "Caching multicapa",
        content: [
          "Capa 1: Cache exacto en memoria (Map/LRU). Latencia: <1ms. Para queries idénticas repetidas.",
          "Capa 2: Cache semántico en Redis/vector store. Latencia: 5-20ms. Para queries similares.",
          "Capa 3: Cache de resultados procesados. Si la respuesta ya fue validada y sanitizada, guárdala completa.",
          "Meta: reducir llamadas al LLM en 40-60%. Cada call evitada es dinero ahorrado.",
        ],
        code: {
          language: "typescript",
          code: `// Cache multicapa para producción
class MultiLayerCache {
  private l1: Map<string, { value: string; expires: number }> = new Map();
  // l2: Redis o vector store (en producción)

  // L1: cache exacto por hash del prompt
  getExact(prompt: string): string | null {
    const key = this.hash(prompt);
    const entry = this.l1.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.l1.delete(key);
      return null;
    }
    return entry.value;
  }

  setExact(prompt: string, response: string, ttlMs = 3_600_000) {
    const key = this.hash(prompt);
    this.l1.set(key, { value: response, expires: Date.now() + ttlMs });

    // LRU: limitar tamaño del cache
    if (this.l1.size > 10_000) {
      const firstKey = this.l1.keys().next().value!;
      this.l1.delete(firstKey);
    }
  }

  // Middleware para pipeline
  async cachedCall(
    prompt: string,
    llmCall: () => Promise<string>,
    ttlMs?: number
  ): Promise<{ response: string; cached: boolean }> {
    // Check L1
    const cached = this.getExact(prompt);
    if (cached) return { response: cached, cached: true };

    // Miss: call LLM
    const response = await llmCall();
    this.setExact(prompt, response, ttlMs);
    return { response, cached: false };
  }

  private hash(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return hash.toString(36);
  }

  stats() {
    return { entries: this.l1.size, maxSize: 10_000 };
  }
}`,
          caption: "El L1 en memoria es gratis y ultra rápido. El L2 en Redis añade persistencia entre deploys.",
        },
      },
      {
        title: "Rate limiting escalonado",
        content: [
          "Cada plan de usuario tiene diferentes límites: free (10 req/hora), pro (100 req/hora), enterprise (1000 req/hora).",
          "Cuando un usuario se acerca al límite: degrada gracefully en lugar de bloquear. Modelo más barato, respuestas más cortas.",
          "Implementa alertas para usuarios que consistentemente tocan el límite — son candidatos a upgrade.",
        ],
        code: {
          language: "typescript",
          code: `// Rate limiter escalonado por plan
interface RateLimitConfig {
  plan: string;
  requestsPerHour: number;
  tokensPerHour: number;
  degradeAt: number;     // % del límite para empezar a degradar
  modelOverride?: string; // modelo más barato cuando degradado
}

const plans: RateLimitConfig[] = [
  { plan: "free", requestsPerHour: 10, tokensPerHour: 10_000, degradeAt: 0.8 },
  { plan: "pro", requestsPerHour: 100, tokensPerHour: 200_000, degradeAt: 0.9, modelOverride: "claude-haiku-4-5-20251001" },
  { plan: "enterprise", requestsPerHour: 1000, tokensPerHour: 2_000_000, degradeAt: 0.95 },
];

class RateLimiter {
  private usage = new Map<string, { count: number; tokens: number; windowStart: number }>();

  check(userId: string, plan: string): {
    allowed: boolean;
    degraded: boolean;
    model?: string;
    remaining: number;
  } {
    const config = plans.find(p => p.plan === plan) ?? plans[0];
    const now = Date.now();
    const hourMs = 3_600_000;

    let entry = this.usage.get(userId);
    if (!entry || now - entry.windowStart > hourMs) {
      entry = { count: 0, tokens: 0, windowStart: now };
      this.usage.set(userId, entry);
    }

    const usagePercent = entry.count / config.requestsPerHour;

    if (usagePercent >= 1) {
      return { allowed: false, degraded: false, remaining: 0 };
    }

    if (usagePercent >= config.degradeAt) {
      return {
        allowed: true,
        degraded: true,
        model: config.modelOverride,
        remaining: config.requestsPerHour - entry.count,
      };
    }

    return {
      allowed: true,
      degraded: false,
      remaining: config.requestsPerHour - entry.count,
    };
  }

  record(userId: string, tokens: number) {
    const entry = this.usage.get(userId);
    if (entry) {
      entry.count++;
      entry.tokens += tokens;
    }
  }
}`,
          caption: "La degradación gradual es mejor UX que un error 429 duro. El usuario sigue funcionando, solo más lento.",
        },
      },
    ],
    exercise: {
      instruction:
        "Implementa un sistema completo de producción con: (1) cache multicapa (L1 en memoria, L2 simulado), (2) rate limiter con 3 planes, (3) métricas de cache hit rate y savings estimados, (4) reporte de fin de día con: requests totales, cache hits, requests degradados, costo estimado vs costo sin cache.",
      hints: [
        "Savings = cache_hits × avg_cost_per_request",
        "El reporte ayuda a justificar la inversión en infraestructura de cache",
        "Simula 1000 requests con distribución realista: 40% repetidos, 30% similares, 30% únicos",
      ],
    },
  },
  {
    id: "deploy-3-monitoring",
    moduleId: "deployment",
    number: 3,
    title: "Monitoreo, alertas y operaciones en producción",
    duration: "20 min",
    objectives: [
      "Configurar dashboards operativos para features de IA",
      "Definir alertas accionables con runbooks",
      "Implementar health checks específicos para LLMs",
    ],
    sections: [
      {
        title: "Health checks para LLMs",
        content: [
          "Un health check de LLM no es solo 'está respondiendo'. Debe verificar: latencia aceptable, calidad de respuesta, y costo razonable.",
          "Implementa un 'canary prompt': una pregunta con respuesta conocida que ejecutas periódicamente para verificar que el modelo funciona correctamente.",
          "Si el canary falla, activa el circuit breaker y switchea a fallback antes de que los usuarios lo noten.",
        ],
        code: {
          language: "typescript",
          code: `// Health check con canary prompt
interface HealthStatus {
  healthy: boolean;
  latencyMs: number;
  qualityOk: boolean;
  costOk: boolean;
  lastCheck: string;
  details: string;
}

async function llmHealthCheck(
  provider: LLMProvider,
  model: string
): Promise<HealthStatus> {
  const canaryPrompt = "¿Cuánto es 2 + 2? Responde solo con el número.";
  const expectedAnswer = "4";
  const maxLatency = 5000; // 5 segundos

  const start = Date.now();
  try {
    const response = await provider.chat(
      [{ role: "user", content: canaryPrompt }],
      { model, temperature: 0, maxTokens: 10, timeout: maxLatency }
    );

    const latency = Date.now() - start;
    const qualityOk = response.content.trim().includes(expectedAnswer);
    const costOk = response.usage.inputTokens + response.usage.outputTokens < 50;

    return {
      healthy: qualityOk && latency < maxLatency && costOk,
      latencyMs: latency,
      qualityOk,
      costOk,
      lastCheck: new Date().toISOString(),
      details: qualityOk ? "OK" : \`Respuesta inesperada: "\${response.content}"\`,
    };
  } catch (error) {
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      qualityOk: false,
      costOk: true,
      lastCheck: new Date().toISOString(),
      details: \`Error: \${error}\`,
    };
  }
}

// Ejecutar health check cada 2 minutos
// Si falla 3 veces consecutivas → activar circuit breaker`,
          caption: "El canary prompt es barato (~10 tokens) y detecta degradaciones antes que los usuarios.",
        },
        tip: "Usa múltiples canary prompts que cubran diferentes capacidades: aritmética, clasificación, formato JSON. Si solo uno falla, puede indicar una degradación parcial del modelo.",
      },
    ],
    exercise: {
      instruction:
        "Implementa un sistema de monitoreo completo con: (1) health check con 3 canary prompts diferentes, (2) dashboard JSON con: uptime, latencia P50/P95, error rate, cache hit rate, costo acumulado, (3) 3 alertas con runbooks: latencia alta, quality drop, y presupuesto excedido.",
      hints: [
        "Los canary prompts deben cubrir: math simple, clasificación, y generación de JSON",
        "Las alertas sin runbook son ruido. Define qué hacer paso a paso cuando se activan",
        "El dashboard debe ser consumible por herramientas como Grafana o DataDog",
      ],
    },
  },
];
