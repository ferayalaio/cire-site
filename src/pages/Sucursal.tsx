import { Link, useParams } from 'react-router-dom'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { TestimoniosSection } from '../components/Testimonios'
import { AgendarCTA, WhatsAppSection, useRememberSucursal } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useSucursalJsonLd } from '../hooks/useJsonLd'
import { HORARIO, getSucursal, mapsEmbedUrl } from '../data/sucursales'
import { MARCA } from '../data/marca'
import { NotFound } from './NotFound'

const SERVICIOS = [
  { to: '/laser/zonas', label: 'Depilación láser por zona' },
  { to: '/laser/bikini', label: 'Depilación láser de bikini' },
  { to: '/laser/cuerpo-completo', label: 'Depilación láser de cuerpo completo' },
  { to: '/cera', label: 'Depilación con cera italiana' },
  { to: '/hifu', label: 'HIFU: lifting sin cirugía' },
  { to: '/otros-servicios', label: 'Moldeo corporal y post operatorio' },
]

/*
 * Sucursales cuya `foto` no es una foto del lugar (se muestra el logo o nada
 * en su lugar). Vacío desde nov/26: Polanco ya tiene fachada real.
 */
const FOTO_NO_ES_SUCURSAL = new Set<string>()

/* "A, B y C", para que la lista de colonias se lea como texto y no como tags. */
function listaNatural(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
}

/*
 * Las cinco sucursales comparten plantilla, así que van por una sola ruta
 * paramétrica. El slug se valida contra SUCURSALES: cualquier otro cae en el
 * 404 en lugar de renderizar una página con el nombre inventado de la URL.
 */
