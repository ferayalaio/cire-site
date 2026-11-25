import { Link } from 'react-router-dom'
import { PageShell, SectionHeading } from '../components/PageShell'
import { Faq } from '../components/Faq'
import { FAQ_LASER } from '../data/faq'
import { useFaqJsonLd } from '../hooks/useJsonLd'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CLAIMS } from '../data/marca'
import { CRACK_MUJER, FULL_BODY, MSI, NIVELES_BIKINI, ZONAS, formatPrecio } from '../data/precios'
import type { Precio } from '../data/precios'
import { TESTIMONIOS_LASER } from '../data/testimonios'
import { LASER_VIDEO_PRINCIPAL, LASER_VIDEO_PRINCIPAL_POSTER } from '../lib/constants'

/*
 * Hub de láser (rediseño nov/26). La clienta llega a elegir cómo armar su
 * tratamiento, así que el primer bloque es esa elección con precio: Full Body
 * como la oferta destacada (blush-100, una sola por bloque) y, al lado, las
 * otras tres formas en una lista con su precio de entrada.
 *
 * Los "desde" salen del menor precio de paquete cargado en data/precios.ts;
 * si no hay ninguno, la fila dice "Precio por WhatsApp" en vez de inventarlo.
 */

function desde(precios: Precio[]): string {
  const cargados = precios.filter((p): p is number => p !== null)
  if (cargados.length === 0) return 'Precio por WhatsApp'
  return `Desde ${formatPrecio(Math.min(...cargados))}`
}

// Va primero a propósito: la comodidad es la objeción #1 antes de precio o
// tecnología, así que gana el primer lugar de lectura.
const BENEFICIOS = [
  { key: 'comodidad', title: 'Sesión cómoda', text: CLAIMS.comodidad },
  { key: 'protocolo', title: 'Protocolo propio', text: CLAIMS.protocolo },
  { key: 'tecnologia', title: 'Tecnología de punta', text: CLAIMS.tecnologia },
  { key: 'experiencia', title: 'Experiencia real', text: CLAIMS.experiencia },
]

/*
 * Fotos reales de sesión, con la corrección de color del sitio. Antes esta
 * sección era "Resultados reales" con public/resultados-reales/, que NO son
 * antes/después (y la de axila parece de stock): mostramos el trato y el
 * equipo en acción, que es lo que sí tenemos.
 */
const SESION = [
  { src: '/sesion/sesion-cabina.jpg', alt: 'Cabina de Cire preparada para una sesión de depilación láser' },
  { src: '/sesion/sesion-pieza-de-mano.jpg', alt: 'Pieza de mano del láser diodo con su pantalla, sobre la pierna de una clienta' },
  { src: '/sesion/sesion-especialista.jpg', alt: 'Especialista de Cire con uniforme de la marca durante una sesión de láser' },
]

const AGENDAR_CONTEXT = {
  sku: 'laser',
  nombre: 'depilación láser',
  categoria: 'laser',
  placement: 'seccion',
} as const

const FULL_BODY_CONTEXT = {
  sku: FULL_BODY.slug,
  nombre: 'el Full Body',
  categoria: 'laser',
  articulo: 'el',
  valor: FULL_BODY.precioPaquete ?? undefined,
  placement: 'card',
} as const

const CRACK_MUJER_CONTEXT = {
  sku: 'laser-crack-mujer',
  nombre: 'el paquete Crack Mujer',
  categoria: 'laser',
  articulo: 'el',
  valor: CRACK_MUJER.precioPaquete ?? undefined,
  placement: 'card',
} as const

const linkClase =
  'inline-flex min-h-11 items-center text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink'

