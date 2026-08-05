import {
  FRONT_VIDEO,
  FRONT_VIDEO_MOBILE,
  FRONT_VIDEO_MOBILE_POSTER,
  FRONT_VIDEO_POSTER,
} from '../lib/constants'
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
 * El hero no se adapta con breakpoints sino con dos composiciones distintas:
 * en escritorio el video horizontal es fondo y el texto flota encima a la
 * izquierda; en celular esa misma información no cabe superpuesta sin
 * amontonarse, así que se reordena por prioridad. Ver HeroMobile para el
 * detalle.
 *
 * Es un swap de componente y no CSS porque los dos montan un <video> distinto
 * y con ambos en el DOM el navegador descargaría los dos (ver useMediaQuery).
 *
 * A propósito el hero solo trae eyebrow + título + subtítulo + 1 CTA: nada de
 * precios, pasos ni sellos de confianza acá — eso vive más abajo en sus
 * propias secciones (ver Home.tsx), con su propio espacio para respirar.
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
            oscuro (blanco → blush en vez de blush-900 → blush-300). */}
        <h1 className="heading-1 mt-3 bg-gradient-to-b from-white to-blush-200 bg-clip-text text-[2.6rem] leading-[0.92] text-transparent xs:text-[3rem]">
          Depilación
          <br />
          láser diodo
        </h1>

        <p className="mt-3.5 max-w-[19rem] text-[0.9375rem] leading-relaxed text-white/75">
          Resultados <strong className="font-medium text-white">visibles</strong> desde la primera sesión, con la
          comodidad de la punta de zafiro
        </p>

        <WhatsAppCTA
          className="mt-6 w-full bg-white! py-4! text-blush-900! shadow-[0_18px_40px_-20px_rgba(166,94,109,0.5)]! hover:bg-blush-50!"
          context={HERO_CTA_CONTEXT}
        >
          Reserva tu evaluación
          <span className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-blush-200 bg-blush-50 text-blush-900">
            <ArrowUpRightIcon />
          </span>
        </WhatsAppCTA>
      </div>

      <ScrollHint tone="light" />
    </section>
  )
}

/* --------------------------------------------------------------- escritorio */

/*
 * Hero de escritorio: el video horizontal (public/videos/hero.mp4 — la escena
 * de la ventana en arco) ocupa la pantalla completa y solo la columna de
 * texto flota encima, a la izquierda. Sellos de confianza, pasos y foto de la
 * especialista se movieron a la sección de Beneficios (ver Home.tsx): acá
 * solo queda lo que sostiene la decisión de un solo vistazo.
 *
 * `liquid-glass` acá igual que en HeroMobile: mismo marco de vidrio que el
 * resto de los videos del sitio (ver VideoAccent), pegado al borde de la
 * pantalla porque este hero también es a sangre completa.
 */
function HeroDesktop() {
  return (
    <section className="liquid-glass relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <LoopVideo className="h-full w-full object-cover" src={FRONT_VIDEO} poster={FRONT_VIDEO_POSTER} />
      </div>

      <div className="absolute inset-x-10 inset-y-0 z-20 flex items-center lg:inset-x-16">
        <div className="max-w-sm animate-slide-in-left motion-reduce:animate-none">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-blush-500">
            <SparkleIcon />
            Piel suave, confianza real
          </span>

          <h1 className="heading-1 mt-4 bg-gradient-to-b from-blush-900 to-blush-300 bg-clip-text text-[2.75rem] leading-[0.95] text-transparent lg:text-[3.25rem]">
            Depilación
            <br />
            láser diodo
          </h1>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
            Resultados <strong className="font-medium text-neutral-900">visibles</strong> desde la primera sesión,
            con la comodidad de la punta de zafiro
          </p>

          <div className="mt-7">
            <WhatsAppCTA
              className="bg-white! pr-2! text-blush-900! shadow-[0_18px_40px_-20px_rgba(166,94,109,0.5)]! hover:bg-blush-50!"
              context={HERO_CTA_CONTEXT}
            >
              Reserva tu evaluación
              <span className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-blush-200 bg-blush-50 text-blush-900">
                <ArrowUpRightIcon />
              </span>
            </WhatsAppCTA>
          </div>
        </div>
      </div>

      <ScrollHint tone="light" />
    </section>
  )
}
