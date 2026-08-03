import { useEffect } from 'react'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { CERA_VIDEO_PRINCIPAL, CERA_VIDEO_REFERENCIA_1, CERA_VIDEO_REFERENCIA_2 } from '../lib/constants'
import { CERA, formatPrecio } from '../data/precios'
import { TESTIMONIOS_DESTACADOS } from '../data/testimonios'

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

const AGENDAR_CONTEXT = {
  sku: 'cera',
  nombre: 'la depilación con cera',
  categoria: 'cera',
  articulo: 'la',
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
        media={<VideoAccent src={CERA_VIDEO_PRINCIPAL} className="h-72 w-full sm:h-80 md:h-[26rem]" />}
      />

      <Section id="beneficios">
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

      <Section id="precios" tone="alt">
        <div className="grid gap-8 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <SectionHeading>Zonas y precios</SectionHeading>
            {CERA.length > 0 ? (
              <div className="mt-8 overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {CERA.map((zona) => (
                      <tr key={zona.slug} className="border-b border-black/[0.05] transition-colors last:border-0 hover:bg-blush-50/60">
                        <td className="px-5 py-4 text-neutral-900">{zona.nombre}</td>
                        <td className="px-5 py-4 text-neutral-600">
                          {formatPrecio(zona.precio) ?? <span className="text-neutral-300">Pendiente</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-8">
                <Placeholder label="Pendiente: tabla de zonas con precio en src/data/precios.ts (campo CERA)" />
              </div>
            )}
          </div>
          <VideoAccent
            src={CERA_VIDEO_REFERENCIA_1}
            caption={{ tag: 'Sesión real', title: 'Cera italiana en acción' }}
            className="hidden h-80 w-full md:block"
          />
        </div>
      </Section>

      <Section id="resenas">
        <TestimoniosSection testimonios={TESTIMONIOS_DESTACADOS} />
      </Section>

      <Section id="agendar" tone="alt">
        <WhatsAppSection
          context={AGENDAR_CONTEXT}
          titulo="Saca tu turno"
          texto="Dinos qué zona y en qué sucursal, y te confirmamos precio y disponibilidad."
          videoSrc={CERA_VIDEO_REFERENCIA_2}
          videoCaption={{ tag: 'Resultado inmediato', title: 'Sales con la zona lista' }}
        >
          Escríbenos por WhatsApp
        </WhatsAppSection>
      </Section>
    </>
  )
}
