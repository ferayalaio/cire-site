/*
 * Contenido editable desde el portal (/admin).
 *
 * Los archivos de src/data/ siguen siendo la fuente de los valores de base:
 * cada lista o bloque editable se envuelve en `editableLista` o
 * `editableObjeto` con una clave. Al compilar, scripts/contenido.mjs baja de
 * Vercel Blob la última versión que el cliente publicó y la escribe en
 * `publicado.json`; acá se aplica encima de la base.
 *
 * Reglas de la fusión (para que publicar nunca rompa una página):
 * - Listas: se fusionan por `slug`. Lo publicado gana campo por campo, pero
 *   los campos que el portal no edita (fotos, opciones, banderas de diseño)
 *   siguen saliendo del código. Un elemento que existe en el código y no en
 *   lo publicado se conserva al final; el orden es el de lo publicado.
 * - Objetos: se fusionan campo por campo; los arreglos internos se reemplazan
 *   enteros.
 * - Sin nada publicado (o sin token en local), el sitio queda idéntico al
 *   código.
 */
import publicado from './publicado.json'

type Registro = Record<string, unknown>

const contenido = publicado as Registro

function esRegistro(valor: unknown): valor is Registro {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

export function fusionarLista<T extends { slug: string }>(base: T[], cambios: unknown): T[] {
  if (!Array.isArray(cambios)) return base
  const porSlug = new Map(base.map((item) => [item.slug, item]))
  const vistos = new Set<string>()
  const resultado: T[] = []
  for (const cambio of cambios) {
    if (!esRegistro(cambio) || typeof cambio.slug !== 'string' || vistos.has(cambio.slug)) continue
    vistos.add(cambio.slug)
    const original = porSlug.get(cambio.slug)
    resultado.push({ ...(original ?? {}), ...cambio } as T)
  }
  for (const item of base) if (!vistos.has(item.slug)) resultado.push(item)
  return resultado
}

export function fusionarObjeto<T extends object>(base: T, cambios: unknown): T {
  if (!esRegistro(cambios)) return base
  return { ...base, ...cambios } as T
}

export function editableLista<T extends { slug: string }>(clave: string, base: T[]): T[] {
  return fusionarLista(base, contenido[clave])
}

export function editableObjeto<T extends object>(clave: string, base: T): T {
  return fusionarObjeto(base, contenido[clave])
}

/** Fecha de la versión publicada que está en este build (o null). */
export const PUBLICADO_EN: string | null =
  typeof contenido._publicadoEn === 'string' ? contenido._publicadoEn : null
