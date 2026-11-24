import { Link, useParams } from 'react-router-dom'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Reveal } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppSection, useRememberSucursal } from '../components/WhatsAppCTA'
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

  return (
    <PageShell
      eyebrow="Depilación láser en"
      title={sucursal.nombre}
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Ubicaciones', to: '/ubicaciones' },
      ]}
    >
      <Reveal className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <section className="space-y-4">
            <SectionHeading>Dirección</SectionHeading>
            {sucursal.direccion ? (
              <address className="not-italic text-neutral-600">
                <p className="leading-relaxed">{sucursal.direccion}</p>
                {sucursal.referencias && (
                  <p className="mt-2 text-sm text-neutral-400">{sucursal.referencias}</p>
                )}
                {sucursal.telefono && (
                  <p className="mt-2 text-sm text-neutral-500">
                    Tel:{' '}
                    <a href={`tel:${sucursal.telefono.replace(/\s+/g, '')}`} className="text-neutral-900 hover:text-neutral-500">
                      {sucursal.telefono}
                    </a>
                  </p>
                )}
                {sucursal.mapsUrl && (
                  <a
                    href={sucursal.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-neutral-900 transition-all duration-200 hover:scale-[1.03] hover:border-black/40 active:scale-[0.98]"
                  >
                    Abrir en Google Maps
                  </a>
                )}
              </address>
            ) : (
              <Placeholder label="Pendiente: cargar la dirección exacta del listado oficial en src/data/sucursales.ts" />
            )}
          </section>

          <section className="space-y-4">
            <SectionHeading>Horario</SectionHeading>
            <dl className="rounded-2xl border border-black/[0.07] bg-white p-6">
              {HORARIO.map((horario, index) => (
                <div
                  key={horario.dias}
                  className={`flex items-baseline justify-between gap-4 ${
                    index > 0 ? 'mt-4 border-t border-black/[0.07] pt-4' : ''
                  }`}
                >
                  <dt className="text-sm text-neutral-500">{horario.dias}</dt>
                  <dd className="text-neutral-900">{horario.horas}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="space-y-4">
          <SectionHeading>Cómo llegar</SectionHeading>
          {/*
            El iframe solo se monta si hay dirección o mapsQuery cargados: sin
            eso Google Maps embebe un mapa del mundo que no dice nada.
          */}
          {embedUrl ? (
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.07]">
              <iframe
                src={embedUrl}
                title={`Mapa de ${sucursal.nombre}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <Placeholder label="Pendiente: carga la dirección en src/data/sucursales.ts para embeber el mapa" />
          )}
        </section>
      </Reveal>

      {/*
        Contenido propio de cada sucursal. Sin esto la página eran ~100
        palabras (dirección + horario) y Google la trata como "delgada"
        justo donde compite por las búsquedas locales. Todo sale de datos:
        la zona y las colonias vecinas de sucursales.ts, los servicios de las
        rutas reales del sitio. Nada inventado sobre la sucursal en sí.
      */}
      <Reveal as="section" className="mt-16 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading>{`Depilación láser en ${sucursal.nombre}`}</SectionHeading>
          <p className="leading-relaxed text-neutral-600">
            Cire {sucursal.nombre} está en {sucursal.alcaldia}. Aquí trabajamos con láser de diodo con punta de
            zafiro, que enfría la piel en el momento del disparo, y con el {MARCA.protocolo}: un plan de 8
            sesiones ajustado a tu tipo de piel y vello. La primera cita es una evaluación con una especialista
            certificada, donde se confirma si eres candidata y se arma tu paquete.
          </p>
          <p className="leading-relaxed text-neutral-600">
            Atendemos a quienes viven o trabajan en {listaNatural(sucursal.cercanas)}. Todas las citas son con
            agenda previa por WhatsApp.
          </p>
        </div>

        <div className="space-y-4">
          <SectionHeading>Servicios en esta sucursal</SectionHeading>
          <ul className="divide-y divide-black/[0.07] rounded-2xl border border-black/[0.07] bg-white">
            {SERVICIOS.map((servicio) => (
              <li key={servicio.to}>
                <Link
                  to={servicio.to}
                  className="flex items-center justify-between gap-4 px-6 py-4 text-neutral-900 transition-colors hover:bg-blush-50"
                >
                  <span>{servicio.label}</span>
                  <span aria-hidden="true" className="text-neutral-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {sucursal.testimonios && sucursal.testimonios.length > 0 && (
        <Reveal as="section" className="mt-16">
          <TestimoniosSection testimonios={sucursal.testimonios} titulo="Lo que dicen de esta sucursal" />
        </Reveal>
      )}

      <WhatsAppSection
        context={{
          sku: `sucursal-${sucursal.slug}`,
          nombre: 'una cita',
          categoria: 'sucursal',
          sucursal: sucursal.slug,
          intencion: 'agendar',
        }}
        titulo={`Escríbenos a ${sucursal.nombre}`}
        texto="Te confirmamos disponibilidad y te agendamos."
      />
    </PageShell>
  )
}
