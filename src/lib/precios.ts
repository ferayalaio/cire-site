/*
 * Selectores de precio (nov/26). Las vistas del home NO leen precios.ts ni
 * promos.ts directo: leen de acá, para que el precio vigente, el regular
 * tachado y el ahorro salgan siempre de la misma cuenta.
 *
 * Regla del ahorro (decidida con el equipo, 2026-11-25):
 * - Se compara el precio del paquete contra lo que costarían sus mismas zonas
 *   compradas por separado HOY (precio de temporada si hay promo vigente,
 *   regular si no).
 * - "Bikini a elegir" se cuenta como bikini básico: es el ahorro mínimo
 *   garantizado, el que vale para cualquier elección.
 * - Si el ahorro es 0 o negativo, no se muestra y queda un aviso en consola.
 */
import { FULL_BODY, NIVELES_BIKINI, PAQUETES_HOME, ZONAS, formatPrecio } from '../data/precios'
import type { Precio, ZonaIncluida } from '../data/precios'
import { PROMO_TEMPORADA, precioPromoPaquete, precioPromoZona, promoVigente } from '../data/promos'

/** Nivel de bikini con el que se cuenta "bikini a elegir" en el ahorro. */
const BIKINI_REFERENCIA = 'bikini-basico'

const avisados = new Set<string>()
function avisar(clave: string, mensaje: string) {
  if (avisados.has(clave)) return
  avisados.add(clave)
  console.warn(`[precios] ${mensaje}`)
}

export interface PrecioZona {
  /** Lo que se cobra hoy. */
  vigente: Precio
  /** Precio regular, solo si hoy hay uno de temporada más bajo (para tacharlo). */
  tachado: Precio
}

function precioRegularZona(slug: string): Precio {
  return (
    ZONAS.find((z) => z.slug === slug)?.precioPaquete ??
    NIVELES_BIKINI.find((n) => n.slug === slug)?.precioPaquete ??
    null
  )
}

export function precioZona(slug: string): PrecioZona {
  const regular = precioRegularZona(slug)
  const promo = precioPromoZona(slug)
  if (promo !== null && (regular === null || promo < regular)) return { vigente: promo, tachado: regular }
  return { vigente: regular, tachado: null }
}

/** Nombre visible de una zona incluida en un paquete (para los chips). */
export function nombreZonaIncluida(zona: ZonaIncluida): string {
  if (zona === 'bikini') return 'Bikini'
  const nombre = ZONAS.find((z) => z.slug === zona)?.nombre ?? zona
  // "Piernas Completas" → "Piernas completas": los chips van en tipo oración.
  return nombre.charAt(0) + nombre.slice(1).toLowerCase()
}

/** Suma de las zonas compradas por separado hoy, o null si falta algún precio. */
function sumaPorSeparado(incluye: ZonaIncluida[]): number | null {
  let total = 0
  for (const zona of incluye) {
    const precio = precioZona(zona === 'bikini' ? BIKINI_REFERENCIA : zona).vigente
    if (precio === null) return null
    total += precio
  }
  return total
}

/**
 * Ahorro del paquete contra sus zonas por separado. null = no se muestra
 * (falta un precio o el ahorro es 0 o negativo).
 */
function ahorroPaquete(nombre: string, precio: number, incluye: ZonaIncluida[]): number | null {
  const separado = sumaPorSeparado(incluye)
  if (separado === null) return null
  const ahorro = separado - precio
  if (ahorro <= 0) {
    // TODO(precios): revisar con el equipo este paquete: hoy cuesta lo mismo o
    // más que comprar sus zonas por separado, así que no se anuncia ahorro.
    avisar(
      nombre,
      `${nombre} cuesta ${formatPrecio(precio)} y sus zonas por separado (bikini básico) suman ${formatPrecio(separado)}: ahorro ${formatPrecio(ahorro)}. No se muestra.`,
    )
    return null
  }
  return ahorro
}

export interface PaqueteVista {
  slug: string
  nombre: string
  incluye: ZonaIncluida[]
  sesiones: number
  precio: number
  /** Precio regular tachado, solo si es mayor al vigente. */
  tachado: number | null
  ahorro: number | null
  msi: number | null
  /** true si el precio es de la promo de temporada (lleva cupón). */
  enPromo: boolean
}

/**
 * Paquetes del home con precio vigente. Sin promo, solo los que tienen precio
 * regular Y contenido confirmado (`regularConfirmado`); los demás desaparecen
 * en vez de anunciar un combo que quizá no existe así en el tarifario.
 */
export function paquetesHome(): PaqueteVista[] {
  return PAQUETES_HOME.flatMap((p): PaqueteVista[] => {
    const promo = precioPromoPaquete(p.slug)
    const precio = promo?.precio ?? (p.regularConfirmado ? p.precioRegular : null)
    if (precio === null) return []
    return [
      {
        slug: p.slug,
        nombre: p.nombre,
        incluye: p.incluye,
        sesiones: p.sesiones,
        precio,
        tachado: p.precioRegular !== null && p.precioRegular > precio ? p.precioRegular : null,
        ahorro: ahorroPaquete(p.nombre, precio, p.incluye),
        msi: promo?.msi ?? null,
        enPromo: promo !== null,
      },
    ]
  })
}

export function fullBodyVista(): Omit<PaqueteVista, 'precio'> & { precio: Precio } {
  const promo = precioPromoPaquete('full-body')
  const regular = FULL_BODY.precioPaquete
  const precio = promo?.precio ?? regular
  return {
    slug: FULL_BODY.slug,
    nombre: FULL_BODY.nombre,
    incluye: FULL_BODY.incluyeZonas,
    sesiones: FULL_BODY.sesiones ?? 8,
    precio,
    tachado: promo && regular !== null && regular > promo.precio ? regular : null,
    ahorro: precio === null ? null : ahorroPaquete(FULL_BODY.nombre, precio, FULL_BODY.incluyeZonas),
    msi: promo?.msi ?? null,
    enPromo: promo !== null,
  }
}

/** Datos del cupón de temporada, o null si no hay promo vigente. */
export function cuponVigente(): { nombre: string; hasta: string } | null {
  if (!promoVigente()) return null
  return { nombre: PROMO_TEMPORADA.nombre, hasta: PROMO_TEMPORADA.hastaTexto }
}

/*
 * Chequeo de coherencia: una zona parcial no puede costar lo mismo o más que
 * la completa. Hoy pasa con medias piernas en Buen Fin.
 * TODO(precios): falta el precio de temporada de Medias piernas.
 */
const PARCIAL_COMPLETA: [string, string][] = [
  ['medias-piernas', 'piernas-completas'],
  ['medios-brazos', 'brazos-completos'],
  ['media-espalda', 'espalda-completa'],
  ['medio-rostro', 'rostro-completo'],
]
export function revisarCoherenciaZonas() {
  for (const [parcial, completa] of PARCIAL_COMPLETA) {
    const a = precioZona(parcial).vigente
    const b = precioZona(completa).vigente
    if (a !== null && b !== null && a >= b) {
      avisar(`coherencia-${parcial}`, `${parcial} (${formatPrecio(a)}) cuesta lo mismo o más que ${completa} (${formatPrecio(b)}). ¿Falta su precio de temporada?`)
    }
  }
}
