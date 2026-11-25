import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Sucursal } from '../data/sucursales'
import { HORARIO, REGION_SIGLA, SUCURSALES } from '../data/sucursales'
import { SectionHeading } from './PageShell'
import { AgendarCTA } from './WhatsAppCTA'
import { ImagenPendiente } from './ImagenPendiente'

/*
 * Bloque de SEO local del home (05/ago/26).
 *
 * Existe porque las cinco sucursales solo aparecían en /ubicaciones: el home
 * —que concentra enlaces y tráfico de marca— no nombraba ni una zona. Para
 * "depilación láser Polanco" eso es dejar la pelea sin jugar.
 *
 * - Nombres de zona y entidades ("Ciudad de México", "Estado de México") van
 *   como texto real. La insignia muestra la sigla y arrastra el nombre
 *   completo en `sr-only` (ver REGION_SIGLA).
 * - La dirección va completa, tal cual el listado oficial (ver
 *   src/data/sucursales.ts): tiene que coincidir con la ficha de Google.
 * - Cada sucursal lleva su propio CTA con `sucursal` e `intencion: 'agendar'`.
 *
 * ---------------------------------------------------------------------------
 * REDISEÑO A PANELES VERTICALES (25/nov/26)
 * ---------------------------------------------------------------------------
 * Reemplaza las pestañas + mapa embebido. Cinco paneles de foto en fila: uno
 * abierto, los otros cuatro angostos con el nombre en vertical. Pasar el
 * cursor (o tocar, o llegar con Tab) abre ese panel y cierra el anterior; al
 * salir del bloque queda abierto el último, no vuelve al primero.
 *
 * El movimiento es una transición de `flex-grow` con curva de salida larga
 * (no width en px), así el que se abre y el que se cierra se reparten el
 * espacio en el mismo cuadro y nunca hay salto. El contenido del panel abierto
 * tiene ancho FIJO y está anclado abajo a la izquierda: mientras el panel
 * crece, el texto no se re-acomoda, solo se va descubriendo — eso es lo que
 * hace que se sienta fluido y no "elástico".
 *
 * En celular es el mismo acordeón pero en columna (crece la altura).
 *
 * El contenido de los cinco paneles está SIEMPRE en el HTML (los cerrados lo
 * tienen con opacidad 0 e `inert`), por la misma razón de SEO de arriba: las
 * cinco direcciones son lo que este bloque posiciona.
 *
 * El mapa embebido salió del home: cinco iframes de Google en medio de la
 * página no compensaban. "Ver mapa" lleva a Google Maps o a la página de la
 * sucursal, que sí lo embebe.
 */

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path
        d="M9 4 3.5 6.2v13.3L9 17.3l6 2.4 5.5-2.2V4.2L15 6.4 9 4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 4v13.3M15 6.4v13.3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

/*
 * "Ver mapa" apunta al link oficial de Google Maps cuando existe, y cae en la
 * página de la sucursal cuando no (esa página embebe el mapa por dirección).
 */
function BotonMapa({ sucursal }: { sucursal: Sucursal }) {
  const clase =
    'inline-flex min-h-12 items-center justify-center gap-1.5 rounded-btn border border-white/40 px-5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white/10'

  if (sucursal.mapsUrl) {
    return (
      <a
        href={sucursal.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clase}
        aria-label={`Ver ${sucursal.nombre} en Google Maps`}
      >
        <MapIcon />
        Ver mapa
      </a>
    )
  }

  return (
    <Link to={`/ubicaciones/${sucursal.slug}`} className={clase} aria-label={`Ver el mapa de ${sucursal.nombre}`}>
      <MapIcon />
      Ver mapa
    </Link>
  )
}

/* Curva de salida larga: arranca rápido y se asienta despacio. */
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

/*
 * Respaldo mientras falta la foto (hoy Polanco): un degradado de marca en vez
 * de la tarjeta blanca "Imagen pendiente", que en un panel oscuro con texto
 * blanco encima se vería roto. En desarrollo se marca igual.
 */
function RespaldoFoto() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,var(--color-morado-700),var(--color-ink)_70%)]">
      {import.meta.env.DEV && (
        <span className="absolute right-3 top-3 rounded bg-white/15 px-2 py-1 text-[11px] text-white/80">
          Foto pendiente
        </span>
      )}
    </div>
  )
}

interface PanelProps {
  sucursal: Sucursal
  activo: boolean
  /** `inmediato` salta la espera de intención de hover (clic, foco). */
  onAbrir: (inmediato?: boolean) => void
}

