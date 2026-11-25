import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CarruselTratamientos } from '../components/CarruselTratamientos'
import type { DiapositivaTratamiento } from '../components/CarruselTratamientos'
import { Faq } from '../components/Faq'
import { HeroScroll } from '../components/HeroScroll'
import { IncluyePaquete } from '../components/IncluyePaquete'
import { ImagenPendiente, existeImagen, urlImagen } from '../components/ImagenPendiente'
import { VideoSesion } from '../components/VideoSesion'
import { ChipsIncluye, CuponPromo, PaquetesGrid, ZonasGrid } from '../components/ZonasGrid'
import type { ZonaTile } from '../components/ZonasGrid'
import { elegirVideos, rutaVideo, VIDEOS } from '../data/videos-sesion'
import { Section } from '../components/Section'
import { SucursalesHome } from '../components/SucursalesHome'
import { AgendarCTA, WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useFaqJsonLd, useLocalBusinessJsonLd } from '../hooks/useJsonLd'
import type { WhatsAppClickContext } from '../lib/analytics'
import { GOOGLE_CALIFICACION, MARCA } from '../data/marca'
import { FAQ_HOME } from '../data/faq'
import { CERA, FULL_BODY, HIFU_PROTOCOLOS, NIVELES_BIKINI, OTROS_SERVICIOS, PROMO_ACTIVA, ZONAS, formatPrecio } from '../data/precios'
import { PROMO_TEMPORADA } from '../data/promos'
import { DIAGRAMA_FULL_BODY_ALT, RUTA_DIAGRAMA, TRATAMIENTOS_FOTO } from '../data/imagenes'
import { cuponVigente, fullBodyVista, paquetesHome, revisarCoherenciaZonas } from '../lib/precios'
import { TESTIMONIOS_HOME } from '../data/testimonios'

const PROMO_CONDICION = `${PROMO_TEMPORADA.condicion} ${PROMO_TEMPORADA.aviso}`

/*
 * Home (rediseño "La cabina Cire", nov/26). La interfaz es sobria (hueso y
 * ciruela) y el color lo ponen las fotos. Fondos, en orden: hueso (hero) ·
 * blanco (precios) · ciruela (¿Duele?) · hueso (sesión) · rosa satinado
 * (reseñas) · hueso (otros) · rosa satinado (sucursales) · hueso (FAQ y
 * cierre). Nunca dos rosas seguidas. Ver DESIGN.md.
 *
 * Todo número sale de lib/precios.ts: precio vigente, tachado y ahorro.
 */

/** Zonas de la rejilla "Elige la zona", en orden del cuerpo (de rostro a piernas). */
const ZONAS_REJILLA = [
  'rostro-completo',
  'bigote',
  'axilas',
  'brazos-completos',
  'espalda-completa',
  'bikini',
  'medias-piernas',
  'piernas-completas',
] as const

function buildZonas(): ZonaTile[] {
  return ZONAS_REJILLA.flatMap((slug): ZonaTile[] => {
    if (slug === 'bikini') {
      const nivel = NIVELES_BIKINI[0]
      return [
        {
          slug,
          slugPrecio: nivel.slug,
          nombre: 'Bikini',
          detalle: `${nivel.sesiones ?? 8} sesiones, desde`,
          sku: `laser-${nivel.slug}`,
          mensaje: `láser ${nivel.nombre}`,
        },
      ]
    }
    const zona = ZONAS.find((z) => z.slug === slug)
    if (!zona) return []
    return [
      {
        slug,
        nombre: zona.nombre.charAt(0) + zona.nombre.slice(1).toLowerCase(),
        detalle: zona.opciones
          ? `${zona.sesiones ?? 8} sesiones, ${zona.opciones.map((o) => o.nombre.toLowerCase()).join(' o ')}`
          : `${zona.sesiones ?? 8} sesiones`,
        sku: `laser-zona-${slug}`,
        mensaje: `láser en ${zona.nombre}`,
        opciones: zona.opciones,
      },
    ]
  })
}

