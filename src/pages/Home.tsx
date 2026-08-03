import { Hero } from '../components/Hero'
import { LinkCard, SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CLAIMS, REDES } from '../data/marca'
import { TESTIMONIOS_DESTACADOS } from '../data/testimonios'
import { AVATAR_IMAGE } from '../lib/constants'

interface IconProps {
  className?: string
}

function ChipIcon({ className = 'h-5 w-5' }: IconProps) {
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

function ShieldIcon({ className = 'h-5 w-5' }: IconProps) {
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

function ClockIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15.2 15.2 20 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function DeviceIcon({ className = 'h-4 w-4' }: IconProps) {
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

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M13.4 20.7v-6.9h2.1l.3-2.5h-2.4V9.6c0-.7.2-1.2 1.2-1.2h1.3V6.1c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.9H8.7v2.5h2.1v6.9" />
    </svg>
  )
}

/*
 * Contenido que antes vivía comprimido dentro del hero (ver git history de
 * Hero.tsx): ahora es su propia sección, con espacio para respirar.
 */
const BENEFICIOS = [
  {
    key: 'tecnologia',
    title: 'Tecnología avanzada',
    text: 'Láser diodo con punta de zafiro, la base del protocolo Láser Expert 8®.',
    Icon: ChipIcon,
  },
  {
    key: 'seguro',
    title: '100% seguro',
    text: 'Cumplimos con la normativa sanitaria vigente para procedimientos estéticos.',
    Icon: ShieldIcon,
  },
  {
    key: 'resultados',
    title: 'Resultados duraderos',
    text: 'Resultados progresivos, respaldados por 9 años de experiencia.',
    Icon: ClockIcon,
  },
]

const PASOS = [
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

const TRATAMIENTOS = [
  {
    to: '/laser',
    meta: 'Núcleo del protocolo',
    title: 'Láser de diodo',
    description: 'Zona por zona, por nivel de bikini, o cuerpo completo en una sola sesión.',
  },
  {
    to: '/cera',
    meta: 'Resultado inmediato',
    title: 'Cera italiana',
    description: 'Para quien prefiere resultado inmediato o no es candidata a láser.',
  },
  {
    to: '/hifu',
    meta: 'Cire Lift Protocol',
    title: 'HIFU 4D',
    description: 'Lifting sin cirugía: reafirma, define y rejuvenece desde las capas profundas de la piel.',
  },
  {
    to: '/otros-servicios',
    meta: 'Recuperación y moldeado',
    title: 'Otros servicios',
    description: 'Post-operatorio, Cire Sculpt y aparatología.',
  },
]

const HOME_CTA_CONTEXT = {
  sku: 'home-cta-final',
  nombre: 'sus servicios',
  categoria: 'general',
  placement: 'seccion',
} as const

export function Home() {
  useDocumentMeta({
    title: 'Cire Depilación — Láser Expert 8®, cera y HIFU',
    description:
      'Depilación láser de diodo con punta de zafiro, cera italiana y HIFU. 9 años de experiencia y 5 sucursales en Ciudad de México y Metepec. Agenda tu cita por WhatsApp.',
  })

  return (
    <>
      <Hero />

      <Section id="beneficios">
        <SectionHeading>Por qué elegir Cire</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          Nueve años de experiencia y cinco sucursales entre Ciudad de México y Metepec, con un protocolo
          pensado para tu tipo de piel y vello.
        </p>

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-3" step={90}>
          {BENEFICIOS.map(({ key, title, text, Icon }) => (
            <div key={key} className="rounded-2xl border border-black/[0.07] bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                <Icon />
              </span>
              <p className="mt-4 text-base font-medium text-neutral-900">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{text}</p>
            </div>
          ))}
        </Stagger>

        <div className="mt-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blush-500">Cómo funciona</p>
          <div className="relative mt-8">
            <div aria-hidden="true" className="absolute inset-x-0 top-[13px] hidden h-px bg-blush-200 sm:block" />
            <Stagger className="relative grid gap-6 sm:grid-cols-3" step={100}>
              {PASOS.map(({ key, title, text, Icon }) => (
                <div key={key} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blush-500 bg-white text-blush-600 sm:mt-0">
                    <Icon />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500 sm:max-w-[14rem]">{text}</p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </div>

        {/*
          La foto de la especialista vive en su propia tarjeta con padding,
          no flotando pegada al video del hero como antes.
        */}
        <div className="mt-16 flex flex-col items-center gap-5 rounded-2xl border border-black/[0.07] bg-white p-6 text-center sm:flex-row sm:text-left">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-blush-100">
            <img
              src={AVATAR_IMAGE}
              alt="Especialista Cire aplicando depilación láser diodo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <CheckBadgeIcon />
              <p className="text-sm font-medium text-neutral-900">Profesionales certificadas</p>
            </div>
            <p className="mt-1 text-sm text-neutral-500">Cada sesión la aplica personal capacitado en el protocolo.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={REDES.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Cire Depilación en Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-neutral-500 transition-colors hover:border-blush-300 hover:text-neutral-900"
            >
              <InstagramGlyph />
            </a>
            <a
              href={REDES.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Cire Depilación en Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-neutral-500 transition-colors hover:border-blush-300 hover:text-neutral-900"
            >
              <FacebookGlyph />
            </a>
          </div>
        </div>
      </Section>

      <Section id="precios" tone="alt">
        <SectionHeading>Elige tu tratamiento</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          Cada servicio tiene su propio detalle de precios y paquetes.
        </p>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={80}>
          {TRATAMIENTOS.map((tratamiento) => (
            <LinkCard key={tratamiento.to} {...tratamiento} />
          ))}
        </Stagger>
      </Section>

      <Section id="resenas">
        <TestimoniosSection testimonios={TESTIMONIOS_DESTACADOS} />
      </Section>

      <Section id="agendar" tone="alt">
        <SectionHeading>¿Lo armamos juntas?</SectionHeading>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
          Cuéntanos qué tratamiento te interesa y te confirmamos disponibilidad por WhatsApp.
        </p>
        <div className="mt-7">
          <WhatsAppCTA context={HOME_CTA_CONTEXT}>Escríbenos por WhatsApp</WhatsAppCTA>
        </div>
      </Section>
    </>
  )
}
