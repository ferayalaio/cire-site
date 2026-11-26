/*
 * Baja el contenido que el cliente publicó desde el portal (/admin) y lo deja
 * en src/content/publicado.json, que src/content/editable.ts aplica encima de
 * los datos del código.
 *
 * Corre antes de `dev` y de `build`. Las versiones publicadas viven en Vercel
 * Blob como `cms/publicados/<fecha>.json`; se toma la más reciente.
 *
 * Sin BLOB_READ_WRITE_TOKEN (alguien clonó el repo sin `vercel env pull`)
 * escribe `{}` y el sitio sale tal cual está en el código. Si hay token pero
 * Blob falla, el build se detiene: es preferible no publicar a publicar el
 * sitio con precios viejos sin que nadie se entere.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { list } from '@vercel/blob'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const destino = join(root, 'src/content/publicado.json')

// `vite` no carga .env.local en los scripts de Node: lo leemos a mano.
async function cargarEnvLocal() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return
  try {
    const texto = await readFile(join(root, '.env.local'), 'utf8')
    for (const linea of texto.split('\n')) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch {
    /* sin .env.local */
  }
}

async function escribir(datos) {
  await writeFile(destino, JSON.stringify(datos, null, 2) + '\n')
}

await cargarEnvLocal()

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.log('[contenido] Sin BLOB_READ_WRITE_TOKEN: se usa el contenido del código.')
  await escribir({})
} else {
  const blobs = []
  let cursor
  // CMS_PREFIJO=cms-local en .env.local para probar el portal sin tocar lo real.
  const prefijo = process.env.CMS_PREFIJO || 'cms'
  do {
    const pagina = await list({ prefix: `${prefijo}/publicados/`, cursor, limit: 1000 })
    blobs.push(...pagina.blobs)
    cursor = pagina.hasMore ? pagina.cursor : undefined
  } while (cursor)

  if (blobs.length === 0) {
    console.log('[contenido] Todavía no hay nada publicado desde el portal.')
    await escribir({})
  } else {
    blobs.sort((a, b) => a.pathname.localeCompare(b.pathname))
    const ultimo = blobs[blobs.length - 1]
    const respuesta = await fetch(ultimo.url, { cache: 'no-store' })
    if (!respuesta.ok) throw new Error(`[contenido] No se pudo bajar ${ultimo.pathname}: ${respuesta.status}`)
    const documento = await respuesta.json()
    await escribir({ ...documento.contenido, _publicadoEn: documento.publicadoEn })
    console.log(`[contenido] Publicado del ${documento.publicadoEn} por ${documento.autor}.`)
  }
}