const ZONAS_HOME = buildZonas()

/** Perfil público de reseñas: la búsqueda de la marca en Google Maps. */
const GOOGLE_MAPS_RESENAS = 'https://www.google.com/maps/search/Cire+Depilaci%C3%B3n'

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase()
}

/*
 * Diapositivas del carrusel "Otros tratamientos". Los precios salen de
 * data/precios.ts. Para poner el video en bucle de cada tratamiento: subir el
 * .mp4 a public/videos/otros/ y llenar `video` (y si se quiere, un poster
 * .jpg con el primer frame en `poster`).
 */
const precioCera = (slug: string) => formatPrecio(CERA.find((z) => z.slug === slug)?.precio ?? null) ?? ''
const precioHifu = (slug: string) => formatPrecio(HIFU_PROTOCOLOS.find((p) => p.slug === slug)?.precioDesde ?? null) ?? ''

const OTROS: DiapositivaTratamiento[] = [
  {
    to: '/cera',
    titulo: 'Depilación con cera',
    bajada: 'Cera italiana, resultado inmediato.',
    descripcion:
      'Retira el vello desde la raíz en una sola visita. Es la opción para quien prefiere un resultado al momento o no es candidata a láser.',
    precios: [
      { etiqueta: 'Axilas', precio: precioCera('axilas') },
      { etiqueta: 'Bikini básico', precio: precioCera('bikini-basico') },
      { etiqueta: 'Piernas completas', precio: precioCera('piernas-completas') },
    ],
    // video: '/videos/otros/cera.mp4',
    poster: TRATAMIENTOS_FOTO.cera.actual,
    alt: TRATAMIENTOS_FOTO.cera.alt,
  },
  {
    to: '/hifu',
    titulo: 'HIFU 4D',
    bajada: 'Lifting sin cirugía.',
    descripcion:
      'Ultrasonido focalizado que trabaja en las capas profundas de la piel para reafirmarla y dar un efecto tensor, sin cortes ni tiempo de recuperación.',
    precios: [
      { etiqueta: 'Cire Lift, 1 sesión', precio: precioHifu('cire-lift-1-sesion') },
      { etiqueta: 'Cire Lift, 2 sesiones', precio: precioHifu('cire-lift-2-sesiones') },
      { etiqueta: 'Skin Renew, desde', precio: precioHifu('skin-renew-1') },
    ],
    // video: '/videos/otros/hifu.mp4',
    poster: TRATAMIENTOS_FOTO.hifu.actual,
    alt: TRATAMIENTOS_FOTO.hifu.alt,
  },
  {
    to: '/otros-servicios',
    titulo: 'Tratamientos corporales',
    bajada: 'Moldeo, anticelulítico y post-operatorio.',
    descripcion:
      'Protocolos por número de sesiones para moldear la figura, suavizar la celulitis o acompañar la recuperación después de una cirugía.',
    precios: OTROS_SERVICIOS.map((s) => ({
      etiqueta: `${s.nombre}, desde`,
      precio: formatPrecio(s.precioDesde) ?? '',
    })),
    // video: '/videos/otros/corporales.mp4',
    poster: TRATAMIENTOS_FOTO.corporales.actual,
    alt: TRATAMIENTOS_FOTO.corporales.alt,
  },
]

/** Las cuatro preguntas que frenan la decisión; el resto vive en /laser. */
const FAQ_VISIBLES = FAQ_HOME.slice(0, 4)

const CTA_HERO: WhatsAppClickContext = {
  sku: 'home-hero',
  nombre: 'depilación láser',
  categoria: 'laser',
  placement: 'hero',
}

const CTA_FULL_BODY: WhatsAppClickContext = {
  sku: 'full-body',
  nombre: 'el Full Body',
  categoria: 'laser',
  placement: 'card',
  articulo: 'el',
  valor: FULL_BODY.precioPaquete ?? undefined,
}

