# Generador de Prompts PJENL — Design Spec

## Resumen

Transformar la app existente (plataforma educativa "Escuela IA") en un **generador de prompts institucionales para el PJENL**. Los directores del Poder Judicial acceden a un wizard paso a paso que los guia para generar prompts especificos listos para copiar y pegar en Claude. Los prompts se pueden guardar y opcionalmente compartir con otros directores.

## Decisiones de diseno

| Decision | Eleccion | Alternativas descartadas |
|---|---|---|
| Flujo principal | Wizard lineal de 4 pasos | Conversacional, adaptativo |
| Autenticacion | Login individual con Supabase | Sin login, codigo compartido |
| Persistencia | Guardado por usuario + biblioteca compartida (opt-in, default privado) | Sin guardar, solo compartidos |
| Mejora con IA | Hibrido: plantillas fijas + boton "Mejorar con IA" | Solo plantillas, solo IA |
| Motor de IA | OpenRouter - Qwen 3.5 | Claude API directa |
| Control de uso IA | 20 mejoras/usuario/dia, API key centralizada | Sin limite, API key por usuario |
| Look and feel | Institucional PJENL (navy #0D2B5E, gold #C9A227) | Moderno/tech, minimalista |
| Modo oscuro | No en esta version | - |

---

## Paginas y rutas

| Ruta | Descripcion | Auth requerida |
|---|---|---|
| `/login` | Login con Supabase (email/password) | No |
| `/` | Dashboard - acceso a wizard, prompts guardados, biblioteca | Si |
| `/wizard` | Wizard de 4 pasos para generar prompts | Si |
| `/mis-prompts` | Historial de prompts del usuario con toggle publico/privado | Si |
| `/biblioteca` | Prompts compartidos por otros directores (solo publicos) | Si |
| `/perfil` | Datos del usuario | Si |

---

## Flujo del wizard

Paso 1: Categoria
- Analizar Documentos
- Generar Documentos
- De Datos a Decisiones
- Comunicar y Adaptar
- Presentaciones

Paso 2: Tipo de prompt
- Opciones filtradas por categoria seleccionada

Paso 3: Formulario
- Campos dinamicos segun el tipo (los [ENTRE CORCHETES] convertidos en inputs)
- Campos obligatorios y opcionales

Paso 4: Preview + Acciones
- Prompt generado listo
- Boton "Copiar al portapapeles"
- Boton "Mejorar con IA" (contra limite diario)
- Boton "Guardar" (privado por defecto)

---

## Categorias y plantillas

| Categoria | Tipos de prompt | Campos variables principales |
|---|---|---|
| Analizar Documentos | Circular/Acuerdo, Presupuesto, Datos Judiciales, Nota Periodistica | Tipo de documento, contexto adicional |
| Generar Documentos | Oficio Administrativo, Proyecto de Acuerdo, Boletin de Prensa, Reporte con Graficas | Numero de oficio, destinatario, cargo, monto, medidas, detalles del evento, periodo |
| De Datos a Decisiones | Preguntas a Datos, Comparativo entre Periodos, Analisis a Entregable | Preguntas especificas, periodos a comparar |
| Comunicar y Adaptar | Un Contenido Tres Audiencias, Responder Correo, Revision de Texto | Texto/comunicado, correo recibido, tipo de respuesta, tono deseado |
| Presentaciones | Generar Presentacion desde Bullets | Tema, audiencia, puntos a cubrir, numero de slides |

Los prompts que requieren subir archivos muestran nota: "Recuerda subir el archivo en Claude antes de pegar este prompt".

Total: 13 plantillas (5 categorias x 2-3 tipos + prompts de respaldo).

---

## Modelo de datos (Supabase)

### Tabla: prompts_guardados

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auto-generado |
| user_id | uuid (FK -> auth.users) | |
| categoria | text | "analizar", "generar", etc. |
| tipo | text | "oficio_administrativo", etc. |
| campos_completados | jsonb | Valores que lleno el usuario |
| prompt_generado | text | Texto final de la plantilla |
| prompt_mejorado | text (nullable) | Version mejorada con IA |
| es_publico | boolean | default false |
| created_at | timestamptz | auto |

### Tabla: uso_ia

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auto-generado |
| user_id | uuid (FK -> auth.users) | |
| fecha | date | Dia del uso |
| cantidad_usos | integer | Incrementa con cada mejora |

### RLS (Row Level Security)

- prompts_guardados: usuario ve/edita solo los suyos. Prompts con es_publico = true visibles para todos los autenticados (solo lectura).
- uso_ia: solo accesible por el propio usuario.

---

## "Mejorar con IA" - Especificacion

### Flujo

1. Usuario presiona "Mejorar con IA" en paso 4
2. Frontend verifica contador diario (query a uso_ia)
3. Si tiene usos disponibles -> POST a /api/mejorar
4. API route llama a OpenRouter con Qwen 3.5
5. Resultado se muestra lado a lado: original vs mejorado
6. Usuario elige cual copiar/guardar
7. Se incrementa uso_ia.cantidad_usos

### System prompt

Dos partes:

**Base (siempre):**

Eres un experto en prompt engineering especializado en el contexto del Poder Judicial del Estado de Nuevo Leon (PJENL).

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
1. ESPECIFICIDAD - Reemplaza instrucciones vagas por concretas.
2. ESTRUCTURA - Agrega formato de salida cuando el prompt no lo tiene.
3. CONTEXTO PJENL - Inyecta el contexto institucional relevante.
4. ROL Y AUDIENCIA - Define quien produce el documento y para quien.
5. CRITERIOS DE CALIDAD - Agrega que hace que la respuesta sea buena vs mediocre.
6. RESTRICCIONES - Anade lo que NO debe incluir.
7. ENCADENAMIENTO - Si el prompt se beneficia de pasos secuenciales, descomponlo.

REGLAS:
- Devuelve UNICAMENTE el prompt mejorado, listo para copiar y pegar
- No agregues explicaciones, comentarios ni justificaciones de tus cambios
- No envuelvas el resultado en bloques de codigo
- Manten la intencion original del usuario - mejora la ejecucion, no cambies el objetivo
- Si el prompt original ya es bueno, haz mejoras minimas - no sobreingenieres
- Usa XML tags solo cuando la complejidad lo justifique
- Prioriza claridad sobre sofisticacion

**Extension presentaciones (solo cuando categoria = "presentaciones"):**

Se concatena la guia completa de identidad corporativa PJENL que incluye:
- Paleta de colores (navy #0D2B5E, gold #C9A227, etc.)
- Estructura de diapositivas (portada, contenido, cierre)
- Tipografia (Calibri, tamanos por elemento)
- Componentes visuales (tarjetas, cajas de enfasis, badges, checks, separadores)
- Logo institucional y reglas de uso
- Colores de acento por seccion
- Reglas de diseno (no # en hex para pptxgenjs, no compartir objetos shadow, etc.)

### Control de uso

- Limite: 20 mejoras por usuario por dia
- Contador visible en UI: "Te quedan X mejoras hoy"
- Reset a medianoche hora Monterrey (UTC-6)
- API key en variable de entorno del servidor, nunca expuesta al cliente

---

## UI - Look and feel

### Paleta de la app

| Uso | Color | HEX |
|---|---|---|
| Navbar, sidebar, botones primarios | Navy institucional | #0D2B5E |
| Acentos, badges, stepper activo | Gold PJENL | #C9A227 |
| Fondo principal | Gris institucional | #F0F4FA |
| Tarjetas, superficies | Blanco | #FFFFFF |
| Texto secundario | Gris azulado | #64748B |
| Exito (copiado, guardado) | Verde | #16A34A |

### Tipografia

Calibri (consistente con documentos PJENL). Fallback: system sans-serif.

### Layout

- Navbar superior: logo PJENL + nombre app + usuario/logout
- Contenido centrado, max-width ~960px
- Wizard con stepper horizontal (4 pasos), indicador en gold
- Tarjetas con borde sutil y sombra ligera
- Sin modo oscuro en esta version

### Componentes clave

- Boton "Copiar" -> feedback "Copiado" con check verde
- Boton "Mejorar con IA" -> spinner de carga, resultado lado a lado (original vs mejorado)
- Toggle publico/privado -> switch en cada prompt guardado
- Notas de archivo -> banner informativo "Recuerda subir el archivo en Claude..."

---

## Arquitectura tecnica

### Stack

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 16 |
| UI | Tailwind v4 + Framer Motion |
| Auth | Supabase Auth |
| Base de datos | Supabase PostgreSQL |
| API de mejora | OpenRouter -> Qwen 3.5 |
| Iconos | Lucide React |

### Archivos que se conservan

- package.json, tsconfig.json, next.config.ts, postcss.config.mjs
- eslint.config.mjs, .prettierrc, .gitignore
- vitest.config.ts, playwright.config.ts
- supabase/ (configuracion base)

### Archivos que se eliminan/reescriben

- Todo src/ (componentes, paginas, content, lib)
- public/ (assets nuevos)
- data/ (ya no se usa)
- Tests (reescritos)
- README.md, ARCHITECTURE.md, CURRICULUM.md, SECURITY.md

### Nueva estructura src/

```
src/
  app/
    layout.tsx
    page.tsx
    login/page.tsx
    wizard/page.tsx
    mis-prompts/page.tsx
    biblioteca/page.tsx
    perfil/page.tsx
    api/
      mejorar/route.ts
  components/
    Navbar.tsx
    Stepper.tsx
    CategoryPicker.tsx
    TypePicker.tsx
    PromptForm.tsx
    PromptPreview.tsx
    PromptCard.tsx
    AuthGuard.tsx
  content/
    plantillas.ts
  lib/
    supabase.ts
    openrouter.ts
    prompts.ts
  middleware.ts
```

### Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENROUTER_API_KEY=...
MEJORA_LIMITE_DIARIO=20
```

### Estructura de plantilla (content/plantillas.ts)

Cada plantilla tiene: id, categoria, nombre, descripcion, icono (Lucide), campos (array de objetos con id, label, tipo, placeholder, requerido, opciones), nota opcional, y plantilla (template string).

Logica de renderizado:
- {{campo}} se reemplaza con el valor del formulario
- {{#campo}}...{{/campo}} solo se incluye si el campo tiene valor
- Campos con requerido: true se validan antes de avanzar al paso 4
