import { useEffect } from 'react'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Reveal } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { FULL_BODY, MSI, formatPrecio, hayPrecio } from '../data/precios'
import { TESTIMONIOS_DESTACADOS_ALT } from '../data/testimonios'

/*
 * Página de mayor prioridad de conversión: acá se empuja el Full Body como la
 * mejor opción de precio/cobertura. Dispara ViewContent porque es la que más
 * tráfico de campaña recibe entre las tres de láser.
 */
export function LaserCuerpoCompleto() {
  useDocumentMeta({
    title: 'Depilación láser cuerpo completo — Full Body',
    description:
      'Todas las zonas en una misma sesión de depilación láser. El paquete con mejor precio por área y el que más gente elige.',
  })

  useEffect(() => {
    trackViewContent({
      nombre: FULL_BODY.nombre,
      categoria: 'Depilacion Laser',
      sku: FULL_BODY.slug,
      valor: FULL_BODY.precioPaquete ?? undefined,
    })
  }, [])

  const ctaContext = {
    sku: FULL_BODY.slug,
    nombre: 'el Full Body' as const,
    categoria: 'laser',
    articulo: 'el' as const,
    valor: FULL_BODY.precioPaquete ?? undefined,
  }

  return (
    <PageShell
      eyebrow="Depilación láser"
      title="Cuerpo completo"
      intro="Todas las zonas en una misma sesión. Es el paquete con mejor precio por área y el que más gente elige."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
    >
      <Reveal className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading>Qué incluye</SectionHeading>
          {FULL_BODY.incluye.length > 0 ? (
            <ul className="space-y-2.5">
              {FULL_BODY.incluye.map((zona) => (
                <li key={zona} className="flex gap-3 text-sm leading-relaxed text-neutral-600">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
                  {zona}
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder label="Pendiente: listado de zonas incluidas en el Full Body" />
          )}

          {/*
            Se publica a propósito: es una de las preguntas frecuentes, y
            decirlo acá antes evita la conversación incómoda en la sucursal.
          */}
          <p className="text-sm text-neutral-400">
            No incluye: {FULL_BODY.noIncluye.join(', ').toLowerCase()}.
          </p>
        </div>

        <div className="space-y-4">
          <SectionHeading>Precio</SectionHeading>
          {hayPrecio(FULL_BODY.precioSesion, FULL_BODY.precioPaquete) ? (
            <dl className="rounded-2xl border border-black/[0.07] bg-white p-6">
              {formatPrecio(FULL_BODY.precioSesion) && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-neutral-500">Por sesión</dt>
                  <dd className="text-xl text-neutral-900">{formatPrecio(FULL_BODY.precioSesion)}</dd>
                </div>
              )}
              {formatPrecio(FULL_BODY.precioPaquete) && (
                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-black/[0.07] pt-4">
                  <dt className="text-sm text-neutral-500">Paquete</dt>
                  <dd className="text-xl text-neutral-900">{formatPrecio(FULL_BODY.precioPaquete)}</dd>
                </div>
              )}
              {FULL_BODY.sesiones && (
                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-black/[0.07] pt-4">
                  <dt className="text-sm text-neutral-500">Sesiones</dt>
                  <dd className="text-xl text-neutral-900">{FULL_BODY.sesiones}</dd>
                </div>
              )}
            </dl>
          ) : (
            <Placeholder label="Pendiente: precio por sesión, paquete y comparación contra zonas sueltas" />
          )}

          {MSI.disponible && (
            <p className="text-xs text-neutral-400">
              MSI disponibles a {MSI.meses.join(' y ')} meses.
            </p>
          )}

          <WhatsAppCTA context={{ ...ctaContext, placement: 'card' }} className="w-full">
            Consultar por WhatsApp
          </WhatsAppCTA>
        </div>
      </Reveal>

      <Reveal className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading>Cómo es la sesión</SectionHeading>
          <Placeholder label="Pendiente: duración, preparación y cuidados posteriores" />
        </div>
        <div className="space-y-4">
          <SectionHeading>Antes y después</SectionHeading>
          <Placeholder label="Pendiente: subir fotos de antes/después a public/antes-despues/" />
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <TestimoniosSection testimonios={TESTIMONIOS_DESTACADOS_ALT} />
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={ctaContext}
        titulo="¿Empezamos con el Full Body?"
        texto="Te confirmamos precio, sesiones y disponibilidad por WhatsApp."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
