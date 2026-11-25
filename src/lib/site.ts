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

/*
 * Sistema de agenda en línea (nov/26). Vive en el mismo dominio pero NO es
 * parte de esta app: se enlaza con un <a> normal, nunca con <Link> de React
 * Router (eso renderizaría el 404 propio del sitio en lugar del sistema).
 */
export const AGENDAR_URL = `${SITE_URL}/agendar`

/*
 * Agenda directa por sucursal (nov/26): /agendar/<sucursal> abre la agenda ya
 * en esa sucursal. El slug de la agenda no siempre es el del sitio (Del Valle
 * es `delvalle` allá y `del-valle` acá), por eso va explícito y no derivado.
 * Una sucursal que no esté aquí cae en la agenda general.
 */
const AGENDA_SUCURSAL: Record<string, string> = {
  polanco: 'polanco',
  'del-valle': 'delvalle',
  coapa: 'coapa',
  oriente: 'oriente',
  metepec: 'metepec',
}

export function agendarUrl(sucursal?: string): string {
  const destino = sucursal ? AGENDA_SUCURSAL[sucursal] : undefined
  return destino ? `${AGENDAR_URL}/${destino}` : AGENDAR_URL
}

export const SITE_NAME = 'Cire Depilación'

/** 1200×630, en `public/`. Es la miniatura de WhatsApp, Facebook y X. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

/** URL absoluta y canónica de una ruta interna (`/laser` → `https://…/laser`). */
export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE_URL}/`
  return `${SITE_URL}${path.replace(/\/+$/, '')}`
}
