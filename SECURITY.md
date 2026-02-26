Seguridad — Escuela IA para Desarrolladores

## Alcance

Landing marketing (Next.js, cliente) sin backend propio. Riesgos principales: manipulación de contenido, abuso del formulario de contacto, dependencias y despliegues.

## Threat model (alto nivel)

- **Activos**: contenido del landing, formulario de contacto (datos personales), pipeline de build/deploy, integridad visual del sitio.
- **Actores**: visitantes anónimos, bots de spam, atacantes intentando XSS/HTML injection, cadena de suministro (paquetes npm), operadores de despliegue.
- **Superficies**: campos `name`, `email`, `message`, dependencias npm, scripts de build, almacenamiento local (tema).

## Controles implementados

- Validación en cliente del formulario (`src/lib/validators.ts` + `ContactForm`).
- UI de seguridad con OWASP LLM Top 10 para concienciar y guiar mitigaciones.
- Scripts de seguridad: `npm run security` (Semgrep opcional, fallback a `npm audit --audit-level=moderate`).
- Linting y tests automáticos (unit + e2e) integrables en CI.
- Theme persistence solo en `localStorage` (sin datos sensibles).

## OWASP LLM Top 10 → Mitigaciones sugeridas

- **LLM01 Prompt Injection**: plantillas de contexto, sanitización de entrada, validación de salida, filtros de palabras clave, revisión humana en acciones críticas.
- **LLM02 Manejo inseguro de salidas**: escapar/validar HTML, allowlists para comandos/SQL, aislar ejecución (sandboxes).
- **LLM03 Envenenamiento de datos**: control de procedencia, escaneo automático de datasets, pruebas canarias, firmas criptográficas de datos/modelos.
- **LLM04 DoS**: rate limiting, cuotas por usuario, timeouts, límites de tokens y tamaño de entrada.
- **LLM05 Cadena de suministro**: versiones fijas, SBOM, verificación de firmas, escaneo de dependencias (npm audit/Semgrep).
- **LLM06 Divulgación de información**: clasificación de datos, redacción autom/regex, DLP antes de responder, minimizar prompts con datos sensibles.
- **LLM07 Plugins inseguros**: principio de mínimo privilegio, scopes, revisión de APIs, autenticación fuerte, logs/auditoría.
- **LLM08 Agencia excesiva**: guardrails, políticas de detención, simulaciones, aprobación humana para acciones sensibles.
- **LLM09 Sobre-dependencia**: human-in-the-loop, métricas de confianza, redundancia con reglas tradicionales, alertas de baja confianza.
- **LLM10 Robo de modelo**: rate limiting, watermarking, monitoreo de patrones de extracción, respuestas perturbadas/noise para consultas sospechosas.

## Operativa recomendada

- Ejecutar `npm run lint && npm run test:unit && npm run test:e2e` antes de deploy.
- Ejecutar `npm run security` en CI; si Semgrep no está disponible, revisar resultado de `npm audit`.
- Desplegar con variables de entorno mínimas y sólo las necesarias.
- Habilitar HTTPS, CSP restrictiva y headers de seguridad en la plataforma de hosting (Vercel u otra).
