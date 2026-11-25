import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { useMetaPixel } from '../hooks/useMetaPixel'
import { AnnouncementBar, ANUNCIO_ALTO, useAnuncio } from './AnnouncementBar'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { Nav } from './Nav'
import { WhatsAppFloating } from './WhatsAppCTA'

const EASE = [0.22, 1, 0.36, 1] as const

/*
 * Transición entre rutas: un fundido corto del contenido, nada más. Antes había
 * una cortina de vidrio que cubría la pantalla; se quitó en el rediseño
 * (nov/26) porque era decoración que no ayudaba a nadie a cotizar.
 */
const CONTENT_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: EASE } },
}

// Sin movimiento: el contenido aparece tal cual — nada
// que respete prefers-reduced-motion mejor que no animar nada.
const REDUCED_VARIANTS = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
}

export function Layout() {
  const { pathname, hash, key } = useLocation()
  // `useOutlet` en vez de <Outlet /> directo: AnimatePresence necesita tener
  // el elemento de la ruta como children para poder animar su salida antes
  // de que React Router lo desmonte — con <Outlet /> el intercambio ya pasó
  // y no hay nada que animar.
  const element = useOutlet()
  const shouldReduceMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const anuncio = useAnuncio()

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
  // internas abren a media altura. Con ancla (/#ubicaciones) baja a esa
  // sección; se reintenta unos cuadros porque viniendo de otra página el home
  // todavía no está montado (la transición de ruta lo retrasa). Depende de
  // `key` para que volver a tocar "Ubicaciones" estando en el home también baje.
  useEffect(() => {
    const id = hash.slice(1)
    if (!id) {
      window.scrollTo(0, 0)
      return
    }
    let frame = 0
    let intentos = 0
    const buscar = () => {
      const destino = document.getElementById(decodeURIComponent(id))
      if (destino) {
        destino.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' })
      } else if (intentos++ < 60) {
        frame = requestAnimationFrame(buscar)
      }
    }
    frame = requestAnimationFrame(buscar)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash, key])

  // El menú abierto sobrevive a la navegación si no se cierra a mano.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div
      /*
       * `isolate` (no solo `relative`): sin un stacking context propio acá,
       * el `-z-10` del fondo ambiental de abajo escapa a compararse contra el
       * documento entero en vez de contra este div, y termina pintado detrás
       * del propio fondo de <body> — invisible en toda la página, no solo
       * "sutil". `isolate` lo contiene donde corresponde: encima del
       * gradiente de este div, debajo de su contenido real.
       */
      className="relative isolate min-h-screen w-full bg-paper"
      /*
       * Alto real del cintillo de anuncios, publicado como variable para que el
       * nav (que también es fijo) se corra justo eso y no quede tapado. Es la
       * única fuente del número: si el cintillo cambia de alto se edita
       * ANUNCIO_ALTO y el nav lo sigue solo. En 0 cuando está cerrado, y ahí el
       * nav vuelve exactamente a donde estaba.
       */
      style={{ '--anuncio-h': anuncio.visible ? ANUNCIO_ALTO : '0px' } as CSSProperties}
    >
      {anuncio.visible && <AnnouncementBar onClose={anuncio.cerrar} />}

      <Nav onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/*
       * `mode="wait"`: la página anterior termina de salir antes de que la
       * nueva entre, así nunca hay dos a la vez. `initial={false}` deja quieta
       * la primera carga: el contenido prerenderizado ya está visible y no
       * tiene que volver a aparecer.
       */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={shouldReduceMotion ? REDUCED_VARIANTS : CONTENT_VARIANTS}
        >
          {element}
        </motion.div>
      </AnimatePresence>
      <Footer />
      <WhatsAppFloating />
    </div>
  )
}
