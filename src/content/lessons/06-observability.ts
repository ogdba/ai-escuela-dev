import type { Lesson } from "./types";

export const observabilityLessons: Lesson[] = [
  {
    id: "obs-1-tracing",
    moduleId: "observability-cost-latency",
    number: 1,
    title: "Trazas distribuidas para LLMs",
    duration: "25 min",
    objectives: [
      "Instrumentar llamadas a LLMs con trazas y atributos",
      "Correlacionar requests del usuario con llamadas al modelo",
      "Identificar cuellos de botella en pipelines de IA",
    ],
    sections: [
      {
        title: "¿Por qué trazas para LLMs?",
        content: [
          "Un request del usuario puede involucrar: validación, búsqueda RAG, llamada al LLM, validación de salida, y filtros. Sin trazas, no sabes dónde se fue el tiempo.",
          "Las trazas distribuidas te dan visibilidad end-to-end: cuánto tardó cada paso, cuántos tokens se usaron, y si hubo errores o retries.",
          "Instrumentar LLMs es diferente a instrumentar HTTP: necesitas capturar tokens, modelo, temperatura, y calidad de la respuesta.",
        ],
        code: {
          language: "typescript",
          code: `// Wrapper de LLM con trazabilidad
interface LLMTrace {
  traceId: string;
  requestId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  status: "success" | "error" | "fallback";
  cost: number;
  metadata: Record<string, string>;
}

async function tracedLLMCall(
  prompt: string,
  options: { model: string; traceId: string; feature: string }
): Promise<{ response: string; trace: LLMTrace }> {
  const start = Date.now();
  const requestId = crypto.randomUUID();

  try {
    const result = await llm.generate(prompt, { model: options.model });
    const trace: LLMTrace = {
      traceId: options.traceId,
      requestId,
      model: options.model,
      inputTokens: result.usage.input_tokens,
      outputTokens: result.usage.output_tokens,
      latencyMs: Date.now() - start,
      status: "success",
      cost: calculateCost(result.usage, options.model),
      metadata: { feature: options.feature },
    };

    await traceStore.record(trace);
    return { response: result.text, trace };
  } catch (error) {
    const trace: LLMTrace = {
      traceId: options.traceId, requestId,
      model: options.model,
      inputTokens: 0, outputTokens: 0,
      latencyMs: Date.now() - start,
      status: "error",
      cost: 0,
      metadata: { feature: options.feature, error: String(error) },
    };
    await traceStore.record(trace);
    throw error;
  }
}`,
          caption: "Cada llamada al LLM genera una traza con todos los datos necesarios para debugging y costos.",
        },
      },
      {
        title: "Trazas de pipeline completo",
        content: [
          "Un pipeline RAG típico tiene 4-5 pasos. Cada paso debe generar un span dentro de la traza principal.",
          "Span 1: Validación de entrada → Span 2: Embedding de query → Span 3: Vector search → Span 4: LLM generation → Span 5: Output validation.",
          "Esto te permite ver: '¿El 80% del tiempo se va en el LLM o en la búsqueda vectorial?'.",
        ],
        code: {
          language: "typescript",
          code: `// Pipeline con spans individuales
interface Span {
  name: string;
  startMs: number;
  endMs: number;
  attributes: Record<string, string | number>;
}

class PipelineTracer {
  private spans: Span[] = [];
  private traceId = crypto.randomUUID();

  async span<T>(name: string, fn: () => Promise<T>, attrs: Record<string, string | number> = {}): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      this.spans.push({ name, startMs: start, endMs: Date.now(), attributes: { ...attrs, status: "ok" } });
      return result;
    } catch (error) {
      this.spans.push({ name, startMs: start, endMs: Date.now(), attributes: { ...attrs, status: "error" } });
      throw error;
    }
  }

  report() {
    const total = Math.max(...this.spans.map(s => s.endMs)) - Math.min(...this.spans.map(s => s.startMs));
    return {
      traceId: this.traceId,
      totalMs: total,
      spans: this.spans.map(s => ({
        ...s,
        durationMs: s.endMs - s.startMs,
        percentOfTotal: ((s.endMs - s.startMs) / total * 100).toFixed(1) + "%",
      })),
    };
  }
}

// Uso en un pipeline RAG
const tracer = new PipelineTracer();
const docs = await tracer.span("vector-search", () => vectorStore.search(query), { topK: 5 });
const response = await tracer.span("llm-generate", () => llm.generate(prompt), { model: "claude-sonnet" });
const safe = await tracer.span("output-filter", () => sanitize(response));
console.log(tracer.report());`,
          caption: "El reporte muestra qué porcentaje del tiempo consume cada paso. Optimiza lo que más pesa.",
        },
      },
    ],
    exercise: {
      instruction:
        "Instrumenta un pipeline mock de 4 pasos (input validation, embedding, search, generation) con el PipelineTracer. Simula latencias variadas y genera un reporte que muestre: traceId, duración total, duración por span, y el bottleneck principal.",
      hints: [
        "Usa await new Promise(r => setTimeout(r, ms)) para simular latencia",
        "El bottleneck es el span con mayor porcentaje del total",
        "Bonus: genera una visualización ASCII tipo timeline",
      ],
    },
  },
  {
    id: "obs-2-cost-budget",
    moduleId: "observability-cost-latency",
    number: 2,
    title: "Gestión de costos y presupuestos de IA",
    duration: "20 min",
    objectives: [
      "Calcular y trackear costos por feature, usuario y endpoint",
      "Implementar presupuestos con alertas automáticas",
      "Optimizar costos sin degradar calidad",
    ],
    sections: [
      {
        title: "Costo por feature y por usuario",
        content: [
          "No basta con saber el gasto total. Necesitas saber: cuánto cuesta el chatbot vs la búsqueda vs la clasificación.",
          "También necesitas costo por usuario: un usuario que hace 100 queries/día cuesta diferente a uno que hace 5.",
          "Esto te permite: pricing informado, detección de abuso, y optimización focalizada.",
        ],
        code: {
          language: "typescript",
          code: `// Tracker de costos por dimensión
interface CostEntry {
  timestamp: string;
  feature: string;
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

class CostTracker {
  private entries: CostEntry[] = [];

  record(entry: CostEntry) {
    this.entries.push(entry);
  }

  byFeature(): Record<string, { totalCost: number; requests: number; avgCost: number }> {
    const grouped: Record<string, CostEntry[]> = {};
    this.entries.forEach(e => {
      (grouped[e.feature] ??= []).push(e);
    });
    return Object.fromEntries(
      Object.entries(grouped).map(([feature, entries]) => [
        feature,
        {
          totalCost: entries.reduce((s, e) => s + e.cost, 0),
          requests: entries.length,
          avgCost: entries.reduce((s, e) => s + e.cost, 0) / entries.length,
        },
      ])
    );
  }

  topUsers(n: number = 10): { userId: string; cost: number; requests: number }[] {
    const grouped: Record<string, CostEntry[]> = {};
    this.entries.forEach(e => {
      (grouped[e.userId] ??= []).push(e);
    });
    return Object.entries(grouped)
      .map(([userId, entries]) => ({
        userId,
        cost: entries.reduce((s, e) => s + e.cost, 0),
        requests: entries.length,
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, n);
  }
}`,
          caption: "Revisa costos por feature semanalmente. El 80% del gasto suele venir del 20% de los features.",
        },
      },
      {
        title: "Presupuestos y alertas",
        content: [
          "Define un presupuesto mensual por feature y por usuario. Cuando se acerque al límite, alerta.",
          "Niveles de alerta: 70% (info), 85% (warning), 95% (critical), 100% (throttle o bloquear).",
          "Throttling gradual: cuando un usuario se acerca al límite, reduce la calidad del modelo (claude-sonnet → claude-haiku) en lugar de bloquear completamente.",
        ],
        code: {
          language: "typescript",
          code: `// Sistema de presupuestos con alertas
interface Budget {
  feature: string;
  monthlyLimitUSD: number;
  currentSpend: number;
  alertThresholds: number[]; // [0.7, 0.85, 0.95, 1.0]
}

function checkBudget(budget: Budget): {
  status: "ok" | "warning" | "critical" | "exceeded";
  percentUsed: number;
  recommendation: string;
} {
  const percent = budget.currentSpend / budget.monthlyLimitUSD;

  if (percent >= 1.0) return {
    status: "exceeded",
    percentUsed: percent,
    recommendation: "Throttle a modelo más barato o bloquear requests no esenciales",
  };
  if (percent >= 0.95) return {
    status: "critical",
    percentUsed: percent,
    recommendation: "Cambiar a modelo más económico para requests nuevos",
  };
  if (percent >= 0.85) return {
    status: "warning",
    percentUsed: percent,
    recommendation: "Revisar top consumers y activar caching agresivo",
  };
  return { status: "ok", percentUsed: percent, recommendation: "Dentro del presupuesto" };
}`,
          caption: "Automatiza la respuesta a cada nivel de alerta. No esperes a que un humano vea un email.",
        },
        tip: "Agrega un 20% de buffer al presupuesto para picos inesperados. Es mejor tener margen que quedarte sin servicio.",
      },
    ],
    exercise: {
      instruction:
        "Implementa un dashboard de costos (como función que retorne JSON) que muestre: (1) gasto total del mes, (2) top 5 features por costo, (3) top 5 usuarios por costo, (4) estado del presupuesto por feature, (5) proyección de gasto a fin de mes basada en el ritmo actual.",
      hints: [
        "La proyección usa: (gasto actual / días transcurridos) * días del mes",
        "Usa datos mock de CostEntry para simular un mes de actividad",
        "El JSON de salida debe ser consumible por un frontend de dashboard",
      ],
    },
  },
  {
    id: "obs-3-latency",
    moduleId: "observability-cost-latency",
    number: 3,
    title: "Latencia, caching y optimización",
    duration: "20 min",
    objectives: [
      "Medir y optimizar P50/P95 de latencia en features de IA",
      "Implementar caching inteligente sin degradar calidad",
      "Configurar rate limiting por usuario y por feature",
    ],
    sections: [
      {
        title: "Percentiles de latencia",
        content: [
          "P50 (mediana): la mitad de los requests son más rápidos que esto. Refleja la experiencia 'típica'.",
          "P95: el 95% de requests son más rápidos. Refleja la experiencia de los usuarios 'desafortunados'.",
          "P99: el 1% peor. Si tu P99 es 30 segundos, 1 de cada 100 usuarios espera medio minuto.",
          "Para LLMs, P50 suele ser 1-3s y P95 puede ser 10-30s. La varianza es alta.",
        ],
        code: {
          language: "typescript",
          code: `// Calculadora de percentiles
function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

function latencyReport(latencies: number[]): {
  p50: number; p95: number; p99: number; avg: number; count: number;
} {
  return {
    p50: percentile(latencies, 50),
    p95: percentile(latencies, 95),
    p99: percentile(latencies, 99),
    avg: Math.round(latencies.reduce((s, v) => s + v, 0) / latencies.length),
    count: latencies.length,
  };
}

// Ejemplo con datos reales
const chatLatencies = [800, 1200, 950, 1100, 3500, 900, 1300, 15000, 1050, 980];
console.log(latencyReport(chatLatencies));
// { p50: 1050, p95: 15000, p99: 15000, avg: 2578, count: 10 }`,
          caption: "Si tu P95 es 3x tu P50, tienes un problema de variabilidad. Investiga qué causa los spikes.",
        },
      },
      {
        title: "Caching inteligente para LLMs",
        content: [
          "Cache exacto: misma query → misma respuesta. Simple, alta hit rate para FAQs y queries repetitivas.",
          "Cache semántico: queries similares (por embedding) comparten respuesta. Más flexible, pero puede servir respuestas incorrectas.",
          "TTL (Time To Live): las respuestas se invalidan después de un tiempo. Corto para datos dinámicos, largo para datos estables.",
        ],
        code: {
          language: "typescript",
          code: `// Cache semántico con TTL
interface CacheEntry {
  query: string;
  embedding: number[];
  response: string;
  createdAt: number;
  ttlMs: number;
  hitCount: number;
}

class SemanticCache {
  private entries: CacheEntry[] = [];

  async get(query: string, threshold = 0.92): Promise<string | null> {
    const queryEmb = await embed(query);
    const now = Date.now();

    for (const entry of this.entries) {
      // Verificar TTL
      if (now - entry.createdAt > entry.ttlMs) continue;

      // Verificar similitud semántica
      const similarity = cosineSimilarity(queryEmb, entry.embedding);
      if (similarity >= threshold) {
        entry.hitCount++;
        return entry.response;
      }
    }
    return null;
  }

  async set(query: string, response: string, ttlMs = 3_600_000) {
    this.entries.push({
      query,
      embedding: await embed(query),
      response,
      createdAt: Date.now(),
      ttlMs,
      hitCount: 0,
    });
  }

  stats() {
    const valid = this.entries.filter(e => Date.now() - e.createdAt <= e.ttlMs);
    return {
      totalEntries: valid.length,
      totalHits: valid.reduce((s, e) => s + e.hitCount, 0),
    };
  }
}`,
          caption: "Threshold alto (0.92+) para respuestas críticas. Más bajo (0.85) para FAQs genéricas.",
        },
        tip: "Mide tu cache hit rate. Un buen cache debería tener 30-60% hit rate en chatbots de soporte. Si es menor al 10%, no vale la pena la complejidad.",
      },
    ],
    exercise: {
      instruction:
        "Implementa un sistema de rate limiting por usuario que: (1) limite a N requests por minuto, (2) use un modelo más barato cuando el usuario está cerca del límite, (3) bloquee completamente si excede el límite, (4) registre métricas de cuántos usuarios fueron throttleados.",
      hints: [
        "Usa sliding window: cuenta requests en los últimos 60 segundos",
        "3 niveles: normal (modelo completo), throttled (modelo barato), blocked (error 429)",
        "Implementa como middleware reutilizable",
      ],
    },
  },
];
