import { json } from '../_lib/http.js'
import { cookieDeSalida } from '../_lib/sesion.js'

export function POST(request: Request) {
  return json({ ok: true }, 200, { 'set-cookie': cookieDeSalida(request) })
}
