import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Sucursal } from '../data/sucursales'
import { HORARIO, REGION_SIGLA, SUCURSALES, mapsEmbedUrl } from '../data/sucursales'
import { SectionHeading } from './PageShell'
import { Reveal } from './Reveal'
import { WhatsAppCTA } from './WhatsAppCTA'

/*
 * Bloque de SEO local del home (05/ago/26).
 *
 * Existe porque hasta ahora las cinco sucursales solo aparecían en
 * /ubicaciones: el home —que es la página que concentra los enlaces y el
 * tráfico de marca— no nombraba ni una zona. Para una búsqueda del tipo
 * "depilación láser Polanco" eso es dejar la pelea sin jugar.
 *
 * Tres decisiones que sostienen para qué está:
 *
 * - Los nombres de zona y las entidades ("Ciudad de México", "Estado de
 *   México") van como texto real, no dentro de una imagen ni detrás de un
 *   acordeón cerrado: es literalmente lo que se está tratando de posicionar.
 *   La insignia muestra la sigla (CDMX / EDOMEX) porque es lo que se escanea,
 *   y arrastra el nombre completo en un `sr-only` (ver REGION_SIGLA).
 * - La dirección va completa, tal cual el listado oficial (ver la nota de
 *   src/data/sucursales.ts). Una dirección parafraseada para que "se vea
 *   breve" es una dirección que no coincide con la ficha de Google Business, y
 *   esa coincidencia exacta es parte de lo que se está buscando.
 * - Cada tarjeta lleva su propio CTA a WhatsApp con `sucursal` e `intencion:
 *   'agendar'`, así el mensaje ya sale con la sucursal escrita (ver
 *   whatsapp.ts) y el clic queda desglosado por sucursal en Meta y GA4.
 *
 * ---------------------------------------------------------------------------
 * REDISEÑO A PESTAÑAS (05/ago/26)
 * ---------------------------------------------------------------------------
 * Antes eran cinco tarjetas: un riel horizontal en celular y una grilla de 2-3
 * columnas en escritorio. Cinco tarjetas parejas obligan a leer las cinco para
 * encontrar la propia, que es exactamente el trabajo que esta sección tendría
 * que ahorrar — nadie viene a comparar sucursales, viene a ver si hay una
 * cerca. Con pestañas la elección es un clic sobre el nombre de la zona (que es
 * el dato que la persona ya trae en la cabeza) y la tarjeta muestra UNA
 * sucursal con todo: dirección, horarios, mapa embebido y su botón de agendar.
 *
 * Los cinco paneles se renderizan SIEMPRE y los inactivos se ocultan con el
 * atributo `hidden`, en vez de montar solo el activo. No es un detalle de
 * implementación: las cinco direcciones y los cinco nombres de zona son el
 * contenido que este bloque existe para posicionar, y con render condicional el
 * HTML solo tendría uno. El único que sí es condicional es el <iframe> del mapa
 * — son 5 mapas de Google, no aportan nada al crawler y cargarlos todos de una
 * es exactamente lo que no se quiere en el medio del home.
 */

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-blush-500" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-blush-500" aria-hidden="true">
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
 * página de la sucursal cuando no (Oriente todavía no tiene `mapsUrl`): esa
 * página embebe el mapa por dirección con `mapsEmbedUrl`, así que el botón
 * cumple lo que promete en las cinco. El que sale del sitio abre en pestaña
 * nueva; el interno navega como cualquier link del router.
 */
