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
