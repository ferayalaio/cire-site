import { error, json, leerJson } from '../_lib/http.js'
import { bloqueado, cookieDeSesion, verificarCredenciales } from '../_lib/sesion.js'

export async function POST(request: Request) {
  const datos = await leerJson<{ usuario?: unknown; contrasena?: unknown }>(request, 10_000)
  if (!datos || typeof datos.usuario !== 'string' || typeof datos.contrasena !== 'string') {
    return error('Escribe tu usuario y tu contraseña.', 400)
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  const freno = `${ip}|${datos.usuario.toLowerCase()}`
  if (bloqueado(freno)) return error('Demasiados intentos. Espera 15 minutos y vuelve a intentar.', 429)

  const usuario = verificarCredenciales(datos.usuario, datos.contrasena, freno)
  if (!usuario) return error('Usuario o contraseña incorrectos.', 401)
  return json({ usuario }, 200, { 'set-cookie': cookieDeSesion(request, usuario) })
}
