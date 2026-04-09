# Productividad Personal — Design Spec

## Resumen

Agregar 3 secciones de productividad personal a la app del generador de prompts PJENL: Prompt del Dia, Tips Rapidos, y FAQ. El contenido de Prompt del Dia y Tips se genera automaticamente via IA (OpenRouter/Qwen). El FAQ es contenido estatico.

## Decisiones de diseno

| Decision | Eleccion |
|---|---|
| Prompt del dia | Generado diariamente por IA via cron |
| Tips rapidos | Generados semanalmente por IA (3 por semana) via cron |
| FAQ | Estatico en archivo TypeScript |
| Cron | Vercel Cron Jobs (vercel.json) |
| Proteccion cron | CRON_SECRET header |

---

## Paginas y rutas nuevas

| Ruta | Descripcion |
|---|---|
| `/prompt-del-dia` | Prompt destacado del dia con ejemplo aplicado al PJENL |
| `/tips` | Lista de tips rapidos, los mas recientes primero |
| `/faq` | Preguntas frecuentes sobre uso de IA en el PJENL |

Dashboard (`/`) se actualiza: muestra preview del prompt del dia arriba de las tarjetas, y agrega 3 tarjetas nuevas para las secciones.

---

## Modelo de datos (Neon)

### Tabla: prompt_del_dia

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auto-generado |
| titulo | text | Titulo corto del prompt |
| categoria | text | Categoria del prompt (analizar, generar, etc.) |
| prompt_texto | text | El prompt completo |
| ejemplo_uso | text | Ejemplo de como usarlo en contexto PJENL |
| fecha | date (unique) | Dia al que corresponde |
| created_at | timestamptz | auto |

### Tabla: tips

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auto-generado |
| titulo | text | Titulo corto del tip |
| contenido | text | Contenido del tip |
| created_at | timestamptz | auto |

### FAQ: archivo estatico

`src/content/faq.ts` con array de { pregunta, respuesta, orden }.

---

## API routes

| Ruta | Metodo | Descripcion | Auth |
|---|---|---|---|
| `/api/prompt-del-dia` | GET | Devuelve prompt de hoy (o el mas reciente) | Cloudflare Access |
| `/api/tips` | GET | Devuelve los ultimos 20 tips | Cloudflare Access |
| `/api/cron/generar-prompt` | POST | Genera prompt del dia via OpenRouter | CRON_SECRET |
| `/api/cron/generar-tips` | POST | Genera 3 tips semanales via OpenRouter | CRON_SECRET |

---

## Cron jobs (vercel.json)

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

Schedule: 12:00 UTC = 6:00 AM hora Monterrey (UTC-6).

---

## Generacion de contenido

### System prompt para Prompt del Dia

```
Eres un experto en IA aplicada al Poder Judicial del Estado de Nuevo Leon.
Genera un "Prompt del Dia" que sea practico y listo para usar en Claude.

El prompt debe:
- Estar enfocado en una tarea real que un director del PJENL podria necesitar
- Ser de una de estas categorias: Analizar Documentos, Generar Documentos, De Datos a Decisiones, Comunicar y Adaptar, Presentaciones
- Incluir un ejemplo concreto de como usarlo

Responde en JSON con este formato exacto:
{"titulo": "...", "categoria": "...", "prompt_texto": "...", "ejemplo_uso": "..."}

No incluyas explicaciones fuera del JSON.
```

### System prompt para Tips

```
Eres un experto en IA aplicada al Poder Judicial del Estado de Nuevo Leon.
Genera 3 tips rapidos sobre como usar IA de manera mas efectiva.

Cada tip debe:
- Ser conciso (2-3 oraciones maximo)
- Ser practico y aplicable inmediatamente
- Estar orientado a directores y personal administrativo del poder judicial
- No repetir tips anteriores

Responde en JSON con este formato exacto:
[{"titulo": "...", "contenido": "..."}, {"titulo": "...", "contenido": "..."}, {"titulo": "...", "contenido": "..."}]

No incluyas explicaciones fuera del JSON.
```

---

## FAQ base (contenido estatico)

10 preguntas frecuentes iniciales:

1. Que es un prompt y como funciona?
2. Que modelo de IA debo usar?
3. Puedo subir documentos confidenciales a Claude?
4. Por que la IA a veces inventa informacion?
5. Como mejoro los resultados que me da la IA?
6. Puedo usar la IA para redactar sentencias o acuerdos oficiales?
7. Que pasa si la IA cita un articulo de ley que no existe?
8. Cuantas veces puedo usar "Mejorar con IA"?
9. Como comparto un prompt con otros directores?
10. Donde puedo aprender mas sobre IA?

---

## UI

### Prompt del Dia (pagina)
- Tarjeta destacada con badge de categoria
- Prompt completo en bloque copiable
- Seccion "Como usarlo" con el ejemplo
- Boton "Copiar prompt"
- Navegacion a dias anteriores (flechas < >)

### Tips (pagina)
- Lista de tarjetas con titulo y contenido
- Paginacion o scroll infinito (ultimos 20)

### FAQ (pagina)
- Acordeones expandibles (pregunta/respuesta)
- Estilo institucional PJENL

### Dashboard (actualizado)
- Nuevo bloque arriba: "Prompt del Dia" con preview y link
- 3 tarjetas nuevas: Prompt del Dia, Tips, FAQ (junto a las 3 existentes, grid de 2x3 o 3x2)

---

## Archivos nuevos

```
src/app/prompt-del-dia/page.tsx
src/app/tips/page.tsx
src/app/faq/page.tsx
src/app/api/prompt-del-dia/route.ts
src/app/api/tips/route.ts
src/app/api/cron/generar-prompt/route.ts
src/app/api/cron/generar-tips/route.ts
src/content/faq.ts
src/content/cron-prompts.ts (system prompts para generacion)
vercel.json (cron config)
```

## Archivos modificados

```
src/app/page.tsx (dashboard - agregar prompt del dia y tarjetas nuevas)
src/components/Navbar.tsx (agregar links a nuevas secciones)
```

## Variables de entorno nuevas

```
CRON_SECRET=<string aleatorio para proteger endpoints cron>
```
