import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useMetaPixel } from '../hooks/useMetaPixel'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { Nav } from './Nav'

/*
 * Generadas una sola vez a nivel de módulo (no en cada render de Layout):
 * si vivieran dentro del componente, cada navegación entre rutas internas
 * las recalcularía y las motas "saltarían" a posiciones nuevas en vez de
 * seguir flotando en la suya.
 */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${Math.round((i * 6.25 + Math.random() * 5) % 100)}%`,
  size: 3 + Math.round(Math.random() * 4),
  duration: 22 + Math.round(Math.random() * 14),
  delay: -Math.round(Math.random() * 30),
}))

// El home es la única ruta con el hero a pantalla completa detrás del nav; el
// resto son páginas de fondo claro y scroll normal.
export function Layout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = pathname === '/'

  // El Layout envuelve todas las rutas, así que es el único lugar donde hace
  // falta montar el pixel.
  useMetaPixel()

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  // Sin esto el router conserva el scroll al cambiar de ruta y las páginas
  // internas abren a media altura.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // El menú abierto sobrevive a la navegación si no se cierra a mano.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className={isHome ? 'h-screen w-full overflow-hidden bg-white' : 'relative min-h-screen w-full bg-blush-50'}>
      {/*
       * El home tiene el video del hero de fondo; las páginas internas no
       * tienen imagen, así que esta atmósfera es el eco de esa escena sin
       * repetir el video en cada ruta: tres resplandores que derivan muy
       * despacio (nunca sincronizados entre sí) más motas de luz que suben,
       * todo fijo al viewport para que acompañe el scroll completo, no solo
       * el primer tramo.
       */}
      {!isHome && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="animate-drift-a absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-blush-200/50 blur-3xl" />
          <div className="animate-drift-b absolute -left-40 top-[55vh] h-[30rem] w-[30rem] rounded-full bg-blush-300/30 blur-3xl" />
          <div className="animate-drift-c absolute left-[60vw] top-[10vh] h-[24rem] w-[24rem] rounded-full bg-blush-100/60 blur-3xl" />
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="bg-particle absolute bottom-0 rounded-full bg-blush-400"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}
      <Nav onOpenMenu={() => setMenuOpen(true)} variant={isHome ? 'over-media' : 'solid'} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Outlet />
      {!isHome && <Footer />}
    </div>
  )
}
