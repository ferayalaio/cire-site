/*
 * GET: el borrador actual (o, si nunca se guardó uno, lo último publicado).
 * PUT: guarda un borrador nuevo. No toca el sitio público hasta Publicar.
 */
import { Conflicto, guardarBorrador, ultimoBorrador, ultimoPublicado, type Contenido } from '../_lib/almacen.js'
import { error, exigirSesion, json, leerJson } from '../_lib/http.js'

export async function GET(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion

  const [borrador, publicado] = await Promise.all([ultimoBorrador(), ultimoPublicado()])
  return json({
    id: borrador?.id ?? null,
    contenido: borrador?.doc.contenido ?? publicado?.doc.contenido ?? {},
    guardadoEn: borrador?.doc.guardadoEn ?? null,
    guardadoPor: borrador?.doc.autor ?? null,
    publicadoEn: publicado?.doc.publicadoEn ?? null,
    publicadoPor: publicado?.doc.autor ?? null,
    // true si hay cambios guardados que todavía no se publican.
    pendiente: Boolean(borrador && (!publicado || borrador.doc.guardadoEn > publicado.doc.publicadoEn)),
  })
}

export function esContenidoValido(valor: unknown): valor is Contenido {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) return false
  return Object.keys(valor).every((clave) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(clave))
}

export async function PUT(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion

  const datos = await leerJson<{ contenido?: unknown; base?: unknown }>(request)
  if (!datos || !esContenidoValido(datos.contenido)) return error('El contenido no tiene un formato válido.', 400)
  const base = typeof datos.base === 'string' ? datos.base : null

  try {
    const res = await guardarBorrador(datos.contenido, sesion.usuario, base)
    return json(res)
  } catch (e) {
    if (e instanceof Conflicto) return error(e.message, 409)
    throw e
  }
}
