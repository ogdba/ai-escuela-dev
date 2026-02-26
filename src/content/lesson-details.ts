export interface LessonDetail {
  resumen: string;
  porQueImporta: string;
  explicacion: string[];
  pasos: string[];
  erroresComunes: string[];
  resultadoEsperado: string;
}

export const MODULE_DETAILS: Record<string, LessonDetail> = {
  "llm-fundamentals": {
    resumen: "Entenderás el motor económico y técnico de cualquier producto con IA.",
    porQueImporta:
      "Si no dominas tokens, contexto y temperatura, no puedes controlar calidad, costo ni latencia en producción.",
    explicacion: [
      "Un LLM no 'piensa': predice el siguiente token con base en patrones probabilísticos.",
      "La ventana de contexto define cuánta información puede usar el modelo en una respuesta.",
      "Los costos dependen del volumen de tokens de entrada y salida; optimizar prompts reduce gasto operativo.",
    ],
    pasos: [
      "Mide tokens en 3 prompts reales de tu producto.",
      "Calcula costo estimado por 1,000 solicitudes.",
      "Ajusta longitud del contexto y compara calidad/costo.",
    ],
    erroresComunes: [
      "Enviar contexto excesivo sin ranking previo.",
      "No limitar longitud de salida.",
      "Ignorar temperatura/top-p para casos determinísticos.",
    ],
    resultadoEsperado:
      "Un mini-reporte con presupuesto de tokens y configuración recomendada por tipo de endpoint.",
  },
  "prompt-engineering": {
    resumen: "Diseñarás prompts robustos y repetibles para tareas de software.",
    porQueImporta:
      "La calidad de los prompts impacta directamente precisión funcional, seguridad y tiempo de revisión.",
    explicacion: [
      "Un buen prompt combina contexto, objetivo, restricciones y formato de salida.",
      "Few-shot reduce ambigüedad en tareas con reglas claras.",
      "Separar instrucciones del contenido de usuario reduce prompt injection.",
    ],
    pasos: [
      "Define plantilla base para generación de código.",
      "Agrega ejemplos buenos/malos y salida esperada.",
      "Versiona tu prompt y mide tasa de acierto.",
    ],
    erroresComunes: [
      "Prompts vagos ('hazlo mejor').",
      "No exigir formato estructurado de salida.",
      "No validar respuesta antes de ejecutar cambios.",
    ],
    resultadoEsperado:
      "Una librería de prompts versionados para tareas de desarrollo (bugfix, test, docs, refactor).",
  },
  "rag-fundamentals": {
    resumen: "Aprenderás a construir RAG útil para documentación técnica y soporte interno.",
    porQueImporta:
      "RAG mal diseñado inventa respuestas; bien diseñado reduce errores y acelera equipos.",
    explicacion: [
      "Chunking define granularidad de conocimiento recuperable.",
      "Embeddings deben evaluarse con métricas de recuperación, no solo intuición.",
      "Re-ranking y filtros de contexto elevan precisión antes de generar.",
    ],
    pasos: [
      "Crea chunks de docs con overlap controlado.",
      "Evalúa recall@k sobre consultas reales.",
      "Implementa re-ranking para top-k final.",
    ],
    erroresComunes: [
      "Chunking gigante sin estructura.",
      "No separar fuentes confiables vs borradores.",
      "No versionar índice y embeddings.",
    ],
    resultadoEsperado: "Pipeline RAG medible con mejora comprobable en precisión contextual.",
  },
  "promptops-guardrails": {
    resumen: "Convertirás prompts en activos operables con políticas y controles.",
    porQueImporta:
      "Sin guardrails, un buen demo se rompe en producción por entradas maliciosas o ruido real.",
    explicacion: [
      "PromptOps implica versionado, revisión y despliegue controlado de prompts.",
      "Guardrails validan entradas/salidas, no solo texto del prompt.",
      "Fallbacks mantienen continuidad cuando el modelo falla.",
    ],
    pasos: [
      "Define esquema JSON de salida.",
      "Valida salida antes de usarla en código o UI.",
      "Implementa fallback cuando falle validación.",
    ],
    erroresComunes: [
      "Confiar ciegamente en salida del modelo.",
      "No registrar fallas de validación.",
      "No tener modo degradado seguro.",
    ],
    resultadoEsperado: "Flujo con validación de esquema + filtros PII + fallback operacional.",
  },
  "ai-evals": {
    resumen: "Crearás un sistema de evaluación continua para evitar regresiones silenciosas.",
    porQueImporta:
      "Sin evals, cada ajuste de prompt/modelo puede romper producción sin darte cuenta.",
    explicacion: [
      "Golden datasets dan una línea base objetiva.",
      "Métricas deben alinearse con negocio (exactitud, utilidad, seguridad).",
      "Evals en CI convierten calidad de IA en criterio de release.",
    ],
    pasos: [
      "Construye set de casos críticos reales.",
      "Define umbrales mínimos por métrica.",
      "Bloquea merge/deploy si una métrica cae.",
    ],
    erroresComunes: [
      "Evaluar solo exactitud y olvidar seguridad.",
      "Datasets demasiado pequeños o sesgados.",
      "No versionar resultados históricos.",
    ],
    resultadoEsperado: "Harness de eval reproducible integrado al pipeline de desarrollo.",
  },
  "observability-cost-latency": {
    resumen: "Operarás IA como producto: con métricas, alertas y presupuesto.",
    porQueImporta: "Lo que no observas no lo puedes optimizar ni escalar.",
    explicacion: [
      "Debes medir costo por endpoint, usuario y feature.",
      "P50/P95 de latencia revelan cuellos reales.",
      "Alertas accionables reducen MTTR en incidentes de IA.",
    ],
    pasos: [
      "Instrumenta trazas con IDs de solicitud.",
      "Publica dashboard de costo/latencia.",
      "Define alertas con runbooks operativos.",
    ],
    erroresComunes: [
      "Monitoreo solo de disponibilidad.",
      "No separar costo por caso de uso.",
      "Alertas sin owner ni plan de respuesta.",
    ],
    resultadoEsperado: "Panel operativo con presupuesto de IA y control de degradación.",
  },
  "ci-cd-ai": {
    resumen: "Integrarás IA al SDLC sin perder control de calidad y seguridad.",
    porQueImporta: "La velocidad sin gates de calidad en IA genera deuda y riesgo acumulado.",
    explicacion: [
      "Modelos y prompts también requieren versionado y rollback.",
      "Canary releases reducen impacto de cambios semánticos.",
      "Security + evals deben correr automáticamente en cada release.",
    ],
    pasos: [
      "Configura pipeline con lint/test/evals/security.",
      "Activa despliegue canary para prompts/modelos.",
      "Define rollback automático por umbral.",
    ],
    erroresComunes: [
      "Deploy directo sin canary.",
      "No congelar versiones de prompts.",
      "No correlacionar incidentes con cambios recientes.",
    ],
    resultadoEsperado: "Pipeline CI/CD para features de IA con gates y rollback operativo.",
  },
  "ai-security": {
    resumen: "Aplicarás seguridad práctica basada en OWASP LLM Top 10.",
    porQueImporta:
      "Los riesgos de IA son explotables en producción si no hay controles por diseño.",
    explicacion: [
      "Prompt injection y output handling inseguro son riesgos frecuentes.",
      "Mínimo privilegio y aislamiento de herramientas son obligatorios en agentes.",
      "Defensa efectiva combina prevención, detección y respuesta.",
    ],
    pasos: [
      "Modela amenazas por endpoint de IA.",
      "Añade filtros y validación de salida.",
      "Ejecuta pruebas de abuso y documenta mitigaciones.",
    ],
    erroresComunes: [
      "Conectar herramientas críticas sin scopes.",
      "No sanitizar salidas antes de renderizar/ejecutar.",
      "No tener monitoreo de uso anómalo.",
    ],
    resultadoEsperado: "Checklist de hardening aplicado y validado en tus flujos principales.",
  },
};

