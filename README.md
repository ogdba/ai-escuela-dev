Escuela IA para Desarrolladores — landing moderna en Next.js + TypeScript + Tailwind v4 + Framer Motion.

## Qué incluye

- Secciones completas: Hero, Currículum (roadmap), Módulos, Fun Labs, Seguridad OWASP LLM Top 10, Pricing, FAQ, CTA final y formulario de contacto con validación.
- Contenido i18n centralizado en `src/content/es.ts`.
- Theming claro/oscuro con `ThemeProvider`.
- Animaciones suaves con Framer Motion.

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

- `npm run lint` — ESLint
- `npm run build` / `npm start`
- `npm run test` — Vitest unit
- `npm run test:e2e` — Playwright (requiere build previa automática vía config)
- `npm run format` / `npm run format:check`
- `npm run security` — intenta Semgrep y cae a `npm audit --audit-level=moderate`

## Pruebas

- Unit: Vitest + Testing Library (`tests/`).
- E2E: Playwright smoke (`e2e/home.spec.ts`).

## Estructura

- `src/app/page.tsx` — landing y composición de secciones.
- `src/content/es.ts` — texto en español listo para i18n.
- `src/components` — UI reutilizable (Navbar, Hero, SectionHeader, ContactForm, ThemeProvider).
- `src/lib` — utilidades y validadores.

## Seguridad

- Sección dedicada a OWASP LLM Top 10.
- Validación básica del formulario en cliente.
- Consulta `SECURITY.md` para el threat model y controles sugeridos.