const CTA_FINAL: WhatsAppClickContext = {
  sku: 'home-cta-final',
  nombre: 'la promoción de primera sesión',
  categoria: 'general',
  placement: 'seccion',
  articulo: 'la',
  intencion: 'agendar',
}

function H2({ children, className = '', oscuro = false }: { children: ReactNode; className?: string; oscuro?: boolean }) {
  return (
    <h2
      className={`text-[2.125rem] leading-[1.05] text-balance sm:text-[3rem] ${oscuro ? 'text-hueso' : 'text-ink'} ${className}`}
    >
      {children}
    </h2>
  )
}

function Lead({ children, className = '', oscuro = false }: { children: ReactNode; className?: string; oscuro?: boolean }) {
  return (
    <p className={`mt-4 max-w-[60ch] text-[17px] leading-relaxed ${oscuro ? 'text-hueso/80' : 'text-neutral-700'} ${className}`}>
      {children}
    </p>
  )
}

function TextLink({ to, href, children }: { to?: string; href?: string; children: ReactNode }) {
  const className =
    'inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink'
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to ?? '/'} className={className}>
      {children}
    </Link>
  )
}

function Estrellas() {
  return (
    <span className="inline-flex gap-0.5 text-magenta" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  )
}

/*
 * Calificación de Google. Solo se pinta con datos verificados en
 * GOOGLE_CALIFICACION (marca.ts). Sin datos: nada en producción y un recuadro
 * "dato pendiente" en desarrollo, para que no se olvide.
 */