export const LAB_DETAILS: Record<string, LessonDetail> = {
  "lab-token-counter": {
    resumen: "Construye un contador de tokens útil para decisiones de costo en backend.",
    porQueImporta: "Te permite presupuestar llamadas y reducir desperdicio en prompts largos.",
    explicacion: [
      "Implementa conteo por request, respuesta y total.",
      "Expón el costo en UI para que el equipo tome decisiones.",
    ],
    pasos: [
      "Integrar librería de conteo.",
      "Registrar consumo por endpoint.",
      "Mostrar costo por operación.",
    ],
    erroresComunes: ["No considerar tokens de sistema.", "No almacenar histórico por usuario."],
    resultadoEsperado: "Métrica de costo por endpoint visible en dashboard.",
  },
  "lab-prompt-arena": {
    resumen: "Compara versiones de prompts con criterios objetivos.",
    porQueImporta: "Evita elegir prompts por percepción y no por resultados.",
    explicacion: ["Define rúbrica de calidad.", "Evalúa costo/latencia además de exactitud."],
    pasos: [
      "Correr batch de prompts.",
      "Rankear por score compuesto.",
      "Guardar ganador versionado.",
    ],
    erroresComunes: ["No usar mismos casos para comparar.", "Ignorar variabilidad del modelo."],
    resultadoEsperado: "Prompt ganador con evidencia de mejora.",
  },
  "lab-rag-eval": {
    resumen: "Evalúa precisión de recuperación en un pipeline RAG.",
    porQueImporta: "La calidad de retrieval define la calidad final de respuestas.",
    explicacion: [
      "Mide recall@k y precisión contextual.",
      "Ajusta chunking y top-k en iteraciones.",
    ],
    pasos: ["Definir set de preguntas.", "Medir baseline.", "Optimizar y comparar."],
    erroresComunes: ["No etiquetar fuentes correctas.", "Comparar datasets distintos."],
    resultadoEsperado: "Incremento medible de precisión contextual.",
  },
  "lab-guardrails": {
    resumen: "Implementa validación estructurada y filtros de seguridad.",
    porQueImporta: "Reduce respuestas peligrosas y errores de integración.",
    explicacion: ["Valida contra esquema antes de procesar.", "Aplica saneamiento de salida."],
    pasos: ["Definir schema.", "Validar salida.", "Activar fallback en error."],
    erroresComunes: ["Schema demasiado permisivo.", "No registrar incidentes."],
    resultadoEsperado: "Flujo robusto con degradación segura.",
  },
  "lab-evals-ci": {
    resumen: "Conecta evals al pipeline CI para bloquear regresiones.",
    porQueImporta: "Calidad de IA debe ser requisito de merge/release.",
    explicacion: ["Define umbrales por métrica.", "Publica reporte de evaluación."],
    pasos: ["Configurar suite eval.", "Ejecutar en CI.", "Bloquear fallos."],
    erroresComunes: ["Umbrales ambiguos.", "No versionar dataset."],
    resultadoEsperado: "Pipeline con gate de calidad de IA.",
  },
  "lab-observability": {
    resumen: "Monta observabilidad para costo, latencia y error rate.",
    porQueImporta: "Operación estable requiere visibilidad continua.",
    explicacion: ["Mide P50/P95 y costo por ruta.", "Configura alertas accionables."],
    pasos: ["Instrumentar trazas.", "Dashboard.", "Alertas y runbooks."],
    erroresComunes: ["Monitoreo sin contexto de negocio.", "Alertas ruidosas."],
    resultadoEsperado: "Panel operativo para tomar decisiones rápidas.",
  },
  "lab-ci-cd": {
    resumen: "Implementa canary + rollback para cambios de modelo/prompt.",
    porQueImporta: "Reduce riesgo al lanzar mejoras semánticas.",
    explicacion: ["Segmenta tráfico inicial.", "Revierte automáticamente por KPI."],
    pasos: ["Definir canary cohort.", "Comparar KPI.", "Promover o rollback."],
    erroresComunes: ["Canary sin métricas claras.", "Rollback manual lento."],
    resultadoEsperado: "Despliegue gradual confiable.",
  },
  "lab-prompt-injection": {
    resumen: "Simula ataques de inyección y aplica defensa en capas.",
    porQueImporta: "Es la vía de abuso más común en apps con LLM.",
    explicacion: ["Separa instrucciones sistema/usuario.", "Valida salida antes de actuar."],
    pasos: ["Probar payloads.", "Aplicar mitigaciones.", "Re-test."],
    erroresComunes: ["Confiar en una sola regla.", "No auditar tool-calls."],
    resultadoEsperado: "Superficie de ataque reducida con evidencia.",
  },
  "lab-output-sanitizer": {
    resumen: "Protege UI y backend de salidas inseguras del modelo.",
    porQueImporta: "Evita XSS, SQLi indirecto y ejecuciones no intencionadas.",
    explicacion: [
      "Sanea y valida antes de renderizar o ejecutar.",
      "Usa allowlists de campos esperados.",
    ],
    pasos: ["Definir reglas.", "Aplicar sanitización.", "Probar casos adversos."],
    erroresComunes: ["Escapar solo frontend.", "No testear payloads reales."],
    resultadoEsperado: "Respuesta segura lista para uso productivo.",
  },
  "lab-threat-model": {
    resumen: "Construye threat model para una feature de IA real.",
    porQueImporta: "Te permite priorizar mitigaciones por impacto real.",
    explicacion: ["Identifica activos, entradas y actores.", "Asocia controles por riesgo."],
    pasos: ["Mapear arquitectura.", "Listar amenazas.", "Plan de mitigación."],
    erroresComunes: ["Quedarse en teoría sin controles.", "No asignar owner por riesgo."],
    resultadoEsperado: "Documento de riesgos con plan accionable.",
  },
};
