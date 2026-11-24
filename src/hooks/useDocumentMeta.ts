import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../lib/site'
import { IS_SERVER, setSsrMeta } from '../lib/ssr-head'

/*
 * Title y meta description por página.
 *
 * En una SPA el `index.html` es uno solo, así que sin esto todas las rutas
 * comparten el `<title>` del template y Google ve catorce páginas llamadas
 * igual. Cada página llama al hook con su par único.
 *
 * Sobre el crawling: cada ruta se prerenderiza a HTML estático en el build
 * (scripts/prerender.mjs), y este hook también alimenta ese HTML. Así el
 * título, la descripción y el canonical están en la respuesta del servidor:
 * los ve Google sin ejecutar JS y los ve el scraper de preview de WhatsApp,
 * que no ejecuta JS nunca.
 */

/* Se reusa cuando una página no pasa description propia. */
const DEFAULT_DESCRIPTION =
  'Depilación láser, cera, HIFU y tratamientos corporales. Agenda tu cita por WhatsApp.'

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function removeMeta(selector: string) {
  document.head.querySelector(selector)?.remove()
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }

  link.href = href
}

export interface DocumentMeta {
  /**
   * Sin el nombre del sitio: el hook le agrega " | Cire Depilación". Conviene
   * que arranque con lo que distingue a la página, porque en la pestaña y en
   * los resultados de búsqueda el final se corta.
   */
  title: string

  description?: string

  /** URL absoluta de la miniatura para compartir. Default: og-image.jpg. */
  image?: string

  /**
   * Para la 404 y nada más: le dice a Google que no la indexe. Una página de
   * contenido real nunca lo lleva — un noindex olvidado es la forma más
   * común de desaparecer de Google sin enterarse.
   */
  noindex?: boolean
}

export function useDocumentMeta({ title, description, image, noindex }: DocumentMeta): void {
  const { pathname } = useLocation()

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const desc = description ?? DEFAULT_DESCRIPTION
  const canonical = absoluteUrl(pathname)
  const ogImage = image ?? DEFAULT_OG_IMAGE

  // En el prerender no corren efectos: se deja el resultado en el colector y
  // scripts/prerender.mjs lo escribe en el HTML estático de la ruta.
  if (IS_SERVER) {
    setSsrMeta({ title: fullTitle, description: desc, canonical, ogImage, noindex })
  }

  useEffect(() => {
    document.title = fullTitle
    upsertMeta('meta[name="description"]', 'name', 'description', desc)

    // og:* es lo que define cómo se ve el link cuando alguien lo pega en un
    // chat, que en este sitio es el canal principal.
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)

    if (noindex) {
      upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex')
      removeMeta('link[rel="canonical"]')
    } else {
      removeMeta('meta[name="robots"]')
      upsertCanonical(canonical)
    }
  }, [fullTitle, desc, canonical, ogImage, noindex])
}