export function Sucursal() {
  const { slug } = useParams<{ slug: string }>()
  const sucursal = getSucursal(slug)

  // Antes del early return: los hooks no pueden llamarse condicionalmente.
  useDocumentMeta({
    title: sucursal ? `Depilación láser en ${sucursal.zonaBusqueda}` : 'Sucursal no encontrada',
    description: sucursal
      ? `Depilación láser, cera y HIFU en Cire ${sucursal.nombre}: ${sucursal.direccion}. Horarios, mapa y citas por WhatsApp.`
      : undefined,
    noindex: !sucursal,
  })
  useSucursalJsonLd(sucursal)

  /*
   * Deja registrada esta sucursal como "la que se está mirando" en la visita.
   * Es lo que permite que, si la persona vuelve después a una página de
   * servicio y ahí escribe, el mensaje salga combinado ("...y estoy cerca de
   * Coapa") sin que la página de servicio tenga que saber nada de esto.
   */
  useRememberSucursal(slug)

  if (!sucursal) return <NotFound />

  const embedUrl = mapsEmbedUrl(sucursal)
  const foto = sucursal.foto && !FOTO_NO_ES_SUCURSAL.has(sucursal.slug) ? sucursal.foto : undefined

  const ctaContext = {
    sku: `sucursal-${sucursal.slug}`,
    nombre: 'una cita',
    categoria: 'sucursal',
    sucursal: sucursal.slug,
    intencion: 'agendar' as const,
  }

  return (
    <PageShell
      title={`Depilación láser en ${sucursal.nombre}`}
      intro={`Cire ${sucursal.nombre}, en ${sucursal.alcaldia}. Atención con cita por WhatsApp.`}
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Ubicaciones', to: '/#ubicaciones' },
      ]}
    >
      {/* ------------------------------------- Dirección, horario y mapa --- */}
      <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-stretch lg:gap-8">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] sm:p-8">
          <h2 className="text-2xl text-ink">Dirección y horario</h2>

          <dl className="mt-4 divide-y divide-black/[0.08]">
            <div className="grid gap-1 py-4">
              <dt className="text-[15px] font-semibold text-morado-700">Dirección</dt>
              <dd>
                {sucursal.direccion ? (
                  <address className="text-[17px] not-italic leading-relaxed text-neutral-700">{sucursal.direccion}</address>
                ) : (
                  <Placeholder label="Pendiente: cargar la dirección exacta del listado oficial en src/data/sucursales.ts" />
                )}
                {sucursal.referencias && (
                  <p className="mt-1 text-[15px] text-neutral-600">{sucursal.referencias}</p>
                )}
              </dd>
            </div>

            <div className="grid gap-1 py-4">
              <dt className="text-[15px] font-semibold text-morado-700">Horario</dt>
              <dd>
                <dl className="space-y-1">
                  {HORARIO.map((horario) => (
                    <div key={horario.dias} className="flex items-baseline justify-between gap-4">
                      <dt className="text-[17px] text-ink">{horario.dias}</dt>
                      <dd className="text-[17px] text-ink tabular-nums">{horario.horas}</dd>
                    </div>
                  ))}
                </dl>
              </dd>
            </div>

            {sucursal.telefono && (
              <div className="grid gap-1 py-4">
                <dt className="text-[15px] font-semibold text-morado-700">Teléfono</dt>
                <dd>
                  <a
                    href={`tel:${sucursal.telefono.replace(/\s+/g, '')}`}
                    className="text-[17px] text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    {sucursal.telefono}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex flex-col gap-2 border-t border-black/[0.08] pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <AgendarCTA context={{ ...ctaContext, placement: 'card' }} className="w-full sm:w-auto">
              Agendar en {sucursal.nombre}
            </AgendarCTA>
            {sucursal.mapsUrl && (
              <a
                href={sucursal.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
              >
                Abrir en Google Maps
              </a>
            )}
          </div>
        </div>

        {/*
          El iframe solo se monta si hay dirección o mapsQuery cargados: sin
          eso Google Maps embebe un mapa del mundo que no dice nada.
        */}
        {embedUrl ? (
          <div className="relative min-h-[18rem] overflow-hidden rounded-2xl bg-blush-50 ring-1 ring-black/[0.06] lg:min-h-0">
            {/* Respaldo debajo del iframe: si el mapa tarda o lo bloquea el
                navegador se ve la dirección y un enlace, no un panel vacío. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              {sucursal.direccion && (
                <p className="max-w-xs text-[15px] text-neutral-700">{sucursal.direccion}</p>
              )}
              {sucursal.mapsUrl ? (
                <a
                  href={sucursal.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                >
                  Abrir en Google Maps
                </a>
              ) : (
                <p className="text-[15px] text-neutral-600">Te compartimos la ubicación exacta por WhatsApp.</p>
              )}
            </div>
            <iframe
              src={embedUrl}
              title={`Mapa de ${sucursal.nombre}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : (
          <Placeholder label="Pendiente: carga la dirección en src/data/sucursales.ts para embeber el mapa" />
        )}
      </section>

      {/*
        Contenido propio de cada sucursal. Sin esto la página eran ~100
        palabras (dirección + horario) y Google la trata como "delgada"
        justo donde compite por las búsquedas locales. Todo sale de datos:
        la zona y las colonias vecinas de sucursales.ts, los servicios de las
        rutas reales del sitio. Nada inventado sobre la sucursal en sí.
      */}
      <section
        className={`mt-20 grid gap-10 sm:mt-28 ${foto ? 'lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16' : ''}`}
      >
        <div>
          <SectionHeading>{`Cómo trabajamos en ${sucursal.nombre}`}</SectionHeading>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
            Cire {sucursal.nombre} está en {sucursal.alcaldia}. Aquí trabajamos con láser de diodo con punta de
            zafiro, que enfría la piel en el momento del disparo, y con el {MARCA.protocolo}: un plan de 8
            sesiones ajustado a tu tipo de piel y vello. La primera cita es una evaluación con una especialista
            certificada, donde se confirma si eres candidata y se arma tu paquete.
          </p>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
            Atendemos a quienes viven o trabajan en {listaNatural(sucursal.cercanas)}. Todas las citas son con
            agenda previa por WhatsApp.
          </p>
        </div>

        {foto && (
          <img
            src={foto}
            alt={`Sucursal Cire ${sucursal.nombre}`}
            loading="lazy"
            className="aspect-[892/629] w-full rounded-2xl object-cover"
          />
        )}
      </section>

      {/* ----------------------------------------------------- Servicios --- */}
      <section className="mt-20 grid gap-8 sm:mt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading>Servicios en esta sucursal</SectionHeading>
        <ul className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {SERVICIOS.map((servicio) => (
            <li key={servicio.to}>
              <Link
                to={servicio.to}
                className="flex min-h-11 items-center py-4 text-[17px] text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
              >
                {servicio.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/*
        Sin título "de esta sucursal": el reparto de reseñas por sucursal se
        hizo a criterio (ver testimonios.ts), así que no se presentan como
        reseñas de este lugar.
      */}
      {sucursal.testimonios && sucursal.testimonios.length > 0 && (
        <section className="mt-20 sm:mt-28">
          <TestimoniosSection testimonios={sucursal.testimonios} />
        </section>
      )}

      <WhatsAppSection
        id="agendar"
        accion="agendar"
        context={ctaContext}
        titulo={`Agenda tu cita en ${sucursal.nombre}`}
        texto="Reserva en línea en nuestra agenda."
      >
        Agendar en {sucursal.nombre}
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
