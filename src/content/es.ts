// =============================================================================
// Escuela IA para Desarrolladores – Spanish content constants (i18n-ready)
// =============================================================================

export const SITE = {
  name: "Escuela IA para Desarrolladores",
  tagline: "Domina la Inteligencia Artificial aplicada al desarrollo de software",
  description:
    "Aprende desde los fundamentos de los LLM hasta el desarrollo agéntico, seguridad con OWASP LLM Top 10 y despliegue de modelos locales. Curso práctico con laboratorios gamificados.",
  cta: "Comienza tu viaje",
  ctaSecondary: "Ver currículum",
} as const;

export const NAV = {
  home: "Inicio",
  curriculum: "Currículum",
  modules: "Módulos",
  labs: "Laboratorios",
  pricing: "Planes",
  faq: "FAQ",
  contact: "Contacto",
} as const;

export const HERO = {
  badge: "Nuevo: Módulo de Seguridad OWASP LLM Top 10",
  title: "Aprende IA aplicada al",
  titleHighlight: "desarrollo de software",
  subtitle:
    "De cero a experto: comprende cómo funcionan los LLMs, domina el prompt engineering, construye agentes autónomos y protege tus aplicaciones con las mejores prácticas de seguridad.",
  cta: "Inscríbete ahora",
  ctaSecondary: "Explorar módulos",
  stats: [
    { value: "8", label: "Módulos" },
    { value: "40+", label: "Laboratorios" },
    { value: "100%", label: "Práctico" },
    { value: "ES", label: "En español" },
  ],
} as const;

export const CURRICULUM_SECTION = {
  title: "Currículum",
  subtitle: "Ruta de aprendizaje",
  description:
    "Un camino estructurado desde principiante hasta avanzado. Cada módulo incluye teoría, práctica y un proyecto integrador.",
  levels: [
    {
      name: "Principiante",
      color: "emerald",
      modules: ["Fundamentos de LLMs", "Prompt Engineering"],
    },
    {
      name: "Intermedio",
      color: "blue",
      modules: ["Herramientas para Desarrolladores", "Protocolo MCP y Agentes"],
    },
    {
      name: "Avanzado",
      color: "purple",
      modules: ["Seguridad IA (OWASP)", "Modelos Locales", "Despliegue y Producción"],
    },
    {
      name: "Experto",
      color: "amber",
      modules: ["Proyecto Final Integrador"],
    },
  ],
} as const;

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  topics: string[];
  project: string;
  checklist: string[];
  icon: string;
}

