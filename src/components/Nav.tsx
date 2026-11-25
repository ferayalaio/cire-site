import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../lib/nav'
import { trackAgendarClick } from '../lib/analytics'
import { AGENDAR_URL } from '../lib/site'
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
function matches(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

/*
 * Una ruta puede caer bajo dos items (/laser/bikini es tab propio y también
 * cuelga de /laser; /cera vive en el dropdown de Otros servicios). Gana la
 * coincidencia más específica, contando las rutas de los hijos.
 */
function activeItemTo(pathname: string): string | undefined {
  let best: { to: string; len: number } | undefined
  for (const item of NAV_ITEMS) {
    for (const to of [item.to, ...(item.children ?? []).map((c) => c.to)]) {
      if (matches(pathname, to) && (!best || to.length > best.len)) best = { to: item.to, len: to.length }
    }
  }
  return best?.to
}

/*
 * "Agendar cita" lleva a la agenda en línea (nov/26), igual en todas las rutas.
 * Antes hacía scroll al bloque #agendar de cada página o mandaba a
 * /ubicaciones; ahora el sitio tiene un sistema de citas propio.
 */
function AgendarLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a
      href={AGENDAR_URL}
      target="_blank"
      rel="noopener"
      onClick={() =>
        trackAgendarClick({ sku: 'nav-agendar', nombre: 'una cita', categoria: 'general', placement: 'hero' })
      }
      className={className}
    >
      {children}
    </a>
  )
}

export function Nav({ onOpenMenu }: NavProps) {
  const { pathname } = useLocation()
  const activeTo = activeItemTo(pathname)

  return (
    /*
     * Barra sólida (rediseño nov/26). Antes eran pastillas de vidrio flotando
     * sobre el video del hero; sobre fondos claros se perdían y el contenido
     * pasaba por debajo del logo. Una barra con fondo propio siempre se lee.
     *
     * `top` sale de `--anuncio-h` (la publica Layout): con el cintillo abierto
     * el nav baja esos 2.5rem, y cerrado vuelve a 0.
     */
    <nav className="fixed inset-x-0 top-[var(--anuncio-h,0px)] z-50 border-b border-black/[0.06] bg-paper/95 backdrop-blur-md transition-[top] duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 sm:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src={LOGO_IMAGE} alt="" width={40} height={40} data-logo-nav className="h-10 w-10 rounded-full" />
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Cire Depilación</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavEntry key={item.to} item={item} active={item.to === activeTo} />
          ))}
        </div>

        <AgendarLink
          className="hidden shrink-0 items-center rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blush-900 lg:inline-flex"
        >
          Agendar cita
        </AgendarLink>

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-black/[0.04] lg:hidden"
        >
          <span className="h-[1.5px] w-5 bg-ink" />
          <span className="h-[1.5px] w-5 bg-ink" />
        </button>
      </div>
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
    'relative rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors'
  return `${base} ${active ? 'text-ink' : 'text-neutral-600 hover:text-ink'}`
}

function NavEntry({ item, active }: NavEntryProps) {
  const linkClass = entryClass(active)
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  /*
   * Antes el dropdown abría solo con CSS (group-hover/group-focus-within),
   * sin estado en React. Al navegar con un clic o un tap, el cursor/foco se
   * queda físicamente sobre el mismo lugar y el panel no tenía forma de
   * enterarse de que la ruta cambió: se quedaba pegado encima de la página
   * nueva (más notorio en táctil, donde el tap deja el :hover "prendido"
   * hasta el próximo toque afuera). Este efecto lo cierra a la fuerza en
   * cuanto cambia la ruta.
   */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!item.children) {
    return (
      <NavLink to={item.to} className={linkClass}>
        {item.label}
      </NavLink>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <NavLink
        to={item.to}
        onClick={() => setOpen(false)}
        className={`${linkClass} inline-flex items-center gap-1.5`}
      >
        {item.label}
        <svg
          viewBox="0 0 10 6"
          aria-hidden="true"
          className={`h-[6px] w-[10px] opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </NavLink>

      <div
        className={`absolute left-1/2 top-full w-max -translate-x-1/2 pt-3 transition-opacity duration-200 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="min-w-[240px] rounded-xl border border-black/[0.07] bg-white p-1.5 shadow-[0_18px_40px_-20px_rgba(43,27,30,0.35)]">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={() => setOpen(false)}
              className={({ isActive: on }) =>
                `block rounded-lg px-3.5 py-2.5 transition-colors ${
                  on ? 'bg-blush-50 text-ink' : 'text-neutral-700 hover:bg-blush-50 hover:text-ink'
                }`
              }
            >
              <span className="block text-sm font-medium">{child.label}</span>
              {child.description && (
                <span className="mt-0.5 block text-[13px] text-neutral-500">{child.description}</span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
