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

  /** Teléfono del listado oficial. Vacío = todavía no se agenda por llamada, solo WhatsApp. */
  telefono?: string

  /** Testimonios parafraseados (no citas literales) para esta sucursal. */
  testimonios?: Testimonio[]
}

export interface Testimonio {
  texto: string
  autor: string
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
    direccion: 'Gutenberg 194, Anzures, Miguel Hidalgo, 11590 CDMX',
    mapsUrl: 'https://maps.google.com/?cid=3247528200057585679',
    foto: '/sucursales/polanco.png',
    testimonios: [
      {
        texto:
          'El personal es súper amable y el lugar se mantiene impecable, se nota el cuidado en cada detalle.',
        autor: 'Renata G.',
      },
      {
        texto:
          'Desde las primeras sesiones ya se notaba la diferencia, y en cada cita me explican exactamente cómo va mi tratamiento.',
        autor: 'Valeria H.',
      },
    ],
  },
  {
    slug: 'del-valle',
    nombre: 'Del Valle',
    direccion:
      'Cda. Dr. José Ignacio Bartolache 1038, Interior 1, Col. Del Valle Centro, Benito Juárez, 03100 CDMX',
    mapsUrl: 'https://maps.google.com/?cid=18410687439098431653',
    telefono: '+52 55 2800 8869',
    foto: '/sucursales/del-valle.png',
    testimonios: [
      {
        texto:
          'Desde la segunda sesión ya notaba menos vello y más parejo el crecimiento — no tuve que esperar meses para ver resultado.',
        autor: 'Fernanda R.',
      },
      {
        texto:
          'Lo que más se agradece es el trato: el lugar impecable y el personal siempre atento a explicarte cada paso.',
        autor: 'Andrea M.',
      },
    ],
  },
  {
    slug: 'coapa',
    nombre: 'Coapa',
    direccion:
      'Calz. del Hueso 453, Local 19, primer piso, Col. Los Girasoles, Coapa, Coyoacán, 04920 CDMX',
    mapsUrl: 'https://maps.google.com/?cid=10278530957479471836',
    telefono: '+52 56 3039 9230',
    foto: '/sucursales/coapa.png',
    testimonios: [
      {
        texto: 'Me sorprendió lo rápido que empezó a notarse el cambio, casi desde las primeras citas.',
        autor: 'Karla S.',
      },
      {
        texto:
          'Cada sesión se siente pensada para mi piel y mi zona, no una rutina genérica — se nota la atención personalizada.',
        autor: 'Daniela P.',
      },
    ],
  },
  {
    slug: 'oriente',
    nombre: 'Oriente',
    direccion: 'Río Tacámbaro 56-Interior 2, Paseos de Churubusco, Iztapalapa, 09030 CDMX',
    foto: '/sucursales/oriente.png',
  },
  {
    slug: 'metepec',
    nombre: 'Metepec',
    direccion: '',
    mapsUrl: 'https://maps.app.goo.gl/AfyJ6FsWemM6MFa36',
    mapsQuery: '19.2679641,-99.5746308',
    foto: '/sucursales/metepec.png',
  },
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
