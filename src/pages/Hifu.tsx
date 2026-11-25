import { useEffect } from 'react'
import { Faq } from '../components/Faq'
import { LoopVideo } from '../components/LoopVideo'
import { PageHeading, SectionHeading } from '../components/PageShell'
import { TestimoniosSection } from '../components/Testimonios'
import { VideoAccent } from '../components/VideoAccent'
import { AgendarCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useFaqJsonLd } from '../hooks/useJsonLd'
import {
  HIFU_VIDEO_MOBILE,
  HIFU_VIDEO_MOBILE_POSTER,
  HIFU_VIDEO_REFERENCIA_1,
  HIFU_VIDEO_REFERENCIA_1_POSTER,
  HIFU_VIDEO_REFERENCIA_2,
  HIFU_VIDEO_REFERENCIA_2_POSTER,
  HIFU_VIDEO_REFERENCIA_3,
  HIFU_VIDEO_REFERENCIA_3_POSTER,
} from '../lib/constants'
import { trackViewContent } from '../lib/analytics'
import { HIFU_PROTOCOLOS, PROMO_ACTIVA, formatPrecio } from '../data/precios'
import type { PaqueteConSesiones } from '../data/precios'
import { TESTIMONIOS_HIFU } from '../data/testimonios'

/*
 * HIFU 4D (rediseño nov/26). Mismo esqueleto que /laser/cuerpo-completo:
 * encabezado, precio inmediatamente después, y cierre en la oferta. Arma su
 * propio encabezado (no PageShell) porque el h1 y el texto de apoyo son
 * propios, pero copia su espaciado y tipografía.
 *
 * Todo número sale de HIFU_PROTOCOLOS (data/precios.ts). El paquete
 * `destacado` (Cire Lift 2 Sesiones) es la tarjeta rosa; el resto va en una
 * lista agrupada por línea de tratamiento.
 */

/* -------------------------------------------------------------------------- */
/* Contenido: copy propio de esta página, no datos de negocio.                */
/* -------------------------------------------------------------------------- */

const COMO_FUNCIONA = [
  {
    termino: 'Llegamos a donde importa',
    valor:
      'Usamos HIFU 4D (ultrasonido focalizado de alta intensidad), que alcanza la capa SMAS: la misma que se trabaja en un lifting quirúrgico, pero sin cirugía ni postoperatorio.',
  },
  {
    termino: 'Firmeza desde el primer día',
    valor:
      'El calor del ultrasonido contrae las fibras de colágeno al instante, dando una sensación de firmeza y tensión ya desde la primera sesión.',
  },
  {
    termino: 'Tu piel sigue trabajando después',
    valor:
      'En las semanas siguientes, tu piel produce colágeno y elastina nuevos. La firmeza y la definición siguen mejorando poco a poco, sin que tengas que hacer nada más.',
  },
]

const TIMELINE = [
  { label: 'Sesión', text: 'Sensación de firmeza inmediata.' },
  { label: '4 semanas', text: 'El colágeno empieza a activarse.' },
  { label: '8–12 semanas', text: 'Resultado visible: piel más firme y definida.' },
]

const DIFERENCIADORES = [
  { termino: 'Evaluación', valor: 'Evaluamos tu piel y tu grado de flacidez antes de empezar.' },
  { termino: 'Personalización', valor: 'Personalizamos las zonas y la profundidad de cada disparo.' },
  {
    termino: 'Combinación',
    valor: 'Combinamos tecnologías (HIFU, radiofrecuencia y faciales) cuando tu piel lo pide.',
  },
  { termino: 'Seguimiento', valor: 'Te acompañamos con seguimiento real de tu evolución.' },
]

/*
 * Respuestas tomadas del manual oficial de CIRE LIFT HIFU 4D (nov/26). Se
 * emiten también como FAQPage (useFaqJsonLd), así que siguen sus reglas: nada
 * de "indoloro", nada de resultados garantizados, y lo que depende de la
 * persona se dice así.
 */
