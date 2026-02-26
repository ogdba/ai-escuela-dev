Seguridad — Escuela IA para Desarrolladores

## Alcance

Landing marketing (Next.js App Router) con endpoint de contacto (`/api/contact`) que almacena envíos en JSONL local en desarrollo. Riesgos principales: manipulación de contenido, abuso del formulario de contacto, fuga de datos, dependencias y despliegues.

## Threat model (alto nivel)

- **Activos**: contenido del landing, datos del formulario (nombre, email, mensaje), pipeline de build/deploy, integridad visual del sitio, archivo `data/contact-submissions.jsonl` en dev.
- **Actores**: visitantes anónimos, bots de spam, atacantes intentando XSS/HTML injection, actores de cadena de suministro (npm), operadores de despliegue.
- **Superficies**: campos `name`, `email`, `message`, endpoint `/api/contact`, dependencias npm, scripts de build, almacenamiento local (tema y JSONL dev).

## Controles implementados

- Validación cliente y servidor (`src/lib/validators.ts`, `src/lib/contact.ts`, `src/app/api/contact/route.ts`).
- Normalización y trim de entradas; regex de email; longitud mínima/máxima; `message` limitado a 2k chars.
- Almacenamiento local en JSONL solo en desarrollo con nota explícita de que es efímero en serverless; se requiere datastore duradero en prod.
- UI muestra ticket ID para trazabilidad y evita reenvíos.
- Scripts de seguridad: `npm run security:semgrep` (config auto) y `npm audit --audit-level=moderate`.
- Linting y tests automáticos (unit + e2e) integrables en CI.
- Theme persistence solo en `localStorage` (sin datos sensibles).

## OWASP LLM Top 10 → Mitigaciones sugeridas

- **LLM01 Prompt Injection**: plantillas de contexto, sanitización de entrada, validación de salida, filtros.
- **LLM02 Manejo inseguro de salidas**: escapar/validar HTML, allowlists, aislar ejecución (sandboxes).
- **LLM03 Envenenamiento de datos**: control de procedencia, escaneo automático de datasets, pruebas canarias, firmas.
- **LLM04 DoS**: rate limiting, cuotas por usuario, timeouts, límites de tokens y tamaño de entrada.
- **LLM05 Cadena de suministro**: versiones fijas, SBOM, verificación de firmas, escáneres de dependencias (npm audit/Semgrep).
- **LLM06 Divulgación de información**: clasificación de datos, redacción autom/regex, DLP antes de responder, minimizar prompts con datos sensibles.
- **LLM07 Plugins inseguros**: mínimo privilegio, scopes, revisión de APIs, autenticación fuerte, logs/auditoría.
- **LLM08 Agencia excesiva**: guardrails, políticas de detención, simulaciones, aprobación humana para acciones sensibles.
- **LLM09 Sobre-dependencia**: human-in-the-loop, métricas de confianza, redundancia con reglas tradicionales, alertas de baja confianza.
- **LLM10 Robo de modelo**: rate limiting, watermarking, monitoreo de patrones de extracción, respuestas perturbadas/noise para consultas sospechosas.

## Operativa recomendada

- Ejecutar `npm run format && npm run lint && npm run test:unit && npm run test:e2e` antes de deploy.
- Ejecutar `npm run security` en CI; si Semgrep no está disponible, revisar resultado de `npm audit`.
- Desplegar con variables de entorno mínimas y solo las necesarias; mover almacenamiento de contacto a DB/queue en prod.
- Habilitar HTTPS, CSP restrictiva y headers de seguridad en la plataforma de hosting (Vercel u otra).
