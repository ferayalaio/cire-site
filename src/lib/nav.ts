/*
 * Fuente única de verdad de la navegación. La consumen el Nav de escritorio
 * (pill superior), el MobileMenu y el footer, así que agregar una ruta acá la
 * publica en los tres lugares — no hay listas paralelas que sincronizar.
 *
 * Los items con `children` se renderizan como dropdown en escritorio y como
 * grupo desplegado en el menú mobile. El `to` del padre sigue siendo una ruta
 * navegable (el hub), no un placeholder.
 */

export interface NavChild {
  label: string
  to: string
  description?: string
}

export interface NavItem {
  label: string
  to: string
  children?: NavChild[]
}

/*
 * Rutas que, tras la restructuración en secciones, terminan con su propio
 * bloque `id="agendar"`. El botón "Agendar cita" del nav usa esta lista para
 * decidir si hace smooth-scroll dentro de la página actual o si navega a
 * /ubicaciones (única opción razonable en páginas sin ese bloque, como
 * Ubicaciones mismo, FAQ o el detalle de una sucursal).
 */
export const RUTAS_CON_AGENDAR = new Set([
  '/',
  '/laser',
  '/laser/zonas',
  '/laser/bikini',
  '/laser/cuerpo-completo',
  '/cera',
  '/hifu',
  '/otros-servicios',
])

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', to: '/' },
  {
    label: 'Láser',
    to: '/laser',
    children: [
      { label: 'Por zonas', to: '/laser/zonas', description: 'Precio de cada zona individual' },
      { label: 'Bikini', to: '/laser/bikini', description: 'Los 4 niveles de cobertura' },
      { label: 'Cuerpo completo', to: '/laser/cuerpo-completo', description: 'Full Body en una sesión' },
    ],
  },
  { label: 'Cera', to: '/cera' },
  { label: 'HIFU', to: '/hifu' },
  { label: 'Otros servicios', to: '/otros-servicios' },
  { label: 'Ubicaciones', to: '/ubicaciones' },
  { label: 'FAQ', to: '/faq' },
]
