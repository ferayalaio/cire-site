/*
 * Canalización de imágenes (nov/26).
 *
 * Recorre public/images/**\/*.{jpg,jpeg,png} (las fotos originales, con el
 * nombre que pide SHOTLIST.md) y por cada una:
 *
 * 1. Genera AVIF, WebP y JPG en 480, 800 y 1200 px de ancho (sin agrandar: si
 *    la original es más chica, se queda en su ancho) en public/images/_opt/.
 * 2. Baja la calidad hasta que la versión más grande pese menos de 250 KB.
 * 3. Escribe src/data/imagenes-manifest.json con medidas y anchos generados.
 *
 * El componente <ImagenPendiente> lee ese manifiesto: si la ruta está, pinta
 * la foto; si no, la tarjeta "Imagen pendiente". Por eso reemplazar una foto
 * es subir el archivo con su nombre y volver a construir (Vercel lo hace solo
 * en cada push): no se toca código.
 *
 * Corre solo antes de `dev` y de `build` (predev / prebuild). Solo procesa lo
 * que cambió desde la última vez (compara fechas), así que es rápido.
 */
import { readdir, stat, mkdir, writeFile, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const origen = join(root, 'public/images')
const destino = join(origen, '_opt')
const manifiestoRuta = join(root, 'src/data/imagenes-manifest.json')

const ANCHOS = [480, 800, 1200]
const MAX_BYTES = 250 * 1024
const FORMATOS = [
  { ext: 'avif', opts: (q) => ({ quality: Math.round(q * 0.75), effort: 4 }) },
  { ext: 'webp', opts: (q) => ({ quality: q }) },
  { ext: 'jpg', opts: (q) => ({ quality: q, mozjpeg: true }) },
]

async function listar(dir) {
  let entradas = []
  try {
    entradas = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  const archivos = []
  for (const e of entradas) {
    const ruta = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === '_opt') continue
      archivos.push(...(await listar(ruta)))
    } else if (/\.(jpe?g|png)$/i.test(e.name)) {
      archivos.push(ruta)
    }
  }
  return archivos
}

async function existeMasNuevo(salida, fuenteMtime) {
  try {
    return (await stat(salida)).mtimeMs >= fuenteMtime
  } catch {
    return false
  }
}

async function procesar(archivo) {
  const rel = relative(origen, archivo).split('\\').join('/')
  // La clave del manifiesto siempre termina en .jpg: es el nombre del SHOTLIST.
  const clave = rel.replace(/\.(jpe?g|png)$/i, '.jpg')
  const base = clave.replace(/\.jpg$/, '')
  const meta = await sharp(archivo).rotate().metadata()
  const ancho = meta.autoOrient?.width ?? meta.width
  const alto = meta.autoOrient?.height ?? meta.height
  const anchos = [...new Set(ANCHOS.map((w) => Math.min(w, ancho)))]
  const fuenteMtime = (await stat(archivo)).mtimeMs

  await mkdir(dirname(join(destino, base)), { recursive: true })

  for (const formato of FORMATOS) {
    for (const w of anchos) {
      const salida = join(destino, `${base}-${w}.${formato.ext}`)
      if (await existeMasNuevo(salida, fuenteMtime)) continue
      let q = 78
      let buffer
      do {
        buffer = await sharp(archivo).rotate().resize({ width: w }).toFormat(formato.ext === 'jpg' ? 'jpeg' : formato.ext, formato.opts(q)).toBuffer()
        q -= 8
      } while (buffer.length > MAX_BYTES && q > 30)
      await writeFile(salida, buffer)
    }
  }

  return [clave, { w: ancho, h: alto, anchos, base: `/images/_opt/${base}` }]
}

const archivos = await listar(origen)
const entradas = await Promise.all(archivos.map(procesar))

// Íconos SVG de los diseños de bikini: no se convierten, solo se registran
// para que el desplegable "Bikini a elegir" los use si existen.
let iconos = []
try {
  iconos = (await readdir(join(origen, 'iconos/bikini'))).filter((f) => f.endsWith('.svg'))
} catch {
  /* sin íconos: el desplegable queda en texto */
}
for (const f of iconos) entradas.push([`iconos/bikini/${f}`, { w: 0, h: 0, anchos: [], base: `/images/iconos/bikini/${f}` }])

const manifiesto = Object.fromEntries(entradas.sort(([a], [b]) => a.localeCompare(b)))
const json = `${JSON.stringify(manifiesto, null, 2)}\n`

let anterior = ''
try {
  anterior = await readFile(manifiestoRuta, 'utf8')
} catch {
  /* primera vez */
}
if (anterior !== json) await writeFile(manifiestoRuta, json)
console.log(`imagenes: ${archivos.length} foto(s) en public/images, manifiesto al día.`)
