/*
 * Identidad del sitio para SEO: dominio canónico, nombre y la imagen que sale
 * al compartir un link.
 *
 * SITE_URL va fijo y NO se toma de `window.location.origin`: el mismo build se
 * sirve también en `cire-site.vercel.app` y en cada preview, y si el canonical
 * siguiera al host, Google vería dos sitios idénticos compitiendo entre sí. El
 * canonical, el sitemap, el JSON-LD y los og:url apuntan siempre acá.
 *
 * Si algún día cambia el dominio, se cambia esta línea y la de
 * `scripts/prerender.mjs` (que no puede importar TypeScript).
 */
export const SITE_URL = 'https://ciredepilacion.com'

export const SITE_NAME = 'Cire Depilación'

/** 1200×630, en `public/`. Es la miniatura de WhatsApp, Facebook y X. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

/** URL absoluta y canónica de una ruta interna (`/laser` → `https://…/laser`). */
export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE_URL}/`
  return `${SITE_URL}${path.replace(/\/+$/, '')}`
}
