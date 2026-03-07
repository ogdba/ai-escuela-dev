import type { Lesson } from "./types";

export const llmFundamentalsLessons: Lesson[] = [
  {
    id: "llm-1-tokens",
    moduleId: "llm-fundamentals",
    number: 1,
    title: "Tokens: la unidad básica de los LLMs",
    duration: "20 min",
    objectives: [
      "Entender qué es un token y cómo se tokeniza el texto",
      "Diferenciar entre tokenizadores (BPE, WordPiece, SentencePiece)",
      "Calcular el costo aproximado de una consulta",
    ],
    sections: [
      {
        title: "¿Qué es un token?",
        content: [
          "Un token NO es una palabra. Es la unidad mínima que un LLM procesa. Puede ser una palabra completa, un fragmento, un carácter o un símbolo especial.",
          "El texto 'Hola mundo' se tokeniza de forma diferente según el modelo: GPT-4 lo divide en 2 tokens, mientras que un modelo multilingüe podría usar 3 o más.",
          "La tokenización afecta directamente el costo, la latencia y la calidad de las respuestas. Más tokens = más caro y más lento.",
        ],
        code: {
          language: "typescript",
          code: `// Ejemplo: contar tokens con tiktoken (compatible OpenAI)
import { encoding_for_model } from "tiktoken";

const enc = encoding_for_model("gpt-4");
const text = "Hola, ¿cómo estás? Necesito ayuda con mi código.";
const tokens = enc.encode(text);

console.log(\`Texto: "\${text}"\`);
console.log(\`Tokens: \${tokens.length}\`);  // ~14 tokens
console.log(\`Costo estimado (GPT-4): $\${(tokens.length * 0.00003).toFixed(4)}\`);
enc.free();`,
          caption:
            "tiktoken es la librería oficial de OpenAI para contar tokens antes de enviar requests.",
        },
      },
      {
        title: "Tokenizadores: BPE, WordPiece y SentencePiece",
        content: [
          "BPE (Byte Pair Encoding): Usado por GPT-4 y Claude. Empieza con bytes individuales y fusiona los pares más frecuentes iterativamente.",
          "WordPiece: Usado por BERT. Similar a BPE pero optimiza la probabilidad del vocabulario completo.",
          "SentencePiece: Usado por LLaMA y modelos multilingües. Trata el texto como secuencia de bytes raw, sin asumir espacios como separadores.",
        ],
        tip: "En español, los acentos y la ñ pueden generar tokens adicionales. Un texto en español suele usar 10-30% más tokens que su equivalente en inglés.",
      },
      {
        title: "Tokens de entrada vs salida y costos",
        content: [
          "Los proveedores cobran diferente por tokens de entrada (tu prompt) y de salida (la respuesta del modelo).",
          "Típicamente los tokens de salida cuestan 2-4x más que los de entrada porque requieren procesamiento generativo.",
          "Optimizar el prompt (menos tokens de entrada) y limitar la salida (max_tokens) son las dos palancas principales para controlar costos.",
        ],
        code: {
          language: "typescript",
          code: `// Calculadora de costos por modelo
interface ModelPricing {
  name: string;
  inputPer1K: number;   // USD por 1K tokens de entrada
  outputPer1K: number;  // USD por 1K tokens de salida
}

const models: ModelPricing[] = [
  { name: "GPT-4o",       inputPer1K: 0.005,  outputPer1K: 0.015 },
  { name: "Claude Sonnet", inputPer1K: 0.003,  outputPer1K: 0.015 },
  { name: "Claude Haiku",  inputPer1K: 0.0008, outputPer1K: 0.004 },
  { name: "GPT-4o mini",   inputPer1K: 0.00015, outputPer1K: 0.0006 },
];

function estimateCost(inputTokens: number, outputTokens: number, model: ModelPricing) {
  return (inputTokens / 1000) * model.inputPer1K + (outputTokens / 1000) * model.outputPer1K;
}

// Ejemplo: prompt de 500 tokens, respuesta de 200 tokens
models.forEach(m => {
  const cost = estimateCost(500, 200, m);
  console.log(\`\${m.name}: $\${cost.toFixed(4)} por request\`);
});`,
          caption:
            "Los precios cambian frecuentemente. Verifica siempre la página de pricing del proveedor.",
        },
      },
    ],
    exercise: {
      instruction:
        "Crea una función que reciba un texto y un modelo, y devuelva: (1) el número de tokens, (2) el costo estimado de entrada, y (3) una recomendación de si el texto debería acortarse basándose en un umbral de costo.",
      hints: [
        "Usa un mapa de precios por modelo como el del ejemplo",
        "Define un umbral razonable (ej: $0.01 por request)",
        "Considera que el usuario podría no tener tiktoken — haz una estimación de ~4 caracteres por token como fallback",
      ],
      solution: {
        language: "typescript",
        code: `interface CostAnalysis {
  tokens: number;
  cost: number;
  shouldShorten: boolean;
  recommendation: string;
}

function analyzePromptCost(
  text: string,
  model: string,
  costThreshold = 0.01
): CostAnalysis {
  // Estimación: ~4 chars por token en español
  const estimatedTokens = Math.ceil(text.length / 4);

  const pricing: Record<string, number> = {
    "gpt-4o": 0.005,
    "claude-sonnet": 0.003,
    "claude-haiku": 0.0008,
  };

  const pricePerK = pricing[model] ?? 0.003;
  const cost = (estimatedTokens / 1000) * pricePerK;
  const shouldShorten = cost > costThreshold;

  return {
    tokens: estimatedTokens,
    cost,
    shouldShorten,
    recommendation: shouldShorten
      ? \`Considera reducir el prompt. Costo actual: $\${cost.toFixed(4)}\`
      : \`Costo aceptable: $\${cost.toFixed(4)}\`,
  };
}`,
      },
    },
  },
  {
    id: "llm-1-context-window",
    moduleId: "llm-fundamentals",
    number: 2,
    title: "Ventana de contexto y sus limitaciones",
    duration: "20 min",
    objectives: [
      "Entender qué es la ventana de contexto y por qué tiene límites",
      "Conocer los tamaños de contexto de modelos populares",
      "Aprender estrategias para manejar contextos largos",
    ],
    sections: [
      {
        title: "¿Qué es la ventana de contexto?",
        content: [
          "La ventana de contexto es la cantidad total de tokens que un modelo puede procesar en una sola interacción. Incluye tanto el prompt (entrada) como la respuesta (salida).",
          "Piensa en ella como la 'memoria de trabajo' del modelo. Todo lo que quieras que el modelo considere debe caber en esta ventana.",
          "Si tu prompt + respuesta excede la ventana, el modelo truncará o rechazará la solicitud.",
        ],
        code: {
          language: "typescript",
          code: `// Tamaños de ventana de contexto (2025)
const contextWindows: Record<string, number> = {
  "gpt-4o":           128_000,
  "claude-opus":      200_000,
  "claude-sonnet":    200_000,
  "claude-haiku":     200_000,
  "gemini-1.5-pro":   2_000_000,
  "llama-3.1-405b":   128_000,
};

function canFitInContext(
  promptTokens: number,
  expectedOutput: number,
  model: string
): { fits: boolean; remaining: number } {
  const window = contextWindows[model] ?? 128_000;
  const total = promptTokens + expectedOutput;
  return {
    fits: total <= window,
    remaining: window - total,
  };
}`,
          caption: "Siempre reserva espacio para la respuesta del modelo al calcular si tu prompt cabe.",
        },
      },
      {
        title: "El problema del 'lost in the middle'",
        content: [
          "Aunque un modelo tenga 200K tokens de ventana, no significa que procese todo con igual atención.",
          "Estudios demuestran que los modelos tienden a prestar más atención al inicio y final del contexto, olvidando información del medio — el efecto 'lost in the middle'.",
          "Implicación práctica: coloca la información más importante al inicio o al final de tu prompt, nunca enterrada en el medio de un documento largo.",
        ],
        tip: "Si trabajas con documentos largos, considera usar RAG (Módulo 3) en lugar de pasar todo el texto al modelo. Es más barato y más preciso.",
      },
      {
        title: "Estrategias para contextos largos",
        content: [
          "Chunking: Divide documentos largos en fragmentos manejables y procesa solo los relevantes.",
          "Summarization chain: Resume secciones largas progresivamente antes de la consulta final.",
          "Sliding window: Procesa el texto en ventanas superpuestas y combina resultados.",
          "Map-reduce: Procesa cada fragmento independientemente y luego combina las respuestas.",
        ],
        code: {
          language: "typescript",
          code: `// Patrón map-reduce para documentos largos
async function mapReduceSummary(
  chunks: string[],
  llm: (prompt: string) => Promise<string>
): Promise<string> {
  // Map: resume cada chunk independientemente
  const summaries = await Promise.all(
    chunks.map(chunk =>
      llm(\`Resume este fragmento en 2-3 oraciones:\\n\\n\${chunk}\`)
    )
  );

  // Reduce: combina los resúmenes en un resumen final
  const combined = summaries.join("\\n\\n");
  return llm(\`Dado estos resúmenes parciales, genera un resumen unificado:\\n\\n\${combined}\`);
}`,
          caption: "Map-reduce permite procesar documentos de cualquier tamaño, aunque añade latencia y costo.",
        },
      },
    ],
    exercise: {
      instruction:
        "Implementa una función que reciba un texto largo y lo divida en chunks con overlap, asegurando que ningún chunk exceda un límite de tokens dado.",
      hints: [
        "Estima tokens como text.length / 4",
        "Usa un overlap del 10-20% para no perder contexto entre chunks",
        "Intenta cortar en límites de párrafo o oración, no a mitad de palabra",
      ],
      solution: {
        language: "typescript",
        code: `function chunkText(
  text: string,
  maxTokens: number = 1000,
  overlapPercent: number = 0.15
): string[] {
  const maxChars = maxTokens * 4; // estimación
  const overlap = Math.floor(maxChars * overlapPercent);
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + maxChars, text.length);

    // Intenta cortar en un punto final de oración
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(".", end);
      if (lastPeriod > start + maxChars * 0.5) {
        end = lastPeriod + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }

  return chunks;
}`,
      },
    },
  },
  {
    id: "llm-1-training",
    moduleId: "llm-fundamentals",
    number: 3,
    title: "Cómo se entrena un LLM: pretraining, fine-tuning y RLHF",
    duration: "25 min",
    objectives: [
      "Entender las tres fases principales del entrenamiento de un LLM",
      "Saber cuándo tiene sentido hacer fine-tuning vs prompt engineering",
      "Comprender RLHF y por qué mejora la utilidad del modelo",
    ],
    sections: [
      {
        title: "Fase 1: Pretraining",
        content: [
          "En pretraining, el modelo aprende a predecir el siguiente token procesando enormes cantidades de texto (libros, código, web, etc.).",
          "Este proceso toma semanas/meses en miles de GPUs y cuesta millones de dólares. No es algo que hagas tú.",
          "El resultado es un 'modelo base' que sabe mucho sobre el lenguaje pero no sabe seguir instrucciones ni ser útil.",
        ],
      },
      {
        title: "Fase 2: Fine-tuning (SFT)",
        content: [
          "Supervised Fine-Tuning (SFT) entrena el modelo base con ejemplos de instrucción → respuesta de alta calidad.",
          "Esto transforma un completador de texto en un asistente que entiende y responde preguntas.",
          "Puedes hacer fine-tuning propio para casos específicos, pero generalmente es costoso y prompt engineering resuelve el 90% de los casos.",
        ],
        code: {
          language: "typescript",
          code: `// ¿Cuándo hacer fine-tuning vs prompt engineering?
interface DecisionMatrix {
  scenario: string;
  recommendation: "prompt-engineering" | "fine-tuning";
  reason: string;
}

const decisions: DecisionMatrix[] = [
  {
    scenario: "Generar código en el estilo de mi empresa",
    recommendation: "prompt-engineering",
    reason: "Few-shot examples en el prompt son suficientes y mucho más flexibles",
  },
  {
    scenario: "Clasificar tickets en 50 categorías específicas de mi dominio",
    recommendation: "fine-tuning",
    reason: "Demasiadas categorías para few-shot; fine-tuning mejora accuracy significativamente",
  },
  {
    scenario: "Chatbot de soporte con tono específico",
    recommendation: "prompt-engineering",
    reason: "El tono se controla bien con system prompt + examples",
  },
  {
    scenario: "Extraer datos de formularios médicos no estándar",
    recommendation: "fine-tuning",
    reason: "Formato muy específico que requiere aprendizaje profundo del dominio",
  },
];`,
          caption: "Regla general: si puedes resolverlo con un buen prompt, no hagas fine-tuning.",
        },
        tip: "Fine-tuning de modelos grandes (70B+) requiere hardware especializado. Para la mayoría de devs, fine-tuning de modelos pequeños (7B-13B) o usar LoRA es más práctico.",
      },
      {
        title: "Fase 3: RLHF y alineamiento",
        content: [
          "RLHF (Reinforcement Learning from Human Feedback) es lo que hace que un modelo sea 'útil' y 'seguro'.",
          "Humanos rankean respuestas del modelo (buena vs mala), y este feedback se usa para entrenar un 'reward model' que guía al LLM.",
          "RLHF es la razón por la que Claude y GPT-4 pueden seguir instrucciones complejas, admitir cuando no saben algo, y rechazar solicitudes dañinas.",
          "Alternativas modernas: RLAIF (feedback de otro modelo), DPO (Direct Preference Optimization) que es más eficiente computacionalmente.",
        ],
      },
      {
        title: "Parámetros de inferencia: temperatura y top-p",
        content: [
          "Temperatura (0-2): Controla la 'creatividad'. 0 = determinístico (siempre elige el token más probable). 1+ = más variado.",
          "Top-p (0-1): Nucleus sampling. Considera solo los tokens cuya probabilidad acumulada no exceda p.",
          "Para código y datos estructurados: temperatura 0-0.2. Para escritura creativa: 0.7-1.0. Para brainstorming: 1.0+.",
        ],
        code: {
          language: "typescript",
          code: `// Configuraciones recomendadas por caso de uso
const inferenceConfigs = {
  codeGeneration: {
    temperature: 0,
    top_p: 1,
    reason: "Queremos código determinístico y correcto",
  },
  jsonExtraction: {
    temperature: 0,
    top_p: 1,
    reason: "La estructura debe ser exacta siempre",
  },
  creativeWriting: {
    temperature: 0.8,
    top_p: 0.95,
    reason: "Queremos variedad pero coherencia",
  },
  chatbot: {
    temperature: 0.3,
    top_p: 0.9,
    reason: "Balance entre consistencia y naturalidad",
  },
  brainstorming: {
    temperature: 1.2,
    top_p: 0.95,
    reason: "Máxima diversidad de ideas",
  },
};`,
          caption: "No uses temperatura alta Y top-p bajo a la vez — produce resultados incoherentes.",
        },
      },
    ],
    exercise: {
      instruction:
        "Crea un documento de configuración para tu equipo que defina: (1) qué modelo usar para cada caso de uso de tu app, (2) parámetros de inferencia recomendados, y (3) cuándo escalar a fine-tuning. Incluye al menos 4 casos de uso diferentes.",
      hints: [
        "Piensa en los flujos de tu aplicación: generación de código, chat, extracción de datos, resúmenes",
        "Considera el trade-off costo vs calidad para cada caso",
        "Documenta criterios claros para decidir cuándo el prompt engineering ya no es suficiente",
      ],
    },
  },
];
