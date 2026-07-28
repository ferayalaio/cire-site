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
    <div
      className={
        isHome
          ? 'h-screen w-full overflow-hidden bg-white'
          : /*
             * `isolate` (no solo `relative`): sin un stacking context propio
             * acá, el `-z-10` del fondo ambiental de abajo escapa a compararse
             * contra el documento entero en vez de contra este div, y termina
             * pintado detrás del propio fondo de <body> — invisible en toda la
             * página, no solo "sutil". `isolate` lo contiene donde corresponde:
             * encima del gradiente de este div, debajo de su contenido real.
             */
            'relative isolate min-h-screen w-full bg-gradient-to-b from-blush-100 via-blush-50 to-blush-50'
      }
    >
      {/*
       * El home tiene el video del hero de fondo; las páginas internas no
       * tienen imagen, así que esta atmósfera es el eco de esa escena sin
       * repetir el video en cada ruta: resplandores que derivan muy despacio
       * (nunca sincronizados entre sí) más motas de luz que suben, todo fijo
       * al viewport para que acompañe el scroll completo, no solo el primer
       * tramo.
       *
       * Los tonos suben de blush-200/300 a blush-300/400 y el blur baja de
       * 3xl a 2xl frente a la primera pasada: contra un fondo que ya es
       * blush-50/100, un resplandor del mismo tono a blur-3xl se disolvía por
       * completo — subir la saturación y bajar la difusión es lo que lo hace
       * perceptible sin salirse de la paleta.
       */}
      {!isHome && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="animate-drift-a absolute -right-48 -top-48 h-[42rem] w-[42rem] rounded-full bg-blush-300/60 blur-2xl" />
          <div className="animate-drift-b absolute -left-48 top-[50vh] h-[36rem] w-[36rem] rounded-full bg-blush-400/35 blur-2xl" />
          <div className="animate-drift-c absolute left-[58vw] top-[6vh] h-[28rem] w-[28rem] rounded-full bg-blush-100/90 blur-2xl" />
          <div className="animate-drift-b absolute -bottom-56 left-[30vw] h-[34rem] w-[34rem] rounded-full bg-blush-400/30 blur-2xl [animation-delay:-14s]" />
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
      <Nav onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {/*
       * `key={pathname}` fuerza a este div a remontar en cada navegación, así
       * el fade vuelve a correr en vez de quedar consumido desde la primera
       * carga. Es la transición entre rutas: sin esto, cambiar de página es
       * un corte seco en lugar de un fundido.
       *
       * Solo `animate-fade-in`, no `-up`: este wrapper cubre el ancho
       * completo (envuelve el `<main>` angosto de cada página), así que un
       * `transform` acá crea un stacking context de página entera y tapa el
       * fondo ambiental de arriba. Ver el comentario en index.css.
       */}
      <div key={pathname} className="animate-fade-in motion-reduce:animate-none">
        <Outlet />
      </div>
      {!isHome && <Footer />}
    </div>
  )
}
