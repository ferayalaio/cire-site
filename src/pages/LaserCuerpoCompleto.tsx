import { useEffect } from 'react'
import type { ReactElement } from 'react'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Reveal, Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { FULL_BODY_VIDEO_PRINCIPAL, FULL_BODY_VIDEO_PRINCIPAL_POSTER } from '../lib/constants'
import { CLAIMS, MARCA } from '../data/marca'
import { FULL_BODY, MSI, ZONAS, formatPrecio, hayPrecio } from '../data/precios'
import { TESTIMONIOS_LASER_CUERPO_COMPLETO } from '../data/testimonios'

/* -------------------------------------------------------------------------- */
/* Iconos — mismo trazo fino (viewBox 24, stroke 1.4) que el resto del sitio  */
/* (ver Hifu.tsx). Los primeros cinco son uno por zona del Full Body, más     */
/* abstractos que literales: piernas (columnas), brazos, axilas (gota, por    */
/* el enfriamiento de zafiro), espalda (arco simétrico) y zona íntima (pétalo,*/
/* el discreto de la marca). Los últimos tres son para la sección de         */
/* beneficios (precio, calendario, resultados).                              */
/* -------------------------------------------------------------------------- */

interface IconProps {
  className?: string
}

function CheckIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LegsIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 3.5h6v7.5c0 1.2.2 2.4.7 3.5l2.3 5.5M9 3.5v7.5c0 1.2-.2 2.4-.7 3.5L6 20M9 7h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArmsIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 6c1.5 2 3 3 5 3.3M19 6c-1.5 2-3 3-5 3.3M10 9.3c0 4 .8 7.3 2 9.7 1.2-2.4 2-5.7 2-9.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DropletIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5c3 4 5.5 7.4 5.5 10.3a5.5 5.5 0 1 1-11 0c0-2.9 2.5-6.3 5.5-10.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4c-4 2-7 4-7 8.5 0 3 1.5 5.5 4 7M12 4c4 2 7 4 7 8.5 0 3-1.5 5.5-4 7M12 4v17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PetalIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4c3.5 1 6 4 6 8s-2.5 7-6 8c-3.5-1-6-4-6-8s2.5-7 6-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 6v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function TagIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M11.5 3.5H5v6.5L14.5 20l6-6-9-10.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8.3" cy="7.3" r="1.1" fill="currentColor" />
    </svg>
  )
}

function CalendarIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SparkleIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5c.4 3.6 1.2 6 2.6 7.4 1.4 1.4 3.8 2.2 7.4 2.6-3.6.4-6 1.2-7.4 2.6-1.4 1.4-2.2 3.8-2.6 7.4-.4-3.6-1.2-6-2.6-7.4-1.4-1.4-3.8-2.2-7.4-2.6 3.6-.4 6-1.2 7.4-2.6 1.4-1.4 2.2-3.8 2.6-7.4Z" />
    </svg>
  )
}

// Mapa por nombre de zona (tal como viven en FULL_BODY.incluye). Una zona que
// llegue a agregarse sin icono propio cae a CheckIcon en vez de romper.
const ZONA_ICONS: Record<string, (props: IconProps) => ReactElement> = {
  'Piernas Completas': LegsIcon,
  'Brazos Completos': ArmsIcon,
  Axilas: DropletIcon,
  'Espalda Completa': BackIcon,
  'Zona Íntima': PetalIcon,
}

/*
 * Copy propio de esta página (no datos de negocio — eso vive en precios.ts /
 * marca.ts). Mismo patrón que Hifu.tsx: arrays de contenido a nivel de
 * módulo, reutilizando frases ya aprobadas de CLAIMS en vez de inventar
 * nuevas — el tono del sitio (ver marca.ts) es directo, sin exclamaciones ni
 * promesas sin sustento, así que la persuasión acá viene de la estructura
 * (comparar precio, mostrar reseñas reales) y no de adjetivos.
 */
