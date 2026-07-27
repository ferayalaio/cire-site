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
    <div className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-[#0a0a0a]">
      <div className="flex shrink-0 items-center justify-end px-6 py-5 sm:px-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500"
          style={{
            transitionTimingFunction: EASING,
            transform: visible ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.8)',
            opacity: visible ? 1 : 0,
          }}
        >
          <span className="relative block h-5 w-5">
            <span className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rotate-45 bg-white" />
            <span className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 -rotate-45 bg-white" />
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-5 px-8 py-10 sm:px-12">
        {NAV_ITEMS.map((item) => {
          const parentDelay = 100 + stagger++ * 50

          return (
            <div key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `block text-3xl font-medium transition-all duration-500 sm:text-4xl ${
                    isActive ? 'text-white' : 'text-white/85'
                  }`
                }
                style={{
                  transitionTimingFunction: EASING,
                  transitionDelay: `${parentDelay}ms`,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  opacity: visible ? 1 : 0,
                }}
              >
                {item.label}
              </NavLink>

              {item.children && (
                <div className="mt-2.5 flex flex-col gap-2 border-l border-white/15 pl-4">
                  {item.children.map((child) => {
                    const childDelay = 100 + stagger++ * 50

                    return (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `block text-base transition-all duration-500 ${
                            isActive ? 'text-white' : 'text-white/50'
                          }`
                        }
                        style={{
                          transitionTimingFunction: EASING,
                          transitionDelay: `${childDelay}ms`,
                          transform: visible ? 'translateY(0)' : 'translateY(16px)',
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

      <div className="flex shrink-0 justify-center px-8 pb-12">
        <Link
          to="/ubicaciones"
          onClick={onClose}
          className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-500"
          style={{
            transitionTimingFunction: EASING,
            transitionDelay: `${100 + stagger * 50}ms`,
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
  )
}
