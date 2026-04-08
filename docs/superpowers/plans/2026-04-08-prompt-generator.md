# Generador de Prompts PJENL — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing Escuela IA app into a PJENL institutional prompt generator with wizard flow, Supabase auth, saved/shared prompts, and AI-powered prompt improvement via OpenRouter.

**Architecture:** Next.js 16 app with Supabase for auth + database, a wizard UI (4 steps: category, type, form, preview), prompt templates rendered from a central config, and an API route that calls OpenRouter/Qwen 3.5 for the "Mejorar con IA" feature. Institutional PJENL styling (navy/gold).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Framer Motion, Supabase (Auth + PostgreSQL), OpenRouter API, Lucide React

**Remote server:** All work is done on `root@93.188.161.144` at `/root/projects/PJENL/ai-escuela-dev`. Use SSH commands to execute.

---

## File Map

### Files to DELETE (entire directories)
- `src/app/admin/` — old admin pages
- `src/app/dashboard/` — old dashboard
- `src/app/learn/` — old learning pages
- `src/app/api/contact/` — old contact API
- `src/app/api/progress/` — old progress API
- `src/components/ContactForm.tsx` — old component
- `src/components/DemoSandbox.tsx` — old component
- `src/components/Hero.tsx` — old component
- `src/components/SectionHeader.tsx` — old component
- `src/components/ThemeProvider.tsx` — no dark mode in v1
- `src/content/es.ts` — old content
- `src/content/lesson-details.ts` — old content
- `src/lib/contact.ts` — old utility
- `src/lib/progress.ts` — old utility
- `src/lib/utils.ts` — old utility
- `src/lib/validators.ts` — old utility
- `data/` — old JSONL storage
- `ARCHITECTURE.md` — old docs
- `CURRICULUM.md` — old docs
- `SECURITY.md` — old docs
- `tests/` — old tests (all files)
- `e2e/` — old e2e tests (all files)

### Files to CREATE
- `src/content/plantillas.ts` — all 13 prompt templates
- `src/content/system-prompts.ts` — system prompts for OpenRouter
- `src/components/Navbar.tsx` — rewrite with PJENL branding
- `src/components/Stepper.tsx` — wizard step indicator
- `src/components/CategoryPicker.tsx` — wizard step 1
- `src/components/TypePicker.tsx` — wizard step 2
- `src/components/PromptForm.tsx` — wizard step 3
- `src/components/PromptPreview.tsx` — wizard step 4
- `src/components/PromptCard.tsx` — card for mis-prompts/biblioteca
- `src/components/AuthGuard.tsx` — route protection wrapper
- `src/app/page.tsx` — rewrite as dashboard
- `src/app/wizard/page.tsx` — wizard page
- `src/app/mis-prompts/page.tsx` — saved prompts
- `src/app/biblioteca/page.tsx` — shared prompts
- `src/app/perfil/page.tsx` — user profile
- `src/app/api/mejorar/route.ts` — OpenRouter API route
- `src/lib/supabase.ts` — rewrite with @supabase/supabase-js client
- `src/lib/openrouter.ts` — OpenRouter client
- `src/lib/prompts.ts` — template rendering logic
- `supabase/migrations/003_prompt_generator.sql` — new tables
- `tests/prompts.test.ts` — template rendering tests
- `tests/plantillas.test.ts` — template data validation tests

### Files to MODIFY
- `src/app/globals.css` — PJENL color theme
- `src/app/layout.tsx` — remove ThemeProvider, update metadata
- `src/app/login/page.tsx` — restyle with PJENL branding
- `src/middleware.ts` — update protected routes
- `src/components/AuthProvider.tsx` — remove demo mode, clean up
- `package.json` — add @supabase/supabase-js dependency
- `README.md` — rewrite for new project

---

## Task 1: Clean up old files and install dependencies

**Files:**
- Delete: all files listed in "Files to DELETE" above
- Modify: `package.json`

- [ ] **Step 1: Delete old source files**

```bash
cd /root/projects/PJENL/ai-escuela-dev
rm -rf src/app/admin src/app/dashboard src/app/learn src/app/api/contact src/app/api/progress
rm -f src/components/ContactForm.tsx src/components/DemoSandbox.tsx src/components/Hero.tsx src/components/SectionHeader.tsx src/components/ThemeProvider.tsx
rm -f src/content/es.ts src/content/lesson-details.ts
rm -f src/lib/contact.ts src/lib/progress.ts src/lib/utils.ts src/lib/validators.ts
rm -rf data
rm -f ARCHITECTURE.md CURRICULUM.md SECURITY.md
rm -rf tests/* e2e/*
```

- [ ] **Step 2: Install @supabase/supabase-js**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 3: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove old Escuela IA code, prepare for prompt generator"
```

---

## Task 2: PJENL theme and layout

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite globals.css with PJENL theme**

```css
@import "tailwindcss";

:root {
  --navy: #0D2B5E;
  --navy-deep: #0A1E3F;
  --gold: #C9A227;
  --gold-light: #E8C84A;
  --gray-bg: #F0F4FA;
  --white: #FFFFFF;
  --gray-text: #64748B;
  --blue-mist: #B0C4DE;
  --gray-muted: #6B8CAE;
  --red: #C0392B;
  --green: #16A34A;
}

@theme inline {
  --color-navy: var(--navy);
  --color-navy-deep: var(--navy-deep);
  --color-gold: var(--gold);
  --color-gold-light: var(--gold-light);
  --color-gray-bg: var(--gray-bg);
  --color-gray-text: var(--gray-text);
  --color-blue-mist: var(--blue-mist);
  --color-green: var(--green);
  --color-red: var(--red);
  --font-sans: "Calibri", "Segoe UI", system-ui, -apple-system, sans-serif;
}

body {
  font-family: "Calibri", "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--gray-bg);
  color: #1e293b;
}

::selection {
  background: rgba(13, 43, 94, 0.2);
  color: #0D2B5E;
}
```

- [ ] **Step 2: Rewrite layout.tsx**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Generador de Prompts — PJENL",
  description:
    "Herramienta de generacion de prompts institucionales para el Poder Judicial del Estado de Nuevo Leon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: apply PJENL institutional theme and simplified layout"
```

---

## Task 3: Supabase client and database migration

**Files:**
- Rewrite: `src/lib/supabase.ts`
- Create: `supabase/migrations/003_prompt_generator.sql`

- [ ] **Step 1: Rewrite supabase.ts with @supabase/supabase-js**

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 2: Create migration for new tables**

```sql
-- 003_prompt_generator.sql
-- New tables for the PJENL prompt generator

-- Drop old tables that are no longer needed
drop table if exists public.content_prerequisites cascade;
drop table if exists public.content_items cascade;
drop table if exists public.user_progress cascade;

-- prompts_guardados
create table if not exists public.prompts_guardados (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  categoria text not null,
  tipo text not null,
  campos_completados jsonb not null default '{}',
  prompt_generado text not null,
  prompt_mejorado text,
  es_publico boolean not null default false,
  created_at timestamptz default now()
);

alter table public.prompts_guardados enable row level security;

create policy "Users can view own prompts"
  on public.prompts_guardados for select
  using (auth.uid() = user_id);

create policy "Users can view public prompts"
  on public.prompts_guardados for select
  using (es_publico = true);

create policy "Users can insert own prompts"
  on public.prompts_guardados for insert
  with check (auth.uid() = user_id);

create policy "Users can update own prompts"
  on public.prompts_guardados for update
  using (auth.uid() = user_id);

create policy "Users can delete own prompts"
  on public.prompts_guardados for delete
  using (auth.uid() = user_id);

create index idx_prompts_user on public.prompts_guardados(user_id);
create index idx_prompts_publico on public.prompts_guardados(es_publico) where es_publico = true;

-- uso_ia
create table if not exists public.uso_ia (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  fecha date not null default current_date,
  cantidad_usos integer not null default 1,
  unique(user_id, fecha)
);

alter table public.uso_ia enable row level security;

create policy "Users can view own usage"
  on public.uso_ia for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.uso_ia for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.uso_ia for update
  using (auth.uid() = user_id);

create index idx_uso_ia_user_fecha on public.uso_ia(user_id, fecha);
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase.ts supabase/migrations/003_prompt_generator.sql
git commit -m "feat: add Supabase client and prompt generator database schema"
```

