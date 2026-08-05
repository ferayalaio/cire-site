import { AnimatedHeading } from '../components/AnimatedHeading'
import { LinkCard, PageShell, SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CLAIMS, MARCA } from '../data/marca'
import { MSI } from '../data/precios'
import { TESTIMONIOS_LASER } from '../data/testimonios'
import {
  LASER_VIDEO_PRINCIPAL,
  LASER_VIDEO_PRINCIPAL_POSTER,
  LASER_VIDEO_REFERENCIA_1,
  LASER_VIDEO_REFERENCIA_1_POSTER,
  LASER_VIDEO_REFERENCIA_2,
  LASER_VIDEO_REFERENCIA_2_POSTER,
} from '../lib/constants'

interface IconProps {
  className?: string
}

function LayersIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5l8 4.3-8 4.3-8-4.3 8-4.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M4 12l8 4.3 8-4.3M4 16.2l8 4.3 8-4.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DeviceIcon({ className = 'h-5 w-5' }: IconProps) {
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

function ClockIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SnowflakeIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3v18M6 6.5l12 11M18 6.5l-12 11M4 12h16M7 4l5 2 5-2M7 20l5-2 5 2M4 8.5l3 3.5-3 3.5M20 8.5l-3 3.5 3 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Va primero a propósito: la comodidad es la objeción #1 antes de precio o
// tecnología, así que gana el primer lugar de lectura en la grilla.
const BENEFICIOS = [
  { key: 'comodidad', title: 'Sesión cómoda', text: CLAIMS.comodidad, Icon: SnowflakeIcon },
  { key: 'protocolo', title: 'Protocolo propio', text: CLAIMS.protocolo, Icon: LayersIcon },
  { key: 'tecnologia', title: 'Tecnología de punta', text: CLAIMS.tecnologia, Icon: DeviceIcon },
  { key: 'experiencia', title: 'Experiencia real', text: CLAIMS.experiencia, Icon: ClockIcon },
]

// Fotos reales de sesión (no antes/después clínico: mostramos el trato y el
// equipo en acción, que es lo que sí tenemos). Viven en public/resultados-reales/.
const RESULTADOS_REALES = [
  { src: '/resultados-reales/resultado-piernas.png', alt: 'Sesión de láser diodo en piernas' },
  { src: '/resultados-reales/resultado-axila.png', alt: 'Sesión de láser diodo en axila' },
]

const AGENDAR_CONTEXT = {
  sku: 'laser',
  nombre: 'depilación láser',
  categoria: 'laser',
  placement: 'seccion',
} as const

export function Laser() {
  useDocumentMeta({
    title: 'Depilación láser de diodo — Protocolo Láser Expert 8®',
    description:
      'Depilación láser de diodo con punta de zafiro. Elige cómo armar tu tratamiento: zona por zona, un nivel de bikini, o Full Body en una sola sesión.',
  })

  return (
    <>
      <PageShell
        eyebrow={MARCA.protocolo}
        title="Láser de diodo"
        intro="Elige cómo quieres armar tu tratamiento: zona por zona, un nivel de bikini, o cuerpo completo en una sola sesión."
        media={
          <VideoAccent
            src={LASER_VIDEO_PRINCIPAL}
            poster={LASER_VIDEO_PRINCIPAL_POSTER}
            className="h-72 w-full sm:h-80 md:h-[26rem]"
          />
        }
      />

      <Section id="beneficios" className="pt-0 sm:pt-4 lg:pt-6">
        <SectionHeading>El protocolo</SectionHeading>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={90}>
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
      </Section>

      <Section id="precios" tone="alt">
        <div className="grid gap-8 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <SectionHeading>Elige cómo armar tu tratamiento</SectionHeading>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
              Zona por zona, un nivel de bikini, o cuerpo completo en una sola sesión.
            </p>

            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2" step={90}>
              <LinkCard
                to="/laser/zonas"
                meta="A la carta"
                title="Por zonas"
                description="Precio de cada zona individual y a qué combo te conviene pasarte si tratas más de una."
                accent
              />
              <LinkCard
                to="/laser/bikini"
                meta="4 niveles"
                title="Bikini"
                description="Del bikini básico al brazilian, con la cobertura de cada nivel."
                accent
              />
              <LinkCard
                to="/laser/cuerpo-completo"
                meta="Full Body"
                title="Cuerpo completo"
                description="Todas las zonas en una sesión, al mejor precio por área."
                accent
              />
              {/* Sin `to`: es un paquete puntual, no un hub con sub-ruta propia. Mismo marco vino que las otras tres. */}
              <div className="flex flex-col rounded-2xl border border-blush-200 bg-gradient-to-br from-blush-50 to-white p-6 shadow-[0_15px_35px_-22px_rgba(166,94,109,0.4)]">
                <span className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-blush-500">
                  8 sesiones
                </span>
                <span className="text-xl text-neutral-900">Crack Mujer</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                  Paquete de 8 sesiones a precio cerrado.
                </span>
                <span className="mt-5 text-3xl font-medium text-blush-600">$1,625</span>
              </div>
            </Stagger>

            {MSI.disponible && (
              <p className="mt-10 text-sm text-neutral-400">
                Meses sin intereses disponibles{MSI.meses.length > 0 ? ` a ${MSI.meses.join(' y ')} meses` : ''}
                . {MSI.nota}
              </p>
            )}
          </div>
          <VideoAccent
            src={LASER_VIDEO_REFERENCIA_1}
            poster={LASER_VIDEO_REFERENCIA_1_POSTER}
            caption={{ tag: 'Sesión real', title: 'Láser diodo en acción' }}
            className="hidden h-80 w-full md:block"
          />
        </div>
      </Section>

      <Section id="resultados-reales">
        {/*
          No usa SectionHeading acá: ese componente fija text-neutral-900 en
          la clase base, y mezclarlo con bg-clip-text/text-transparent en el
          mismo className deja el ganador a la suerte del orden de utilidades
          generadas por Tailwind. AnimatedHeading directo evita el choque.
        */}
        <AnimatedHeading
          as="h2"
          className="bg-gradient-to-b from-blush-600 to-blush-300 bg-clip-text text-center text-3xl text-transparent sm:text-4xl"
        >
          Resultados reales
        </AnimatedHeading>
        <Stagger className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-8 sm:gap-14" step={90}>
          {RESULTADOS_REALES.map(({ src, alt }, index) => (
            <div key={src} className="relative">
              {/* Mismo "marco editorial" que VideoAccent: blob difuminado en vino
                  detrás + filo de vidrio (.liquid-glass), no un borde plano.
                  El blob alterna de esquina y de curva de deriva (drift-a/b)
                  para que las dos tarjetas no respiren en espejo. */}
              <div
                aria-hidden="true"
                className={
                  index === 0
                    ? 'animate-drift-a absolute -right-6 -top-6 h-28 w-28 rounded-full bg-blush-300/60 blur-2xl'
                    : 'animate-drift-b absolute -left-6 -top-6 h-28 w-28 rounded-full bg-blush-300/60 blur-2xl'
                }
              />
              <div className="liquid-glass relative aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-[0_25px_55px_-25px_rgba(61,29,34,0.45)]">
                <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </Stagger>
      </Section>

      <Section id="resenas" tone="alt">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER} />
      </Section>

      <Section id="agendar">
        <WhatsAppSection
          context={AGENDAR_CONTEXT}
          titulo="¿Lo armamos juntas?"
          texto="Resultados visibles desde la primera sesión. Cuéntanos qué zona te interesa y te pasamos precios y disponibilidad."
          videoSrc={LASER_VIDEO_REFERENCIA_2}
          videoPoster={LASER_VIDEO_REFERENCIA_2_POSTER}
          videoCaption={{ tag: 'Protocolo Láser Expert 8®', title: 'Resultados progresivos' }}
        >
          Escríbenos por WhatsApp
        </WhatsAppSection>
      </Section>
    </>
  )
}
