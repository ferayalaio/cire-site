import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageShell, SectionHeading } from '../components/PageShell'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import type { OtroServicio } from '../data/precios'
import { OTROS_SERVICIOS, formatPrecio } from '../data/precios'
import { Faq } from '../components/Faq'
import { FAQ_CORPORAL } from '../data/faq'
import { useFaqJsonLd } from '../hooks/useJsonLd'
import { TESTIMONIOS_OTROS_SERVICIOS } from '../data/testimonios'
import { FOTO_CORPORAL } from '../components/CatalogoSesiones'

/*
 * Tratamientos corporales (rediseño nov/26). El hub va directo a lo que la
 * clienta viene a buscar: qué servicios hay y desde cuánto. Cada servicio es
 * una fila con su precio de entrada que lleva a su propio catálogo; el hub no
 * repite el detalle de sesiones (mismo criterio que /laser).
 */

const BENEFICIOS = [
  {
    termino: 'Acompañamiento en tu recuperación',
    valor: 'Drenaje y seguimiento post-operatorio, sin que tengas que resolverlo sola.',
  },
  {
    termino: 'Moldeado con seguimiento real',
    valor: 'Protocolo de reducción de medidas que se ajusta según tu evolución.',
  },
]

const AGENDAR_CONTEXT = {
  sku: 'otros',
  nombre: 'sus servicios',
  categoria: 'otros',
} as const

const LINK_TEXTO =
  'text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors group-hover:decoration-ink'

function ServicioFila({ servicio }: { servicio: OtroServicio }) {
  const precio = formatPrecio(servicio.precioDesde)

  const contenido = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-[19px] font-semibold text-ink">{servicio.nombre}</span>
        <span className="mt-1 block text-[15px] leading-snug text-neutral-600">{servicio.resumen}</span>
      </span>
      <span className="shrink-0 text-right">
        {precio ? (
          <>
            <span className="block text-[14px] text-neutral-600">Desde</span>
            <span className="block text-[20px] font-semibold text-ink tabular-nums">{precio}</span>
          </>
        ) : (
          <span className="block text-[15px] text-neutral-600">Precio por WhatsApp</span>
        )}
      </span>
    </>
  )

  if (servicio.ruta) {
    return (
      <li>
        <Link to={servicio.ruta} className="group block py-5 sm:py-6">
          <span className="flex items-start gap-4 sm:gap-8">{contenido}</span>
          <span className={`mt-3 inline-flex min-h-11 items-center ${LINK_TEXTO}`}>Ver precios y sesiones</span>
        </Link>
      </li>
    )
  }

  // Categoría sin catálogo propio todavía (ninguna hoy): sin link, con su
  // propio WhatsApp para consultar.
  return (
    <li className="py-5 sm:py-6">
      <div className="flex items-start gap-4 sm:gap-8">{contenido}</div>
      <WhatsAppCTA
        variant="link"
        className="mt-3"
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
    </li>
  )
}

export function OtrosServicios() {
  useDocumentMeta({
    title: 'Tratamientos corporales: moldeo, celulitis y post operatorio',
    description:
      'Moldeo corporal, tratamiento anticelulítico Cire Sculpt y masaje post operatorio con drenaje. Precios por número de sesiones en CDMX y Metepec.',
  })
  useFaqJsonLd(FAQ_CORPORAL)

  useEffect(() => {
    trackViewContent({ nombre: 'Otros servicios', categoria: 'Corporal', sku: 'otros-servicios' })
  }, [])

  return (
    <PageShell
      title="Tratamientos corporales"
      intro="Lo que hacemos además de depilación: recuperación y moldeado corporal."
    >
      {/* ------------------------------------------- Servicios y precios --- */}
      <section id="precios" className="scroll-anchor">
        <SectionHeading>Servicios y precios</SectionHeading>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
          Cada servicio tiene su propia página con el detalle de precio por número de sesiones.
        </p>
        <ul className="mt-8 max-w-4xl divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {OTROS_SERVICIOS.map((servicio) => (
            <ServicioFila key={servicio.slug} servicio={servicio} />
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ Por qué ---------- */}
      <section className="mt-20 grid gap-10 sm:mt-28 md:grid-cols-[0.8fr_1.2fr] md:items-center lg:gap-16">
        <img
          src={FOTO_CORPORAL.src}
          alt={FOTO_CORPORAL.alt}
          loading="lazy"
          width={480}
          height={640}
          className="aspect-[4/3] w-full rounded-2xl object-cover object-[50%_62%] md:aspect-[3/4] md:max-w-sm"
        />
        <div>
          <SectionHeading>Por qué importan</SectionHeading>
          <dl className="mt-8 divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {BENEFICIOS.map((beneficio) => (
              <div key={beneficio.termino} className="grid gap-1 py-5">
                <dt className="text-[15px] font-semibold text-morado-700">{beneficio.termino}</dt>
                <dd className="text-[17px] leading-snug text-ink">{beneficio.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="resenas" className="scroll-anchor mt-20 sm:mt-28">
        <TestimoniosSection testimonios={TESTIMONIOS_OTROS_SERVICIOS} />
      </section>

      <section id="preguntas" className="scroll-anchor mt-20 sm:mt-28">
        <Faq items={FAQ_CORPORAL} titulo="Preguntas frecuentes sobre tratamientos corporales" />
      </section>

      <WhatsAppSection
        id="agendar"
        context={AGENDAR_CONTEXT}
        titulo="¿Lo armamos juntas?"
        texto="Cuéntanos qué servicio te interesa y te confirmamos disponibilidad por WhatsApp."
      >
        Escríbenos por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}

/* -------------------------------------------------------------------------- */
/* Catálogo por número de sesiones                                            */
/* -------------------------------------------------------------------------- */

