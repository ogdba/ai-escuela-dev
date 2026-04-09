# Productivity Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 productivity sections (Prompt del Dia, Tips Rapidos, FAQ) with auto-generated content via cron jobs to the PJENL prompt generator app.

**Architecture:** New DB tables for prompt_del_dia and tips, static file for FAQ. Cron endpoints generate content via OpenRouter/Qwen. New pages display the content. Dashboard updated with preview widget and new navigation cards.

**Tech Stack:** Next.js 16, Neon PostgreSQL, OpenRouter/Qwen 3.5, Vercel Cron Jobs, Tailwind v4

**Remote server:** All work on `root@93.188.161.144` at `/root/projects/PJENL/ai-escuela-dev` via SSH.

---

## File Map

### Files to CREATE
- `src/content/faq.ts` — static FAQ data
- `src/content/cron-prompts.ts` — system prompts for content generation
- `src/lib/generate.ts` — shared function to call OpenRouter and parse JSON response
- `src/app/api/prompt-del-dia/route.ts` — GET today's prompt
- `src/app/api/tips/route.ts` — GET latest tips
- `src/app/api/cron/generar-prompt/route.ts` — cron: generate daily prompt
- `src/app/api/cron/generar-tips/route.ts` — cron: generate weekly tips
- `src/app/prompt-del-dia/page.tsx` — prompt of the day page
- `src/app/tips/page.tsx` — tips listing page
- `src/app/faq/page.tsx` — FAQ page
- `vercel.json` — cron job configuration

### Files to MODIFY
- `src/app/page.tsx` — add prompt del dia preview + 3 new action cards
- `src/components/Navbar.tsx` — add link to productivity section

---

## Task 1: Database tables

**Files:**
- No source files — SQL migration via neonctl

- [ ] **Step 1: Create prompt_del_dia table**

```bash
neonctl connection-string --project-id bold-morning-01599241 --org-id org-wispy-hall-68012166 --psql -- -c "
CREATE TABLE IF NOT EXISTS prompt_del_dia (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  categoria text NOT NULL,
  prompt_texto text NOT NULL,
  ejemplo_uso text NOT NULL,
  fecha date UNIQUE NOT NULL DEFAULT current_date,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_prompt_dia_fecha ON prompt_del_dia(fecha);
"
```

- [ ] **Step 2: Create tips table**

```bash
neonctl connection-string --project-id bold-morning-01599241 --org-id org-wispy-hall-68012166 --psql -- -c "
CREATE TABLE IF NOT EXISTS tips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  contenido text NOT NULL,
  created_at timestamptz DEFAULT now()
);
"
```

- [ ] **Step 3: Verify tables**

```bash
neonctl connection-string --project-id bold-morning-01599241 --org-id org-wispy-hall-68012166 --psql -- -c "\dt prompt_del_dia; \dt tips;"
```

---

## Task 2: FAQ static content and cron system prompts

**Files:**
- Create: `src/content/faq.ts`
- Create: `src/content/cron-prompts.ts`

- [ ] **Step 1: Create faq.ts**

