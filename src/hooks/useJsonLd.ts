import { useEffect } from 'react'
import type { FaqItem } from '../data/faq'
import { SUCURSALES } from '../data/sucursales'
import { MARCA } from '../data/marca'

/*
 * Structured data (JSON-LD).
 *
 * Complementa a useDocumentMeta: ese hook le dice a Google de qué trata la
 * página, este le dice qué ES. Son dos cosas distintas y la segunda es la que
 * habilita los resultados enriquecidos — el desplegable de preguntas debajo
 * del resultado, y la ficha del negocio con sus sucursales.
 *
 * Googlebot ejecuta JS, así que lee lo que se inyecta acá igual que lee el
 * title. Vale la misma advertencia que en useDocumentMeta: un scraper que no
 * ejecuta JS no lo ve, y la solución de fondo (prerender/SSR) sigue anotada en
 * el README.
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
  useEffect(() => {
    const elementId = `${SCRIPT_ID_PREFIX}${id}`
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

export function useLocalBusinessJsonLd(): void {
  useJsonLd(
    'local-business',
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HealthAndBeautyBusiness',
      name: MARCA.nombre,
      description: `Depilación láser de diodo con punta de zafiro, cera italiana y HIFU. ${MARCA.cantidadSucursales} sucursales en Ciudad de México y Metepec.`,
      url: window.location.origin,
      areaServed: ['Ciudad de México', 'Estado de México'],
      location: SUCURSALES.map((sucursal) => ({
        '@type': 'HealthAndBeautyBusiness',
        name: `${MARCA.nombre} ${sucursal.nombre}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: sucursal.direccion,
          addressRegion: sucursal.region,
          addressCountry: 'MX',
        },
        url: `${window.location.origin}/ubicaciones/${sucursal.slug}`,
        ...(sucursal.telefono ? { telephone: sucursal.telefono } : {}),
        ...(sucursal.mapsUrl ? { hasMap: sucursal.mapsUrl } : {}),
        openingHours: HORARIO_SCHEMA,
      })),
    }),
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
