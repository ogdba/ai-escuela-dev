import type { Lesson } from "./types";

export const mcpIntegrationsLessons: Lesson[] = [
  {
    id: "mcp-1-fundamentals",
    moduleId: "mcp-integrations",
    number: 1,
    title: "Model Context Protocol: fundamentos y arquitectura",
    duration: "25 min",
    objectives: [
      "Entender qué es MCP y qué problema resuelve",
      "Conocer la arquitectura cliente-servidor de MCP",
      "Diferenciar Tools, Resources y Prompts en MCP",
    ],
    sections: [
      {
        title: "¿Qué es MCP?",
        content: [
          "Model Context Protocol (MCP) es un estándar abierto para conectar modelos de IA con herramientas y datos externos.",
          "Piensa en MCP como 'USB para IA': un protocolo universal para que cualquier modelo pueda usar cualquier herramienta, sin integraciones custom.",
          "Sin MCP: cada modelo necesita una integración diferente para cada herramienta. Con MCP: un servidor MCP funciona con cualquier cliente compatible.",
        ],
        code: {
          language: "typescript",
          code: `// Arquitectura MCP
//
// ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
// │  LLM Client  │────▶│  MCP Server  │────▶│  Data Source  │
// │  (Claude,    │◀────│  (tu código) │◀────│  (DB, API,    │
// │   Cursor)    │     │              │     │   Git, etc)   │
// └──────────────┘     └──────────────┘     └──────────────┘
//
// El cliente envía requests al servidor MCP
// El servidor ejecuta la acción y devuelve resultados
// El LLM usa los resultados para generar su respuesta

// Un servidor MCP expone 3 tipos de capacidades:
interface MCPServer {
  // Tools: funciones que el modelo puede invocar
  tools: MCPTool[];

  // Resources: datos que el modelo puede leer
  resources: MCPResource[];

  // Prompts: plantillas pre-configuradas
  prompts: MCPPrompt[];
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: object; // JSON Schema para los parámetros
}

interface MCPResource {
  uri: string;         // ej: "file:///docs/readme.md"
  name: string;
  mimeType: string;
}

interface MCPPrompt {
  name: string;
  description: string;
  arguments: { name: string; required: boolean }[];
}`,
          caption: "MCP separa la lógica de acceso a datos (servidor) de la lógica de razonamiento (cliente/modelo).",
        },
      },
      {
        title: "Tools vs Resources vs Prompts",
        content: [
          "Tools: acciones que tienen efectos secundarios. Ejemplo: crear un issue en GitHub, ejecutar un query SQL, enviar un email. El modelo INVOCA tools.",
          "Resources: datos de solo lectura. Ejemplo: contenido de un archivo, resultado de un query, documentación. El modelo LEE resources.",
          "Prompts: plantillas pre-configuradas que el usuario puede activar. Ejemplo: 'analiza este repo', 'revisa este PR'. Son atajos, no herramientas.",
        ],
        code: {
          language: "typescript",
          code: `// Ejemplo: servidor MCP para gestión de issues
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "issue-manager", version: "1.0.0" });

// Tool: crear issue (tiene efecto secundario)
server.tool(
  "create_issue",
  "Crea un nuevo issue en el repositorio",
  {
    title: z.string().describe("Título del issue"),
    body: z.string().describe("Descripción del issue"),
    labels: z.array(z.string()).optional().describe("Labels a agregar"),
  },
  async ({ title, body, labels }) => {
    const issue = await github.createIssue({ title, body, labels });
    return { content: [{ type: "text", text: \`Issue #\${issue.number} creado\` }] };
  }
);

// Resource: listar issues abiertos (solo lectura)
server.resource(
  "issues://open",
  "Lista de issues abiertos",
  async () => {
    const issues = await github.listIssues({ state: "open" });
    return {
      contents: [{
        uri: "issues://open",
        mimeType: "application/json",
        text: JSON.stringify(issues, null, 2),
      }],
    };
  }
);`,
          caption: "Los Tools modifican estado, los Resources solo leen. Esta distinción es clave para seguridad.",
        },
        tip: "Empieza con Resources (bajo riesgo). Agrega Tools gradualmente con controles de seguridad.",
      },
    ],
    exercise: {
      instruction:
        "Diseña (en pseudocódigo) un servidor MCP para tu equipo que exponga: (1) 3 tools para gestión de tareas (crear, actualizar estado, asignar), (2) 2 resources para consultar datos (lista de tareas, detalles de una tarea), (3) 1 prompt template para generar reportes de sprint.",
      hints: [
        "Define el inputSchema de cada tool con Zod",
        "Los resources deben tener URIs descriptivas: tasks://open, tasks://sprint-42",
        "El prompt template debería aceptar el número de sprint como argumento",
      ],
    },
  },
  {
    id: "mcp-2-security",
    moduleId: "mcp-integrations",
    number: 2,
    title: "Seguridad en MCP: scopes, RBAC y auditoría",
    duration: "25 min",
    objectives: [
      "Implementar control de acceso granular en servidores MCP",
      "Configurar scopes y permisos por tool",
      "Auditar cada invocación de tool para trazabilidad",
    ],
    sections: [
      {
        title: "Principio de mínimo privilegio en MCP",
        content: [
          "Un servidor MCP expone herramientas que pueden tener efectos reales: borrar archivos, ejecutar SQL, crear PRs.",
          "Si un modelo es manipulado (prompt injection), usará las tools que tenga disponibles. El daño es proporcional a los permisos.",
          "Principio: cada tool solo debe tener los permisos mínimos necesarios. Un tool de 'buscar issues' NO necesita permiso para cerrarlos.",
        ],
        code: {
          language: "typescript",
          code: `// RBAC para herramientas MCP
interface ToolPermission {
  tool: string;
  scopes: string[];     // "read", "write", "delete", "admin"
  allowedRoles: string[];
  requiresApproval: boolean; // human-in-the-loop
  rateLimit: number;    // max invocaciones por minuto
}

const permissions: ToolPermission[] = [
  {
    tool: "list_issues",
    scopes: ["read"],
    allowedRoles: ["viewer", "developer", "admin"],
    requiresApproval: false,
    rateLimit: 60,
  },
  {
    tool: "create_issue",
    scopes: ["write"],
    allowedRoles: ["developer", "admin"],
    requiresApproval: false,
    rateLimit: 10,
  },
  {
    tool: "delete_issue",
    scopes: ["delete"],
    allowedRoles: ["admin"],
    requiresApproval: true, // requiere confirmación humana
    rateLimit: 5,
  },
];

function checkPermission(
  tool: string,
  userRole: string,
): { allowed: boolean; requiresApproval: boolean; reason?: string } {
  const perm = permissions.find(p => p.tool === tool);
  if (!perm) return { allowed: false, requiresApproval: false, reason: "Tool no registrado" };
  if (!perm.allowedRoles.includes(userRole)) {
    return { allowed: false, requiresApproval: false, reason: \`Rol '\${userRole}' no autorizado\` };
  }
  return { allowed: true, requiresApproval: perm.requiresApproval };
}`,
          caption: "Las acciones destructivas (delete, execute) siempre requieren aprobación humana.",
        },
      },
      {
        title: "Auditoría de invocaciones",
        content: [
          "Cada invocación de tool debe quedar registrada: quién, qué, cuándo, con qué parámetros, y qué resultado.",
          "La auditoría te permite: detectar abuso, investigar incidentes, cumplir compliance, y mejorar tu sistema.",
          "Nunca loguees datos sensibles (passwords, tokens, PII) en el audit log. Redacta antes de guardar.",
        ],
        code: {
          language: "typescript",
          code: `// Audit logger para MCP
interface AuditEntry {
  timestamp: string;
  toolName: string;
  userId: string;
  sessionId: string;
  parameters: Record<string, unknown>;
  result: "success" | "error" | "denied" | "approval-pending";
  durationMs: number;
  metadata: Record<string, string>;
}

class MCPAuditLogger {
  private entries: AuditEntry[] = [];

  async log(entry: AuditEntry) {
    // Redactar campos sensibles
    const sanitized = {
      ...entry,
      parameters: this.redactSensitive(entry.parameters),
    };
    this.entries.push(sanitized);
    // En producción: enviar a un servicio de logging (CloudWatch, Datadog, etc.)
  }

  private redactSensitive(params: Record<string, unknown>): Record<string, unknown> {
    const sensitiveKeys = ["password", "token", "secret", "key", "credential"];
    const redacted = { ...params };
    for (const key of Object.keys(redacted)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        redacted[key] = "[REDACTED]";
      }
    }
    return redacted;
  }

  // Queries útiles sobre el audit log
  recentByUser(userId: string, limit = 20): AuditEntry[] {
    return this.entries
      .filter(e => e.userId === userId)
      .slice(-limit);
  }

  deniedAttempts(since: string): AuditEntry[] {
    return this.entries.filter(
      e => e.result === "denied" && e.timestamp >= since
    );
  }
}`,
          caption: "El audit log es tu fuente de verdad para incidentes. No lo borres; archívalo.",
        },
      },
    ],
    exercise: {
      instruction:
        "Implementa un middleware de seguridad para un servidor MCP que: (1) verifique permisos antes de ejecutar cada tool, (2) aplique rate limiting por usuario, (3) registre cada intento en el audit log, (4) bloquee y alerte si detecta más de 3 intentos denegados consecutivos del mismo usuario.",
      hints: [
        "El middleware envuelve cada tool handler",
        "Usa un Map<userId, number[]> para tracking de rate limits",
        "3 denied consecutivos pueden indicar un ataque de enumeración",
      ],
    },
  },
  {
    id: "mcp-3-building",
    moduleId: "mcp-integrations",
    number: 3,
    title: "Construyendo tu primer servidor MCP",
    duration: "30 min",
    objectives: [
      "Crear un servidor MCP funcional desde cero",
      "Implementar tools con validación y manejo de errores",
      "Conectar el servidor con un cliente MCP (Claude Desktop)",
    ],
    sections: [
      {
        title: "Setup del proyecto",
        content: [
          "Un servidor MCP es un proceso Node.js que se comunica vía stdio (entrada/salida estándar) o HTTP con SSE.",
          "El SDK oficial (@modelcontextprotocol/sdk) provee las abstracciones para crear servidores y clientes.",
          "Para desarrollo: usa stdio (más simple). Para producción: usa HTTP/SSE (más escalable).",
        ],
        code: {
          language: "typescript",
          code: `// setup: npm init -y && npm install @modelcontextprotocol/sdk zod

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "dev-tools",
  version: "1.0.0",
});

// Tool: buscar en el codebase
server.tool(
  "search_code",
  "Busca un patrón en el código fuente del proyecto",
  {
    pattern: z.string().describe("Patrón regex a buscar"),
    fileType: z.string().optional().describe("Tipo de archivo (ts, js, py)"),
    maxResults: z.number().default(10).describe("Máximo de resultados"),
  },
  async ({ pattern, fileType, maxResults }) => {
    // En un caso real, ejecutarías ripgrep o similar
    const results = await searchCodebase(pattern, fileType, maxResults);
    return {
      content: [{
        type: "text",
        text: results.length > 0
          ? results.map(r => \`\${r.file}:\${r.line}: \${r.text}\`).join("\\n")
          : "No se encontraron resultados",
      }],
    };
  }
);

// Tool: ejecutar tests
server.tool(
  "run_tests",
  "Ejecuta los tests del proyecto",
  {
    testFile: z.string().optional().describe("Archivo de test específico"),
    watch: z.boolean().default(false).describe("Modo watch"),
  },
  async ({ testFile, watch }) => {
    const cmd = testFile
      ? \`npx vitest run \${testFile}\`
      : "npx vitest run";

    const result = await exec(cmd);
    return {
      content: [{ type: "text", text: result.stdout + result.stderr }],
    };
  }
);

// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server 'dev-tools' running on stdio");
}
main().catch(console.error);`,
          caption: "Usa console.error para logs del servidor (stderr). console.log es para el protocolo MCP (stdout).",
        },
      },
      {
        title: "Conectar con Claude Desktop",
        content: [
          "Claude Desktop puede usar servidores MCP locales. Configuras el servidor en el archivo de configuración de Claude.",
          "El servidor se ejecuta como un proceso hijo y se comunica vía stdio.",
          "Una vez conectado, Claude puede ver y usar las tools que expone tu servidor.",
        ],
        code: {
          language: "json",
          code: `{
  "mcpServers": {
    "dev-tools": {
      "command": "node",
      "args": ["./dist/server.js"],
      "cwd": "/path/to/your/project",
      "env": {
        "GITHUB_TOKEN": "ghp_xxx"
      }
    }
  }
}`,
          caption: "Guarda este archivo en ~/Library/Application Support/Claude/claude_desktop_config.json (macOS).",
        },
        tip: "Usa npx @modelcontextprotocol/inspector para probar tu servidor antes de conectarlo a Claude. Te da una UI para invocar tools manualmente.",
      },
    ],
    exercise: {
      instruction:
        "Crea un servidor MCP completo con: (1) un tool 'read_file' que lea archivos del proyecto (con validación de que no lea fuera del proyecto), (2) un tool 'list_todos' que busque TODO y FIXME en el código, (3) un resource que exponga el README del proyecto. Incluye manejo de errores y validación de inputs.",
      hints: [
        "Valida que el path del archivo esté dentro del directorio del proyecto (path traversal prevention)",
        "Para list_todos, usa grep/regex sobre los archivos del proyecto",
        "El resource del README es estático — léelo una vez y cachéalo",
      ],
    },
  },
];
