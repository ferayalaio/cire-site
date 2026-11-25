import { useEffect } from 'react'
import { Faq } from '../components/Faq'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { CLAIMS, MARCA } from '../data/marca'
import { FULL_BODY, MSI, ZONAS, formatPrecio } from '../data/precios'
import { TESTIMONIOS_LASER_CUERPO_COMPLETO } from '../data/testimonios'
import { precioPromoFullBody } from '../data/promos'

/*
 * Full Body (rediseño nov/26): la página de mayor prioridad de conversión.
 *
 * Lo memorable es el precio. Por eso el primer bloque junta las dos cosas que
 * antes vivían separadas: la tarjeta del paquete y, al lado, qué zonas
 * incluye con lo que costaría cada una por separado. La comparación ya no es
 * una sección aparte más abajo: es la lista de lo que incluye.
 *
 * Todo número sale de data/precios.ts. Una zona sin precio individual (la
 * zona íntima no tiene paquete suelto equivalente) dice "Incluida" y no
 * entra en la suma, igual que antes.
 */

/* Mismo video del hero del home: re-encode de full-body-principal.mp4 con la
   corrección de color de todo el sitio (ver DESIGN.md, "Real Frame"). */
const VIDEO = '/videos/home-hero.mp4'
const POSTER = '/videos/posters/home-hero.jpg'

/** "Piernas completas, brazos completos, … y zona íntima": los nombres de
 *  data/ vienen en Title Case y a media frase se leen como etiquetas. */