function BotonMapa({ sucursal }: { sucursal: Sucursal }) {
  const clase =
    'inline-flex items-center justify-center gap-1.5 rounded-full border border-black/15 px-4 py-2.5 text-xs font-medium text-neutral-700 transition-colors duration-200 hover:border-blush-400 hover:text-neutral-900'

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

interface PanelProps {
  sucursal: Sucursal
  activo: boolean
  tabId: string
  panelId: string
}

function PanelSucursal({ sucursal, activo, tabId, panelId }: PanelProps) {
  const embed = mapsEmbedUrl(sucursal)

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      hidden={!activo}
      /*
       * `animate-fade-in-up` con `key` implícito por el remontaje no aplica acá
       * (el nodo vive siempre), así que la entrada se dispara por clase solo
       * cuando el panel está activo: al cambiar de pestaña el navegador
       * reinicia la animación porque el elemento pasa de `display:none` a
       * visible.
       */
      className={activo ? 'animate-fade-in-up motion-reduce:animate-none' : undefined}
    >
      <div className="grid gap-0 overflow-hidden rounded-3xl border border-black/[0.07] bg-white shadow-[0_25px_60px_-35px_rgba(166,94,109,0.5)] lg:grid-cols-[1fr_1.1fr]">
        <div className="p-6 sm:p-8">
          <span className="inline-flex w-fit items-center rounded-full bg-blush-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blush-600">
            {REGION_SIGLA[sucursal.region]}
            <span className="sr-only"> — {sucursal.region}</span>
          </span>

          {/* h3 y no un <span>: da la jerarquía correcta debajo del h2 del
              bloque, que es lo que lee un crawler cuando arma el listado de
              zonas de la página. */}
          <h3 className="mt-3 text-3xl leading-tight text-neutral-900">{sucursal.nombre}</h3>

          {/* Sin line-clamp: una dirección cortada a mitad no sirve ni para
              llegar ni para que coincida con la ficha de Google. */}
          <div className="mt-5 flex items-start gap-2.5">
            <span className="mt-0.5">
              <PinIcon />
            </span>
            <address className="text-sm not-italic leading-relaxed text-neutral-600">
              {sucursal.direccion || 'Agenda y te confirmamos la dirección exacta por WhatsApp.'}
            </address>
          </div>

          {/* Los horarios ahora van dentro de la tarjeta y no solo en el
              párrafo de arriba: es la segunda pregunta después de "¿dónde
              está?", y tenerla acá evita el viaje a /ubicaciones. */}
          <div className="mt-4 flex items-start gap-2.5">
            <span className="mt-0.5">
              <ClockIcon />
            </span>
            <dl className="text-sm leading-relaxed text-neutral-600">
              {HORARIO.map((horario) => (
                <div key={horario.dias} className="flex flex-wrap gap-x-2">
                  <dt className="text-neutral-500">{horario.dias}</dt>
                  <dd className="font-medium text-neutral-900">{horario.horas}</dd>
                </div>
              ))}
            </dl>
          </div>

          {sucursal.telefono && (
            <p className="mt-4 text-sm text-neutral-500">
              Tel.{' '}
              <a
                href={`tel:${sucursal.telefono.replace(/\s/g, '')}`}
                className="font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                {sucursal.telefono}
              </a>
            </p>
          )}

          {/* Los dos botones en una fila de altura pareja, el principal
              primero en el orden de lectura y de foco: "ver mapa" es una
              salida del embudo, "agendar" es el objetivo del bloque. */}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <WhatsAppCTA
              className="px-5! py-3!"
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
            </WhatsAppCTA>

            <BotonMapa sucursal={sucursal} />
          </div>
        </div>

        {/*
         * El mapa solo se pide cuando la pestaña está activa: cinco iframes de
         * Google Maps montados a la vez son cinco requests de terceros y un
         * golpe de layout en medio del home.
         *
         * `min-h` en vez de una relación de aspecto fija: en escritorio la
         * columna del mapa iguala la altura de la de datos, y en celular queda
         * un mapa de 15rem que se ve sin empujar los botones fuera de pantalla.
         */}
        <div className="relative min-h-[15rem] bg-blush-50 lg:min-h-[22rem]">
          {activo && embed ? (
            <iframe
              key={sucursal.slug}
              title={`Mapa de Cire ${sucursal.nombre}`}
              src={embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-neutral-400">
              Te compartimos la ubicación exacta por WhatsApp.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function SucursalesHome() {
  const [activo, setActivo] = useState(SUCURSALES[0].slug)
  const tabsRef = useRef<HTMLDivElement>(null)

  /*
   * Flechas izquierda/derecha entre pestañas, que es lo que espera cualquiera
   * que llegue con teclado a un `role="tablist"`. Sin esto las cinco pestañas
   * quedan en el orden de tabulación una por una y el patrón ARIA queda a
   * medias: declarado como tablist pero navegándose como cinco botones.
   *
   * El foco se mueve al botón nuevo a mano porque `tabIndex` es -1 en las
   * pestañas inactivas (el patrón de "un solo tab stop" para todo el grupo).
   */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const paso = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (paso === 0) return

    event.preventDefault()
    const indice = SUCURSALES.findIndex((sucursal) => sucursal.slug === activo)
    const siguiente = SUCURSALES[(indice + paso + SUCURSALES.length) % SUCURSALES.length]

    setActivo(siguiente.slug)
    tabsRef.current?.querySelector<HTMLButtonElement>(`#tab-${siguiente.slug}`)?.focus()
  }

  return (
    <div>
      <SectionHeading>Encuentra tu Cire más cercana</SectionHeading>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
        Cinco sucursales entre Ciudad de México y el Estado de México: Polanco, Del Valle, Coapa, Oriente y
        Metepec. Todas atienden con cita — {HORARIO.map((h) => `${h.dias} ${h.horas}`).join(' · ')}.
      </p>

      {/*
       * Riel de pestañas: `-mx-6 px-6` cancela el padding de Section para que
       * en un teléfono la fila llegue al borde de la pantalla y la última
       * pestaña asome, en vez de wrappear a una segunda fila corta.
       */}
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Sucursales"
        onKeyDown={handleKeyDown}
        className="no-scrollbar -mx-6 mt-9 flex snap-x gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {SUCURSALES.map((sucursal) => {
          const seleccionada = sucursal.slug === activo
          return (
            <button
              key={sucursal.slug}
              id={`tab-${sucursal.slug}`}
              type="button"
              role="tab"
              aria-selected={seleccionada}
              aria-controls={`panel-${sucursal.slug}`}
              tabIndex={seleccionada ? 0 : -1}
              onClick={() => setActivo(sucursal.slug)}
              className={`shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2 ${
                seleccionada
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-[0_12px_30px_-15px_rgba(30,30,30,0.8)]'
                  : 'border-black/10 bg-white text-neutral-600 hover:border-blush-300 hover:text-neutral-900'
              }`}
            >
              {sucursal.nombre}
            </button>
          )
        })}
      </div>

      <Reveal className="mt-6">
        {SUCURSALES.map((sucursal) => (
          <PanelSucursal
            key={sucursal.slug}
            sucursal={sucursal}
            activo={sucursal.slug === activo}
            tabId={`tab-${sucursal.slug}`}
            panelId={`panel-${sucursal.slug}`}
          />
        ))}
      </Reveal>

      <Link
        to="/ubicaciones"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:text-blush-600"
      >
        Ver todas las sucursales con mapa y horarios
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
