export interface Novedad {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  fuente: string;
  fuente_url: string;
  autor: string;
  fecha: string;
  tags: string[];
}

export const NOVEDADES: Novedad[] = [
  {
    id: "mcp-servers-claude-2026",
    titulo: "Los 35 mejores servidores MCP que convierten a Claude en una maquina de productividad",
    resumen: "Una guia de los servidores MCP mas utiles para conectar Claude con herramientas externas: busqueda web, bases de datos, navegadores, GitHub, Slack, y mas.",
    contenido: `## Que es un servidor MCP y por que importa

El Protocolo de Contexto de Modelo (MCP) es una forma de conectar a Claude con herramientas y fuentes de informacion externas. En lugar de solo responder preguntas con su conocimiento interno, Claude puede buscar en internet, consultar bases de datos, automatizar tareas en el navegador y mucho mas. Para los directores que ya usan Claude en su trabajo diario, esto representa un salto importante en productividad.

## Herramientas de busqueda y navegacion

Entre los servidores mas populares destacan **Brave Search** y **Tavily**, que permiten a Claude consultar informacion actualizada en internet en tiempo real. **Puppeteer** y **Playwright** van un paso mas alla: permiten que Claude navegue paginas web de forma automatica, rellene formularios y extraiga datos de sitios que normalmente requeririan hacerlo a mano.

## Gestion de documentos y datos

**Filesystem** es uno de los mas utiles para trabajo institucional: permite a Claude leer, crear y organizar archivos directamente en tu computadora. **SQLite** y **PostgreSQL** conectan a Claude con bases de datos, ideal para quienes manejan informacion estructurada como registros, estadisticas o expedientes. **Google Drive** y **Notion** permiten trabajar directamente con documentos almacenados en la nube.

## Desarrollo y automatizacion

Para equipos de tecnologia, **GitHub** conecta a Claude con repositorios de codigo fuente, mientras que **Docker** permite gestionar entornos de desarrollo. **Sentry** facilita el monitoreo de errores en aplicaciones. Aunque estos son mas tecnicos, muestran el potencial de MCP para automatizar procesos completos de trabajo.

## Comunicacion y productividad

**Slack** permite que Claude lea y envie mensajes en canales de comunicacion interna. **Linear** y **Jira** conectan con sistemas de gestion de tareas y proyectos. **Gmail** abre la posibilidad de que Claude ayude a redactar, clasificar y responder correos de forma inteligente.

## Infraestructura y servicios en la nube

Servidores como **AWS**, **Cloudflare** y **Vercel** permiten a Claude interactuar con servicios de infraestructura digital. Para instituciones con presencia en linea o sistemas propios, esto puede simplificar enormemente la administracion tecnica sin necesidad de conocimientos especializados.

## Reflexion para directores

Lo mas valioso de este ecosistema no es la cantidad de herramientas, sino la posibilidad de personalizar Claude para las necesidades especificas de cada area. Un director que maneja estadisticas puede conectar Claude con sus bases de datos; uno que coordina equipos puede integrarlo con su sistema de tareas. El potencial es significativo y seguira creciendo.`,
    fuente: "X (@zodchiii)",
    fuente_url: "https://x.com/zodchiii/status/2041804097628582294",
    autor: "darkzodchi",
    fecha: "2026-04-08",
    tags: ["MCP", "Claude", "Herramientas", "Productividad"],
  },
  {
    id: "plugins-claude-code-2026",
    titulo: "Los 36 mejores plugins de Claude Code que vale la pena instalar",
    resumen: "Una guia completa de las extensiones mas utiles para Claude Code: desarrollo frontend, calidad de codigo, automatizacion, integraciones y herramientas de negocio.",
    contenido: `## Claude Code y su ecosistema de plugins

Claude Code es la herramienta de Anthropic que permite programar con asistencia de inteligencia artificial directamente desde la terminal o el editor de codigo. Lo que muchos no saben es que cuenta con un ecosistema creciente de plugins que amplian sus capacidades de forma considerable. Esta guia resume los mas relevantes, incluyendo algunos utiles para equipos institucionales aunque no sean desarrolladores.

## Desarrollo web y frontend

En el area de desarrollo de interfaces, destacan plugins como **shadcn/ui**, que facilita la creacion de componentes visuales modernos, y **Tailwind CSS**, ampliamente usado para dar estilo a aplicaciones web. **Next.js** y **React** tambien tienen integraciones directas, acelerando el desarrollo de paginas y portales institucionales.

## Calidad de codigo y buenas practicas

**ESLint** y **Prettier** son plugins que ayudan a mantener el codigo limpio y consistente, algo crucial cuando varios desarrolladores trabajan en un mismo proyecto. **TypeScript** anade tipado estatico que reduce errores antes de que ocurran. Estos plugins convierten a Claude Code en un revisor de codigo automatico que sigue estandares profesionales.

## Automatizacion y pruebas

**Playwright** y **Vitest** permiten automatizar pruebas de software, verificando que las aplicaciones funcionen correctamente antes de publicarlas. **Storybook** facilita la documentacion visual de componentes. Para equipos de TI institucionales, esto reduce el tiempo de revision manual y mejora la confiabilidad de los sistemas.

## Busqueda e integraciones

**Perplexity** y **Exa** conectan a Claude Code con motores de busqueda inteligentes, mientras que **GitHub** y **GitLab** integran el control de versiones directamente en el flujo de trabajo. Plugins como **Supabase** y **Firebase** conectan proyectos con bases de datos en la nube de forma rapida.

## DevOps y despliegue

**Vercel**, **Railway** y **Docker** facilitan publicar y mantener aplicaciones en funcionamiento. Estos plugins son especialmente relevantes para equipos que administran sistemas propios y necesitan un ciclo rapido de actualizaciones y correcciones.

## Herramientas de negocio e institucionales

Quiza lo mas relevante para directores: plugins como **Notion**, **Linear** y **Stripe** conectan el trabajo de desarrollo con herramientas de gestion y administracion. Esto permite que Claude Code no solo ayude a escribir codigo, sino que entienda el contexto institucional en el que ese codigo va a operar.

## Conclusion

Claude Code con los plugins correctos se convierte en mucho mas que un asistente de programacion. Es una plataforma integral que conecta el desarrollo de software con los procesos reales de la organizacion. Para instituciones publicas como el PJENL, esto puede traducirse en sistemas mas rapidos de desarrollar, mas faciles de mantener y mejor alineados con las necesidades operativas.`,
    fuente: "X (@zodchiii)",
    fuente_url: "https://x.com/zodchiii/status/2042529018260656555",
    autor: "darkzodchi",
    fecha: "2026-04-10",
    tags: ["Claude Code", "Plugins", "Herramientas", "Productividad"],
  },
];