const BENEFICIOS = [
  {
    key: 'precio',
    Icon: TagIcon,
    title: 'Mejor precio por zona',
    text: 'Comparado con contratar cada zona por separado, el Full Body sale mejor precio por zona tratada — el comparativo está más abajo.',
  },
  {
    key: 'cita',
    Icon: CalendarIcon,
    title: 'Una sola cita',
    text: 'Piernas, brazos, axilas, espalda y zona íntima en la misma sesión: menos traslados, menos citas que recordar.',
  },
  {
    key: 'comodidad',
    Icon: DropletIcon,
    title: 'Pensado para la comodidad',
    text: CLAIMS.comodidad,
  },
  {
    key: 'experiencia',
    Icon: SparkleIcon,
    title: 'Resultados progresivos',
    text: CLAIMS.experiencia,
  },
]

/*
 * Respuestas basadas solo en datos ya confirmados (FULL_BODY, MSI, CLAIMS) —
 * nada de política de sucursal inventada (la regla de "sesiones cada 8
 * semanas" de Del Valle, por ejemplo, se comunica en WhatsApp a propósito, no
 * acá — ver el comentario de PROMO_ACTIVA en precios.ts).
 */
const PREGUNTAS_FULL_BODY = [
  {
    key: 'duele',
    pregunta: '¿Duele?',
    respuesta: CLAIMS.comodidad,
  },
  {
    key: 'sesiones',
    pregunta: '¿Cuántas sesiones incluye?',
    respuesta: `El paquete incluye ${FULL_BODY.sesiones} sesiones — el protocolo estándar del ${MARCA.protocolo} para resultados progresivos en todo el cuerpo.`,
  },
  {
    key: 'noincluye',
    pregunta: '¿Qué zonas no cubre?',
    respuesta: `${FULL_BODY.noIncluye.join(', ')} se cotizan aparte — te damos el precio exacto por WhatsApp.`,
  },
  {
    key: 'msi',
    pregunta: '¿Hay meses sin intereses?',
    respuesta: MSI.disponible
      ? `Sí, a ${MSI.meses.join(' y ')} meses con tarjetas participantes.`
      : 'Por ahora no — pregunta por promociones vigentes en WhatsApp.',
  },
]

