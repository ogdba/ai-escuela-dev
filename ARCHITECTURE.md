Escuela IA para Desarrolladores — Arquitectura

## Capas principales

- **App Router (Next.js 16)**: `src/app/page.tsx` compone toda la landing con secciones reutilizables y anclas para navegación. Layout en `src/app/layout.tsx` aplica fuentes Geist, metadatos y theming global.
- **Componentes**:
  - `Navbar` (anclajes y selector de tema),
  - `Hero` (hero animado),
  - `SectionHeader` (encabezado reutilizable),
  - `ContactForm` (validación cliente),
  - `ThemeProvider` (modo claro/oscuro persistente).
- **Contenido i18n**: `src/content/es.ts` concentra textos, planes, labs, OWASP LLM Top 10 y CTA. Los componentes leen directamente de estas constantes para facilitar traducción futura.
- **Utilidades**: `src/lib/utils.ts` (`cn`) y `src/lib/validators.ts` (validación de formulario y helpers).

## Estilo y UX

- **Tailwind v4** (inline preset) para tokens de diseño, con gradientes de fondo globales en `src/app/globals.css`.
- **Framer Motion** para animaciones suaves en secciones clave.
- **Lucide** para iconografía ligera.

## Routing y navegación

- Navegación in-page mediante anclas (`#curriculum`, `#modules`, `#labs`, `#security`, `#pricing`, `#faq`, `#cta`, `#contact`).
- `Navbar` fijo con `backdrop-blur`; `Hero` incluye padding superior para compensar la barra.

## Tests

- **Unit (Vitest + RTL)**: pruebas para utilidades, validadores y `SectionHeader` en `tests/`.
- **E2E (Playwright)**: `e2e/home.spec.ts` valida renderizado y visibilidad de secciones clave.

## Build y seguridad

- `npm run build` ejecuta `next build`.
- Seguridad: scripts `security`, `security:semgrep`, `security:audit`; sección OWASP LLM Top 10 en UI y controles reflejados en `SECURITY.md`.