function CalificacionGoogle({ className = '' }: { className?: string }) {
  const { rating, total } = GOOGLE_CALIFICACION
  if (rating && total) {
    return (
      <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink ${className}`}>
        <Estrellas />
        <span>
          <strong className="font-semibold">{rating}</strong> de 5 en Google con {total.toLocaleString('es-MX')} reseñas
        </span>
      </p>
    )
  }
  if (!import.meta.env.DEV) return null
  return (
    <p className={`inline-flex rounded-btn border border-dashed border-neutral-400 px-2 py-1 text-[12px] text-neutral-500 ${className}`}>
      TODO: [RATING] en Google con [N] reseñas (marca.ts, GOOGLE_CALIFICACION)
    </p>
  )
}

/*
 * Hero controlado por el scroll: video 1 a pantalla completa, al terminar
 * entran estos textos y el video pasa al panel, y luego avanza el video 2.
 * Ver HeroScroll. El texto se compacta en celular para que quepa junto al
 * panel en una sola pantalla.
 */
function Hero() {
  return (
    <HeroScroll>
      <h1 className="heading-1 text-[2.125rem] leading-[1.02] text-ink sm:text-[3.25rem] lg:text-[3.25rem] xl:text-[3.75rem]">
        Depilación láser diodo en CDMX y Metepec
      </h1>
      <p className="mt-3 max-w-[34rem] text-[16px] leading-relaxed text-neutral-700 sm:mt-5 sm:text-lg">
        Resultados visibles desde la primera sesión, con punta de zafiro que enfría la piel al momento.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 sm:mt-7">
        <WhatsAppCTA context={CTA_HERO} className="w-full sm:w-auto">
          Cotizar por WhatsApp
        </WhatsAppCTA>
        <TextLink href="#precios">Ver precios</TextLink>
      </div>

      {/* Franja de confianza: solo datos reales. En celulares bajitos se
          oculta para que el panel tenga espacio. */}
      <div className="mt-4 flex flex-col gap-2 border-t border-linea pt-4 max-lg:[@media(max-height:760px)]:hidden sm:mt-8 sm:pt-5">
        <CalificacionGoogle />
        <p className="text-[14px] text-neutral-700 sm:text-[15px]">
          <strong className="font-semibold text-ink">{MARCA.anosExperiencia} años</strong> de experiencia ·{' '}
          <strong className="font-semibold text-ink">{MARCA.cantidadSucursales} sucursales</strong>: Polanco, Del Valle,
          Coapa, Oriente y Metepec
        </p>
      </div>
    </HeroScroll>
  )
}

/*
 * Selector "zona individual / paquete". Las dos vistas están siempre en el
 * HTML (la inactiva con `hidden`), así Google lee el texto de ambas. Sin
 * paquetes con precio vigente queda solo la vista por zona.
 */
function EligeZonaOPaquete() {
  const paquetes = paquetesHome()
  const cupon = cuponVigente()
  const hayPaquetes = paquetes.length > 0
  const [vista, setVista] = useState<'zona' | 'paquete'>('zona')

  const pestana = (id: 'zona' | 'paquete', texto: string) => {
    const activa = vista === id
    return (
      <button
        type="button"
        role="tab"
        id={`tab-${id}`}
        aria-selected={activa}
        aria-controls={`panel-${id}`}
        tabIndex={activa ? 0 : -1}
        onClick={() => setVista(id)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            const otra = id === 'zona' ? 'paquete' : 'zona'
            setVista(otra)
            document.getElementById(`tab-${otra}`)?.focus()
          }
        }}
        className={`min-h-11 flex-1 whitespace-nowrap rounded-btn px-3 text-[14px] font-semibold transition-colors sm:flex-none sm:px-4 sm:text-[15px] ${
          activa ? 'bg-ink text-white' : 'text-ink hover:bg-rosa-satin'
        }`}
      >
        {texto}
      </button>
    )
  }

  return (
    <div id="elige" className="scroll-anchor mt-20 border-t border-linea pt-14 sm:mt-24 sm:pt-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-[1.75rem] leading-tight text-ink sm:text-[2.25rem]">
            {vista === 'zona' ? 'Elige la zona individual' : 'O mejor, escoge un paquete'}
          </h3>
          <p className="mt-2 text-[17px] text-neutral-700">
            {vista === 'zona'
              ? 'Precio por paquete de 8 sesiones de cada zona.'
              : `Combos de varias zonas en 8 sesiones${cupon ? `, con precio de ${cupon.nombre}` : ''}.`}
          </p>
        </div>
        {hayPaquetes && (
          <div role="tablist" aria-label="Ver precios por" className="flex gap-1 rounded-card border border-linea bg-white p-1">
            {pestana('zona', 'Zona individual')}
            {pestana('paquete', 'O mejor, un paquete')}
          </div>
        )}
      </div>

      <div id="panel-zona" role="tabpanel" aria-labelledby="tab-zona" hidden={vista !== 'zona'} className="mt-8">
        <ZonasGrid zonas={ZONAS_HOME} />
        <div className="mt-10 border-t border-linea pt-4">
          <TextLink to="/laser/zonas">Ver las {ZONAS.length} zonas y combos</TextLink>
        </div>
      </div>

      {hayPaquetes && (
        <div id="panel-paquete" role="tabpanel" aria-labelledby="tab-paquete" hidden={vista !== 'paquete'} className="mt-8">
          <PaquetesGrid paquetes={paquetes} cupon={cupon} />
          {cupon && (
            <p className="mt-10 max-w-[62ch] border-t border-linea pt-4 text-[15px] text-neutral-600">
              {PROMO_CONDICION}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Precios() {
  const fb = fullBodyVista()
  const cupon = cuponVigente()

  return (
    <Section id="precios" className="bg-white">
      <div className="max-w-3xl">
        <H2>Precios por paquete</H2>
        <Lead className="mt-3 max-w-none">
          Paquetes de 8 sesiones con el {MARCA.protocolo}. Precio final en tu evaluación sin costo.
        </Lead>
        {PROMO_ACTIVA && cupon && (
          <p className="mt-4 text-[15px] text-neutral-700">
            <a href="#elige" className="font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
              Promoción {PROMO_ACTIVA.nombre}
            </a>{' '}
            con precios especiales {cupon.hasta}.
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:items-start lg:gap-12">
        <article>
          <div className="flex flex-col">
            <h3 className="text-[2rem] leading-none text-ink">Full Body</h3>
            <p className="mt-2 text-[15px] text-neutral-600">Cuerpo completo en {fb.sesiones} sesiones</p>

            {fb.enPromo && cupon && <CuponPromo nombre={cupon.nombre} hasta={cupon.hasta} className="mt-5 self-start" />}

            <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
              <span className="text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
                {formatPrecio(fb.precio) ?? 'Precio por WhatsApp'}
              </span>
              {fb.tachado !== null && (
                <span className="text-[17px] text-neutral-500 line-through tabular-nums">
                  <span className="sr-only">Precio regular </span>
                  {formatPrecio(fb.tachado)}
                </span>
              )}
            </p>
            {fb.ahorro !== null && (
              <p className="mt-2 text-[14px] font-semibold text-magenta">
                Ahorras {formatPrecio(fb.ahorro)} contra zonas por separado
              </p>
            )}
            {fb.msi && <p className="mt-1 text-[14px] text-neutral-600">Hasta {fb.msi} meses sin intereses</p>}

            <div className="mt-5">
              <ChipsIncluye incluye={fb.incluye} id="full-body" />
            </div>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <WhatsAppCTA context={CTA_FULL_BODY} className="w-full whitespace-nowrap sm:w-auto">
                Cotizar Full Body
              </WhatsAppCTA>
              <span className="whitespace-nowrap">
                <TextLink to="/laser/cuerpo-completo">Qué incluye</TextLink>
              </span>
            </div>
          </div>
        </article>

        {/* Diagrama de zonas: los nombres vienen dentro de la imagen, por eso
            se abre en grande al tocarlo y el alt los repite. */}
        {existeImagen(RUTA_DIAGRAMA) && (
          <a
            href={urlImagen(RUTA_DIAGRAMA)}
            target="_blank"
            rel="noopener"
            className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ciruela"
          >
            <ImagenPendiente
              ruta={RUTA_DIAGRAMA}
              proporcion="3:4"
              alt={DIAGRAMA_FULL_BODY_ALT}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              className="rounded-card"
            />
            <span className="mt-2 block text-[14px] text-neutral-600">Toca el diagrama para verlo en grande</span>
          </a>
        )}

        <div className="sm:col-span-2 lg:col-span-1">
          <IncluyePaquete />
        </div>
      </div>

      <EligeZonaOPaquete />
    </Section>
  )
}

/*
 * "¿Duele?": la única sección oscura del home. El macro de la punta de zafiro
 * con su luz violeta es el momento memorable; la tabla de protocolo,
 * tecnología y experiencia repetía el hero y quedó en una línea.
 */
function Protocolo() {
  return (
    <Section id="protocolo" tone="dark">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <ImagenPendiente
          ruta="tecnologia/punta-zafiro.jpg"
          proporcion="1:1"
          alt="Punta de zafiro del Láser Expert 8 sobre la piel, con la luz violeta encendida"
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="rounded-media"
        />
        <div>
          <H2 oscuro>¿Duele? Mucho menos de lo que imaginas.</H2>
          <Lead oscuro>{FAQ_HOME[0].respuesta}</Lead>
          {/* TODO(datos): agregar marca y modelo del equipo láser cuando el equipo los confirme. */}
          <p className="mt-8 border-t border-hueso/15 pt-5 text-[15px] text-lila">
            {MARCA.protocolo} · {MARCA.tecnologia.toLowerCase()}
          </p>
        </div>
      </div>
    </Section>
  )
}

function Sesion() {
  // Rotación por visita: 3 de 6 videos, sin juntar el 2 y el 3 (ver data/videos-sesion.ts).
  const [videos] = useState(elegirVideos)

  return (
    <Section id="sesion">
      <H2>Así es una sesión en Cire</H2>
      <Lead>Así se vive una sesión en nuestras cabinas, de principio a fin. Activa el sonido para escuchar cada video.</Lead>

      <ul className="no-scrollbar -mx-6 mt-10 flex snap-x scroll-px-6 gap-4 overflow-x-auto px-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
        {videos.map((video) => (
          <li key={video.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
            <VideoSesion
              {...rutaVideo(video.id, urlImagen(`sesiones/${video.id}-poster.jpg`))}
              titulo={video.titulo}
              etiqueta={VIDEOS.find((v) => v.id === video.id)?.etiqueta}
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Resenas() {
  return (
    <Section id="resenas" tone="alt">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <H2>Lo que dicen nuestras clientas</H2>
          <Lead>Reseñas reales publicadas en Google Maps.</Lead>
        </div>
        <CalificacionGoogle className="lg:mb-1" />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {TESTIMONIOS_HOME.slice(0, 3).map((t) => (
          <figure key={t.autor} className="flex flex-col rounded-card bg-white p-6 sm:p-7">
            <blockquote className="flex-1 text-[16px] leading-relaxed text-neutral-800">“{t.texto}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-linea pt-5">
              {/* Iniciales y no la foto de perfil: las miniaturas de Google
                  recortadas a 40px se leían como manchas grises. */}
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lila text-[14px] font-semibold text-ink"
              >
                {iniciales(t.autor)}
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-ink">{t.autor}</span>
                <span className="block text-[14px] text-neutral-600">Reseña de Google</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <a
        href={GOOGLE_CALIFICACION.url ?? GOOGLE_MAPS_RESENAS}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
      >
        Ver todas las reseñas en Google Maps
      </a>
    </Section>
  )
}

function Otros() {
  return (
    <Section id="otros">
      <H2>Otros tratamientos</H2>
      <CarruselTratamientos diapositivas={OTROS} intervalo={8000} />
    </Section>
  )
}

function Cierre() {
  return (
    <section id="agendar" className="scroll-anchor pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid overflow-hidden rounded-media lg:grid-cols-2">
          <ImagenPendiente
            ruta="cta/recepcion.jpg"
            proporcion="3:2"
            alt="Recepción de una sucursal de CIRE Depilación"
            sizes="(min-width: 1024px) 36rem, 100vw"
            claseProporcion="aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[24rem]"
          />
          <div className="flex flex-col justify-center bg-rosa-promo px-6 py-10 sm:px-12 sm:py-14">
            <H2>10% en tu primera sesión o evaluación sin costo</H2>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-ink/80">
              Reserva en línea en la sucursal que te quede más cerca. Promoción exclusiva al agendar desde el sitio.
            </p>
            <div className="mt-8">
              <AgendarCTA context={CTA_FINAL} className="w-full sm:w-auto">
                Agendar cita
              </AgendarCTA>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  useDocumentMeta({
    title: 'Depilación láser en CDMX y Metepec — Cire Depilación',
    description:
      'Depilación láser de diodo con punta de zafiro, cera y HIFU. 5 sucursales: Polanco, Del Valle, Coapa, Oriente y Metepec. Agenda tu evaluación por WhatsApp.',
  })

  /*
   * Los dos bloques de structured data van solo en el home: es la página que
   * describe al negocio completo. El FAQPage marca exactamente las preguntas
   * visibles, ni una más.
   */
  useLocalBusinessJsonLd()
  useFaqJsonLd(FAQ_VISIBLES)
  revisarCoherenciaZonas()

  return (
    <>
      <Hero />
      <Precios />
      <Protocolo />
      <Sesion />
      <Resenas />
      <Otros />
      <Section id="ubicaciones" tone="alt">
        <SucursalesHome />
      </Section>
      <Section id="faq">
        <Faq
          items={FAQ_VISIBLES}
          intro="Lo que más nos preguntan antes de la primera cita. Si te queda otra duda, escríbenos por WhatsApp."
        />
      </Section>
      <Cierre />
    </>
  )
}
