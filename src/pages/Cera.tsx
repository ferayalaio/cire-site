import { useEffect } from 'react'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import {
  CERA_VIDEO_PRINCIPAL,
  CERA_VIDEO_PRINCIPAL_POSTER,
  CERA_VIDEO_REFERENCIA_1,
  CERA_VIDEO_REFERENCIA_1_POSTER,
  CERA_VIDEO_REFERENCIA_2,
  CERA_VIDEO_REFERENCIA_2_POSTER,
} from '../lib/constants'
import { CERA, formatPrecio } from '../data/precios'
import { TESTIMONIOS_CERA } from '../data/testimonios'

interface IconProps {
  className?: string
}

function BoltIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M13 3 6 13.5h5L11 21l7-10.5h-5L13 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function CheckBadgeIcon({ className = 'h-5 w-5' }: IconProps) {
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

function BlendIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

/*
 * Iconos por categoría de zona, mismo trazo fino y abstracto que los de
 * arriba (nada figurativo de cuerpo, es el lenguaje visual del resto del
 * sitio) — solo para diferenciar de un vistazo cada grupo de la tabla de
 * precios.
 */
function ColumnsIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6.5" y="4" width="3.4" height="16" rx="1.7" stroke="currentColor" strokeWidth="1.4" />
      <rect x="14.1" y="4" width="3.4" height="16" rx="1.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function DropIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3c3.2 4.2 6 8 6 11.2A6 6 0 1 1 6 14.2C6 11 8.8 7.2 12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PeakIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 18.5 12 5.5l7 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="5.5" r="1.1" fill="currentColor" />
    </svg>
  )
}

function SquareIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

const BENEFICIOS = [
  {
    key: 'inmediato',
    title: 'Resultado inmediato',
    text: 'Sales de la sesión con la zona lista, sin esperar a que se note el efecto.',
    Icon: BoltIcon,
  },
  {
    key: 'sin-candidatura',
    title: 'Sin candidatura previa',
    text: 'No depende del tipo de piel ni del color de vello, a diferencia del láser.',
    Icon: CheckBadgeIcon,
  },
  {
    key: 'combinable',
    title: 'Se combina con láser',
    text: 'Ideal para zonas puntuales entre sesiones, mientras avanza tu protocolo láser.',
    Icon: BlendIcon,
  },
]

/*
 * Agrupa las 12 zonas de `CERA` (precios.ts) en 4 categorías para la tabla de
 * precios — cubre todos los slugs existentes, ninguno queda afuera. Si se
 * agrega una zona nueva en precios.ts, hay que sumarla acá o desaparece de la
 * vista sin avisar.
 */
const CATEGORIAS_CERA = [
  {
    key: 'piernas',
    nombre: 'Piernas',
    Icon: ColumnsIcon,
    slugs: ['medias-piernas-arriba', 'medias-piernas-abajo', 'piernas-completas'],
  },
  {
    key: 'bikini-gluteos',
    nombre: 'Bikini y glúteos',
    Icon: DropIcon,
    slugs: ['bikini-basico', 'sexy-bikini', 'coxis', 'gluteos-con-crack'],
  },
  {
    key: 'brazos-axilas',
    nombre: 'Brazos y axilas',
    Icon: PeakIcon,
    slugs: ['brazos-completos', 'axilas'],
  },
  {
    key: 'torso',
    nombre: 'Torso',
    Icon: SquareIcon,
    slugs: ['abdomen', 'espalda-completa', 'hombros'],
  },
] as const

/*
 * Frases-acento entre secciones — mismo patrón que Hifu.tsx y Laser.tsx: dan
 * ritmo al scroll sin sumar contenido nuevo. Cortas, sin urgencia, eco de lo
 * que ya dice la página (resultado inmediato, sin candidatura, combinable).
 */
const QUOTES = ['Sales de la sesión con la zona lista', 'El complemento perfecto entre sesiones de láser']

function Quote({ children }: { children: string }) {
  return (
    <Reveal className="mx-auto max-w-xl px-6 text-center sm:px-10">
      <p className="font-display text-xl leading-[1.6] text-blush-500 sm:text-2xl">&ldquo;{children}&rdquo;</p>
    </Reveal>
  )
}

const AGENDAR_CONTEXT = {
  sku: 'cera',
  nombre: 'la depilación con cera',
  categoria: 'cera',
  articulo: 'la',
} as const

