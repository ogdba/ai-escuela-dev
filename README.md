Escuela IA para Desarrolladores — landing moderna en Next.js + TypeScript + Tailwind v4 + Framer Motion.

## Qué incluye

- Secciones completas: Hero, Demo Sandbox (credenciales públicas), Currículum ampliado (13 módulos), Módulos, Fun Labs, Seguridad OWASP LLM Top 10, Pricing, FAQ, CTA final y formulario de contacto funcional.
- API `/api/contact` valida datos y guarda envíos en `data/contact-submissions.jsonl` (dev). Responde con `ticketId`.
- Contenido i18n centralizado en `src/content/es.ts` (textos, módulos, labs, credenciales demo, CTA, contacto).
- Theming claro/oscuro con `ThemeProvider` y nueva tipografía (Manrope + Space Grotesk).
- Animaciones suaves con Framer Motion.

## Demo Sandbox

- Credenciales: `demo@iaskool.dev` / `Demo123!`
- Simula login y muestra estado/alertas sin backend real.

## Requisitos

- Node.js 20+
- npm (usa el lockfile provisto)
- Playwright browsers para e2e: `npx playwright install --with-deps chromium`

## Uso rápido

```bash
npm install
npm run dev
```

Visita http://localhost:3000

## Scripts útiles

- `npm run format`
- `npm run lint`
- `npm run build` / `npm start`
- `npm run test` — Vitest unit
- `npm run test:e2e` — Playwright (hace build y levanta servidor)
- `npm run security` — intenta Semgrep y cae a `npm audit --audit-level=moderate`

## Pruebas

- Unit: Vitest + Testing Library (`tests/`).
- E2E: Playwright (`e2e/home.spec.ts`) — incluye envío de contacto y login demo.

## Estructura

- `src/app/page.tsx` — landing y composición de secciones.
- `src/app/api/contact/route.ts` — endpoint de contacto (JSONL dev storage).
- `src/content/es.ts` — textos en español listo para i18n.
- `src/components` — UI reutilizable (Navbar, Hero, DemoSandbox, SectionHeader, ContactForm, ThemeProvider).
- `src/lib` — utilidades, validadores, helpers de contacto.

## Seguridad

- Formulario con validación cliente+servidor y storage local solo en dev.
- Threat model y controles en `SECURITY.md` (incluye endpoint de contacto).
- Scripts de seguridad: `npm run security:semgrep` y `npm run security:audit`.