function listaZonas(zonas: string[]): string {
  const texto = zonas
    .map((zona) => zona.toLowerCase())
    .join(', ')
    .replace(/, ([^,]*)$/, ' y $1')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const RAZONES = [
  {
    termino: 'Precio por zona',
    valor: 'Sale más barato que contratar cada zona por separado; la cuenta está arriba.',
  },
  {
    termino: 'Una sola cita',
    valor: 'Piernas, brazos, axilas, espalda y zona íntima en la misma sesión.',
  },
  { termino: 'Comodidad', valor: CLAIMS.comodidad },
  { termino: 'Resultados', valor: CLAIMS.experiencia },
]

const PREGUNTAS = [
  { pregunta: '¿Duele?', respuesta: CLAIMS.comodidad },
  {
    pregunta: '¿Cuántas sesiones incluye?',
    respuesta: `El paquete incluye ${FULL_BODY.sesiones} sesiones, el protocolo estándar del ${MARCA.protocolo} para resultados progresivos en todo el cuerpo.`,
  },
  {
    pregunta: '¿Qué zonas no cubre?',
    respuesta: `${FULL_BODY.noIncluye.join(', ')} se cotizan aparte; te damos el precio exacto por WhatsApp.`,
  },
  {
    pregunta: '¿Hay meses sin intereses?',
    respuesta: MSI.disponible
      ? `Sí, a ${MSI.meses.join(' y ')} meses con tarjetas participantes.`
      : 'Por ahora no; pregunta por promociones vigentes en WhatsApp.',
  },
]

export function LaserCuerpoCompleto() {
  useDocumentMeta({
    title: 'Depilación láser cuerpo completo (Full Body)',
    description:
      'Depilación láser de cuerpo completo: todas las zonas en una sola sesión, el paquete con mejor precio por área. Sucursales en CDMX y Metepec.',
  })

  useEffect(() => {
    trackViewContent({
      nombre: FULL_BODY.nombre,
      categoria: 'Depilacion Laser',
      sku: FULL_BODY.slug,
      valor: FULL_BODY.precioPaquete ?? undefined,
    })
  }, [])

  const promoFullBody = precioPromoFullBody()

  const ctaContext = {
    sku: FULL_BODY.slug,
    nombre: 'el Full Body' as const,
    categoria: 'laser',
    articulo: 'el' as const,
    valor: FULL_BODY.precioPaquete ?? undefined,
  }

  const filas = FULL_BODY.incluye.map((nombre) => {
    const zona = ZONAS.find((z) => z.nombre === nombre)
    return { nombre, precio: zona?.precioPaquete ?? null }
  })
  const sumaSueltas = filas.reduce((acc, fila) => acc + (fila.precio ?? 0), 0)
  const ahorro =
    FULL_BODY.precioPaquete !== null && sumaSueltas > FULL_BODY.precioPaquete
      ? sumaSueltas - FULL_BODY.precioPaquete
      : null

  return (
    <PageShell
      title="Depilación láser de cuerpo completo"
      intro={`${listaZonas(FULL_BODY.incluye)} en un solo paquete de ${FULL_BODY.sesiones ?? 8} sesiones. Una sola cita por sesión, con resultados progresivos.`}
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
      media={<VideoAccent src={VIDEO} poster={POSTER} className="aspect-[4/5] w-full" />}
    >
      {/* ------------------------------------------- Precio + qué incluye --- */}
      <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-8">
        <article className="rounded-2xl bg-blush-100 p-6 sm:p-8">
          <h2 className="text-2xl text-ink">Paquete Full Body</h2>
          <p className="mt-1 text-[15px] text-blush-900/80">{FULL_BODY.sesiones ?? 8} sesiones</p>

          {promoFullBody !== null ? (
            <>
              <p className="mt-6 text-[15px] font-semibold text-blush-600">Precio Buen Fin, hasta el 30 de noviembre</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
                  {formatPrecio(promoFullBody)}
                </span>
                <span className="text-[17px] text-blush-900 line-through tabular-nums">
                  <span className="sr-only">Precio regular </span>
                  {formatPrecio(FULL_BODY.precioPaquete)}
                </span>
              </p>
            </>
          ) : (
            <p className="mt-6 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
              {formatPrecio(FULL_BODY.precioPaquete) ?? 'Precio por WhatsApp'}
            </p>
          )}
          {MSI.disponible && (
            <p className="mt-3 text-[15px] text-blush-900/80">
              Hasta {Math.max(...MSI.meses)} meses sin intereses con tarjetas participantes.
            </p>
          )}

          <WhatsAppCTA context={{ ...ctaContext, placement: 'card' }} className="mt-8 w-full sm:w-auto">
            Cotizar Full Body
          </WhatsAppCTA>

          {FULL_BODY.noIncluye.length > 0 && (
            <p className="mt-6 border-t border-blush-900/10 pt-5 text-[15px] text-blush-900/80">
              No incluye {FULL_BODY.noIncluye.join(', ').toLowerCase()}: se cotizan aparte.
            </p>
          )}
        </article>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] sm:p-8">
          <h2 className="text-2xl text-ink">Qué incluye</h2>
          <p className="mt-1 text-[15px] text-neutral-600">Y lo que costaría cada zona por separado</p>

          {filas.length > 0 ? (
            <>
              <ul className="mt-4 divide-y divide-black/[0.08]">
                {filas.map((fila) => (
                  <li key={fila.nombre} className="flex items-baseline justify-between gap-4 py-3.5">
                    <span className="text-[17px] text-ink">{fila.nombre}</span>
                    <span className="text-[17px] text-neutral-600 tabular-nums">
                      {formatPrecio(fila.precio) ?? 'Incluida'}
                    </span>
                  </li>
                ))}
              </ul>

              {ahorro !== null && (
                <dl className="mt-2 space-y-2 border-t-2 border-ink pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[15px] text-neutral-700">Por separado</dt>
                    <dd className="text-[17px] text-neutral-700 line-through decoration-neutral-400 tabular-nums">
                      {formatPrecio(sumaSueltas)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[17px] font-semibold text-ink">Con Full Body ahorras</dt>
                    <dd className="text-[20px] font-semibold text-ink tabular-nums">{formatPrecio(ahorro)}</dd>
                  </div>
                </dl>
              )}
            </>
          ) : (
            <Placeholder label="Pendiente: listado de zonas incluidas en el Full Body" />
          )}
        </div>
      </section>

      {/* ------------------------------------------------- Por qué ---------- */}
      <section className="mt-20 grid gap-10 sm:mt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading>Por qué elegir Full Body</SectionHeading>
        <dl className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {RAZONES.map((razon) => (
            <div key={razon.termino} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-semibold text-morado-700">{razon.termino}</dt>
              <dd className="text-[17px] leading-snug text-ink">{razon.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20 sm:mt-28">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER_CUERPO_COMPLETO} />
      </section>

      <section className="mt-20 sm:mt-28">
        <Faq items={PREGUNTAS} titulo="Antes de decidir" />
      </section>

      <WhatsAppSection
        id="agendar"
        context={ctaContext}
        titulo="¿Empezamos con el Full Body?"
        texto="Resultados visibles desde la primera sesión. Te confirmamos precio, sesiones y disponibilidad por WhatsApp."
      >
        Cotizar Full Body
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
