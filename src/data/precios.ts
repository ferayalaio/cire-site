/*
 * ============================================================================
 * CAPA DE PRECIOS — el único archivo que se toca para actualizar tarifas.
 * ============================================================================
 *
 * Los precios cambian ~mensualmente y hay promos estacionales (Buen Fin, Hot
 * Sale, Aniversario Cire, Hot Summer). Por eso NINGÚN precio vive dentro del
 * JSX de una página: todos salen de acá. Actualizar tarifas es editar este
 * archivo y nada más — el diseño de las páginas no se toca.
 *
 * CÓMO ACTUALIZAR
 * ---------------
 * 1. Los precios son números en MXN, sin símbolo y sin comas: `4500`, no
 *    `"$4,500"`. El formateo lo hace `formatPrecio` y así queda igual en todo
 *    el sitio.
 * 2. `null` significa "pendiente de cargar" y la página lo muestra como tal en
 *    lugar de inventar un número. NO pongas `0` para eso: `0` es un precio.
 * 3. Para una promo estacional, editá `PROMO_ACTIVA` abajo. Poner `null`
 *    apaga el banner en todo el sitio.
 *
 * LO QUE NO VA EN EL SITIO (decisión de negocio, no técnica)
 * ----------------------------------------------------------
 * - El 5% de descuento en efectivo de los combos: es exclusivo de WhatsApp.
 *   No se muestra acá ni en ninguna página.
 * - La regla de sesiones cada 8 semanas de Del Valle: se comunica en WhatsApp
 *   al confirmar sucursal.
 * - No hay calculadora de "quitar una zona del combo": el precio del combo es
 *   fijo. Excluir zonas no genera descuento.
 */

/** Precio en MXN. `null` = todavía sin cargar del tarifario. */
export type Precio = number | null

export function formatPrecio(precio: Precio): string | undefined {
  if (precio === null) return undefined
  return precio.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  })
}

export function hayPrecio(...precios: Precio[]): boolean {
  return precios.some((precio) => precio !== null)
}

/* -------------------------------------------------------------------------- */
/* Meses sin intereses                                                        */
/* -------------------------------------------------------------------------- */

/*
 * Los MSI sí se muestran en el sitio. `minimo` es el monto desde el que
 * aplican; si es `null` la página solo dice que hay MSI disponibles sin
 * prometer un mínimo que después no se cumple en caja.
 */
export const MSI = {
  disponible: true,
  meses: [3, 6] as number[],
  minimo: null as Precio,
  nota: 'Meses sin intereses con tarjetas participantes.',
}

/* -------------------------------------------------------------------------- */
/* Promo estacional                                                           */
/* -------------------------------------------------------------------------- */

export interface Promo {
  /** Nombre visible: "Buen Fin", "Hot Sale", "Aniversario Cire", "Hot Summer". */
  nombre: string
  /** Una línea, sin signos de exclamación ni urgencia agresiva. */
  detalle: string
  /** Fecha de fin en ISO (`2026-11-20`), solo para referencia del equipo. */
  hasta?: string
}

/*
 * `null` = no hay promo corriendo y no se renderiza ningún banner.
 * Para lanzar una, reemplazá el null por el objeto. Es lo único que hay que
 * tocar en todo el repo.
 */
export const PROMO_ACTIVA: Promo | null = null

/* -------------------------------------------------------------------------- */
/* Zonas individuales — /laser/zonas                                          */
/* -------------------------------------------------------------------------- */

export interface Zona {
  slug: string
  nombre: string
  precioSesion: Precio
  precioPaquete: Precio
  /** Sesiones que incluye `precioPaquete`. El protocolo estándar son 8. */
  sesiones: number | null
  /**
   * `true` cuando la zona no tiene un combo que la cubra exacto. Esas filas
   * muestran el callout "Ahorra más con Full Body" — es el upsell principal de
   * la página.
   */
  sinComboExacto?: boolean
}

/*
 * ATENCIÓN: esta lista está incompleta. Son las zonas nombradas en el brief;
 * el tarifario oficial tiene más ("etc." en el brief). Antes de publicar hay
 * que completarla y verificar cada nombre contra el tarifario.
 */
export const ZONAS: Zona[] = [
  { slug: 'rostro', nombre: 'Rostro', precioSesion: null, precioPaquete: null, sesiones: null },
  { slug: 'axilas', nombre: 'Axilas', precioSesion: null, precioPaquete: null, sesiones: null },
  {
    slug: 'brazos',
    nombre: 'Brazos',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
    sinComboExacto: true,
  },
  {
    slug: 'abdomen',
    nombre: 'Abdomen',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
    sinComboExacto: true,
  },
  {
    slug: 'espalda',
    nombre: 'Espalda',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
    sinComboExacto: true,
  },
  {
    slug: 'gluteos',
    nombre: 'Glúteos',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
    sinComboExacto: true,
  },
  { slug: 'piernas', nombre: 'Piernas', precioSesion: null, precioPaquete: null, sesiones: null },
]

/* -------------------------------------------------------------------------- */
/* Niveles de bikini — /laser/bikini                                          */
/* -------------------------------------------------------------------------- */

