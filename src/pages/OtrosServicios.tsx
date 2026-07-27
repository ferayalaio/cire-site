import { useEffect } from 'react'
import { PageShell, Placeholder } from '../components/PageShell'
import { WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { OTROS_SERVICIOS, formatPrecio } from '../data/precios'

export function OtrosServicios() {
  useDocumentMeta({
    title: 'Otros servicios',
    description: 'Post-operatorio, Cire Sculpt y aparatología: lo que hacemos además de depilación.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'Otros servicios', categoria: 'Corporal', sku: 'otros-servicios' })
  }, [])

  return (
    <PageShell
      eyebrow="Servicios"
      title="Otros servicios"
      intro="Lo que hacemos además de depilación: recuperación, moldeado corporal y aparatología."
    >
      <div className="stagger-fade grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OTROS_SERVICIOS.map((servicio) => (
          <div
            key={servicio.slug}
            className="flex flex-col rounded-2xl border border-black/[0.07] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)]"
          >
            <h2 className="text-xl text-neutral-900">{servicio.nombre}</h2>
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
      </div>

      {!OTROS_SERVICIOS.some((s) => s.precioDesde !== null) && (
        <div className="mt-10">
          <Placeholder label="Pendiente: detalle y precios de cada servicio en src/data/precios.ts (campo OTROS_SERVICIOS)" />
        </div>
      )}
    </PageShell>
  )
}
