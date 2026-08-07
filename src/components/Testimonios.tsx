import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { Testimonio } from '../data/sucursales'
import { GOOGLE_REVIEWS } from '../data/marca'
import { SectionHeading } from './PageShell'
import { Reveal, Stagger } from './Reveal'

interface TestimoniosSectionProps {
  testimonios: Testimonio[]
  titulo?: string
  /**
   * Muestra las reseñas como carrusel deslizable en vez de grilla (ver
   * `Carrusel`). Opt-in y solo lo pide el home: es la página que se rediseñó
   * como landing y donde las reseñas son un bloque de prueba social que se
   * recorre. Las páginas de servicio llevan 1 a 3 reseñas y ahí la grilla las
   * muestra todas de una — un carrusel sería agregar controles para navegar
   * contenido que ya está a la vista.
   */
  carrusel?: boolean
}

/*
 * Fallback para el puñado de reseñas cuya cuenta de Google no tiene foto de
 * perfil (Google les pone su propio ícono de inicial-en-círculo). Cuando el
 * testimonio trae `avatarSrc` se usa la foto real recortada de la reseña.
 */
const AVATAR_TONES = [
  'bg-blush-100 text-blush-600',
  'bg-blush-200 text-blush-700',
  'bg-blush-300 text-blush-900',
  'bg-blush-400 text-blush-900',
]

function avatarTono(autor: string): string {
  let hash = 0
  for (let i = 0; i < autor.length; i++) hash = (hash * 31 + autor.charCodeAt(i)) % AVATAR_TONES.length
  return AVATAR_TONES[hash]
}

/*
 * Todas las reseñas curadas en src/data/testimonios.ts y sucursales.ts son de
 * 5 estrellas — no hay campo `estrellas` porque no hay ningún caso real de
 * otro valor todavía.
 *
 * El `drop-shadow` dorado no es decorado gratuito: contra el blanco de la
 * tarjeta un ámbar plano se lee apagado, y las estrellas son lo primero que
 * escanea el ojo en un bloque de reseñas — tienen que saltar antes que el
 * texto.
 */
function Estrellas({ className = 'h-4.5 w-4.5' }: { className?: string }) {
  return (
    <div
      aria-label="5 de 5 estrellas"
      role="img"
      className="flex gap-0.5 text-amber-400 drop-shadow-[0_1px_3px_rgba(245,158,11,0.45)]"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
        </svg>
      ))}
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.56-5.15 3.56-8.79Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.87-3c-1.07.72-2.45 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l3.99 3.09C6.22 6.87 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}

/*
 * Insignia de origen. Las reseñas son capturas reales de Google (ver la nota
 * de src/data/testimonios.ts), y decirlo con el logo de Google al lado es lo
 * que separa "una cita elegida por la marca" de "una reseña pública que
 * cualquiera puede ir a verificar" — que es todo el valor que tiene la prueba
 * social en una decisión como esta.
 *
 * El promedio (GOOGLE_REVIEWS.promedio) está PENDIENTE DE VERIFICAR contra el
 * perfil real de Google Business; ver la nota en data/marca.ts antes de
 * publicar.
 */
function InsigniaGoogle() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
      <GoogleGlyph />
      {GOOGLE_REVIEWS.insignia}
    </span>
  )
}

interface CitaProps {
  texto: string
  /** true cuando la tarjeta ocupa el ancho completo (una sola reseña). */
  ancha: boolean
}

