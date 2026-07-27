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
