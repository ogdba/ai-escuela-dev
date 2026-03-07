import type { Lesson } from "./types";

export const aiEvalsLessons: Lesson[] = [
  {
    id: "evals-1-golden-sets",
    moduleId: "ai-evals",
    number: 1,
    title: "Golden sets y datasets de evaluación",
    duration: "25 min",
    objectives: [
      "Crear golden sets para evaluar calidad de respuestas de LLMs",
      "Definir criterios de evaluación alineados con tu negocio",
      "Mantener datasets versionados y representativos",
    ],
    sections: [
      {
        title: "¿Qué es un golden set?",
        content: [
          "Un golden set es una colección de pares (input, expected_output) curados manualmente que representan el comportamiento ideal de tu sistema.",
          "Es tu 'fuente de verdad'. Cada vez que cambias un prompt o modelo, lo evalúas contra el golden set para detectar regresiones.",
          "Un buen golden set tiene: diversidad de casos, edge cases, ejemplos negativos, y está alineado con lo que los usuarios realmente preguntan.",
        ],
        code: {
          language: "typescript",
          code: `// Estructura de un golden set
interface GoldenCase {
  id: string;
  category: string;
  input: string;
  expectedOutput: string;
  acceptableVariants?: string[];
  metadata: {
    source: "real-user" | "synthetic" | "edge-case";
    difficulty: "easy" | "medium" | "hard";
    addedAt: string;
  };
}

const classifierGoldenSet: GoldenCase[] = [
  {
    id: "tc-001",
    category: "bug-report",
    input: "El botón de exportar no funciona, se queda cargando",
    expectedOutput: "bug",
    acceptableVariants: ["bug-report", "defect"],
    metadata: { source: "real-user", difficulty: "easy", addedAt: "2025-03-01" },
  },
  {
    id: "tc-002",
    category: "edge-case",
    input: "fix typo in README",
    expectedOutput: "docs",
    acceptableVariants: ["documentation", "fix"],
    metadata: { source: "edge-case", difficulty: "hard", addedAt: "2025-03-01" },
  },
  {
    id: "tc-003",
    category: "ambiguous",
    input: "necesito cambiar el color del header",
    expectedOutput: "feature-request",
    metadata: { source: "real-user", difficulty: "medium", addedAt: "2025-03-15" },
  },
];`,
          caption: "Empieza con 20-30 casos. Agrega casos nuevos cada vez que encuentres un fallo en producción.",
        },
        tip: "Los mejores golden sets vienen de datos reales de producción, curados por humanos. Los sintéticos son un buen complemento pero no reemplazo.",
      },
      {
        title: "Tipos de evaluación: automática, heurística y humana",
        content: [
          "Exact match: la respuesta es exactamente igual al esperado. Útil para clasificación, extracción de datos.",
          "Heurística: reglas como 'contiene la palabra clave', 'JSON válido', 'menos de 500 tokens'. Útil para formato.",
          "LLM-as-judge: usar otro modelo para evaluar la calidad. Escalable pero más costoso.",
          "Humana: gold standard pero no escala. Úsala para calibrar las métricas automáticas.",
        ],
        code: {
          language: "typescript",
          code: `// Evaluadores por tipo
type EvalFn = (actual: string, expected: string) => number; // 0-1

const evaluators: Record<string, EvalFn> = {
  exactMatch: (actual, expected) =>
    actual.trim().toLowerCase() === expected.trim().toLowerCase() ? 1 : 0,

  containsKeywords: (actual, expected) => {
    const keywords = expected.split(",").map(k => k.trim().toLowerCase());
    const matched = keywords.filter(k => actual.toLowerCase().includes(k));
    return matched.length / keywords.length;
  },

  jsonValid: (actual) => {
    try { JSON.parse(actual); return 1; } catch { return 0; }
  },

  lengthWithinRange: (actual, expected) => {
    const [min, max] = expected.split("-").map(Number);
    const len = actual.length;
    return len >= min && len <= max ? 1 : 0;
  },
};

// LLM-as-judge
async function llmJudge(
  query: string,
  actual: string,
  expected: string
): Promise<number> {
  const judgePrompt = \`Evalúa si la respuesta es correcta para la pregunta.

Pregunta: \${query}
Respuesta esperada: \${expected}
Respuesta actual: \${actual}

Puntúa de 0 a 1 (0 = completamente incorrecta, 1 = perfecta).
Responde SOLO con el número.\`;

  const score = await llm.generate(judgePrompt);
  return Math.min(1, Math.max(0, parseFloat(score)));
}`,
          caption: "Combina evaluadores para una métrica compuesta: 40% exactitud + 30% formato + 30% relevancia.",
        },
      },
    ],
    exercise: {
      instruction:
        "Crea un golden set de 15 casos para un chatbot de soporte que clasifica y responde tickets. Incluye: 5 happy paths, 5 edge cases (ambiguos, multi-idioma, typos), y 5 casos negativos (spam, off-topic, injection). Define qué evaluador usarías para cada categoría.",
      hints: [
        "Los edge cases son lo más valioso: son los que rompen tu sistema",
        "Para clasificación usa exact match; para respuestas usa LLM-as-judge",
        "Incluye metadata de dificultad para priorizar qué arreglar primero",
      ],
    },
  },
  {
    id: "evals-2-metrics",
    moduleId: "ai-evals",
    number: 2,
    title: "Métricas de calidad y harness de evaluación",
    duration: "25 min",
    objectives: [
      "Definir métricas compuestas alineadas al negocio",
      "Construir un harness de evaluación reproducible",
      "Generar reportes de calidad comparativos entre versiones",
    ],
    sections: [
      {
        title: "Métricas compuestas",
        content: [
          "Una sola métrica no captura la calidad. Necesitas un scorecard con múltiples dimensiones.",
          "Dimensiones típicas: exactitud, formato, seguridad, latencia, costo.",
          "Asigna pesos según tu negocio: un chatbot médico prioriza exactitud sobre latencia; un autocompletador de código prioriza velocidad.",
        ],
        code: {
          language: "typescript",
          code: `// Scorecard de evaluación
interface EvalScorecard {
  promptVersion: string;
  timestamp: string;
  metrics: {
    accuracy: number;     // % respuestas correctas
    formatValid: number;  // % salidas con formato correcto
    safety: number;       // % sin contenido inseguro
    avgLatencyMs: number;
    avgCost: number;      // USD por request
    tokenEfficiency: number; // output quality / tokens usados
  };
  compositeScore: number; // ponderado
}

function computeComposite(metrics: EvalScorecard["metrics"]): number {
  const weights = {
    accuracy: 0.35,
    formatValid: 0.20,
    safety: 0.25,
    avgLatencyMs: 0.10,    // normalizado: (1 - latency/10000)
    avgCost: 0.05,         // normalizado: (1 - cost/0.10)
    tokenEfficiency: 0.05,
  };

  const normalized = {
    ...metrics,
    avgLatencyMs: Math.max(0, 1 - metrics.avgLatencyMs / 10000),
    avgCost: Math.max(0, 1 - metrics.avgCost / 0.10),
  };

  return Object.entries(weights).reduce(
    (sum, [key, weight]) => sum + (normalized[key as keyof typeof normalized] as number) * weight,
    0
  );
}`,
          caption: "El composite score permite comparar versiones con un solo número, pero siempre revisa las métricas individuales.",
        },
      },
      {
        title: "Harness de evaluación con Vitest",
        content: [
          "Un harness es la infraestructura que ejecuta tus evals de forma reproducible y reporta resultados.",
          "Usa seeds para reproducibilidad: misma seed = mismos resultados si el prompt/modelo no cambió.",
          "Genera reportes en formato JSON para trackear tendencias y comparar entre versiones.",
        ],
        code: {
          language: "typescript",
          code: `// eval.test.ts — harness con Vitest
import { describe, it, expect } from "vitest";

const goldenSet = [
  { input: "El botón no funciona", expected: "bug" },
  { input: "Agregar dark mode", expected: "feature" },
  { input: "¿Cómo exporto a PDF?", expected: "question" },
  // ... 20+ casos más
];

describe("Ticket Classifier v2.1", () => {
  const results: { pass: boolean; latency: number }[] = [];

  goldenSet.forEach((tc, i) => {
    it(\`clasifica correctamente caso #\${i + 1}: "\${tc.input.slice(0, 30)}..."\`, async () => {
      const start = Date.now();
      const result = await classifyTicket(tc.input);
      const latency = Date.now() - start;

      results.push({ pass: result === tc.expected, latency });
      expect(result).toBe(tc.expected);
    }, 15_000); // timeout 15s por case
  });

  it("cumple umbral de accuracy >= 85%", () => {
    const accuracy = results.filter(r => r.pass).length / results.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.85);
  });

  it("latencia promedio < 3000ms", () => {
    const avg = results.reduce((s, r) => s + r.latency, 0) / results.length;
    expect(avg).toBeLessThan(3000);
  });
});`,
          caption: "Las evals como tests: si fallan, el pipeline se rompe. No deployes con calidad degradada.",
        },
        tip: "Usa describe.concurrent para ejecutar evals en paralelo y reducir el tiempo total. Pero cuidado con rate limits del API.",
      },
    ],
    exercise: {
      instruction:
        "Construye un harness de evaluación completo con Vitest que: (1) cargue un golden set desde un JSON, (2) ejecute evaluaciones contra una función mock de LLM, (3) calcule scorecard con al menos 4 métricas, (4) genere un reporte JSON con resultados por caso y métricas agregadas.",
      hints: [
        "Usa beforeAll para cargar el golden set y afterAll para escribir el reporte",
        "La función mock puede simular diferentes niveles de calidad",
        "El reporte debe incluir: fecha, versión del prompt, métricas, y detalle por caso",
      ],
    },
  },
  {
    id: "evals-3-ci-gates",
    moduleId: "ai-evals",
    number: 3,
    title: "Gates de calidad en CI/CD",
    duration: "20 min",
    objectives: [
      "Integrar evals como step obligatorio en el pipeline de CI",
      "Definir umbrales que bloqueen merge/deploy",
      "Visualizar tendencias de calidad en el tiempo",
    ],
    sections: [
      {
        title: "Evals como gate de deployment",
        content: [
          "Si un cambio de prompt reduce accuracy de 92% a 78%, NO debe llegar a producción.",
          "Configura tu CI para ejecutar evals automáticamente en cada PR que modifique prompts.",
          "Define umbrales claros: accuracy >= 85%, format_valid >= 95%, safety >= 99%.",
        ],
        code: {
          language: "yaml",
          code: `# .github/workflows/ai-evals.yml
name: AI Quality Gates
on:
  pull_request:
    paths:
      - 'src/prompts/**'
      - 'src/content/lessons/**'

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:evals
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
      - name: Check thresholds
        run: |
          node -e "
            const report = require('./reports/eval-report.json');
            const thresholds = { accuracy: 0.85, formatValid: 0.95, safety: 0.99 };
            let failed = false;
            for (const [metric, threshold] of Object.entries(thresholds)) {
              if (report.metrics[metric] < threshold) {
                console.error(metric + ': ' + report.metrics[metric] + ' < ' + threshold);
                failed = true;
              }
            }
            if (failed) process.exit(1);
          "`,
          caption: "El pipeline falla si cualquier métrica cae bajo el umbral. No hay excepciones.",
        },
      },
      {
        title: "Tracking de tendencias",
        content: [
          "Guarda cada resultado de eval con timestamp y versión del prompt. Esto te da una línea temporal de calidad.",
          "Si accuracy baja gradualmente (de 92% a 90% a 87%), tienes un drift problem — el golden set o el modelo está cambiando.",
          "Compara siempre la versión nueva contra la versión en producción, no contra un estándar absoluto.",
        ],
        code: {
          language: "typescript",
          code: `// Comparar versiones de prompts
interface EvalComparison {
  baseline: { version: string; metrics: Record<string, number> };
  candidate: { version: string; metrics: Record<string, number> };
  regressions: string[];
  improvements: string[];
  verdict: "approve" | "reject" | "review";
}

function compareVersions(
  baseline: Record<string, number>,
  candidate: Record<string, number>,
  tolerance: number = 0.02 // 2% de degradación tolerada
): EvalComparison["verdict"] {
  const regressions: string[] = [];

  for (const [metric, baseValue] of Object.entries(baseline)) {
    const candValue = candidate[metric] ?? 0;
    if (candValue < baseValue - tolerance) {
      regressions.push(\`\${metric}: \${baseValue} → \${candValue}\`);
    }
  }

  if (regressions.length === 0) return "approve";
  if (regressions.some(r => r.includes("safety"))) return "reject"; // safety nunca degrada
  return "review"; // requiere aprobación humana
}`,
          caption: "Safety es non-negotiable. Otros metrics pueden degradar ligeramente si hay mejoras en otras áreas.",
        },
      },
    ],
    exercise: {
      instruction:
        "Diseña un pipeline de CI completo para evals de IA: (1) script que ejecuta evals y genera reporte JSON, (2) GitHub Action que lo ejecuta en PRs que toquen prompts, (3) script de comparación que compara contra la baseline en main, (4) bot comment en el PR con los resultados.",
      hints: [
        "El reporte JSON debe ser determinístico dado los mismos inputs",
        "Usa GitHub Actions artifacts para guardar reportes históricos",
        "El bot comment puede usar gh pr comment",
      ],
    },
  },
];