export const MODULES: Module[] = [
  {
    id: "llm-fundamentals",
    number: 1,
    title: "Fundamentos de LLMs",
    description:
      "Comprende cómo los modelos de lenguaje predicen tokens, manejan contexto y generan respuestas. Conoce las fases de entrenamiento y los costos asociados.",
    topics: [
      "Predicción de tokens y cómo funciona un LLM",
      "Ventana de contexto y sus limitaciones",
      "Costos por tokens: entrada vs salida",
      "Fases de entrenamiento: pretraining, fine-tuning, RLHF",
      "Calidad del prompting y su impacto",
      "Temperatura, top-p y otros parámetros",
    ],
    project: "Construir un analizador de costos de tokens para diferentes modelos",
    checklist: [
      "Puedo explicar qué es un token",
      "Entiendo la diferencia entre pretraining y fine-tuning",
      "Sé calcular costos aproximados de una consulta a un LLM",
      "Puedo describir qué es RLHF y por qué importa",
    ],
    icon: "Brain",
  },
  {
    id: "prompt-engineering",
    number: 2,
    title: "Prompt Engineering",
    description:
      "Domina las técnicas de prompting desde básicas hasta avanzadas. Aprende a obtener resultados consistentes y de alta calidad de cualquier LLM.",
    topics: [
      "Anatomía de un prompt efectivo",
      "Zero-shot, few-shot y chain-of-thought",
      "System prompts y roles",
      "Técnicas avanzadas: ReAct, Tree of Thought",
      "Evaluación y mejora iterativa de prompts",
      "Plantillas reutilizables y best practices",
    ],
    project: "Crear una librería de prompts optimizados para tareas de desarrollo",
    checklist: [
      "Puedo escribir prompts con few-shot examples",
      "Entiendo cuándo usar chain-of-thought",
      "Sé crear system prompts efectivos",
      "Puedo evaluar y mejorar prompts iterativamente",
    ],
    icon: "MessageSquare",
  },
  {
    id: "dev-tools",
    number: 3,
    title: "Herramientas para Desarrolladores",
    description:
      "Conoce y domina las herramientas de IA que potencian tu flujo de trabajo como desarrollador: asistentes en el IDE, agentes de terminal y más.",
    topics: [
      "VS Code + GitHub Copilot",
      "Cursor IDE: flujo agéntico",
      "Claude Code: agente de terminal",
      "OpenCode y alternativas open-source",
      "NotebookLM para investigación",
      "Comparativa y cuándo usar cada herramienta",
    ],
    project: "Configurar un entorno de desarrollo completo con IA integrada",
    checklist: [
      "Tengo configurado al menos un asistente IA en mi IDE",
      "Puedo usar Claude Code para tareas complejas",
      "Entiendo las diferencias entre herramientas",
      "Sé cuándo usar cada herramienta según el caso",
    ],
    icon: "Wrench",
  },
  {
    id: "mcp-agents",
    number: 4,
    title: "Protocolo MCP y Agentes",
    description:
      "Comprende el Model Context Protocol, el desarrollo agéntico con bucles autónomos, y la diferencia entre MCP y Agent Skills.",
    topics: [
      "¿Qué es MCP (Model Context Protocol)?",
      "MCP vs Agent Skills: cuándo usar cada uno",
      "Bucles agénticos y autonomía controlada",
      "Herramientas (tools) y recursos (resources)",
      "Servidores MCP: construcción e integración",
      "Patrones de orquestación multi-agente",
    ],
    project: "Construir un servidor MCP funcional con herramientas personalizadas",
    checklist: [
      "Puedo explicar qué es MCP y su propósito",
      "Entiendo la diferencia entre tools y resources",
      "Puedo construir un servidor MCP básico",
      "Sé diseñar un flujo agéntico con guardrails",
    ],
    icon: "Network",
  },
  {
    id: "ai-security",
    number: 5,
    title: "Seguridad IA — OWASP LLM Top 10",
    description:
      "Aprende a proteger tus aplicaciones de IA contra las vulnerabilidades más críticas definidas por OWASP. Incluye patrones defensivos prácticos.",
    topics: [
      "LLM01: Inyección de Prompt (directa e indirecta)",
      "LLM02: Manejo inseguro de salidas",
      "LLM03: Envenenamiento de datos de entrenamiento",
      "LLM04: Denegación de servicio en modelos",
      "LLM05: Vulnerabilidades de la cadena de suministro",
      "LLM06: Divulgación de información sensible",
      "LLM07: Diseño inseguro de plugins",
      "LLM08: Agencia excesiva",
      "LLM09: Sobre-dependencia",
      "LLM10: Robo de modelos",
      "Patrones defensivos: rails, validación, sandboxing",
      "Threat modeling para aplicaciones con LLM",
    ],
    project: "Auditoría de seguridad completa de una aplicación con LLM integrado",
    checklist: [
      "Puedo identificar los 10 riesgos de OWASP LLM",
      "Sé implementar defensas contra prompt injection",
      "Puedo validar y sanitizar salidas de LLM",
      "Entiendo cómo hacer threat modeling para IA",
    ],
    icon: "Shield",
  },
  {
    id: "local-models",
    number: 6,
    title: "Modelos Locales",
    description:
      "Ejecuta modelos de IA en tu propia máquina. Aprende sobre Ollama, cuantización, y cuándo usar modelos locales vs APIs en la nube.",
    topics: [
      "¿Por qué ejecutar modelos localmente?",
      "Ollama: instalación y uso",
      "Cuantización: GGUF, GPTQ, AWQ",
      "Selección de modelos según hardware",
      "Integración con herramientas de desarrollo",
      "Privacidad y compliance con modelos locales",
    ],
    project: "Configurar un pipeline de desarrollo completo con modelos locales",
    checklist: [
      "Tengo Ollama instalado y funcionando",
      "Puedo ejecutar modelos cuantizados",
      "Sé elegir el modelo adecuado para mi hardware",
      "Entiendo los trade-offs local vs nube",
    ],
    icon: "HardDrive",
  },
  {
    id: "deployment",
    number: 7,
    title: "Despliegue y Producción",
    description:
      "Lleva tus aplicaciones con IA a producción. Aprende sobre observabilidad, gestión de costos, caching, rate limiting y mejores prácticas.",
    topics: [
      "Arquitectura de producción para apps con LLM",
      "Gestión de costos y presupuestos",
      "Caching inteligente de respuestas",
      "Rate limiting y protección de APIs",
      "Observabilidad: logs, métricas, trazas",
      "CI/CD con validaciones de IA",
    ],
    project: "Desplegar una aplicación completa con LLM, observabilidad y controles de costo",
    checklist: [
      "Puedo diseñar una arquitectura de producción con LLM",
      "Sé implementar caching para reducir costos",
      "Entiendo cómo monitorear aplicaciones con IA",
      "Puedo configurar rate limiting efectivo",
    ],
    icon: "Rocket",
  },
  {
    id: "final-project",
    number: 8,
    title: "Proyecto Final Integrador",
    description:
      "Aplica todo lo aprendido en un proyecto real que integra LLMs, agentes, seguridad y despliegue. Presenta tu solución ante la comunidad.",
    topics: [
      "Definición de alcance y requisitos",
      "Diseño de arquitectura",
      "Implementación con buenas prácticas",
      "Revisión de seguridad",
      "Despliegue y demostración",
      "Retrospectiva y próximos pasos",
    ],
    project: "Proyecto libre que integre al menos 4 módulos del curso",
    checklist: [
      "Mi proyecto usa LLMs de manera efectiva",
      "Implementé medidas de seguridad",
      "El proyecto está desplegado y funcionando",
      "Documenté decisiones y aprendizajes",
    ],
    icon: "Trophy",
  },
];

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: "fácil" | "medio" | "difícil" | "experto";
  duration: string;
  module: string;
  tags: string[];
}

