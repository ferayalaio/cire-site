import { useEffect } from 'react'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import {
  CERA_VIDEO_PRINCIPAL,
  CERA_VIDEO_PRINCIPAL_POSTER,
  CERA_VIDEO_REFERENCIA_1,
  CERA_VIDEO_REFERENCIA_1_POSTER,
  CERA_VIDEO_REFERENCIA_2,
  CERA_VIDEO_REFERENCIA_2_POSTER,
} from '../lib/constants'
import { CERA, formatPrecio } from '../data/precios'
import { TESTIMONIOS_CERA } from '../data/testimonios'

/*
 * Cera (rediseño nov/26). El precio va primero: una tarjeta destacada con el
 * precio de entrada por zona (calculado de `CERA`, nunca escrito a mano) y, al
 * lado, la lista completa de zonas agrupada por categoría. Las diferencias con
 * el láser pasan a una lista de definiciones en vez de tarjetas con icono.
 */

const BENEFICIOS = [
  {
    termino: 'Resultado inmediato',
    valor: 'Sales de la sesión con la zona lista, sin esperar a que se note el efecto.',
  },
  {
    termino: 'Sin candidatura previa',
    valor: 'No depende del tipo de piel ni del color de vello, a diferencia del láser.',
  },
  {
    termino: 'Se combina con láser',
    valor: 'Ideal para zonas puntuales entre sesiones, mientras avanza tu protocolo láser.',
  },
]

/*
 * Agrupa las 12 zonas de `CERA` (precios.ts) en 4 categorías para la lista de
 * precios: cubre todos los slugs existentes, ninguno queda afuera. Si se
 * agrega una zona nueva en precios.ts, hay que sumarla acá o desaparece de la
 * vista sin avisar.
 */
const CATEGORIAS_CERA = [
  {
    key: 'piernas',
    nombre: 'Piernas',
    slugs: ['medias-piernas-arriba', 'medias-piernas-abajo', 'piernas-completas'],
  },
  {
    key: 'bikini-gluteos',
    nombre: 'Bikini y glúteos',
    slugs: ['bikini-basico', 'sexy-bikini', 'coxis', 'gluteos-con-crack'],
  },
  {
    key: 'brazos-axilas',
    nombre: 'Brazos y axilas',
    slugs: ['brazos-completos', 'axilas'],
  },
  {
    key: 'torso',
    nombre: 'Torso',
    slugs: ['abdomen', 'espalda-completa', 'hombros'],
  },
] as const

const AGENDAR_CONTEXT = {
  sku: 'cera',
  nombre: 'la depilación con cera',
  categoria: 'cera',
  articulo: 'la',
} as const

/*
 * `CERA` en precios.ts trae las zonas cargadas del tarifario y se muestran
 * todas en la lista. El negocio tiene además paquetes/combos de cera que no
 * están cargados acá: la nota de la tarjeta destacada con el botón de
 * WhatsApp es lo que avisa que hay más sin listarlos todos en la página.
 */
const MAS_ZONAS_CONTEXT = {
  sku: 'cera-otras-zonas',
  nombre: 'otras zonas de cera',
  categoria: 'cera',
  articulo: 'las',
} as const

