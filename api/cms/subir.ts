/*
 * Token para subir fotos y videos directo del navegador a Vercel Blob
 * (`upload()` de @vercel/blob/client). Solo con sesión iniciada.
 */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { error, exigirSesion, json, leerJson } from '../_lib/http.js'

const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime']

export async function POST(request: Request) {
  const sesion = exigirSesion(request)
  if (sesion instanceof Response) return sesion

  const body = await leerJson<HandleUploadBody>(request, 100_000)
  if (!body) return error('Solicitud no válida.', 400)

  try {
    const res = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('medios/')) throw new Error('Ruta no permitida.')
        return {
          allowedContentTypes: TIPOS,
          maximumSizeInBytes: 200 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
    })
    return json(res)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'No se pudo subir el archivo.', 400)
  }
}
