/*
 * Contenido de "calentamiento" de /faq.
 *
 * A diferencia del bot —que reserva información para generar conversación— acá
 * las dudas se resuelven abiertamente. El objetivo es que la persona llegue a
 * WhatsApp con las dudas ya resueltas, no que llegue a preguntarlas.
 *
 * Las seis preguntas son las del brief y el orden es el del brief.
 *
 * `respuesta: null` = todavía no hay respuesta aprobada. La página lo muestra
 * como pendiente. NO se completan de memoria: varias son afirmaciones clínicas
 * (dolor, resultados, intervalos) y una respuesta inventada acá es una promesa
 * que el equipo tiene que sostener en la sucursal.
 */

export interface Pregunta {
  slug: string
  pregunta: string
  /** Párrafos de la respuesta. `null` = pendiente de aprobación. */
  respuesta: string[] | null
  /** Link interno para profundizar, cuando aplica. */
  verMas?: { label: string; to: string }
}

export const PREGUNTAS: Pregunta[] = [
  {
    slug: 'ocho-sesiones',
    pregunta: '¿Con 8 sesiones se elimina todo el vello?',
    respuesta: null,
  },
  {
    slug: 'duele',
    pregunta: '¿Duele el láser diodo?',
    respuesta: null,
  },
  {
    slug: 'cada-cuanto',
    pregunta: '¿Cada cuánto son las sesiones?',
    respuesta: null,
  },
  {
    slug: 'niveles-bikini',
    pregunta: '¿Cuál es la diferencia entre los 4 niveles de bikini?',
    respuesta: null,
    verMas: { label: 'Ver los 4 niveles', to: '/laser/bikini' },
  },
  {
    /*
     * La única que el brief responde de forma completa: las tres zonas que el
     * Full Body no cubre. Sale de FULL_BODY.noIncluye en `precios.ts` para no
     * tener la lista escrita en dos lugares que se puedan desincronizar.
     */
    slug: 'full-body-no-cubre',
    pregunta: '¿Qué zonas no cubre el Full Body?',
    respuesta: ['El Full Body no incluye manos, pies ni nuca. El resto de las zonas entran en el paquete.'],
    verMas: { label: 'Ver Full Body', to: '/laser/cuerpo-completo' },
  },
  {
    /*
     * Los nombres de las tres fases son del brief; la explicación de cada una
     * no está y queda pendiente.
     */
    slug: 'fases-vello',
    pregunta: '¿Cómo son las fases del crecimiento del vello?',
    respuesta: null,
  },
]

/** Nombres de las tres fases, del brief. Las descripciones están pendientes. */
export const FASES_VELLO = ['Activación', 'Reducción', 'Control']
