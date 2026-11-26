/*
 * Biblioteca de multimedia: lista y borra lo subido desde el portal.
 * La subida va por /api/cms/subir (directo del navegador a Blob, sin el
 * límite de 4.5 MB de las funciones).
 */
import { del } from '@vercel/blob'
import { listar } from '../_lib/almacen.js'
import { error, exigirSesion, json, leerJson } from '../_lib/http.js'

export async function GET(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion
  const blobs = await listar('medios/')
  return json({
    medios: blobs
      .map((b) => ({ url: b.url, nombre: b.pathname.slice('medios/'.length), tamano: b.size, subidoEn: b.uploadedAt }))
      .reverse(),
  })
}

export async function DELETE(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion
  const datos = await leerJson<{ url?: unknown }>(request, 10_000)
  if (typeof datos?.url !== 'string' || !new URL(datos.url).pathname.startsWith('/medios/')) {
    return error('Archivo no válido.', 400)
  }
  await del(datos.url)
  return json({ ok: true })
}
