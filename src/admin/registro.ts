/*
 * Qué se puede editar desde el portal y cómo se le explica al cliente.
 *
 * Cada sección apunta a una clave de src/content/editable.ts. Los valores de
 * partida salen de los mismos módulos que usa el sitio (que ya traen aplicado
 * lo último publicado), así que el portal siempre arranca de lo que se ve en
 * línea.
 *
 * Para hacer editable algo nuevo: envolverlo en editableLista/editableObjeto
 * en src/data/ y agregarlo acá. El slug nunca se edita: lo usan las fotos,
 * Meta y GA4 para identificar cada elemento.
 */
import {
  CERA,
  CIRE_SCULPT_ANTICELULITICO,
  CIRE_SCULPT_POST_OPERATORIO,
  COMBOS,
  CRACK_MUJER,
  FULL_BODY,
  HIFU_PROTOCOLOS,
  MOLDEO_CORPORAL,
  MSI,
  NIVELES_BIKINI,
  OTROS_SERVICIOS,
  PAQUETES_HOME,
  ZONAS,
} from '../data/precios'

export type TipoCampo = 'texto' | 'parrafo' | 'precio' | 'numero' | 'si-no' | 'lista' | 'lista-numeros' | 'fecha'

export interface Campo {
  clave: string
  etiqueta: string
  tipo: TipoCampo
  ayuda?: string
}

interface Base {
  clave: string
  titulo: string
  descripcion: string
  /** Páginas donde se ve, para el enlace "Ver en el sitio". */
  paginas: { ruta: string; nombre: string }[]
  campos: Campo[]
}

export interface SeccionLista extends Base {
  tipo: 'lista'
  base: { slug: string; nombre?: string }[]
}

export interface SeccionObjeto extends Base {
  tipo: 'objeto'
  base: object
}

export type Seccion = SeccionLista | SeccionObjeto

