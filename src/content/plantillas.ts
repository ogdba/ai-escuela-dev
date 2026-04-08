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
    descripcion: "Extrae insights clave de documentos institucionales",
    icono: "FileSearch",
  },
  {
    id: "generar",
    nombre: "Generar Documentos",
    descripcion: "Crea documentos oficiales con formato institucional",
    icono: "FilePlus",
  },
  {
    id: "datos",
    nombre: "De Datos a Decisiones",
    descripcion: "Transforma datos crudos en análisis accionables",
    icono: "BarChart3",
  },
  {
    id: "comunicar",
    nombre: "Comunicar y Adaptar",
    descripcion: "Adapta mensajes para distintas audiencias",
    icono: "MessageSquare",
  },
  {
    id: "presentaciones",
    nombre: "Presentaciones",
    descripcion: "Genera estructuras de presentaciones efectivas",
    icono: "Presentation",
  },
];

export const PLANTILLAS: Plantilla[] = [
  // ─── ANALIZAR ───────────────────────────────────────────────────────────────
  {
    id: "analizar-circular",
    categoria: "analizar",
    nombre: "Circular / Acuerdo",
    descripcion: "Analiza el contenido y obligaciones de una circular o acuerdo institucional",
    icono: "FileSearch",
    nota: "Adjunta el PDF de la circular o acuerdo antes de enviar este prompt.",
    campos: [
      {
        id: "contexto",
        label: "Contexto adicional (opcional)",
        tipo: "textarea",
        placeholder: "Ej. Este acuerdo modifica el proceso de adquisiciones vigente desde 2022...",
        requerido: false,
      },
    ],
    plantilla: `Eres un asesor jurídico-administrativo del Poder Judicial del Estado de Nuevo León (PJENL). Analiza el documento adjunto (circular o acuerdo institucional) y proporciona un análisis estructurado con los siguientes cinco puntos:

1. **Resumen ejecutivo**: Describe en 2-3 oraciones el propósito principal del documento.
2. **Obligaciones y disposiciones clave**: Lista las acciones, plazos o restricciones que impone el documento.
3. **Áreas o unidades involucradas**: Identifica qué áreas del PJENL se ven afectadas.
4. **Riesgos o puntos de atención**: Señala posibles ambigüedades, conflictos con normativa anterior o riesgos de incumplimiento.
5. **Recomendaciones de acción**: Sugiere los pasos inmediatos que debe tomar la administración.

{{#contexto}}Contexto adicional proporcionado: {{contexto}}{{/contexto}}

Responde en español formal institucional.`,
  },
  {
    id: "analizar-presupuesto",
    categoria: "analizar",
    nombre: "Presupuesto",
    descripcion: "Analiza un presupuesto institucional identificando tendencias y áreas de oportunidad",
    icono: "FileSearch",
    nota: "Adjunta el archivo Excel o PDF del presupuesto antes de enviar este prompt.",
    campos: [
      {
        id: "contexto",
        label: "Contexto adicional (opcional)",
        tipo: "textarea",
        placeholder: "Ej. Este es el presupuesto del ejercicio fiscal 2026, comparado con 2025...",
        requerido: false,
      },
    ],
    plantilla: `Eres un analista financiero especializado en presupuestos del sector público judicial. Analiza el documento presupuestal adjunto del PJENL y proporciona:

1. **Resumen general**: Total presupuestado, principales rubros y distribución porcentual.
2. **Principales partidas**: Identifica las 5 partidas de mayor monto y su justificación aparente.
3. **Variaciones relevantes**: Si hay datos comparativos, señala incrementos o decrementos significativos (>10%).
4. **Áreas de oportunidad**: Identifica posibles optimizaciones o reasignaciones recomendables.
5. **Alertas presupuestales**: Señala partidas subejercidas, sobre-ejercidas o sin justificación clara.
6. **Recomendaciones**: Propón 3 acciones concretas para mejorar la gestión presupuestal.

{{#contexto}}Contexto adicional: {{contexto}}{{/contexto}}

Presenta los montos en pesos mexicanos con formato claro. Responde en español formal institucional.`,
  },
  {
    id: "analizar-datos-judiciales",
    categoria: "analizar",
    nombre: "Datos Judiciales",
    descripcion: "Analiza estadísticas judiciales para identificar patrones y áreas de mejora",
    icono: "FileSearch",
    nota: "Adjunta el archivo CSV o Excel con los datos judiciales antes de enviar este prompt.",
    campos: [
      {
        id: "contexto",
        label: "Contexto adicional (opcional)",
        tipo: "textarea",
        placeholder: "Ej. Estos datos corresponden al primer trimestre de 2026 del área penal...",
        requerido: false,
      },
    ],
    plantilla: `Eres un especialista en estadística judicial con experiencia en el Poder Judicial de Nuevo León. Analiza los datos adjuntos y proporciona:

1. **Descripción del dataset**: Número de registros, variables principales, período cubierto.
2. **Estadísticas descriptivas clave**: Promedios, medianas, valores máximos/mínimos de las variables más relevantes.
3. **Patrones y tendencias**: Identifica tendencias temporales, concentraciones geográficas o por materia.
4. **Indicadores de eficiencia**: Tiempos de resolución, tasas de conclusión, carga de trabajo por juzgado/área.
5. **Anomalías o hallazgos destacados**: Señala datos atípicos que requieran atención.
6. **Visualizaciones recomendadas**: Sugiere qué tipos de gráficas comunicarían mejor estos datos (barras, líneas, mapas de calor, etc.).
7. **Conclusiones y recomendaciones**: 3-5 acciones basadas en los datos.

{{#contexto}}Contexto adicional: {{contexto}}{{/contexto}}

Responde en español formal institucional, con precisión técnica pero lenguaje accesible para directivos.`,
  },
  {
    id: "analizar-nota-periodistica",
    categoria: "analizar",
    nombre: "Nota Periodística",
    descripcion: "Analiza una nota de prensa para evaluar tono, impacto y estrategia de respuesta",
    icono: "FileSearch",
    campos: [
      {
        id: "texto_nota",
        label: "Texto de la nota periodística",
        tipo: "textarea",
        placeholder: "Pega aquí el texto completo de la nota periodística...",
        requerido: true,
      },
    ],
    plantilla: `Eres un especialista en comunicación institucional y relaciones públicas del PJENL. Analiza la siguiente nota periodística:

---
{{texto_nota}}
---

Proporciona el siguiente análisis:

1. **Resumen del contenido**: ¿De qué trata la nota? ¿Qué hechos reporta?
2. **Tono y sesgo editorial**: ¿Es positivo, negativo o neutral hacia el PJENL? ¿Hay lenguaje tendencioso?
3. **Impacto institucional potencial**: ¿Qué riesgos reputacionales o legales presenta? Clasifica como: Alto / Medio / Bajo.
4. **Actores mencionados**: Lista personas, áreas o instituciones citadas y su rol en la narrativa.
5. **Afirmaciones que requieren respuesta**: Identifica declaraciones incorrectas, incompletas o que requieren aclaración oficial.
6. **Estrategia de respuesta recomendada**:
   - ¿Debe el PJENL responder públicamente? ¿Por qué sí o no?
   - Canal recomendado (boletín, redes sociales, conferencia, comunicado oficial).
   - Tono recomendado para la respuesta.
7. **Borrador de puntos clave para la respuesta** (si aplica): 3-5 puntos concisos para el comunicado.

Responde en español formal institucional.`,
  },

  // ─── GENERAR ────────────────────────────────────────────────────────────────
  {
    id: "generar-oficio",
    categoria: "generar",
    nombre: "Oficio Administrativo",
    descripcion: "Genera un oficio formal para solicitud de equipos, servicios o recursos",
    icono: "FilePlus",
    campos: [
      {
        id: "numero_oficio",
        label: "Número de oficio",
        tipo: "text",
        placeholder: "Ej. DA/001/2026",
        requerido: true,
      },
      {
        id: "destinatario",
        label: "Nombre del destinatario",
        tipo: "text",
        placeholder: "Ej. Lic. María González Hernández",
        requerido: true,
      },
      {
        id: "cargo_destinatario",
        label: "Cargo del destinatario",
        tipo: "text",
        placeholder: "Ej. Directora de Recursos Materiales",
        requerido: true,
      },
      {
        id: "asunto",
        label: "Asunto del oficio",
        tipo: "text",
        placeholder: "Ej. Solicitud de equipos de cómputo para el Juzgado Quinto",
        requerido: true,
      },
      {
        id: "equipos_servicios",
        label: "Equipos o servicios solicitados",
        tipo: "textarea",
        placeholder: "Ej. 5 computadoras portátiles Dell Latitude, 2 impresoras HP LaserJet...",
        requerido: true,
      },
      {
        id: "monto",
        label: "Monto estimado",
        tipo: "text",
        placeholder: "Ej. $85,000.00 (ochenta y cinco mil pesos 00/100 M.N.)",
        requerido: true,
      },
      {
        id: "justificacion",
        label: "Justificación",
        tipo: "textarea",
        placeholder: "Ej. El equipo actual tiene más de 7 años de antigüedad y presenta fallas frecuentes que afectan la operación...",
        requerido: true,
      },
    ],
    plantilla: `Redacta un oficio administrativo formal del Poder Judicial del Estado de Nuevo León con los siguientes datos:

**Número de oficio:** {{numero_oficio}}
**Destinatario:** {{destinatario}}, {{cargo_destinatario}}
**Asunto:** {{asunto}}

**Equipos o servicios solicitados:**
{{equipos_servicios}}

**Monto estimado:** {{monto}}

**Justificación:**
{{justificacion}}

El oficio debe:
- Usar formato oficial del PJENL con encabezado institucional
- Incluir fecha actual ({{fecha_actual}}) si se proporciona, o dejar espacio para la fecha
- Usar lenguaje formal y respetuoso
- Incluir párrafo de fundamentación legal básica (Ley Orgánica del Poder Judicial de NL)
- Cerrar con atenta despedida y espacio para firma
- Incluir pie con datos del área remitente

Genera el oficio completo listo para revisión y firma.`,
  },
  {
    id: "generar-acuerdo",
    categoria: "generar",
    nombre: "Proyecto de Acuerdo",
    descripcion: "Genera un proyecto de acuerdo o resolución administrativa institucional",
    icono: "FilePlus",
    campos: [
      {
        id: "medidas",
        label: "Medidas o disposiciones del acuerdo",
        tipo: "textarea",
        placeholder: "Ej. Implementar el uso obligatorio del sistema de gestión documental en todas las áreas administrativas...",
        requerido: true,
      },
      {
        id: "plazo",
        label: "Plazo de implementación",
        tipo: "text",
        placeholder: "Ej. 30 días hábiles a partir de la publicación",
        requerido: true,
      },
      {
        id: "area_responsable",
        label: "Área responsable de ejecución (opcional)",
        tipo: "text",
        placeholder: "Ej. Dirección de Tecnologías de la Información",
        requerido: false,
      },
    ],
    plantilla: `Redacta un proyecto de acuerdo administrativo formal del Poder Judicial del Estado de Nuevo León con las siguientes especificaciones:

**Medidas y disposiciones:**
{{medidas}}

**Plazo de implementación:** {{plazo}}

{{#area_responsable}}**Área responsable:** {{area_responsable}}{{/area_responsable}}

El proyecto de acuerdo debe incluir:
1. **Encabezado formal**: Con número de acuerdo, fecha y órgano emisor
2. **Considerandos**: Antecedentes y fundamentación jurídica pertinente (Ley Orgánica del PJ de NL, normativa aplicable)
3. **Parte resolutiva**: Las medidas claramente enumeradas con redacción imperativa
4. **Vigencia y entrada en vigor**: Indicando el plazo especificado
5. **Disposiciones transitorias** (si aplica): Para casos de transición o excepciones
6. **Firma y autorización**: Espacio para el órgano competente

Usa lenguaje jurídico-administrativo formal, claro y preciso. Genera el documento completo listo para revisión.`,
  },
  {
    id: "generar-boletin",
    categoria: "generar",
    nombre: "Boletín de Prensa",
    descripcion: "Genera un boletín de prensa institucional y posts para redes sociales",
    icono: "FilePlus",
    campos: [
      {
        id: "accion",
        label: "Acción o evento a comunicar",
        tipo: "text",
        placeholder: "Ej. Inauguración del nuevo Centro de Justicia Alternativa en Monterrey",
        requerido: true,
      },
      {
        id: "detalles",
        label: "Detalles e información relevante",
        tipo: "textarea",
        placeholder: "Ej. El centro atenderá a ciudadanos de los municipios de Monterrey, San Nicolás y Guadalupe. Cuenta con 10 mediadores certificados. La inversión fue de $3.2 millones...",
        requerido: true,
      },
    ],
    plantilla: `Eres el director de comunicación social del Poder Judicial del Estado de Nuevo León. Genera los siguientes materiales de comunicación:

**Acción a comunicar:** {{accion}}

**Información relevante:**
{{detalles}}

**Genera los siguientes 4 materiales:**

---
### 1. BOLETÍN DE PRENSA OFICIAL
(Formato: Encabezado PJENL, título impactante, fecha, cuerpo con las 5 W's, cita institucional, datos de contacto para medios)

---
### 2. POST PARA TWITTER/X
(Máximo 280 caracteres, incluye hashtags relevantes como #PJENL #JusticiaNL, tono institucional pero dinámico)

---
### 3. POST PARA FACEBOOK
(200-300 palabras, más descriptivo, incluye llamada a la acción, hashtags)

---
### 4. POST PARA INSTAGRAM
(Caption de 150-200 palabras, emojis institucionales apropiados ⚖️, hashtags, tono más cercano al ciudadano)

---

Todos los materiales deben: reflejar los valores del PJENL (transparencia, acceso a la justicia, eficiencia), usar lenguaje claro y accesible, y destacar el beneficio para la ciudadanía neoleonesa.`,
  },
  {
    id: "generar-reporte",
    categoria: "generar",
    nombre: "Reporte con Gráficas",
    descripcion: "Genera la estructura narrativa de un reporte ejecutivo con sugerencias de visualización",
    icono: "FilePlus",
    nota: "Recomendado: usa primero el prompt de análisis de datos y luego utiliza este para generar el reporte.",
    campos: [
      {
        id: "periodo",
        label: "Período del reporte",
        tipo: "text",
        placeholder: "Ej. Primer trimestre 2026 (enero-marzo)",
        requerido: true,
      },
      {
        id: "contexto",
        label: "Contexto o datos disponibles (opcional)",
        tipo: "textarea",
        placeholder: "Pega aquí los datos o hallazgos del análisis previo...",
        requerido: false,
      },
    ],
    plantilla: `Eres un especialista en elaboración de reportes ejecutivos para el Poder Judicial del Estado de Nuevo León. Genera la estructura completa de un reporte ejecutivo para el período: **{{periodo}}**

{{#contexto}}**Datos y hallazgos disponibles:**
{{contexto}}{{/contexto}}

El reporte debe incluir:

### ESTRUCTURA DEL REPORTE EJECUTIVO PJENL

**1. Portada**
- Título oficial, período, área responsable, fecha

**2. Resumen Ejecutivo** (máx. 1 página)
- Hallazgos principales en 5 puntos clave
- Semáforo de cumplimiento de objetivos (🔴🟡🟢)

**3. Contexto y Antecedentes**
- Marco de referencia del período

**4. Indicadores Principales** (con sugerencias de visualización)
- Para cada indicador: valor actual, meta, variación vs. período anterior
- Tipo de gráfica recomendada (barras, línea de tendencia, pie, etc.)

**5. Análisis por Área/Materia**
- Desglose por juzgados, materias o unidades administrativas

**6. Logros Destacados**
- Top 3-5 logros del período

**7. Áreas de Oportunidad y Retos**
- Identificación de rezagos o desafíos

**8. Conclusiones y Recomendaciones**
- 3-5 acciones prioritarias para el siguiente período

**9. Anexos**
- Listado de tablas y gráficas sugeridas

Genera el contenido completo en español formal institucional, listo para presentación ante el Consejo de la Judicatura.`,
  },

  // ─── DATOS ──────────────────────────────────────────────────────────────────
  {
    id: "datos-preguntas",
    categoria: "datos",
    nombre: "Preguntas a Datos",
    descripcion: "Formula preguntas específicas sobre un dataset para obtener respuestas precisas",
    icono: "BarChart3",
    nota: "Adjunta primero el archivo de datos (CSV, Excel) y luego envía este prompt.",
    campos: [
      {
        id: "preguntas",
        label: "Preguntas sobre los datos",
        tipo: "textarea",
        placeholder: "Ej. ¿Cuál es el juzgado con mayor número de casos pendientes? ¿Cuál es el tiempo promedio de resolución por materia? ¿Qué tendencia muestra la carga de trabajo en los últimos 6 meses?",
        requerido: true,
      },
    ],
    plantilla: `Eres un analista de datos del Poder Judicial del Estado de Nuevo León con acceso al dataset adjunto. Responde las siguientes preguntas de forma precisa y estructurada:

{{preguntas}}

Para cada pregunta:
1. **Respuesta directa**: El dato o hallazgo específico que responde la pregunta
2. **Contexto**: Información adicional que enriquece la respuesta
3. **Fuente en los datos**: Indica qué columnas o variables sustentaron la respuesta
4. **Limitaciones**: Señala si los datos son insuficientes para responder completamente
5. **Visualización sugerida**: Tipo de gráfica que mejor ilustraría este hallazgo

Si alguna pregunta no puede responderse con los datos disponibles, indícalo claramente y explica qué datos adicionales serían necesarios.

Responde en español formal, con precisión técnica y lenguaje accesible para tomadores de decisiones del PJENL.`,
  },
  {
    id: "datos-comparativo",
    categoria: "datos",
    nombre: "Comparativo entre Períodos",
    descripcion: "Compara métricas entre dos períodos de tiempo para identificar tendencias",
    icono: "BarChart3",
    nota: "Adjunta el archivo de datos con información de ambos períodos antes de enviar.",
    campos: [
      {
        id: "periodo1",
        label: "Período base (anterior)",
        tipo: "text",
        placeholder: "Ej. Primer trimestre 2025",
        requerido: true,
      },
      {
        id: "periodo2",
        label: "Período de comparación (actual)",
        tipo: "text",
        placeholder: "Ej. Primer trimestre 2026",
        requerido: true,
      },
    ],
    plantilla: `Eres un analista de datos del Poder Judicial del Estado de Nuevo León. Realiza un análisis comparativo entre los siguientes períodos usando los datos adjuntos:

- **Período base:** {{periodo1}}
- **Período de comparación:** {{periodo2}}

Proporciona el siguiente análisis comparativo:

### 1. Tabla Comparativa de Indicadores Clave
| Indicador | {{periodo1}} | {{periodo2}} | Variación | % Cambio |
(Completa con los principales KPIs del dataset)

### 2. Hallazgos Positivos
Métricas que mejoraron significativamente (variación >5%) con interpretación

### 3. Hallazgos Negativos
Métricas que empeoraron o se mantuvieron estancadas, con posibles causas

### 4. Tendencias Identificadas
Patrones consistentes que sugieren una dirección clara

### 5. Análisis por Subgrupos
Comparativo desglosado por área, materia, región o categoría relevante

### 6. Factores Contextuales
Elementos externos o internos que podrían explicar las variaciones

### 7. Proyección
Con base en la tendencia observada, ¿qué se esperaría para el siguiente período?

### 8. Recomendaciones
3-5 acciones basadas en los hallazgos comparativos

Responde en español formal institucional, con tablas claras y análisis objetivo.`,
  },
  {
    id: "datos-entregable",
    categoria: "datos",
    nombre: "Análisis a Entregable",
    descripcion: "Convierte el análisis de datos en un documento ejecutivo listo para entregar",
    icono: "BarChart3",
    nota: "Usa este prompt después de haber realizado el análisis de datos en la misma conversación.",
    campos: [
      {
        id: "instrucciones",
        label: "Instrucciones especiales (opcional)",
        tipo: "textarea",
        placeholder: "Ej. Enfocarse en el área penal, incluir recomendaciones para el Consejo de la Judicatura, formato para presentación pública...",
        requerido: false,
      },
    ],
    plantilla: `Basándote en el análisis de datos que hemos realizado en esta conversación, genera un documento ejecutivo formal del Poder Judicial del Estado de Nuevo León listo para entrega.

{{#instrucciones}}**Instrucciones especiales para este entregable:**
{{instrucciones}}{{/instrucciones}}

El documento debe incluir:

**DOCUMENTO EJECUTIVO - PJENL**

1. **Título y metadatos**: Nombre del análisis, fecha, área responsable, clasificación (público/interno)

2. **Resumen ejecutivo** (media página): Los 3 hallazgos más importantes en lenguaje no técnico

3. **Metodología** (breve): Fuente de datos, período analizado, herramientas utilizadas

4. **Hallazgos principales**: Presentados en orden de importancia con datos de soporte

5. **Análisis de impacto**: ¿Cómo afectan estos hallazgos a la operación del PJENL?

6. **Recomendaciones priorizadas**:
   - Inmediatas (0-30 días)
   - Corto plazo (1-3 meses)
   - Mediano plazo (3-12 meses)

7. **Indicadores de seguimiento**: KPIs para monitorear el impacto de las recomendaciones

8. **Próximos pasos**: Lista de acciones concretas con responsables sugeridos

Formato: Lenguaje ejecutivo claro, párrafos cortos, uso de viñetas. Listo para presentar ante el Consejo de la Judicatura o directivos del PJENL.`,
  },

  // ─── COMUNICAR ──────────────────────────────────────────────────────────────
  {
    id: "comunicar-tres-audiencias",
    categoria: "comunicar",
    nombre: "Un Contenido, Tres Audiencias",
    descripcion: "Adapta un mismo mensaje institucional para medios, ciudadanos y comunicación interna",
    icono: "MessageSquare",
    campos: [
      {
        id: "comunicado",
        label: "Comunicado o información a adaptar",
        tipo: "textarea",
        placeholder: "Pega aquí el texto original que deseas adaptar para diferentes audiencias...",
        requerido: true,
      },
    ],
    plantilla: `Eres director de comunicación del Poder Judicial del Estado de Nuevo León. Adapta el siguiente comunicado para tres audiencias distintas:

**COMUNICADO ORIGINAL:**
{{comunicado}}

---

### VERSIÓN 1: PARA MEDIOS DE COMUNICACIÓN
(Tono: Formal, informativo, datos precisos, citas institucionales. Formato: boletín de prensa, 200-300 palabras, enfocado en hechos verificables, relevancia pública y respaldo legal)

---

### VERSIÓN 2: PARA CIUDADANÍA EN GENERAL
(Tono: Claro, accesible, empático, sin tecnicismos. Formato: publicación en redes sociales o página web, 100-150 palabras, enfocado en el beneficio directo al ciudadano, lenguaje cotidiano)

---

### VERSIÓN 3: PARA COMUNICACIÓN INTERNA (PERSONAL DEL PJENL)
(Tono: Directo, operativo, con detalles de implementación. Formato: memorando interno o correo institucional, 150-200 palabras, incluye instrucciones de acción si aplica, fechas clave y responsables)

---

**NOTA PARA EL COMUNICADOR:**
- Puntos clave que no deben omitirse en ninguna versión: [lista]
- Términos técnicos que requieren explicación para audiencia general: [lista]
- Posibles preguntas frecuentes por audiencia: [lista breve]`,
  },
  {
    id: "comunicar-responder-correo",
    categoria: "comunicar",
    nombre: "Responder Correo",
    descripcion: "Genera una respuesta profesional a un correo electrónico institucional",
    icono: "MessageSquare",
    campos: [
      {
        id: "correo",
        label: "Correo a responder",
        tipo: "textarea",
        placeholder: "Pega aquí el contenido del correo que necesitas responder...",
        requerido: true,
      },
      {
        id: "tipo_respuesta",
        label: "Tipo de respuesta",
        tipo: "select",
        placeholder: "",
        requerido: true,
        opciones: ["Aceptar", "Declinar", "Solicitar más información", "Proponer alternativa"],
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
    plantilla: `Eres un funcionario del Poder Judicial del Estado de Nuevo León. Redacta una respuesta profesional al siguiente correo electrónico:

**CORREO RECIBIDO:**
{{correo}}

**Tipo de respuesta:** {{tipo_respuesta}}
**Tono requerido:** {{tono}}

La respuesta debe:
1. **Acuse de recibo**: Confirmar que el correo fue recibido y leído
2. **Posición clara**: Comunicar la respuesta ({{tipo_respuesta}}) de forma directa pero cortés
3. **Fundamentación** (si aplica): Razón o base para la decisión
4. **Siguientes pasos**: Qué se espera del remitente o qué hará el PJENL
5. **Cierre formal**: Despedida institucional apropiada

Formato del correo:
- Asunto: Re: [asunto original inferido]
- Saludo formal
- Cuerpo con los elementos anteriores
- Despedida y firma institucional del PJENL

Tono: {{tono}}. Extensión: 150-250 palabras. Idioma: español formal.`,
  },
  {
    id: "comunicar-revision-texto",
    categoria: "comunicar",
    nombre: "Revisión de Texto",
    descripcion: "Corrige, mejora y profesionaliza cualquier texto institucional",
    icono: "MessageSquare",
    campos: [
      {
        id: "texto",
        label: "Texto a revisar",
        tipo: "textarea",
        placeholder: "Pega aquí el texto que deseas revisar y mejorar...",
        requerido: true,
      },
    ],
    plantilla: `Eres un editor experto en comunicación institucional del Poder Judicial del Estado de Nuevo León. Revisa y mejora el siguiente texto:

**TEXTO ORIGINAL:**
{{texto}}

Proporciona:

### 1. TEXTO CORREGIDO Y MEJORADO
(Versión final lista para usar, con todas las correcciones aplicadas)

---

### 2. RESUMEN DE CAMBIOS REALIZADOS
**Correcciones ortográficas y gramaticales:**
- Lista de errores encontrados y correcciones

**Mejoras de redacción:**
- Cambios de estructura o claridad realizados

**Ajustes de tono institucional:**
- Modificaciones para alinear con el registro formal del PJENL

**Puntuación y formato:**
- Correcciones de puntuación, uso de mayúsculas, formato

---

### 3. SUGERENCIAS ADICIONALES
Recomendaciones opcionales para fortalecer aún más el texto (que no se aplicaron en la versión corregida por ser cambios sustanciales de contenido).

---

**Escala de calidad del texto original:** [1-10] con breve justificación.`,
  },

  // ─── PRESENTACIONES ─────────────────────────────────────────────────────────
  {
    id: "presentaciones-bullets",
    categoria: "presentaciones",
    nombre: "Presentación desde Bullets",
    descripcion: "Convierte puntos clave en una estructura de presentación ejecutiva completa",
    icono: "Presentation",
    campos: [
      {
        id: "tema",
        label: "Tema de la presentación",
        tipo: "text",
        placeholder: "Ej. Resultados del Sistema de Gestión de Calidad PJENL 2025",
        requerido: true,
      },
      {
        id: "audiencia",
        label: "Audiencia objetivo",
        tipo: "select",
        placeholder: "",
        requerido: true,
        opciones: [
          "El Pleno",
          "El Consejo de la Judicatura",
          "Directores",
          "Personal operativo",
          "Ciudadanía",
        ],
      },
      {
        id: "num_slides",
        label: "Número de diapositivas",
        tipo: "number",
        placeholder: "Ej. 12",
        requerido: true,
      },
      {
        id: "puntos",
        label: "Puntos clave a incluir",
        tipo: "textarea",
        placeholder: "Ej.\n- Implementamos ISO 9001 en 8 áreas\n- Tiempo de respuesta redujo 35%\n- 1,200 funcionarios capacitados\n- Próxima meta: certificación completa en 2026",
        requerido: true,
      },
    ],
    plantilla: `Eres un experto en diseño de presentaciones ejecutivas para el Poder Judicial del Estado de Nuevo León. Crea la estructura completa de una presentación con las siguientes especificaciones:

**Tema:** {{tema}}
**Audiencia:** {{audiencia}}
**Número de diapositivas:** {{num_slides}}

**Puntos clave a desarrollar:**
{{puntos}}

Genera la estructura completa de la presentación en el siguiente formato para cada diapositiva:

---
**DIAPOSITIVA [N]: [TÍTULO]**
*Tipo: [Portada / Agenda / Contenido / Datos / Cierre]*

📌 **Mensaje principal** (una oración que resume el slide)

**Contenido:**
- [Bullet 1]
- [Bullet 2]
- [Bullet 3]

**Nota del presentador:** [Qué decir en voz alta, contexto adicional, datos de soporte]

**Sugerencia visual:** [Tipo de elemento visual recomendado: gráfica de barras, foto, ícono, tabla, etc.]

---

**CRITERIOS DE DISEÑO PARA ESTA PRESENTACIÓN:**
- Audiencia ({{audiencia}}): [Ajustes específicos de lenguaje y profundidad técnica]
- Paleta de colores sugerida: Institucional PJENL (azul marino, blanco, dorado)
- Duración estimada: [X minutos basado en {{num_slides}} diapositivas]
- Estilo: Ejecutivo, profesional, con datos que soporten cada afirmación

Genera las {{num_slides}} diapositivas completas listas para trasladar a PowerPoint o Google Slides.`,
  },
];