/*
 * El texto de la reseña, recortado a 3 líneas cuando no entra.
 *
 * Las reseñas reales de Google vienen de largo muy dispar (de 97 a 399
 * caracteres, ver testimonios.ts): al lado de una de dos renglones, una de
 * diez desbalancea la grilla y convierte la sección en un muro. Recortadas
 * todas a la misma altura la sección se escanea de un vistazo, y quien quiera
 * leer una entera la abre.
 *
 * `line-clamp-3` y no una altura fija con degradado encima: el recorte cae
 * siempre en un borde de línea, se adapta solo si cambia el cuerpo de la
 * tipografía y no deja media línea fantasma asomando bajo el velo. El
 * degradado queda igual como pista visual sobre la tercera línea.
 *
 * Si hay texto oculto se decide MIDIENDO el nodo, no por un umbral de
 * caracteres. El umbral parece más barato y no funciona: la misma reseña de
 * 188 caracteres ocupa 6 líneas en un teléfono y 3 en la tarjeta ancha de
 * escritorio, así que cualquier número que se elija es correcto en un ancho y
 * está mal en el otro — y equivocarse significa un "Leer más" que no revela
 * nada, o una reseña recortada sin forma de abrirla.
 *
 * El botón es un <button> real con `aria-expanded` y no un enlace: no navega a
 * ningún lado, y así el lector de pantalla anuncia el estado en vez de
 * prometer una página que no existe.
 */
function Cita({ texto, ancha }: CitaProps) {
  const [abierto, setAbierto] = useState(false)
  const [recortable, setRecortable] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const id = useId()

  /*
   * `useLayoutEffect` y no `useEffect`: la medición corre antes del paint, así
   * que el "Leer más" ya está en su lugar en el primer cuadro en vez de
   * aparecer un instante después y empujar la tarjeta.
   *
   * Solo se mide con el clamp puesto (`!abierto`): abierta, el párrafo no
   * desborda por definición y volver a medir apagaría el botón que acaba de
   * usarse. Mientras está abierta se conserva el último valor medido.
   *
   * Los dos disparadores extra no son decorativos: el ResizeObserver cubre el
   * giro del teléfono y el salto a la grilla de 2 y 3 columnas, y `fonts.ready`
   * cubre que Inter llega después del primer render — con la fuente de
   * sistema el mismo texto puede entrar en 3 líneas y desbordar al cambiar.
   */
  useLayoutEffect(() => {
    const node = ref.current
    if (!node || abierto) return

    // `vivo` frena la medición diferida de `fonts.ready`: esa promesa puede
    // resolver después de que la tarjeta se desmontó (al cambiar de ruta) y
    // ahí ya no hay nodo que valga la pena medir.
    let vivo = true
    const medir = () => {
      if (vivo) setRecortable(node.scrollHeight - node.clientHeight > 1)
    }
    medir()

    const observer = new ResizeObserver(medir)
    observer.observe(node)
    document.fonts?.ready.then(medir)

    return () => {
      vivo = false
      observer.disconnect()
    }
  }, [texto, abierto])

  return (
    <div className={`mt-4 ${ancha ? 'max-w-2xl' : ''}`}>
      <blockquote className="relative text-neutral-600">
        <p ref={ref} id={id} className={`leading-relaxed ${abierto ? '' : 'line-clamp-3'}`}>
          {texto}
        </p>

        {/* El velo solo existe mientras hay texto oculto debajo; con la
            reseña abierta desaparece para no ensuciar la última línea.

            Alto de media línea y con parada intermedia: a la altura de una
            línea completa y sin `via`, el blanco se come la tercera línea
            entera y lo que queda es una reseña de dos líneas con una mancha
            debajo. Así el texto se lee hasta el final y solo el pie de la
            línea se desvanece — que es la pista de que sigue. */}
        {recortable && !abierto && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3.5 bg-linear-to-t from-white via-white/70 to-transparent"
          />
        )}
      </blockquote>

      {recortable && (
        <button
          type="button"
          onClick={() => setAbierto((previo) => !previo)}
          aria-expanded={abierto}
          aria-controls={id}
          className="mt-2 text-xs font-medium text-blush-600 underline-offset-4 transition-colors hover:text-blush-900 hover:underline"
        >
          {abierto ? 'Leer menos' : 'Leer más'}
        </button>
      )}
    </div>
  )
}

