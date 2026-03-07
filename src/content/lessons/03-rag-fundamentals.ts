import type { Lesson } from "./types";

export const ragFundamentalsLessons: Lesson[] = [
  {
    id: "rag-1-intro",
    moduleId: "rag-fundamentals",
    number: 1,
    title: "¿Qué es RAG y por qué lo necesitas?",
    duration: "20 min",
    objectives: [
      "Entender el problema que RAG resuelve",
      "Conocer la arquitectura básica de un sistema RAG",
      "Diferenciar RAG de fine-tuning y prompting con contexto",
    ],
    sections: [
      {
        title: "El problema: conocimiento limitado",
        content: [
          "Los LLMs solo conocen lo que aprendieron durante el entrenamiento. No saben sobre tu documentación interna, tus APIs ni tus procesos.",
          "RAG (Retrieval-Augmented Generation) resuelve esto: busca información relevante en tus datos y la inyecta en el prompt antes de generar.",
          "Piensa en RAG como darle al modelo un 'libro de referencia' justo antes de responder, en lugar de confiar solo en su memoria.",
        ],
        code: {
          language: "typescript",
          code: `// Flujo básico de RAG
async function ragPipeline(userQuery: string): Promise<string> {
  // 1. RETRIEVE: buscar documentos relevantes
  const relevantDocs = await vectorStore.search(userQuery, { topK: 5 });

  // 2. AUGMENT: construir prompt con contexto
  const context = relevantDocs.map(d => d.content).join("\\n---\\n");
  const augmentedPrompt = \`Usando SOLO la siguiente documentación, responde
la pregunta del usuario. Si la respuesta no está en la documentación,
di "No tengo esa información".

Documentación:
\${context}

Pregunta: \${userQuery}\`;

  // 3. GENERATE: obtener respuesta del LLM
  return await llm.generate(augmentedPrompt);
}`,
          caption: "RAG = Retrieve + Augment + Generate. Cada paso es independiente y optimizable.",
        },
      },
      {
        title: "RAG vs fine-tuning vs context stuffing",
        content: [
          "Context stuffing: pegar todo el texto en el prompt. Simple pero costoso y limitado por la ventana de contexto.",
          "Fine-tuning: entrenar el modelo con tus datos. Costoso, lento de actualizar, y el modelo puede 'olvidar' conocimiento general.",
          "RAG: busca solo lo relevante y lo inyecta. Barato, actualizable al instante, y el modelo mantiene sus capacidades generales.",
        ],
        tip: "Usa RAG cuando tus datos cambian frecuentemente (docs, tickets, código). Usa fine-tuning cuando necesitas que el modelo aprenda un estilo o formato específico que no cambia.",
      },
      {
        title: "Componentes de un sistema RAG",
        content: [
          "Document loader: ingesta de documentos (PDFs, Markdown, código, bases de datos).",
          "Chunker/splitter: divide documentos en fragmentos manejables.",
          "Embedding model: convierte texto en vectores numéricos que representan su significado.",
          "Vector store: base de datos especializada en búsqueda por similitud de vectores.",
          "Retriever: busca los chunks más relevantes para una query.",
          "Generator: el LLM que produce la respuesta final con el contexto recuperado.",
        ],
        code: {
          language: "typescript",
          code: `// Arquitectura de componentes
interface RAGSystem {
  loader: DocumentLoader;     // Markdown, PDF, código
  chunker: TextChunker;       // Split + overlap
  embedder: EmbeddingModel;   // text → vector[1536]
  store: VectorStore;         // Almacena y busca vectores
  retriever: Retriever;       // Query → relevant chunks
  generator: LLM;             // Context + query → answer
}

// Cada componente es intercambiable
const ragConfig = {
  embedder: "text-embedding-3-small", // OpenAI
  store: "chromadb",                   // Local, gratis
  generator: "claude-sonnet-4-6",       // Anthropic
  chunkSize: 512,                       // tokens por chunk
  chunkOverlap: 50,                     // tokens de overlap
  topK: 5,                             // chunks a recuperar
};`,
          caption: "Empieza con componentes simples y optimiza uno a la vez basándote en métricas.",
        },
      },
    ],
    exercise: {
      instruction:
        "Dibuja (en texto/ASCII) la arquitectura de un sistema RAG para tu caso de uso. Identifica: (1) fuente de datos, (2) estrategia de chunking, (3) qué embedding model usarías, (4) qué vector store, (5) prompt template para el generator.",
      hints: [
        "Piensa en un caso real: documentación de tu equipo, FAQ de soporte, código de tu proyecto",
        "Para empezar rápido: OpenAI embeddings + ChromaDB + Claude como generator",
        "Define el chunk size basándote en la granularidad de tu contenido",
      ],
    },
  },
  {
    id: "rag-2-chunking",
    moduleId: "rag-fundamentals",
    number: 2,
    title: "Estrategias de chunking y embeddings",
    duration: "25 min",
    objectives: [
      "Elegir la estrategia de chunking adecuada para tu contenido",
      "Entender cómo funcionan los embeddings y su impacto en la recuperación",
      "Configurar overlap y tamaño de chunk correctamente",
    ],
    sections: [
      {
        title: "Chunking: el paso más importante",
        content: [
          "La calidad de tu RAG depende más del chunking que del modelo. Garbage in, garbage out.",
          "Chunk muy grande: incluye información irrelevante, diluye el contexto, cuesta más.",
          "Chunk muy pequeño: pierde contexto, el fragmento no tiene sentido por sí solo.",
          "El sweet spot típico: 256-1024 tokens, con 10-20% de overlap.",
        ],
        code: {
          language: "typescript",
          code: `// Estrategias de chunking por tipo de contenido
type ChunkStrategy = "fixed" | "paragraph" | "semantic" | "code";

const strategies: Record<ChunkStrategy, {
  description: string;
  bestFor: string;
  chunkSize: number;
}> = {
  fixed: {
    description: "Divide cada N tokens con overlap fijo",
    bestFor: "Texto uniforme sin estructura clara",
    chunkSize: 512,
  },
  paragraph: {
    description: "Divide en párrafos o secciones (headers)",
    bestFor: "Documentación técnica, artículos, READMEs",
    chunkSize: 800, // flexible, respeta límites naturales
  },
  semantic: {
    description: "Divide cuando cambia el tema (usando embeddings)",
    bestFor: "Transcripciones, conversaciones, contenido mixto",
    chunkSize: 600,
  },
  code: {
    description: "Divide por funciones, clases o bloques lógicos",
    bestFor: "Código fuente, configuración, scripts",
    chunkSize: 400, // funciones suelen ser más cortas
  },
};`,
          caption: "El tipo de contenido dicta la estrategia. No uses fixed-size para todo.",
        },
      },
      {
        title: "Chunking avanzado: recursive y parent-child",
        content: [
          "Recursive text splitter: intenta dividir primero por headers, luego párrafos, luego oraciones. Respeta la jerarquía del documento.",
          "Parent-child: indexa chunks pequeños para búsqueda precisa, pero devuelve el chunk padre (más grande) para contexto completo.",
          "Metadata enrichment: agrega título, sección, fecha, source a cada chunk para filtrar en la búsqueda.",
        ],
        code: {
          language: "typescript",
          code: `// Parent-child chunking
interface Chunk {
  id: string;
  content: string;
  parentId: string | null;
  metadata: {
    source: string;
    section: string;
    level: "parent" | "child";
  };
  embedding?: number[];
}

function parentChildChunk(document: string, title: string): Chunk[] {
  const sections = document.split(/\\n## /); // split por headers H2
  const chunks: Chunk[] = [];

  sections.forEach((section, i) => {
    const parentId = \`\${title}-section-\${i}\`;
    // Parent: sección completa (para devolver como contexto)
    chunks.push({
      id: parentId,
      content: section,
      parentId: null,
      metadata: { source: title, section: \`Sección \${i}\`, level: "parent" },
    });

    // Children: párrafos individuales (para búsqueda precisa)
    const paragraphs = section.split("\\n\\n").filter(p => p.trim().length > 50);
    paragraphs.forEach((para, j) => {
      chunks.push({
        id: \`\${parentId}-p\${j}\`,
        content: para,
        parentId,
        metadata: { source: title, section: \`Sección \${i}\`, level: "child" },
      });
    });
  });

  return chunks;
}`,
          caption: "Busca en children (preciso), devuelve parents (contexto completo). Lo mejor de ambos mundos.",
        },
      },
      {
        title: "Embeddings: texto → vectores",
        content: [
          "Un embedding convierte texto en un vector de números (ej: 1536 dimensiones) que captura su significado semántico.",
          "Textos con significado similar tienen vectores cercanos en el espacio. 'perro' y 'canino' estarán cerca; 'perro' y 'JavaScript' estarán lejos.",
          "Modelos de embedding populares: text-embedding-3-small (OpenAI, barato), text-embedding-3-large (OpenAI, preciso), e5-large (open source).",
        ],
        code: {
          language: "typescript",
          code: `// Generar embeddings y medir similitud
async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Ejemplo
const v1 = await embed("¿Cómo instalo Node.js?");
const v2 = await embed("Guía de instalación de Node");
const v3 = await embed("Receta de paella valenciana");

console.log(cosineSimilarity(v1, v2)); // ~0.92 (muy similares)
console.log(cosineSimilarity(v1, v3)); // ~0.15 (no relacionados)`,
          caption: "La similitud coseno va de -1 a 1. Valores > 0.7 generalmente indican relevancia.",
        },
        tip: "Los embeddings multilingües (como e5-multilingual) son mejores para contenido en español que los modelos entrenados solo en inglés.",
      },
    ],
    exercise: {
      instruction:
        "Implementa un chunker que: (1) divida documentación Markdown por headers (##, ###), (2) agregue metadata (título, nivel del header, posición), (3) respete un tamaño máximo de 500 tokens por chunk, dividiendo párrafos largos con overlap si es necesario.",
      hints: [
        "Usa regex para detectar headers: /^#{1,3} /m",
        "Agrega el header como parte de la metadata, no del contenido (ahorra tokens)",
        "Si un párrafo excede el máximo, subdivide con el patrón de overlap del Módulo 1",
      ],
      solution: {
        language: "typescript",
        code: `interface MdChunk {
  content: string;
  metadata: { title: string; header: string; level: number; index: number };
}

function chunkMarkdown(md: string, maxTokens = 500): MdChunk[] {
  const headerRegex = /^(#{1,3}) (.+)$/gm;
  const sections: { level: number; header: string; start: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = headerRegex.exec(md)) !== null) {
    sections.push({ level: match[1].length, header: match[2], start: match.index });
  }

  const chunks: MdChunk[] = [];
  const title = sections[0]?.header ?? "Untitled";

  sections.forEach((sec, i) => {
    const end = sections[i + 1]?.start ?? md.length;
    const text = md.slice(sec.start, end).replace(/^#{1,3} .+\\n/, "").trim();
    const maxChars = maxTokens * 4;

    if (text.length <= maxChars) {
      chunks.push({
        content: text,
        metadata: { title, header: sec.header, level: sec.level, index: chunks.length },
      });
    } else {
      // Subdividir párrafos largos
      let start = 0;
      while (start < text.length) {
        const slice = text.slice(start, start + maxChars);
        chunks.push({
          content: slice.trim(),
          metadata: { title, header: sec.header, level: sec.level, index: chunks.length },
        });
        start += maxChars - Math.floor(maxChars * 0.15);
      }
    }
  });
  return chunks;
}`,
      },
    },
  },
  {
    id: "rag-3-quality",
    moduleId: "rag-fundamentals",
    number: 3,
    title: "Calidad de recuperación: métricas y re-ranking",
    duration: "25 min",
    objectives: [
      "Medir la calidad de tu retriever con métricas objetivas",
      "Implementar re-ranking para mejorar precisión",
      "Configurar filtros de contexto para reducir ruido",
    ],
    sections: [
      {
        title: "Métricas de recuperación",
        content: [
          "Recall@k: De los documentos relevantes, ¿qué porcentaje está en los top-k resultados? Alto recall = no te pierdes información importante.",
          "Precision@k: De los top-k resultados, ¿qué porcentaje es realmente relevante? Alta precisión = no inyectas ruido al LLM.",
          "MRR (Mean Reciprocal Rank): ¿Qué tan arriba aparece el primer resultado relevante? MRR alto = eficiencia.",
        ],
        code: {
          language: "typescript",
          code: `// Evaluar calidad de retrieval
interface RetrievalEval {
  query: string;
  relevantDocIds: string[];  // ground truth
  retrievedDocIds: string[]; // lo que devolvió el sistema
}

function recallAtK(eval_: RetrievalEval, k: number): number {
  const topK = new Set(eval_.retrievedDocIds.slice(0, k));
  const hits = eval_.relevantDocIds.filter(id => topK.has(id));
  return hits.length / eval_.relevantDocIds.length;
}

function precisionAtK(eval_: RetrievalEval, k: number): number {
  const topK = eval_.retrievedDocIds.slice(0, k);
  const hits = topK.filter(id => eval_.relevantDocIds.includes(id));
  return hits.length / k;
}

function mrr(eval_: RetrievalEval): number {
  for (let i = 0; i < eval_.retrievedDocIds.length; i++) {
    if (eval_.relevantDocIds.includes(eval_.retrievedDocIds[i])) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

// Benchmark sobre un dataset de test
const testSet: RetrievalEval[] = [
  {
    query: "¿Cómo configuro CORS en Express?",
    relevantDocIds: ["express-cors-guide", "express-middleware"],
    retrievedDocIds: ["express-cors-guide", "react-cors-proxy", "express-middleware", "nginx-cors"],
  },
];

testSet.forEach(t => {
  console.log(\`Recall@3: \${recallAtK(t, 3)}\`);     // 1.0
  console.log(\`Precision@3: \${precisionAtK(t, 3)}\`); // 0.67
  console.log(\`MRR: \${mrr(t)}\`);                     // 1.0
});`,
          caption: "Crea un golden set de 20-50 queries con sus documentos relevantes. Es tu herramienta de mejora continua.",
        },
      },
      {
        title: "Re-ranking: segunda pasada de relevancia",
        content: [
          "El retriever inicial (por embeddings) es rápido pero impreciso. Re-ranking usa un modelo más sofisticado para reordenar los resultados.",
          "Patrón: recupera top-20 con embeddings (rápido), luego re-rankea a top-5 con un cross-encoder (preciso).",
          "Cross-encoders comparan query + documento juntos, lo que captura relaciones que los embeddings independientes pierden.",
        ],
        code: {
          language: "typescript",
          code: `// Pipeline con re-ranking
async function retrieveWithRerank(
  query: string,
  topK: number = 5,
  initialK: number = 20
): Promise<Document[]> {
  // Paso 1: búsqueda amplia por embeddings (rápida)
  const candidates = await vectorStore.search(query, { topK: initialK });

  // Paso 2: re-ranking con un modelo más preciso
  const scored = await Promise.all(
    candidates.map(async (doc) => {
      const relevanceScore = await crossEncoder.score(query, doc.content);
      return { ...doc, relevanceScore };
    })
  );

  // Paso 3: tomar los top-K después del re-rank
  return scored
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK);
}`,
          caption: "Re-ranking típicamente mejora precision@5 en un 15-30% sobre búsqueda por embedding puro.",
        },
        tip: "Si no quieres un cross-encoder, puedes usar el mismo LLM como re-ranker: 'De estos 20 documentos, ¿cuáles son los 5 más relevantes para esta query?'",
      },
      {
        title: "Filtros de contexto y búsqueda híbrida",
        content: [
          "Filtros de metadata: limita la búsqueda por fecha, fuente, categoría, o idioma antes de la búsqueda semántica.",
          "Búsqueda híbrida: combina búsqueda semántica (embeddings) con búsqueda léxica (BM25/keywords) para lo mejor de ambos mundos.",
          "BM25 es mejor para términos exactos y nombres propios. Embeddings son mejores para sinónimos y conceptos.",
        ],
        code: {
          language: "typescript",
          code: `// Búsqueda híbrida: semántica + léxica
interface HybridResult {
  docId: string;
  semanticScore: number;
  lexicalScore: number;
  combinedScore: number;
}

async function hybridSearch(
  query: string,
  topK: number = 5,
  alpha: number = 0.7 // peso de semántico vs léxico
): Promise<HybridResult[]> {
  const [semantic, lexical] = await Promise.all([
    vectorStore.search(query, { topK: 20 }),
    bm25Index.search(query, { topK: 20 }),
  ]);

  // Normalizar scores a 0-1
  const normalize = (results: { id: string; score: number }[]) => {
    const max = Math.max(...results.map(r => r.score));
    return results.map(r => ({ ...r, score: r.score / (max || 1) }));
  };

  const semNorm = normalize(semantic);
  const lexNorm = normalize(lexical);

  // Combinar con Reciprocal Rank Fusion o weighted sum
  const combined = new Map<string, HybridResult>();
  for (const r of semNorm) {
    combined.set(r.id, {
      docId: r.id,
      semanticScore: r.score,
      lexicalScore: 0,
      combinedScore: r.score * alpha,
    });
  }
  for (const r of lexNorm) {
    const existing = combined.get(r.id);
    if (existing) {
      existing.lexicalScore = r.score;
      existing.combinedScore += r.score * (1 - alpha);
    } else {
      combined.set(r.id, {
        docId: r.id, semanticScore: 0,
        lexicalScore: r.score,
        combinedScore: r.score * (1 - alpha),
      });
    }
  }

  return [...combined.values()]
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, topK);
}`,
          caption: "alpha=0.7 da más peso a semántico. Ajusta según tu caso: más léxico para búsquedas con nombres específicos.",
        },
      },
    ],
    exercise: {
      instruction:
        "Crea un golden set de 10 queries de evaluación para un sistema RAG de documentación técnica. Para cada query, define: (1) los documentos relevantes esperados, (2) ejecuta las métricas recall@5, precision@5 y MRR sobre resultados simulados, (3) identifica qué queries tienen peor rendimiento y por qué.",
      hints: [
        "Incluye queries de diferentes tipos: exactas ('configurar CORS'), conceptuales ('qué es middleware'), y complejas ('cómo proteger API de rate limiting')",
        "Simula resultados con IDs de docs ficticios",
        "Las queries con nombres propios o acrónimos suelen fallar en búsqueda semántica pura",
      ],
    },
  },
];
