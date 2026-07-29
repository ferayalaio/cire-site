import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../lib/nav'
import type { NavItem } from '../lib/nav'
import { LOGO_IMAGE } from '../lib/constants'

interface NavProps {
  onOpenMenu: () => void
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

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Nav({ onOpenMenu }: NavProps) {
  const { pathname } = useLocation()

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link to="/" className="flex items-center gap-3">
        <img src={LOGO_IMAGE} alt="Cire Depilación" className="h-11 w-11 rounded-full sm:h-12 sm:w-12" />
        <span aria-hidden="true" className="hidden h-7 w-px bg-black/15 sm:block" />
        <span className="hidden text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-neutral-500 sm:block">
          Depilación
          <br />
          láser diodo
        </span>
      </Link>

      <div className="glass-light fixed left-1/2 top-5 hidden -translate-x-1/2 items-center gap-0.5 rounded-full px-2 py-2 md:flex">
        {NAV_ITEMS.map((item) => (
          <NavEntry key={item.to} item={item} active={isActive(pathname, item.to)} />
        ))}
      </div>

      <Link
        to="/ubicaciones"
        className="glass-light hidden shrink-0 items-center gap-2.5 rounded-full py-2 pl-5 pr-2 text-sm font-medium text-blush-900 transition-colors md:inline-flex"
      >
        Agendar cita
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-blush-200 bg-white text-blush-900">
          <ArrowUpRightIcon />
        </span>
      </Link>

      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menú"
        className="glass-light flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
      >
        <span className="h-[1.5px] w-5 bg-neutral-900" />
        <span className="h-[1.5px] w-3.5 bg-neutral-900" />
      </button>
    </nav>
  )
}

interface NavEntryProps {
  item: NavItem
  active: boolean
}

/*
 * Con cuatro tabs la pastilla es angosta y entra cómoda desde md, así que el
 * padding puede ir holgado en vez de apretarse por ancho como cuando eran
 * siete items.
 */
function entryClass(active: boolean) {
  const base =
    'relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors'
  return `${base} ${active ? 'bg-black/[0.06] text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`
}

function NavEntry({ item, active }: NavEntryProps) {
  const linkClass = entryClass(active)

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
        <div className="glass-light min-w-[220px] rounded-2xl p-1.5">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive: on }) =>
                `block rounded-xl px-3.5 py-2.5 transition-colors ${
                  on ? 'bg-black/[0.06] text-neutral-900' : 'text-neutral-600 hover:bg-black/[0.04] hover:text-neutral-900'
                }`
              }
            >
              <span className="block text-sm font-medium">{child.label}</span>
              {child.description && (
                <span className="mt-0.5 block text-xs text-neutral-400">{child.description}</span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
