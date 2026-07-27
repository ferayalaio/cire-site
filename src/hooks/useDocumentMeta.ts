import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/*
 * Title y meta description por página.
 *
 * En una SPA el `index.html` es uno solo, así que sin esto todas las rutas
 * comparten el `<title>` del template y Google ve catorce páginas llamadas
 * igual. Cada página llama al hook con su par único.
 *
 * Sobre el crawling: Googlebot ejecuta JS, así que lee lo que este hook
 * escribe. Los scrapers de link preview (el de WhatsApp entre ellos) NO
 * ejecutan JS y se quedan con lo que hay en el HTML servido — para que el
 * preview de un paquete compartido por chat muestre su propio título hace
 * falta prerender o SSR, que es una decisión aparte y está anotada en el
 * README.
 */

const SITE_NAME = 'Cire Depilación'

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
}

export function useDocumentMeta({ title, description }: DocumentMeta): void {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    const desc = description ?? DEFAULT_DESCRIPTION

    document.title = fullTitle
    upsertMeta('meta[name="description"]', 'name', 'description', desc)

    // og:* es lo que define cómo se ve el link cuando alguien lo pega en un
    // chat, que en este sitio es el canal principal.
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website')

    upsertCanonical(`${window.location.origin}${pathname}`)
  }, [title, description, pathname])
}