export function Cera() {
  useDocumentMeta({
    title: 'Depilación con cera en CDMX y Metepec',
    description:
      'Depilación con cera italiana con resultado inmediato, para quien no es candidata a láser. Precios por zona en sucursales de CDMX y Metepec.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'Depilación con cera', categoria: 'Depilacion con Cera', sku: 'cera' })
  }, [])

  const precios = CERA.map((zona) => zona.precio).filter((precio): precio is number => typeof precio === 'number')
  const desde = precios.length > 0 ? Math.min(...precios) : null

  const grupos = CATEGORIAS_CERA.map(({ key, nombre, slugs }) => ({
    key,
    nombre,
    zonas: slugs
      .map((slug) => CERA.find((zona) => zona.slug === slug))
      .filter((zona): zona is (typeof CERA)[number] => zona !== undefined),
  })).filter((grupo) => grupo.zonas.length > 0)

  return (
    <PageShell
      title="Depilación con cera italiana"
      intro="Cera italiana, para quien prefiere resultado inmediato o no es candidata a láser."
      media={
        <VideoAccent src={CERA_VIDEO_PRINCIPAL} poster={CERA_VIDEO_PRINCIPAL_POSTER} className="aspect-[4/5] w-full" />
      }
    >
      {/* ------------------------------------------- Precio + zonas -------- */}
      <section id="precios" className="scroll-anchor grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-8">
        <article className="rounded-2xl bg-blush-100 p-6 sm:p-8">
          <h2 className="text-2xl text-ink">Precio por zona</h2>
          <p className="mt-1 text-[15px] text-blush-900/80">Cera italiana, resultado inmediato</p>

          <p className="mt-6 text-[15px] text-blush-900/80">Desde</p>
          <p className="mt-1 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
            {formatPrecio(desde) ?? 'Precio por WhatsApp'}
          </p>

          <p className="mt-6 border-t border-blush-900/10 pt-5 text-[17px] leading-relaxed text-blush-900/85">
            También tenemos paquetes y combos de cera. ¿No encuentras tu zona? Pregúntanos por ella.
          </p>

          <WhatsAppCTA context={{ ...MAS_ZONAS_CONTEXT, placement: 'card' }} className="mt-6 w-full sm:w-auto">
            Pregunta por WhatsApp
          </WhatsAppCTA>
        </article>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] sm:p-8">
          <h2 className="text-2xl text-ink">Zonas y precios</h2>

          {grupos.length > 0 ? (
            <div className="mt-2 divide-y divide-black/[0.08]">
              {grupos.map((grupo) => (
                <div key={grupo.key} className="py-5 last:pb-0">
                  <h3 className="text-[15px] font-semibold text-ink">{grupo.nombre}</h3>
                  <ul className="mt-2 divide-y divide-black/[0.08]">
                    {grupo.zonas.map((zona) => (
                      <li key={zona.slug} className="flex items-baseline justify-between gap-4 py-3">
                        <span className="text-[17px] text-ink">{zona.nombre}</span>
                        <span className="text-[17px] font-semibold text-ink tabular-nums">
                          {formatPrecio(zona.precio) ?? 'Precio por WhatsApp'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <Placeholder label="Pendiente: tabla de zonas con precio en src/data/precios.ts (campo CERA)" />
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------- Cera vs. láser -------- */}
      <section id="beneficios" className="scroll-anchor mt-20 grid gap-10 sm:mt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading>Cera vs. láser</SectionHeading>
          <figure className="mt-8 max-w-sm">
            <VideoAccent
              src={CERA_VIDEO_REFERENCIA_1}
              poster={CERA_VIDEO_REFERENCIA_1_POSTER}
              className="aspect-[3/4] w-full"
            />
            <figcaption className="mt-3 text-[15px] text-neutral-600">Cera italiana en acción, en sesión real.</figcaption>
          </figure>
        </div>
        <dl className="divide-y divide-black/[0.08] border-y border-black/[0.08] lg:self-start">
          {BENEFICIOS.map((beneficio) => (
            <div key={beneficio.termino} className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-semibold text-morado-700">{beneficio.termino}</dt>
              <dd className="text-[17px] leading-snug text-ink">{beneficio.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="resenas" className="scroll-anchor mt-20 sm:mt-28">
        <TestimoniosSection testimonios={TESTIMONIOS_CERA} />
      </section>

      <WhatsAppSection
        id="agendar"
        context={AGENDAR_CONTEXT}
        titulo="Saca tu turno"
        texto="Dinos qué zona y en qué sucursal, y te confirmamos precio y disponibilidad."
        videoSrc={CERA_VIDEO_REFERENCIA_2}
        videoPoster={CERA_VIDEO_REFERENCIA_2_POSTER}
        videoCaption={{ tag: 'Resultado inmediato', title: 'Sales con la zona lista' }}
      >
        Escríbenos por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
