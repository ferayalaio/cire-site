import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { useMetaPixel } from '../hooks/useMetaPixel'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { Nav } from './Nav'
import { WhatsAppFloating } from './WhatsAppCTA'

const EASE = [0.22, 1, 0.36, 1] as const

/*
 * Contenido y cortina son dos `motion.div` ANIDADOS dentro del mismo nodo con
 * key={pathname} (ver más abajo), no dos elementos con su propio ciclo de
 * vida independiente. Eso es lo que hacía que se vieran como un choque: la
 * cortina antes vivía en su propio `key`, así que se abría en su propio
 * reloj (0.5s desde que cambiaba el pathname) sin ninguna relación con
 * cuándo AnimatePresence realmente terminaba de sacar la página vieja y
 * meter la nueva. Acá ninguno de los dos define `initial`/`animate`/`exit`
 * por su cuenta: heredan el estado ("initial" | "animate" | "exit") del
 * `motion.div` padre y cada uno lo resuelve contra su propio mapa de
 * variantes — así quedan atados al mismo AnimatePresence y no pueden
 * desincronizarse.
 *
 * Orden pensado para que nunca se vean los dos moviéndose "en contra":
 * al SALIR, la cortina cae (scaleY 0→1) mientras el contenido viejo se
 * apaga por debajo — no importa que se traslapen, ya queda tapado. Al
 * ENTRAR, la cortina ya arranca cubriendo del todo (mismo estado en el que
 * terminó de caer) y se queda así un instante (`delay`) antes de subir; el
 * contenido nuevo no empieza a aparecer hasta que la cortina ya lleva buena
 * parte de esa subida, así nunca se ve "aparecer" sobre una pantalla todavía
 * tapada ni "chocar" con ella a mitad de camino.
 */
const CONTENT_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE, delay: 0.16 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.16, ease: EASE } },
}

const CURTAIN_VARIANTS = {
  initial: { scaleY: 1 },
  animate: { scaleY: 0, transition: { duration: 0.24, ease: EASE, delay: 0.08 } },
  exit: { scaleY: 1, transition: { duration: 0.2, ease: EASE } },
}

// Sin movimiento: solo el contenido, sin cortina y sin desplazamiento — nada
// que respete prefers-reduced-motion mejor que no animar nada.
const REDUCED_VARIANTS = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
}

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
  // `useOutlet` en vez de <Outlet /> directo: AnimatePresence necesita tener
  // el elemento de la ruta como children para poder animar su salida antes
  // de que React Router lo desmonte — con <Outlet /> el intercambio ya pasó
  // y no hay nada que animar.
  const element = useOutlet()
  const shouldReduceMotion = useReducedMotion()
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
          ? /*
             * `h-dvh`, no `h-screen`: en mobile `100vh` no descuenta la barra
             * de direcciones del navegador.
             *
             * En celular el home dejó de ser una sola pantalla fija: el hero
             * ocupa el viewport completo y debajo va la sección con los sellos
             * de confianza y los pasos (ver HeroMobile), así que necesita
             * scroll — de ahí `min-h-dvh` sin `overflow-hidden`. Desde sm
             * vuelve a ser hero a pantalla completa y clavado.
             */
            'min-h-dvh w-full bg-white sm:h-dvh sm:overflow-hidden'
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
       * `mode="wait"`: la página anterior termina de salir del todo (cortina +
       * fade-out) antes de que la nueva arranque a entrar — nunca hay dos
       * animándose a la vez. `initial={false}` deja quieta la primera carga:
       * el hero y PageShell ya tienen su propia entrada, no hace falta
       * duplicarla acá.
       *
       * El wrapper con key={pathname} no anima nada por sí mismo (no tiene
       * `variants`): solo declara el estado ("initial"/"animate"/"exit") que
       * sus dos hijos —cortina y contenido— heredan y resuelven cada uno
       * contra su propio mapa de variantes. Por eso quedan sincronizados en
       * vez de correr en relojes separados.
       */}
      <AnimatePresence mode="wait" initial={false}>
        {/*
         * `initial`/`animate`/`exit` van repetidos como string en CADA
         * motion.div (no solo en el de más afuera): AnimatePresence recorre
         * el árbol buscando los nodos que declaran su propio `exit` para
         * saber cuánto esperar antes de desmontar. Confirmado con logs de
         * `onAnimationComplete`: content y cortina resuelven cada uno su
         * propio mapa de variantes contra este mismo estado, no corren en
         * relojes separados.
         */}
        <motion.div key={pathname} initial="initial" animate="animate" exit="exit">
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              className="route-curtain pointer-events-none fixed inset-0 z-[70]"
              style={{ transformOrigin: 'top' }}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={CURTAIN_VARIANTS}
            />
          )}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={shouldReduceMotion ? REDUCED_VARIANTS : CONTENT_VARIANTS}
          >
            {element}
          </motion.div>
        </motion.div>
      </AnimatePresence>
      {!isHome && <Footer />}
      <WhatsAppFloating />
    </div>
  )
}