---

## Task 4: Prompt templates and rendering logic

**Files:**
- Create: `src/content/plantillas.ts`
- Create: `src/lib/prompts.ts`
- Create: `tests/prompts.test.ts`
- Create: `tests/plantillas.test.ts`

- [ ] **Step 1: Write tests for template rendering**

Create `tests/prompts.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { renderTemplate } from "@/lib/prompts";

describe("renderTemplate", () => {
  it("replaces simple placeholders", () => {
    const template = "Hola {{nombre}}, tu cargo es {{cargo}}.";
    const result = renderTemplate(template, { nombre: "Juan", cargo: "Director" });
    expect(result).toBe("Hola Juan, tu cargo es Director.");
  });

  it("handles conditional blocks when field has value", () => {
    const template = "Base.{{#extra}} Extra: {{extra}}{{/extra}}";
    const result = renderTemplate(template, { extra: "info" });
    expect(result).toBe("Base. Extra: info");
  });

  it("removes conditional blocks when field is empty", () => {
    const template = "Base.{{#extra}} Extra: {{extra}}{{/extra}}";
    const result = renderTemplate(template, { extra: "" });
    expect(result).toBe("Base.");
  });

  it("removes conditional blocks when field is missing", () => {
    const template = "Base.{{#extra}} Extra: {{extra}}{{/extra}}";
    const result = renderTemplate(template, {});
    expect(result).toBe("Base.");
  });

  it("handles multiple fields and conditionals", () => {
    const template = "Oficio {{numero}} para {{destinatario}}.{{#monto}} Monto: ${{monto}}{{/monto}}";
    const result = renderTemplate(template, { numero: "DA/001/2026", destinatario: "Juan", monto: "50000" });
    expect(result).toBe("Oficio DA/001/2026 para Juan. Monto: $50000");
  });

  it("leaves unknown placeholders untouched", () => {
    const template = "Hola {{nombre}}, {{desconocido}}.";
    const result = renderTemplate(template, { nombre: "Juan" });
    expect(result).toBe("Hola Juan, {{desconocido}}.");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/prompts.test.ts
```

Expected: FAIL — `@/lib/prompts` does not export `renderTemplate`.

- [ ] **Step 3: Implement renderTemplate**

Create `src/lib/prompts.ts`:

```typescript
export function renderTemplate(
  template: string,
  values: Record<string, string>,
): string {
  // Process conditional blocks: {{#field}}...{{/field}}
  let result = template.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, field, content) => {
      const value = values[field];
      if (!value || value.trim() === "") return "";
      // Replace placeholders inside the conditional block
      return content.replace(/\{\{(\w+)\}\}/g, (__, innerField) => {
        return values[innerField] ?? `{{${innerField}}}`;
      });
    },
  );

  // Replace remaining simple placeholders
  result = result.replace(/\{\{(\w+)\}\}/g, (match, field) => {
    return values[field] ?? match;
  });

  return result;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/prompts.test.ts
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Create plantillas.ts with all 13 templates**

Create `src/content/plantillas.ts`:

```typescript
export interface Campo {
  id: string;
  label: string;
  tipo: "text" | "textarea" | "select" | "number";
  placeholder: string;
  requerido: boolean;
  opciones?: string[];
}

