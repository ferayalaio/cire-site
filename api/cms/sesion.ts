import { error, json } from '../_lib/http.js'
import { leerSesion } from '../_lib/sesion.js'

export function GET(request: Request) {
  const usuario = leerSesion(request)
  return usuario ? json({ usuario }) : error('Sin sesión.', 401)
}
