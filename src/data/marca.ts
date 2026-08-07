/*
 * Copy de marca y posicionamiento. Está centralizado porque estas frases se
 * repiten en varias páginas y tienen que decir exactamente lo mismo en todas.
 *
 * TONO DEL SITIO: profesional, limpio, directo. Sin "hermosa", sin emojis, sin
 * frases de cierre agresivas. La calidez y el cierre pasan en WhatsApp, no acá
 * — el sitio existe para que la persona llegue al chat ya con el precio y el
 * paquete claros.
 */

export const MARCA = {
  nombre: 'Cire Depilación',
  anosExperiencia: 9,
  cantidadSucursales: 5,

  /** Nombre registrado del protocolo. El ® va siempre. */
  protocolo: 'Láser Expert 8®',

  tecnologia: 'Láser diodo con punta de zafiro',
}

/*
 * Frases aprobadas, tomadas del brief tal cual. No se editan sin aprobación:
 * son las que sostienen el posicionamiento.
 */
export const CLAIMS = {
  protocolo: 'Protocolo Láser Expert 8® — diseñado para tu tipo de piel y vello',
  experiencia: 'Resultados progresivos, respaldados por 9 años de experiencia',
  tecnologia: 'Tecnología láser diodo con punta de zafiro',
  /*
   * Agregado fuera del brief original, a pedido explícito (05/ago/26) para
   * atender la objeción #1 antes de precio: el miedo al dolor. Ancla la
   * comodidad a la punta de zafiro (dato técnico real, ya mencionado en
   * `tecnologia`) en vez de una frase genérica de "sin dolor" sin sustento.
   */
  comodidad: 'Punta de zafiro que enfría la piel al momento, para mayor comodidad',
}

/*
 * Los 4 micro-sellos que van debajo del CTA del hero (05/ago/26). Cada uno
 * contesta una objeción distinta antes de cualquier scroll: dolor, confianza,
 * tiempo hasta ver resultado y quién te atiende.
 *
 * Viven acá y no en Hero.tsx porque son claims de marca: los números salen de
 * MARCA, así que si cambia la cantidad de sucursales o de años no queda una
 * copia desactualizada suelta en el hero.
 *
 * Desde el rediseño a pastillas (ver SellosConfianza en Hero.tsx) cada sello
 * lleva dos textos y un ícono:
 *
 * - `texto` es la etiqueta corta que se ve en la pastilla. Corto es un
 *   requisito de forma, no una preferencia: una pastilla que se parte en dos
 *   renglones deja de leerse de un vistazo, que es todo lo que hace útil a
 *   este bloque.
 * - `detalle` es el claim completo, el que llevaban antes como texto visible.
 *   Va al `title` y al texto accesible de cada pastilla, así lo que se pierde
 *   al acortar sigue estando para quien lo busca y para el crawler.
 * - `icono` es una clave, no un componente ni un emoji: los glifos se dibujan
 *   en Hero.tsx (ver SELLO_ICONS) para que este archivo siga siendo copy y no
 *   arrastre JSX.
 */
export type SelloIcono = 'frio' | 'experiencia' | 'resultado' | 'certificadas'

export interface SelloHero {
  icono: SelloIcono
  texto: string
  detalle: string
}

export const SELLOS_HERO: SelloHero[] = [
  {
    icono: 'frio',
    texto: 'Punta de zafiro',
    detalle: 'Tecnología fría punta de zafiro (sin dolor)',
  },
  {
    icono: 'experiencia',
    texto: `${MARCA.anosExperiencia} años de experiencia`,
    detalle: `${MARCA.anosExperiencia} años de experiencia y ${MARCA.cantidadSucursales} sucursales`,
  },
  {
    icono: 'resultado',
    texto: 'Resultados 1ª sesión',
    detalle: 'Resultados visibles desde la 1ª sesión',
  },
  {
    icono: 'certificadas',
    texto: 'Certificadas',
    detalle: 'Especialistas 100% certificadas',
  },
]

/*
 * Calificación agregada que acompaña a las reseñas del sitio.
 *
 * PENDIENTE DE VERIFICAR: el 4.9 viene del ejemplo del pedido (05/ago/26), NO
 * de una lectura del panel de Google Business. Hay que confirmarlo contra el
 * perfil real antes de publicar — es un número que cualquiera puede contrastar
 * en Maps en dos segundos, y si no coincide hace más daño que no ponerlo.
 *
 * Por el mismo motivo no se emite como `aggregateRating` en el JSON-LD (ver
 * useJsonLd.ts): marcar como structured data un promedio sin verificar es
 * justo lo que Google penaliza.
 */
export const GOOGLE_REVIEWS = {
  promedio: '4.9',
  escala: '5',
  fuente: 'Google Reviews',
  /** Texto de la insignia sobre cada reseña. */
  insignia: 'Reseña verificada de Google Maps',
}

/*
 * Gancho de captura del formulario de leads del home (ver LeadForm.tsx). Es la
 * única promesa comercial del sitio fuera de los precios, así que va textual y
 * en un solo lugar: quien atiende en WhatsApp tiene que poder honrar
 * exactamente esto.
 */
export const LEAD_MAGNET = {
  /*
   * Etiqueta de la insignia que corona la tarjeta (ver LeadForm.tsx). Dice
   * "web" a propósito: acota la promesa al canal donde se ve, así quien
   * atiende en WhatsApp no tiene que honrarla en una llamada ni en mostrador.
   */
  badge: 'Promoción exclusiva web',
  titulo: 'Obtén un 10% de descuento en tu primera sesión o una evaluación de piel gratuita',
  texto:
    '¿Todavía no te decides? Déjanos tus datos y una especialista te contacta con el beneficio aplicado, sin compromiso.',
  cta: 'Obtener mi descuento',
}

/*
 * Línea de cumplimiento sanitario. El permiso COFEPRIS existe pero el documento
 * NO se publica por confidencialidad: va solo esta línea genérica, textual.
 */
export const COFEPRIS = 'Cumplimos con la normativa sanitaria vigente para procedimientos estéticos.'

/** Cuentas oficiales, para los íconos del footer. */
export const REDES = {
  instagram: 'https://www.instagram.com/ciredepilacion/',
  facebook: 'https://www.facebook.com/cire.depilacion/',
}
