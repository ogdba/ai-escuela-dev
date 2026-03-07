import type { Lesson } from "./types";

export const localModelsLessons: Lesson[] = [
  {
    id: "local-1-why",
    moduleId: "local-models",
    number: 1,
    title: "¿Por qué y cuándo usar modelos locales?",
    duration: "20 min",
    objectives: [
      "Evaluar cuándo un modelo local es mejor que una API cloud",
      "Conocer los trade-offs de privacidad, costo, latencia y calidad",
      "Entender los requisitos de hardware para diferentes modelos",
    ],
    sections: [
      {
        title: "Razones para ir local",
        content: [
          "Privacidad: los datos nunca salen de tu máquina/servidor. Obligatorio para datos médicos, legales, financieros.",
          "Costo: después de la inversión en hardware, las inferencias son 'gratis'. Alto volumen = ahorro significativo.",
          "Latencia: sin roundtrip de red. Modelos pequeños pueden responder en <100ms localmente.",
          "Offline: funciona sin internet. Útil para entornos air-gapped o zonas con mala conectividad.",
          "Control total: sin cambios sorpresa en el modelo, sin rate limits, sin dependencia de un proveedor.",
        ],
        code: {
          language: "typescript",
          code: `// Matriz de decisión: local vs cloud
interface ModelDecision {
  useCase: string;
  recommendation: "local" | "cloud" | "hybrid";
  reason: string;
}

const decisions: ModelDecision[] = [
  {
    useCase: "Autocompletado de código en IDE",
    recommendation: "local",
    reason: "Latencia crítica (<200ms). Modelos 7B cuantizados funcionan bien.",
  },
  {
    useCase: "Chatbot de soporte público",
    recommendation: "cloud",
    reason: "Necesita la mejor calidad de respuesta. GPT-4o o Claude Sonnet.",
  },
  {
    useCase: "Procesamiento de documentos médicos",
    recommendation: "local",
    reason: "Compliance: datos de pacientes no pueden salir del hospital.",
  },
  {
    useCase: "Análisis de código interno + chat público",
    recommendation: "hybrid",
    reason: "Código sensible → local. Chat genérico → cloud para mejor calidad.",
  },
  {
    useCase: "Clasificación de tickets (alto volumen)",
    recommendation: "local",
    reason: "100K tickets/mes × $0.003 = $300/mes en cloud. Local: ~$0 marginal.",
  },
];`,
          caption: "No hay respuesta universal. Evalúa cada caso de uso por: privacidad, volumen, calidad requerida, y presupuesto.",
        },
      },
      {
        title: "Requisitos de hardware",
        content: [
          "La VRAM (memoria de GPU) es el factor limitante principal. Un modelo necesita ~1GB de VRAM por cada 1B de parámetros (en fp16).",
          "Con cuantización (reducir precisión), puedes correr modelos más grandes: un modelo 7B cuantizado a 4-bit necesita solo ~4GB.",
          "RAM del sistema es el fallback: si no tienes GPU, puedes correr en CPU con RAM, pero es 5-10x más lento.",
        ],
        code: {
          language: "typescript",
          code: `// Guía de hardware por tamaño de modelo
interface HardwareReq {
  modelSize: string;
  quantization: string;
  vramRequired: string;
  ramRequired: string;
  exampleModels: string[];
  speed: string;
}

const requirements: HardwareReq[] = [
  {
    modelSize: "1-3B",
    quantization: "Q4_K_M",
    vramRequired: "2-3 GB",
    ramRequired: "4 GB",
    exampleModels: ["Phi-3 Mini", "TinyLlama", "Gemma 2B"],
    speed: "~50 tokens/s en GPU, ~15 t/s en CPU moderno",
  },
  {
    modelSize: "7-8B",
    quantization: "Q4_K_M",
    vramRequired: "5-6 GB",
    ramRequired: "8 GB",
    exampleModels: ["Llama 3.1 8B", "Mistral 7B", "Qwen2 7B"],
    speed: "~30 tokens/s en GPU, ~8 t/s en CPU",
  },
  {
    modelSize: "13-14B",
    quantization: "Q4_K_M",
    vramRequired: "9-10 GB",
    ramRequired: "16 GB",
    exampleModels: ["Llama 2 13B", "Qwen2 14B"],
    speed: "~20 tokens/s en GPU, ~4 t/s en CPU",
  },
  {
    modelSize: "70B",
    quantization: "Q4_K_M",
    vramRequired: "40+ GB",
    ramRequired: "48 GB",
    exampleModels: ["Llama 3.1 70B", "Qwen2 72B"],
    speed: "~8 tokens/s en GPU (A100), ~1 t/s en CPU",
  },
];`,
          caption: "Para desarrollo diario, un modelo 7-8B en una GPU de 8GB es el sweet spot de calidad/velocidad.",
        },
        tip: "Si tu laptop no tiene GPU dedicada, no te preocupes. Modelos 3B en CPU son sorprendentemente útiles para clasificación, extracción de datos, y autocompletado.",
      },
    ],
    exercise: {
      instruction:
        "Evalúa 3 casos de uso de tu trabajo diario y determina para cada uno: (1) ¿local, cloud o hybrid?, (2) qué modelo y tamaño usarías, (3) qué hardware necesitas, (4) costo estimado mensual en cloud vs costo de hardware para local.",
      hints: [
        "Piensa en: autocompletado en IDE, clasificación de PRs/issues, resúmenes de documentos",
        "Para el cálculo de cloud: estima requests/mes × tokens × precio por token",
        "Para local: costo de GPU (ej: RTX 4060 ~$300, RTX 4090 ~$1600)",
      ],
    },
  },
  {
    id: "local-2-ollama",
    moduleId: "local-models",
    number: 2,
    title: "Ollama: instalación, uso y modelos",
    duration: "25 min",
    objectives: [
      "Instalar y configurar Ollama en tu máquina",
      "Descargar y ejecutar modelos locales",
      "Usar la API de Ollama desde tu código TypeScript",
    ],
    sections: [
      {
        title: "Setup de Ollama",
        content: [
          "Ollama es la herramienta más simple para correr modelos locales. Un solo comando para instalar, descargar y ejecutar.",
          "Soporta macOS, Linux y Windows. Detecta automáticamente tu GPU (NVIDIA, Apple Silicon, AMD).",
          "Expone una API REST compatible con la de OpenAI, lo que facilita integrar modelos locales en código existente.",
        ],
        code: {
          language: "bash",
          code: `# Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Descargar y ejecutar un modelo
ollama pull llama3.1:8b          # Descargar Llama 3.1 8B
ollama run llama3.1:8b           # Chat interactivo

# Modelos recomendados para desarrollo
ollama pull codellama:7b          # Especializado en código
ollama pull mistral:7b            # Buen balance general
ollama pull phi3:mini             # Ligero (3.8B), rápido
ollama pull qwen2.5-coder:7b     # Excelente para código

# Listar modelos instalados
ollama list

# Verificar que el servidor está corriendo
curl http://localhost:11434/api/tags`,
          caption: "Ollama corre un servidor local en el puerto 11434. Los modelos se descargan una vez y quedan en cache.",
        },
      },
      {
        title: "Usando Ollama desde TypeScript",
        content: [
          "Ollama expone una API REST que puedes llamar directamente con fetch. No necesitas SDK adicional.",
          "La API es compatible con el formato de OpenAI, así que puedes usar el SDK de OpenAI apuntando a localhost.",
          "Para producción, usa la API de chat (stateless) en lugar de generate (raw completion).",
        ],
        code: {
          language: "typescript",
          code: `// Opción 1: fetch directo a la API de Ollama
async function ollamaChat(
  prompt: string,
  model = "llama3.1:8b"
): Promise<string> {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });

  const data = await response.json();
  return data.message.content;
}

// Opción 2: usar SDK de OpenAI (compatible)
import OpenAI from "openai";

const localLLM = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama", // no se usa, pero es requerido
});

async function localChat(prompt: string): Promise<string> {
  const completion = await localLLM.chat.completions.create({
    model: "llama3.1:8b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });
  return completion.choices[0].message.content ?? "";
}

// Opción 3: streaming para respuestas largas
async function* streamChat(prompt: string) {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "llama3.1:8b",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = JSON.parse(decoder.decode(value));
    yield chunk.message.content;
  }
}`,
          caption: "La opción 2 (SDK OpenAI) es la más flexible: cambias de local a cloud cambiando solo baseURL y apiKey.",
        },
      },
    ],
    exercise: {
      instruction:
        "Instala Ollama, descarga 2 modelos (uno general y uno de código), y crea un script que: (1) envíe el mismo prompt a ambos modelos, (2) mida latencia y tokens por segundo de cada uno, (3) compare la calidad de las respuestas para 3 tareas diferentes (generar código, explicar un bug, clasificar un ticket).",
      hints: [
        "Usa llama3.1:8b como general y qwen2.5-coder:7b como modelo de código",
        "Mide tokens/segundo: longitud de respuesta / 4 / tiempo",
        "Para comparar calidad, usa el mismo prompt y evalúa manualmente o con un judge prompt",
      ],
    },
  },
  {
    id: "local-3-hybrid",
    moduleId: "local-models",
    number: 3,
    title: "Pipeline híbrido: local + cloud con fallback",
    duration: "25 min",
    objectives: [
      "Diseñar un pipeline que use modelos locales para latencia y cloud para calidad",
      "Implementar routing inteligente entre local y cloud",
      "Configurar fallback automático cuando el modelo local no es suficiente",
    ],
    sections: [
      {
        title: "Routing inteligente",
        content: [
          "No todos los requests necesitan GPT-4o. Un clasificador local puede resolver el 70% de las consultas a costo cero.",
          "Routing por complejidad: queries simples → local, queries complejas → cloud.",
          "Routing por tipo: clasificación/extracción → local (modelos pequeños son buenos), generación creativa → cloud.",
        ],
        code: {
          language: "typescript",
          code: `// Router inteligente local/cloud
interface RouteDecision {
  target: "local" | "cloud";
  model: string;
  reason: string;
}

function routeRequest(
  input: string,
  taskType: "classify" | "extract" | "generate" | "chat"
): RouteDecision {
  // Reglas de routing
  const inputTokens = Math.ceil(input.length / 4);

  // Clasificación y extracción → local (suficiente calidad, mínima latencia)
  if (taskType === "classify" || taskType === "extract") {
    return {
      target: "local",
      model: "llama3.1:8b",
      reason: "Tareas estructuradas funcionan bien en modelos locales",
    };
  }

  // Input corto + chat simple → local
  if (taskType === "chat" && inputTokens < 500) {
    return {
      target: "local",
      model: "llama3.1:8b",
      reason: "Query simple, modelo local es suficiente",
    };
  }

  // Generación compleja o input largo → cloud
  return {
    target: "cloud",
    model: "claude-sonnet-4-6",
    reason: "Tarea compleja que requiere máxima calidad",
  };
}

// Pipeline con fallback
async function hybridCall(input: string, taskType: "classify" | "extract" | "generate" | "chat"): Promise<string> {
  const route = routeRequest(input, taskType);

  try {
    if (route.target === "local") {
      return await ollamaChat(input, route.model);
    }
    return await cloudChat(input, route.model);
  } catch {
    // Fallback: si local falla → cloud, si cloud falla → local
    const fallbackTarget = route.target === "local" ? "cloud" : "local";
    console.warn(\`Fallback de \${route.target} a \${fallbackTarget}\`);
    return fallbackTarget === "local"
      ? await ollamaChat(input, "llama3.1:8b")
      : await cloudChat(input, "claude-haiku-4-5-20251001");
  }
}`,
          caption: "El fallback bidireccional garantiza disponibilidad. Si cloud está caído, local sigue funcionando.",
        },
      },
      {
        title: "Cuantización: calidad vs velocidad vs tamaño",
        content: [
          "Los modelos se almacenan en diferentes niveles de precisión: FP16 (full), Q8 (8-bit), Q5, Q4 (más comprimido).",
          "Cada nivel de cuantización reduce tamaño y VRAM necesaria, pero degrada ligeramente la calidad.",
          "Q4_K_M es el sweet spot más popular: ~50% del tamaño original con pérdida de calidad casi imperceptible para la mayoría de tareas.",
        ],
        code: {
          language: "typescript",
          code: `// Comparación de cuantizaciones para Llama 3.1 8B
const quantizations = [
  { quant: "FP16",   size: "16 GB", vram: "16 GB", quality: "100%", speed: "baseline" },
  { quant: "Q8_0",   size: "8.5 GB", vram: "9 GB", quality: "~99%", speed: "1.1x" },
  { quant: "Q5_K_M", size: "5.7 GB", vram: "6.5 GB", quality: "~97%", speed: "1.3x" },
  { quant: "Q4_K_M", size: "4.9 GB", vram: "5.5 GB", quality: "~95%", speed: "1.5x" },
  { quant: "Q3_K_M", size: "3.9 GB", vram: "4.5 GB", quality: "~90%", speed: "1.6x" },
  { quant: "Q2_K",   size: "3.2 GB", vram: "4.0 GB", quality: "~80%", speed: "1.8x" },
];

// En Ollama, descargar versión cuantizada:
// ollama pull llama3.1:8b-instruct-q4_K_M

// Para cuantizar manualmente, usa llama.cpp:
// ./quantize model-f16.gguf model-q4km.gguf Q4_K_M`,
          caption: "Q4_K_M es el default de Ollama. Para la mayoría de casos, no necesitas cambiar.",
        },
        tip: "Si la calidad de Q4 no es suficiente para tu caso, prueba Q5_K_M antes de ir a Q8. El salto de 4→5 bits mejora más la calidad que de 5→8.",
      },
    ],
    exercise: {
      instruction:
        "Implementa un pipeline híbrido completo que: (1) clasifique el request por complejidad, (2) envíe a local o cloud según la clasificación, (3) mida latencia y calidad de ambos, (4) tenga fallback automático, (5) genere un reporte comparativo al final con % de requests locales, ahorro estimado en costo, y diferencias de latencia.",
      hints: [
        "La clasificación puede ser por heurísticas simples: longitud del input, tipo de tarea, keywords",
        "Ahorro = requests_locales × costo_que_habrían_tenido_en_cloud",
        "El reporte te ayuda a ajustar los umbrales de routing",
      ],
    },
  },
];