```typescript
export interface FaqItem {
  pregunta: string;
  respuesta: string;
  orden: number;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    pregunta: "Que es un prompt y como funciona?",
    respuesta: "Un prompt es la instruccion que le das a una IA como Claude para que realice una tarea. Entre mas especifico y estructurado sea tu prompt, mejores resultados obtendras. Piensa en el prompt como las instrucciones que le darias a un asistente nuevo: necesita contexto, objetivo claro y formato esperado.",
    orden: 1,
  },
  {
    pregunta: "Que modelo de IA debo usar?",
    respuesta: "Para trabajo institucional del PJENL recomendamos Claude (de Anthropic). Es el modelo mas capaz para documentos largos, analisis juridico y generacion de textos formales. ChatGPT y Gemini tambien funcionan, pero los prompts de esta herramienta estan optimizados para Claude.",
    orden: 2,
  },
  {
    pregunta: "Puedo subir documentos confidenciales a Claude?",
    respuesta: "Ten precaucion. No subas expedientes judiciales con datos personales de las partes, informacion clasificada como reservada o confidencial, ni datos que puedan comprometer procesos activos. Para documentos administrativos internos (presupuestos, estadisticas agregadas, circulares publicas) generalmente no hay problema.",
    orden: 3,
  },
  {
    pregunta: "Por que la IA a veces inventa informacion?",
    respuesta: "Esto se llama 'alucinacion'. La IA genera texto que suena correcto pero puede contener datos falsos — especialmente citas de leyes, articulos especificos o estadisticas. Siempre verifica la informacion que la IA genera, particularmente fundamentos legales y datos numericos.",
    orden: 4,
  },
  {
    pregunta: "Como mejoro los resultados que me da la IA?",
    respuesta: "Tres reglas: 1) Se especifico — en lugar de 'hazme un resumen', di 'resume en 5 puntos de maximo 2 oraciones cada uno'. 2) Da contexto — menciona que eres del PJENL, para quien es el documento, y que formato necesitas. 3) Usa el boton 'Mejorar con IA' de esta herramienta, que optimiza tu prompt automaticamente.",
    orden: 5,
  },
  {
    pregunta: "Puedo usar la IA para redactar sentencias o acuerdos oficiales?",
    respuesta: "La IA puede generar borradores que te sirvan como punto de partida, pero NUNCA deben usarse tal cual sin revision humana. El criterio juridico, la valoracion de pruebas y la fundamentacion legal son responsabilidad del juzgador. Usa la IA como asistente, no como sustituto.",
    orden: 6,
  },
  {
    pregunta: "Que pasa si la IA cita un articulo de ley que no existe?",
    respuesta: "Es un error comun. La IA puede inventar numeros de articulos o mezclar contenido de diferentes ordenamientos. Siempre verifica cada cita legal contra el texto oficial de la ley. El prompt 'Mejorar con IA' incluye instrucciones para que la IA no invente fundamentos, pero la verificacion humana sigue siendo indispensable.",
    orden: 7,
  },
  {
    pregunta: "Cuantas veces puedo usar Mejorar con IA?",
    respuesta: "Tienes 20 mejoras disponibles por dia. El contador se reinicia a medianoche (hora de Monterrey). Generar prompts con las plantillas no tiene limite — solo la funcion de mejora con IA tiene este tope para controlar costos.",
    orden: 8,
  },
  {
    pregunta: "Como comparto un prompt con otros directores?",
    respuesta: "Despues de generar y guardar un prompt, ve a 'Mis Prompts'. Cada prompt tiene un toggle 'Privado/Publico'. Al marcarlo como publico, aparecera en la seccion 'Biblioteca' donde otros directores del PJENL pueden verlo y copiarlo.",
    orden: 9,
  },
  {
    pregunta: "Donde puedo aprender mas sobre IA?",
    respuesta: "Consulta la seccion de Tips Rapidos en esta misma plataforma — se actualiza semanalmente con consejos practicos. Para profundizar, el sitio de Anthropic (anthropic.com) tiene guias sobre como usar Claude efectivamente. Y recuerda: la mejor forma de aprender es practicar — usa esta herramienta todos los dias.",
    orden: 10,
  },
];
```

- [ ] **Step 2: Create cron-prompts.ts**

```typescript
export const PROMPT_DEL_DIA_SYSTEM = `Eres un experto en IA aplicada al Poder Judicial del Estado de Nuevo Leon (PJENL).
Genera un "Prompt del Dia" que sea practico y listo para usar en Claude.

El prompt debe:
- Estar enfocado en una tarea real que un director del PJENL podria necesitar
- Ser de una de estas categorias: analizar, generar, datos, comunicar, presentaciones
- Incluir un ejemplo concreto de como usarlo en el contexto del PJENL
- Ser diferente cada dia — varia entre categorias y tipos de tareas

Responde UNICAMENTE con un JSON valido (sin bloques de codigo, sin explicaciones):
{"titulo": "string", "categoria": "string", "prompt_texto": "string", "ejemplo_uso": "string"}`;

export const TIPS_SYSTEM = `Eres un experto en IA aplicada al Poder Judicial del Estado de Nuevo Leon (PJENL).
Genera 3 tips rapidos sobre como usar IA de manera mas efectiva.

