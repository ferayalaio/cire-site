import { useEffect } from 'react'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { OTROS_SERVICIOS, formatPrecio } from '../data/precios'
import { TESTIMONIOS_DESTACADOS } from '../data/testimonios'

interface IconProps {
  className?: string
}

function HeartPulseIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 20s-7-4.4-9.5-9C.9 7.8 2.3 4.5 5.5 4c2-.3 3.6.6 4.8 2.2M12 20s7-4.4 9.5-9c1.6-3.2.2-6.5-3-7-2-.3-3.6.6-4.8 2.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 11h3.5l1.5-2.5 2 4 1.5-2 1 1.5H21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

const BENEFICIOS = [
  {
    key: 'recuperacion',
    title: 'Acompañamiento en tu recuperación',
    text: 'Drenaje y seguimiento post-operatorio, sin que tengas que resolverlo sola.',
    Icon: HeartPulseIcon,
  },
  {
    key: 'moldeado',
    title: 'Moldeado con seguimiento real',
    text: 'Protocolo de reducción de medidas que se ajusta según tu evolución.',
    Icon: TargetIcon,
  },
  {
    key: 'aparatologia',
    title: 'Tecnología de cabina',
    text: 'Equipos pensados para tratamientos corporales y faciales, no soluciones genéricas.',
    Icon: DeviceIcon,
  },
]

const AGENDAR_CONTEXT = {
  sku: 'otros',
  nombre: 'sus servicios',
  categoria: 'otros',
  placement: 'seccion',
} as const

export function OtrosServicios() {
  useDocumentMeta({
    title: 'Otros servicios',
    description: 'Post-operatorio, Cire Sculpt y aparatología: lo que hacemos además de depilación.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'Otros servicios', categoria: 'Corporal', sku: 'otros-servicios' })
  }, [])

  return (
    <>
      <PageShell
        eyebrow="Servicios"
        title="Otros servicios"
        intro="Lo que hacemos además de depilación: recuperación, moldeado corporal y aparatología."
      />

      <Section id="beneficios">
        <SectionHeading>Por qué importan</SectionHeading>
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
        <SectionHeading>Servicios y precios</SectionHeading>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={90}>
          {OTROS_SERVICIOS.map((servicio) => (
            <div
              key={servicio.slug}
              className="flex flex-col rounded-2xl border border-black/[0.07] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)]"
            >
              <h3 className="text-xl text-neutral-900">{servicio.nombre}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{servicio.resumen}</p>
              <p className="mt-5 text-sm text-neutral-400">
                {formatPrecio(servicio.precioDesde) ? (
                  <>Desde {formatPrecio(servicio.precioDesde)}</>
                ) : (
                  <span className="text-neutral-300">Precio pendiente</span>
                )}
              </p>
              <WhatsAppCTA
                variant="secondary"
                className="mt-6 w-full"
                context={{
                  sku: servicio.slug,
                  nombre: servicio.nombre,
                  categoria: 'otros',
                  placement: 'card',
                  valor: servicio.precioDesde ?? undefined,
                }}
              >
                Consultar
              </WhatsAppCTA>
            </div>
          ))}
        </Stagger>

        {!OTROS_SERVICIOS.some((s) => s.precioDesde !== null) && (
          <div className="mt-10">
            <Placeholder label="Pendiente: detalle y precios de cada servicio en src/data/precios.ts (campo OTROS_SERVICIOS)" />
          </div>
        )}
      </Section>

      <Section id="resenas">
        <TestimoniosSection testimonios={TESTIMONIOS_DESTACADOS} />
      </Section>

      <Section id="agendar" tone="alt">
        <SectionHeading>¿Lo armamos juntas?</SectionHeading>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
          Cuéntanos qué servicio te interesa y te confirmamos disponibilidad por WhatsApp.
        </p>
        <div className="mt-7">
          <WhatsAppCTA context={AGENDAR_CONTEXT}>Escríbenos por WhatsApp</WhatsAppCTA>
        </div>
      </Section>
    </>
  )
}