export interface NivelBikini {
  slug: string
  nombre: string
  /**
   * Ruta del icono propio de Cire en `public/`. Los cuatro iconos ya existen
   * como archivos de marca; mientras no estén subidos la página cae a un
   * marcador y NO dibuja un icono genérico.
   */
  icono?: string
  cobertura: string
  precioSesion: Precio
  precioPaquete: Precio
  sesiones: number | null
}

/*
 * El orden es de menor a mayor cobertura y no debería cambiarse: la página se
 * lee como una escalera de decisión.
 *
 * Los nombres son los del brief (Básico, Sexy, French, Brazilian). Los `slug`
 * viajan a Meta como `content_ids`, así que conviene no renombrarlos una vez
 * publicados: se corta el histórico del anterior.
 */
export const NIVELES_BIKINI: NivelBikini[] = [
  {
    slug: 'bikini-basico',
    nombre: 'Bikini Básico',
    cobertura: '',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
  },
  {
    slug: 'bikini-sexy',
    nombre: 'Bikini Sexy',
    cobertura: '',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
  },
  {
    slug: 'bikini-french',
    nombre: 'Bikini French',
    cobertura: '',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
  },
  {
    slug: 'bikini-brazilian',
    nombre: 'Bikini Brazilian',
    cobertura: '',
    precioSesion: null,
    precioPaquete: null,
    sesiones: null,
  },
]

/* -------------------------------------------------------------------------- */
/* Combos — tabla comparativa en /laser/cuerpo-completo                       */
/* -------------------------------------------------------------------------- */

export interface Combo {
  slug: string
  nombre: string
  /** Zonas que cubre. Vacío = pendiente del tarifario. */
  incluye: string[]
  precioSesion: Precio
  precioPaquete: Precio
  sesiones: number | null
}

/*
 * PENDIENTE DE ACLARAR: el brief nombra seis combos (Rostro, Sexy, Playa,
 * Piernas, Bikini, Axilas) pero dice "los 7 combos de láser" al hablar del 5%
 * en efectivo. Falta el séptimo — hay que confirmarlo contra el tarifario.
 */
export const COMBOS: Combo[] = [
  { slug: 'combo-rostro', nombre: 'Combo Rostro', incluye: [], precioSesion: null, precioPaquete: null, sesiones: null },
  { slug: 'combo-sexy', nombre: 'Combo Sexy', incluye: [], precioSesion: null, precioPaquete: null, sesiones: null },
  { slug: 'combo-playa', nombre: 'Combo Playa', incluye: [], precioSesion: null, precioPaquete: null, sesiones: null },
  { slug: 'combo-piernas', nombre: 'Combo Piernas', incluye: [], precioSesion: null, precioPaquete: null, sesiones: null },
  { slug: 'combo-bikini', nombre: 'Combo Bikini', incluye: [], precioSesion: null, precioPaquete: null, sesiones: null },
  { slug: 'combo-axilas', nombre: 'Combo Axilas', incluye: [], precioSesion: null, precioPaquete: null, sesiones: null },
]

/* -------------------------------------------------------------------------- */
/* Full Body — la venta principal                                            */
/* -------------------------------------------------------------------------- */

export const FULL_BODY = {
  slug: 'full-body',
  nombre: 'Full Body',
  precioSesion: null as Precio,
  precioPaquete: null as Precio,
  sesiones: null as number | null,

  /** Zonas incluidas. Pendiente del tarifario. */
  incluye: [] as string[],

  /*
   * Las tres zonas que el Full Body NO cubre. Esto viene del brief y se
   * publica a propósito: es una de las preguntas frecuentes, y decirlo antes
   * evita la discusión incómoda en la sucursal.
   */
  noIncluye: ['Manos', 'Pies', 'Nuca'],
}

/* -------------------------------------------------------------------------- */
/* Cera italiana — /cera                                                      */
/* -------------------------------------------------------------------------- */

export interface ZonaCera {
  slug: string
  nombre: string
  precio: Precio
}

/* Pendiente: el tarifario de cera completo. */
export const CERA: ZonaCera[] = []

/* -------------------------------------------------------------------------- */
/* HIFU — /hifu                                                               */
/* -------------------------------------------------------------------------- */

export interface ZonaHifu {
  slug: string
  nombre: string
  /** Disparos incluidos, que es cómo se cotiza el HIFU. */
  disparos: number | null
  precio: Precio
}

/* Pendiente: zonas tratables, disparos y precio. */
export const HIFU: ZonaHifu[] = []

/* -------------------------------------------------------------------------- */
/* Otros servicios — /otros-servicios                                         */
/* -------------------------------------------------------------------------- */

export interface OtroServicio {
  slug: string
  nombre: string
  resumen: string
  precioDesde: Precio
}

export const OTROS_SERVICIOS: OtroServicio[] = [
  {
    slug: 'post-operatorio',
    nombre: 'Post-operatorio',
    resumen: 'Drenaje y acompañamiento en la recuperación después de una cirugía.',
    precioDesde: null,
  },
  {
    slug: 'cire-sculpt',
    nombre: 'Cire Sculpt',
    resumen: 'Protocolo de moldeado y reducción de medidas.',
    precioDesde: null,
  },
  {
    slug: 'aparatologia',
    nombre: 'Aparatología',
    resumen: 'Equipos de cabina para tratamientos corporales y faciales.',
    precioDesde: null,
  },
]
