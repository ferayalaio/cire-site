import { PageShell, Placeholder } from '../components/PageShell'
import { Reveal, Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { NIVELES_BIKINI, formatPrecio, hayPrecio } from '../data/precios'
import { TESTIMONIOS_DESTACADOS_ALT } from '../data/testimonios'

export function LaserBikini() {
  useDocumentMeta({
    title: 'Depilación láser de bikini — 4 niveles',
    description:
      'Los cuatro niveles de bikini en depilación láser, del básico al brazilian, con la cobertura de cada uno.',
  })

  return (
    <PageShell
      eyebrow="Depilación láser"
      title="Bikini"
      intro="Cuatro niveles según cuánta cobertura quieres. Si dudas, en cabina te ayudamos a elegir."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
    >
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {NIVELES_BIKINI.map((nivel, index) => (
          <div
            key={nivel.slug}
            className="flex flex-col rounded-2xl border border-black/[0.07] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)]"
          >
            <div className="flex items-center gap-3">
              {/*
                Icono propio de marca. `nivel.icono` viene vacío hasta que se
                suban los cuatro archivos a public/iconos-bikini/ — mientras
                tanto se muestra el número de orden, nunca un icono genérico
                que se confunda con el definitivo.
              */}
              {nivel.icono ? (
                <img src={nivel.icono} alt="" className="h-10 w-10" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-black/15 text-xs text-neutral-400">
                  {index + 1}
                </span>
              )}
              <span className="text-xl text-neutral-900">{nivel.nombre}</span>
            </div>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-500">
              {nivel.cobertura || 'Pendiente: descripción de cobertura de este nivel.'}
            </p>

            <div className="mt-4 flex items-baseline gap-3">
              {hayPrecio(nivel.precioSesion, nivel.precioPaquete) ? (
                <>
                  {formatPrecio(nivel.precioSesion) && (
                    <span className="text-lg text-neutral-900">{formatPrecio(nivel.precioSesion)}</span>
                  )}
                  {formatPrecio(nivel.precioPaquete) && (
                    <span className="text-sm text-neutral-400">
                      {formatPrecio(nivel.precioPaquete)} paquete
                      {nivel.sesiones ? ` (${nivel.sesiones} sesiones)` : ''}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-neutral-300">Precio pendiente</span>
              )}
            </div>

            {/*
              Un CTA por nivel y no uno solo al pie: es la diferencia entre saber
              que la campaña generó un clic "de bikini" y saber que lo generó
              del nivel brazilian. `valor` habilita ROAS en cuanto haya precio.
            */}
            <WhatsAppCTA
              variant="secondary"
              className="mt-6 w-full"
              context={{
                sku: nivel.slug,
                nombre: nivel.nombre,
                categoria: 'laser',
                placement: 'card',
                valor: nivel.precioPaquete ?? undefined,
              }}
            >
              Consultar por WhatsApp
            </WhatsAppCTA>
          </div>
        ))}
      </Stagger>

      {!NIVELES_BIKINI.some((n) => n.cobertura) && (
        <div className="mt-10">
          <Placeholder label="Pendiente: descripción de cobertura de cada nivel y precios en src/data/precios.ts" />
        </div>
      )}

      <Reveal className="mt-16">
        <TestimoniosSection testimonios={TESTIMONIOS_DESTACADOS_ALT} />
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'laser-bikini', nombre: 'un nivel de bikini', categoria: 'laser' }}
        titulo="¿No sabes qué nivel elegir?"
        texto="Cuéntanos qué buscas y te ayudamos a decidir cuál te conviene."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