/*
 * Tarjeta estilo reseña de Google, en el orden en que se escanea una:
 * estrellas → foto/inicial + nombre + sucursal → texto → insignia de origen.
 * Nada de la cita decorativa que había antes.
 *
 * La sucursal pasó de renglón gris debajo del nombre a pastilla blush: es el
 * dato que conecta la reseña con "la sucursal a la que yo iría", y como texto
 * chico gris quedaba al mismo nivel visual que el resto de los metadatos.
 */
function TarjetaTestimonio({ testimonio, ancha }: { testimonio: Testimonio; ancha: boolean }) {
  return (
    <figure
      className={`flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:border-blush-200 hover:shadow-[0_25px_50px_-30px_rgba(166,94,109,0.5)] ${
        ancha ? 'p-8 sm:p-10' : 'p-6'
      }`}
    >
      {/* Las estrellas van arriba de todo, antes del nombre: es lo que
          se lee de un vistazo al escanear la sección, y abajo del texto
          (donde estaban) llegaban después de la decisión de leer o no. */}
      <Estrellas className={ancha ? 'h-5 w-5' : 'h-4.5 w-4.5'} />

      <div className="mt-3 flex items-center gap-3">
        {testimonio.avatarSrc ? (
          <img
            src={testimonio.avatarSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-blush-100"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-blush-100 ${avatarTono(testimonio.autor)}`}
          >
            {testimonio.autor.charAt(0).toUpperCase()}
          </span>
        )}
        <figcaption className="min-w-0">
          <p className="truncate font-medium text-neutral-900">{testimonio.autor}</p>
          {testimonio.sucursal && (
            <span className="mt-1 inline-flex items-center rounded-full bg-blush-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-blush-600">
              {testimonio.sucursal}
            </span>
          )}
        </figcaption>
      </div>

      <Cita texto={testimonio.texto} ancha={ancha} />

      {/* `mt-auto`: con la tarjeta estirada a la altura de la fila, la
          insignia se apoya abajo y queda a la misma altura en las tres
          en vez de flotar detrás de una reseña más corta. */}
      <div className="mt-auto pt-4">
        <InsigniaGoogle />
      </div>
    </figure>
  )
}

function ChevronIcon({ direccion }: { direccion: 'anterior' | 'siguiente' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d={direccion === 'anterior' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/*
 * ---------------------------------------------------------------------------
 * CARRUSEL (05/ago/26)
 * ---------------------------------------------------------------------------
 * Antes las reseñas eran una grilla de hasta 3 columnas que crecía hacia abajo:
 * con nueve reseñas en el home eso son tres filas de tarjetas, o sea un muro de
 * texto en el medio del scroll. Como carrusel ocupan una fila y se recorren a
 * voluntad, que además es cómo se leen las reseñas — de a una, no comparándolas.
 *
 * El riel es un contenedor con `overflow-x: auto` + scroll-snap, NO un
 * `transform: translateX` calculado en JS. Con scroll nativo el gesto táctil, el
 * trackpad, la rueda horizontal y el foco de teclado funcionan sin escribir una
 * línea: cuando el navegador enfoca un "Leer más" fuera de vista, hace scroll
 * hasta él solo. Las flechas y los puntos son atajos sobre ese mismo scroll,
 * no un segundo mecanismo en paralelo — por eso el índice se lee siempre del
 * scroll real y no de un contador propio que se pueda desincronizar.
 */
/*
 * `scrollLeft` que deja a `hijo` pegado al borde izquierdo del riel.
 *
 * Es la diferencia de `offsetLeft` contra la PRIMERA tarjeta, no el
 * `offsetLeft` crudo, y eso importa: `offsetLeft` se mide contra el ancestro
 * posicionado más cercano (que acá es la <section> de Section.tsx, que es
 * `relative`) y además incluye el padding del riel. Los dos son desplazamientos
 * constantes que se cancelan solos al restar, así que la resta da la posición
 * dentro del scroll sin depender de qué ancestro esté posicionado ni de cuánto
 * padding tenga el riel en cada breakpoint.
 */
function posicionEnRiel(hijo: HTMLElement, primero: HTMLElement): number {
  return hijo.offsetLeft - primero.offsetLeft
}

function Carrusel({ testimonios }: { testimonios: Testimonio[] }) {
  const rielRef = useRef<HTMLDivElement>(null)
  const [indice, setIndice] = useState(0)
  const [alFinal, setAlFinal] = useState(false)

  /*
   * Índice = la tarjeta cuyo borde izquierdo está más cerca del borde
   * izquierdo del riel. Se recalcula del scroll real (en vez de contarse al
   * apretar una flecha) para que arrastrar con el dedo mueva los puntos igual
   * que las flechas.
   *
   * `alFinal` sale del mismo lugar y no de `indice === length - 1`: con tres
   * tarjetas por pantalla el riel toca el tope cuando la PRIMERA visible es la
   * antepenúltima, así que el último índice nunca se alcanza y la flecha de
   * "siguiente" quedaría habilitada sin poder mover nada. Los 4px de margen son
   * para el redondeo a subpíxel del scroll.
   */
  const sincronizar = useCallback(() => {
    const riel = rielRef.current
    if (!riel) return

    const hijos = Array.from(riel.children) as HTMLElement[]
    if (hijos.length === 0) return

    let mejor = 0
    let mejorDistancia = Infinity

    hijos.forEach((hijo, i) => {
      const distancia = Math.abs(posicionEnRiel(hijo, hijos[0]) - riel.scrollLeft)
      if (distancia < mejorDistancia) {
        mejorDistancia = distancia
        mejor = i
      }
    })

    setIndice(mejor)
    setAlFinal(riel.scrollLeft >= riel.scrollWidth - riel.clientWidth - 4)
  }, [])

  useEffect(() => {
    const riel = rielRef.current
    if (!riel) return

    riel.addEventListener('scroll', sincronizar, { passive: true })
    // Un resize cambia cuántas tarjetas entran por pantalla y por lo tanto qué
    // tarjeta queda "primera" — sin esto los puntos apuntan a la anterior.
    window.addEventListener('resize', sincronizar)
    sincronizar()

    return () => {
      riel.removeEventListener('scroll', sincronizar)
      window.removeEventListener('resize', sincronizar)
    }
  }, [sincronizar])

  const irA = (destino: number) => {
    const riel = rielRef.current
    if (!riel) return

    const hijos = Array.from(riel.children) as HTMLElement[]
    const acotado = Math.max(0, Math.min(destino, hijos.length - 1))
    const hijo = hijos[acotado]
    if (!hijo) return

    riel.scrollTo({ left: posicionEnRiel(hijo, hijos[0]), behavior: 'smooth' })
  }

  /*
   * Las flechas se apagan en las puntas (ver `alFinal` arriba) en vez de dar
   * la vuelta: con el riel ya en el extremo, un "siguiente" que salta al
   * principio se siente como que la lista se reinició sola. `disabled` de
   * verdad y no solo opacidad, así el teclado tampoco se detiene en un control
   * que no hace nada.
   */
  return (
    <div className="mt-8">
      {/*
       * `-mx-6 px-6` cancela el padding de Section para que el riel llegue al
       * borde de la pantalla en celular y la primera tarjeta siga alineada con
       * el título. `py-2` deja lugar a la sombra del hover, que si no queda
       * cortada por el `overflow-x`.
       */}
      <div
        ref={rielRef}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-2 sm:mx-0 sm:px-0"
      >
        {testimonios.map((testimonio) => (
          <div
            key={testimonio.autor}
            /*
             * Dos tarjetas por pantalla en escritorio y no tres, con la
             * siguiente asomando por el borde: con tres visibles y tres reseñas
             * cargadas el riel no tiene a dónde moverse y el carrusel queda con
             * las flechas apagadas y tres puntos decorativos. A 46% siempre hay
             * un tramo real que deslizar, la tarjeta es más ancha (menos reseñas
             * recortadas a "Leer más") y el asomo de la siguiente es lo que
             * comunica que hay más sin depender de las flechas.
             */
            className="w-[85%] shrink-0 snap-start sm:w-[62%] lg:w-[46%]"
          >
            <TarjetaTestimonio testimonio={testimonio} ancha={false} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {/*
         * Los puntos son <button>: son el control para saltar a una reseña
         * concreta, no un adorno de posición. El `sr-only` de cada uno dice a
         * cuál lleva — "reseña 3 de 9" es útil, un punto sin nombre no.
         */}
        <div className="flex flex-wrap items-center gap-2">
          {testimonios.map((testimonio, i) => (
            <button
              key={testimonio.autor}
              type="button"
              onClick={() => irA(i)}
              aria-current={i === indice}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2 ${
                i === indice ? 'w-7 bg-blush-500' : 'w-2 bg-blush-200 hover:bg-blush-300'
              }`}
            >
              <span className="sr-only">
                Ver la reseña {i + 1} de {testimonios.length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => irA(indice - 1)}
            disabled={indice === 0}
            aria-label="Reseña anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 transition-colors hover:border-blush-300 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronIcon direccion="anterior" />
          </button>
          <button
            type="button"
            onClick={() => irA(indice + 1)}
            disabled={alFinal}
            aria-label="Reseña siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 transition-colors hover:border-blush-300 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronIcon direccion="siguiente" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function TestimoniosSection({ testimonios, titulo, carrusel }: TestimoniosSectionProps) {
  if (testimonios.length === 0) return null

  // Con una sola reseña (HIFU, Láser Bikini, Láser Zonas y Láser Cuerpo
  // Completo llevan solo 1, ver testimonios.ts), un carrusel de un elemento es
  // un riel con flechas apagadas y un punto: acá se estira a lo ancho, como
  // venía siendo.
  const esUnaSola = testimonios.length === 1

  // Con una sola reseña no hay nada que deslizar, así que la tarjeta ancha gana
  // incluso si la página pidió carrusel.
  const usarCarrusel = carrusel && !esUnaSola

  return (
    <div>
      <SectionHeading>{titulo ?? 'Lo que dicen nuestras clientas'}</SectionHeading>

      {/*
       * La calificación agregada va una sola vez arriba, no repetida en cada
       * tarjeta: el promedio es del negocio, no de la reseña, y repetirlo tres
       * veces lo hace leer como decoración en lugar de como un dato.
       */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Estrellas />
        <p className="text-sm text-neutral-500">
          <strong className="font-semibold text-neutral-900">
            {GOOGLE_REVIEWS.promedio}/{GOOGLE_REVIEWS.escala}
          </strong>{' '}
          en {GOOGLE_REVIEWS.fuente}
        </p>
      </div>

      {esUnaSola ? (
        <Reveal className="mt-8">
          <TarjetaTestimonio testimonio={testimonios[0]} ancha />
        </Reveal>
      ) : usarCarrusel ? (
        <Carrusel testimonios={testimonios} />
      ) : (
        /*
         * `[&>div]:h-full` + `h-full` en la tarjeta igualan la altura de la
         * fila. Con el texto recortado a 3 líneas las tarjetas ya quedaban
         * parejas salvo cuando un nombre largo se parte en dos renglones, y ahí
         * la fila se desalineaba justo después de haber ordenado todo lo demás.
         * El div intermedio es el que agrega Stagger para animar (ver
         * Reveal.tsx): es el ítem del grid, así que sin estirarlo a él la
         * tarjeta no tiene contra qué crecer.
         */
        <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>div]:h-full">
          {testimonios.map((testimonio) => (
            <TarjetaTestimonio key={testimonio.autor} testimonio={testimonio} ancha={false} />
          ))}
        </Stagger>
      )}
    </div>
  )
}
