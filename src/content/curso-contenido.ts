export interface Leccion {
  id: string;
  titulo: string;
  contenido: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  descripcion: string;
  lecciones: Leccion[];
}

export interface CursoContenido {
  cursoId: string;
  modulos: Modulo[];
}

export const CURSOS_CONTENIDO: CursoContenido[] = [
  {
    cursoId: "claude-101",
    modulos: [
      {
        id: "conociendo-claude",
        titulo: "Conociendo Claude",
        descripcion: "Que es Claude, como funciona, y como tener tu primera conversacion efectiva",
        lecciones: [
          {
            id: "que-es-claude",
            titulo: "Que es Claude y como funciona",
            contenido: `## Introduccion a Claude

Claude es un **asistente de inteligencia artificial** desarrollado por Anthropic, disenado para ayudarte a realizar tareas de trabajo de manera mas eficiente. Piensa en Claude como un colaborador digital que puede leer, escribir, analizar y organizar informacion a gran velocidad.

## Como funciona un modelo de lenguaje

Para entender a Claude no necesitas ser experto en tecnologia. Imagina que Claude ha leido millones de documentos: libros, articulos, manuales, legislacion, reportes y mucho mas. A partir de esa lectura masiva, aprendio **patrones del lenguaje** y del conocimiento humano. Cuando le haces una pregunta, Claude no busca en una base de datos como Google; en su lugar, genera una respuesta palabra por palabra, prediciendo cual es la siguiente palabra mas apropiada segun el contexto de tu conversacion.

Es similar a cuando un servidor publico experimentado redacta un oficio: no copia de un archivo anterior, sino que utiliza anos de experiencia para saber que estructura, tono y contenido son apropiados. Claude hace algo analogo, pero a escala masiva y en segundos.

## Que hace diferente a Claude

A diferencia de otros asistentes de IA, Claude fue entrenado con un enfasis especial en ser **util, honesto e inofensivo**. Esto significa que Claude prefiere decirte cuando no sabe algo en lugar de inventar una respuesta. Tambien esta disenado para seguir instrucciones complejas con precision y mantener un tono profesional.

Para el trabajo del **Poder Judicial del Estado de Nuevo Leon**, esto es particularmente valioso: necesitamos un asistente que sea confiable, que respete la formalidad institucional y que pueda manejar informacion sensible con cuidado.

## Los modelos de Claude: Sonnet, Opus y Haiku

Claude no es un solo modelo, sino una **familia de modelos** con diferentes capacidades:

**Haiku** es el modelo mas rapido y ligero. Ideal para tareas sencillas que necesitas resolver al instante: clasificar un correo, resumir un parrafo corto, o responder preguntas simples. Es como pedirle a un asistente que te pase un dato rapido.

**Sonnet** es el modelo equilibrado, el que usaras con mayor frecuencia. Combina buena velocidad con alta calidad. Perfecto para redactar oficios, analizar datos estadisticos, crear reportes o revisar documentos extensos. Es tu colaborador de trabajo diario.

**Opus** es el modelo mas poderoso y reflexivo. Tomara un poco mas de tiempo para responder, pero su capacidad de analisis es superior. Usalo cuando necesites analisis juridicos complejos, evaluacion de proyectos con multiples variables, o cuando la calidad de la respuesta sea mas importante que la velocidad.

## Claude en el contexto del PJENL

Como directores del PJENL, pueden usar Claude para tareas como: resumir circulares internas, preparar borradores de comunicados, analizar tendencias en estadisticas judiciales, redactar minutas de reunion, o incluso ayudar a planificar proyectos. En los siguientes modulos aprenderemos exactamente como hacerlo.`,
          },
          {
            id: "primera-conversacion",
            titulo: "Tu primera conversacion con Claude",
            contenido: `## Accediendo a Claude

Para comenzar a usar Claude, accede a **claude.ai** desde tu navegador. Puedes usar Chrome, Edge, Firefox o Safari. Al iniciar sesion, veras una pantalla limpia con un campo de texto donde puedes escribir tu mensaje. No hay botones complicados ni menus extensos: simplemente escribe y Claude respondera.

## Tu primer mensaje

No necesitas usar un lenguaje especial ni comandos tecnicos. Escribe como le hablarias a un colega competente. Por ejemplo, podrias comenzar con:

**"Necesito resumir esta circular interna para compartirla con mi equipo. El texto dice..."**

Claude leera lo que le compartas y generara un resumen claro y organizado. Si el resumen es demasiado largo o corto, simplemente pidele que lo ajuste: "Hazlo mas breve, en 3 puntos clave."

## El flujo de la conversacion

Una conversacion con Claude funciona como un **dialogo continuo**. Claude recuerda todo lo que has dicho dentro de la misma conversacion. Esto significa que puedes construir sobre respuestas anteriores sin repetir el contexto.

Por ejemplo, imagina este flujo de trabajo para un director del PJENL:

Mensaje 1: "Redacta un correo electronico formal dirigido a los titulares de juzgado informando sobre la nueva circular de indicadores estadisticos."

Claude genera un borrador.

Mensaje 2: "Muy bien, pero hazlo mas breve y agrega una fecha limite del 30 de abril."

Claude ajusta el borrador.

Mensaje 3: "Ahora crea una version resumida para enviar por WhatsApp."

Claude adapta el mismo contenido a un formato corto e informal.

## Que esperar de las respuestas

Las respuestas de Claude seran **bien estructuradas y profesionales**. Generalmente organiza la informacion con encabezados, listas numeradas o vinetas cuando es apropiado. Si le pides un formato especifico, hara su mejor esfuerzo por cumplirlo.

Es importante saber que Claude puede equivocarse, especialmente con datos muy especificos como numeros de articulos de ley, fechas exactas o cifras estadisticas. **Siempre verifica los datos factuales** que Claude te proporcione, especialmente si vas a usarlos en documentos oficiales.

## Ejemplos practicos para directores del PJENL

Aqui hay tres usos inmediatos que puedes probar hoy:

**Resumir un documento:** Copia el texto de una circular o acuerdo y pide a Claude: "Resume este documento en 5 puntos principales, destacando las acciones que debo tomar."

**Redactar comunicacion:** "Redacta un oficio dirigido a la Direccion de Administracion solicitando la asignacion de recursos para el programa de capacitacion del segundo trimestre 2026."

**Analizar informacion:** "Tengo estos datos de productividad judicial de los ultimos 3 meses: [datos]. Identifica tendencias y areas de oportunidad."

## Consejos para empezar

Inicia con tareas sencillas y ve aumentando la complejidad. No te preocupes por hacer la pregunta perfecta desde el primer intento. Claude es paciente y puedes pedirle que reformule, amplíe o corrija cualquier respuesta las veces que necesites.`,
          },
          {
            id: "mejores-resultados",
            titulo: "Como obtener mejores resultados",
            contenido: `## El principio fundamental

La calidad de lo que Claude te entrega depende directamente de la calidad de lo que tu le pides. Un mensaje vago produce una respuesta generica. Un mensaje claro y especifico produce una respuesta util y precisa. Esto no es magia: es **comunicacion efectiva**, la misma habilidad que usas al dar instrucciones a tu equipo de trabajo.

## Las cuatro claves para mejores resultados

**1. Se especifico en lo que necesitas.** En lugar de pedir algo general, define exactamente que quieres, para quien, y con que proposito.

**2. Proporciona contexto.** Claude no conoce tu situacion particular. Dale la informacion que necesita para responder de manera relevante.

**3. Indica el formato deseado.** Si necesitas una tabla, una lista numerada, un parrafo corto o un documento formal, dilo explicitamente.

**4. Itera sin miedo.** Tu primer mensaje es el inicio de una conversacion, no un examen. Puedes refinar la respuesta paso a paso.

## Ejemplo 1: Analisis de presupuesto

**Antes (vago):**
"Ayudame con el presupuesto."

**Despues (especifico):**
"Soy el director de la Direccion de Estadistica del PJENL. Necesito analizar el presupuesto de operacion del primer trimestre 2026. Los rubros principales son: papeleria ($45,000), servicios tecnologicos ($120,000), capacitacion ($30,000) y viaticos ($15,000). Comparalo con el mismo trimestre de 2025 donde los montos fueron $42,000, $95,000, $25,000 y $18,000 respectivamente. Presentalo en una tabla comparativa con porcentaje de variacion e incluye 3 observaciones clave."

La segunda version le da a Claude todo lo que necesita para entregar algo realmente util.

## Ejemplo 2: Redaccion de oficio

**Antes (vago):**
"Escribe un oficio."

**Despues (especifico):**
"Redacta un oficio del Director de Informatica del PJENL dirigido al Magistrado Presidente, solicitando autorizacion para adquirir 15 equipos de computo para renovacion del parque informatico de los juzgados civiles. Incluye justificacion tecnica mencionando que los equipos actuales tienen 7 anos de antiguedad, cita el articulo correspondiente del Reglamento Interior sobre adquisiciones, y usa el formato oficial con numero de oficio DI/2026/0342. Tono formal institucional."

## Ejemplo 3: Resumen de datos estadisticos

**Antes (vago):**
"Resume estos datos."

**Despues (especifico):**
"Tengo los datos de asuntos ingresados en materia civil de enero a marzo 2026 en el Distrito Judicial de Monterrey: enero 1,245, febrero 1,189, marzo 1,302. Comparados con el mismo periodo de 2025: enero 1,150, febrero 1,098, marzo 1,210. Necesito un parrafo ejecutivo de no mas de 100 palabras que destaque la tendencia, el porcentaje de crecimiento interanual, y una posible explicacion. Va dirigido al Pleno del Tribunal en la sesion del jueves."

## La tecnica del rol

Una estrategia poderosa es decirle a Claude **quien eres y para quien trabajas**. Esto ajusta automaticamente el tono, vocabulario y enfoque de sus respuestas.

Ejemplo: "Actua como asesor institucional del Poder Judicial de Nuevo Leon. Tu audiencia son magistrados y jueces. El tono debe ser formal pero accesible."

## Errores comunes a evitar

**No asumas que Claude sabe tu contexto.** Cada conversacion nueva empieza desde cero. Dale el contexto institucional que necesita.

**No aceptes la primera respuesta si no es perfecta.** Dile que ajuste: "Mas formal", "Mas breve", "Agrega cifras", "Cambia el enfoque a..."

**No copies respuestas sin revisar.** Claude es un borrador inteligente, pero el criterio final siempre es tuyo como servidor publico.`,
          },
        ],
      },
      {
        id: "organizando-trabajo",
        titulo: "Organizando tu trabajo con Claude",
        descripcion: "Projects, artifacts, y como mantener el contexto institucional",
        lecciones: [
          {
            id: "projects",
            titulo: "Introduccion a Projects",
            contenido: `## Que son los Projects

Los **Projects** (Proyectos) en Claude son espacios de trabajo organizados donde puedes agrupar conversaciones relacionadas con un mismo tema o actividad. Piensa en ellos como carpetas inteligentes: cada proyecto tiene su propio contexto, instrucciones y documentos de referencia que Claude utiliza automaticamente en cada conversacion dentro de ese proyecto.

## Por que usar Projects en el PJENL

Sin Projects, cada vez que inicias una conversacion con Claude debes explicar quien eres, que hace tu direccion y como quieres que responda. Con un proyecto configurado, esa informacion ya esta cargada. Es como la diferencia entre trabajar con un asistente nuevo cada dia versus trabajar con alguien que ya conoce tu area.

## Como crear un Project

En la barra lateral de Claude, busca la opcion **"Projects"** y haz clic en crear uno nuevo. Dale un nombre descriptivo, por ejemplo: "Direccion de Estadistica - Reportes 2026" o "Comunicacion Social - Boletines".

## Instrucciones del sistema

La parte mas poderosa de un proyecto son las **instrucciones personalizadas**. Aqui defines como quieres que Claude se comporte dentro de ese proyecto. Para un director del PJENL, podrias escribir algo como:

"Eres un asistente especializado en la Direccion de Estadistica del Poder Judicial del Estado de Nuevo Leon. Tu funcion es ayudar a redactar reportes estadisticos, analizar datos de productividad judicial y preparar informes para el Pleno del Tribunal. Siempre usa un tono formal e institucional. Los reportes deben seguir el formato oficial del PJENL. Cuando cites datos, aclara la fuente y el periodo."

Estas instrucciones se aplican automaticamente a **todas las conversaciones** dentro del proyecto, sin que tengas que repetirlas.

## Documentos de referencia

Puedes subir documentos a tu proyecto que Claude usara como referencia. Por ejemplo:

- El organigrama de tu direccion
- Plantillas de oficios o reportes
- La Ley Organica del Poder Judicial del Estado
- Datos estadisticos de periodos anteriores
- Manuales de procedimientos internos

Cuando hagas una pregunta dentro del proyecto, Claude consultara estos documentos para darte respuestas mas precisas y alineadas con tu contexto real.

## Ejemplo practico

Un director podria crear el proyecto **"Indicadores de Gestion 2026"** con instrucciones que especifiquen los KPIs que se miden, los formatos de reporte del Tribunal, y subir como referencia los datos del ano anterior. Cada vez que necesite generar un reporte mensual, simplemente abre una nueva conversacion en ese proyecto y Claude ya tendra todo el contexto necesario.

## Organizacion recomendada

Crea un proyecto por cada linea de trabajo recurrente. No mezcles temas. Un proyecto para reportes estadisticos, otro para comunicacion interna, otro para planeacion de proyectos. Esto mantiene las respuestas de Claude enfocadas y relevantes.`,
          },
          {
            id: "artifacts",
            titulo: "Creando con Artifacts",
            contenido: `## Que son los Artifacts

Los **Artifacts** son piezas de contenido que Claude crea de manera independiente a la conversacion. En lugar de simplemente mostrarte texto dentro del chat, Claude puede generar un documento, una tabla, una visualizacion o incluso una pagina interactiva en un panel separado que puedes copiar, descargar o compartir.

## Cuando Claude crea Artifacts

Claude genera automaticamente un artifact cuando el contenido es **suficientemente sustancial y autocontenido**: un reporte completo, una tabla de datos, un documento formateado, una grafica o un diagrama. Si le pides "dame tres ideas rapidas", respondera en el chat. Si le pides "genera un reporte trimestral de productividad", creara un artifact.

## Tipos de Artifacts utiles para el PJENL

**Documentos formateados:** Oficios, minutas, reportes ejecutivos y comunicados con estructura profesional que puedes copiar directamente a Word.

**Tablas de datos:** Comparativas, matrices de indicadores, calendarios de actividades organizados en formato tabular listo para usar.

**Visualizaciones:** Graficas de barras, lineas o pastel que ilustran tendencias estadisticas. Claude puede crear graficas interactivas que muestran datos judiciales de forma visual.

**Presentaciones:** Esquemas y contenido organizado por diapositivas que puedes trasladar a PowerPoint para reuniones con el Pleno o comites.

## Como aprovechar los Artifacts

La clave es **pedir explicitamente** el tipo de salida que necesitas. En lugar de "analiza estos datos", pide "crea una grafica de barras comparando los asuntos ingresados por materia en 2025 vs 2026". En lugar de "escribe un reporte", pide "genera un documento completo con portada, indice, introduccion, analisis y conclusiones sobre la productividad del primer trimestre".

## Iterando sobre Artifacts

Puedes pedirle a Claude que modifique un artifact existente: "Agrega una columna de porcentaje a la tabla", "Cambia los colores de la grafica a los institucionales del PJENL", "Agrega un parrafo de recomendaciones al final del reporte". Claude actualizara el artifact manteniendo los cambios anteriores.

## Consejo practico

Los artifacts son especialmente utiles para crear **plantillas reutilizables**. Pide a Claude que genere una plantilla de reporte mensual con la estructura de tu direccion, y luego usala como base cada mes cambiando solo los datos.`,
          },
          {
            id: "skills",
            titulo: "Trabajando con Skills",
            contenido: `## Que son las Skills

Las **Skills** son capacidades adicionales que Claude puede utilizar para realizar tareas especificas de manera mas precisa. Piensa en ellas como herramientas especializadas dentro de la caja de herramientas de Claude. Mientras que Claude por si solo es un asistente generalista muy capaz, las skills le permiten ejecutar tareas concretas con mayor precision.

## Skills disponibles

Claude cuenta con diversas skills que se activan segun el contexto de tu solicitud. Algunas de las mas relevantes para directores del PJENL incluyen:

**Analisis de documentos:** Claude puede leer y analizar documentos que le compartas, extrayendo puntos clave, identificando inconsistencias o comparando versiones.

**Generacion de codigo:** Si necesitas automatizar reportes o crear herramientas simples, Claude puede escribir codigo que funcione directamente.

**Busqueda y sintesis:** Claude puede buscar informacion en la web y sintetizarla en un formato util para tu trabajo.

## El Generador de Prompts: un ejemplo practico

Esta misma plataforma que estas usando, el **Generador de Prompts del PJENL**, es un ejemplo de como se pueden crear herramientas especializadas que trabajan con Claude. En lugar de que cada director tenga que aprender a escribir instrucciones complejas desde cero, el generador proporciona plantillas probadas y optimizadas para tareas comunes del Poder Judicial.

Cuando seleccionas una plantilla como "Analisis de Presupuesto" o "Redaccion de Oficio", la plataforma genera automaticamente un prompt detallado con la estructura, el contexto institucional y las instrucciones precisas que Claude necesita para producir un resultado de alta calidad.

## Como encontrar y usar Skills

En Claude.ai, las skills se activan de manera contextual. No necesitas buscarlas en un menu: simplemente describe lo que necesitas y Claude utilizara la skill mas apropiada. Si dices "busca informacion reciente sobre reforma judicial en Mexico", Claude activara su capacidad de busqueda. Si dices "analiza este PDF", activara su capacidad de analisis de documentos.

## Expandiendo tus capacidades

La combinacion de Claude con skills especializadas te permite abordar tareas que antes requerían herramientas separadas o conocimiento tecnico. Un director puede analizar datos, generar visualizaciones, redactar documentos y buscar informacion, todo dentro de la misma conversacion.

## Recomendacion para directores

Comienza usando Claude para tus tareas mas frecuentes y gradualmente explora capacidades mas avanzadas. No necesitas dominar todas las skills de una vez. Cada semana, prueba una nueva capacidad y evalua si mejora tu flujo de trabajo.`,
          },
        ],
      },
      {
        id: "expandiendo-alcance",
        titulo: "Expandiendo el alcance de Claude",
        descripcion: "Herramientas conectadas, busqueda empresarial y modo investigacion",
        lecciones: [
          {
            id: "herramientas",
            titulo: "Conectando tus herramientas",
            contenido: `## Integraciones de Claude

Claude puede conectarse con **herramientas externas** para acceder a informacion y realizar acciones mas alla de la conversacion de texto. Estas integraciones amplian significativamente lo que puedes lograr sin salir de la plataforma.

## Google Drive y documentos

Una de las integraciones mas utiles es con **Google Drive**. Si tu direccion utiliza Google Workspace, puedes permitir que Claude acceda a documentos, hojas de calculo y presentaciones directamente. En lugar de copiar y pegar contenido, simplemente referencia el documento y Claude lo leera por ti.

Ejemplo practico: "Revisa el reporte de indicadores del primer trimestre que esta en mi Drive y genera un resumen ejecutivo de una pagina para la reunion del Pleno."

## Busqueda en la web

Claude puede realizar **busquedas en internet** para complementar sus respuestas con informacion actualizada. Esto es especialmente valioso cuando necesitas datos recientes que no estan en el conocimiento base de Claude.

Por ejemplo: "Busca las ultimas reformas al Codigo de Procedimientos Civiles de Nuevo Leon publicadas en el Periodico Oficial del Estado en 2026."

## Flujo de trabajo mejorado

La clave de las integraciones es que **eliminan pasos intermedios** en tu flujo de trabajo. En lugar de: abrir Drive, buscar archivo, copiar datos, pegar en Claude, esperar respuesta, copiar resultado, pegar en nuevo documento... simplemente le dices a Claude que necesitas y el gestiona el proceso.

## Consideraciones de seguridad

Al conectar herramientas, Claude solo accede a la informacion que tu explicitamente le permitas. **No comparte datos entre usuarios** y no almacena informacion sensible mas alla de la sesion. Sin embargo, como servidores publicos del PJENL, siempre debemos ser cuidadosos con la informacion confidencial. Evita compartir datos personales de justiciables, informacion de expedientes en curso, o datos sensibles que no deban salir del ambito institucional.

## Conectando paso a paso

Para activar integraciones, busca el icono de herramientas o integraciones en la interfaz de Claude. Cada conexion requiere tu autorizacion explicita y puedes revocarla en cualquier momento. Comienza conectando las herramientas que uses con mayor frecuencia y evalua el impacto en tu productividad.`,
          },
          {
            id: "investigacion",
            titulo: "Modo investigacion para analisis profundos",
            contenido: `## Que es el modo de investigacion

El **modo de investigacion** de Claude es una funcionalidad disenada para consultas que requieren un analisis profundo y exhaustivo. A diferencia de una conversacion regular donde Claude responde en segundos, en modo investigacion Claude se toma mas tiempo para explorar multiples fuentes, contrastar informacion y construir una respuesta comprehensiva.

## Cuando usar el modo de investigacion

Este modo es ideal cuando necesitas:

**Analisis comparativos:** "Compara como funcionan los sistemas de estadistica judicial en los poderes judiciales de Nuevo Leon, Jalisco, Estado de Mexico y Ciudad de Mexico. Incluye estructura organizacional, indicadores que miden, y herramientas tecnologicas que utilizan."

**Investigacion de reformas:** "Investiga las implicaciones operativas de la reforma al articulo 17 constitucional en materia de justicia digital para los tribunales estatales. Que cambios deben implementar los poderes judiciales locales?"

**Mejores practicas:** "Investiga las mejores practicas internacionales en transparencia judicial y rendicion de cuentas. Enfocate en paises de America Latina con sistemas judiciales similares al mexicano."

## Como funciona

Cuando activas el modo de investigacion, Claude realiza multiples busquedas y consultas de manera sistematica. Lee diversas fuentes, extrae informacion relevante, identifica puntos de coincidencia y contradiccion, y finalmente sintetiza todo en un **reporte estructurado** con fuentes citadas.

El resultado suele ser un documento mas largo y detallado que una respuesta normal, organizado con secciones, subsecciones y referencias.

## Diferencias con el chat regular

En una conversacion normal, Claude responde de manera conversacional y rapida, ideal para tareas puntuales. En modo investigacion, la respuesta es mas parecida a un **trabajo de investigacion**: toma mas tiempo pero entrega mayor profundidad, multiples perspectivas y evidencia documentada.

## Aplicaciones para el PJENL

**Planeacion estrategica:** Investigar tendencias en modernizacion judicial para informar el plan institucional del PJENL.

**Benchmarking:** Comparar indicadores de gestion del PJENL con otros poderes judiciales estatales para identificar areas de mejora.

**Fundamentacion de proyectos:** Cuando necesitas justificar un proyecto ante el Pleno, el modo investigacion puede ayudarte a recopilar evidencia, datos comparativos y casos de exito de otras instituciones.

**Analisis normativo:** Revisar el marco legal aplicable a una iniciativa, identificando articulos relevantes de multiples ordenamientos y su interpretacion doctrinal.

## Consejos para mejores resultados

Define claramente el **alcance** de tu investigacion. En lugar de "investiga sobre justicia digital", especifica: "Investiga programas de justicia digital implementados en poderes judiciales estatales de Mexico entre 2023 y 2026, enfocandote en: tecnologias utilizadas, resultados medibles, costos de implementacion y lecciones aprendidas."`,
          },
          {
            id: "casos-uso",
            titulo: "Claude en accion: casos de uso por area",
            contenido: `## Aplicaciones practicas por direccion

Cada direccion del PJENL tiene necesidades distintas. A continuacion se presentan **casos de uso concretos** organizados por area, para que identifiques como Claude puede ayudarte en tu trabajo diario.

## Direccion de Estadistica

La Direccion de Estadistica puede aprovechar Claude de maneras particularmente poderosas:

- **Analisis de tendencias:** Proporciona datos de asuntos ingresados, resueltos y en tramite por periodo, y pide a Claude que identifique patrones, estacionalidad y proyecciones. "Con estos datos de los ultimos 12 meses, genera un analisis de tendencia e identifica los meses de mayor carga de trabajo por materia."

- **Generacion de reportes automatizados:** Entrega los datos crudos y pide el reporte en formato institucional. "Genera el reporte trimestral de productividad judicial con los siguientes datos, usando el formato del Consejo de la Judicatura."

- **Visualizacion de datos:** "Crea una grafica que muestre la evolucion de los tiempos promedio de resolucion por materia en los ultimos 3 anos."

## Direccion de Prensa y Comunicacion Social

- **Boletines de prensa:** "Redacta un boletin de prensa sobre la inauguracion del nuevo juzgado oral mercantil en el municipio de San Pedro. Incluye declaraciones del Magistrado Presidente y datos sobre la carga de trabajo que atendera."

- **Contenido para redes sociales:** "Genera 5 publicaciones para redes sociales sobre la Semana de Acceso a la Justicia, cada una con un mensaje diferente y hashtags relevantes. Tono accesible y ciudadano."

- **Sintesis informativa:** "Resume las 10 notas periodisticas mas relevantes de hoy relacionadas con el Poder Judicial en Nuevo Leon y en Mexico."

## Direccion de Administracion

- **Analisis presupuestal:** "Compara el ejercicio presupuestal del primer semestre con lo programado. Identifica partidas con subejercicio mayor al 20% y sugiere acciones correctivas."

- **Documentacion de adquisiciones:** "Redacta la justificacion tecnica para la contratacion de un servicio de soporte informatico, incluyendo analisis de mercado y beneficios esperados."

- **Planeacion de recursos:** "Con base en las proyecciones de carga de trabajo para 2027, calcula las necesidades de personal por juzgado usando la metodologia de cargas de trabajo del Consejo de la Judicatura Federal."

## Direccion Juridica

- **Analisis de acuerdos:** "Revisa este borrador de convenio de colaboracion interinstitucional e identifica clausulas que pudieran generar conflicto con la Ley Organica del Poder Judicial del Estado."

- **Investigacion juridica:** "Analiza la jurisprudencia reciente de la Suprema Corte sobre independencia judicial y su aplicabilidad al contexto del PJENL."

- **Comparativo normativo:** "Compara las facultades del Consejo de la Judicatura de Nuevo Leon con las de Jalisco y Ciudad de Mexico en materia de disciplina judicial."

## Direccion de Informatica

- **Documentacion tecnica:** "Genera la documentacion tecnica del nuevo sistema de gestion de expedientes, incluyendo diagrama de arquitectura, requisitos funcionales y plan de pruebas."

- **Planes de proyecto:** "Crea un plan de proyecto con cronograma para la migracion del sistema de nomina, considerando 4 fases: analisis, desarrollo, pruebas y puesta en produccion."

- **Evaluacion tecnologica:** "Compara las opciones de plataforma para el sistema de firma electronica: ventajas, desventajas, costos estimados y compatibilidad con la infraestructura actual del PJENL."

## Recomendacion transversal

Independientemente de tu area, comienza con las tareas que **mas tiempo te consumen** actualmente. Ahi es donde Claude generara el mayor impacto en tu productividad.`,
          },
        ],
      },
    ],
  },
  {
    cursoId: "ai-fluency",
    modulos: [
      {
        id: "fundamentos-ia",
        titulo: "Fundamentos de IA",
        descripcion: "Como funciona la IA generativa, capacidades, limitaciones y el marco de las 4D",
        lecciones: [
          {
            id: "como-funciona-ia",
            titulo: "Como funciona la IA generativa",
            contenido: `## La IA generativa en terminos simples

La **inteligencia artificial generativa** es un tipo de tecnologia que puede crear contenido nuevo: texto, imagenes, codigo, presentaciones y mas. A diferencia de un buscador como Google que encuentra informacion existente, la IA generativa produce respuestas originales construidas especificamente para tu solicitud.

## El proceso de entrenamiento

Para entender como funciona, imagina el proceso de formacion de un secretario de juzgado. Durante anos, ese secretario lee miles de expedientes, acuerdos, sentencias y oficios. Con el tiempo, desarrolla un sentido intuitivo de como debe redactarse cada tipo de documento, que lenguaje es apropiado y que estructura seguir. No memoriza cada documento, pero **internaliza los patrones**.

La IA generativa hace algo similar pero a una escala masiva. Durante su **entrenamiento**, el modelo procesa miles de millones de textos: libros, articulos cientificos, paginas web, documentos legales, manuales tecnicos y mucho mas. De esta lectura masiva, aprende los patrones del lenguaje humano: gramatica, logica, estilo, estructura argumentativa y relaciones entre conceptos.

## Tokens: las piezas del rompecabezas

La IA no lee palabras completas como nosotros. Descompone el texto en fragmentos llamados **tokens**, que son pedazos de palabras. Por ejemplo, la palabra "jurisdiccional" podria dividirse en "jurisd", "icc" e "ional". El modelo aprende las relaciones entre estos fragmentos para predecir cual viene despues, dado un contexto.

Esto es importante porque explica tanto las fortalezas como las limitaciones de la IA. Es extraordinariamente buena para generar texto coherente y util, pero **no comprende el mundo** como lo hacemos los humanos. Reconoce patrones estadisticos en el lenguaje.

## Por que suena inteligente pero puede equivocarse

Aqui esta la clave que todo director del PJENL debe entender: la IA genera texto que **suena correcto** porque ha aprendido como se estructura el lenguaje profesional. Puede redactar un oficio impecable en forma, pero citar un articulo de ley que no existe. Puede analizar datos con logica aparente, pero calcular un porcentaje de manera erronea.

Es como un pasante brillante que escribe muy bien pero todavia no ha verificado todas sus fuentes. El texto fluye con naturalidad, la estructura es profesional, el tono es apropiado, pero los **datos especificos requieren verificacion**.

## La diferencia entre comprender y predecir

Cuando un magistrado analiza un caso, comprende el contexto social, las implicaciones humanas y los principios juridicos en juego. La IA no comprende: **predice**. Genera la respuesta mas probable dados los patrones que aprendio. Frecuentemente eso es suficiente para tareas practicas, pero es fundamental mantener la distincion: la IA es una herramienta poderosisima de productividad, no un sustituto del criterio humano.

## Para que sirve esta comprension

Entender como funciona la IA te permite usarla de manera mas efectiva. Sabras por que funciona tan bien para ciertas tareas (redaccion, resumen, organizacion) y por que requiere supervision en otras (citas legales, datos numericos, hechos especificos). Este conocimiento te convierte en un usuario informado, no solo un usuario casual.`,
          },
          {
            id: "capacidades-limitaciones",
            titulo: "Capacidades y limitaciones actuales",
            contenido: `## Lo que la IA hace extraordinariamente bien

Ser honesto sobre las capacidades y limitaciones de la IA es fundamental para usarla responsablemente. Comencemos por lo que la IA generativa **hace mejor que cualquier herramienta anterior**:

**Resumir y sintetizar.** Dale un documento de 50 paginas y te entregara un resumen ejecutivo de una pagina en segundos. Para directores del PJENL que reciben decenas de circulares, acuerdos y reportes, esto es transformador.

**Redactar borradores.** Oficios, comunicados, minutas, reportes, correos formales. La IA produce borradores bien estructurados que puedes editar y personalizar, ahorrando horas de trabajo.

**Analizar patrones en datos.** Entregale una tabla de datos y la IA identificara tendencias, anomalias y correlaciones. Puede convertir datos crudos en narrativas comprensibles.

**Traducir y adaptar tono.** No solo traduce entre idiomas, sino entre registros: puede tomar un texto tecnico y hacerlo accesible para ciudadanos, o tomar un borrador informal y formalizarlo.

**Organizar y estructurar informacion.** Convierte notas desordenadas en documentos organizados, crea esquemas a partir de ideas sueltas, genera agendas de reunion a partir de objetivos.

## Lo que la IA hace de manera poco confiable

Aqui es donde la honestidad es crucial para servidores publicos:

**Citas legales especificas.** La IA puede inventar numeros de articulos, nombres de leyes que no existen o atribuir contenido incorrecto a leyes reales. **Nunca uses una referencia legal de la IA sin verificarla** en la fuente original. Esto es especialmente critico para el PJENL.

**Calculos matematicos complejos.** Aunque mejora constantemente, la IA puede cometer errores en operaciones aritmeticas, porcentajes o calculos estadisticos. Siempre verifica las cifras con una calculadora o hoja de calculo.

**Informacion en tiempo real.** La IA tiene una fecha limite de conocimiento. No sabe que paso ayer a menos que tenga acceso a busqueda web. No asumas que sus datos estan actualizados.

**Datos confidenciales.** La IA no debe usarse para procesar informacion clasificada o datos personales sensibles sin las debidas precauciones institucionales. Como servidores publicos, tenemos obligaciones legales de proteccion de datos.

## La zona gris: tareas que requieren supervision

Muchas tareas caen en un area intermedia donde la IA es util pero necesita **supervision humana activa**:

**Analisis juridico:** La IA puede estructurar argumentos y organizar analisis, pero la interpretacion juridica final debe ser humana.

**Estadisticas y reportes oficiales:** La IA puede generar el formato y la narrativa, pero los datos deben verificarse contra las fuentes oficiales.

**Comunicacion institucional:** Los borradores de la IA son un excelente punto de partida, pero deben revisarse para asegurar que reflejen la posicion oficial del PJENL.

## La regla de oro para el PJENL

**Acepta la estructura, verifica la sustancia.** La IA es excelente para darte la forma correcta: formato de oficio, estructura de reporte, organizacion de ideas. Pero cada dato factual, cada cita legal, cada cifra numerica debe ser verificada por ti antes de que salga como documento oficial del Poder Judicial.

## Una perspectiva realista

La IA no reemplaza a ningun servidor publico del PJENL. Es una herramienta que amplifica tu capacidad de trabajo. Usada correctamente, te permite hacer en 30 minutos lo que antes tomaba 3 horas. Usada sin criterio, puede generar documentos que parecen profesionales pero contienen errores que danarian la credibilidad institucional.`,
          },
          {
            id: "marco-4d",
            titulo: "El marco de las 4D para trabajar con IA",
            contenido: `## Un marco practico para colaborar con IA

Trabajar efectivamente con inteligencia artificial requiere un enfoque sistematico. El **marco de las 4D** proporciona una metodologia clara para que cada interaccion con IA produzca resultados de calidad institucional. Las cuatro D son: Delegar, Describir, Discernir y Diligencia.

## Primera D: Delegar

**Delegar** es el primer paso: decidir que tareas confiar a la IA y cuales mantener exclusivamente en manos humanas. No todo debe delegarse a la IA, y no todo debe hacerse manualmente.

La regla practica para un director del PJENL es esta: si la tarea es **rutinaria, repetitiva o de formateo**, es candidata ideal para la IA. Si la tarea requiere **criterio judicial, responsabilidad legal o decision politica**, debe permanecer en manos humanas.

Buenos candidatos para delegar: borradores de oficios, resumenes de documentos extensos, formateo de datos en tablas, generacion de reportes periodicos, redaccion de comunicados rutinarios.

Tareas que deben mantenerse humanas: decisiones jurisdiccionales, evaluacion de personal, manejo de informacion clasificada, posiciones institucionales ante otros poderes, analisis de implicaciones eticas.

Ejemplo PJENL: Puedes delegar a la IA la redaccion del primer borrador de un informe de labores, pero la validacion de cifras y la aprobacion del mensaje institucional son responsabilidad del director.

## Segunda D: Describir

**Describir** es la habilidad de comunicar a la IA exactamente lo que necesitas. La calidad de tus instrucciones determina directamente la calidad del resultado. Un prompt bien descrito incluye: quien eres, que necesitas, como lo quieres, que evitar y que criterios de calidad aplican.

Ejemplo PJENL: En lugar de "hazme un reporte", describe: "Soy el Director de la Unidad de Estadistica del PJENL. Necesito un reporte ejecutivo de 2 paginas sobre la productividad judicial del primer trimestre 2026, comparando con el mismo periodo de 2025. El formato debe incluir introduccion, tabla comparativa por materia, grafica de tendencia y 3 conclusiones. El tono debe ser formal y dirigido al Pleno del Tribunal."

## Tercera D: Discernir

**Discernir** es la capacidad de evaluar criticamente lo que la IA te entrega. No todo lo que la IA genera es correcto, y no todo lo que parece profesional es preciso.

Desarrolla el habito de revisar tres elementos en cada respuesta de la IA:

**Precision factual:** Los datos, cifras y citas que menciona, son verificables? Los numeros de articulos existen? Las estadisticas son plausibles?

**Coherencia logica:** Los argumentos siguen una logica solida? Las conclusiones se derivan de las premisas? No hay contradicciones internas?

**Adecuacion institucional:** El tono es apropiado para el PJENL? El formato cumple con los estandares institucionales? El contenido refleja la posicion del Poder Judicial?

Ejemplo PJENL: Si la IA genera un oficio citando el "articulo 157 de la Ley Organica del Poder Judicial del Estado", verifica que ese articulo existe y dice lo que la IA afirma. Si genera una estadistica diciendo que "la productividad aumento un 15%", calcula tu mismo el porcentaje con los datos fuente.

## Cuarta D: Diligencia

**Diligencia** es el compromiso con la mejora continua y la verificacion sistematica. Significa no conformarse con la primera respuesta, iterar hasta obtener calidad institucional, y mantener un estandar alto en todo lo que sale de tu oficina, haya sido generado con IA o sin ella.

La diligencia implica tres practicas:

**Iterar:** La primera respuesta de la IA rara vez es la version final. Refina, ajusta, pide cambios. Tres rondas de iteracion suelen producir resultados significativamente mejores que aceptar el primer borrador.

**Verificar:** Confirma datos contra fuentes oficiales. Revisa que el formato cumpla estandares. Asegurate de que el documento esta listo para la firma del titular.

**Documentar:** Registra que tareas funcionan bien con IA y cuales no, para optimizar tu flujo de trabajo con el tiempo.

Ejemplo PJENL: Al preparar un informe para el Pleno, usa la IA para el primer borrador (Delegar), da instrucciones claras sobre formato y contenido (Describir), revisa la precision de cada dato (Discernir), e itera hasta que el documento tenga calidad de presentacion ante magistrados (Diligencia).

## El ciclo completo

Las 4D no son pasos aislados sino un **ciclo continuo**. Cada tarea que realizas con IA te ensena algo: que funciona, que no, como mejorar tus instrucciones, que verificar primero. Con el tiempo, tu flujo de trabajo con IA se vuelve mas eficiente y los resultados son consistentemente mejores.`,
          },
        ],
      },
      {
        id: "habilidades-practicas",
        titulo: "Habilidades practicas con IA",
        descripcion: "Delegacion efectiva, descripcion precisa, evaluacion critica e iteracion",
        lecciones: [
          {
            id: "delegacion",
            titulo: "Delegacion: que tareas darle a la IA",
            contenido: `## El arte de elegir que delegar

No todas las tareas son iguales frente a la IA. Algunas se benefician enormemente de la asistencia artificial, mientras que otras deben permanecer firmemente en manos humanas. Aprender a distinguir entre ambas es una **habilidad critica** para cualquier director del PJENL.

## Tres categorias de tareas

Piensa en tus actividades diarias divididas en tres categorias:

**Categoria A: Ideal para IA.** Tareas rutinarias, repetitivas o de alto volumen que no requieren criterio especializado. La IA las ejecuta mas rapido y con calidad consistente.

- Primer borrador de oficios con formato estandar
- Formateo y organizacion de datos en tablas
- Resumen de documentos extensos (circulares, acuerdos, informes)
- Generacion de graficas a partir de datos
- Redaccion de correos rutinarios y comunicados base
- Conversion de notas de reunion en minutas estructuradas
- Traduccion de documentos

**Categoria B: IA como asistente, humano decide.** Tareas donde la IA proporciona un borrador o analisis inicial valioso, pero el resultado final requiere revision y juicio humano.

- Reportes estadisticos (IA estructura, humano verifica datos)
- Analisis juridico preliminar (IA organiza, humano interpreta)
- Propuestas de presupuesto (IA calcula, humano prioriza)
- Comunicados institucionales (IA redacta, humano valida mensaje)
- Planes de trabajo (IA propone estructura, humano ajusta realidades)

**Categoria C: Solo humano.** Tareas que involucran responsabilidad legal, criterio etico, informacion altamente confidencial o decision politica institucional.

- Resoluciones jurisdiccionales
- Evaluacion de desempeno de personal
- Manejo de datos personales sensibles de justiciables
- Posicionamiento institucional ante medios o poderes
- Decisiones disciplinarias
- Negociaciones interinstitucionales

## La matriz de decision

Para decidir rapidamente si una tarea es delegable a la IA, hazte estas preguntas:

**Riesgo:** Si la IA comete un error, las consecuencias son graves? Si la respuesta es si, mantén la tarea en categoria B o C.

**Repetitividad:** Haces esta tarea frecuentemente con estructura similar? Si es asi, es candidata para categoria A.

**Confidencialidad:** Involucra datos personales, expedientes activos o informacion reservada? Si es asi, categoria C.

**Verificabilidad:** Puedes verificar facilmente el resultado? Si es facil de verificar, puedes delegarla con mayor confianza.

## Ejemplo practico: el flujo de un director

Imagina el dia tipico de un director del PJENL:

8:00 - Llegan 5 correos que requieren respuesta. **Categoria A:** Pide a la IA que redacte borradores de respuesta para cada uno. Tu revisas, ajustas y envias.

9:00 - Debes preparar el reporte mensual de indicadores. **Categoria B:** La IA genera la estructura del reporte y las narrativas a partir de los datos que tu proporcionas. Tu verificas cada cifra antes de firmar.

11:00 - Reunion con el Magistrado sobre un tema sensible de personal. **Categoria C:** Preparas los puntos tu mismo. La informacion involucrada es confidencial.

14:00 - Necesitas un resumen de la nueva circular del Consejo. **Categoria A:** La IA lo resume en 3 minutos.

## El beneficio: recuperar tu tiempo

La delegacion inteligente no se trata de reemplazar tu trabajo, sino de **liberar tu tiempo** para las tareas donde tu criterio como director es insustituible. Si la IA se encarga de las tareas de Categoria A (que pueden consumir el 40% de tu dia), recuperas horas valiosas para dedicar a las tareas de Categoria C, donde realmente generas valor institucional.`,
          },
          {
            id: "descripcion",
            titulo: "Descripcion: como dar instrucciones claras",
            contenido: `## La instruccion como habilidad profesional

Dar instrucciones claras a la IA es esencialmente la misma habilidad que necesitas para dirigir un equipo de trabajo: comunicar con precision que necesitas, como lo necesitas y para cuando. La diferencia es que la IA sigue tus instrucciones de manera literal, asi que **la precision importa mas que nunca**.

## Los 5 elementos de una buena instruccion

Toda instruccion efectiva para la IA incluye cinco elementos. No siempre necesitas los cinco, pero mientras mas incluyas, mejor sera el resultado.

**1. Contexto: quien eres y cual es la situacion**

El contexto le dice a la IA desde que perspectiva debe responder. Sin contexto, la IA genera respuestas genericas.

Ejemplo: "Soy el Director de la Direccion de Estadistica del Poder Judicial del Estado de Nuevo Leon. Mi equipo produce reportes trimestrales de productividad judicial para el Pleno del Tribunal Superior de Justicia."

**2. Tarea: que necesitas especificamente**

Define la accion concreta que la IA debe realizar. Se lo mas especifico posible.

Ejemplo: "Necesito que generes el reporte de productividad del primer trimestre 2026, comparando los asuntos ingresados, resueltos y en tramite por materia (civil, penal, familiar, mercantil) contra el mismo trimestre de 2025."

**3. Formato: como quieres el resultado**

Indica la estructura, longitud y presentacion del resultado.

Ejemplo: "El reporte debe tener maximo 3 paginas. Incluye una tabla comparativa, una grafica de tendencia, y un parrafo de conclusiones. Usa encabezados claros y numeracion de secciones."

**4. Restricciones: que evitar**

Define limites claros sobre lo que la IA no debe hacer.

Ejemplo: "No inventes datos. Usa exclusivamente las cifras que te proporciono. No incluyas recomendaciones de politica publica. Evita lenguaje coloquial."

**5. Criterios de calidad: que hace buena la respuesta**

Define como evaluar si el resultado es exitoso.

Ejemplo: "El reporte es exitoso si un magistrado puede leerlo en 5 minutos y entender las tendencias principales. Las conclusiones deben ser accionables y basadas en los datos presentados."

## Transformacion completa: antes y despues

**Antes:**
"Hazme un reporte de estadisticas."

**Despues:**
"Soy el Director de Estadistica del PJENL. Necesito un reporte ejecutivo del primer trimestre 2026 para presentar al Pleno del Tribunal el proximo jueves.

Datos de asuntos ingresados Q1 2026: Civil 3,450, Penal 2,890, Familiar 4,120, Mercantil 1,670.
Datos Q1 2025: Civil 3,200, Penal 2,750, Familiar 3,890, Mercantil 1,540.

El reporte debe incluir: (1) tabla comparativa con variacion porcentual, (2) grafica de barras agrupadas, (3) parrafo ejecutivo de 100 palabras identificando la materia con mayor crecimiento, (4) tres conclusiones clave.

Formato: maximo 2 paginas, tono formal, encabezado con logo institucional del PJENL. No incluyas recomendaciones ni proyecciones, solo hechos y tendencias observadas."

## La progresion natural

No necesitas escribir instrucciones perfectas desde la primera vez. Comienza con los elementos basicos (contexto + tarea) y agrega formato, restricciones y criterios conforme vayas necesitando mayor precision.

Con la practica, escribir instrucciones detalladas se volvera natural. Muchos directores reportan que despues de unas semanas, redactar un prompt completo les toma menos de 2 minutos y les ahorra horas de trabajo en el resultado final.

## Consejo final

**Guarda tus mejores instrucciones.** Cuando logres un prompt que produce resultados excelentes, guardalo como plantilla. La proxima vez que necesites algo similar, solo ajusta los datos y reutiliza la estructura. El Generador de Prompts del PJENL ya incluye varias de estas plantillas optimizadas para tu uso.`,
          },
          {
            id: "discernimiento",
            titulo: "Discernimiento: como evaluar lo que la IA te entrega",
            contenido: `## La evaluacion critica como habito

Recibir una respuesta de la IA es solo la mitad del proceso. La otra mitad, igualmente importante, es **evaluar criticamente** lo que te entrego antes de usarlo. Como directores del PJENL, los documentos que salen de nuestras oficinas representan al Poder Judicial. Un error puede tener consecuencias institucionales serias.

## Banderas rojas: senales de alerta

Aprende a identificar estos patrones que indican que la IA pudo haber cometido un error:

**Citas legales demasiado especificas.** Si la IA menciona "el articulo 234, fraccion III, inciso b) de la Ley Organica del Poder Judicial del Estado de Nuevo Leon", verifica. La IA frecuentemente inventa numeros de articulos que suenan plausibles pero no existen. Esta es la bandera roja mas importante para el contexto judicial.

**Estadisticas redondas y convenientes.** Si la IA dice "esto represento un aumento del 25% respecto al periodo anterior" sin que tu le hayas dado datos especificos, probablemente invento la cifra. Los datos reales rara vez son numeros tan redondos.

**Lenguaje excesivamente seguro.** Cuando la IA dice "sin duda", "es un hecho que" o "claramente", paradojicamente puede ser una senal de que esta menos segura. Las respuestas genuinamente informadas tienden a incluir matices.

**Estructura perfecta, contenido generico.** Si el documento tiene una estructura impecable pero el contenido podria aplicarse a cualquier institucion del pais, la IA probablemente no personalizo lo suficiente para el contexto del PJENL.

**Incoherencias internas.** Revisa que los datos mencionados en diferentes partes del documento sean consistentes. A veces la IA menciona una cifra en la introduccion y una diferente en las conclusiones.

## El metodo de verificacion rapida

No necesitas revisar cada palabra. Aplica este metodo de **verificacion en tres niveles**:

**Nivel 1 - Lectura rapida (1 minuto):** Lee el documento completo rapidamente. La estructura tiene sentido? El tono es apropiado? Las secciones fluyen logicamente?

**Nivel 2 - Verificacion de datos (3-5 minutos):** Revisa cada cifra, fecha, nombre y referencia legal contra tus fuentes originales. Este es el paso mas importante. Usa una lista de verificacion mental: los numeros cuadran? Los articulos existen? Las fechas son correctas?

**Nivel 3 - Prueba de audiencia (1 minuto):** Preguntate: si un magistrado lee esto, lo encontrara preciso, profesional y util? Si un periodista lo viera, hay algo que pudiera malinterpretarse?

## El enfoque "confiar pero verificar"

La estrategia mas eficiente para el trabajo diario es **aceptar la estructura y verificar la sustancia**:

**Acepta de la IA:** La organizacion del documento, la estructura de los parrafos, la logica argumentativa general, las transiciones entre secciones, el formato y presentacion.

**Verifica tu mismo:** Cada dato numerico, cada referencia legal, cada nombre propio, cada fecha, cada afirmacion factual especifica.

Este enfoque te permite aprovechar la velocidad de la IA para la parte de formateo y redaccion (que normalmente consume el 60% del tiempo de crear un documento) mientras aseguras la precision del contenido sustantivo.

## Construyendo criterio con la practica

Con el uso frecuente, desarrollaras un **sexto sentido** para detectar cuando la IA esta inventando versus cuando esta proporcionando informacion confiable. El tono cambia sutilmente, las respuestas se vuelven mas genericas, o aparecen detalles sospechosamente convenientes. Este criterio se desarrolla con la practica y es una de las habilidades mas valiosas que puedes cultivar.

## Ejemplo PJENL

Si la IA genera un informe que dice: "De acuerdo con el articulo 89 de la Ley Organica, el Consejo de la Judicatura tiene facultad para...", tu trabajo es abrir la Ley Organica, ir al articulo 89 y confirmar que (a) el articulo existe y (b) dice lo que la IA afirma. Esto toma 2 minutos y puede evitar un error que dañe la credibilidad de tu direccion.`,
          },
          {
            id: "iteracion",
            titulo: "Iteracion: el ciclo de mejora continua",
            contenido: `## La primera respuesta es un borrador

Uno de los errores mas comunes al usar IA es tratar la primera respuesta como el producto final. En realidad, la primera respuesta es un **borrador inicial**, un punto de partida que debes refinar mediante conversacion. Los mejores resultados siempre surgen despues de dos o tres rondas de iteracion.

## Como dar retroalimentacion efectiva

Cuando la respuesta de la IA no es exactamente lo que necesitas, dale **retroalimentacion especifica** en lugar de comenzar desde cero. Claude mantiene el contexto de toda la conversacion, asi que cada mensaje de retroalimentacion refina el resultado anterior.

Tipos de retroalimentacion que funcionan:

**Ajuste de tono:** "Hazlo mas formal, este documento va dirigido al Magistrado Presidente." O bien: "El tono es demasiado academico, necesito que sea accesible para servidores publicos de base."

**Ajuste de longitud:** "Reduce esto a la mitad, necesito un resumen ejecutivo, no un informe completo." O: "Expande la seccion de conclusiones, necesito mas detalle sobre las implicaciones presupuestales."

**Ajuste de contenido:** "Agrega fundamento legal citando la Ley Organica del Poder Judicial del Estado." O: "Elimina la seccion de recomendaciones, solo necesito el diagnostico."

**Ajuste de formato:** "Presenta esto como tabla en lugar de parrafos." O: "Agrega numeracion a las secciones y encabezados mas descriptivos."

## El flujo de iteracion en tres rondas

La mayoria de las tareas producen resultados excelentes en **tres rondas**:

**Ronda 1: El borrador base.** Envia tu instruccion inicial con contexto, tarea y formato. La IA genera un primer borrador que probablemente tenga la estructura correcta pero necesite ajustes.

**Ronda 2: Refinamiento mayor.** Revisa el borrador e identifica los 2-3 cambios mas importantes. Pide los ajustes de manera especifica. La IA incorpora los cambios manteniendo lo que ya funcionaba.

**Ronda 3: Pulido final.** Revisa los detalles finos: tono, precision de datos, formato exacto. Pide los ultimos ajustes. El resultado de esta ronda generalmente esta listo para uso profesional.

## Ejemplo practico: un acuerdo de colaboracion

**Ronda 1:** "Redacta un convenio de colaboracion entre el PJENL y la Universidad Autonoma de Nuevo Leon para un programa de servicio social de estudiantes de derecho en los juzgados civiles del Distrito de Monterrey."

La IA genera un borrador con estructura de convenio: antecedentes, clausulas, obligaciones.

**Ronda 2:** "Bien la estructura. Ajusta lo siguiente: (1) agrega una clausula sobre proteccion de datos personales de los justiciables, (2) especifica que el convenio tiene vigencia de un ano con posibilidad de prorroga, (3) incluye la clausula de resolucion de controversias ante el Tribunal de lo Contencioso."

**Ronda 3:** "Casi perfecto. Cambia 'las partes' por los nombres completos de las instituciones en cada mencion. Agrega al final el espacio para firmas del Magistrado Presidente y del Rector con nombres completos y cargos."

## La conversacion como colaboracion

Piensa en tu interaccion con la IA no como dar ordenes a una maquina, sino como **colaborar con un redactor** muy eficiente. Tu aportas el conocimiento institucional, el criterio profesional y la vision de lo que necesitas. La IA aporta velocidad, estructura y capacidad de redaccion.

## Guardando lo que funciona

Cuando logres un resultado excelente despues de iterar, **guarda tanto el resultado como el proceso**. Copia la secuencia de mensajes que usaste. La proxima vez que necesites algo similar, puedes reutilizar esa secuencia como plantilla, reduciendo las rondas de iteracion de tres a una.`,
          },
        ],
      },
    ],
  },
];