export const LABS: Lab[] = [
  {
    id: "lab-token-counter",
    title: "🔢 Contador de Tokens",
    description:
      "Construye un contador visual de tokens que muestre costos en tiempo real para diferentes modelos.",
    difficulty: "fácil",
    duration: "30 min",
    module: "llm-fundamentals",
    tags: ["tokens", "costos", "UI"],
  },
  {
    id: "lab-prompt-arena",
    title: "⚔️ Arena de Prompts",
    description:
      "Compite contra otros estudiantes optimizando prompts para obtener la mejor respuesta en menos tokens.",
    difficulty: "medio",
    duration: "45 min",
    module: "prompt-engineering",
    tags: ["prompting", "competencia", "optimización"],
  },
  {
    id: "lab-chain-of-thought",
    title: "🧠 Cadena de Pensamiento",
    description:
      "Implementa un sistema que descompone problemas complejos usando chain-of-thought automático.",
    difficulty: "medio",
    duration: "60 min",
    module: "prompt-engineering",
    tags: ["CoT", "razonamiento", "avanzado"],
  },
  {
    id: "lab-ide-speedrun",
    title: "⚡ Speedrun de IDE",
    description:
      "Completa un set de tareas de programación lo más rápido posible usando asistentes IA. ¡Cronómetro incluido!",
    difficulty: "fácil",
    duration: "20 min",
    module: "dev-tools",
    tags: ["velocidad", "productividad", "IDE"],
  },
  {
    id: "lab-mcp-server",
    title: "🔌 Tu Primer Servidor MCP",
    description:
      "Construye un servidor MCP que exponga datos de tu sistema como herramientas para Claude.",
    difficulty: "difícil",
    duration: "90 min",
    module: "mcp-agents",
    tags: ["MCP", "servidor", "tools"],
  },
  {
    id: "lab-agent-loop",
    title: "🤖 Bucle Agéntico",
    description:
      "Crea un agente que planifique, ejecute y verifique tareas de manera autónoma con guardrails.",
    difficulty: "difícil",
    duration: "120 min",
    module: "mcp-agents",
    tags: ["agentes", "autonomía", "guardrails"],
  },
  {
    id: "lab-prompt-injection",
    title: "🛡️ Defensa contra Prompt Injection",
    description:
      "Ataca y defiende: intenta inyectar prompts en una app y luego implementa defensas efectivas.",
    difficulty: "difícil",
    duration: "60 min",
    module: "ai-security",
    tags: ["seguridad", "injection", "OWASP"],
  },
  {
    id: "lab-output-sanitizer",
    title: "🧹 Sanitizador de Salidas",
    description:
      "Construye un pipeline que valide y sanitice todas las salidas de un LLM antes de mostrarlas al usuario.",
    difficulty: "medio",
    duration: "45 min",
    module: "ai-security",
    tags: ["sanitización", "XSS", "validación"],
  },
  {
    id: "lab-threat-model",
    title: "🎯 Threat Modeling IA",
    description:
      "Realiza un análisis completo de amenazas para una aplicación ficticia que usa múltiples LLMs.",
    difficulty: "experto",
    duration: "90 min",
    module: "ai-security",
    tags: ["threat-model", "análisis", "seguridad"],
  },
  {
    id: "lab-ollama-setup",
    title: "🏠 Laboratorio Local",
    description:
      "Instala Ollama, descarga modelos cuantizados y mide el rendimiento en tu hardware.",
    difficulty: "fácil",
    duration: "30 min",
    module: "local-models",
    tags: ["ollama", "local", "benchmark"],
  },
  {
    id: "lab-cost-optimizer",
    title: "💰 Optimizador de Costos",
    description:
      "Diseña una estrategia de caching y routing que reduzca costos un 70% en una app real.",
    difficulty: "experto",
    duration: "90 min",
    module: "deployment",
    tags: ["costos", "caching", "optimización"],
  },
  {
    id: "lab-full-stack-ai",
    title: "🚀 App Full-Stack con IA",
    description:
      "Construye y despliega una aplicación completa que integre un LLM con seguridad y observabilidad.",
    difficulty: "experto",
    duration: "180 min",
    module: "final-project",
    tags: ["full-stack", "integración", "proyecto"],
  },
];