function PanelSucursal({ sucursal, activo, onAbrir }: PanelProps) {
  const sigla = REGION_SIGLA[sucursal.region]

  function alEntrar(event: PointerEvent<HTMLElement>) {
    // Solo mouse/lápiz: en touch el `pointerenter` llega junto con el tap y
    // abriría el panel antes de que la persona decida.
    if (event.pointerType !== 'touch') onAbrir()
  }

  return (
    <article
      id={`sucursal-${sucursal.slug}`}
      onPointerEnter={alEntrar}
      onFocus={() => onAbrir(true)}
      className={`group relative min-h-0 min-w-0 overflow-hidden rounded-media bg-ink transition-[flex] duration-700 motion-reduce:transition-none ${EASE} ${
        activo ? 'flex-[1_1_4rem] lg:flex-[1_1_4.75rem]' : 'flex-[0_0_4rem] cursor-pointer lg:flex-[0_0_4.75rem]'
      }`}
    >
      {/*
       * Foto: el collage del flyer oficial (fachada + dos interiores, 892×629).
       * En escritorio llena el panel; abierto se centra para que entren las
       * tres fotos, cerrado se corre a la izquierda para que la franja muestre
       * la fachada y no el margen rosa entre fotos. En celular va completo
       * arriba del panel, con la info debajo, porque un panel vertical
       * recortaría el collage a una sola foto.
       */}
      <div
        className={`absolute inset-x-0 top-0 aspect-[892/629] transition-transform duration-[1200ms] motion-reduce:transition-none lg:inset-0 lg:aspect-auto ${EASE} ${
          activo ? 'scale-100' : 'scale-110'
        }`}
      >
        <ImagenPendiente
          ruta={`sucursales/${sucursal.slug}.jpg`}
          proporcion="892:629"
          claseProporcion="h-full w-full"
          alt={`Fachada e interiores de CIRE ${sucursal.nombre}`}
          sizes="(min-width: 1024px) 44rem, 100vw"
          imgClassName={`transition-[object-position] duration-700 motion-reduce:transition-none ${EASE} ${
            activo ? 'object-left lg:object-center' : 'object-left'
          }`}
          respaldo={<RespaldoFoto />}
        />
        {/* Fundido del collage hacia la info (solo celular). */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent lg:hidden" />
      </div>

      {/* Velo: más denso en los cerrados para que el abierto mande. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-ink transition-opacity duration-700 ${activo ? 'opacity-0' : 'opacity-45 group-hover:opacity-30'}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 hidden bg-gradient-to-t from-ink/95 via-ink/45 to-transparent transition-opacity duration-700 lg:block ${
          activo ? 'opacity-100' : 'opacity-60'
        }`}
      />

      {/*
       * Disparador del panel cerrado: cubre todo el panel, así el toque en
       * celular y el Enter con teclado abren. Lleva el nombre en vertical
       * (horizontal en celular). Cuando el panel está abierto se retira del
       * orden de foco para que Tab siga a los botones de adentro.
       */}
      <button
        type="button"
        onClick={() => onAbrir(true)}
        aria-expanded={activo}
        aria-controls={`sucursal-${sucursal.slug}-info`}
        tabIndex={activo ? -1 : 0}
        className={`absolute inset-0 flex items-center px-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blush-300 lg:items-end lg:justify-center lg:px-0 lg:pb-5 ${
          activo ? 'pointer-events-none' : ''
        }`}
      >
        <span
          className={`flex items-center gap-3 transition-[opacity,transform] duration-500 ${EASE} lg:[writing-mode:vertical-rl] lg:rotate-180 ${
            activo ? 'translate-y-2 opacity-0' : 'opacity-100 delay-200'
          }`}
        >
          <span className="font-display text-xl font-medium tracking-tight text-white">{sucursal.nombre}</span>
          <span className="text-[11px] font-semibold tracking-[0.14em] text-white/70">{sigla}</span>
        </span>
      </button>

      {/*
       * Contenido del panel abierto. Ancho fijo en escritorio (ver nota de
       * arriba) y entrada escalonada: aparece cuando el panel ya ganó la mayor
       * parte de su espacio, y al cerrarse se va de inmediato.
       */}
      <div
        id={`sucursal-${sucursal.slug}-info`}
        inert={!activo}
        className={`absolute inset-x-0 bottom-0 p-5 text-white transition-[opacity,transform] motion-reduce:transition-none sm:p-8 lg:right-auto lg:w-[30rem] ${EASE} ${
          activo ? 'translate-y-0 opacity-100 delay-300 duration-700' : 'translate-y-4 opacity-0 duration-200'
        }`}
      >
        <span className="inline-flex rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold tracking-[0.14em]">
          {sigla}
          <span className="sr-only"> — {sucursal.region}</span>
        </span>

        <h3 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">{sucursal.nombre}</h3>

        <div className="mt-5 flex items-start gap-2.5 text-white/85">
          <span className="mt-0.5">
            <PinIcon />
          </span>
          <address className="text-sm not-italic leading-relaxed">
            {sucursal.direccion || 'Agenda y te confirmamos la dirección exacta por WhatsApp.'}
          </address>
        </div>

        {/* En celular el horario ya está en el párrafo de arriba y no cabe
            junto al collage; queda en el HTML igual. */}
        <div className="mt-3 hidden items-start gap-2.5 text-white/85 lg:flex">
          <span className="mt-0.5">
            <ClockIcon />
          </span>
          <dl className="text-sm leading-relaxed">
            {HORARIO.map((horario) => (
              <div key={horario.dias} className="flex flex-wrap gap-x-2">
                <dt>{horario.dias}</dt>
                <dd className="font-medium text-white">{horario.horas}</dd>
              </div>
            ))}
          </dl>
        </div>

        {sucursal.telefono && (
          <p className="mt-3 text-sm text-white/85">
            Tel.{' '}
            <a
              href={`tel:${sucursal.telefono.replace(/\s/g, '')}`}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {sucursal.telefono}
            </a>
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <AgendarCTA
            variant="secondary"
            className="border-white! px-5!"
            context={{
              sku: `sucursal-${sucursal.slug}`,
              nombre: `una cita en ${sucursal.nombre}`,
              categoria: 'sucursal',
              placement: 'card',
              sucursal: sucursal.slug,
              intencion: 'agendar',
            }}
          >
            Agendar cita aquí
          </AgendarCTA>
          <BotonMapa sucursal={sucursal} />
        </div>
      </div>
    </article>
  )
}

export function SucursalesHome() {
  const [activo, setActivo] = useState(SUCURSALES[0].slug)
  const pendiente = useRef<number | undefined>(undefined)

  /*
   * Intención de hover: si el cursor solo cruza un panel camino a otro, no lo
   * abre. 90 ms no se percibe como retraso pero evita el parpadeo de abrir y
   * cerrar tres paneles en un barrido.
   */
  function abrir(slug: string, inmediato = false) {
    window.clearTimeout(pendiente.current)
    if (inmediato) {
      setActivo(slug)
      return
    }
    pendiente.current = window.setTimeout(() => setActivo(slug), 90)
  }

  useEffect(() => () => window.clearTimeout(pendiente.current), [])

  /* Flechas entre paneles para quien llega con teclado. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const adelante = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const atras = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!adelante && !atras) return

    event.preventDefault()
    const indice = SUCURSALES.findIndex((sucursal) => sucursal.slug === activo)
    const paso = adelante ? 1 : -1
    const siguiente = SUCURSALES[(indice + paso + SUCURSALES.length) % SUCURSALES.length]
    abrir(siguiente.slug, true)
    // Foco al primer control del panel nuevo (el botón de agendar), cuando ya
    // dejó de ser `inert`.
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`#sucursal-${siguiente.slug}-info a`)?.focus({ preventScroll: true }),
    )
  }

  return (
    <div>
      <SectionHeading>Encuentra tu Cire más cercana</SectionHeading>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
        Cinco sucursales entre Ciudad de México y el Estado de México: Polanco, Del Valle, Coapa, Oriente y
        Metepec. Todas atienden con cita — {HORARIO.map((h) => `${h.dias} ${h.horas}`).join(' y ')}.
      </p>

      <div
        onKeyDown={handleKeyDown}
        onPointerLeave={() => window.clearTimeout(pendiente.current)}
        className="mt-10 flex h-[calc(40.5rem_+_(100vw_-_3rem)_*_0.705)] flex-col gap-2 sm:h-[calc(40.5rem_+_(100vw_-_5rem)_*_0.705)] lg:h-[34rem] lg:flex-row lg:gap-3"
      >
        {SUCURSALES.map((sucursal) => (
          <PanelSucursal
            key={sucursal.slug}
            sucursal={sucursal}
            activo={sucursal.slug === activo}
            onAbrir={(inmediato) => abrir(sucursal.slug, inmediato || sucursal.slug === activo)}
          />
        ))}
      </div>
    </div>
  )
}