export function Laser() {
  useDocumentMeta({
    title: 'Depilación láser de diodo: zonas, bikini y Full Body',
    description:
      'Depilación láser de diodo con punta de zafiro y Protocolo Láser Expert 8®. Arma tu tratamiento por zona, por nivel de bikini o cuerpo completo.',
  })
  useFaqJsonLd(FAQ_LASER)

  return (
    <PageShell
      title="Depilación láser de diodo"
      intro="Elige cómo quieres armar tu tratamiento: zona por zona, un nivel de bikini, o cuerpo completo en una sola sesión."
      media={
        <VideoAccent
          src={LASER_VIDEO_PRINCIPAL}
          poster={LASER_VIDEO_PRINCIPAL_POSTER}
          className="aspect-[4/5] w-full"
        />
      }
    >
      {/* --------------------------------------------- Cómo armarlo ------- */}
      <section id="precios" className="scroll-anchor">
        <SectionHeading>Elige cómo armar tu tratamiento</SectionHeading>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-8">
          <article className="rounded-2xl bg-blush-100 p-6 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-[-0.02em] text-ink">Cuerpo completo</h3>
            <p className="mt-1 text-[15px] text-blush-900/80">
              Full Body, {FULL_BODY.sesiones ?? 8} sesiones
            </p>

            <p className="mt-6 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
              {formatPrecio(FULL_BODY.precioPaquete) ?? 'Precio por WhatsApp'}
            </p>
            <p className="mt-4 max-w-[40ch] text-[17px] leading-relaxed text-blush-900/85">
              Todas las zonas en una sesión, al mejor precio por área.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <WhatsAppCTA context={FULL_BODY_CONTEXT} className="w-full sm:w-auto">
                Cotizar Full Body
              </WhatsAppCTA>
              <Link to="/laser/cuerpo-completo" className={`${linkClase} justify-center sm:justify-start`}>
                Ver qué incluye
              </Link>
            </div>
          </article>

          <div className="rounded-2xl bg-white px-6 ring-1 ring-black/[0.06] sm:px-8">
            <ul className="divide-y divide-black/[0.08]">
              <li className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <h3 className="text-[19px] font-semibold text-ink">Por zonas</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">
                    A la carta. Precio de cada zona individual y a qué combo te conviene pasarte si tratas más
                    de una.
                  </p>
                </div>
                <div className="flex items-baseline justify-between gap-4 sm:flex-col sm:items-end sm:gap-0">
                  <span className="text-[17px] font-semibold text-ink tabular-nums">
                    {desde(ZONAS.map((z) => z.precioPaquete))}
                  </span>
                  <Link to="/laser/zonas" className={linkClase}>
                    Ver detalle
                  </Link>
                </div>
              </li>

              <li className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <h3 className="text-[19px] font-semibold text-ink">Bikini</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">
                    {NIVELES_BIKINI.length} niveles. Del bikini básico al brazilian, con la cobertura de cada
                    nivel.
                  </p>
                </div>
                <div className="flex items-baseline justify-between gap-4 sm:flex-col sm:items-end sm:gap-0">
                  <span className="text-[17px] font-semibold text-ink tabular-nums">
                    {desde(NIVELES_BIKINI.map((n) => n.precioPaquete))}
                  </span>
                  <Link to="/laser/bikini" className={linkClase}>
                    Ver detalle
                  </Link>
                </div>
              </li>

              {/* Sin ruta propia: es un paquete puntual, no un hub con sub-ruta. */}
              <li className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <h3 className="text-[19px] font-semibold text-ink">Crack Mujer</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">
                    Paquete de 8 sesiones a precio cerrado.
                  </p>
                </div>
                <div className="flex items-baseline justify-between gap-4 sm:flex-col sm:items-end sm:gap-0">
                  <span className="text-[17px] font-semibold text-ink tabular-nums">
                    {formatPrecio(CRACK_MUJER.precioPaquete) ?? 'Por WhatsApp'}
                  </span>
                  <WhatsAppCTA context={CRACK_MUJER_CONTEXT} variant="link">
                    Cotizar
                  </WhatsAppCTA>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {MSI.disponible && (
          <p className="mt-6 text-[15px] text-neutral-600">
            {MSI.meses.length > 0
              ? `Hasta ${Math.max(...MSI.meses)} meses sin intereses con tarjetas participantes.`
              : MSI.nota}
          </p>
        )}
      </section>

      {/* ------------------------------------------------ Protocolo ------- */}
      <section id="beneficios" className="mt-20 grid gap-10 sm:mt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading>El protocolo</SectionHeading>
        <dl className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {BENEFICIOS.map(({ key, title, text }) => (
            <div key={key} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-semibold text-morado-700">{title}</dt>
              <dd className="text-[17px] leading-snug text-ink">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* -------------------------------------------------- Sesión -------- */}
      <section id="sesion" className="mt-20 sm:mt-28">
        <SectionHeading>Así es una sesión en Cire</SectionHeading>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
          Nuestras cabinas y especialistas, tal como las vas a encontrar.
        </p>
        <div className="-mx-6 mt-10 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
          {SESION.map(({ src, alt }) => (
            <img
              key={src}
              src={src}
              alt={alt}
              loading="lazy"
              width={480}
              height={640}
              className="aspect-[3/4] w-[72%] shrink-0 snap-start rounded-2xl object-cover sm:w-full"
            />
          ))}
        </div>
      </section>

      <section id="resenas" className="mt-20 sm:mt-28">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER} />
      </section>

      <section id="preguntas" className="mt-20 sm:mt-28">
        <Faq
          items={FAQ_LASER}
          titulo="Preguntas frecuentes sobre depilación láser"
          intro="Lo que más nos preguntan antes de empezar. Si tu duda no está aquí, escríbenos por WhatsApp."
        />
      </section>

      <WhatsAppSection
        id="agendar"
        context={AGENDAR_CONTEXT}
        titulo="¿Lo armamos juntas?"
        texto="Resultados visibles desde la primera sesión. Cuéntanos qué zona te interesa y te pasamos precios y disponibilidad."
      >
        Escríbenos por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