export const PRICING = {
  title: "Planes",
  subtitle: "Elige tu camino",
  description: "Opciones flexibles para cada tipo de estudiante.",
  plans: [
    {
      id: "self-paced",
      name: "Autodidacta",
      price: "Gratis",
      period: "",
      description: "Acceso al contenido y laboratorios básicos",
      features: [
        "Acceso a todos los módulos",
        "Laboratorios nivel fácil y medio",
        "Comunidad en Discord",
        "Checklists de progreso",
      ],
      cta: "Empezar gratis",
      highlighted: false,
    },
    {
      id: "bootcamp",
      name: "Bootcamp",
      price: "$299",
      period: "USD",
      description: "Experiencia guiada con mentoría y proyectos",
      features: [
        "Todo lo del plan Autodidacta",
        "Laboratorios avanzados y experto",
        "Mentoría grupal semanal",
        "Revisión de proyecto final",
        "Certificado de completitud",
        "Acceso anticipado a nuevo contenido",
      ],
      cta: "Inscribirme al Bootcamp",
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Empresas",
      price: "Personalizado",
      period: "",
      description: "Formación a medida para tu equipo",
      features: [
        "Todo lo del Bootcamp",
        "Contenido personalizado",
        "Mentoría 1:1 para el equipo",
        "Reportes de progreso",
        "Integración con LMS corporativo",
        "Soporte prioritario",
      ],
      cta: "Contactar ventas",
      highlighted: false,
    },
  ],
} as const;

export const FAQ_DATA = {
  title: "Preguntas Frecuentes",
  subtitle: "FAQ",
  items: [
    {
      q: "¿Necesito experiencia previa en IA o Machine Learning?",
      a: "No. El curso está diseñado para desarrolladores de software. Empezamos desde los fundamentos y avanzamos progresivamente. Lo que sí necesitas es experiencia básica en programación.",
    },
    {
      q: "¿Qué lenguajes de programación se usan?",
      a: "Principalmente TypeScript/JavaScript y Python para los ejemplos. Sin embargo, los conceptos son aplicables a cualquier lenguaje. Algunos laboratorios usan herramientas específicas como Claude Code o Cursor.",
    },
    {
      q: "¿Cuánto tiempo necesito dedicar?",
      a: "El contenido está diseñado para completarse en 8-12 semanas dedicando 5-8 horas por semana. El plan autodidacta es flexible y puedes ir a tu ritmo.",
    },
    {
      q: "¿Los laboratorios requieren GPU o hardware especial?",
      a: "La mayoría de los laboratorios funcionan en cualquier computador moderno. El módulo de Modelos Locales recomienda al menos 8GB de RAM. Para modelos más grandes, 16GB+ es ideal.",
    },
    {
      q: "¿El contenido se actualiza?",
      a: "Sí. El campo de IA evoluciona rápido y actualizamos el contenido regularmente. Los alumnos del Bootcamp reciben acceso anticipado a actualizaciones.",
    },
    {
      q: "¿Hay certificación al terminar?",
      a: "El plan Bootcamp incluye un certificado de completitud tras aprobar el proyecto final. El plan autodidacta incluye badges de progreso por cada módulo completado.",
    },
  ],
} as const;