export interface Plantilla {
  id: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  icono: string;
  campos: Campo[];
  nota?: string;
  plantilla: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

export const CATEGORIAS: Categoria[] = [
  {
    id: "analizar",
    nombre: "Analizar Documentos",
    descripcion: "Extrae insights de circulares, presupuestos, datos y notas",
    icono: "FileSearch",
  },
  {
    id: "generar",
    nombre: "Generar Documentos",
    descripcion: "Crea oficios, acuerdos, boletines y reportes",
    icono: "FilePlus",
  },
  {
    id: "datos",
    nombre: "De Datos a Decisiones",
    descripcion: "Consulta datos, compara periodos y genera entregables",
    icono: "BarChart3",
  },
  {
    id: "comunicar",
    nombre: "Comunicar y Adaptar",
    descripcion: "Adapta mensajes a diferentes audiencias y contextos",
    icono: "MessageSquare",
  },
  {
    id: "presentaciones",
    nombre: "Presentaciones",
    descripcion: "Genera presentaciones con estructura institucional",
    icono: "Presentation",
  },
];

export const PLANTILLAS: Plantilla[] = [
  // ── ANALIZAR ──
  {
    id: "analizar-circular",
    categoria: "analizar",
    nombre: "Circular / Acuerdo",
    descripcion: "Analiza un documento normativo y extrae implicaciones para el PJENL",
    icono: "FileSearch",
    campos: [
      {
        id: "contexto",
        label: "Contexto adicional (opcional)",
        tipo: "textarea",
        placeholder: "Ej: Es una circular del CJF sobre paridad de genero...",
        requerido: false,
      },
    ],
    nota: "Recuerda subir el PDF del documento en Claude antes de pegar este prompt",
    plantilla: `Analiza este documento y dame:

1. Resumen ejecutivo en maximo 5 puntos
2. Que cambia respecto a la normativa anterior?
3. Que implicaciones directas tiene para la operacion del Poder Judicial de Nuevo Leon?
4. Que acciones concretas tendria que tomar el PJENL para cumplir?
5. Hay plazos o fechas limite que debamos considerar?

Se directo y especifico. No necesito contexto general, necesito lo que nos afecta a nosotros.{{#contexto}}

Contexto adicional: {{contexto}}{{/contexto}}`,
  },
  {
    id: "analizar-presupuesto",
    categoria: "analizar",
    nombre: "Presupuesto",
    descripcion: "Analiza tablas de presupuesto e identifica riesgos",
    icono: "DollarSign",
    campos: [
      {
        id: "contexto",
        label: "Contexto adicional (opcional)",
        tipo: "textarea",
        placeholder: "Ej: Datos del segundo trimestre 2026...",
        requerido: false,
      },
    ],
    nota: "Recuerda subir el Excel con datos presupuestales en Claude antes de pegar este prompt",
    plantilla: `Analiza esta tabla de presupuesto y dime:

1. Que partidas tienen menos del 40% de ejercicio respecto a lo programado?
2. Donde hay riesgo de subejercicio al cierre del periodo?
3. Que 3 hallazgos son los mas relevantes para la toma de decisiones?
4. Si tuvieras que presentar esto a la Contraloria, que explicarias primero?

Presenta los datos con numeros exactos, no generalidades.{{#contexto}}

Contexto adicional: {{contexto}}{{/contexto}}`,
  },
  {
    id: "analizar-datos-judiciales",
    categoria: "analizar",
    nombre: "Datos Judiciales",
    descripcion: "Analiza datos de juzgados con hallazgos y graficas",
    icono: "Scale",
    campos: [
      {
        id: "contexto",
        label: "Contexto adicional (opcional)",
        tipo: "textarea",
        placeholder: "Ej: Datos de juzgados civiles del primer semestre...",
        requerido: false,
      },
    ],
    nota: "Recuerda subir el CSV o Excel con datos de juzgados en Claude antes de pegar este prompt",
    plantilla: `Analiza estos datos judiciales y genera:

1. Los 3 hallazgos mas relevantes (con datos que los respalden)
2. Comparativo entre juzgados: cuales tienen mejor desempeno y cuales estan rezagados?
3. Tendencias: la carga de trabajo esta subiendo o bajando? Los tiempos de resolucion mejoran?
4. Anomalias: hay algun dato que se salga de lo esperado?
5. Genera graficas que ilustren los hallazgos principales

Dame un analisis que pueda presentar al Pleno sin tener que procesarlo mas.{{#contexto}}

Contexto adicional: {{contexto}}{{/contexto}}`,
  },
  {
    id: "analizar-nota-periodistica",
    categoria: "analizar",
    nombre: "Nota Periodistica",
    descripcion: "Analiza notas de prensa y propone estrategia de respuesta",
    icono: "Newspaper",
    campos: [
      {
        id: "texto_nota",
        label: "Texto de la nota periodistica",
        tipo: "textarea",
        placeholder: "Pega aqui el texto completo de la nota...",
        requerido: true,
      },
    ],
    plantilla: `Analiza la siguiente nota periodistica sobre el PJENL:

"""
{{texto_nota}}
"""

Necesito:
1. Tono general de la nota (positivo, negativo, neutral) y por que
2. Que afirmaciones podrian afectar la imagen institucional?
3. Hay datos incorrectos o sacados de contexto que debamos aclarar?
4. Propon una estrategia de respuesta: respondemos, aclaramos, o dejamos pasar?
5. Si decidimos responder, dame un borrador de posicionamiento institucional de 3 parrafos`,
  },

  // ── GENERAR ──
  {
    id: "generar-oficio",
    categoria: "generar",
    nombre: "Oficio Administrativo",
    descripcion: "Genera oficios con formato institucional del PJENL",
    icono: "FileText",
    campos: [
      {
        id: "numero_oficio",
        label: "Numero de oficio",
        tipo: "text",
        placeholder: "DA/001/2026",
        requerido: true,
      },
      {
        id: "destinatario",
        label: "Nombre del destinatario",
        tipo: "text",
        placeholder: "Lic. Juan Perez",
        requerido: true,
      },
      {
        id: "cargo_destinatario",
        label: "Cargo del destinatario",
        tipo: "text",
        placeholder: "Oficial Mayor del PJENL",
        requerido: true,
      },
      {
        id: "asunto",
        label: "Asunto del oficio",
        tipo: "text",
        placeholder: "Solicitud de suficiencia presupuestal",
        requerido: true,
      },
      {
        id: "equipos_servicios",
        label: "Equipos o servicios a adquirir",
        tipo: "textarea",
        placeholder: "20 equipos de computo para juzgados...",
        requerido: true,
      },
      {
        id: "monto",
        label: "Monto estimado",
        tipo: "text",
        placeholder: "500,000",
        requerido: true,
      },
      {
        id: "justificacion",
        label: "Justificacion",
        tipo: "textarea",
        placeholder: "Renovacion de equipos obsoletos con mas de 5 anos...",
        requerido: true,
      },
    ],
    plantilla: `Redacta un oficio de la Direccion de Administracion del PJENL dirigido a la Oficalia Mayor solicitando suficiencia presupuestal para la adquisicion de {{equipos_servicios}}.

Datos:
- Numero de oficio: {{numero_oficio}}
- Dirigido a: {{destinatario}}, {{cargo_destinatario}}
- Monto estimado: ${{monto}} pesos
- Justificacion: {{justificacion}}
- Fundamento: articulos aplicables de la Ley Organica del Poder Judicial y los Lineamientos de Adquisiciones del PJENL

Genera el documento en formato Word, con estructura formal de oficio institucional.`,
  },
  {
    id: "generar-acuerdo",
    categoria: "generar",
    nombre: "Proyecto de Acuerdo",
    descripcion: "Genera proyectos de acuerdo del Consejo de la Judicatura",
    icono: "Gavel",
    campos: [
      {
        id: "medidas",
        label: "Medidas a implementar (una por linea)",
        tipo: "textarea",
        placeholder: "1. Primera medida\n2. Segunda medida\n3. Tercera medida",
        requerido: true,
      },
      {
        id: "plazo",
        label: "Plazo de implementacion",
        tipo: "text",
        placeholder: "30 dias habiles",
        requerido: true,
      },
      {
        id: "area_responsable",
        label: "Area responsable de seguimiento",
        tipo: "text",
        placeholder: "Direccion de Administracion",
        requerido: false,
      },
    ],
    plantilla: `Genera un proyecto de acuerdo del Consejo de la Judicatura del Estado de Nuevo Leon que instruya a todos los juzgados de primera instancia a implementar las siguientes medidas:

{{medidas}}

El acuerdo debe incluir:
- Considerandos con fundamento en la Ley Organica del Poder Judicial del Estado
- Antecedentes que justifiquen la medida
- Puntos resolutivos claros y especificos
- Plazo de implementacion: {{plazo}}{{#area_responsable}}
- Area responsable de dar seguimiento: {{area_responsable}}{{/area_responsable}}

Genera en formato Word.`,
  },
  {
    id: "generar-boletin",
    categoria: "generar",
    nombre: "Boletin de Prensa",
    descripcion: "Genera boletin de prensa y posts para redes sociales",
    icono: "Megaphone",
    campos: [
      {
        id: "accion",
        label: "Que realizo el Magistrado Presidente/a",
        tipo: "text",
        placeholder: "Inauguro el nuevo Centro de Justicia Alternativa",
        requerido: true,
      },
      {
        id: "detalles",
        label: "Detalles del evento (uno por linea)",
        tipo: "textarea",
        placeholder: "- Asistieron 200 personas\n- Se ubica en el centro de Monterrey\n- Atendera 500 casos al mes",
        requerido: true,
      },
    ],
    plantilla: `La Magistrada Presidenta del Tribunal Superior de Justicia de Nuevo Leon {{accion}}.

Detalles del evento:
{{detalles}}

Genera los siguientes materiales:

1. **Boletin de prensa formal** (400-500 palabras) con estructura: encabezado, lead, desarrollo, declaracion y cierre institucional
2. **Post para Facebook** (150 palabras maximo) — tono accesible, que invite a la ciudadania a conocer la accion
3. **Post para X/Twitter** (280 caracteres maximo) — directo y con hashtags relevantes
4. **3 talking points** para el vocero en caso de que le pregunten los medios`,
  },
  {
    id: "generar-reporte",
    categoria: "generar",
    nombre: "Reporte con Graficas",
    descripcion: "Genera reporte ejecutivo completo a partir de datos analizados",
    icono: "FileBarChart",
    campos: [
      {
        id: "periodo",
        label: "Periodo del informe",
        tipo: "text",
        placeholder: "Primer Trimestre 2026",
        requerido: true,
      },
      {
        id: "contexto",
        label: "Contexto adicional (opcional)",
        tipo: "textarea",
        placeholder: "Ej: Enfocarse en juzgados civiles...",
        requerido: false,
      },
    ],
    nota: "Usa este prompt despues de haber analizado datos en la misma conversacion de Claude",
    plantilla: `Con base en los datos que acabamos de analizar, genera un reporte completo en Word que incluya:

1. Portada con titulo "Informe Estadistico {{periodo}} — Poder Judicial del Estado de Nuevo Leon"
2. Resumen ejecutivo (media cuartilla)
3. Seccion de hallazgos principales con las graficas que generaste
4. Comparativo entre periodos en formato de tabla
5. Conclusiones
6. Recomendaciones para la mejora en juzgados con bajo desempeno

El documento debe estar listo para presentar al Pleno del Tribunal sin ediciones adicionales.{{#contexto}}

Contexto adicional: {{contexto}}{{/contexto}}`,
  },

  // ── DATOS ──
  {
    id: "datos-preguntas",
    categoria: "datos",
    nombre: "Preguntas a Datos",
    descripcion: "Haz preguntas directas a datos ya cargados",
    icono: "HelpCircle",
    campos: [
      {
        id: "preguntas",
        label: "Preguntas que quieres hacer (una por linea)",
        tipo: "textarea",
        placeholder: "1. Cuales son los 3 juzgados con mayor carga?\n2. Hay correlacion entre carga y tiempo de resolucion?",
        requerido: true,
      },
    ],
    nota: "Asegurate de haber subido los datos previamente en la misma conversacion de Claude",
    plantilla: `Sobre los datos que subi, respondeme estas preguntas:

{{preguntas}}`,
  },
  {
    id: "datos-comparativo",
    categoria: "datos",
    nombre: "Comparativo entre Periodos",
    descripcion: "Compara datos entre dos periodos y detecta cambios",
    icono: "ArrowLeftRight",
    campos: [
      {
        id: "periodo1",
        label: "Primer periodo",
        tipo: "text",
        placeholder: "Primer trimestre",
        requerido: true,
      },
      {
        id: "periodo2",
        label: "Segundo periodo",
        tipo: "text",
        placeholder: "Segundo trimestre",
        requerido: true,
      },
    ],
    nota: "Asegurate de haber subido los datos de ambos periodos en Claude",
    plantilla: `Compara los datos del {{periodo1}} contra el {{periodo2}}:

- Que juzgados mejoraron su productividad?
- Donde se incrementaron los tiempos de resolucion?
- Hay algun cambio que sugiera un problema sistemico (no solo de un juzgado)?

Presenta la comparacion en una tabla clara y despues dame tu interpretacion en 3 parrafos.`,
  },
  {
    id: "datos-entregable",
    categoria: "datos",
    nombre: "Analisis a Entregable",
    descripcion: "Convierte un analisis previo en reporte ejecutivo",
    icono: "FileOutput",
    campos: [
      {
        id: "instrucciones",
        label: "Instrucciones adicionales (opcional)",
        tipo: "textarea",
        placeholder: "Ej: Enfocarse en recomendaciones para el Consejo...",
        requerido: false,
      },
    ],
    nota: "Usa este prompt despues de haber hecho un analisis en la misma conversacion",
    plantilla: `Con todos estos hallazgos, genera:

1. Un reporte ejecutivo en Word (maximo 3 paginas) con las conclusiones mas importantes
2. Incluye las graficas que generaste
3. Agrega una seccion de recomendaciones: que deberia hacer el Consejo de la Judicatura con estos datos?

El tono debe ser ejecutivo — directo, con datos, sin rodeos.{{#instrucciones}}

Instrucciones adicionales: {{instrucciones}}{{/instrucciones}}`,
  },

  // ── COMUNICAR ──
  {
    id: "comunicar-tres-audiencias",
    categoria: "comunicar",
    nombre: "Un Contenido, Tres Audiencias",
    descripcion: "Adapta un mensaje para medios, ciudadania y personal interno",
    icono: "Users",
    campos: [
      {
        id: "comunicado",
        label: "Comunicado o contexto del mensaje",
        tipo: "textarea",
        placeholder: "Pega aqui el comunicado o describe el mensaje que quieres adaptar...",
        requerido: true,
      },
    ],
    plantilla: `Tengo el siguiente comunicado institucional del PJENL:

"""
{{comunicado}}
"""

Necesito tres versiones del mismo mensaje:

1. **Version para medios de comunicacion** — formal, con datos duros, estructura de boletin
2. **Version para ciudadania general** — sin tecnicismos juridicos, que un ciudadano sin formacion legal entienda que significa para el
3. **Version para comunicacion interna** — dirigida a jueces y personal del PJENL, con los detalles operativos que les afectan

Cada version debe mantener el mensaje central pero adaptarse completamente a su audiencia.`,
  },
  {
    id: "comunicar-responder-correo",
    categoria: "comunicar",
    nombre: "Responder Correo",
    descripcion: "Analiza un correo recibido y genera borrador de respuesta",
    icono: "Mail",
    campos: [
      {
        id: "correo",
        label: "Texto del correo recibido",
        tipo: "textarea",
        placeholder: "Pega aqui el correo que recibiste...",
        requerido: true,
      },
      {
        id: "tipo_respuesta",
        label: "Tipo de respuesta",
        tipo: "select",
        placeholder: "",
        requerido: true,
        opciones: ["Aceptar", "Declinar", "Solicitar mas informacion", "Proponer alternativa"],
      },
      {
        id: "tono",
        label: "Tono de la respuesta",
        tipo: "select",
        placeholder: "",
        requerido: true,
        opciones: ["Formal institucional", "Cordial pero firme", "Conciliador"],
      },
    ],
    plantilla: `Recibi este correo:

"""
{{correo}}
"""

Necesito:
1. Resumen en 3 bullets: que me estan pidiendo?
2. Hay algo urgente que requiera accion inmediata?
3. Borrador de respuesta profesional que {{tipo_respuesta}}

El tono debe ser {{tono}}.`,
  },
  {
    id: "comunicar-revision-texto",
    categoria: "comunicar",
    nombre: "Revision de Texto",
    descripcion: "Revisa y mejora cualquier texto institucional",
    icono: "Pencil",
    campos: [
      {
        id: "texto",
        label: "Texto a revisar",
        tipo: "textarea",
        placeholder: "Pega aqui el oficio, comunicado o cualquier texto...",
        requerido: true,
      },
    ],
    plantilla: `Revisa el siguiente texto y mejoralo:

"""
{{texto}}
"""

Especificamente:
1. Corrige errores gramaticales y de redaccion
2. Mejora la claridad: si una oracion se puede decir en menos palabras, hazlo
3. Verifica que el tono sea apropiado para un documento institucional del Poder Judicial
4. Senalame si hay inconsistencias logicas o argumentativas
5. Dame la version corregida completa, no solo las correcciones`,
  },

  // ── PRESENTACIONES ──
  {
    id: "presentaciones-bullets",
    categoria: "presentaciones",
    nombre: "Presentacion desde Bullets",
    descripcion: "Genera presentacion PowerPoint con identidad PJENL",
    icono: "Presentation",
    campos: [
      {
        id: "tema",
        label: "Tema de la presentacion",
        tipo: "text",
        placeholder: "Modernizacion tecnologica del PJENL",
        requerido: true,
      },
      {
        id: "audiencia",
        label: "Audiencia",
        tipo: "select",
        placeholder: "",
        requerido: true,
        opciones: ["El Pleno", "El Consejo de la Judicatura", "Directores", "Personal operativo", "Ciudadania"],
      },
      {
        id: "num_slides",
        label: "Numero de slides",
        tipo: "number",
        placeholder: "8",
        requerido: true,
      },
      {
        id: "puntos",
        label: "Puntos que debe cubrir (uno por linea)",
        tipo: "textarea",
        placeholder: "1. Diagnostico actual\n2. Propuesta de solucion\n3. Presupuesto requerido\n4. Cronograma\n5. Beneficios esperados",
        requerido: true,
      },
    ],
    plantilla: `Necesito una presentacion de {{num_slides}} slides sobre {{tema}} para presentar ante {{audiencia}}.

Puntos que debe cubrir:
{{puntos}}

Estilo: formal institucional, colores navy y dorado.
Incluye datos concretos donde sea posible.
La ultima slide debe tener los proximos pasos o acciones a tomar.

Genera el archivo PowerPoint.`,
  },
];
```

- [ ] **Step 6: Write template data validation tests**

Create `tests/plantillas.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { PLANTILLAS, CATEGORIAS } from "@/content/plantillas";

describe("plantillas data integrity", () => {
  it("all plantillas reference valid categories", () => {
    const catIds = CATEGORIAS.map((c) => c.id);
    for (const p of PLANTILLAS) {
      expect(catIds).toContain(p.categoria);
    }
  });

  it("all plantillas have unique ids", () => {
    const ids = PLANTILLAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all categories have at least one plantilla", () => {
    for (const cat of CATEGORIAS) {
      const count = PLANTILLAS.filter((p) => p.categoria === cat.id).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("required fields have non-empty placeholders", () => {
    for (const p of PLANTILLAS) {
      for (const campo of p.campos) {
        if (campo.requerido && campo.tipo !== "select") {
          expect(campo.placeholder.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("select fields have opciones defined", () => {
    for (const p of PLANTILLAS) {
      for (const campo of p.campos) {
        if (campo.tipo === "select") {
          expect(campo.opciones).toBeDefined();
          expect(campo.opciones!.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
```

- [ ] **Step 7: Run all tests**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/content/plantillas.ts src/lib/prompts.ts tests/prompts.test.ts tests/plantillas.test.ts
git commit -m "feat: add 13 prompt templates and rendering engine with tests"
```

---

## Task 5: System prompts for OpenRouter

**Files:**
- Create: `src/content/system-prompts.ts`

- [ ] **Step 1: Create system-prompts.ts**

```typescript
export const SYSTEM_PROMPT_BASE = `Eres un experto en prompt engineering especializado en el contexto del Poder Judicial del Estado de Nuevo Leon (PJENL).

CONTEXTO INSTITUCIONAL:
- El PJENL se rige por la Ley Organica del Poder Judicial del Estado de Nuevo Leon
- El organo de gobierno es el Consejo de la Judicatura
- La maxima autoridad es la Magistrada Presidenta del Tribunal Superior de Justicia
- Las direcciones principales son: Estadistica, Prensa, Administracion, Juridica, Informatica
- El tratamiento formal es "Magistrado/a", "Consejero/a", "Director/a"
- Los documentos institucionales usan formato: fecha ("Monterrey, Nuevo Leon, a..."), numero de oficio, fundamento legal con articulo y ordenamiento especifico
- El tono institucional es formal, directo y con sustento normativo

TU TAREA:
Recibes un prompt del usuario y lo transformas en una version optimizada para obtener los mejores resultados posibles de un LLM.

CRITERIOS DE MEJORA (aplica todos los que sean relevantes):
1. ESPECIFICIDAD - Reemplaza instrucciones vagas por concretas. "Hazme un resumen" -> "Resume en maximo 5 puntos, cada uno de 1-2 oraciones, priorizando impacto operativo para el PJENL"
2. ESTRUCTURA - Agrega formato de salida cuando el prompt no lo tiene: secciones, numeracion, longitud esperada, formato de archivo si aplica
3. CONTEXTO PJENL - Inyecta el contexto institucional que el usuario omitio pero que es relevante: fundamentos legales, audiencia probable, estructura de documentos, terminologia correcta
4. ROL Y AUDIENCIA - Define quien produce el documento y para quien: "Redacta como Director de Administracion dirigido al Consejo de la Judicatura"
5. CRITERIOS DE CALIDAD - Agrega que hace que la respuesta sea buena vs mediocre: "Incluye datos especificos, no generalidades" / "Cita articulos aplicables, no solo menciona la ley"
6. RESTRICCIONES - Anade lo que NO debe incluir: "Sin rodeos introductorios" / "No uses lenguaje coloquial" / "No inventes fundamentos legales"
7. ENCADENAMIENTO - Si el prompt se beneficia de pasos secuenciales, descomponlo: "Primero analiza X, luego con base en ese analisis genera Y"

REGLAS:
- Devuelve UNICAMENTE el prompt mejorado, listo para copiar y pegar
- No agregues explicaciones, comentarios ni justificaciones de tus cambios
- No envuelvas el resultado en bloques de codigo
- Manten la intencion original del usuario - mejora la ejecucion, no cambies el objetivo
- Si el prompt original ya es bueno, haz mejoras minimas - no sobreingenieres
- Usa XML tags (<contexto>, <instrucciones>, <formato_salida>) solo cuando la complejidad lo justifique
- Prioriza claridad sobre sofisticacion`;

export const SYSTEM_PROMPT_PRESENTACIONES = `

Para formatos de presentaciones utiliza de apoyo lo siguiente:

## IDENTIDAD CORPORATIVA — PODER JUDICIAL DEL ESTADO DE NUEVO LEON (PJENL)

### PALETA DE COLORES

| Rol | Nombre | HEX |
|---|---|---|
| Primario dominante | Navy institucional | #0D2B5E |
| Fondo oscuro / portada | Navy profundo | #0A1E3F |
| Acento dorado | Gold PJENL | #C9A227 |
| Acento dorado claro | Gold suave | #E8C84A |
| Fondo claro | Gris institucional | #F0F4FA |
| Superficie blanca | Blanco | #FFFFFF |
| Texto secundario | Gris azulado | #64748B |
| Texto sobre oscuro | Azul niebla | #B0C4DE |
| Texto pie / fecha | Gris opaco | #6B8CAE |
| Alerta / enfasis | Rojo institucional | #C0392B |

Regla de dominancia: El navy #0D2B5E ocupa el 60-70% del peso visual. El gold #C9A227 es el acento — usalo en barras, separadores y etiquetas destacadas, nunca como fondo principal.

### ESTRUCTURA DE DIAPOSITIVAS

Portada:
- Fondo: navy profundo #0A1E3F
- Banda dorada superior e inferior de 0.15"
- Panel derecho en navy #0D2B5E ocupando ~35% del ancho — logo institucional centrado
- Texto izquierdo: etiqueta en gold claro (#E8C84A) en mayusculas, titulo en blanco bold 40-44pt, subtitulo en #B0C4DE
- Pie izquierdo: area, ano en #6B8CAE

Diapositivas de contenido:
- Fondo: blanco #FFFFFF o gris claro #F0F4FA
- Banda dorada superior fina (0.08") y banda dorada inferior fina (0.08")
- Linea vertical navy izquierda (0.06" de ancho, altura completa)
- Logo pequeno en esquina superior derecha (~0.7" x 0.7")
- Titulo de slide: 22pt bold, color navy #0D2B5E
- Subtitulo / descriptor: 11pt, gris #64748B, precedido de linea dorada corta (1.2" x 0.04")

Diapositiva de cierre:
- Misma estructura que portada
- Logo grande centrado
- Frase de remate en blanco bold 20pt, centrada
- Sin columnas — composicion simetrica

### TIPOGRAFIA

| Elemento | Fuente | Tamano | Peso |
|---|---|---|---|
| Titulo de slide | Calibri | 22pt | Bold |
| Etiqueta / label | Calibri | 8-10pt | Bold, mayusculas, tracking 3 |
| Cuerpo de texto | Calibri | 10-12pt | Regular |
| Estadisticas grandes | Calibri | 36-48pt | Bold |
| Pie / caption | Calibri | 9pt | Regular |

### COMPONENTES VISUALES

Tarjetas de contenido:
- Fondo blanco con borde #E2E8F0 de 0.8pt
- Sombra exterior suave: blur 8, offset 3, angulo 135, opacidad 15%
- Franja de acento izquierda de 0.06-0.08" en el color del tema
- Titulo en navy bold 12pt, cuerpo en #334155 10pt

Cajas de enfasis / objetivo:
- Fondo navy #0D2B5E con franja dorada izquierda de 0.08"
- Etiqueta en gold claro #E8C84A bold, 10pt, mayusculas con tracking
- Separador horizontal dorado 0.04" alto
- Texto en blanco 11pt

### COLORES DE ACENTO POR SECCION

| Seccion | Color acento | HEX |
|---|---|---|
| Seguridad / proteccion | Verde institucional | #16A34A |
| Tecnologia / sistemas | Azul medio | #1565C0 |
| Juridico / legal | Navy principal | #0D2B5E |
| Financiero / costos | Dorado oscuro | #B7800A |
| Alertas / riesgos | Rojo institucional | #C0392B |
| Innovacion / IA | Violeta | #6D28D9 |
| Procesos / flujos | Verde oscuro | #0D7A5F |

### REGLAS DE DISENO

1. Nunca usar # antes de los hex en codigo pptxgenjs — omitirlo siempre
2. Nunca compartir objetos de shadow entre multiples shapes — crear funcion makeShadow() que retorne objeto fresco cada vez
3. Nunca usar ROUNDED_RECTANGLE con franjas de acento rectangulares — usar RECTANGLE
4. Nunca usar bullets Unicode — usar bullet: true en pptxgenjs
5. Nunca subrayar titulos con lineas decorativas inmediatamente debajo
6. Bandas gold superior e inferior en todas las diapositivas de contenido
7. Logo en cada slide de contenido — esquina superior derecha
8. Fondo de portada y cierre siempre oscuro — estructura "sandwich" dark-light-dark`;
```

- [ ] **Step 2: Commit**

```bash
git add src/content/system-prompts.ts
git commit -m "feat: add system prompts for OpenRouter AI improvement"
```

---

## Task 6: OpenRouter client and API route

**Files:**
- Create: `src/lib/openrouter.ts`
- Create: `src/app/api/mejorar/route.ts`

- [ ] **Step 1: Create OpenRouter client**

```typescript
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterResponse {
  choices: { message: { content: string } }[];
}

export async function mejorarPrompt(
  prompt: string,
  systemPrompt: string,
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen/qwen3-235b-a22b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${error}`);
  }

  const data = (await res.json()) as OpenRouterResponse;
  return data.choices[0]?.message?.content ?? "";
}
```

- [ ] **Step 2: Create API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mejorarPrompt } from "@/lib/openrouter";
import { SYSTEM_PROMPT_BASE, SYSTEM_PROMPT_PRESENTACIONES } from "@/content/system-prompts";

const LIMITE_DIARIO = parseInt(process.env.MEJORA_LIMITE_DIARIO || "20", 10);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, categoria } = body as { prompt: string; categoria: string };

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
  }

  // Check daily usage
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Monterrey" });
  const { data: uso } = await supabase
    .from("uso_ia")
    .select("cantidad_usos")
    .eq("user_id", user.id)
    .eq("fecha", hoy)
    .single();

  const usosHoy = uso?.cantidad_usos ?? 0;
  if (usosHoy >= LIMITE_DIARIO) {
    return NextResponse.json(
      { error: "Limite diario alcanzado", restantes: 0 },
      { status: 429 },
    );
  }

  // Build system prompt
  let systemPrompt = SYSTEM_PROMPT_BASE;
  if (categoria === "presentaciones") {
    systemPrompt += SYSTEM_PROMPT_PRESENTACIONES;
  }

  try {
    const mejorado = await mejorarPrompt(prompt, systemPrompt);

    // Increment usage
    if (uso) {
      await supabase
        .from("uso_ia")
        .update({ cantidad_usos: usosHoy + 1 })
        .eq("user_id", user.id)
        .eq("fecha", hoy);
    } else {
      await supabase
        .from("uso_ia")
        .insert({ user_id: user.id, fecha: hoy, cantidad_usos: 1 });
    }

    return NextResponse.json({
      mejorado,
      restantes: LIMITE_DIARIO - usosHoy - 1,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/openrouter.ts src/app/api/mejorar/route.ts
git commit -m "feat: add OpenRouter integration and /api/mejorar endpoint"
```

---

## Task 7: Auth components (AuthProvider rewrite, AuthGuard, middleware)

**Files:**
- Rewrite: `src/components/AuthProvider.tsx`
- Create: `src/components/AuthGuard.tsx`
- Modify: `src/middleware.ts`

- [ ] **Step 1: Rewrite AuthProvider with clean Supabase-only auth**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  async login() { return { ok: false, error: "No inicializado" }; },
  async logout() {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Create AuthGuard component**

```tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
```

- [ ] **Step 3: Update middleware.ts**

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // API routes handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 4: Commit**

```bash
git add src/components/AuthProvider.tsx src/components/AuthGuard.tsx src/middleware.ts
git commit -m "feat: rewrite auth with Supabase client SDK and add AuthGuard"
```

---

## Task 8: Navbar component

**Files:**
- Rewrite: `src/components/Navbar.tsx`

- [ ] **Step 1: Create PJENL-branded Navbar**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Wand2, BookMarked, Library, User, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/wizard", label: "Generar Prompt", icon: Wand2 },
  { href: "/mis-prompts", label: "Mis Prompts", icon: BookMarked },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-navy-deep border-b border-navy text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <span className="text-navy-deep font-bold text-sm">PJ</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">Generador de Prompts</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "bg-navy text-gold"
                    : "text-blue-mist hover:bg-navy hover:text-white"
                }`}
              >
                <Icon size={15} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}

          {user && (
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-mist hover:bg-navy hover:text-white transition-colors ml-2"
            >
              <LogOut size={15} />
              <span className="hidden md:inline">Salir</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: PJENL-branded navbar with navigation"
```

---

## Task 9: Wizard components (Stepper, CategoryPicker, TypePicker, PromptForm, PromptPreview)

**Files:**
- Create: `src/components/Stepper.tsx`
- Create: `src/components/CategoryPicker.tsx`
- Create: `src/components/TypePicker.tsx`
- Create: `src/components/PromptForm.tsx`
- Create: `src/components/PromptPreview.tsx`

- [ ] **Step 1: Create Stepper**

```tsx
"use client";

import { Check } from "lucide-react";

const STEPS = ["Categoria", "Tipo", "Datos", "Prompt"];

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const completed = step < currentStep;
        const active = step === currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                completed
                  ? "bg-green text-white"
                  : active
                    ? "bg-gold text-navy-deep"
                    : "bg-white border border-gray-300 text-gray-text"
              }`}
            >
              {completed ? <Check size={14} /> : step}
            </div>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                active ? "text-navy" : "text-gray-text"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  completed ? "bg-green" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create CategoryPicker**

```tsx
"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  FilePlus,
  BarChart3,
  MessageSquare,
  Presentation,
} from "lucide-react";
import { CATEGORIAS, type Categoria } from "@/content/plantillas";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  FileSearch,
  FilePlus,
  BarChart3,
  MessageSquare,
  Presentation,
};

interface CategoryPickerProps {
  onSelect: (categoria: Categoria) => void;
}

export default function CategoryPicker({ onSelect }: CategoryPickerProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-navy mb-1">Que necesitas hacer?</h2>
      <p className="text-sm text-gray-text mb-6">Selecciona una categoria para comenzar</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIAS.map((cat) => {
          const Icon = ICON_MAP[cat.icono] || FileSearch;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(cat)}
              className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gold hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-navy text-sm">{cat.nombre}</h3>
                <p className="text-xs text-gray-text mt-1">{cat.descripcion}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create TypePicker**

```tsx
"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PLANTILLAS, type Plantilla, type Categoria } from "@/content/plantillas";

interface TypePickerProps {
  categoria: Categoria;
  onSelect: (plantilla: Plantilla) => void;
  onBack: () => void;
}

export default function TypePicker({ categoria, onSelect, onBack }: TypePickerProps) {
  const filtered = PLANTILLAS.filter((p) => p.categoria === categoria.id);

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver
      </button>
      <h2 className="text-lg font-bold text-navy mb-1">{categoria.nombre}</h2>
      <p className="text-sm text-gray-text mb-6">Selecciona el tipo de prompt</p>
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((plantilla) => (
          <motion.button
            key={plantilla.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(plantilla)}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gold hover:shadow-md transition-all text-left"
          >
            <div>
              <h3 className="font-semibold text-navy text-sm">{plantilla.nombre}</h3>
              <p className="text-xs text-gray-text mt-0.5">{plantilla.descripcion}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create PromptForm**

```tsx
"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Plantilla } from "@/content/plantillas";

interface PromptFormProps {
  plantilla: Plantilla;
  onSubmit: (values: Record<string, string>) => void;
  onBack: () => void;
}

export default function PromptForm({ plantilla, onSubmit, onBack }: PromptFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const allRequiredFilled = plantilla.campos
    .filter((c) => c.requerido)
    .every((c) => values[c.id]?.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRequiredFilled) onSubmit(values);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver
      </button>
      <h2 className="text-lg font-bold text-navy mb-1">{plantilla.nombre}</h2>
      <p className="text-sm text-gray-text mb-6">Completa los datos para generar tu prompt</p>

      {plantilla.nota && (
        <div className="mb-6 p-3 rounded-lg bg-gold/10 border border-gold/30 text-sm text-navy">
          {plantilla.nota}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {plantilla.campos.map((campo) => (
          <div key={campo.id}>
            <label htmlFor={campo.id} className="block text-sm font-medium text-navy mb-1.5">
              {campo.label}
              {campo.requerido && <span className="text-red ml-1">*</span>}
            </label>

            {campo.tipo === "textarea" ? (
              <textarea
                id={campo.id}
                value={values[campo.id] || ""}
                onChange={(e) => handleChange(campo.id, e.target.value)}
                placeholder={campo.placeholder}
                required={campo.requerido}
                rows={4}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              />
            ) : campo.tipo === "select" ? (
              <select
                id={campo.id}
                value={values[campo.id] || ""}
                onChange={(e) => handleChange(campo.id, e.target.value)}
                required={campo.requerido}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              >
                <option value="">Selecciona una opcion...</option>
                {campo.opciones?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                id={campo.id}
                type={campo.tipo}
                value={values[campo.id] || ""}
                onChange={(e) => handleChange(campo.id, e.target.value)}
                placeholder={campo.placeholder}
                required={campo.requerido}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={!allRequiredFilled}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy text-white font-semibold py-3 shadow-md hover:-translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Generar prompt
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Create PromptPreview**

```tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Sparkles, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Plantilla } from "@/content/plantillas";

interface PromptPreviewProps {
  plantilla: Plantilla;
  promptGenerado: string;
  campos: Record<string, string>;
  onBack: () => void;
  onReset: () => void;
}

export default function PromptPreview({
  plantilla,
  promptGenerado,
  campos,
  onBack,
  onReset,
}: PromptPreviewProps) {
  const { session } = useAuth();
  const [copied, setCopied] = useState<"original" | "mejorado" | null>(null);
  const [mejorado, setMejorado] = useState<string | null>(null);
  const [mejorando, setMejorando] = useState(false);
  const [restantes, setRestantes] = useState<number | null>(null);
  const [errorMejora, setErrorMejora] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const copyToClipboard = async (text: string, type: "original" | "mejorado") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMejorar = async () => {
    if (!session?.access_token) return;
    setMejorando(true);
    setErrorMejora(null);

    try {
      const res = await fetch("/api/mejorar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: promptGenerado,
          categoria: plantilla.categoria,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMejora(data.error || "Error al mejorar");
        return;
      }

      setMejorado(data.mejorado);
      setRestantes(data.restantes);
    } catch {
      setErrorMejora("Error de conexion");
    } finally {
      setMejorando(false);
    }
  };

  const handleGuardar = async () => {
    if (!session?.user) return;
    setGuardando(true);

    const { error } = await supabase.from("prompts_guardados").insert({
      user_id: session.user.id,
      categoria: plantilla.categoria,
      tipo: plantilla.id,
      campos_completados: campos,
      prompt_generado: promptGenerado,
      prompt_mejorado: mejorado,
      es_publico: false,
    });

    if (!error) setGuardado(true);
    setGuardando(false);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <h2 className="text-lg font-bold text-navy mb-4">Tu prompt esta listo</h2>

      {plantilla.nota && (
        <div className="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/30 text-sm text-navy">
          {plantilla.nota}
        </div>
      )}

      {/* Original */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">
            {mejorado ? "Original" : "Prompt generado"}
          </span>
          <button
            onClick={() => copyToClipboard(promptGenerado, "original")}
            className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors"
          >
            {copied === "original" ? <Check size={14} className="text-green" /> : <Copy size={14} />}
            {copied === "original" ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-sm bg-white border border-gray-200 rounded-xl p-4 font-sans">
          {promptGenerado}
        </pre>
      </div>

      {/* Mejorado */}
      {mejorado && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">
              Mejorado con IA
            </span>
            <button
              onClick={() => copyToClipboard(mejorado, "mejorado")}
              className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors"
            >
              {copied === "mejorado" ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              {copied === "mejorado" ? "Copiado" : "Copiar"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm bg-navy/5 border border-gold/30 rounded-xl p-4 font-sans">
            {mejorado}
          </pre>
        </motion.div>
      )}

      {errorMejora && (
        <p className="mb-4 text-sm text-red bg-red/10 rounded-lg p-3">{errorMejora}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!mejorado && (
          <button
            onClick={handleMejorar}
            disabled={mejorando}
            className="flex items-center gap-2 rounded-xl bg-gold text-navy-deep font-semibold px-5 py-2.5 text-sm shadow-md hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            {mejorando ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {mejorando ? "Mejorando..." : "Mejorar con IA"}
          </button>
        )}

        <button
          onClick={handleGuardar}
          disabled={guardado || guardando}
          className="flex items-center gap-2 rounded-xl border border-navy text-navy font-semibold px-5 py-2.5 text-sm hover:bg-navy hover:text-white transition disabled:opacity-50"
        >
          {guardado ? <Check size={16} className="text-green" /> : <Save size={16} />}
          {guardado ? "Guardado" : guardando ? "Guardando..." : "Guardar"}
        </button>

        <button
          onClick={onReset}
          className="rounded-xl border border-gray-300 text-gray-text font-medium px-5 py-2.5 text-sm hover:border-navy hover:text-navy transition"
        >
          Nuevo prompt
        </button>
      </div>

      {restantes !== null && (
        <p className="mt-3 text-xs text-gray-text">
          Te quedan {restantes} mejoras con IA hoy
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Stepper.tsx src/components/CategoryPicker.tsx src/components/TypePicker.tsx src/components/PromptForm.tsx src/components/PromptPreview.tsx
git commit -m "feat: add wizard components (stepper, category, type, form, preview)"
```

---

## Task 10: Pages (wizard, dashboard, mis-prompts, biblioteca, perfil, login)

**Files:**
- Create: `src/app/wizard/page.tsx`
- Rewrite: `src/app/page.tsx`
- Create: `src/app/mis-prompts/page.tsx`
- Create: `src/app/biblioteca/page.tsx`
- Create: `src/app/perfil/page.tsx`
- Rewrite: `src/app/login/page.tsx`
- Create: `src/components/PromptCard.tsx`

- [ ] **Step 1: Create wizard page**

```tsx
"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Stepper from "@/components/Stepper";
import CategoryPicker from "@/components/CategoryPicker";
import TypePicker from "@/components/TypePicker";
import PromptForm from "@/components/PromptForm";
import PromptPreview from "@/components/PromptPreview";
import { renderTemplate } from "@/lib/prompts";
import type { Categoria, Plantilla } from "@/content/plantillas";

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [plantilla, setPlantilla] = useState<Plantilla | null>(null);
  const [campos, setCampos] = useState<Record<string, string>>({});
  const [promptGenerado, setPromptGenerado] = useState("");

  const handleCategorySelect = (cat: Categoria) => {
    setCategoria(cat);
    setStep(2);
  };

  const handleTypeSelect = (p: Plantilla) => {
    setPlantilla(p);
    setStep(3);
  };

  const handleFormSubmit = (values: Record<string, string>) => {
    setCampos(values);
    setPromptGenerado(renderTemplate(plantilla!.plantilla, values));
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setCategoria(null);
    setPlantilla(null);
    setCampos({});
    setPromptGenerado("");
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Stepper currentStep={step} />

        {step === 1 && <CategoryPicker onSelect={handleCategorySelect} />}
        {step === 2 && categoria && (
          <TypePicker
            categoria={categoria}
            onSelect={handleTypeSelect}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && plantilla && (
          <PromptForm
            plantilla={plantilla}
            onSubmit={handleFormSubmit}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && plantilla && (
          <PromptPreview
            plantilla={plantilla}
            promptGenerado={promptGenerado}
            campos={campos}
            onBack={() => setStep(3)}
            onReset={handleReset}
          />
        )}
      </main>
    </AuthGuard>
  );
}
```

- [ ] **Step 2: Rewrite dashboard (page.tsx)**

```tsx
"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wand2, BookMarked, Library } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const ACTIONS = [
  {
    href: "/wizard",
    icon: Wand2,
    title: "Generar Prompt",
    description: "Crea un prompt paso a paso con el wizard",
    color: "bg-gold",
  },
  {
    href: "/mis-prompts",
    icon: BookMarked,
    title: "Mis Prompts",
    description: "Revisa y reutiliza tus prompts guardados",
    color: "bg-navy",
  },
  {
    href: "/biblioteca",
    icon: Library,
    title: "Biblioteca",
    description: "Explora prompts compartidos por otros directores",
    color: "bg-navy/80",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">
            Bienvenido/a
          </h1>
          <p className="text-sm text-gray-text mt-1">
            {user?.email} — Generador de Prompts PJENL
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ACTIONS.map(({ href, icon: Icon, title, description, color }) => (
            <motion.div key={href} whileHover={{ y: -3 }}>
              <Link
                href={href}
                className="block p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gold transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h2 className="font-semibold text-navy text-sm">{title}</h2>
                <p className="text-xs text-gray-text mt-1">{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </AuthGuard>
  );
}
```

- [ ] **Step 3: Create PromptCard component**

```tsx
"use client";

import { useState } from "react";
import { Copy, Check, Globe, Lock, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PLANTILLAS, CATEGORIAS } from "@/content/plantillas";

interface PromptCardProps {
  id: string;
  categoria: string;
  tipo: string;
  prompt_generado: string;
  prompt_mejorado: string | null;
  es_publico: boolean;
  created_at: string;
  showControls?: boolean;
  onDelete?: () => void;
}

export default function PromptCard({
  id,
  categoria,
  tipo,
  prompt_generado,
  prompt_mejorado,
  es_publico,
  created_at,
  showControls = false,
  onDelete,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [publico, setPublico] = useState(es_publico);
  const [expanded, setExpanded] = useState(false);

  const catName = CATEGORIAS.find((c) => c.id === categoria)?.nombre ?? categoria;
  const plantillaName = PLANTILLAS.find((p) => p.id === tipo)?.nombre ?? tipo;
  const bestPrompt = prompt_mejorado || prompt_generado;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bestPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePublico = async () => {
    const newVal = !publico;
    await supabase
      .from("prompts_guardados")
      .update({ es_publico: newVal })
      .eq("id", id);
    setPublico(newVal);
  };

  const handleDelete = async () => {
    await supabase.from("prompts_guardados").delete().eq("id", id);
    onDelete?.();
  };

  const fecha = new Date(created_at).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-[10px] font-semibold text-gold uppercase tracking-wide">
            {catName}
          </span>
          <h3 className="text-sm font-semibold text-navy">{plantillaName}</h3>
        </div>
        <span className="text-[10px] text-gray-text">{fecha}</span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gray-text hover:text-navy transition-colors mb-2"
      >
        {expanded ? "Ocultar" : "Ver prompt"}
      </button>

      {expanded && (
        <pre className="whitespace-pre-wrap text-xs bg-gray-bg rounded-lg p-3 mb-3 font-sans max-h-48 overflow-y-auto">
          {bestPrompt}
        </pre>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors"
        >
          {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
          {copied ? "Copiado" : "Copiar"}
        </button>

        {showControls && (
          <>
            <button
              onClick={togglePublico}
              className="flex items-center gap-1 text-xs font-medium text-gray-text hover:text-navy transition-colors ml-auto"
            >
              {publico ? <Globe size={13} className="text-green" /> : <Lock size={13} />}
              {publico ? "Publico" : "Privado"}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs font-medium text-gray-text hover:text-red transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create mis-prompts page**

```tsx
"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

interface PromptRow {
  id: string;
  categoria: string;
  tipo: string;
  prompt_generado: string;
  prompt_mejorado: string | null;
  es_publico: boolean;
  created_at: string;
}

export default function MisPromptsPage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrompts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("prompts_guardados")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setPrompts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrompts();
  }, [user]);

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-navy mb-1">Mis Prompts</h1>
        <p className="text-sm text-gray-text mb-6">
          Tus prompts guardados. Usa el toggle para compartirlos en la biblioteca.
        </p>

        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 text-gray-text">
            <p className="text-sm">Aun no tienes prompts guardados</p>
            <a href="/wizard" className="text-sm text-gold font-semibold hover:underline mt-2 inline-block">
              Genera tu primer prompt
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                {...p}
                showControls
                onDelete={fetchPrompts}
              />
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
```

- [ ] **Step 5: Create biblioteca page**

```tsx
"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";
import { supabase } from "@/lib/supabase";
import { CATEGORIAS } from "@/content/plantillas";

interface PromptRow {
  id: string;
  categoria: string;
  tipo: string;
  prompt_generado: string;
  prompt_mejorado: string | null;
  es_publico: boolean;
  created_at: string;
}

export default function BibliotecaPage() {
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const fetchPublicos = async () => {
      let query = supabase
        .from("prompts_guardados")
        .select("*")
        .eq("es_publico", true)
        .order("created_at", { ascending: false });

      if (filtro !== "todos") {
        query = query.eq("categoria", filtro);
      }

      const { data } = await query;
      setPrompts(data ?? []);
      setLoading(false);
    };

    fetchPublicos();
  }, [filtro]);

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-navy mb-1">Biblioteca</h1>
        <p className="text-sm text-gray-text mb-6">
          Prompts compartidos por otros directores del PJENL
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filtro === "todos"
                ? "bg-navy text-white"
                : "bg-white border border-gray-200 text-gray-text hover:border-navy"
            }`}
          >
            Todos
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltro(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtro === cat.id
                  ? "bg-navy text-white"
                  : "bg-white border border-gray-200 text-gray-text hover:border-navy"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 text-gray-text">
            <p className="text-sm">No hay prompts compartidos aun</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((p) => (
              <PromptCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
```

- [ ] **Step 6: Create perfil page**

```tsx
"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-navy mb-6">Perfil</h1>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">
                Correo electronico
              </span>
              <p className="text-sm text-navy font-medium mt-1">{user?.email}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">
                ID de usuario
              </span>
              <p className="text-xs text-gray-text font-mono mt-1">{user?.id}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-2 rounded-xl border border-red text-red font-semibold px-5 py-2.5 text-sm hover:bg-red hover:text-white transition"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </main>
    </AuthGuard>
  );
}
```

- [ ] **Step 7: Rewrite login page with PJENL branding**

```tsx
"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    router.push(nextUrl);
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    if (result.ok) {
      router.push(nextUrl);
    } else {
      setError(result.error || "Error al iniciar sesion");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold mx-auto flex items-center justify-center mb-4">
            <span className="text-navy-deep font-bold text-xl">PJ</span>
          </div>
          <h1 className="text-xl font-bold text-navy">Generador de Prompts</h1>
          <p className="text-sm text-gray-text mt-1">Poder Judicial del Estado de Nuevo Leon</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg space-y-4"
        >
          <div>
            <label htmlFor="email" className="text-sm font-medium text-navy flex items-center gap-1.5 mb-1.5">
              <Mail size={14} />
              Correo electronico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-navy flex items-center gap-1.5 mb-1.5">
              <LockKeyhole size={14} />
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red bg-red/10 rounded-lg p-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy text-white font-semibold py-3 shadow-md hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            {submitting ? "Verificando..." : <><LogIn size={16} /> Iniciar sesion</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-bg">
          <p className="text-sm text-gray-text">Cargando...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/wizard/page.tsx src/app/page.tsx src/components/PromptCard.tsx src/app/mis-prompts/page.tsx src/app/biblioteca/page.tsx src/app/perfil/page.tsx src/app/login/page.tsx
git commit -m "feat: add all pages — wizard, dashboard, mis-prompts, biblioteca, perfil, login"
```

---

## Task 11: Update README

**Files:**
- Rewrite: `README.md`

- [ ] **Step 1: Write new README**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README for prompt generator"
```

---

## Task 12: Build verification

- [ ] **Step 1: Run tests**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 3: Fix any build errors found**

Address any TypeScript or build issues that arise.

- [ ] **Step 4: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build issues"
```
