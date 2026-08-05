import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageShell, SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import type { OtroServicio } from '../data/precios'
import { OTROS_SERVICIOS, formatPrecio } from '../data/precios'
import { TESTIMONIOS_OTROS_SERVICIOS } from '../data/testimonios'

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

// Dos ondas: el contorno "alisándose" — para Cire Sculpt Anticelulítico, la
// única de las tres categorías que todavía no tenía ícono propio.
function ContourIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 9c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 15c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowUpRightIcon({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
]

// Ícono por categoría — vive acá (presentación) y no en precios.ts (datos),
// mismo criterio que BENEFICIOS arriba. Si se agrega una categoría sin
// entrada acá, ServicioLinkCard cae a TargetIcon en vez de romper.
const ICONO_POR_SLUG: Record<string, (props: IconProps) => ReactNode> = {
  'moldeo-corporal': TargetIcon,
  'cire-sculpt': ContourIcon,
  'post-operatorio': HeartPulseIcon,
}

/*
 * Tarjeta propia de esta sección — no el `LinkCard` genérico que comparten
 * /laser y /ubicaciones. Ese es deliberadamente austero (un link de texto);
 * acá cada categoría tiene su propio precio de entrada y merece más peso
 * visual: ícono de marca, precio grande como ancla, no una etiqueta chiquita.
 */
function ServicioLinkCard({
  to,
  Icon,
  title,
  description,
  precioDesde,
}: {
  to: string
  Icon: (props: IconProps) => ReactNode
  title: string
  description: string
  precioDesde: ReturnType<typeof formatPrecio>
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-3xl border border-blush-200 border-t-4 border-t-blush-600 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blush-400 hover:border-t-blush-600 hover:shadow-[0_25px_55px_-25px_rgba(166,94,109,0.4)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 text-blush-600 transition-colors duration-300 group-hover:bg-blush-500 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="mt-5 text-2xl text-neutral-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{description}</p>

      <p className="mt-6 text-3xl text-neutral-900">
        {precioDesde ?? <span className="text-neutral-300">Precio pendiente</span>}
        {precioDesde && <span className="ml-1.5 text-sm font-normal text-neutral-400">desde</span>}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900">
        Ver precios y sesiones
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-blush-200 bg-blush-50 text-blush-900 transition-transform duration-200 group-hover:translate-x-1">
          <ArrowUpRightIcon />
        </span>
      </span>
    </Link>
  )
}

// Categoría sin `ruta` todavía (ninguna hoy, pero queda por si se agrega una
// sin catálogo propio): mismo look que ServicioLinkCard pero sin link ni
// precio, con su CTA de WhatsApp propio en vez del "Ver precios y sesiones".
function ServicioSinRuta({ servicio }: { servicio: OtroServicio }) {
  const Icon = ICONO_POR_SLUG[servicio.slug] ?? TargetIcon
  return (
    <div className="flex flex-col rounded-3xl border border-blush-200 border-t-4 border-t-blush-600 bg-white p-7">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 text-blush-600">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-2xl text-neutral-900">{servicio.nombre}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{servicio.resumen}</p>
      <p className="mt-6 text-sm text-neutral-300">Precio pendiente</p>
      <WhatsAppCTA
        variant="secondary"
        className="mt-5"
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
  )
}

const AGENDAR_CONTEXT = {
  sku: 'otros',
  nombre: 'sus servicios',
  categoria: 'otros',
  placement: 'seccion',
} as const

export function OtrosServicios() {
  useDocumentMeta({
    title: 'Otros servicios',
    description: 'Post-operatorio, Cire Sculpt y moldeo corporal: lo que hacemos además de depilación.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'Otros servicios', categoria: 'Corporal', sku: 'otros-servicios' })
  }, [])

  return (
    <>
      <PageShell
        eyebrow="Servicios"
        title="Otros servicios"
        intro="Lo que hacemos además de depilación: recuperación y moldeado corporal."
      />

      <Section id="beneficios">
        <SectionHeading>Por qué importan</SectionHeading>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2" step={90}>
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
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">
          Cada servicio tiene su propia página con el detalle de precio por número de sesiones.
        </p>

        {/*
          Mismo patrón que /laser (el hub solo enlaza a cada catálogo propio,
          no repite los precios acá), con una tarjeta propia y no el `LinkCard`
          genérico — ver ServicioLinkCard arriba.
        */}
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={90}>
          {OTROS_SERVICIOS.map((servicio) =>
            servicio.ruta ? (
              <ServicioLinkCard
                key={servicio.slug}
                to={servicio.ruta}
                Icon={ICONO_POR_SLUG[servicio.slug] ?? TargetIcon}
                title={servicio.nombre}
                description={servicio.resumen}
                precioDesde={formatPrecio(servicio.precioDesde)}
              />
            ) : (
              <ServicioSinRuta key={servicio.slug} servicio={servicio} />
            ),
          )}
        </Stagger>
      </Section>

      <Section id="resenas">
        <TestimoniosSection testimonios={TESTIMONIOS_OTROS_SERVICIOS} />
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
