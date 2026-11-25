/*
 * Promoción de temporada (nov/26: Buen Fin, en todas las sucursales). Es el
 * ÚNICO archivo de configuración de promos: nombre, fecha de fin, MSI y
 * precios de temporada por slug. Lo que trae cada paquete y su precio regular
 * viven en data/precios.ts; el ahorro lo calcula lib/precios.ts.
 *
 * La promo se muestra como cupón (<CuponPromo>) y precios tachados. Al pasar
 * `hasta` (hora de CDMX) cupones, precios tachados y paquetes de temporada se
 * apagan solos. Los flyers de Instagram ya no se usan en el sitio: el precio
 * quemado en una imagen no lo lee Google ni un lector de pantalla y caduca.
 *
 * Para la próxima temporada: cambiar nombre, `hasta` y precios, nada más.
 */

export interface PaquetePromo {
  /** Slug de `PAQUETES_HOME` (o `full-body`) en data/precios.ts. */
  slug: string
  precio: number
  msi: number
}

export interface ZonaPromo {
  nombre: string
  detalle: string
  precio: number
  /** Slug de la zona o nivel en precios.ts al que aplica este precio. */
  zonaSlug: string
}

/** Lista de precios de temporada por zona (niveles de bikini, zonas sueltas). */
export interface ListaPromo {
  slug: string
  titulo: string
  msi: number
  nota?: string
  items: ZonaPromo[]
}

export const PROMO_TEMPORADA = {
  activa: true,
  nombre: 'Buen Fin',
  /** Último día de la promo ("liquida antes del 30 de noviembre"). */
  hasta: '2026-11-30',
  /** Texto corto del cupón: "Buen Fin · hasta el 30 de noviembre". */
  hastaTexto: 'hasta el 30 de noviembre',
  condicion: 'Gran preventa: liquida tu paquete antes del 30 de noviembre.',
  aviso: 'Esta promoción no se volverá a repetir: agenda tu valoración.',

  combos: [
    { slug: 'full-body', precio: 8500, msi: 6 },
    { slug: 'combo-sexy', precio: 7500, msi: 6 },
    { slug: 'combo-playa', precio: 6500, msi: 6 },
    { slug: 'combo-piernas', precio: 6500, msi: 6 },
    { slug: 'combo-axilas', precio: 4500, msi: 3 },
    { slug: 'combo-bikini', precio: 4500, msi: 3 },
  ] as PaquetePromo[],

  listas: [
    {
      slug: 'perfect-bikini',
      titulo: 'Elige tu perfect bikini',
      msi: 3,
      nota: '8 sesiones de láser diodo. Cupo limitado.',
      items: [
        { nombre: 'Bikini básico', detalle: '8 sesiones', precio: 1800, zonaSlug: 'bikini-basico' },
        { nombre: 'Sexy bikini', detalle: '8 sesiones', precio: 2000, zonaSlug: 'bikini-sexy' },
        { nombre: 'French bikini', detalle: '8 sesiones', precio: 2800, zonaSlug: 'bikini-french' },
        { nombre: 'Brazilian bikini', detalle: '8 sesiones', precio: 3200, zonaSlug: 'bikini-brazilian' },
      ],
    },
    {
      slug: 'zonas-individuales',
      titulo: 'Zonas individuales',
      msi: 3,
      // TODO(precios): falta el precio de temporada de Medias piernas (el flyer de
      // zonas individuales no llegó a disco). Mientras, medias piernas se muestra
      // a su precio regular ($2,400).
      items: [
        { nombre: 'Piernas completas', detalle: '8 sesiones de piernas completas', precio: 3500, zonaSlug: 'piernas-completas' },
        { nombre: 'Axilas completas', detalle: '8 sesiones de axilas completas', precio: 1200, zonaSlug: 'axilas' },
        {
          nombre: 'Rostro completo',
          detalle: '8 sesiones: frente, bigote, mejillas, patillas, mentón y entrecejo',
          precio: 2000,
          zonaSlug: 'rostro-completo',
        },
      ],
    },
  ] as ListaPromo[],
}

/** true mientras la promo esté activa y no haya pasado su último día (hora de CDMX). */
export function promoVigente(hoy: Date = new Date()): boolean {
  if (!PROMO_TEMPORADA.activa) return false
  const fin = new Date(`${PROMO_TEMPORADA.hasta}T23:59:59-06:00`)
  return hoy.getTime() <= fin.getTime()
}

/** Precio de temporada de un paquete (por slug), o null si no aplica. */
export function precioPromoPaquete(slug: string): PaquetePromo | null {
  if (!promoVigente()) return null
  return PROMO_TEMPORADA.combos.find((c) => c.slug === slug) ?? null
}

/** Precio de Full Body durante la promo, o null si no aplica. Lo usan el home y /laser/cuerpo-completo. */
export function precioPromoFullBody(): number | null {
  return precioPromoPaquete('full-body')?.precio ?? null
}

/** Precio de temporada de una zona o nivel de bikini (por slug de precios.ts), o null. */
export function precioPromoZona(slug: string): number | null {
  if (!promoVigente()) return null
  for (const lista of PROMO_TEMPORADA.listas) {
    const item = lista.items.find((i) => i.zonaSlug === slug)
    if (item) return item.precio
  }
  return null
}