Cada tip debe:
- Ser conciso (2-3 oraciones maximo)
- Ser practico y aplicable inmediatamente
- Estar orientado a directores y personal administrativo del poder judicial
- Cubrir temas variados: mejores prompts, errores comunes, trucos de productividad, mejores practicas

Responde UNICAMENTE con un JSON valido (sin bloques de codigo, sin explicaciones):
[{"titulo": "string", "contenido": "string"}, {"titulo": "string", "contenido": "string"}, {"titulo": "string", "contenido": "string"}]`;
```

- [ ] **Step 3: Commit**

```bash
git add src/content/faq.ts src/content/cron-prompts.ts
git commit -m "feat: add FAQ content and system prompts for cron generation"
```

---

## Task 3: Generate helper and API routes for content

**Files:**
- Create: `src/lib/generate.ts`
- Create: `src/app/api/prompt-del-dia/route.ts`
- Create: `src/app/api/tips/route.ts`
- Create: `src/app/api/cron/generar-prompt/route.ts`
- Create: `src/app/api/cron/generar-tips/route.ts`

- [ ] **Step 1: Create generate.ts — shared OpenRouter caller with JSON parsing**

```typescript
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
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
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2048,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${error}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  // Strip markdown code fences if present
  const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as T;
}
```

- [ ] **Step 2: Create /api/prompt-del-dia/route.ts**

```typescript
import { NextResponse } from "next/server";
import { getCfUser } from "@/lib/cf-auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, titulo, categoria, prompt_texto, ejemplo_uso, fecha
    FROM prompt_del_dia ORDER BY fecha DESC LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.json(null);
  }

  return NextResponse.json(rows[0]);
}
```

Create directory: `mkdir -p src/app/api/prompt-del-dia`

- [ ] **Step 3: Create /api/tips/route.ts**

```typescript
import { NextResponse } from "next/server";
import { getCfUser } from "@/lib/cf-auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, titulo, contenido, created_at
    FROM tips ORDER BY created_at DESC LIMIT 20
  `;

  return NextResponse.json(rows);
}
```

Create directory: `mkdir -p src/app/api/tips`

- [ ] **Step 4: Create /api/cron/generar-prompt/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateJSON } from "@/lib/generate";
import { PROMPT_DEL_DIA_SYSTEM } from "@/content/cron-prompts";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Monterrey" });

  const sql = getDb();

  // Check if today already has a prompt
  const existing = await sql`SELECT id FROM prompt_del_dia WHERE fecha = ${hoy}::date`;
  if (existing.length > 0) {
    return NextResponse.json({ message: "Ya existe prompt para hoy" });
  }

  const data = await generateJSON<{
    titulo: string;
    categoria: string;
    prompt_texto: string;
    ejemplo_uso: string;
  }>(PROMPT_DEL_DIA_SYSTEM, `Genera el prompt del dia para ${hoy}. Categoria sugerida: ${["analizar", "generar", "datos", "comunicar", "presentaciones"][Math.floor(Math.random() * 5)]}`);

  await sql`
    INSERT INTO prompt_del_dia (titulo, categoria, prompt_texto, ejemplo_uso, fecha)
    VALUES (${data.titulo}, ${data.categoria}, ${data.prompt_texto}, ${data.ejemplo_uso}, ${hoy}::date)
  `;

  return NextResponse.json({ message: "Prompt generado", data });
}
```

Create directory: `mkdir -p src/app/api/cron/generar-prompt`

