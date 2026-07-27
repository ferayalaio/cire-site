import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../lib/nav'
import type { NavItem } from '../lib/nav'

interface NavProps {
  onOpenMenu: () => void
  /*
   * `over-media` es el nav del home: flota sobre el video del hero y va en
   * blanco. `solid` es el de las páginas internas (fondo claro), donde el
   * mismo tratamiento de vidrio quedaría invisible.
   */
  variant?: 'over-media' | 'solid'
}

/*
 * Un item está activo cuando la URL es exactamente su ruta o cuelga de ella
 * (/laser/bikini marca "Láser"). El home se compara exacto: con el prefijo
 * quedaría activo en todas las rutas.
 */
function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Nav({ onOpenMenu, variant = 'over-media' }: NavProps) {
  const { pathname } = useLocation()
  const overMedia = variant === 'over-media'

  const pillClass = overMedia
    ? 'glass-dark'
    : 'border border-black/[0.07] bg-white/80 shadow-[0_1px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl'

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-end px-6 py-5 sm:px-10">
      <div
        className={`fixed left-1/2 top-5 hidden -translate-x-1/2 items-center gap-0.5 rounded-full px-2 py-2 md:flex ${pillClass}`}
      >
        {NAV_ITEMS.map((item) => (
          <NavEntry
            key={item.to}
            item={item}
            active={isActive(pathname, item.to)}
            overMedia={overMedia}
          />
        ))}
      </div>

      <Link
        to="/ubicaciones"
        className={`hidden shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors md:inline-flex ${
          overMedia ? 'glass-dark text-white' : 'bg-neutral-900 text-white hover:bg-neutral-800'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        Agendar cita
      </Link>

      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menú"
        className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full md:hidden ${pillClass}`}
      >
        <span className={`h-[1.5px] w-5 ${overMedia ? 'bg-white' : 'bg-neutral-900'}`} />
        <span className={`h-[1.5px] w-3.5 ${overMedia ? 'bg-white' : 'bg-neutral-900'}`} />
      </button>
    </nav>
  )
}

interface NavEntryProps {
  item: NavItem
  active: boolean
  overMedia: boolean
}

/*
 * Tailwind escanea el código fuente buscando clases literales, así que las
 * variantes no pueden construirse por interpolación (`text-${color}`) — cada
 * combinación se escribe completa.
 */
function entryClass(active: boolean, overMedia: boolean) {
  /*
   * Con cuatro tabs la pastilla es angosta y entra cómoda desde md, así que
   * el padding puede ir holgado en vez de apretarse por ancho como cuando
   * eran siete items.
   */
  const base =
    'relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors'
  if (overMedia) {
    return `${base} ${active ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'}`
  }
  return `${base} ${
    active ? 'bg-neutral-900/[0.06] text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
  }`
}

function NavEntry({ item, active, overMedia }: NavEntryProps) {
  const linkClass = entryClass(active, overMedia)

  if (!item.children) {
    return (
      <NavLink to={item.to} className={linkClass}>
        {item.label}
      </NavLink>
    )
  }

  /*
   * El dropdown abre con hover y con focus-within, así el teclado llega a los
   * hijos sin estado en React. El padding-top del panel deja un puente
   * invisible entre el trigger y el menú para que no se cierre al cruzar el
   * hueco con el mouse.
   */
  return (
    <div className="group relative">
      <NavLink to={item.to} className={`${linkClass} inline-flex items-center gap-1.5`}>
        {item.label}
        <svg
          viewBox="0 0 10 6"
          aria-hidden="true"
          className="h-[6px] w-[10px] opacity-60 transition-transform duration-200 group-hover:rotate-180"
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </NavLink>

      <div className="pointer-events-none absolute left-1/2 top-full w-max -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-200 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
        <div
          className={`min-w-[220px] rounded-2xl p-1.5 ${
            overMedia
              ? 'glass-dark'
              : 'border border-black/[0.07] bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl'
          }`}
        >
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive: on }) =>
                `block rounded-xl px-3.5 py-2.5 transition-colors ${
                  overMedia
                    ? on
                      ? 'bg-white/15 text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                    : on
                      ? 'bg-neutral-900/[0.06] text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-900/[0.04] hover:text-neutral-900'
                }`
              }
            >
              <span className="block text-sm font-medium">{child.label}</span>
              {child.description && (
                <span
                  className={`mt-0.5 block text-xs ${overMedia ? 'text-white/45' : 'text-neutral-400'}`}
                >
                  {child.description}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
