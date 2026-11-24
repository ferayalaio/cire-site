/*
 * Colector del <head> durante el prerender.
 *
 * En el navegador, useDocumentMeta y useJsonLd escriben el <head> desde un
 * efecto. En el prerender (scripts/prerender.mjs) los efectos no corren, así
 * que los mismos hooks dejan lo que habrían escrito en este objeto durante el
 * render, y el script lo vuelca al HTML estático de cada ruta.
 *
 * Es un singleton de módulo a propósito: el prerender renderiza las rutas de a
 * una y de forma síncrona (renderToString), y llama a resetSsrHead() antes de
 * cada una. En el navegador este módulo no se usa nunca (IS_SERVER es false).
 */

export const IS_SERVER = typeof window === 'undefined'

export interface SsrHead {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  noindex?: boolean
  jsonLd: Record<string, string>
}

let head: SsrHead = { jsonLd: {} }

export function resetSsrHead(): void {
  head = { jsonLd: {} }
}

export function getSsrHead(): SsrHead {
  return head
}

export function setSsrMeta(meta: Omit<SsrHead, 'jsonLd'>): void {
  head = { ...head, ...meta }
}

export function addSsrJsonLd(id: string, json: string): void {
  head.jsonLd[id] = json
}
