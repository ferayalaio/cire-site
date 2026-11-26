/*
 * Dónde vive el contenido del portal (Vercel Blob, store `cire-contenido`).
 *
 *   cms/borradores/<fecha>__<usuario>-<azar>.json   cada guardado (se conservan los últimos 40)
 *   cms/publicados/<fecha>__<usuario>.json          cada publicación = el historial completo
 *   medios/…                                        fotos y videos subidos desde el portal
 *
 * Cada escritura crea un archivo nuevo en lugar de sobrescribir uno fijo: así
 * no hay caché de CDN que devuelva una versión vieja, y el historial sale
 * gratis. La fecha va al principio del nombre para que el orden alfabético
 * sea el cronológico.
 */
import { del, list, put, type ListBlobResultBlob } from '@vercel/blob'

export type Contenido = Record<string, unknown>

export interface DocBorrador {
  contenido: Contenido
  guardadoEn: string
  autor: string
}

export interface DocPublicado {
  contenido: Contenido
  publicadoEn: string
  autor: string
}

// En local (.env.local) CMS_PREFIJO=cms-local: las pruebas no tocan el contenido real.
const PREFIJO = process.env.CMS_PREFIJO || 'cms'
const BORRADORES = `${PREFIJO}/borradores/`
const PUBLICADOS = `${PREFIJO}/publicados/`
const MAX_BORRADORES = 40

function sello(fecha: Date): string {
  return fecha.toISOString().replace(/[:.]/g, '-')
}

function limpiarUsuario(usuario: string): string {
  return usuario.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'usuario'
}

export async function listar(prefix: string): Promise<ListBlobResultBlob[]> {
  const blobs: ListBlobResultBlob[] = []
  let cursor: string | undefined
  do {
    const pagina = await list({ prefix, cursor, limit: 1000 })
    blobs.push(...pagina.blobs)
    cursor = pagina.hasMore ? pagina.cursor : undefined
  } while (cursor)
  return blobs.sort((a, b) => a.pathname.localeCompare(b.pathname))
}

async function leer<T>(blob: ListBlobResultBlob): Promise<T> {
  const r = await fetch(blob.url, { cache: 'no-store' })
  if (!r.ok) throw new Error(`No se pudo leer ${blob.pathname} (${r.status}).`)
  return (await r.json()) as T
}

export async function ultimoBorrador(): Promise<{ id: string; doc: DocBorrador } | null> {
  const blobs = await listar(BORRADORES)
  const ultimo = blobs.at(-1)
  return ultimo ? { id: ultimo.pathname, doc: await leer<DocBorrador>(ultimo) } : null
}

export async function ultimoPublicado(): Promise<{ id: string; doc: DocPublicado } | null> {
  const blobs = await listar(PUBLICADOS)
  const ultimo = blobs.at(-1)
  return ultimo ? { id: ultimo.pathname, doc: await leer<DocPublicado>(ultimo) } : null
}

export class Conflicto extends Error {}

/**
 * Guarda un borrador nuevo. `base` es el id del borrador sobre el que se
 * editó: si mientras tanto alguien más guardó, se rechaza para no pisarle
 * los cambios.
 */
export async function guardarBorrador(contenido: Contenido, autor: string, base: string | null) {
  const blobs = await listar(BORRADORES)
  const actual = blobs.at(-1)?.pathname ?? null
  if (actual !== base) throw new Conflicto('Hay cambios más recientes guardados por otra persona.')

  const ahora = new Date()
  const doc: DocBorrador = { contenido, guardadoEn: ahora.toISOString(), autor }
  const res = await put(`${BORRADORES}${sello(ahora)}__${limpiarUsuario(autor)}.json`, JSON.stringify(doc), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  })

  const sobrantes = [...blobs, { pathname: res.pathname, url: res.url }].slice(0, -MAX_BORRADORES)
  if (sobrantes.length) await del(sobrantes.map((b) => b.url)).catch(() => {})

  return { id: res.pathname, guardadoEn: doc.guardadoEn }
}

export async function publicar(contenido: Contenido, autor: string) {
  const ahora = new Date()
  const doc: DocPublicado = { contenido, publicadoEn: ahora.toISOString(), autor }
  const res = await put(`${PUBLICADOS}${sello(ahora)}__${limpiarUsuario(autor)}.json`, JSON.stringify(doc), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
  return { id: res.pathname, publicadoEn: doc.publicadoEn }
}

export interface Version {
  id: string
  publicadoEn: string
  autor: string
}

export async function versiones(): Promise<Version[]> {
  const blobs = await listar(PUBLICADOS)
  return blobs
    .map((b) => {
      const nombre = b.pathname.slice(PUBLICADOS.length).replace(/\.json$/, '')
      const [, autor = ''] = nombre.split('__')
      return { id: b.pathname, publicadoEn: b.uploadedAt.toISOString(), autor }
    })
    .reverse()
}

export async function leerPublicado(id: string): Promise<DocPublicado | null> {
  if (!id.startsWith(PUBLICADOS)) return null
  const blob = (await listar(PUBLICADOS)).find((b) => b.pathname === id)
  return blob ? leer<DocPublicado>(blob) : null
}

/** Dispara el build de producción (Deploy Hook de Vercel). */
export async function dispararDeploy(): Promise<'ok' | 'sin-hook' | 'error'> {
  const url = process.env.DEPLOY_HOOK_URL
  if (!url) return 'sin-hook'
  try {
    const r = await fetch(url, { method: 'POST' })
    return r.ok ? 'ok' : 'error'
  } catch {
    return 'error'
  }
}