export const CONTACT = {
  title: "¿Listo para empezar?",
  subtitle: "Contáctanos",
  description: "Déjanos tus datos y te enviaremos información sobre las próximas cohortes.",
  form: {
    name: "Nombre completo",
    email: "Correo electrónico",
    message: "Mensaje (opcional)",
    submit: "Enviar",
    success: "¡Gracias! Te contactaremos pronto.",
    errors: {
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El correo es obligatorio",
      emailInvalid: "Ingresa un correo válido",
    },
  },
} as const;

export const OWASP_LLM_TOP10 = {
  title: "Seguridad OWASP LLM Top 10",
  subtitle: "Hardening de IA",
  description:
    "Prácticas esenciales para diseñar, construir y operar aplicaciones con LLMs de forma segura. Cada riesgo incluye defensas accionables.",
  risks: [
    {
      id: "LLM01",
      name: "Prompt Injection",
      risk: "Un usuario logra que el modelo ignore las instrucciones del sistema.",
      mitigation:
        "Sanitiza entradas, usa plantillas de contexto, añade validación de salidas y filtros.",
    },
    {
      id: "LLM02",
      name: "Manejo inseguro de salidas",
      risk: "La respuesta del modelo se usa directamente en código/SQL/HTML.",
      mitigation: "Validar y escapear salidas; usar allowlists; aislar acciones peligrosas.",
    },
    {
      id: "LLM03",
      name: "Envenenamiento de datos",
      risk: "Datos de entrenamiento contaminados modifican el comportamiento del modelo.",
      mitigation: "Controlar provenance, escanear datasets, pruebas canarias y firmas.",
    },
    {
      id: "LLM04",
      name: "Denegación de servicio",
      risk: "Peticiones adversas disparan costos o latencia.",
      mitigation: "Rate limiting, cuotas por usuario, timeouts y límites de tokens.",
    },
    {
      id: "LLM05",
      name: "Cadena de suministro",
      risk: "Modelos o dependencias comprometidas.",
      mitigation: "Pin de versiones, SBOM, firmas y escáneres de dependencias.",
    },
    {
      id: "LLM06",
      name: "Divulgación de información",
      risk: "El modelo revela datos sensibles.",
      mitigation: "Clasificar datos, redactar respuestas y aplicar DLP antes de responder.",
    },
    {
      id: "LLM07",
      name: "Plugins inseguros",
      risk: "Herramientas o APIs mal diseñadas ejecutan acciones no deseadas.",
      mitigation: "Principio de mínimo privilegio, scopes y revisiones de seguridad de plugins.",
    },
    {
      id: "LLM08",
      name: "Agencia excesiva",
      risk: "Agentes autónomos actúan fuera de los límites previstos.",
      mitigation: "Guardrails, revisores humanos, simulaciones y reglas de detención.",
    },
    {
      id: "LLM09",
      name: "Sobre-dependencia",
      risk: "Decisiones críticas se delegan sin validación humana.",
      mitigation: "Human-in-the-loop, métricas de confianza y double-check automático.",
    },
    {
      id: "LLM10",
      name: "Robo de modelo",
      risk: "Exfiltración del modelo o de sus pesos.",
      mitigation: "Rate limiting, watermarking, monitoring y respuestas perturbadas.",
    },
  ],
} as const;

export const CTA = {
  title: "Construye apps con IA seguras y en producción",
  description:
    "Únete a la cohorte y aprende con proyectos reales, laboratorios gamificados y mentoría en vivo.",
  primary: "Aplicar ahora",
  secondary: "Ver plan de estudios",
} as const;

export const FOOTER = {
  copyright: "© 2026 Escuela IA para Desarrolladores. Todos los derechos reservados.",
  links: [
    { label: "Privacidad", href: "#" },
    { label: "Términos", href: "#" },
    { label: "GitHub", href: "#" },
  ],
} as const;
