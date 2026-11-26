import { upload } from '@vercel/blob/client'

export interface Usuario {
  usuario: string
  nombre: string
}

export type Contenido = Record<string, unknown>

export interface EstadoContenido {
  id: string | null
  contenido: Contenido
  guardadoEn: string | null
  guardadoPor: string | null
  publicadoEn: string | null
  publicadoPor: string | null
  pendiente: boolean
}

export interface Version {
  id: string
  publicadoEn: string
  autor: string
}

export interface Medio {
  url: string
  nombre: string
  tamano: number
  subidoEn: string
}

export class ErrorApi extends Error {
  status: number
  constructor(mensaje: string, status: number) {
    super(mensaje)
    this.status = status
  }
}

async function llamar<T>(ruta: string, metodo = 'GET', cuerpo?: unknown): Promise<T> {
  let r: Response
  try {
    r = await fetch(`/api/cms/${ruta}`, {
      method: metodo,
      headers: cuerpo === undefined ? {} : { 'content-type': 'application/json' },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      credentials: 'same-origin',
    })
  } catch {
    throw new ErrorApi('No hay conexión. Revisa tu internet y vuelve a intentar.', 0)
  }
  const datos = await r.json().catch(() => ({}))
  if (!r.ok) throw new ErrorApi(datos.error ?? 'Algo salió mal. Vuelve a intentar.', r.status)
  return datos as T
}

export const api = {
  sesion: () => llamar<{ usuario: Usuario }>('sesion'),
  login: (usuario: string, contrasena: string) => llamar<{ usuario: Usuario }>('login', 'POST', { usuario, contrasena }),
  logout: () => llamar('logout', 'POST', {}),
  contenido: () => llamar<EstadoContenido>('contenido'),
  guardar: (contenido: Contenido, base: string | null) =>
    llamar<{ id: string; guardadoEn: string }>('contenido', 'PUT', { contenido, base }),
  publicar: (base: string | null) =>
    llamar<{ publicadoEn: string; deploy: 'ok' | 'sin-hook' | 'error' }>('publicar', 'POST', { base }),
  versiones: () => llamar<{ versiones: Version[] }>('versiones'),
  restaurar: (id: string) => llamar<{ id: string; guardadoEn: string; contenido: Contenido }>('versiones', 'POST', { id }),
  medios: () => llamar<{ medios: Medio[] }>('medios'),
  borrarMedio: (url: string) => llamar('medios', 'DELETE', { url }),
  subir: (archivo: File, alAvanzar: (pct: number) => void) => {
    const limpio = archivo.name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
    return upload(`medios/${limpio}`, archivo, {
      access: 'public',
      handleUploadUrl: '/api/cms/subir',
      multipart: archivo.size > 20 * 1024 * 1024,
      onUploadProgress: (e) => alAvanzar(e.percentage),
    })
  },
}

export function fechaLegible(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Mexico_City',
  })
}