// Frase corta y centrada, mismo lenguaje visual que las de Hifu.tsx (acá
// local en vez de importada: cada página arma las suyas según su propio
// copy aprobado, no hay un set genérico compartido).
function Quote({ children }: { children: string }) {
  return (
    <Reveal className="mx-auto max-w-xl px-6 text-center sm:px-10">
      <p className="font-display text-xl leading-[1.6] text-blush-500 sm:text-2xl">&ldquo;{children}&rdquo;</p>
    </Reveal>
  )
}

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

  // Filas del precio calculadas antes del JSX para no dejar un divisor
  // huérfano arriba de la primera fila cuando `precioSesion` es null (caso
  // actual): solo las filas después de la primera llevan borde superior.
  const filasPrecio = [
    formatPrecio(FULL_BODY.precioSesion) && { label: 'Por sesión', valor: formatPrecio(FULL_BODY.precioSesion)! },
    formatPrecio(FULL_BODY.precioPaquete) && {
      label: 'Paquete',
      valor: formatPrecio(FULL_BODY.precioPaquete)!,
      destacado: true,
    },
    FULL_BODY.sesiones && { label: 'Sesiones', valor: String(FULL_BODY.sesiones) },
  ].filter((fila): fila is { label: string; valor: string; destacado?: boolean } => Boolean(fila))

  /*
   * Comparativo "por separado vs Full Body": solo con las zonas de
   * FULL_BODY.incluye que tienen un precio individual confirmado en ZONAS
   * (no se inventa un equivalente de "zona íntima" — ningún nivel de bikini
   * está confirmado como ese equivalente exacto, así que se deja fuera del
   * total y se aclara en el copy). Se calcula acá, no se hardcodea: si algún
   * precio cambia en precios.ts, este comparativo se actualiza solo.
   */
  const zonasComparables = FULL_BODY.incluye
    .map((nombre) => ZONAS.find((z) => z.nombre === nombre))
    .filter((z): z is (typeof ZONAS)[number] => Boolean(z) && z!.precioPaquete !== null)

  const sumaZonasSueltas = zonasComparables.reduce((acc, z) => acc + (z.precioPaquete ?? 0), 0)
  const ahorro =
    FULL_BODY.precioPaquete !== null && sumaZonasSueltas > FULL_BODY.precioPaquete
      ? sumaZonasSueltas - FULL_BODY.precioPaquete
      : null

  return (
    <PageShell
      eyebrow="Depilación láser"
      title="Cuerpo completo"
      // Mismo texto literal de antes, partido en dos: una frase como intro
      // corto (consistente con el resto del sitio) y el resto en una tarjeta
      // propia (`introExtra`) para que no se lea como un solo bloque gris
      // denso — nada de la redacción cambió, solo dónde respira cada parte.
      intro="Tratamiento de depilación láser/cera de cuerpo completo, diseñado para quienes buscan una solución integral y sin complicaciones."
      introExtra={
        <Reveal
          delay={100}
          className="mt-6 max-w-lg rounded-2xl border border-blush-200 bg-white p-6 shadow-[0_25px_50px_-32px_rgba(166,94,109,0.35)]"
        >
          <p className="text-base leading-relaxed text-neutral-500">
            Incluye piernas completas, brazos, axilas, espalda y zona íntima en un solo paquete, eliminando la
            necesidad de contratar tratamientos por separado. Ideal para ahorrar tiempo y dinero mientras se
            logra una piel suave y libre de vello en todo el cuerpo, con resultados progresivos sesión tras
            sesión.
          </p>
        </Reveal>
      }
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
    >
      <Reveal className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="space-y-7">
          <div className="flex flex-wrap items-center gap-3">
            <SectionHeading>Qué incluye</SectionHeading>
            {FULL_BODY.incluye.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-blush-600">
                {FULL_BODY.incluye.length} zonas en un solo paquete
              </span>
            )}
          </div>

          {FULL_BODY.incluye.length > 0 ? (
            <Stagger className="grid gap-4 sm:grid-cols-2" step={80}>
              {FULL_BODY.incluye.map((zona) => {
                const Icon = ZONA_ICONS[zona] ?? CheckIcon
                return (
                  <div
                    key={zona}
                    className="group flex items-center gap-4 rounded-2xl border border-black/[0.07] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blush-300 hover:shadow-[0_18px_40px_-22px_rgba(166,94,109,0.4)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blush-100 text-blush-600 transition-colors duration-300 group-hover:bg-blush-500 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium leading-snug text-neutral-800">{zona}</span>
                  </div>
                )
              })}
            </Stagger>
          ) : (
            <Placeholder label="Pendiente: listado de zonas incluidas en el Full Body" />
          )}

          {/*
            Se publica a propósito: es una de las preguntas frecuentes, y
            decirlo acá antes evita la conversación incómoda en la sucursal.
          */}
          <p className="rounded-xl bg-neutral-50 px-5 py-4 text-sm text-neutral-400">
            No incluye: {FULL_BODY.noIncluye.join(', ').toLowerCase()}.
          </p>
        </div>

        <div className="space-y-6">
          <SectionHeading>Precio</SectionHeading>
          {hayPrecio(FULL_BODY.precioSesion, FULL_BODY.precioPaquete) ? (
            <div className="relative">
              {/* Mismo blob difuminado en vino que VideoAccent/Laser.tsx usan
                  como marco editorial — acá detrás de la tarjeta de precio en
                  vez del video, para que la tarjeta más importante de la
                  página no se vea plana junto a la lista de zonas. Tono claro
                  a propósito (no el degradado sólido burdeos de la primera
                  versión): mismo acento de marca, pero sin pesar tanto como
                  para competir con el resto de la página. */}
              <div
                aria-hidden="true"
                className="animate-drift-a absolute -right-8 -top-10 h-36 w-36 rounded-full bg-blush-200/60 blur-2xl"
              />
              <dl className="relative overflow-hidden rounded-3xl border border-blush-200 bg-gradient-to-br from-blush-50 via-white to-blush-100 p-8 shadow-[0_30px_70px_-35px_rgba(166,94,109,0.35)] sm:p-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-500 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white">
                  El paquete más completo
                </span>

                {filasPrecio.map((fila, index) => (
                  <div
                    key={fila.label}
                    className={`flex items-baseline justify-between gap-4 ${
                      index === 0 ? 'mt-7' : 'mt-6 border-t border-blush-200 pt-6'
                    }`}
                  >
                    <dt className="text-sm text-neutral-500">{fila.label}</dt>
                    {/* Sin font-display: Bodoni Moda dibuja el "$" con dos
                        rayas en vez de una — el resto del sitio tampoco pone
                        precios en esa fuente por lo mismo. */}
                    <dd className={fila.destacado ? 'text-4xl font-semibold text-blush-600' : 'text-xl text-neutral-900'}>
                      {fila.valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
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

      <div className="mt-24">
        <Quote>El paquete con mejor precio por área y el que más gente elige.</Quote>
      </div>

      {/* ------------------------------------------------- Beneficios ------ */}
      <Reveal className="mt-24">
        <SectionHeading>Por qué elegir Full Body</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          No es solo "todo junto": es la forma más simple de tratar tu cuerpo completo sin perder tiempo ni
          pagar de más.
        </p>

        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2" step={90}>
          {BENEFICIOS.map(({ key, Icon, title, text }) => (
            <div key={key} className="rounded-2xl border border-black/[0.07] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                <Icon />
              </span>
              <p className="mt-4 text-base font-medium text-neutral-900">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{text}</p>
            </div>
          ))}
        </Stagger>
      </Reveal>

      {/* --------------------------------------------- Compara y ahorra --- */}
      {ahorro !== null && (
        <Reveal className="mt-24">
          <SectionHeading>Compara y ahorra</SectionHeading>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
            Así se compara el Full Body contra contratar cada zona por separado — sin contar la zona íntima,
            que el paquete también incluye.
          </p>

          <div className="mt-8 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-black/[0.07] bg-white p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">Por separado</p>
              <ul className="mt-5 space-y-3">
                {zonasComparables.map((zona) => (
                  <li key={zona.slug} className="flex items-baseline justify-between gap-4 text-sm text-neutral-600">
                    <span>{zona.nombre}</span>
                    <span>{formatPrecio(zona.precioPaquete)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-black/[0.07] pt-5">
                <span className="text-sm font-medium text-neutral-900">Total</span>
                <span className="text-xl text-neutral-900">{formatPrecio(sumaZonasSueltas)}</span>
              </div>
            </div>

            <div aria-hidden="true" className="hidden justify-self-center text-2xl text-blush-300 md:block">
              →
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-blush-300 bg-gradient-to-br from-blush-50 to-white p-6 shadow-[0_25px_55px_-30px_rgba(166,94,109,0.4)] sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-blush-500">
                Full Body (+ zona íntima)
              </p>
              <p className="mt-5 text-4xl font-semibold text-neutral-900">{formatPrecio(FULL_BODY.precioPaquete)}</p>
              <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blush-500 px-3 py-1.5 text-xs font-medium text-white">
                Ahorras {formatPrecio(ahorro)}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-24">
        <Quote>Piernas, brazos, axilas, espalda y zona íntima. Una sola cita.</Quote>
      </div>

      {/*
        Video junto a las reseñas, no solo en el header: con una sola reseña
        cargada para esta página, el grid de TestimoniosSection deja columnas
        vacías en desktop — mismo patrón que el VideoAccent de la sección de
        FAQ en Hifu.tsx (`hidden md:block`, se estira con el resto del grid).
      */}
      <Reveal className="mt-24 grid gap-10 md:grid-cols-[1fr_320px]">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER_CUERPO_COMPLETO} />
        <VideoAccent
          src={FULL_BODY_VIDEO_PRINCIPAL}
          poster={FULL_BODY_VIDEO_PRINCIPAL_POSTER}
          caption={{ tag: 'Sesión real', title: 'Full Body en Cire' }}
          className="hidden min-h-[22rem] md:block"
        />
      </Reveal>

      {/* ------------------------------------------------------- FAQ ------- */}
      <Reveal className="mt-24">
        <SectionHeading>Antes de decidir</SectionHeading>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2" step={90}>
          {PREGUNTAS_FULL_BODY.map((item) => (
            <div key={item.key} className="rounded-2xl border border-black/[0.07] bg-white p-6">
              <p className="text-lg font-medium text-neutral-900">{item.pregunta}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.respuesta}</p>
            </div>
          ))}
        </Stagger>
      </Reveal>

      <div className="mt-24">
        <WhatsAppSection
          id="agendar"
          context={ctaContext}
          titulo="¿Empezamos con el Full Body?"
          texto="Resultados visibles desde la primera sesión. Te confirmamos precio, sesiones y disponibilidad por WhatsApp."
        >
          Consultar por WhatsApp
        </WhatsAppSection>
      </div>
    </PageShell>
  )
}