const PREGUNTAS_HIFU = [
  {
    pregunta: '¿El HIFU duele?',
    respuesta:
      'Puede sentirse calor localizado, pequeños piquetes, presión u hormigueo durante la sesión. La sensación depende de tu sensibilidad y de la zona que trabajemos. Es un procedimiento no quirúrgico y no requiere incisiones.',
  },
  {
    pregunta: '¿Cuándo se ven los resultados?',
    respuesta:
      'Algunas personas perciben cambios iniciales después de la sesión y durante los siguientes 21 días. Como el HIFU estimula la remodelación natural del colágeno, el resultado sigue desarrollándose de forma progresiva en las semanas y meses posteriores.',
  },
  {
    pregunta: '¿Cuánto duran los resultados?',
    respuesta:
      'Como referencia, alrededor de 6 meses, y en algunos casos de prevención hasta 12 meses. Depende de tu edad, la condición de tu piel, tus hábitos y los cuidados posteriores.',
  },
  {
    pregunta: '¿Cuántas sesiones necesito?',
    respuesta:
      'Nuestro protocolo contempla como referencia un máximo de 2 sesiones al año, y no todas las personas necesitan las dos. La cantidad se define en tu valoración, según tu piel y lo que quieres trabajar.',
  },
  {
    pregunta: '¿Se puede hacer en rostro y cuerpo?',
    respuesta:
      'Sí. CIRE LIFT HIFU 4D se aplica en rostro y cuello, y en zonas corporales como abdomen, espalda baja, brazos, muslos y glúteos. La zona y la profundidad de trabajo se determinan en la valoración.',
  },
  {
    pregunta: '¿Hay tiempo de recuperación?',
    respuesta:
      'Por lo general puedes retomar tus actividades el mismo día. Después de la sesión puede haber enrojecimiento, sensibilidad, inflamación ligera u hormigueo temporal.',
  },
  {
    pregunta: '¿Quién necesita una valoración especial?',
    respuesta:
      'Si estás embarazada, tienes marcapasos o implantes en la zona, diabetes, lupus u otra condición médica, tomas medicamentos o te aplicaste bótox, ácido hialurónico o hilos tensores recientemente, coméntalo antes de agendar. Nuestro equipo revisa tu caso antes de confirmar el tratamiento.',
  },
  {
    pregunta: '¿Sí funciona?',
    respuesta:
      'El HIFU cuenta con evidencia clínica para favorecer la firmeza y el efecto lifting en determinados pacientes. Lo importante es si es ideal para tu piel: por eso siempre empezamos con una valoración sin costo antes de recomendarte nada.',
  },
]

const HERO_CTA_CONTEXT = {
  sku: 'hifu-hero',
  nombre: 'el Cire Lift Protocol',
  categoria: 'hifu',
  articulo: 'el',
} as const

/* -------------------------------------------------------------------------- */
/* Precios                                                                    */
/* -------------------------------------------------------------------------- */

function formatRango(desde: number | null, hasta?: number | null): string {
  const min = formatPrecio(desde)
  const max = hasta ? formatPrecio(hasta) : undefined
  if (!min) return 'Precio por WhatsApp'
  return max ? `${min}–${max}` : min
}

/** "Skin Renew (3 sesiones)" y "Cire Lift 1 Sesión" → "Skin Renew", "Cire Lift". */
function nombreLinea(nombre: string): string {
  return nombre.replace(/\s*\(.*\)$/, '').replace(/\s+\d+\s+sesi(ó|o)n(es)?$/i, '')
}

/** El resumen de varias líneas todavía es un "Pendiente: …" interno; no se publica. */
function resumenPublico(resumen: string): string | null {
  return resumen.startsWith('Pendiente') ? null : resumen
}

/** Paquetes no destacados, agrupados por línea en el orden del tarifario. */
function agruparPorLinea(paquetes: PaqueteConSesiones[]) {
  const grupos: { linea: string; paquetes: PaqueteConSesiones[] }[] = []
  for (const paquete of paquetes) {
    const linea = nombreLinea(paquete.nombre)
    const grupo = grupos.find((g) => g.linea === linea)
    if (grupo) grupo.paquetes.push(paquete)
    else grupos.push({ linea, paquetes: [paquete] })
  }
  return grupos
}

function contextoPaquete(paquete: PaqueteConSesiones) {
  return {
    sku: paquete.slug,
    nombre: paquete.nombre,
    categoria: 'hifu',
    placement: 'card' as const,
    valor: paquete.precioDesde ?? undefined,
  }
}

const DESTACADO = HIFU_PROTOCOLOS.find((p) => p.destacado) ?? HIFU_PROTOCOLOS[0]
const GRUPOS = agruparPorLinea(HIFU_PROTOCOLOS.filter((p) => p !== DESTACADO))

