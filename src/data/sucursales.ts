/*
 * Las 5 sucursales. Fuente de /ubicaciones y de /ubicaciones/:slug.
 *
 * IMPORTANTE — direcciones y links de Maps
 * -----------------------------------------
 * Van copiadas TAL CUAL del listado oficial. No se parafrasean, no se
 * "ordenan" y no se completan de memoria: una dirección mal transcrita manda
 * gente al lugar equivocado. Mientras `direccion` esté vacía la página lo
 * muestra como pendiente en lugar de mostrar algo aproximado.
 *
 * `mapsUrl` es el link exacto de Google Maps del listado oficial (el de
 * "Compartir"). `mapsQuery` es el fallback para el iframe cuando todavía no
 * está el link: se le pasa la dirección a Maps y embebe eso.
 */

export interface Sucursal {
  slug: string
  nombre: string

  /** Dirección exacta del listado oficial. Vacío = pendiente. */
  direccion: string

  /** Link exacto de Google Maps del listado oficial. */
  mapsUrl?: string

  /** Fallback para el iframe si todavía no hay `mapsUrl`. */
  mapsQuery?: string

  /** Foto propia de la sucursal, en `public/sucursales/`. */
  foto?: string

  /** Referencias para llegar (entre qué calles, estacionamiento). */
  referencias?: string
}

/*
 * El horario es el mismo en las cinco, así que vive una sola vez. Si alguna
 * llega a tener horario propio, se le agrega un campo `horarios` a esa sucursal
 * y la página lo prefiere sobre este.
 */
export const HORARIO = [
  { dias: 'Lunes a viernes', horas: '10:00 – 20:00' },
  { dias: 'Sábados', horas: '9:00 – 16:00' },
]

/*
 * NOTA: la regla de Del Valle (sesiones cada 8 semanas) NO va acá ni en
 * ninguna página. Se comunica en WhatsApp al confirmar sucursal — es una
 * decisión de negocio, no un olvido.
 */
export const SUCURSALES: Sucursal[] = [
  { slug: 'polanco', nombre: 'Polanco', direccion: '' },
  { slug: 'del-valle', nombre: 'Del Valle', direccion: '' },
  { slug: 'coapa', nombre: 'Coapa', direccion: '' },
  { slug: 'oriente', nombre: 'Oriente', direccion: '' },
  { slug: 'metepec', nombre: 'Metepec', direccion: '' },
]

export function getSucursal(slug: string | undefined): Sucursal | undefined {
  return SUCURSALES.find((sucursal) => sucursal.slug === slug)
}

export function nombreSucursal(slug: string): string {
  return getSucursal(slug)?.nombre ?? slug
}

export function mapsEmbedUrl(sucursal: Sucursal): string | undefined {
  const query = sucursal.mapsQuery || sucursal.direccion
  if (!query) return undefined
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}
