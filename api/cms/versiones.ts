/*
 * GET: historial de versiones publicadas.
 * POST {id}: copia esa versión como borrador nuevo, para revisarla y volver a
 * publicarla. Restaurar no publica solo: el sitio no cambia hasta Publicar.
 */
import { guardarBorrador, leerPublicado, ultimoBorrador, versiones } from '../_lib/almacen.js'
import { error, exigirSesion, json, leerJson } from '../_lib/http.js'

export async function GET(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion
  return json({ versiones: await versiones() })
}

export async function POST(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion

  const datos = await leerJson<{ id?: unknown }>(request, 10_000)
  if (typeof datos?.id !== 'string') return error('Falta la versión.', 400)
  const version = await leerPublicado(datos.id)
  if (!version) return error('No se encontró esa versión.', 404)

  const actual = await ultimoBorrador()
  const res = await guardarBorrador(version.contenido, sesion.usuario, actual?.id ?? null)
  return json({ ...res, contenido: version.contenido })
}
