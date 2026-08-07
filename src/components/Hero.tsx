import type { ReactElement } from 'react'
import {
  FRONT_VIDEO,
  FRONT_VIDEO_MOBILE,
  FRONT_VIDEO_MOBILE_POSTER,
  FRONT_VIDEO_POSTER,
} from '../lib/constants'
import type { SelloIcono } from '../data/marca'
import { SELLOS_HERO } from '../data/marca'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { LoopVideo } from './LoopVideo'
import { WhatsAppCTA } from './WhatsAppCTA'

interface IconProps {
  className?: string
}

function SparkleIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5c.4 3.6 1.2 6 2.6 7.4 1.4 1.4 3.8 2.2 7.4 2.6-3.6.4-6 1.2-7.4 2.6-1.4 1.4-2.2 3.8-2.6 7.4-.4-3.6-1.2-6-2.6-7.4-1.4-1.4-3.8-2.2-7.4-2.6 3.6-.4 6-1.2 7.4-2.6 1.4-1.4 2.2-3.8 2.6-7.4Z" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/*
 * Glifos de los micro-sellos, uno por clave de SELLOS_HERO (ver marca.ts).
 *
 * Van como SVG y no como los emojis del pedido (❄️ ⭐️ ✨ 🛡️) por dos motivos
 * concretos, no por gusto: un emoji lo dibuja el sistema operativo, así que el
 * mismo copo se ve plano en Android, azul en Windows y celeste en iOS — o sea,
 * cuatro acentos de color que la paleta blush no eligió; y el lector de
 * pantalla los lee en voz alta ("copo de nieve") delante de cada etiqueta.
 * Estos heredan `currentColor`, se ven igual en todos lados y van
 * `aria-hidden` con el claim completo como texto accesible.
 */
