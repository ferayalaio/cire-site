import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { AnimatedHeading } from '../components/AnimatedHeading'
import { LoopVideo } from '../components/LoopVideo'
import { VideoAccent } from '../components/VideoAccent'
import { Reveal, Stagger } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/PageShell'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import {
  HIFU_VIDEO_MOBILE,
  HIFU_VIDEO_MOBILE_POSTER,
  HIFU_VIDEO_REFERENCIA_1,
  HIFU_VIDEO_REFERENCIA_1_POSTER,
  HIFU_VIDEO_REFERENCIA_2,
  HIFU_VIDEO_REFERENCIA_2_POSTER,
  HIFU_VIDEO_REFERENCIA_3,
  HIFU_VIDEO_REFERENCIA_3_POSTER,
} from '../lib/constants'
import { trackViewContent } from '../lib/analytics'
import { HIFU_PROTOCOLOS, formatPrecio } from '../data/precios'
import { TESTIMONIOS_HIFU } from '../data/testimonios'

/* -------------------------------------------------------------------------- */
/* Iconos — mismo trazo fino (viewBox 24, stroke 1.4-1.6) que el resto del    */
/* sitio, propios de esta página porque los de Hero.tsx no están exportados. */
/* -------------------------------------------------------------------------- */

interface IconProps {
  className?: string
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LayersIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5l8 4.3-8 4.3-8-4.3 8-4.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 12l8 4.3 8-4.3M4 16.2l8 4.3 8-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ZapIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M13 3 6 13.5h5L11 21l7-10.5h-5L13 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function SparkleIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5c.4 3.6 1.2 6 2.6 7.4 1.4 1.4 3.8 2.2 7.4 2.6-3.6.4-6 1.2-7.4 2.6-1.4 1.4-2.2 3.8-2.6 7.4-.4-3.6-1.2-6-2.6-7.4-1.4-1.4-3.8-2.2-7.4-2.6 3.6-.4 6-1.2 7.4-2.6 1.4-1.4 2.2-3.8 2.6-7.4Z" />
    </svg>
  )
}

function SearchIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15.2 15.2 20 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function TargetIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    </svg>
  )
}

function BlendIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function CalendarIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Contenido — copy propio de esta página, no datos de negocio (eso vive en   */
/* src/data/precios.ts). Mismo patrón que TRUST/STEPS en Hero.tsx.            */
/* -------------------------------------------------------------------------- */

const PREOCUPACIONES = ['Pérdida de firmeza', 'Papada', 'Rostro menos definido']

const COMO_FUNCIONA = [
  {
    key: 'smas',
    title: 'Llegamos a donde importa',
    Icon: LayersIcon,
    text: 'Usamos HIFU 4D — ultrasonido focalizado de alta intensidad — que alcanza la capa SMAS: la misma que se trabaja en un lifting quirúrgico, pero sin cirugía ni postoperatorio.',
  },
  {
    key: 'tensor',
    title: 'Firmeza desde el primer día',
    Icon: ZapIcon,
    text: 'El calor del ultrasonido contrae las fibras de colágeno al instante, dando una sensación de firmeza y tensión ya desde la primera sesión.',
  },
  {
    key: 'colageno',
    title: 'Tu piel sigue trabajando después',
    Icon: SparkleIcon,
    text: 'En las semanas siguientes, tu piel produce colágeno y elastina nuevos. La firmeza y la definición siguen mejorando poco a poco, sin que tengas que hacer nada más.',
  },
]

const TIMELINE = [
  { label: 'Sesión', text: 'Sensación de firmeza inmediata.' },
  { label: '4 semanas', text: 'El colágeno empieza a activarse.' },
  { label: '8–12 semanas', text: 'Resultado visible: piel más firme y definida.' },
]

const DIFERENCIADORES = [
  { key: 'evaluacion', Icon: SearchIcon, text: 'Evaluamos tu piel y tu grado de flacidez antes de empezar.' },
  { key: 'personalizacion', Icon: TargetIcon, text: 'Personalizamos las zonas y la profundidad de cada disparo.' },
  { key: 'combinacion', Icon: BlendIcon, text: 'Combinamos tecnologías — HIFU, radiofrecuencia y faciales — cuando tu piel lo pide.' },
  { key: 'seguimiento', Icon: CalendarIcon, text: 'Te acompañamos con seguimiento real de tu evolución.' },
]

const PREGUNTAS_HIFU = [
  {
    key: 'caro',
    pregunta: '¿Está caro?',
    respuesta:
      'Más que una sesión, es una inversión en un resultado diseñado para tu rostro: por eso el protocolo incluye seguimiento, no solo el HIFU.',
  },
  {
    key: 'pensarlo',
    pregunta: 'Lo voy a pensar',
    respuesta:
      'Es válido — solo ten en cuenta que entre más pronto se estimula el colágeno, mejores resultados se logran. No hay urgencia artificial, pero sí una ventaja real en empezar antes.',
  },
  {
    key: 'funciona',
    pregunta: '¿Sí funciona?',
    respuesta:
      'Sí funciona. Pero lo importante no es si funciona en general, sino si es ideal para tu piel — por eso siempre empezamos con una valoración antes de recomendarte nada.',
  },
]

/* Frases clave — dispersas como acentos de diseño, no todas juntas. */
const QUOTES = [
  'Tu piel trabajando desde adentro',
  'No es magia… es colágeno activándose',
  'Resultados progresivos, no artificiales',
  'Efecto firmeza, no relleno',
  'Lifting sin cambiar tu expresión',
]

/*
 * Frase-acento entre secciones. Ahora vive *entre* dos `<Section>` (cada una
 * con su propio py-24/32/36), no dentro de un `<main>` con padding propio —
 * por eso ya no trae su propio margen vertical (antes sí, para no depender
 * de que alguien más lo pusiera): el espacio lo aportan las secciones a los
 * lados, y duplicar acá volvía a dejar huecos enormes. Sí necesita su propio
 * padding horizontal, porque al ser un elemento de nivel superior (no un hijo
 * del contenedor `max-w-6xl` de una Section) no hereda ninguno.
 */
function Quote({ children }: { children: string }) {
  return (
    <Reveal className="mx-auto max-w-xl px-6 text-center sm:px-10">
      <p className="font-display text-xl leading-[1.6] text-blush-500 sm:text-2xl">&ldquo;{children}&rdquo;</p>
    </Reveal>
  )
}

const HERO_CTA_CONTEXT = {
  sku: 'hifu-hero',
  nombre: 'el Cire Lift Protocol',
  categoria: 'hifu',
  articulo: 'el',
} as const

function formatRango(desde: number | null, hasta?: number | null): ReactNode {
  const min = formatPrecio(desde)
  const max = hasta ? formatPrecio(hasta) : undefined
  if (!min) return <span className="text-neutral-300">Precio pendiente</span>
  return max ? `${min}–${max}` : min
}

export function Hifu() {
  useDocumentMeta({
    title: 'HIFU — Cire Lift Protocol',
    description:
      'Lifting sin cirugía con HIFU 4D: reafirma, define y rejuvenece rostro y cuerpo trabajando desde las capas profundas de la piel. Conoce el protocolo, resultados y paquetes.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'Cire Lift Protocol — HIFU 4D', categoria: 'HIFU', sku: 'hifu' })
  }, [])

  return (
    <>
      {/*
        Solo el hero vive en `<main>` con su propio `max-w-6xl` — igual que
        PageShell en el resto del sitio. Sin padding inferior propio: la
        `Section` que sigue ya aporta su espacio superior (py-24/32/36); si el
        `<main>` también sumara el suyo, el hueco quedaba doble.
      */}
      <main className="mx-auto max-w-6xl px-6 pt-32 sm:px-10 sm:pt-40">
      {/* ---------------------------------------------------------- Hero --- */}
      <section className="grid items-center gap-14 md:grid-cols-2 md:gap-16">
        <div className="animate-fade-in-up motion-reduce:animate-none">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-blush-500">
            HIFU 4D · Sin cirugía
          </p>

          <AnimatedHeading
            as="h1"
            underline
            className="heading-1 text-5xl leading-[1.05] text-neutral-900 sm:text-6xl"
          >
            Cire Lift Protocol
          </AnimatedHeading>

          <p className="mt-6 font-display text-2xl leading-snug text-blush-500 sm:text-[1.75rem]">
            Lifting sin cirugía, resultados desde el interior.
          </p>

          <div className="mt-6 max-w-lg rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_25px_50px_-32px_rgba(166,94,109,0.35)]">
            <p className="text-base leading-relaxed text-neutral-500">
              Un tratamiento diseñado para reafirmar, definir y rejuvenecer tu rostro y cuerpo trabajando
              desde las capas profundas de la piel. No buscamos un efecto de un día: buscamos que tu piel
              cambie desde adentro, con un resultado natural que se nota más con cada semana.
            </p>
          </div>

          <div className="mt-8">
            <WhatsAppCTA context={{ ...HERO_CTA_CONTEXT, placement: 'hero' }}>
              Agenda tu valoración
              <span className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-blush-200 bg-blush-50 text-blush-900">
                <ArrowUpRightIcon />
              </span>
            </WhatsAppCTA>
          </div>
        </div>

        {/*
          Tarjeta vertical tipo "phone frame" para el clip 9:16: el video es
          corto y vertical, así que va contenido en una tarjeta con object-cover
          en vez de estirarlo como fondo horizontal. `liquid-glass` agrega el
          mismo marco de vidrio que el resto de los videos, tallado justo
          adentro del bisel oscuro de 6px (border-neutral-900) — no lo
          reemplaza, la utilidad de Tailwind gana por capa de cascada.
        */}
        <div className="animate-fade-in-up motion-reduce:animate-none [animation-delay:150ms]">
          <div className="relative mx-auto w-full max-w-[300px]">
            <div className="liquid-glass relative aspect-[9/16] rounded-[2.25rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-[0_35px_70px_-30px_rgba(166,94,109,0.45)]">
              <LoopVideo
                src={HIFU_VIDEO_MOBILE}
                poster={HIFU_VIDEO_MOBILE_POSTER}
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-neutral-900/80"
              />
            </div>
          </div>
        </div>
      </section>
      </main>

      <Quote>{QUOTES[0]}</Quote>

      {/* ------------------------------------------------- Problema ------- */}
      <Section>
        <Reveal className="grid gap-8 md:grid-cols-[1fr_300px] md:items-center">
        <div className="space-y-5">
          <SectionHeading>¿Te reconoces en esto?</SectionHeading>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-500">
            Muchas de nuestras clientas llegan notando lo mismo: pérdida de firmeza, un poco de papada, un
            rostro que ya no se ve tan definido como antes. No buscan un cambio drástico — buscan una
            solución natural, progresiva y segura, que respete su rostro en vez de transformarlo.
          </p>
          <div className="flex flex-wrap gap-3">
            {PREOCUPACIONES.map((item) => (
              <span
                key={item}
                className="rounded-full border border-black/[0.07] bg-white px-4 py-2 text-sm text-neutral-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <VideoAccent
          src={HIFU_VIDEO_REFERENCIA_1}
          poster={HIFU_VIDEO_REFERENCIA_1_POSTER}
          caption={{ tag: 'Sesión real', title: 'Cire Lift Protocol en acción' }}
          className="h-64 w-full sm:h-80 md:h-96"
        />
        </Reveal>
      </Section>

      <Quote>{QUOTES[1]}</Quote>

      {/* ---------------------------------------------- Cómo funciona ----- */}
      <Section id="beneficios" tone="alt">
        <SectionHeading>Cómo funciona</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          Sin sonar a laboratorio: así es como tu piel va cambiando, paso a paso.
        </p>

        <Stagger className="mt-8 grid gap-5 md:grid-cols-3" step={90}>
          {COMO_FUNCIONA.map(({ key, title, Icon, text }) => (
            <div key={key} className="rounded-2xl border border-black/[0.07] bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                <Icon />
              </span>
              <p className="mt-4 text-base font-medium text-neutral-900">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{text}</p>
            </div>
          ))}
        </Stagger>

        <div className="relative mt-12">
          <div aria-hidden="true" className="absolute inset-x-0 top-[13px] hidden h-px bg-blush-200 sm:block" />
          <Stagger className="relative grid gap-6 sm:grid-cols-3" step={100}>
            {TIMELINE.map((stop) => (
              <div key={stop.label} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-blush-500 bg-white sm:mt-0" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-blush-500">{stop.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{stop.text}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>

      <Quote>{QUOTES[2]}</Quote>

      {/* --------------------------------------------- Diferenciador ------ */}
      <Section>
        <Reveal className="rounded-3xl border border-blush-200 bg-gradient-to-br from-blush-50 to-white px-6 py-10 shadow-[0_35px_80px_-40px_rgba(166,94,109,0.4)] sm:px-12 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-blush-500">El diferenciador</p>
        <AnimatedHeading as="h2" className="mt-3 text-3xl leading-tight text-neutral-900 sm:text-4xl">
          No es solo una sesión de HIFU… es un protocolo diseñado según tu piel.
        </AnimatedHeading>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {DIFERENCIADORES.map(({ key, Icon, text }) => (
            <div key={key} className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blush-600 shadow-[0_10px_25px_-12px_rgba(166,94,109,0.35)]">
                <Icon />
              </span>
              <p className="pt-2 text-sm leading-relaxed text-neutral-600">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-2xl border-t border-blush-200 pt-6 text-sm leading-relaxed text-neutral-500">
          Eso es lo que nos separa de una clínica fría con sesiones genéricas: acá no hay dos protocolos
          iguales, porque no hay dos rostros iguales.
        </p>
        </Reveal>
      </Section>

      <Quote>{QUOTES[3]}</Quote>

      {/* ------------------------------------------------- Paquetes -------- */}
      <Section id="precios" tone="alt">
        <SectionHeading>Elige cómo empezar</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          Desde una sola sesión para conocer el efecto, hasta un protocolo completo pensado para
          resultados que se sostienen.
        </p>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-3" step={90}>
          {HIFU_PROTOCOLOS.map((paquete) => (
            <div
              key={paquete.slug}
              className={`flex flex-col rounded-3xl border bg-white p-7 transition-all duration-300 ${
                paquete.destacado
                  ? 'border-blush-300 shadow-[0_35px_70px_-30px_rgba(166,94,109,0.45)] md:-translate-y-3'
                  : 'border-black/[0.07] hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)]'
              }`}
            >
              {paquete.destacado && (
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-blush-500 px-3 py-1 text-xs font-medium text-white">
                  Más popular
                </span>
              )}

              <p className="text-xs font-medium uppercase tracking-[0.16em] text-blush-500">{paquete.duracion}</p>
              <h3 className="mt-2 text-2xl text-neutral-900">{paquete.nombre}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{paquete.resumen}</p>

              <p className="mt-6 text-3xl text-neutral-900">
                {formatRango(paquete.precioDesde, paquete.precioHasta)}
              </p>

              <ul className="mt-5 space-y-2.5">
                {paquete.incluye.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <WhatsAppCTA
                variant={paquete.destacado ? 'primary' : 'secondary'}
                className="mt-7 w-full"
                context={{
                  sku: paquete.slug,
                  nombre: paquete.nombre,
                  categoria: 'hifu',
                  placement: 'card',
                  valor: paquete.precioDesde ?? undefined,
                }}
              >
                Agenda tu valoración
              </WhatsAppCTA>
            </div>
          ))}
        </Stagger>
      </Section>

      {/* Reseñas: ya no necesita su propio salto — lo aporta la Section. */}
      <Section id="resenas">
        <TestimoniosSection testimonios={TESTIMONIOS_HIFU} />
      </Section>

      <Quote>{QUOTES[4]}</Quote>

      {/* ------------------------------------------------------- FAQ ------- */}
      <Section tone="alt">
        <SectionHeading>Antes de decidir</SectionHeading>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_240px]">
          <Stagger className="space-y-4" step={90}>
            {PREGUNTAS_HIFU.map((item) => (
              <div key={item.key} className="rounded-2xl border border-black/[0.07] bg-white p-6">
                <p className="text-lg font-medium text-neutral-900">{item.pregunta}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.respuesta}</p>
              </div>
            ))}
          </Stagger>
          <VideoAccent
            src={HIFU_VIDEO_REFERENCIA_2}
            poster={HIFU_VIDEO_REFERENCIA_2_POSTER}
            caption={{ tag: 'Sin cirugía', title: 'Resultado natural y progresivo' }}
            className="hidden h-full min-h-[300px] md:block"
          />
        </div>
      </Section>

      {/* ---------------------------------------------------- CTA final --- */}
      <Section id="agendar">
        <WhatsAppSection
          context={{ sku: 'hifu-cta-final', nombre: 'el Cire Lift Protocol', categoria: 'hifu', articulo: 'el' }}
          titulo="Empecemos con una valoración"
          texto="Ahí analizamos tu piel y te decimos exactamente qué zonas conviene trabajar, cómo, y qué resultado puedes esperar."
          videoSrc={HIFU_VIDEO_REFERENCIA_3}
          videoPoster={HIFU_VIDEO_REFERENCIA_3_POSTER}
          videoCaption={{ tag: 'HIFU 4D', title: 'Firmeza desde la primera sesión' }}
        >
          Agenda tu valoración
        </WhatsAppSection>
      </Section>
    </>
  )
}