const nombre: Campo = { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto' }
const precioPaquete: Campo = {
  clave: 'precioPaquete',
  etiqueta: 'Precio del paquete',
  tipo: 'precio',
  ayuda: 'Precio regular del paquete completo. Los precios de temporada van en Promoción.',
}
const precioSesion: Campo = { clave: 'precioSesion', etiqueta: 'Precio por sesión suelta', tipo: 'precio' }
const sesiones: Campo = { clave: 'sesiones', etiqueta: 'Sesiones del paquete', tipo: 'numero' }

const camposPaqueteConSesiones: Campo[] = [
  nombre,
  { clave: 'resumen', etiqueta: 'Descripción corta', tipo: 'parrafo' },
  { clave: 'precioDesde', etiqueta: 'Precio', tipo: 'precio', ayuda: 'Si es un rango, este es el precio "desde".' },
  { clave: 'precioHasta', etiqueta: 'Precio "hasta" (opcional)', tipo: 'precio' },
  { clave: 'duracion', etiqueta: 'Duración', tipo: 'texto', ayuda: 'Ejemplo: "3 sesiones".' },
  { clave: 'incluye', etiqueta: 'Qué incluye', tipo: 'lista', ayuda: 'Un punto por renglón.' },
  { clave: 'destacado', etiqueta: 'Destacar como el más elegido', tipo: 'si-no' },
]

export const SECCIONES_PRECIOS: Seccion[] = [
  {
    tipo: 'lista',
    clave: 'zonas',
    titulo: 'Láser · Zonas individuales',
    descripcion: 'Precio de cada zona de depilación láser.',
    paginas: [
      { ruta: '/laser/zonas', nombre: 'Zonas' },
      { ruta: '/', nombre: 'Inicio' },
    ],
    campos: [nombre, precioPaquete, precioSesion, sesiones],
    base: ZONAS,
  },
  {
    tipo: 'lista',
    clave: 'bikini',
    titulo: 'Láser · Niveles de bikini',
    descripcion: 'Los cuatro niveles, de menor a mayor cobertura.',
    paginas: [{ ruta: '/laser/bikini', nombre: 'Bikini' }],
    campos: [nombre, { clave: 'cobertura', etiqueta: 'Qué cubre', tipo: 'parrafo' }, precioPaquete, precioSesion, sesiones],
    base: NIVELES_BIKINI,
  },
  {
    tipo: 'objeto',
    clave: 'fullBody',
    titulo: 'Láser · Full Body',
    descripcion: 'El paquete principal de cuerpo completo.',
    paginas: [
      { ruta: '/laser/cuerpo-completo', nombre: 'Cuerpo completo' },
      { ruta: '/', nombre: 'Inicio' },
    ],
    campos: [
      precioPaquete,
      precioSesion,
      sesiones,
      { clave: 'incluye', etiqueta: 'Zonas que incluye', tipo: 'lista', ayuda: 'Una zona por renglón.' },
      { clave: 'noIncluye', etiqueta: 'Zonas que NO incluye', tipo: 'lista', ayuda: 'Una zona por renglón.' },
    ],
    base: FULL_BODY,
  },
  {
    tipo: 'lista',
    clave: 'combos',
    titulo: 'Láser · Combos (tarifario)',
    descripcion: 'Tabla de combos de la página de cuerpo completo.',
    paginas: [{ ruta: '/laser/cuerpo-completo', nombre: 'Cuerpo completo' }],
    campos: [nombre, precioPaquete, precioSesion, sesiones, { clave: 'incluye', etiqueta: 'Zonas que incluye', tipo: 'lista' }],
    base: COMBOS,
  },
  {
    tipo: 'lista',
    clave: 'paquetesHome',
    titulo: 'Láser · Paquetes del inicio',
    descripcion: 'Los combos de la sección "O mejor, un paquete" del inicio. El ahorro se calcula solo.',
    paginas: [{ ruta: '/', nombre: 'Inicio' }],
    campos: [
      nombre,
      {
        clave: 'precioRegular',
        etiqueta: 'Precio regular',
        tipo: 'precio',
        ayuda: 'Se muestra tachado cuando hay promoción. Déjalo pendiente si no hay un precio regular confirmado.',
      },
      sesiones,
    ],
    base: PAQUETES_HOME,
  },
  {
    tipo: 'objeto',
    clave: 'crackMujer',
    titulo: 'Láser · Crack Mujer',
    descripcion: 'Paquete puntual que aparece en la página de láser.',
    paginas: [{ ruta: '/laser', nombre: 'Láser' }],
    campos: [nombre, precioPaquete, sesiones],
    base: CRACK_MUJER,
  },
  {
    tipo: 'lista',
    clave: 'cera',
    titulo: 'Cera italiana',
    descripcion: 'Precio por zona de la depilación con cera.',
    paginas: [{ ruta: '/cera', nombre: 'Cera' }],
    campos: [nombre, { clave: 'precio', etiqueta: 'Precio', tipo: 'precio' }],
    base: CERA,
  },
  {
    tipo: 'lista',
    clave: 'hifu',
    titulo: 'HIFU y faciales',
    descripcion: 'Protocolos de HIFU, Skin Renew, Skin Repair y Skin Reset.',
    paginas: [{ ruta: '/hifu', nombre: 'HIFU' }],
    campos: camposPaqueteConSesiones,
    base: HIFU_PROTOCOLOS,
  },
  {
    tipo: 'lista',
    clave: 'otrosServicios',
    titulo: 'Otros servicios · Resumen',
    descripcion: 'Las tarjetas de la página de otros servicios.',
    paginas: [{ ruta: '/otros-servicios', nombre: 'Otros servicios' }],
    campos: [nombre, { clave: 'resumen', etiqueta: 'Descripción corta', tipo: 'parrafo' }, { clave: 'precioDesde', etiqueta: 'Precio desde', tipo: 'precio' }],
    base: OTROS_SERVICIOS,
  },
  {
    tipo: 'lista',
    clave: 'moldeoCorporal',
    titulo: 'Otros servicios · Moldeo corporal',
    descripcion: 'Paquetes de moldeo corporal.',
    paginas: [{ ruta: '/otros-servicios/moldeo-corporal', nombre: 'Moldeo corporal' }],
    campos: camposPaqueteConSesiones,
    base: MOLDEO_CORPORAL,
  },
  {
    tipo: 'lista',
    clave: 'cireSculpt',
    titulo: 'Otros servicios · Cire Sculpt anticelulítico',
    descripcion: 'Paquetes de Cire Sculpt anticelulítico.',
    paginas: [{ ruta: '/otros-servicios/cire-sculpt-anticelulitico', nombre: 'Cire Sculpt' }],
    campos: camposPaqueteConSesiones,
    base: CIRE_SCULPT_ANTICELULITICO,
  },
  {
    tipo: 'lista',
    clave: 'postOperatorio',
    titulo: 'Otros servicios · Post operatorio',
    descripcion: 'Paquetes de Cire Sculpt post operatorio.',
    paginas: [{ ruta: '/otros-servicios/post-operatorio', nombre: 'Post operatorio' }],
    campos: camposPaqueteConSesiones,
    base: CIRE_SCULPT_POST_OPERATORIO,
  },
  {
    tipo: 'objeto',
    clave: 'msi',
    titulo: 'Meses sin intereses',
    descripcion: 'Lo que se dice de MSI en las páginas de láser.',
    paginas: [{ ruta: '/laser', nombre: 'Láser' }],
    campos: [
      { clave: 'disponible', etiqueta: 'Mostrar meses sin intereses', tipo: 'si-no' },
      { clave: 'meses', etiqueta: 'Plazos', tipo: 'lista-numeros', ayuda: 'Un número por renglón, por ejemplo 3 y 6.' },
      { clave: 'minimo', etiqueta: 'Compra mínima', tipo: 'precio', ayuda: 'Déjalo pendiente si no hay un mínimo.' },
      { clave: 'nota', etiqueta: 'Nota', tipo: 'texto', ayuda: 'Solo se muestra si no hay plazos capturados.' },
    ],
    base: MSI,
  },
]

/** Valor actual de una sección: lo publicado (ya en `base`) con el borrador encima. */
export function valorLista(seccion: SeccionLista, borrador: Record<string, unknown>) {
  const cambios = borrador[seccion.clave]
  if (!Array.isArray(cambios)) return seccion.base as Record<string, unknown>[]
  const porSlug = new Map(seccion.base.map((i) => [i.slug, i]))
  const vistos = new Set<string>()
  const res: Record<string, unknown>[] = []
  for (const c of cambios as Record<string, unknown>[]) {
    const slug = c.slug as string
    vistos.add(slug)
    res.push({ ...(porSlug.get(slug) ?? {}), ...c })
  }
  for (const i of seccion.base) if (!vistos.has(i.slug)) res.push(i as Record<string, unknown>)
  return res
}

export function valorObjeto(seccion: SeccionObjeto, borrador: Record<string, unknown>) {
  const cambios = borrador[seccion.clave]
  return { ...(seccion.base as Record<string, unknown>), ...((cambios as object) ?? {}) }
}

/** Lo que se guarda en el borrador: solo slug + campos editables. */
export function recortar(item: Record<string, unknown>, campos: Campo[], conSlug: boolean) {
  const res: Record<string, unknown> = conSlug ? { slug: item.slug } : {}
  for (const c of campos) if (c.clave in item) res[c.clave] = item[c.clave]
  return res
}
