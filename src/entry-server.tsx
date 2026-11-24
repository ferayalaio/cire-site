import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { SUCURSALES } from './data/sucursales'
import { getSsrHead, resetSsrHead, type SsrHead } from './lib/ssr-head'

/*
 * Punto de entrada del prerender (ver scripts/prerender.mjs). No llega nunca
 * al navegador: Vite lo compila aparte con `--ssr`.
 *
 * Devuelve el HTML del <div id="root"> y lo que los hooks de SEO juntaron para
 * el <head> de esa ruta.
 */
export function render(url: string): { html: string; head: SsrHead } {
  resetSsrHead()

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  )

  return { html, head: getSsrHead() }
}

/*
 * Rutas que se prerenderizan y que entran al sitemap. Las de sucursal salen de
 * SUCURSALES, así una sucursal nueva entra sola. Si se agrega una página nueva
 * en App.tsx, va también acá — si no, queda sin HTML propio y fuera del sitemap.
 */
export const ROUTES: string[] = [
  '/',
  '/laser',
  '/laser/zonas',
  '/laser/bikini',
  '/laser/cuerpo-completo',
  '/cera',
  '/hifu',
  '/otros-servicios',
  '/otros-servicios/moldeo-corporal',
  '/otros-servicios/cire-sculpt-anticelulitico',
  '/otros-servicios/post-operatorio',
  '/ubicaciones',
  ...SUCURSALES.map((sucursal) => `/ubicaciones/${sucursal.slug}`),
  '/aviso-de-privacidad',
]

/* Ruta inexistente a propósito: su render es el 404.html. */
export const NOT_FOUND_ROUTE = '/__404__'
