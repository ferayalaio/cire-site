import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { AVATAR_IMAGE, FRONT_VIDEO, FRONT_VIDEO_MOBILE } from '../lib/constants'
import { CLAIMS, REDES } from '../data/marca'
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

function CheckBadgeIcon({ className = 'h-5 w-5 shrink-0 text-blush-500' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 12.5l2 2 4.5-5M12 3l1.8 1.4 2.3-.2 1 2.1 2.1 1-.2 2.3L20.4 12l-1.4 1.8.2 2.3-2.1 1-1 2.1-2.3-.2L12 20.5l-1.8-1.4-2.3.2-1-2.1-2.1-1 .2-2.3L3.6 12l1.4-1.8-.2-2.3 2.1-1 1-2.1 2.3.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChipIcon({ className = 'h-5 w-5 text-blush-600' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ShieldIcon({ className = 'h-5 w-5 text-blush-600' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5l6.5 2.4v5.3c0 4.2-2.7 7.4-6.5 9.3-3.8-1.9-6.5-5.1-6.5-9.3V5.9L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon({ className = 'h-5 w-5 text-blush-600' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon({ className = 'h-5 w-5 text-blush-600' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15.2 15.2 20 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function DeviceIcon({ className = 'h-5 w-5 text-blush-600' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 4.5h3.5a2 2 0 0 1 2 2V9l3-1v8l-3-1v2.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
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

function StepArrow() {
  return (
    <svg viewBox="0 0 24 12" fill="none" className="h-3 w-6 shrink-0 text-blush-300" aria-hidden="true">
      <path d="M0 6h21M15 1l6 5-6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InstagramGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M13.4 20.7v-6.9h2.1l.3-2.5h-2.4V9.6c0-.7.2-1.2 1.2-1.2h1.3V6.1c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.9H8.7v2.5h2.1v6.9" />
    </svg>
  )
}

interface SocialLinksProps {
  /* El hero mobile pinta sobre panel oscuro y el de escritorio sobre el video
     claro, así que el color del círculo lo decide quien lo usa. */
  className: string
}

function SocialLinks({ className }: SocialLinksProps) {
  return (
    <>
      <a
        href={REDES.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Cire Depilación en Instagram"
        className={className}
      >
        <InstagramGlyph />
      </a>
      <a
        href={REDES.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Cire Depilación en Facebook"
        className={className}
      >
        <FacebookGlyph />
      </a>
    </>
  )
}

/* Contenido compartido por las dos composiciones: mismas palabras, distinto
   armado. Que vivan acá arriba es lo que garantiza que reordenar el mobile no
   pueda perder ni cambiar un dato respecto al escritorio. */
const TRUST = [
  { key: 'tecnologia', title: 'Tecnología', text: 'Avanzada', Icon: ChipIcon },
  { key: 'seguro', title: '100%', text: 'Seguro', Icon: ShieldIcon },
  { key: 'resultados', title: 'Resultados', text: 'Duraderos', Icon: ClockIcon },
]

const STEPS = [
  {
    key: 'evaluacion',
    title: 'Evaluación',
    text: 'Analizamos tu tipo de piel y vello para tu tratamiento personalizado.',
    Icon: SearchIcon,
  },
  { key: 'tratamiento', title: 'Tratamiento', text: CLAIMS.tecnologia, Icon: DeviceIcon },
  {
    key: 'resultados',
    title: 'Resultados',
    text: 'Piel suave y sin vello desde las primeras sesiones.',
    Icon: SparkleIcon,
  },
]

const HERO_CTA_CONTEXT = {
  sku: 'home-hero',
  nombre: 'sus servicios',
  categoria: 'general',
  placement: 'hero',
} as const

/*
 * El hero no se adapta con breakpoints sino con dos composiciones distintas:
 * en escritorio el video horizontal es fondo y todo el "chrome" flota encima
 * en las cuatro esquinas; en celular esa misma información no cabe superpuesta
 * sin amontonarse, así que se reordena por prioridad y lo secundario baja a su
 * propia sección. Ver HeroMobile para el detalle.
 *
 * Es un swap de componente y no CSS porque los dos montan un <video> distinto
 * y con ambos en el DOM el navegador descargaría los dos (ver useMediaQuery).
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
 * botón. Nada más compite por atención — no hay nada debajo para hacer
 * scroll, así que el hero es toda la página, igual que en escritorio.
 */
function HeroMobile() {
  return (
    <section className="relative flex h-dvh flex-col justify-end overflow-hidden bg-black">
      <LoopVideo className="absolute inset-0 h-full w-full object-cover" src={FRONT_VIDEO_MOBILE} />

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
          Resultados <strong className="font-medium text-white">visibles</strong> desde la primera sesión
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
    </section>
  )
}

/* --------------------------------------------------------------- escritorio */

interface TrustItemProps {
  icon: ReactNode
  title: string
  text: string
}

function TrustItem({ icon, title, text }: TrustItemProps) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <div className="leading-tight">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-500">{text}</p>
      </div>
    </div>
  )
}

interface StepProps {
  icon: ReactNode
  title: string
  text: string
}

function Step({ icon, title, text }: StepProps) {
  return (
    <div className="flex flex-1 items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-100">{icon}</span>
      <div className="leading-tight">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="mt-0.5 text-xs text-neutral-500">{text}</p>
      </div>
    </div>
  )
}

/*
 * Hero de escritorio: el video horizontal (public/videos/hero.mp4 — la escena
 * de la ventana en arco) ocupa la pantalla y todo el chrome flota encima:
 * columna de texto a la izquierda, badge de certificación con la foto real a
 * la derecha, barra de pasos abajo.
 */
function HeroDesktop() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <LoopVideo className="h-full w-full object-cover" src={FRONT_VIDEO} />
      </div>

      <div className="absolute inset-0 z-20">
        {/*
         * Columna de texto: centrada verticalmente pero solo dentro de esta
         * franja (no de toda la pantalla). Si se centrara contra el viewport
         * completo, en ventanas bajas el bloque —que crece con el listado de
         * confianza— terminaría empujado hacia la barra de pasos de abajo.
         * Acotar el rango la deja pegada arriba en vez de superponerse.
         *
         * En ventanas bajas centrar de más deja muy poco aire entre las redes
         * y la barra de pasos (se ve amontonado aunque técnicamente no se
         * toquen). Ahí conviene pegar el bloque arriba de la franja en vez de
         * centrarlo, para que todo el espacio libre quede abajo como colchón.
         */}
        <div className="absolute inset-x-10 top-24 bottom-44 flex items-center lg:inset-x-16 [@media(max-height:820px)]:items-start">
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
              Resultados <strong className="font-medium text-neutral-900">visibles</strong> desde la primera sesión
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

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 border-t border-black/[0.06] pt-6">
              {TRUST.map(({ key, title, text, Icon }) => (
                <TrustItem key={key} icon={<Icon />} title={title} text={text} />
              ))}
            </div>
          </div>
        </div>

        {/*
         * Badge de certificación con la foto real. Las redes viven acá abajo,
         * como un tercer elemento del mismo flujo en vez de flotar aparte: la
         * columna de texto de la izquierda es la que crece con el listado de
         * confianza y se queda sin aire en ventanas bajas, así que cualquier
         * otro contenido que dependiera de ella para su posición terminaba
         * tapado. Esta columna derecha es chica y estable — nunca compite por
         * espacio con la barra de pasos.
         */}
        <div className="absolute right-10 top-28 flex animate-slide-in-right flex-col items-end gap-3 motion-reduce:animate-none [animation-delay:150ms] lg:right-20">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-white/50">
            <img
              src={AVATAR_IMAGE}
              alt="Especialista Cire aplicando depilación láser diodo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-row-reverse items-center gap-2">
            <div className="text-right leading-tight">
              <p className="text-xs text-neutral-500">Profesionales</p>
              <p className="text-sm font-medium text-neutral-900">Certificadas</p>
            </div>
            <CheckBadgeIcon />
          </div>

          {/* Redes — mismo ícono de trazo fino que el footer */}
          <div className="flex items-center gap-3">
            <SocialLinks className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-neutral-500 transition-colors hover:border-blush-300 hover:text-neutral-900" />
          </div>
        </div>

        {/* Línea decorativa junto al badge — mismo acento que la referencia */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-28 flex h-40 w-px flex-col items-center justify-between bg-gradient-to-b from-white/40 via-white/15 to-transparent lg:right-10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>

        {/* Barra de pasos */}
        <div className="absolute inset-x-10 bottom-8 lg:inset-x-16">
          <div className="flex items-center gap-4 rounded-3xl border border-blush-200/70 bg-white/80 px-8 py-6 shadow-[0_25px_60px_-35px_rgba(166,94,109,0.35)] backdrop-blur-sm">
            {/* Plano a propósito: pasos y flechas son hermanos directos del
                mismo flex, así los tres `flex-1` reparten el ancho en partes
                iguales y las flechas quedan fuera de ese reparto. Envolver
                cada par en un div dejaría los pasos 2 y 3 más angostos. */}
            {STEPS.map(({ key, title, text, Icon }, index) => (
              <Fragment key={key}>
                {index > 0 && <StepArrow />}
                <Step icon={<Icon className="h-5 w-5 text-blush-600" />} title={title} text={text} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
