Escuela IA para Desarrolladores — Arquitectura

## Capas principales

- **App Router (Next.js 16)**: `src/app/page.tsx` compone la landing y nuevas secciones (Demo Sandbox, currículum, labs, pricing, FAQ, contacto).
- **API Route**: `src/app/api/contact/route.ts` recibe el formulario de contacto, valida datos y almacena cada envío en `data/contact-submissions.jsonl` (solo persistente en desarrollo; en serverless es efímero).
- **Componentes**:
  - `Navbar` (anclajes + selector de tema),
  - `Hero` (hero modernizado con nueva tipografía),
  - `DemoSandbox` (mock login con credenciales demo),
  - `SectionHeader` (encabezado reutilizable),
  - `ContactForm` (validación cliente + envío a API),
  - `ThemeProvider` (modo claro/oscuro persistente).
- **Contenido i18n**: `src/content/es.ts` concentra textos, módulos ampliados, labs, CTA, y credenciales demo.
- **Utilidades**: `src/lib/utils.ts` (`cn`), `src/lib/validators.ts` (validación robusta), `src/lib/contact.ts` (normalización, ticket ID, persistencia).

## Estilo y UX

- **Tipografía**: Manrope (body) + Space Grotesk (display) via `next/font`.
- **Diseño**: tarjetas limpias, jerarquía clara, paleta sobria (slate/amber), animaciones suaves con Framer Motion.
- **Accesibilidad**: contraste reforzado, botones con estados disabled, mensajes de éxito/error con `aria-live`.

## Routing y navegación

- Anclas: `#demo`, `#curriculum`, `#modules`, `#labs`, `#security`, `#pricing`, `#faq`, `#cta`, `#contact`.
- `Navbar` fijo con `backdrop-blur`; `Hero` compensa el offset.

## Datos y almacenamiento

- Envíos de contacto se guardan en `data/contact-submissions.jsonl` en desarrollo; en producción se requiere datastore duradero (DB/queue/obj storage).
- Ticket IDs se generan con prefijo `TCK-xxxxxxx`.

## Tests

- **Unit (Vitest + RTL)**: utilidades, validadores y helpers de contacto (`tests/`).
- **E2E (Playwright)**: `e2e/home.spec.ts` valida secciones, login demo y envío del formulario.

## Build y seguridad

- `npm run build` ejecuta `next build --webpack`.
- Seguridad: scripts `security`, `security:semgrep`, `security:audit`; threat model actualizado en `SECURITY.md`.
