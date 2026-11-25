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

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', to: '/' },
  {
    label: 'Láser',
    to: '/laser',
    children: [
      { label: 'Por zonas', to: '/laser/zonas', description: 'Precio de cada zona individual' },
      { label: 'Cuerpo completo', to: '/laser/cuerpo-completo', description: 'Full Body en una sesión' },
    ],
  },
  { label: 'Bikini', to: '/laser/bikini' },
  {
    label: 'Otros servicios',
    to: '/otros-servicios',
    children: [
      { label: 'Cera', to: '/cera', description: 'Cera italiana, resultado inmediato' },
      { label: 'HIFU', to: '/hifu', description: 'Lifting facial y corporal sin cirugía' },
      { label: 'Moldeo corporal', to: '/otros-servicios/moldeo-corporal', description: 'Moldeo Cire-Na y Cire Body' },
      {
        label: 'Cire Sculpt Anticelulítico',
        to: '/otros-servicios/cire-sculpt-anticelulitico',
        description: 'Protocolo anticelulítico por sesiones',
      },
      {
        label: 'Cire Sculpt Post Operativo',
        to: '/otros-servicios/post-operatorio',
        description: 'Drenaje y acompañamiento post-quirúrgico',
      },
    ],
  },
  { label: 'Ubicaciones', to: '/#ubicaciones' },
]
