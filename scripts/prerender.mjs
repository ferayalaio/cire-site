/*
 * Prerender: convierte cada ruta de la SPA en un HTML estático con su propio
 * <title>, description, canonical, Open Graph, JSON-LD y el contenido ya
 * renderizado dentro de <div id="root">.
 *
 * Por qué: Google indexa más rápido y más completo lo que viene en el HTML que
 * lo que tiene que esperar a ejecutar JS, y los scrapers de preview (WhatsApp,
 * Facebook) no ejecutan JS nunca — sin esto, todo link compartido mostraba el
 * título genérico del index.html.
 *
 * Corre después de `vite build` (cliente) y `vite build --ssr` (este entry),
 * ver el script "build" de package.json. En el navegador React vuelve a
 * renderizar todo con createRoot: el HTML prerenderizado es para el primer
 * pintado y para los bots, no se hidrata.
 *
 * Además escribe dist/sitemap.xml y dist/robots.txt con las mismas rutas.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Mismo valor que SITE_URL en src/lib/site.ts.
const SITE_URL = 'https://ciredepilacion.com'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const { render, ROUTES, NOT_FOUND_ROUTE } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
)

const template = await readFile(join(dist, 'index.html'), 'utf8')

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// `</script>` dentro de un string del JSON cerraría el tag antes de tiempo.
const escapeJson = (json) => json.replace(/</g, '\\u003c')

function headTags(head) {
  const tags = []

  if (head.noindex) {
    tags.push('<meta name="robots" content="noindex" />')
  } else if (head.canonical) {
    tags.push(`<link rel="canonical" href="${escapeAttr(head.canonical)}" />`)
  }

  const og = {
    'og:title': head.title,
    'og:description': head.description,
    'og:url': head.canonical,
    'og:image': head.ogImage,
  }
  for (const [property, content] of Object.entries(og)) {
    if (content) tags.push(`<meta property="${property}" content="${escapeAttr(content)}" />`)
  }

  const twitter = {
    'twitter:title': head.title,
    'twitter:description': head.description,
    'twitter:image': head.ogImage,
  }
  for (const [name, content] of Object.entries(twitter)) {
    if (content) tags.push(`<meta name="${name}" content="${escapeAttr(content)}" />`)
  }

  for (const [id, json] of Object.entries(head.jsonLd)) {
    tags.push(`<script type="application/ld+json" id="jsonld-${id}">${escapeJson(json)}</script>`)
  }

  return tags.join('\n    ')
}

function page(url) {
  const { html, head } = render(url)
  let out = template

  if (head.title) {
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(head.title)}</title>`)
  }
  if (head.description) {
    out = out.replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeAttr(head.description)}" />`,
    )
  }

  out = out.replace('</head>', `    ${headTags(head)}\n  </head>`)
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  return { out, head }
}

// `/laser/zonas` → dist/laser/zonas.html. Vercel lo sirve en /laser/zonas con
// `cleanUrls` (vercel.json), sin barra final y sin `.html`.
function fileFor(url) {
  return url === '/' ? join(dist, 'index.html') : join(dist, `${url.slice(1)}.html`)
}

const problems = []

for (const url of ROUTES) {
  const { out, head } = page(url)
  if (!head.title || !head.description) problems.push(`${url}: falta title o description`)
  if (head.noindex) problems.push(`${url}: salió con noindex`)

  const file = fileFor(url)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, out)
}

await writeFile(join(dist, '404.html'), page(NOT_FOUND_ROUTE).out)

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((url) => `  <url><loc>${SITE_URL}${url === '/' ? '/' : url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

await rm(ssrDir, { recursive: true, force: true })

if (problems.length > 0) {
  console.error(`[prerender] Revisar:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

console.log(`[prerender] ${ROUTES.length} rutas + 404.html, sitemap.xml y robots.txt en dist/`)