function Precios() {
  if (!DESTACADO) return null

  return (
    <section id="precios" className="scroll-anchor">
      <SectionHeading>Elige cómo empezar</SectionHeading>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
        Desde una sola sesión para conocer el efecto, hasta un protocolo completo pensado para resultados que se
        sostienen.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-8">
        <article className="rounded-2xl bg-blush-100 p-6 sm:p-8">
          <h3 className="text-2xl text-ink">{DESTACADO.nombre}</h3>
          <p className="mt-1 text-[15px] text-blush-900/80">
            {DESTACADO.incluye[0] ?? DESTACADO.duracion}. El más popular.
          </p>

          <p className="mt-6 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
            {formatRango(DESTACADO.precioDesde, DESTACADO.precioHasta)}
          </p>
          {resumenPublico(DESTACADO.resumen) && (
            <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-blush-900/85">{DESTACADO.resumen}</p>
          )}

          <AgendarCTA context={contextoPaquete(DESTACADO)} className="mt-8 w-full sm:w-auto">
            Agenda tu valoración
          </AgendarCTA>
        </article>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] sm:p-8">
          <h3 className="text-2xl text-ink">Todos los paquetes</h3>
          <p className="mt-1 text-[15px] text-neutral-600">HIFU 4D y tratamientos faciales, por número de sesiones</p>

          <div className="mt-2">
            {GRUPOS.map((grupo) => (
              <div key={grupo.linea} className="mt-6">
                <h4 className="text-[17px] font-semibold text-ink">{grupo.linea}</h4>
                <ul className="mt-1 divide-y divide-black/[0.08] border-t border-black/[0.08]">
                  {grupo.paquetes.map((paquete) => {
                    const resumen = resumenPublico(paquete.resumen)
                    return (
                      <li key={paquete.slug} className="flex items-center gap-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[17px] text-ink">{paquete.duracion}</p>
                          {resumen && <p className="text-[14px] leading-snug text-neutral-600">{resumen}</p>}
                        </div>
                        <p className="text-right text-[17px] font-semibold text-ink tabular-nums">
                          {formatRango(paquete.precioDesde, paquete.precioHasta)}
                        </p>
                        <AgendarCTA variant="link" context={contextoPaquete(paquete)}>
                          Agendar
                        </AgendarCTA>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Página                                                                     */
/* -------------------------------------------------------------------------- */

export function Hifu() {
  useDocumentMeta({
    title: 'HIFU 4D: lifting facial y corporal sin cirugía',
    description:
      'HIFU 4D para reafirmar y rejuvenecer rostro y cuerpo sin cirugía, desde las capas profundas de la piel. Protocolo, resultados y paquetes.',
  })
  useFaqJsonLd(PREGUNTAS_HIFU)

  useEffect(() => {
    trackViewContent({ nombre: 'Cire Lift Protocol — HIFU 4D', categoria: 'HIFU', sku: 'hifu' })
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-6 pt-[calc(6.5rem+var(--anuncio-h,0px))] sm:px-10 sm:pt-[calc(8.5rem+var(--anuncio-h,0px))]">
      {/* ---------------------------------------------------------- Hero --- */}
      <div className="grid items-center gap-10 md:grid-cols-[1fr_320px] md:gap-14">
        <div>
          <PageHeading>HIFU 4D: Cire Lift Protocol</PageHeading>
          <p className="mt-5 max-w-[60ch] text-[17px] font-semibold leading-relaxed text-ink sm:text-lg">
            Lifting sin cirugía, resultados desde el interior.
          </p>
          <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
            Un tratamiento diseñado para reafirmar, definir y rejuvenecer tu rostro y cuerpo trabajando desde las capas
            profundas de la piel. No buscamos un efecto de un día: buscamos que tu piel cambie desde adentro, con un
            resultado natural que se nota más con cada semana.
          </p>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <AgendarCTA context={{ ...HERO_CTA_CONTEXT, placement: 'hero' }} className="w-full sm:w-auto">
              Agenda tu valoración
            </AgendarCTA>
            <a
              href="#precios"
              className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Ver precios
            </a>
          </div>
        </div>

        {/* Clip vertical real de una sesión; solo desde md, igual que el
            acento de PageShell, para que en el celular el precio llegue antes. */}
        <div className="hidden overflow-hidden rounded-2xl bg-blush-100 md:block">
          <LoopVideo
            src={HIFU_VIDEO_MOBILE}
            poster={HIFU_VIDEO_MOBILE_POSTER}
            eager
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>

      {PROMO_ACTIVA && (
        <div className="mt-10 rounded-2xl bg-blush-100 px-6 py-4">
          <p className="text-[15px] text-blush-900/85">
            <span className="font-semibold text-ink">{PROMO_ACTIVA.nombre}:</span> {PROMO_ACTIVA.detalle}
          </p>
        </div>
      )}

      {/* ------------------------------------------------------- Precios --- */}
      <div className="mt-14">
        <Precios />
      </div>

      {/* ------------------------------------------------------ Problema --- */}
      <section className="mt-20 grid gap-10 sm:mt-28 md:grid-cols-[1fr_360px] md:items-center lg:gap-16">
        <div>
          <SectionHeading>¿Te reconoces en esto?</SectionHeading>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
            Muchas de nuestras clientas llegan notando lo mismo: pérdida de firmeza, un poco de papada, un rostro que ya
            no se ve tan definido como antes. No buscan un cambio drástico: buscan una solución natural, progresiva y
            segura, que respete su rostro en vez de transformarlo.
          </p>
        </div>
        <VideoAccent
          src={HIFU_VIDEO_REFERENCIA_1}
          poster={HIFU_VIDEO_REFERENCIA_1_POSTER}
          className="aspect-[4/3] w-full md:aspect-[4/5]"
        />
      </section>

      {/* ------------------------------------------------- Cómo funciona --- */}
      <section id="beneficios" className="scroll-anchor mt-20 sm:mt-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading>Cómo funciona</SectionHeading>
            <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
              Sin sonar a laboratorio: así es como tu piel va cambiando, paso a paso.
            </p>
          </div>
          <dl className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {COMO_FUNCIONA.map((paso) => (
              <div key={paso.termino} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-[15px] font-semibold text-morado-700">{paso.termino}</dt>
                <dd className="text-[17px] leading-snug text-ink">{paso.valor}</dd>
              </div>
            ))}
          </dl>
        </div>

        <h3 className="mt-14 text-2xl text-ink">Qué esperar con el tiempo</h3>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {TIMELINE.map((etapa) => (
            <li key={etapa.label} className="border-t border-black/[0.08] pt-4">
              <p className="text-[15px] font-semibold text-morado-700 tabular-nums">{etapa.label}</p>
              <p className="mt-1.5 text-[17px] leading-snug text-ink">{etapa.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------- Diferenciador --- */}
      <section className="mt-20 grid gap-10 sm:mt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading>No es solo una sesión de HIFU… es un protocolo diseñado según tu piel.</SectionHeading>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
            Eso es lo que nos separa de una clínica fría con sesiones genéricas: acá no hay dos protocolos iguales,
            porque no hay dos rostros iguales.
          </p>
        </div>
        <dl className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {DIFERENCIADORES.map((item) => (
            <div key={item.termino} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-semibold text-morado-700">{item.termino}</dt>
              <dd className="text-[17px] leading-snug text-ink">{item.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------- Reseñas --- */}
      <section id="resenas" className="scroll-anchor mt-20 sm:mt-28">
        <TestimoniosSection testimonios={TESTIMONIOS_HIFU} />
      </section>

      {/* ----------------------------------------------------------- FAQ --- */}
      <section className="mt-20 grid gap-10 sm:mt-28 lg:grid-cols-[1fr_280px] lg:gap-16">
        <Faq items={PREGUNTAS_HIFU} titulo="Preguntas frecuentes sobre HIFU" />
        <VideoAccent
          src={HIFU_VIDEO_REFERENCIA_2}
          poster={HIFU_VIDEO_REFERENCIA_2_POSTER}
          className="hidden aspect-[3/4] w-full lg:mt-24 lg:block"
        />
      </section>

      {/* ----------------------------------------------------- CTA final --- */}
      <WhatsAppSection
        id="agendar"
        accion="agendar"
        context={{ sku: 'hifu-cta-final', nombre: 'el Cire Lift Protocol', categoria: 'hifu', articulo: 'el' }}
        titulo="Empecemos con una valoración"
        texto="Ahí analizamos tu piel y te decimos exactamente qué zonas conviene trabajar, cómo, y qué resultado puedes esperar."
        videoSrc={HIFU_VIDEO_REFERENCIA_3}
        videoPoster={HIFU_VIDEO_REFERENCIA_3_POSTER}
        videoCaption={{ tag: 'HIFU 4D', title: 'Firmeza desde la primera sesión' }}
      >
        Agenda tu valoración
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </main>
  )
}
