# Generador de Prompts — PJENL

Herramienta de generacion de prompts institucionales para el Poder Judicial del Estado de Nuevo Leon.

## Funcionalidades

- Wizard paso a paso para generar prompts por categoria
- 13 plantillas de prompts institucionales (analisis, documentos, datos, comunicacion, presentaciones)
- "Mejorar con IA" — optimiza prompts con OpenRouter/Qwen 3.5 (20 usos/dia)
- Biblioteca compartida entre directores
- Autenticacion con Supabase

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind v4, Framer Motion
- Supabase (Auth + PostgreSQL)
- OpenRouter (Qwen 3.5)

## Requisitos

- Node.js 20+
- Cuenta de Supabase con tablas configuradas
- API key de OpenRouter

## Configuracion

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENROUTER_API_KEY=...
MEJORA_LIMITE_DIARIO=20
```

## Uso

```bash
npm install
npm run dev
```

## Tests

```bash
npm run test
```

