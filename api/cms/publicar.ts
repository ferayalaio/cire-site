/*
 * Publica el último borrador: lo copia a cms/publicados/ (queda en el
 * historial) y dispara el build. El sitio se actualiza en 1 a 2 minutos.
 */
import { dispararDeploy, publicar, ultimoBorrador } from '../_lib/almacen.js'
import { error, exigirSesion, json, leerJson } from '../_lib/http.js'

export async function POST(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion

  const datos = await leerJson<{ base?: unknown }>(request, 10_000)
  const borrador = await ultimoBorrador()
  if (!borrador) return error('No hay cambios guardados para publicar.', 400)
  // Se publica lo que la persona ve en pantalla, no un borrador que otro guardó después.
  if (datos?.base !== borrador.id) return error('Hay cambios más recientes guardados por otra persona. Recarga la página.', 409)

  const res = await publicar(borrador.doc.contenido, sesion.usuario)
  const deploy = await dispararDeploy()
  return json({ ...res, deploy })
}
