import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../lib/nav'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const EASING = 'cubic-bezier(0.77, 0, 0.18, 1)'

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisible(false)
      return
    }
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [open])

  if (!open) return null

  /*
   * En mobile no hay dropdowns: los hijos se listan debajo del padre en un
   * cuerpo más chico. El contador va de corrido (padres e hijos juntos) para
   * que el stagger de entrada baje parejo por toda la lista.
   */
  let stagger = 0

  return (
    <div className="fixed inset-0 z-[55]">
      {/*
        Backdrop: fondo oscurecido detrás del drawer, no el drawer mismo — se
        toca para cerrar, igual que el botón X. Antes el menú era negro sólido
        a pantalla completa; esto deja el fondo real de la página visible
        detrás, atenuado, que es lo que se espera de un drawer.
      */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-500"
        style={{ transitionTimingFunction: EASING, opacity: visible ? 1 : 0 }}
      />

      {/*
        Drawer: entra deslizando desde la derecha (no a pantalla completa),
        esquina redondeada para que no se sienta como un rectángulo pegado al
        borde. `overflow-hidden` acá recorta los blobs de abajo a esa esquina;
        el scroll real del contenido vive en el div interno.
      */}
      <div
        className="absolute inset-y-0 right-0 isolate w-[85%] max-w-sm overflow-hidden rounded-l-[2rem] shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.35)] transition-transform duration-500"
        style={{
          transitionTimingFunction: EASING,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/*
          Fondo ambiental: el mismo lenguaje que el resplandor de fondo de las
          páginas internas (ver Layout.tsx) — degradado blush + tres blobs
          difuminados que derivan cada uno a su propio ritmo. Es lo que rompe
          el blanco/negro plano y le da algo de movimiento al drawer.
        */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-white via-blush-50 to-blush-100">
          <div className="animate-drift-a absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blush-300/50 blur-3xl" />
          <div className="animate-drift-b absolute -left-20 top-[45%] h-56 w-56 rounded-full bg-blush-400/30 blur-3xl" />
          <div className="animate-drift-c absolute -bottom-24 right-4 h-52 w-52 rounded-full bg-blush-200/70 blur-3xl" />
        </div>

        <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex shrink-0 items-center justify-end px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white transition-all duration-500"
            style={{
              transitionTimingFunction: EASING,
              transitionDelay: '80ms',
              transform: visible ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.8)',
              opacity: visible ? 1 : 0,
            }}
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rotate-45 bg-neutral-900" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 -rotate-45 bg-neutral-900" />
            </span>
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-3 px-8 py-6">
          {NAV_ITEMS.map((item) => {
            const parentDelay = 140 + stagger++ * 50

            return (
              <div key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    // `py-1.5`: el texto solo (32px de line-height en
                    // text-2xl) queda corto del mínimo táctil de 44px.
                    `block py-1.5 text-2xl font-medium transition-all duration-500 ${
                      isActive ? 'text-neutral-900' : 'text-neutral-500'
                    }`
                  }
                  style={{
                    transitionTimingFunction: EASING,
                    transitionDelay: `${parentDelay}ms`,
                    transform: visible ? 'translateX(0)' : 'translateX(24px)',
                    opacity: visible ? 1 : 0,
                  }}
                >
                  {item.label}
                </NavLink>

                {item.children && (
                  <div className="mt-1 flex flex-col border-l border-black/10 pl-4">
                    {item.children.map((child) => {
                      const childDelay = 140 + stagger++ * 50

                      return (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            /*
                             * `py-2.5`: la fila completa (texto + padding) es
                             * el área de toque — con solo el line-height del
                             * texto (~24px) quedaba corto de 44px.
                             */
                            `block py-2.5 text-base transition-all duration-500 ${
                              isActive ? 'text-neutral-900' : 'text-neutral-400'
                            }`
                          }
                          style={{
                            transitionTimingFunction: EASING,
                            transitionDelay: `${childDelay}ms`,
                            transform: visible ? 'translateX(0)' : 'translateX(16px)',
                            opacity: visible ? 1 : 0,
                          }}
                        >
                          {child.label}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex shrink-0 justify-center px-8 pb-10">
          <Link
            to="/ubicaciones"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-all duration-500 hover:bg-neutral-700"
            style={{
              transitionTimingFunction: EASING,
              transitionDelay: `${140 + stagger * 50}ms`,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              opacity: visible ? 1 : 0,
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Agendar cita
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}
