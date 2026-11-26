/*
 * Autenticación del portal: usuario y contraseña, sin servicios externos.
 *
 * - Usuarios en la variable CMS_USUARIOS (JSON): [{"usuario":"cire","hash":"scrypt:…","nombre":"Cire"}].
 *   El hash lo genera `node scripts/crear-usuario.mjs <usuario>`: la
 *   contraseña nunca se guarda en claro.
 * - La sesión es una cookie HttpOnly firmada con HMAC (CMS_SECRETO), válida
 *   12 horas. SameSite=Strict más el requisito de JSON en las escrituras
 *   cierran el CSRF.
 */
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'

const COOKIE = 'cire_portal'
const DURACION_S = 12 * 60 * 60

export interface Usuario {
  usuario: string
  nombre: string
}

interface UsuarioGuardado extends Usuario {
  hash: string
}

function secreto(): string {
  const s = process.env.CMS_SECRETO
  if (!s || s.length < 32) throw new Error('Falta CMS_SECRETO (mínimo 32 caracteres).')
  return s
}

function usuarios(): UsuarioGuardado[] {
  try {
    const lista = JSON.parse(process.env.CMS_USUARIOS ?? '[]')
    return Array.isArray(lista) ? lista : []
  } catch {
    return []
  }
}

/**
 * Formato: scrypt:<salt base64>:<hash base64>. Sin `$`: los cargadores de
 * .env lo expanden como variable y el hash llega roto.
 */
function verificarHash(contrasena: string, guardado: string): boolean {
  const [alg, sal, hash] = guardado.split(':')
  if (alg !== 'scrypt' || !sal || !hash) return false
  const esperado = Buffer.from(hash, 'base64')
  const calculado = scryptSync(contrasena, Buffer.from(sal, 'base64'), esperado.length)
  return timingSafeEqual(esperado, calculado)
}

// Hash de relleno para que un usuario inexistente tarde lo mismo que uno real.
const HASH_FALSO = 'scrypt:AAAAAAAAAAAAAAAAAAAAAA==:' +Buffer.alloc(64).toString('base64')

/* Freno de fuerza bruta por instancia: 8 intentos fallidos cada 15 minutos. */
const fallos = new Map<string, { n: number; desde: number }>()
const VENTANA_MS = 15 * 60 * 1000

export function bloqueado(clave: string): boolean {
  const f = fallos.get(clave)
  if (!f) return false
  if (Date.now() - f.desde > VENTANA_MS) {
    fallos.delete(clave)
    return false
  }
  return f.n >= 8
}

function registrarFallo(clave: string) {
  const f = fallos.get(clave)
  if (!f || Date.now() - f.desde > VENTANA_MS) fallos.set(clave, { n: 1, desde: Date.now() })
  else f.n++
}

export function verificarCredenciales(usuario: string, contrasena: string, claveFreno: string): Usuario | null {
  const encontrado = usuarios().find((u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase())
  const ok = verificarHash(contrasena, encontrado?.hash ?? HASH_FALSO) && Boolean(encontrado)
  if (!ok || !encontrado) {
    registrarFallo(claveFreno)
    return null
  }
  fallos.delete(claveFreno)
  return { usuario: encontrado.usuario, nombre: encontrado.nombre || encontrado.usuario }
}

function firmar(datos: string): string {
  return createHmac('sha256', secreto()).update(datos).digest('base64url')
}

function atributos(request: Request, maxAge: number): string {
  const local = new URL(request.url).hostname === 'localhost'
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${local ? '' : '; Secure'}`
}

export function cookieDeSesion(request: Request, usuario: Usuario): string {
  const carga = Buffer.from(
    JSON.stringify({ ...usuario, exp: Math.floor(Date.now() / 1000) + DURACION_S }),
  ).toString('base64url')
  return `${COOKIE}=${carga}.${firmar(carga)}; ${atributos(request, DURACION_S)}`
}

export function cookieDeSalida(request: Request): string {
  return `${COOKIE}=; ${atributos(request, 0)}`
}

export function leerSesion(request: Request): Usuario | null {
  const cookies = request.headers.get('cookie') ?? ''
  const valor = cookies
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  if (!valor) return null
  const [carga, firma] = valor.split('.')
  if (!carga || !firma) return null
  const esperada = Buffer.from(firmar(carga))
  const recibida = Buffer.from(firma)
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null
  try {
    const datos = JSON.parse(Buffer.from(carga, 'base64url').toString())
    if (typeof datos.exp !== 'number' || datos.exp < Date.now() / 1000) return null
    return { usuario: datos.usuario, nombre: datos.nombre }
  } catch {
    return null
  }
}
