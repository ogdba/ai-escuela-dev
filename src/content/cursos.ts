export interface Curso {
  id: string;
  numero: number;
  titulo: string;
  descripcion: string;
  url: string;
  nivel: "basico" | "intermedio" | "avanzado";
  duracion?: string;
  gratuito: boolean;
}

export const CURSOS: Curso[] = [
  {
    id: "claude-101",
    numero: 1,
    titulo: "Claude 101",
    descripcion: "Aprende a usar Claude para tareas cotidianas de trabajo. Cubre las funciones principales y recursos para aprendizaje avanzado.",
    url: "https://anthropic.skilljar.com/claude-101",
    nivel: "basico",
    gratuito: true,
  },
  {
    id: "ai-fluency",
    numero: 2,
    titulo: "AI Fluency: Framework & Foundations",
    descripcion: "Aprende a colaborar con sistemas de IA de manera efectiva, eficiente, etica y segura. Marcos de referencia y fundamentos.",
    url: "https://anthropic.skilljar.com/ai-fluency-framework-foundations",
    nivel: "basico",
    gratuito: true,
  },
  {
    id: "agent-skills",
    numero: 3,
    titulo: "Introduction to Agent Skills",
    descripcion: "Aprende a construir, configurar y compartir Skills en Claude Code — instrucciones reutilizables que Claude aplica automaticamente a las tareas correctas.",
    url: "https://anthropic.skilljar.com/introduction-to-agent-skills",
    nivel: "intermedio",
    gratuito: true,
  },
  {
    id: "claude-api",
    numero: 4,
    titulo: "Building with the Claude API",
    descripcion: "Curso integral que cubre todo el espectro de trabajo con modelos de Anthropic usando la API de Claude.",
    url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
    nivel: "intermedio",
    gratuito: true,
  },
  {
    id: "claude-code",
    numero: 5,
    titulo: "Claude Code in Action",
    descripcion: "Recorrido practico de como usar Claude Code para acelerar tu flujo de trabajo de desarrollo.",
    url: "https://anthropic.skilljar.com/claude-code-in-action",
    nivel: "intermedio",
    gratuito: true,
  },
  {
    id: "mcp-intro",
    numero: 6,
    titulo: "Introduction to Model Context Protocol",
    descripcion: "Aprende a construir servidores y clientes MCP desde cero usando Python. Domina las tres primitivas principales: herramientas, recursos y prompts.",
    url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
    nivel: "avanzado",
    gratuito: true,
  },
  {
    id: "mcp-advanced",
    numero: 7,
    titulo: "MCP: Advanced Topics",
    descripcion: "Profundiza en las funciones avanzadas de MCP: sampling, notificaciones e implementaciones de transporte para servidores MCP en produccion.",
    url: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics",
    nivel: "avanzado",
    gratuito: true,
  },
];