const SELLO_ICONS: Record<SelloIcono, (props: IconProps) => ReactElement> = {
  // Copo: la punta de zafiro enfría.
  frio: ({ className = 'h-3.5 w-3.5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2v20M12 2v20M3.4 7l17.2 10M3.4 17 20.6 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 5.6 9.9 3.6M12 5.6l2.1-2M12 18.4l-2.1 2M12 18.4l2.1 2M5.9 8.6 3.2 9.1M5.9 15.4l-2.7-.5M18.1 8.6l2.7.5M18.1 15.4l2.7-.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  // Estrella: los años de experiencia.
  experiencia: ({ className = 'h-3.5 w-3.5' }) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
    </svg>
  ),
  // Destello: el resultado desde la primera sesión.
  resultado: ({ className = 'h-3.5 w-3.5' }) => <SparkleIcon className={className} />,
  // Escudo con check: quién te atiende.
  certificadas: ({ className = 'h-3.5 w-3.5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.2l6.8 2.5v5.5c0 4.3-2.8 7.7-6.8 9.6-4-1.9-6.8-5.3-6.8-9.6V5.7L12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8.9 12.1l2.1 2.1 4.1-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

interface SellosProps {
  /**
   * true en celular: las 4 pastillas van en un riel horizontal de una sola
   * fila. false en escritorio: se acomodan con flex-wrap.
   */
  riel?: boolean
}

/*
 * Los 4 micro-sellos debajo del CTA (ver SELLOS_HERO en data/marca.ts), como
 * pastillas de vidrio con ícono.
 *
 * Antes eran una grilla de dos columnas de texto con checks; el problema no
 * era la información sino la forma: cuatro frases largas debajo del botón se
 * leen como un párrafo más, justo donde hace falta que se escaneen en un
 * segundo. Como pastilla cada sello tiene contorno propio, así que el ojo
 * cuenta cuatro objetos en vez de leer cuatro renglones.
 *
 * Sigue siendo una <ul> real y no cuatro <span> sueltos: para un lector de
 * pantalla la lista anuncia "4 elementos" y se recorre como tal. El texto
 * visible es la etiqueta corta, y el claim completo viaja en el `sr-only` +
 * `title` de cada pastilla — lo que se acortó para que entre, no se perdió.
 *
 * En celular van en riel horizontal en vez de wrappear: en un teléfono chico
 * dos filas de pastillas empujan el CTA fuera del viewport, que es justo lo
 * que este bloque no puede hacer. El asomo de la cuarta pastilla en el borde
 * derecho es lo que comunica que hay más (mismo recurso que el resto de los
 * rieles del sitio, ver `.no-scrollbar` en index.css).
 *
 * Una sola variante de color (vidrio claro sobre fondo oscuro) desde que el
 * hero de escritorio también lleva velo: antes existía una versión de pastilla
 * blanca opaca para el texto oscuro que había ahí, y con el velo puesto ya no
 * la usa nadie.
 */
function SellosConfianza({ riel = false }: SellosProps) {
  return (
    <ul
      className={
        riel
          ? // -mx-5/px-5 replican el padding del contenedor para que la primera
            // pastilla arranque alineada con el texto y la última pueda salir
            // por el borde de la pantalla.
            'no-scrollbar -mx-5 mt-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1'
          : 'mt-5 flex flex-wrap gap-2'
      }
    >
      {SELLOS_HERO.map((sello) => {
        const Icon = SELLO_ICONS[sello.icono]
        return (
          <li
            key={sello.icono}
            title={sello.detalle}
            className="flex shrink-0 snap-start items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-[11px] font-medium leading-none text-white/90 backdrop-blur-md sm:text-xs"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-blush-200" />
            <span className="whitespace-nowrap">{sello.texto}</span>
            <span className="sr-only">— {sello.detalle}</span>
          </li>
        )
      })}
    </ul>
  )
}

interface ScrollHintProps {
  tone: 'light' | 'dark'
}

/*
 * Ahora que debajo del hero hay una página entera (Beneficios, Precios,
 * Reseñas, Agendar — ver Home.tsx), este es el empujón visual de que hay más
 * abajo: sin él, un hero a pantalla completa se sigue leyendo como "eso es
 * todo" aunque técnicamente haya scroll. Ancla a `#beneficios`, el primer
 * bloque debajo del hero.
 */
function ScrollHint({ tone }: ScrollHintProps) {
  const color = tone === 'light' ? 'text-white/70 hover:text-white' : 'text-blush-500 hover:text-blush-700'
  return (
    <a
      href="#beneficios"
      aria-label="Ver más"
      className={`absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors motion-reduce:animate-none ${color}`}
    >
      Desliza
      <ChevronDownIcon className="h-4 w-4 motion-safe:animate-bounce" />
    </a>
  )
}

const HERO_CTA_CONTEXT = {
  sku: 'home-hero',
  nombre: 'sus servicios',
  categoria: 'general',
  placement: 'hero',
} as const

/*
 * El par de CTAs del hero, idéntico en las dos composiciones.
 *
 * El principal es blanco sólido sobre el velo oscuro (ver el scrim de cada
 * hero): es el contraste más alto que se puede conseguir contra un video, y
 * "AGENDA TU CITA" en mayúsculas con tracking le da el peso de acción que no
 * tenía como frase en minúsculas.
 *
 * El secundario es un contorno y no un segundo botón lleno: existe para quien
 * todavía no sabe qué tratamiento quiere —lo manda a la grilla de servicios en
 * la misma página, sin salir del embudo— pero no puede competir por el clic con
 * el que abre WhatsApp.
 *
 * Y aparece solo desde `sm`, o sea solo en el hero de escritorio (los dos heros
 * se intercambian justo en ese breakpoint, ver Hero): en el hero de celular
 * todo está apoyado abajo dentro de un `h-dvh`, y un segundo botón de 3.5rem
 * empuja los micro-sellos fuera de la pantalla en un teléfono corto. El destino
 * no se pierde — es la misma sección a la que baja el "Desliza".
 */
function HeroCtas({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${className}`}>
      <WhatsAppCTA
        className="w-full justify-center bg-white! py-4! pr-2! text-[0.8125rem]! font-semibold! uppercase! tracking-[0.12em]! text-blush-900! shadow-[0_18px_45px_-18px_rgba(255,255,255,0.55)]! hover:bg-blush-50! sm:w-auto sm:py-3.5!"
        context={HERO_CTA_CONTEXT}
      >
        Agenda tu cita
        <span className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-blush-200 bg-blush-50 text-blush-900">
          <ArrowUpRightIcon />
        </span>
      </WhatsAppCTA>

      <a
        href="#precios"
        className="hidden w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-md transition-all duration-200 hover:border-white/70 hover:bg-white/20 sm:inline-flex sm:w-auto"
      >
        Ver tratamientos
      </a>
    </div>
  )
}

/*
 * El hero no se adapta con breakpoints sino con dos composiciones distintas:
 * en escritorio el video horizontal es fondo y el texto flota encima a la
 * izquierda; en celular esa misma información no cabe superpuesta sin
 * amontonarse, así que se reordena por prioridad. Ver HeroMobile para el
 * detalle.
 *
 * Es un swap de componente y no CSS porque los dos montan un <video> distinto
 * y con ambos en el DOM el navegador descargaría los dos (ver useMediaQuery).
 *
 * El hero trae eyebrow + título + subtítulo + 1 CTA + los 4 micro-sellos que
 * van pegados debajo del botón (ver SellosConfianza). Nada más: precios,
 * pasos, sucursales y reseñas viven más abajo en sus propias secciones (ver
 * Home.tsx), con su propio espacio para respirar.
 *
 * Los sellos son la excepción a esa regla y entraron a pedido explícito
 * (05/ago/26): son las cuatro objeciones que se contestan antes de decidir si
 * vale la pena scrollear, así que llegan tarde si esperan a una sección. Van
 * como pastillas chicas con ícono (ver SellosConfianza) — tienen que
 * escanearse como cuatro objetos al pie del CTA, no competir con el h1.
 */
export function Hero() {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  return isDesktop ? <HeroDesktop /> : <HeroMobile />
}

/* ------------------------------------------------------------------ mobile */

/*
 * Composición vertical, pensada para el recorte 9:16 de hero-mobile.mp4 (el
 * video ya viene encuadrado para pantalla alta, así que va a sangre con
 * object-cover y no pierde nada del encuadre).
 *
 * Una sola pantalla: video completo + solo la ruta corta al CTA, apoyada
 * abajo para no tapar el sujeto del video: eyebrow → título → subtítulo →
 * botón. El resto del embudo (beneficios, precios, reseñas, agendar) vive en
 * sus propias secciones debajo, fuera de este viewport.
 *
 * `liquid-glass` en la section (ver index.css) le pone el mismo marco de
 * vidrio blanco que el resto de los videos del sitio, pegado al borde de la
 * pantalla ya que este hero es a sangre completa (sin tarjeta ni márgenes).
 */
function HeroMobile() {
  return (
    <section className="liquid-glass relative flex h-dvh flex-col justify-end overflow-hidden bg-black">
      <LoopVideo
        className="absolute inset-0 h-full w-full object-cover"
        src={FRONT_VIDEO_MOBILE}
        poster={FRONT_VIDEO_MOBILE_POSTER}
      />

      {/*
       * Velo que sube de transparente a casi negro. Arranca en 0 a propósito:
       * el nav es `glass-light` (pastilla blanca, texto oscuro) y necesita el
       * video claro detrás para leerse; oscurecer arriba lo dejaría flotando
       * sin contraste. El tramo fuerte empieza recién donde arranca el texto.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.65)_100%)]"
      />

      {/* pb-24: deja libre la esquina del botón flotante de WhatsApp */}
      <div className="relative z-10 animate-slide-in-left px-5 pb-24 motion-reduce:animate-none">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-blush-200">
          <SparkleIcon className="h-3 w-3" />
          Piel suave, confianza real
        </span>

        {/* Mismo degradado de marca que el escritorio, invertido para fondo
            oscuro (blanco → blush en vez de blush-900 → blush-300).

            La localidad va en una línea propia y más chica (0.55em) en vez de
            en el mismo cuerpo: "EN CDMX Y METEPEC" a 2.6rem no entra en el
            ancho de un teléfono, y bajarle el tamaño a todo el h1 para que
            entrara le sacaba presencia a lo que de verdad se vende. Sigue
            siendo texto del <h1>, así que para Google el título es la frase
            completa. */}
        <h1 className="heading-1 mt-3 bg-gradient-to-b from-white to-blush-200 bg-clip-text text-[2.6rem] leading-[0.92] text-transparent xs:text-[3rem]">
          Depilación
          <br />
          láser diodo
          <span className="mt-1.5 block text-[0.5em] leading-tight tracking-[0.08em]">en CDMX y Metepec</span>
        </h1>

        <p className="mt-3.5 max-w-[19rem] text-[0.9375rem] leading-relaxed text-white/75">
          Resultados <strong className="font-medium text-white">visibles</strong> desde la primera sesión, con la
          comodidad de la punta de zafiro
        </p>

        <HeroCtas className="mt-6" />

        <SellosConfianza riel />
      </div>

      <ScrollHint tone="light" />
    </section>
  )
}

/* --------------------------------------------------------------- escritorio */

/*
 * Hero de escritorio: el video horizontal (public/videos/hero.mp4 — la escena
 * de la ventana en arco) ocupa la pantalla completa y solo la columna de
 * texto flota encima, a la izquierda. Los pasos y la foto de la especialista
 * viven en la sección de Beneficios (ver Home.tsx): acá solo queda lo que
 * sostiene la decisión de un solo vistazo, micro-sellos incluidos.
 *
 * `liquid-glass` acá igual que en HeroMobile: mismo marco de vidrio que el
 * resto de los videos del sitio (ver VideoAccent), pegado al borde de la
 * pantalla porque este hero también es a sangre completa.
 *
 * CONTRASTE (05/ago/26): la columna de texto pasó de gris oscuro sobre el video
 * a blanco sobre un velo. El texto oscuro dependía de que el video estuviera
 * claro justo detrás de esas seis líneas, y el video se mueve: en los frames en
 * que la escena baja de brillo, el subtítulo gris quedaba flotando sin
 * contraste. El velo lateral fija el fondo de la columna sin tapar el video
 * —del 60% para la derecha es transparente y la escena se ve entera— y de paso
 * es lo que le da al hero el contraste duro de referencia en vez de la lavada
 * de un texto pastel sobre una foto pastel.
 */
function HeroDesktop() {
  return (
    <section className="liquid-glass relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <LoopVideo className="h-full w-full object-cover" src={FRONT_VIDEO} poster={FRONT_VIDEO_POSTER} />
      </div>

      {/* Velo de izquierda a derecha: sólido detrás de la columna de texto,
          transparente en el tercio derecho donde está el sujeto del video. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(15,10,11,0.82)_0%,rgba(15,10,11,0.62)_32%,rgba(15,10,11,0.2)_58%,transparent_78%)]"
      />

      <div className="absolute inset-x-10 inset-y-0 z-20 flex items-center lg:inset-x-16">
        {/* max-w-md y no max-w-sm: las pastillas de abajo wrappean, y a 24rem
            de ancho las cuatro caían en tres filas desparejas. */}
        <div className="max-w-xl animate-slide-in-left motion-reduce:animate-none">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-blush-200">
            <SparkleIcon />
            Piel suave, confianza real
          </span>

          {/* Ver la nota del h1 de HeroMobile: la localidad en línea propia y
              más chica, dentro del mismo <h1>. El degradado va invertido
              (blanco → blush) igual que en mobile, ahora que el fondo es
              oscuro. */}
          <h1 className="heading-1 mt-4 bg-gradient-to-b from-white to-blush-200 bg-clip-text text-[2.75rem] leading-[0.95] text-transparent drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] lg:text-[3.5rem]">
            Depilación
            <br />
            láser diodo
            <span className="mt-2 block text-[0.5em] leading-tight tracking-[0.08em]">en CDMX y Metepec</span>
          </h1>

          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/75">
            Resultados <strong className="font-medium text-white">visibles</strong> desde la primera sesión, con la
            comodidad de la punta de zafiro
          </p>

          <HeroCtas className="mt-8" />

          <SellosConfianza />
        </div>
      </div>

      <ScrollHint tone="light" />
    </section>
  )
}