- [ ] **Step 5: Create /api/cron/generar-tips/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateJSON } from "@/lib/generate";
import { TIPS_SYSTEM } from "@/content/cron-prompts";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const data = await generateJSON<{ titulo: string; contenido: string }[]>(
    TIPS_SYSTEM,
    "Genera 3 tips nuevos para esta semana sobre uso de IA en el Poder Judicial."
  );

  const sql = getDb();
  for (const tip of data) {
    await sql`INSERT INTO tips (titulo, contenido) VALUES (${tip.titulo}, ${tip.contenido})`;
  }

  return NextResponse.json({ message: "Tips generados", count: data.length });
}
```

Create directory: `mkdir -p src/app/api/cron/generar-tips`

- [ ] **Step 6: Commit**

```bash
git add src/lib/generate.ts src/app/api/prompt-del-dia/route.ts src/app/api/tips/route.ts src/app/api/cron/generar-prompt/route.ts src/app/api/cron/generar-tips/route.ts
git commit -m "feat: add API routes for prompt del dia, tips, and cron generation"
```

---

## Task 4: Pages (prompt-del-dia, tips, faq)

**Files:**
- Create: `src/app/prompt-del-dia/page.tsx`
- Create: `src/app/tips/page.tsx`
- Create: `src/app/faq/page.tsx`

- [ ] **Step 1: Create prompt-del-dia page**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

interface PromptDia {
  id: string;
  titulo: string;
  categoria: string;
  prompt_texto: string;
  ejemplo_uso: string;
  fecha: string;
}

export default function PromptDelDiaPage() {
  const [prompt, setPrompt] = useState<PromptDia | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/prompt-del-dia")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { setPrompt(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt.prompt_texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const catColors: Record<string, string> = {
    analizar: "bg-blue-100 text-blue-800",
    generar: "bg-emerald-100 text-emerald-800",
    datos: "bg-purple-100 text-purple-800",
    comunicar: "bg-amber-100 text-amber-800",
    presentaciones: "bg-rose-100 text-rose-800",
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Prompt del Dia</h1>
        </div>

        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : !prompt ? (
          <div className="text-center py-12 text-gray-text">
            <p className="text-sm">Aun no hay prompts generados. Vuelve manana.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${catColors[prompt.categoria] || "bg-gray-100 text-gray-800"}`}>
                  {prompt.categoria}
                </span>
                <span className="text-xs text-gray-text">
                  {new Date(prompt.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-navy mb-4">{prompt.titulo}</h2>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">Prompt</span>
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors">
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-gray-bg border border-gray-200 rounded-xl p-4 font-sans">{prompt.prompt_texto}</pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wide">Como usarlo</span>
                <p className="mt-2 text-sm text-gray-700">{prompt.ejemplo_uso}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
```

Create directory: `mkdir -p src/app/prompt-del-dia`

- [ ] **Step 2: Create tips page**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Tip {
  id: string;
  titulo: string;
  contenido: string;
  created_at: string;
}

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tips")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { setTips(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Tips Rapidos</h1>
        </div>

        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : tips.length === 0 ? (
          <div className="text-center py-12 text-gray-text">
            <p className="text-sm">Aun no hay tips. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <div key={tip.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb size={16} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy">{tip.titulo}</h3>
                    <p className="text-sm text-gray-700 mt-1">{tip.contenido}</p>
                    <span className="text-[10px] text-gray-text mt-2 inline-block">
                      {new Date(tip.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
```

Create directory: `mkdir -p src/app/tips`

- [ ] **Step 3: Create faq page**

```tsx
"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import { FAQ_ITEMS } from "@/content/faq";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Preguntas Frecuentes</h1>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold text-navy pr-4">{item.pregunta}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-text shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-gray-700">{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
```

Create directory: `mkdir -p src/app/faq`

- [ ] **Step 4: Commit**

```bash
git add src/app/prompt-del-dia/page.tsx src/app/tips/page.tsx src/app/faq/page.tsx
git commit -m "feat: add prompt del dia, tips, and FAQ pages"
```

---

## Task 5: Update dashboard and navbar

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Rewrite dashboard with prompt del dia preview and 6 action cards**

```tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wand2, BookMarked, Library, Sparkles, Lightbulb, HelpCircle, Copy, Check } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface PromptDia {
  titulo: string;
  categoria: string;
  prompt_texto: string;
  fecha: string;
}

const ACTIONS = [
  { href: "/wizard", icon: Wand2, title: "Generar Prompt", description: "Crea un prompt paso a paso con el wizard", color: "bg-gold" },
  { href: "/mis-prompts", icon: BookMarked, title: "Mis Prompts", description: "Revisa y reutiliza tus prompts guardados", color: "bg-navy" },
  { href: "/biblioteca", icon: Library, title: "Biblioteca", description: "Prompts compartidos por otros directores", color: "bg-navy/80" },
  { href: "/prompt-del-dia", icon: Sparkles, title: "Prompt del Dia", description: "Un prompt nuevo cada dia para inspirarte", color: "bg-gold/80" },
  { href: "/tips", icon: Lightbulb, title: "Tips Rapidos", description: "Consejos semanales para usar IA mejor", color: "bg-navy/60" },
  { href: "/faq", icon: HelpCircle, title: "FAQ", description: "Respuestas a preguntas frecuentes sobre IA", color: "bg-navy/40" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [promptDia, setPromptDia] = useState<PromptDia | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/prompt-del-dia")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPromptDia(data))
      .catch(() => {});
  }, []);

  const handleCopy = async () => {
    if (!promptDia) return;
    await navigator.clipboard.writeText(promptDia.prompt_texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">Bienvenido/a</h1>
          <p className="text-sm text-gray-text mt-1">{user?.email} — Generador de Prompts PJENL</p>
        </div>

        {promptDia && (
          <Link href="/prompt-del-dia" className="block mb-6">
            <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-gold/30 bg-gold/5 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold" />
                  <span className="text-xs font-semibold text-gold uppercase tracking-wide">Prompt del Dia</span>
                </div>
                <button onClick={(e) => { e.preventDefault(); handleCopy(); }} className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors">
                  {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <h3 className="text-sm font-semibold text-navy">{promptDia.titulo}</h3>
              <p className="text-xs text-gray-text mt-1 line-clamp-2">{promptDia.prompt_texto}</p>
            </motion.div>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ACTIONS.map(({ href, icon: Icon, title, description, color }) => (
            <motion.div key={href} whileHover={{ y: -3 }}>
              <Link href={href} className="block p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gold transition-all">
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
    </>
  );
}
```

- [ ] **Step 2: Update Navbar — add dropdown or link for productivity sections**

Add a "Mas" dropdown or simply add the prompt-del-dia link. Keep it simple — just add one link for "Tips" since it's the most browseable section:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Wand2, BookMarked, Library, User, LogOut, Lightbulb } from "lucide-react";

const NAV_ITEMS = [
  { href: "/wizard", label: "Generar Prompt", icon: Wand2 },
  { href: "/mis-prompts", label: "Mis Prompts", icon: BookMarked },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/tips", label: "Tips", icon: Lightbulb },
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

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/components/Navbar.tsx
git commit -m "feat: update dashboard with prompt del dia preview and productivity cards"
```

---

## Task 6: Vercel cron config, env var, and seed data

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "crons": [
    {
      "path": "/api/cron/generar-prompt",
      "schedule": "0 12 * * *"
    },
    {
      "path": "/api/cron/generar-tips",
      "schedule": "0 12 * * 1"
    }
  ]
}
```

- [ ] **Step 2: Add CRON_SECRET env var to Vercel**

```bash
vercel env add CRON_SECRET production
# Value: pjenl-cron-secret-2026
```

- [ ] **Step 3: Seed initial data by calling the cron endpoints manually**

After deploy, trigger both endpoints to populate initial content:

```bash
curl -X POST https://pjenl.space/api/cron/generar-prompt -H "Authorization: Bearer pjenl-cron-secret-2026"
curl -X POST https://pjenl.space/api/cron/generar-tips -H "Authorization: Bearer pjenl-cron-secret-2026"
```

- [ ] **Step 4: Commit and push**

```bash
git add vercel.json
git commit -m "feat: add Vercel cron config for daily prompt and weekly tips"
git push origin main
```

---

## Task 7: Build verification

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 2: Fix any issues**

- [ ] **Step 3: Commit fixes if needed and push**

```bash
git add -A
git commit -m "fix: resolve build issues"
git push origin main
```