/*
 * `CERA` en precios.ts trae las zonas cargadas del tarifario y se muestran
 * todas en la tabla. El negocio tiene además paquetes/combos de cera que no
 * están cargados acá — la nota de abajo con el botón de WhatsApp es lo que
 * avisa que hay más sin listarlos todos en la página.
 */
const MAS_ZONAS_CONTEXT = {
  sku: 'cera-otras-zonas',
  nombre: 'otras zonas de cera',
  categoria: 'cera',
  articulo: 'las',
} as const

export function Cera() {
  useDocumentMeta({
    title: 'Depilación con cera italiana',
    description:
      'Depilación con cera italiana para quien prefiere resultado inmediato o no es candidata a láser. Zonas, precios y turnos.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'Depilación con cera', categoria: 'Depilacion con Cera', sku: 'cera' })
  }, [])

  return (
    <>
      <PageShell
        eyebrow="Servicios"
        title="Depilación con cera"
        intro="Cera italiana, para quien prefiere resultado inmediato o no es candidata a láser."
        media={
          <VideoAccent
            src={CERA_VIDEO_PRINCIPAL}
            poster={CERA_VIDEO_PRINCIPAL_POSTER}
            className="h-72 w-full sm:h-80 md:h-[26rem]"
          />
        }
      />

      <Section id="beneficios" className="pt-0 sm:pt-4 lg:pt-6">
        <SectionHeading>Cera vs. láser</SectionHeading>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-3" step={90}>
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

      <Quote>{QUOTES[0]}</Quote>

      <Section id="precios" tone="alt">
        <div className="grid gap-8 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <SectionHeading>Zonas y precios</SectionHeading>
            {CERA.length > 0 ? (
              <>
                <Stagger className="mt-8 grid gap-5 sm:grid-cols-2" step={90}>
                  {CATEGORIAS_CERA.map(({ key, nombre, Icon, slugs }) => {
                    const zonas = slugs
                      .map((slug) => CERA.find((zona) => zona.slug === slug))
                      .filter((zona): zona is (typeof CERA)[number] => zona !== undefined)
                    if (zonas.length === 0) return null
                    return (
                      <div
                        key={key}
                        className="flex min-h-[250px] flex-col rounded-2xl border border-black/[0.07] bg-white p-6"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                          <Icon />
                        </span>
                        <p className="mt-4 text-base font-medium text-neutral-900">{nombre}</p>
                        <ul className="mt-3 space-y-2">
                          {zonas.map((zona) => (
                            <li key={zona.slug} className="flex items-baseline justify-between gap-3 text-sm">
                              <span className="text-neutral-600">{zona.nombre}</span>
                              <span className="text-neutral-900">
                                {formatPrecio(zona.precio) ?? <span className="text-neutral-300">Pendiente</span>}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </Stagger>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blush-200 bg-blush-100 px-5 py-5">
                  <p className="text-sm font-medium text-neutral-800">
                    También tenemos paquetes y combos de cera. ¿No encuentras tu zona? Pregúntanos por ella.
                  </p>
                  <WhatsAppCTA context={{ ...MAS_ZONAS_CONTEXT, placement: 'card' }} variant="secondary">
                    Pregunta por WhatsApp
                  </WhatsAppCTA>
                </div>
              </>
            ) : (
              <div className="mt-8">
                <Placeholder label="Pendiente: tabla de zonas con precio en src/data/precios.ts (campo CERA)" />
              </div>
            )}
          </div>
          <VideoAccent
            src={CERA_VIDEO_REFERENCIA_1}
            poster={CERA_VIDEO_REFERENCIA_1_POSTER}
            caption={{ tag: 'Sesión real', title: 'Cera italiana en acción' }}
            className="hidden h-80 w-full md:block"
          />
        </div>
      </Section>

      <Quote>{QUOTES[1]}</Quote>

      <Section id="resenas">
        <TestimoniosSection testimonios={TESTIMONIOS_CERA} />
      </Section>

      <Section id="agendar" tone="alt">
        <WhatsAppSection
          context={AGENDAR_CONTEXT}
          titulo="Saca tu turno"
          texto="Dinos qué zona y en qué sucursal, y te confirmamos precio y disponibilidad."
          videoSrc={CERA_VIDEO_REFERENCIA_2}
          videoPoster={CERA_VIDEO_REFERENCIA_2_POSTER}
          videoCaption={{ tag: 'Resultado inmediato', title: 'Sales con la zona lista' }}
        >
          Escríbenos por WhatsApp
        </WhatsAppSection>
      </Section>
    </>
  )
}
