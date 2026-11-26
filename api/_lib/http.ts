import { leerSesion, type Usuario } from './sesion.js'

export function json(datos: unknown, status = 200, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(datos), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  })
}

export function error(mensaje: string, status: number): Response {
  return json({ error: mensaje }, status)
}

/**
 * Exige sesión. En escrituras exige además JSON: un formulario de otro sitio
 * no puede mandar application/json sin preflight, así que esto (con la cookie
 * SameSite=Strict) bloquea el CSRF.
 */
export function exigirSesion(request: Request): Usuario | Response {
  if (request.method !== 'GET' && !request.headers.get('content-type')?.includes('application/json')) {
    return error('Solicitud no válida.', 415)
  }
  return leerSesion(request) ?? error('Tu sesión terminó. Vuelve a entrar.', 401)
}

export async function leerJson<T>(request: Request, maxBytes = 2_000_000): Promise<T | null> {
  const texto = await request.text()
  if (texto.length > maxBytes) return null
  try {
    return JSON.parse(texto) as T
  } catch {
    return null
  }
}
