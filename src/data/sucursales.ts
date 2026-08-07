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

export type Region = 'Ciudad de México' | 'Estado de México'

export interface Sucursal {
  slug: string
  nombre: string

  /**
   * Entidad real donde está la sucursal. La consume el bloque de SEO local del
   * home (ver SucursalesHome.tsx), donde el objetivo es que "CDMX" y "Estado
   * de México" aparezcan como texto indexable junto a cada zona.
   *
   * OJO: /ubicaciones agrupa distinto — ahí las cinco caen bajo "Ciudad de
   * México" por pedido explícito (ver ZONAS en Ubicaciones.tsx). Son dos
   * agrupaciones con propósitos distintos, no una duplicada mal: este campo es
   * el dato geográfico real, ese mapa es una decisión de presentación.
   */
  region: Region

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

  /** Teléfono del listado oficial. Vacío = todavía no se agenda por llamada, solo WhatsApp. */
  telefono?: string

  /** Testimonios parafraseados (no citas literales) para esta sucursal. */
  testimonios?: Testimonio[]
}

export interface Testimonio {
  texto: string
  autor: string
  /** Nombre de negocio + sucursal a mostrar bajo el autor, ej. "Cire Coapa". Opcional: en páginas que mezclan varias sucursales se omite. */
  sucursal?: string
  /** Foto de perfil real de la reseña de Google, recortada a public/avatars/. */
  avatarSrc?: string
}

/*
 * Sigla de cada entidad, para la insignia de las tarjetas de sucursal (ver
 * SucursalesHome.tsx). La tarjeta muestra la sigla porque es lo que se escanea
 * de un vistazo, y arrastra el nombre completo en un `sr-only` al lado: la
 * entidad escrita entera es justo lo que se está tratando de posicionar, así
 * que no puede desaparecer del HTML por una decisión de tamaño.
 */
export const REGION_SIGLA: Record<Region, string> = {
  'Ciudad de México': 'CDMX',
  'Estado de México': 'EDOMEX',
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
  {
    slug: 'polanco',
    nombre: 'Polanco',
    region: 'Ciudad de México',
    direccion: 'Gutenberg 194, Anzures, Miguel Hidalgo, 11590 CDMX',
    mapsUrl: 'https://maps.google.com/?cid=3247528200057585679',
    foto: '/sucursales/polanco.png',
  },
  {
    slug: 'del-valle',
    nombre: 'Del Valle',
    region: 'Ciudad de México',
    direccion:
      'Cda. Dr. José Ignacio Bartolache 1038, Interior 1, Col. Del Valle Centro, Benito Juárez, 03100 CDMX',
    mapsUrl: 'https://maps.google.com/?cid=18410687439098431653',
    telefono: '+52 55 2800 8869',
    foto: '/sucursales/del-valle.png',
  },
  {
    slug: 'coapa',
    nombre: 'Coapa',
    region: 'Ciudad de México',
    direccion:
      'Calz. del Hueso 453, Local 19, primer piso, Col. Los Girasoles, Coapa, Coyoacán, 04920 CDMX',
    mapsUrl: 'https://maps.google.com/?cid=10278530957479471836',
    telefono: '+52 56 3039 9230',
    foto: '/sucursales/coapa.png',
  },
  {
    slug: 'oriente',
    nombre: 'Oriente',
    region: 'Ciudad de México',
    direccion: 'Río Tacámbaro 56-Interior 2, Paseos de Churubusco, Iztapalapa, 09030 CDMX',
    foto: '/sucursales/oriente.png',
  },
  {
    slug: 'metepec',
    nombre: 'Metepec',
    region: 'Estado de México',
    direccion:
      'C. Adolfo López Mateos 1100-Loc 10-A, La Asunción, 52172 San Salvador Tizatlalli, Méx.',
    mapsUrl: 'https://maps.app.goo.gl/RJXpuQuSgiNSU6iR8',
    mapsQuery: '19.2679641,-99.5746308',
    foto: '/sucursales/metepec.png',
  },
]

/*
 * `agruparPorRegion` vivía acá y agrupaba las tarjetas del home bajo un
 * encabezado por entidad. Se fue con el rediseño a tarjetas con insignia (ver
 * SucursalesHome.tsx): la entidad ahora la lleva cada tarjeta, así que el
 * agrupamiento decía dos veces lo mismo y ya no lo llamaba nadie.
 */

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
