import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { FaqItem } from '../data/faq'
import { SUCURSALES } from '../data/sucursales'
import { MARCA, REDES } from '../data/marca'
import type { Sucursal } from '../data/sucursales'
import type { BlogPost } from '../data/blog'
import { SITE_URL, absoluteUrl } from '../lib/site'
import { IS_SERVER, addSsrJsonLd } from '../lib/ssr-head'

/*
 * Structured data (JSON-LD).
 *
 * Complementa a useDocumentMeta: ese hook le dice a Google de qué trata la
 * página, este le dice qué ES. Son dos cosas distintas y la segunda es la que
 * habilita los resultados enriquecidos — el desplegable de preguntas debajo
 * del resultado, y la ficha del negocio con sus sucursales.
 *
 * Igual que useDocumentMeta, en el prerender deja el bloque en el colector
 * (lib/ssr-head.ts) para que salga en el HTML estático de la ruta; en el
 * navegador lo inyecta desde un efecto.
 *
 * REGLA DURA: acá solo entra información que también está visible en la
 * página. Marcar como structured data algo que la persona no puede leer —o un
 * promedio de reseñas sin verificar, ver GOOGLE_REVIEWS en data/marca.ts— es
 * exactamente lo que Google penaliza como spam de datos estructurados. Por eso
 * el `aggregateRating` NO se emite todavía.
 */

const SCRIPT_ID_PREFIX = 'jsonld-'

/*
 * El JSON llega ya serializado y no como objeto: los `data` de abajo se
 * construyen literales en cada render, así que como dependencia de efecto
 * cambiarían de identidad siempre y el script se reinyectaría en cada render.
 * Comparado como string, el efecto corre solo cuando el contenido cambia.
 */
function useJsonLd(id: string, json: string): void {
  // String vacío = "esta página no lleva este bloque" (sin migas, sucursal
  // inexistente). Mantiene el hook incondicional, como piden las reglas de hooks.
  if (IS_SERVER && json) addSsrJsonLd(id, json)

  useEffect(() => {
    const elementId = `${SCRIPT_ID_PREFIX}${id}`

    // El prerender ya dejó este mismo bloque en el HTML. Se reemplaza en vez
    // de duplicarlo, así Google no ve dos veces la misma entidad.
    document.getElementById(elementId)?.remove()
    if (!json) return

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = elementId
    script.textContent = json
    document.head.appendChild(script)

    // La limpieza no es opcional en una SPA: sin esto, al navegar del home a
    // otra ruta el bloque se quedaría en el <head> describiendo una página que
    // ya no se está viendo.
    return () => {
      document.getElementById(elementId)?.remove()
    }
  }, [id, json])
}

/*
 * `openingHours` en el formato corto de schema.org. Los horarios viven en
 * HORARIO como texto para humanos ("Lunes a viernes 10:00 – 20:00"), así que
 * la traducción a Mo-Fr / Sa se hace acá una sola vez en lugar de duplicar el
 * dato en otro formato.
 */
const HORARIO_SCHEMA = ['Mo-Fr 10:00-20:00', 'Sa 09:00-16:00']

function sucursalSchema(sucursal: Sucursal) {
  return {
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${absoluteUrl(`/ubicaciones/${sucursal.slug}`)}#negocio`,
    name: `${MARCA.nombre} ${sucursal.nombre}`,
    image: sucursal.foto ? `${SITE_URL}${sucursal.foto}` : `${SITE_URL}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: sucursal.direccion,
      addressRegion: sucursal.region,
      addressCountry: 'MX',
    },
    url: absoluteUrl(`/ubicaciones/${sucursal.slug}`),
    parentOrganization: { '@id': `${SITE_URL}/#organizacion` },
    ...(sucursal.telefono ? { telephone: sucursal.telefono } : {}),
    ...(sucursal.mapsUrl ? { hasMap: sucursal.mapsUrl } : {}),
    openingHours: HORARIO_SCHEMA,
  }
}

export function useLocalBusinessJsonLd(): void {
  useJsonLd(
    'local-business',
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HealthAndBeautyBusiness',
      '@id': `${SITE_URL}/#organizacion`,
      name: MARCA.nombre,
      description: `Depilación láser de diodo con punta de zafiro, cera italiana y HIFU. ${MARCA.cantidadSucursales} sucursales en Ciudad de México y Metepec.`,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/hero/logo.jpeg`,
      image: `${SITE_URL}/og-image.jpg`,
      sameAs: Object.values(REDES),
      areaServed: ['Ciudad de México', 'Estado de México'],
      location: SUCURSALES.map(sucursalSchema),
    }),
  )
}

/*
 * Ficha propia de cada sucursal. Es la que puede emparejarse con su perfil de
 * Google Business: misma dirección y teléfono, escritos igual (NAP).
 */
export function useSucursalJsonLd(sucursal: Sucursal | undefined): void {
  useJsonLd(
    'sucursal',
    sucursal ? JSON.stringify({ '@context': 'https://schema.org', ...sucursalSchema(sucursal) }) : '',
  )
}

/*
 * Migas de pan. Las mismas que se ven arriba del h1 (PageShell), más la página
 * actual al final, que en pantalla no es link pero en el schema sí va.
 */
export function useBreadcrumbJsonLd(crumbs: { label: string; to: string }[] | undefined, current: string): void {
  const { pathname } = useLocation()
  const items = crumbs && crumbs.length > 0 ? [...crumbs, { label: current, to: pathname }] : []

  useJsonLd(
    'breadcrumb',
    items.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: absoluteUrl(crumb.to),
          })),
        })
      : '',
  )
}

export function useFaqJsonLd(items: FaqItem[]): void {
  useJsonLd(
    'faq',
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.pregunta,
        acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
      })),
    }),
  )
}

/*
 * Artículo del blog. El autor es la marca (no hay una persona firmando), y el
 * publisher apunta a la misma entidad del home vía @id, así Google lo conecta
 * con el negocio y sus sucursales.
 */
export function useArticleJsonLd(post: BlogPost): void {
  const url = absoluteUrl(`/blog/${post.slug}`)
  useJsonLd(
    'article',
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.titulo,
      description: post.descripcion,
      datePublished: post.fecha,
      dateModified: post.actualizado,
      inLanguage: 'es-MX',
      mainEntityOfPage: url,
      url,
      image: `${SITE_URL}/og-image.jpg`,
      author: { '@type': 'Organization', name: MARCA.nombre, url: `${SITE_URL}/` },
      publisher: { '@id': `${SITE_URL}/#organizacion` },
    }),
  )
}
