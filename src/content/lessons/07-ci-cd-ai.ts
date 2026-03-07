import type { Lesson } from "./types";

export const ciCdAiLessons: Lesson[] = [
  {
    id: "cicd-1-versioning",
    moduleId: "ci-cd-ai",
    number: 1,
    title: "Versionado de modelos, prompts y configuración",
    duration: "20 min",
    objectives: [
      "Versionar prompts y configuración de modelos como código",
      "Implementar contratos de API para features de IA",
      "Gestionar feature flags para alternar modelos en producción",
    ],
    sections: [
      {
        title: "Todo es versionable",
        content: [
          "En un sistema con IA, hay tres artefactos que cambian: el código, los prompts y la configuración del modelo.",
          "Cada uno puede causar regresiones independientemente. Un cambio de modelo de GPT-4 a GPT-4o puede alterar respuestas aunque el prompt sea idéntico.",
          "Principio: si cambió el prompt, el modelo, la temperatura, o el schema — es un nuevo release que necesita testing.",
        ],
        code: {
          language: "typescript",
          code: `// Manifiesto de versión para un feature de IA
interface AIFeatureManifest {
  featureId: string;
  version: string;
  prompt: { id: string; version: string; hash: string };
  model: { provider: string; name: string; version: string };
  config: { temperature: number; maxTokens: number; topP: number };
  schema: { input: string; output: string }; // JSON Schema refs
  deployedAt: string;
  deployedBy: string;
}

// Ejemplo de manifiesto versionado
const manifest: AIFeatureManifest = {
  featureId: "ticket-classifier",
  version: "3.2.1",
  prompt: { id: "classify-v3", version: "3.2.0", hash: "a1b2c3d4" },
  model: { provider: "anthropic", name: "claude-sonnet-4-6", version: "20250514" },
  config: { temperature: 0, maxTokens: 100, topP: 1 },
  schema: {
    input: "schemas/ticket-input-v2.json",
    output: "schemas/ticket-output-v2.json",
  },
  deployedAt: "2025-06-15T10:30:00Z",
  deployedBy: "ci/pipeline-445",
};`,
          caption: "El manifiesto es tu 'bill of materials' para cada feature de IA. Úsalo para auditoría y rollback.",
        },
      },
      {
        title: "Feature flags para modelos",
        content: [
          "Feature flags te permiten cambiar de modelo en producción sin re-deploy. Esencial para canary releases y rollbacks rápidos.",
          "Usa flags por feature, no globales. El clasificador puede usar Claude Haiku mientras el chatbot usa Claude Sonnet.",
          "Implementa evaluación gradual: 10% de tráfico al nuevo modelo, si las métricas son buenas, sube a 50%, luego 100%.",
        ],
        code: {
          language: "typescript",
          code: `// Feature flags para modelos de IA
interface ModelFlag {
  featureId: string;
  variants: {
    name: string;
    model: string;
    weight: number; // 0-100, suma = 100
    enabled: boolean;
  }[];
}

const flags: ModelFlag[] = [
  {
    featureId: "chatbot",
    variants: [
      { name: "current", model: "claude-sonnet-4-6", weight: 90, enabled: true },
      { name: "canary", model: "claude-opus-4-6", weight: 10, enabled: true },
    ],
  },
];

function selectModel(featureId: string, userId: string): string {
  const flag = flags.find(f => f.featureId === featureId);
  if (!flag) return "claude-sonnet-4-6"; // default

  // Deterministic assignment basado en userId
  const hash = simpleHash(userId + featureId);
  const bucket = hash % 100;

  let cumulative = 0;
  for (const variant of flag.variants.filter(v => v.enabled)) {
    cumulative += variant.weight;
    if (bucket < cumulative) return variant.model;
  }
  return flag.variants[0].model;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}`,
          caption: "El hash del userId garantiza que el mismo usuario siempre recibe el mismo variante — importante para consistencia.",
        },
      },
    ],
    exercise: {
      instruction:
        "Implementa un sistema de feature flags que: (1) soporte múltiples variantes por feature, (2) asigne usuarios deterministicamente, (3) permita override por userId para testing, (4) registre qué variante recibió cada request para análisis A/B.",
      hints: [
        "Los overrides manuales son útiles para QA: 'usuario X siempre ve el canary'",
        "El log de asignaciones te permite comparar métricas entre variantes",
        "Agrega un 'kill switch' para desactivar un variante inmediatamente",
      ],
    },
  },
  {
    id: "cicd-2-pipeline",
    moduleId: "ci-cd-ai",
    number: 2,
    title: "Pipeline CI/CD con gates de IA",
    duration: "25 min",
    objectives: [
      "Diseñar un pipeline que integre evals, seguridad y calidad de IA",
      "Implementar gates que bloqueen deploys si la calidad baja",
      "Configurar canary releases para cambios de modelo/prompt",
    ],
    sections: [
      {
        title: "Anatomía de un pipeline de IA",
        content: [
          "Un pipeline de IA tiene los mismos steps que uno de software (lint, test, build, deploy) MÁS steps específicos de IA.",
          "Steps de IA: eval de prompts, test de regresión semántica, scan de seguridad IA, verificación de costos estimados.",
          "El orden importa: no gastes dinero en evals si el lint o los unit tests fallan.",
        ],
        code: {
          language: "yaml",
          code: `# Pipeline CI/CD para features de IA
name: AI Feature Pipeline

stages:
  # Stage 1: Checks rápidos y baratos
  - stage: quality
    steps:
      - lint
      - type-check
      - unit-tests
      - format-check

  # Stage 2: Evals de IA (cuestan tokens)
  - stage: ai-eval
    depends_on: quality
    steps:
      - name: run-evals
        run: npm run test:evals
        env:
          EVAL_DATASET: golden-set-v3.json
          MIN_ACCURACY: "0.85"
          MIN_FORMAT_VALID: "0.95"
      - name: compare-baseline
        run: node scripts/compare-eval-baseline.js
        # Falla si hay regresión vs main

  # Stage 3: Seguridad
  - stage: security
    depends_on: quality
    parallel: true  # corre en paralelo con ai-eval
    steps:
      - name: semgrep-scan
        run: npm run security:semgrep
      - name: prompt-injection-test
        run: npm run test:injection
      - name: dependency-audit
        run: npm audit --audit-level=moderate

  # Stage 4: Deploy gradual
  - stage: deploy
    depends_on: [ai-eval, security]
    steps:
      - name: deploy-canary
        run: deploy --canary --weight=10
      - name: monitor-canary
        run: node scripts/monitor-canary.js --duration=15m
      - name: promote-or-rollback
        run: node scripts/canary-decision.js`,
          caption: "Security y AI eval corren en paralelo para ahorrar tiempo. Deploy solo si ambos pasan.",
        },
      },
      {
        title: "Canary con decisión automática",
        content: [
          "Un canary release envía un porcentaje pequeño de tráfico al nuevo código. Si las métricas son buenas, promueve; si no, rollback.",
          "Métricas para decidir: error rate, latencia P95, costo por request, accuracy de evals en vivo.",
          "Duración del canary: mínimo 15 minutos con tráfico real suficiente (>100 requests).",
        ],
        code: {
          language: "typescript",
          code: `// Script de decisión canary
interface CanaryMetrics {
  errorRate: number;      // % de errors
  p95Latency: number;     // ms
  avgCostPerReq: number;  // USD
  sampleSize: number;     // requests observados
}

interface CanaryConfig {
  maxErrorRate: number;
  maxP95Latency: number;
  maxCostIncrease: number; // % de aumento vs baseline aceptable
  minSampleSize: number;
}

function canaryDecision(
  canary: CanaryMetrics,
  baseline: CanaryMetrics,
  config: CanaryConfig
): "promote" | "rollback" | "extend" {
  // Insuficientes datos — extender el canary
  if (canary.sampleSize < config.minSampleSize) return "extend";

  // Error rate demasiado alto
  if (canary.errorRate > config.maxErrorRate) return "rollback";

  // Latencia fuera de rango
  if (canary.p95Latency > config.maxP95Latency) return "rollback";

  // Costo aumentó demasiado
  const costIncrease = (canary.avgCostPerReq - baseline.avgCostPerReq) / baseline.avgCostPerReq;
  if (costIncrease > config.maxCostIncrease) return "rollback";

  return "promote";
}`,
          caption: "Automatiza la decisión. Un humano puede override, pero el default debe ser seguro.",
        },
      },
    ],
    exercise: {
      instruction:
        "Diseña un pipeline CI/CD completo (como YAML o pseudocódigo) para un feature de chatbot que: (1) ejecute unit tests + linting, (2) corra evals contra golden set, (3) haga security scan, (4) despliegue canary al 10%, (5) monitoree 15 min y decida promote/rollback automáticamente.",
      hints: [
        "Define stages y dependencias claramente",
        "Los stages independientes deben correr en paralelo",
        "Incluye notificación a Slack/Teams cuando el canary rollback",
      ],
    },
  },
  {
    id: "cicd-3-rollback",
    moduleId: "ci-cd-ai",
    number: 3,
    title: "Rollback, SBOM y supply chain para IA",
    duration: "20 min",
    objectives: [
      "Implementar rollback instantáneo de prompts y modelos",
      "Generar SBOM que incluya artefactos de IA",
      "Proteger la cadena de suministro de modelos y datos",
    ],
    sections: [
      {
        title: "Rollback instantáneo",
        content: [
          "El rollback de un feature de IA debería tomar segundos, no minutos. Es un cambio de configuración, no un re-deploy.",
          "Mantén siempre la versión anterior activa y lista. El rollback es simplemente cambiar el puntero de versión.",
          "Automatiza: si accuracy baja del 80% en producción, rollback automático sin intervención humana.",
        ],
        code: {
          language: "typescript",
          code: `// Rollback manager para features de IA
interface DeployedVersion {
  version: string;
  deployedAt: string;
  manifest: AIFeatureManifest;
}

class RollbackManager {
  private history: DeployedVersion[] = [];
  private current: DeployedVersion | null = null;

  deploy(manifest: AIFeatureManifest) {
    if (this.current) {
      this.history.push(this.current);
    }
    this.current = {
      version: manifest.version,
      deployedAt: new Date().toISOString(),
      manifest,
    };
    console.log(\`Deployed v\${manifest.version}\`);
  }

  rollback(): DeployedVersion | null {
    const previous = this.history.pop();
    if (!previous) {
      console.error("No hay versión anterior para rollback");
      return null;
    }
    this.current = previous;
    console.log(\`Rollback a v\${previous.version}\`);
    return previous;
  }

  getCurrentVersion(): string {
    return this.current?.version ?? "none";
  }
}`,
          caption: "En producción, el 'puntero de versión' puede ser un registro en tu config store (Redis, Consul, etc.).",
        },
      },
      {
        title: "SBOM para artefactos de IA",
        content: [
          "SBOM (Software Bill of Materials) lista todos los componentes de tu software. Para IA, incluye: modelos, datasets, prompts, y librerías de IA.",
          "¿Por qué? Compliance (saber qué modelos usas y sus licencias), seguridad (vulnerabilidades en dependencias), y auditoría.",
          "Un modelo de Hugging Face tiene su propia licencia, sus propios riesgos, y su propio historial de vulnerabilidades.",
        ],
        code: {
          language: "typescript",
          code: `// SBOM que incluye artefactos de IA
interface AIComponentSBOM {
  type: "model" | "dataset" | "prompt" | "library";
  name: string;
  version: string;
  provider: string;
  license: string;
  lastAudited: string;
  riskLevel: "low" | "medium" | "high";
  notes: string;
}

const sbom: AIComponentSBOM[] = [
  {
    type: "model",
    name: "claude-sonnet-4-6",
    version: "20250514",
    provider: "Anthropic",
    license: "API Terms of Service",
    lastAudited: "2025-06-01",
    riskLevel: "low",
    notes: "Modelo propietario vía API. No tenemos acceso a los pesos.",
  },
  {
    type: "library",
    name: "@anthropic-ai/sdk",
    version: "0.39.0",
    provider: "Anthropic",
    license: "MIT",
    lastAudited: "2025-06-01",
    riskLevel: "low",
    notes: "SDK oficial. Verificar actualizaciones mensualmente.",
  },
  {
    type: "dataset",
    name: "golden-set-classifier-v3",
    version: "3.0.0",
    provider: "Internal",
    license: "Proprietary",
    lastAudited: "2025-05-15",
    riskLevel: "medium",
    notes: "Contiene datos de tickets reales anonimizados. Revisar PII trimestralmente.",
  },
];`,
          caption: "Genera el SBOM automáticamente en CI y guárdalo junto con cada release.",
        },
      },
    ],
    exercise: {
      instruction:
        "Crea un script que genere un SBOM automático para tu proyecto de IA: (1) escanea package.json para dependencias de IA (@anthropic-ai/sdk, openai, etc.), (2) lee los manifiestos de features para listar modelos usados, (3) genera un JSON SBOM con todos los componentes, (4) detecta componentes sin auditar en los últimos 90 días.",
      hints: [
        "Filtra dependencias que contengan 'ai', 'llm', 'openai', 'anthropic', 'huggingface'",
        "Los manifiestos deberían estar en un directorio conocido",
        "El reporte de componentes sin auditar es un hallazgo de seguridad",
      ],
    },
  },
];
