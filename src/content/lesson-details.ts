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
  "mcp-integrations": {
    resumen:
      "Construirás servidores MCP seguros que expongan herramientas y datos a modelos de IA.",
    porQueImporta:
      "MCP es el estándar para conectar modelos con herramientas reales. Sin seguridad, cada tool es un vector de ataque.",
    explicacion: [
      "MCP separa la lógica de acceso a datos (servidor) de la lógica de razonamiento (cliente/modelo).",
      "Tools ejecutan acciones (escribir, crear, borrar). Resources proveen datos de solo lectura.",
      "RBAC y auditoría son obligatorios para cualquier tool que modifique estado.",
    ],
    pasos: [
      "Diseña tools con scopes mínimos y validación de inputs.",
      "Implementa RBAC por tool con audit logging.",
      "Conecta el servidor a Claude Desktop y verifica con MCP Inspector.",
    ],
    erroresComunes: [
      "Dar permisos de escritura a tools que solo necesitan lectura.",
      "No auditar invocaciones de tools sensibles.",
      "No validar inputs del modelo antes de ejecutar acciones reales.",
    ],
    resultadoEsperado:
      "Un servidor MCP funcional con RBAC, auditoría y tools que consultan repos y crean tickets de forma segura.",
  },
  "agent-architectures": {
    resumen:
      "Diseñarás agentes con patrones probados: ReAct, plan-execute-verify, multi-agente y aprobación humana.",
    porQueImporta:
      "Los agentes sin guardrails son peligrosos. Los patrones correctos garantizan control, trazabilidad y seguridad.",
    explicacion: [
      "ReAct alterna razonamiento y acción en un loop controlado con límite de pasos.",
      "Plan-Execute-Verify genera un plan revisable, ejecuta cada paso, y verifica el resultado.",
      "Multi-agente usa orquestador + especialistas para dividir responsabilidades y limitar blast radius.",
    ],
    pasos: [
      "Implementa un loop agéntico con maxSteps, timeout y budget de tokens.",
      "Agrega human-in-the-loop para acciones de escritura y deploy.",
      "Construye detección de loops y auto-abort cuando el agente se repite.",
    ],
    erroresComunes: [
      "No poner límite de pasos (loop infinito).",
      "Dar acceso a todas las herramientas sin whitelist.",
      "No auditar las acciones tomadas por el agente.",
    ],
    resultadoEsperado:
      "Un agente DevOps que investiga bugs, propone fixes y pide aprobación humana antes de actuar.",
  },
  "local-models": {
    resumen:
      "Ejecutarás modelos de IA localmente y diseñarás pipelines híbridos local + cloud.",
    porQueImporta:
      "Modelos locales eliminan dependencia de proveedores, garantizan privacidad y reducen costos en alto volumen.",
    explicacion: [
      "Ollama permite ejecutar modelos cuantizados con un solo comando. API compatible con OpenAI.",
      "La cuantización (Q4, Q5, Q8) reduce tamaño y VRAM necesaria con pérdida mínima de calidad.",
      "Un pipeline híbrido envía queries simples a local y complejas a cloud, optimizando costo y calidad.",
    ],
    pasos: [
      "Instala Ollama y descarga un modelo 7-8B cuantizado.",
      "Implementa un router que dirija requests según complejidad.",
      "Configura fallback bidireccional: local → cloud y cloud → local.",
    ],
    erroresComunes: [
      "Esperar calidad de GPT-4 de un modelo de 7B.",
      "No medir latencia real en tu hardware antes de elegir modelo.",
      "No tener fallback cuando el modelo local no responde con calidad suficiente.",
    ],
    resultadoEsperado:
      "Pipeline híbrido funcional que ahorra 40%+ en costos con fallback automático.",
  },
  deployment: {
    resumen:
      "Llevarás tu app con IA a producción con caching, rate limiting, observabilidad y resiliencia.",
    porQueImporta:
      "Un demo que funciona en local es muy diferente a un servicio en producción con miles de usuarios.",
    explicacion: [
      "La arquitectura de producción agrega capas: API Gateway, cache, rate limiter, router de modelos, y output guard.",
      "La abstracción de proveedor permite cambiar de modelo sin tocar lógica de negocio.",
      "Health checks con canary prompts detectan degradaciones antes que los usuarios.",
    ],
    pasos: [
      "Implementa caching multicapa (memoria + Redis) para 40-60% de ahorro.",
      "Configura rate limiting escalonado por plan de usuario.",
      "Agrega health checks con canary prompts y alertas accionables.",
    ],
    erroresComunes: [
      "No cachear respuestas frecuentes (desperdicio de dinero).",
      "Rate limits duros que bloquean en lugar de degradar gradualmente.",
      "Monitoreo sin runbooks: la alerta suena pero nadie sabe qué hacer.",
    ],
    resultadoEsperado:
      "App desplegada con observabilidad, controles de costo, y degradación graceful ante fallos.",
  },
  "final-project": {
    resumen:
      "Integrarás todo lo aprendido en un proyecto real con al menos 4 módulos del curso.",
    porQueImporta:
      "El proyecto final demuestra que puedes construir, asegurar y operar una aplicación con IA de principio a fin.",
    explicacion: [
      "Define alcance realista: un problema claro, usuarios definidos, y criterios de éxito medibles.",
      "La implementación sigue las prácticas del curso: evals, security, observability desde el día 1.",
      "La revisión incluye threat model, demo en vivo, y retrospectiva honesta.",
    ],
    pasos: [
      "Escribe propuesta con problema, módulos, arquitectura y milestones.",
      "Implementa el happy path, luego agrega capas: validación, cache, evals, security.",
      "Completa la revisión de seguridad y presenta con demo + retrospectiva.",
    ],
    erroresComunes: [
      "Alcance demasiado ambicioso que no se completa.",
      "Omitir security y observability por falta de tiempo.",
      "No documentar decisiones técnicas (ADRs).",
    ],
    resultadoEsperado:
      "Proyecto funcional, seguro y documentado que integra al menos 4 módulos con demo y retrospectiva.",
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
  "lab-chain-of-thought": {
    resumen: "Implementa chain-of-thought automático para descomponer problemas complejos.",
    porQueImporta:
      "CoT mejora la precisión en tareas de razonamiento al hacer explícito el proceso de pensamiento.",
    explicacion: [
      "Diseña prompts que fuercen razonamiento paso a paso.",
      "Combina CoT con few-shot para máximo rendimiento.",
    ],
    pasos: [
      "Crea un prompt CoT para debugging de código.",
      "Evalúa mejora vs zero-shot en 10 casos.",
      "Implementa CoT + JSON output para respuestas parseables.",
    ],
    erroresComunes: [
      "Esperar que CoT funcione sin ejemplos de referencia.",
      "No validar que el razonamiento sea coherente con la respuesta final.",
    ],
    resultadoEsperado: "Sistema que descompone problemas complejos con razonamiento verificable.",
  },
  "lab-ide-speedrun": {
    resumen: "Completa tareas de programación a máxima velocidad usando asistentes IA.",
    porQueImporta: "Mide el impacto real de las herramientas IA en tu productividad diaria.",
    explicacion: [
      "Compara tu velocidad con y sin asistente IA en tareas idénticas.",
      "Identifica en qué tareas la IA ayuda más y en cuáles estorba.",
    ],
    pasos: [
      "Configura 5 tareas de programación con cronómetro.",
      "Complétalas primero sin IA, luego con IA.",
      "Documenta tiempos y calidad de código en ambos casos.",
    ],
    erroresComunes: [
      "Confiar ciegamente en el código generado sin revisarlo.",
      "No medir la calidad del resultado, solo la velocidad.",
    ],
    resultadoEsperado: "Métricas de productividad con/sin IA y estrategia de uso óptimo.",
  },
  "lab-mcp-server": {
    resumen: "Construye tu primer servidor MCP funcional con tools y resources.",
    porQueImporta: "MCP es el estándar para exponer herramientas a modelos de IA como Claude.",
    explicacion: [
      "Usa el SDK oficial para crear un servidor con stdio transport.",
      "Define tools con schemas Zod y manejo de errores robusto.",
    ],
    pasos: [
      "Instala @modelcontextprotocol/sdk y crea el servidor base.",
      "Agrega 2 tools (buscar código, listar TODOs) y 1 resource (README).",
      "Conecta a Claude Desktop y verifica que las tools funcionan.",
    ],
    erroresComunes: [
      "Usar console.log para debug (interfiere con el protocolo stdio).",
      "No validar inputs de los tools antes de ejecutar acciones.",
    ],
    resultadoEsperado: "Servidor MCP funcional conectado a Claude Desktop con tools verificados.",
  },
  "lab-agent-loop": {
    resumen: "Crea un agente autónomo con loop ReAct, guardrails y límite de pasos.",
    porQueImporta: "Un agente sin controles es un riesgo. Aprende a construir agentes seguros.",
    explicacion: [
      "Implementa el patrón Thought → Action → Observation en un loop controlado.",
      "Agrega maxSteps, timeout y detección de loops repetitivos.",
    ],
    pasos: [
      "Implementa el loop agéntico con tools mock (readFile, searchCode, runTests).",
      "Agrega safety config: max 10 pasos, timeout 5 min, tools permitidos.",
      "Implementa detección de loops: aborta si repite la misma acción 3 veces.",
    ],
    erroresComunes: [
      "No limitar pasos (el agente puede correr infinitamente).",
      "No manejar errores de tools dentro del loop.",
    ],
    resultadoEsperado: "Agente que completa tareas de desarrollo con guardrails verificables.",
  },
  "lab-ollama-setup": {
    resumen: "Instala Ollama, ejecuta modelos cuantizados y mide rendimiento en tu hardware.",
    porQueImporta: "Saber correr modelos locales te da independencia y privacidad total.",
    explicacion: [
      "Ollama simplifica la ejecución de modelos locales a un solo comando.",
      "Mide tokens/segundo y calidad para elegir el modelo óptimo para tu hardware.",
    ],
    pasos: [
      "Instala Ollama y descarga 2 modelos (general + código).",
      "Benchmark: mide tokens/s con prompts de diferente longitud.",
      "Compara calidad de respuestas entre modelos con 5 tareas estándar.",
    ],
    erroresComunes: [
      "Descargar modelos demasiado grandes para tu VRAM/RAM.",
      "No cerrar otras aplicaciones que consumen GPU durante el benchmark.",
    ],
    resultadoEsperado: "Reporte de benchmark con tokens/s, calidad y modelo recomendado para tu hardware.",
  },
  "lab-cost-optimizer": {
    resumen: "Diseña una estrategia de caching y routing que reduzca costos un 70%.",
    porQueImporta: "En producción, los costos de LLM pueden escalar rápidamente sin optimización.",
    explicacion: [
      "Combina cache exacto, cache semántico y routing por complejidad.",
      "Mide savings reales comparando costo con vs sin optimización.",
    ],
    pasos: [
      "Implementa cache multicapa (L1 memoria, L2 semántico).",
      "Agrega router que envíe queries simples a modelo barato.",
      "Simula 1000 requests y calcula ahorro total.",
    ],
    erroresComunes: [
      "Cache sin TTL que sirve datos obsoletos.",
      "Optimizar costo a expensas de calidad sin medir el impacto.",
    ],
    resultadoEsperado: "Pipeline optimizado con 70%+ de reducción de costos documentada.",
  },
  "lab-full-stack-ai": {
    resumen: "Construye y despliega una app completa con LLM, seguridad y observabilidad.",
    porQueImporta: "Integra todos los módulos del curso en un proyecto funcional de principio a fin.",
    explicacion: [
      "La app incluye: frontend (chat UI), backend (pipeline IA), y observabilidad.",
      "Sigue el checklist de producción: evals, security, caching, rate limiting.",
    ],
    pasos: [
      "Define el proyecto: problema, usuarios, arquitectura.",
      "Implementa core → guardrails → evals → security → observability.",
      "Despliega con health checks, canary prompt y dashboard de métricas.",
    ],
    erroresComunes: [
      "Intentar construir todo de una vez sin iteraciones.",
      "Omitir seguridad y observabilidad por falta de tiempo.",
    ],
    resultadoEsperado:
      "App desplegada y funcional con demo, métricas y documentación de decisiones.",
  },
  "lab-mcp-secure": {
    resumen: "Construye un servidor MCP con RBAC, scopes y auditoría completa.",
    porQueImporta: "Las tools MCP sin control de acceso son un vector de ataque directo.",
    explicacion: [
      "Cada tool tiene permisos por rol: viewer solo lee, developer puede crear, admin puede borrar.",
      "Toda invocación queda en audit log con timestamp, usuario, parámetros y resultado.",
    ],
    pasos: [
      "Define permisos por tool: read, write, delete con roles asociados.",
      "Implementa middleware que verifica permisos antes de ejecutar.",
      "Agrega audit logging y detección de intentos denegados consecutivos.",
    ],
    erroresComunes: [
      "RBAC solo en el frontend (el backend no verifica).",
      "Audit log que incluye datos sensibles como tokens o passwords.",
    ],
    resultadoEsperado:
      "Servidor MCP con permisos granulares, auditoría y alerta por accesos sospechosos.",
  },
  "lab-agent-patterns": {
    resumen: "Implementa un agente DevOps que planifica, ejecuta y pide aprobación humana.",
    porQueImporta: "Los agentes de producción necesitan control humano para acciones de alto impacto.",
    explicacion: [
      "El agente investiga (lectura), propone un plan, y espera aprobación para acciones de escritura.",
      "Implementa self-checks: el agente verifica su propio trabajo antes de presentarlo.",
    ],
    pasos: [
      "Diseña el flujo: investigar → planificar → aprobar → ejecutar → verificar.",
      "Implementa human-in-the-loop como función async que espera input.",
      "Agrega resumen de acciones tomadas al finalizar cada tarea.",
    ],
    erroresComunes: [
      "Saltar la aprobación humana para 'ir más rápido'.",
      "No dar suficiente contexto al humano para tomar la decisión de aprobación.",
    ],
    resultadoEsperado:
      "Agente DevOps que resuelve tareas de CI con supervisión humana y audit trail completo.",
  },
};
