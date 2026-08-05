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
  // Símbolo de pesos simple ($10,500) — a propósito sin sufijo "MXN": es lo
  // que se pidió mostrar, sin agregar caracteres de más.
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
 * Precios de mujer, paquete de 8 sesiones, cargados del tarifario. Todavía
 * falta el precio por sesión suelta de cada zona (no viene en el tarifario
 * que se cargó) y falta el tarifario de hombre — cuando llegue, ver si
 * necesita su propio arreglo o un campo de género acá.
 *
 * `sinComboExacto` se mantiene solo donde ya estaba antes de desglosar
 * "Brazos"/"Espalda"/"Rostro" en sus variantes completa/media: es continuidad
 * de una decisión de diseño previa, no una confirmación nueva de qué cubre
 * cada combo (los combos siguen sin `incluye` definido).
 */
export const ZONAS: Zona[] = [
  { slug: 'gluteos', nombre: 'Glúteos', precioSesion: null, precioPaquete: 2500, sesiones: 8, sinComboExacto: true },
  { slug: 'medias-piernas', nombre: 'Medias Piernas', precioSesion: null, precioPaquete: 3500, sesiones: 8 },
  { slug: 'piernas-completas', nombre: 'Piernas Completas', precioSesion: null, precioPaquete: 5000, sesiones: 8 },
  { slug: 'pies', nombre: 'Pies', precioSesion: null, precioPaquete: 1800, sesiones: 8 },
  {
    slug: 'brazos-completos',
    nombre: 'Brazos Completos',
    precioSesion: null,
    precioPaquete: 4000,
    sesiones: 8,
    sinComboExacto: true,
  },
  {
    slug: 'medios-brazos',
    nombre: 'Medios Brazos',
    precioSesion: null,
    precioPaquete: 2800,
    sesiones: 8,
    sinComboExacto: true,
  },
  { slug: 'axilas', nombre: 'Axilas', precioSesion: null, precioPaquete: 1800, sesiones: 8 },
  { slug: 'manos', nombre: 'Manos', precioSesion: null, precioPaquete: 1500, sesiones: 8 },
  {
    slug: 'espalda-completa',
    nombre: 'Espalda Completa',
    precioSesion: null,
    precioPaquete: 4800,
    sesiones: 8,
    sinComboExacto: true,
  },
  {
    slug: 'media-espalda',
    nombre: 'Media Espalda',
    precioSesion: null,
    precioPaquete: 2500,
    sesiones: 8,
    sinComboExacto: true,
  },
  { slug: 'hombros', nombre: 'Hombros', precioSesion: null, precioPaquete: 2000, sesiones: 8 },
  {
    slug: 'abdomen',
    nombre: 'Abdomen',
    precioSesion: null,
    precioPaquete: 2250,
    sesiones: 8,
    sinComboExacto: true,
  },
  { slug: 'pecho', nombre: 'Pecho', precioSesion: null, precioPaquete: 2250, sesiones: 8 },
  { slug: 'pezones', nombre: 'Pezones', precioSesion: null, precioPaquete: 1500, sesiones: 8 },
  { slug: 'rostro-completo', nombre: 'Rostro Completo', precioSesion: null, precioPaquete: 2750, sesiones: 8 },
  { slug: 'medio-rostro', nombre: 'Medio Rostro', precioSesion: null, precioPaquete: 2250, sesiones: 8 },
  { slug: 'bigote', nombre: 'Bigote', precioSesion: null, precioPaquete: 1250, sesiones: 8 },
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
    cobertura:
      'Depilación de los bordes externos del bikini, siguiendo la línea de la ropa interior o traje de baño clásico.',
    precioSesion: null,
    precioPaquete: 2250,
    sesiones: 8,
  },
  {
    slug: 'bikini-sexy',
    nombre: 'Bikini Sexy',
    cobertura:
      'Incluye los bordes externos y una mayor extensión hacia el centro, dejando una franja central más reducida que el básico.',
    precioSesion: null,
    precioPaquete: 2500,
    sesiones: 8,
  },
  {
    slug: 'bikini-french',
    nombre: 'Bikini French',
    cobertura:
      'Cobertura amplia que deja solo una línea delgada o triángulo pequeño al centro; ideal para quienes buscan un resultado más despejado.',
    precioSesion: null,
    precioPaquete: 3500,
    sesiones: 8,
  },
  {
    slug: 'bikini-brazilian',
    nombre: 'Bikini Brazilian',
    cobertura:
      'Depilación completa de toda la zona, incluyendo la parte frontal y trasera, sin dejar vello visible.',
    precioSesion: null,
    precioPaquete: 4000,
    sesiones: 8,
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
 * Precios de mujer, paquete de 8 sesiones, cargados del tarifario. "Combo
 * Sexy Sexy", "Combo Sexy Brazilian" y "Combo Playa Brazilian" son tres
 * combos distintos del tarifario, no variantes de un mismo "Combo Sexy" o
 * "Combo Playa" — los nombres van tal cual vinieron cargados.
 *
 * `incluye` sigue vacío para todos: qué zonas trae cada combo no vino en este
 * tarifario.
 */
export const COMBOS: Combo[] = [
  { slug: 'combo-axilas', nombre: 'Combo Axilas', incluye: [], precioSesion: null, precioPaquete: 5000, sesiones: 8 },
  { slug: 'combo-bikini', nombre: 'Combo Bikini', incluye: [], precioSesion: null, precioPaquete: 5000, sesiones: 8 },
  { slug: 'combo-abdomen', nombre: 'Combo Abdomen', incluye: [], precioSesion: null, precioPaquete: 4500, sesiones: 8 },
  { slug: 'combo-gluteos', nombre: 'Combo Glúteos', incluye: [], precioSesion: null, precioPaquete: 5500, sesiones: 8 },
  { slug: 'combo-piernas', nombre: 'Combo Piernas', incluye: [], precioSesion: null, precioPaquete: 6500, sesiones: 8 },
  { slug: 'combo-brazos', nombre: 'Combo Brazos', incluye: [], precioSesion: null, precioPaquete: 5500, sesiones: 8 },
  {
    slug: 'combo-sexy-sexy',
    nombre: 'Combo Sexy Sexy',
    incluye: [],
    precioSesion: null,
    precioPaquete: 7750,
    sesiones: 8,
  },
  { slug: 'combo-rostro', nombre: 'Combo Rostro', incluye: [], precioSesion: null, precioPaquete: 8500, sesiones: 8 },
  {
    slug: 'combo-sexy-brazilian',
    nombre: 'Combo Sexy Brazilian',
    incluye: [],
    precioSesion: null,
    precioPaquete: 7750,
    sesiones: 8,
  },
  {
    slug: 'combo-playa-brazilian',
    nombre: 'Combo Playa Brazilian',
    incluye: [],
    precioSesion: null,
    precioPaquete: 6750,
    sesiones: 8,
  },
]

/* -------------------------------------------------------------------------- */
/* Full Body — la venta principal                                            */
/* -------------------------------------------------------------------------- */

export const FULL_BODY = {
  slug: 'full-body',
  nombre: 'Full Body',
  precioSesion: null as Precio,
  precioPaquete: 10500 as Precio,
  sesiones: 8 as number | null,

  /** Zonas incluidas, confirmado por el equipo. */
  incluye: ['Piernas Completas', 'Brazos Completos', 'Axilas', 'Espalda Completa', 'Zona Íntima'] as string[],

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

export const CERA: ZonaCera[] = [
  { slug: 'bikini-basico', nombre: 'Bikini Básico', precio: 390 },
  { slug: 'sexy-bikini', nombre: 'Sexy Bikini', precio: 460 },
  { slug: 'coxis', nombre: 'Coxis', precio: 130 },
  { slug: 'gluteos-con-crack', nombre: 'Glúteos con Crack', precio: 320 },
  { slug: 'medias-piernas-arriba', nombre: 'Medias Piernas Arriba', precio: 410 },
  { slug: 'medias-piernas-abajo', nombre: 'Medias Piernas Abajo', precio: 430 },
  { slug: 'piernas-completas', nombre: 'Piernas Completas', precio: 690 },
  { slug: 'abdomen', nombre: 'Abdomen', precio: 240 },
  { slug: 'brazos-completos', nombre: 'Brazos Completos', precio: 410 },
  { slug: 'axilas', nombre: 'Axilas', precio: 150 },
  { slug: 'espalda-completa', nombre: 'Espalda Completa', precio: 550 },
  { slug: 'hombros', nombre: 'Hombros', precio: 200 },
]

/* -------------------------------------------------------------------------- */
/* HIFU — /hifu                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Forma compartida para cualquier catálogo de "paquete con precio por número
 * de sesiones" — la usa HIFU acá abajo y también los catálogos de Otros
 * Servicios (Moldeo Corporal, Cire Sculpt Anticelulítico, Cire Sculpt Post
 * Operativo), cada uno en su propia ruta con el mismo diseño de tarjetas.
 */
export interface PaqueteConSesiones {
  slug: string
  nombre: string
  resumen: string
  /** Precio de entrada. Si `precioHasta` está presente, se muestra como rango. */
  precioDesde: Precio
  precioHasta?: Precio
  duracion: string
  incluye: string[]
  /** El paquete recomendado, el único que lleva la insignia "Más popular". */
  destacado?: boolean
}

/*
 * Reemplaza el catálogo anterior por "3 meses"/"6 meses" (decisión confirmada
 * con el equipo): ahora son paquetes por número de sesiones. Todavía falta el
 * catálogo por experiencia (Express, Contour, Supreme) y no se agrega acá
 * hasta que se defina cómo se relaciona con estos paquetes.
 *
 * Skin Renew, Skin Repair y Skin Reset son tres líneas distintas del
 * tarifario (Repair y Reset NO son el mismo tratamiento con nombre corregido
 * — comparten precio por nivel, pero son productos separados), todas nuevas
 * y distintas de Cire Lift, que también viven en /hifu. El `resumen` de cada
 * una queda pendiente de copy real (qué es y para qué piel es ideal) — no se
 * inventó descripción clínica sin confirmarla. "Cire Lift 2 Sesiones" es el
 * único marcado `destacado` — es "el más popular", confirmado.
 */
export const HIFU_PROTOCOLOS: PaqueteConSesiones[] = [
  {
    slug: 'cire-lift-1-sesion',
    nombre: 'Cire Lift 1 Sesión',
    resumen: 'Una sesión de HIFU 4D para conocer el efecto tensor antes de comprometerte con más.',
    precioDesde: 3250,
    duracion: '1 sesión',
    incluye: ['1 sesión de HIFU 4D'],
  },
  {
    slug: 'cire-lift-2-sesiones',
    nombre: 'Cire Lift 2 Sesiones',
    resumen: 'Dos sesiones de HIFU 4D para reforzar el efecto tensor y sostenerlo más tiempo.',
    precioDesde: 5500,
    duracion: '2 sesiones',
    incluye: ['2 sesiones de HIFU 4D'],
    destacado: true,
  },
  {
    slug: 'skin-renew-1',
    nombre: 'Skin Renew (1 sesión)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 649,
    duracion: '1 sesión',
    incluye: ['1 sesión de Skin Renew'],
  },
  {
    slug: 'skin-renew-3',
    nombre: 'Skin Renew (3 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 1799,
    duracion: '3 sesiones',
    incluye: ['3 sesiones de Skin Renew'],
  },
  {
    slug: 'skin-renew-5',
    nombre: 'Skin Renew (5 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 2945,
    duracion: '5 sesiones',
    incluye: ['5 sesiones de Skin Renew'],
  },
  {
    slug: 'skin-renew-10',
    nombre: 'Skin Renew (10 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 5000,
    duracion: '10 sesiones',
    incluye: ['10 sesiones de Skin Renew'],
  },
  {
    slug: 'skin-repair-3',
    nombre: 'Skin Repair (3 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 2547,
    duracion: '3 sesiones',
    incluye: ['3 sesiones de Skin Repair'],
  },
  {
    slug: 'skin-repair-5',
    nombre: 'Skin Repair (5 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 3745,
    duracion: '5 sesiones',
    incluye: ['5 sesiones de Skin Repair'],
  },
  {
    slug: 'skin-repair-10',
    nombre: 'Skin Repair (10 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 6490,
    duracion: '10 sesiones',
    incluye: ['10 sesiones de Skin Repair'],
  },
  {
    slug: 'skin-reset-3',
    nombre: 'Skin Reset (3 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 2547,
    duracion: '3 sesiones',
    incluye: ['3 sesiones de Skin Reset'],
  },
  {
    slug: 'skin-reset-5',
    nombre: 'Skin Reset (5 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 3745,
    duracion: '5 sesiones',
    incluye: ['5 sesiones de Skin Reset'],
  },
  {
    slug: 'skin-reset-10',
    nombre: 'Skin Reset (10 sesiones)',
    resumen: 'Pendiente: descripción del tratamiento y para qué piel es ideal.',
    precioDesde: 6490,
    duracion: '10 sesiones',
    incluye: ['10 sesiones de Skin Reset'],
  },
]

/* -------------------------------------------------------------------------- */
/* Otros servicios — /otros-servicios                                         */
/* -------------------------------------------------------------------------- */

export interface OtroServicio {
  slug: string
  nombre: string
  resumen: string
  /** Precio de entrada — el mínimo del catálogo de `ruta` cuando la hay. */
  precioDesde: Precio
  /**
   * Ruta propia con el catálogo completo (mismo patrón que /laser/zonas,
   * /laser/bikini, etc.): la tarjeta del hub se vuelve un `LinkCard` a esta
   * ruta en vez de mostrar precio inline. `undefined` cuando el servicio no
   * tiene catálogo propio todavía — esa tarjeta se queda mostrando solo
   * `precioDesde`, sin link.
   */
  ruta?: string
}

/*
 * Restructurado a pedido: cada categoría vive en su propia ruta bajo
 * /otros-servicios, con el mismo diseño de tarjetas que /hifu (ver
 * PaqueteConSesiones arriba). El hub (OtrosServicios.tsx) solo enlaza a cada
 * una — no repite los precios inline.
 *
 * "Post-operatorio" y "Cire Sculpt" pasan a llamarse "Cire Sculpt Post
 * Operativo" y "Cire Sculpt Anticelulítico" — mismo slug, solo cambia el
 * nombre visible, para no cortar el histórico de tracking que ya viene por
 * `sku`. "Moldeo Corporal" es una categoría nueva.
 *
 * "Anticelulítico" es la expansión que le di a "anticeutico" del tarifario
 * (se lee como typo de "anticelulítico" — confirmar el rótulo exacto antes de
 * publicar si no es eso).
 */
export const OTROS_SERVICIOS: OtroServicio[] = [
  {
    slug: 'moldeo-corporal',
    nombre: 'Moldeo Corporal',
    resumen: 'Protocolo de moldeado y reducción de medidas.',
    precioDesde: 749,
    ruta: '/otros-servicios/moldeo-corporal',
  },
  {
    slug: 'cire-sculpt',
    nombre: 'Cire Sculpt Anticelulítico',
    resumen: 'Protocolo de moldeado y reducción de medidas.',
    precioDesde: 749,
    ruta: '/otros-servicios/cire-sculpt-anticelulitico',
  },
  {
    slug: 'post-operatorio',
    nombre: 'Cire Sculpt Post Operativo',
    resumen: 'Drenaje y acompañamiento en la recuperación después de una cirugía.',
    precioDesde: 899,
    ruta: '/otros-servicios/post-operatorio',
  },
]

/*
 * Catálogo de /otros-servicios/moldeo-corporal. Dos tratamientos distintos
 * (Moldeo Cire-Na y Cire Body) explotados por número de sesiones, igual que
 * HIFU_PROTOCOLOS. `resumen` queda pendiente de copy real por el mismo motivo
 * que en HIFU: no se inventa descripción clínica sin confirmarla.
 */
export const MOLDEO_CORPORAL: PaqueteConSesiones[] = [
  {
    slug: 'moldeo-cire-na-1',
    nombre: 'Moldeo Cire-Na (1 sesión)',
    resumen:
      'Primer acercamiento al moldeo corporal Cire-Na, ideal para conocer el tratamiento y sus resultados iniciales.',
    precioDesde: 749,
    duracion: '1 sesión',
    incluye: ['1 sesión de Moldeo Cire-Na'],
  },
  {
    slug: 'moldeo-cire-na-6',
    nombre: 'Moldeo Cire-Na (6 sesiones)',
    resumen:
      'Paquete intermedio que permite ver resultados progresivos en el contorno y firmeza de la zona tratada.',
    precioDesde: 3500,
    duracion: '6 sesiones',
    incluye: ['6 sesiones de Moldeo Cire-Na'],
  },
  {
    slug: 'moldeo-cire-na-12',
    nombre: 'Moldeo Cire-Na (12 sesiones)',
    resumen:
      'Tratamiento completo recomendado para lograr resultados óptimos y duraderos en el moldeado corporal.',
    precioDesde: 6290,
    duracion: '12 sesiones',
    incluye: ['12 sesiones de Moldeo Cire-Na'],
  },
  {
    slug: 'cire-body-1',
    nombre: 'Cire Body (1 sesión)',
    resumen:
      'Sesión introductoria de remodelación corporal para notar los primeros cambios en textura y firmeza.',
    precioDesde: 749,
    duracion: '1 sesión',
    incluye: ['1 sesión de Cire Body'],
  },
  {
    slug: 'cire-body-6',
    nombre: 'Cire Body (6 sesiones)',
    resumen: 'Ciclo intermedio pensado para mejorar de forma visible las medidas y la piel de la zona.',
    precioDesde: 3500,
    duracion: '6 sesiones',
    incluye: ['6 sesiones de Cire Body'],
  },
]

/* Catálogo de /otros-servicios/cire-sculpt-anticelulitico. */
export const CIRE_SCULPT_ANTICELULITICO: PaqueteConSesiones[] = [
  {
    slug: 'cire-sculpt-anti-1',
    nombre: 'Cire Sculpt Anti (1 sesión)',
    resumen: 'Primera sesión anticelulítica para comenzar a suavizar la piel de naranja.',
    precioDesde: 749,
    duracion: '1 sesión',
    incluye: ['1 sesión de Cire Sculpt Anti'],
  },
  {
    slug: 'cire-sculpt-anti-6',
    nombre: 'Cire Sculpt Anti (6 sesiones)',
    resumen: 'Paquete progresivo que ayuda a reducir celulitis y esculpir la zona tratada.',
    precioDesde: 3500,
    duracion: '6 sesiones',
    incluye: ['6 sesiones de Cire Sculpt Anti'],
  },
  {
    slug: 'cire-sculpt-anti-12',
    nombre: 'Cire Sculpt Anti (12 sesiones)',
    resumen:
      'Tratamiento completo para un efecto anticelulítico y reafirmante más notorio y duradero.',
    precioDesde: 6290,
    duracion: '12 sesiones',
    incluye: ['12 sesiones de Cire Sculpt Anti'],
  },
]

/* Catálogo de /otros-servicios/post-operatorio. */
export const CIRE_SCULPT_POST_OPERATORIO: PaqueteConSesiones[] = [
  {
    slug: 'post-op-1',
    nombre: 'Post Op (1 sesión)',
    resumen: 'Sesión de drenaje post-quirúrgico para reducir inflamación inicial tras la cirugía.',
    precioDesde: 899,
    duracion: '1 sesión',
    incluye: ['1 sesión de Post Op'],
  },
  {
    slug: 'post-op-6',
    nombre: 'Post Op (6 sesiones)',
    resumen:
      'Ciclo de recuperación que ayuda a controlar fibrosis e inflamación de forma progresiva.',
    precioDesde: 4000,
    duracion: '6 sesiones',
    incluye: ['6 sesiones de Post Op'],
  },
  {
    slug: 'post-op-12',
    nombre: 'Post Op (12 sesiones)',
    resumen:
      'Programa completo de recuperación post-operatoria para una mejor cicatrización y resultados finales.',
    precioDesde: 7490,
    duracion: '12 sesiones',
    incluye: ['12 sesiones de Post Op'],
  },
]
