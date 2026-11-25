import { useState } from 'react'
import type { PointerEvent } from 'react'
import { WhatsAppCTA } from './WhatsAppCTA'
import { ImagenPendiente, existeImagen } from './ImagenPendiente'
import { formatPrecio } from '../data/precios'
import type { Precio } from '../data/precios'
import { NIVELES_BIKINI } from '../data/precios'
import type { FondoFoto } from '../data/imagenes'
import { COMBOS_COLLAGE, FONDO_ILUSTRACION, PAQUETES_FOTO, ZONAS_FOTO, altZona, rutaPaquete, rutaZona } from '../data/imagenes'
import type { Collage } from '../data/imagenes'
import { nombreZonaIncluida, precioZona } from '../lib/precios'
import type { PaqueteVista } from '../lib/precios'

/*
 * "Elige la zona" y "O mejor, un paquete" (rediseño nov/26). Las dos rejillas
 * comparten la misma regla visual, tomada de la lógica de foto por zona:
 *
 * - Foto 4:5 (o tarjeta pendiente con la misma caja) con el nombre grande en
 *   el tercio superior, sobre el fondo liso de la foto: ciruela sobre rosa o
 *   lila, blanco sobre ciruela. En la tarjeta pendiente, siempre ciruela.
 * - Debajo, en la parte blanca: sesiones, precio, tachado y "Cotizar".
 * - La promo va como cupón debajo de la foto, nunca dentro.
 */

/** Nombre sobre la foto: primera palabra grande, el resto más chico debajo. */
function NombreSobreFoto({ nombre, fondo, conFoto, className = '' }: { nombre: string; fondo: FondoFoto; conFoto: boolean; className?: string }) {
  const [primera, ...resto] = nombre.split(' ')
  const color = conFoto && fondo === 'ciruela' ? 'text-white' : 'text-ciruela'
  return (
    <p
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 px-[7cqw] pt-[6cqw] font-display leading-[0.95] tracking-[-0.02em] ${color} ${className}`}
    >
      <span className="block text-[17cqw] font-medium">{primera}</span>
      {resto.length > 0 && <span className="mt-[1cqw] block text-[8.5cqw] font-normal">{resto.join(' ').toLowerCase()}</span>}
    </p>
  )
}

/**
 * Degradado del color de fondo de la ilustración, de opaco a transparente,
 * detrás del nombre: así el título se lee aunque la figura suba hasta ahí
 * (piernas, cabeza en Brazos completos).
 */
function DegradadoTitulo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
      style={{ background: `linear-gradient(to bottom, ${FONDO_ILUSTRACION} 0%, ${FONDO_ILUSTRACION} 50%, transparent 100%)` }}
    />
  )
}

/** Mismo estilo que el selector Arriba/Abajo de Medias piernas. */
const PILL =
  'rounded-full bg-white/90 px-[2.6cqw] py-[1.2cqw] text-[clamp(10px,3.4cqw,13px)] font-semibold leading-tight whitespace-nowrap text-ciruela shadow-sm ring-1 ring-ciruela/15 backdrop-blur-sm'

/**
 * Imagen de un combo armada con las ilustraciones de zonas/ (mientras no haya
 * foto en paquetes/). Va debajo del nombre: arranca en el 36% del ancho para
 * no encimarse con "Combo / nombre". Los datos viven en COMBOS_COLLAGE.
 */
export function CollageZonas({ collage }: { collage: Collage }) {
  const altoDerecha = collage.disposicion === 'alto-derecha'
  return (
    <div aria-hidden="true" className="zc-collage absolute inset-0" style={{ backgroundColor: collage.fondo }}>
      <div className="absolute inset-x-[6cqw] top-[36cqw] bottom-[6cqw] grid grid-cols-2 grid-rows-2 gap-[2.5cqw]">
        {collage.tiles.map((tile, i) => {
          const lugar = altoDerecha
            ? i === 0
              ? 'col-start-2 row-span-2 row-start-1'
              : `col-start-1 ${i === 1 ? 'row-start-1' : 'row-start-2'}`
            : 'row-span-2'
          return (
            <ImagenPendiente
              key={tile.zona + i}
              ruta={rutaZona(tile.zona)}
              proporcion="4:5"
              claseProporcion="min-h-0"
              alt=""
              sizes="(min-width: 1024px) 16vw, (min-width: 400px) 25vw, 50vw"
              className={`rounded-[4cqw] ${lugar}`}
              imgStyle={{
                objectPosition: tile.enfoque,
                transform: tile.zoom ? `scale(${tile.zoom})` : undefined,
                transformOrigin: tile.enfoque,
              }}
            >
              <span className={`absolute bottom-[2cqw] left-[2cqw] ${PILL}`}>{tile.etiqueta}</span>
            </ImagenPendiente>
          )
        })}
      </div>
    </div>
  )
}

export interface ZonaTile {
  /** Slug de la foto (zonas/{slug}.jpg) y de la zona para el precio. */
  slug: string
  /** Slug de precio, si es distinto (el tile "Bikini" cobra el bikini básico). */
  slugPrecio?: string
  nombre: string
  detalle: string
  sku: string
  mensaje: string
  /**
   * Mitades a elegir al mismo precio (Medias Piernas: arriba o abajo). La
   * tarjeta muestra un selector; cada opción cambia la foto
   * (zonas/{slug}-{opcion}.jpg) y entra al mensaje de WhatsApp.
   */
  opciones?: { slug: string; nombre: string }[]
}

function Precios({ vigente, tachado }: { vigente: Precio; tachado: Precio }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className="text-[20px] font-semibold text-ink tabular-nums">{formatPrecio(vigente) ?? 'Por WhatsApp'}</span>
      {tachado !== null && (
        <span className="text-[14px] text-neutral-500 line-through tabular-nums">
          <span className="sr-only">Precio regular </span>
          {formatPrecio(tachado)}
        </span>
      )}
    </p>
  )
}

export function ZonasGrid({ zonas }: { zonas: ZonaTile[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-5">
      {zonas.map((zona) => (
        <ZonaCard key={zona.slug} zona={zona} />
      ))}
    </ul>
  )
}

/*
 * Hover de las tarjetas de zona y de combo (nov/26): la tarjeta se inclina
 * hacia el cursor, el nombre y la ilustración se mueven a distinta
 * profundidad, la ilustración se acerca a la zona y aparece un contorno
 * magenta. Estilos en `.zc-*` de index.css; solo con mouse.
 */

/** Pasa la posición del cursor a variables CSS (--px, --py, de -0.5 a 0.5). */
function seguirCursor(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
  el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
}

/** Brillo que sigue al cursor, encima de la imagen y debajo del nombre. */
function BrilloHover() {
  return <div aria-hidden="true" className="zc-brillo pointer-events-none absolute inset-0" />
}

function ZonaCard({ zona }: { zona: ZonaTile }) {
  const [opcion, setOpcion] = useState(zona.opciones?.[0] ?? null)
  const slugFoto = opcion ? `${zona.slug}-${opcion.slug}` : zona.slug
  const ruta = rutaZona(slugFoto)
  const fondo = ZONAS_FOTO[slugFoto]?.fondo ?? 'rosa'
  const { vigente, tachado } = precioZona(zona.slugPrecio ?? zona.slug)
  return (
    <li className="flex flex-col">
      <div className="zc-escena" onPointerMove={seguirCursor}>
      <ImagenPendiente
        key={ruta}
        ruta={ruta}
        proporcion="4:5"
        alt={altZona(slugFoto)}
        sizes="(min-width: 640px) 25vw, 50vw"
        className="zc-card rounded-card [container-type:inline-size]"
        imgClassName="zc-img"
      >
        {existeImagen(ruta) && fondo !== 'ciruela' && <DegradadoTitulo />}
        <BrilloHover />
        <NombreSobreFoto nombre={zona.nombre} fondo={fondo} conFoto={existeImagen(ruta)} className="zc-nombre" />
        {zona.opciones && opcion && (
          <div
            role="group"
            aria-label={`Elige la mitad de ${zona.nombre.toLowerCase()}`}
            className="absolute inset-x-0 bottom-0 flex justify-center p-[5cqw]"
          >
            <div className="flex rounded-full bg-white/90 p-1 shadow-sm ring-1 ring-ciruela/15 backdrop-blur-sm">
              {zona.opciones.map((o) => {
                const activa = o.slug === opcion.slug
                return (
                  <button
                    key={o.slug}
                    type="button"
                    aria-pressed={activa}
                    onClick={() => setOpcion(o)}
                    className={`min-h-8 rounded-full px-3 text-[13px] font-semibold transition-colors ${
                      activa ? 'bg-ciruela text-white' : 'text-ciruela hover:bg-ciruela/10'
                    }`}
                  >
                    {o.nombre}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </ImagenPendiente>
      </div>

      <h3 className="mt-3 text-[16px] font-semibold tracking-normal text-ink" style={{ fontFamily: 'var(--font-sans)' }}>
        {zona.nombre}
      </h3>
      <p className="text-[14px] text-neutral-600">{zona.detalle}</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3">
        <Precios vigente={vigente} tachado={tachado} />
        <WhatsAppCTA
          variant="link"
          context={{
            sku: zona.sku,
            nombre: opcion ? `${zona.mensaje} (${opcion.nombre.toLowerCase()})` : zona.mensaje,
            categoria: 'laser',
            placement: 'card',
            valor: vigente ?? undefined,
          }}
        >
          Cotizar
        </WhatsAppCTA>
      </div>
    </li>
  )
}

/** Cupón de temporada: píldora con borde punteado. Ver `.cupon` en index.css. */
export function CuponPromo({ nombre, hasta, className = '' }: { nombre: string; hasta: string; className?: string }) {
  return (
    <p className={`cupon ${className}`}>
      <span>{nombre}</span>
      <span aria-hidden="true" className="h-3.5 w-px bg-magenta/40" />
      <span className="font-normal">{hasta}</span>
    </p>
  )
}

/** Chips de zonas incluidas; "Bikini" se despliega con sus 4 diseños. */
export function ChipsIncluye({ incluye, id }: { incluye: string[]; id: string }) {
  const [abierto, setAbierto] = useState(false)
  const chip = 'inline-flex min-h-8 items-center rounded-full border border-linea bg-white px-3 text-[13px] font-medium text-ink'
  return (
    <div>
      <ul className="flex flex-wrap gap-1.5" aria-label="Zonas incluidas">
        {incluye.map((zona) =>
          zona === 'bikini' ? (
            <li key={zona}>
              <button
                type="button"
                aria-expanded={abierto}
                aria-controls={`${id}-bikini`}
                onClick={() => setAbierto((v) => !v)}
                className={`${chip} gap-1.5 hover:border-magenta/50`}
              >
                Bikini a elegir
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-3.5 w-3.5 transition-transform ${abierto ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ) : (
            <li key={zona} className={chip}>
              {nombreZonaIncluida(zona)}
            </li>
          ),
        )}
      </ul>
      {incluye.includes('bikini') && (
        // Siempre en el HTML (Google y lectores lo leen); `hidden` solo lo oculta a la vista.
        <ul id={`${id}-bikini`} hidden={!abierto} className="mt-2 flex flex-wrap gap-1.5 border-l-2 border-lila pl-3">
          {NIVELES_BIKINI.map((nivel, i) => (
            <li key={nivel.slug} className="inline-flex items-center gap-1.5 text-[13px] text-neutral-700">
              {/* Ícono de marca solo si el archivo existe (ver SHOTLIST.md, sección 9). */}
              {existeImagen(`iconos/bikini/${nivel.slug.replace('bikini-', '')}.svg`) && (
                <img
                  src={`/images/iconos/bikini/${nivel.slug.replace('bikini-', '')}.svg`}
                  alt=""
                  width={20}
                  height={20}
                  loading="lazy"
                  className="h-5 w-5"
                />
              )}
              {nivel.nombre.replace('Bikini ', '')}
              {i < NIVELES_BIKINI.length - 1 && (
                <span aria-hidden="true" className="ml-1.5 text-neutral-400">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PaquetesGrid({ paquetes, cupon }: { paquetes: PaqueteVista[]; cupon: { nombre: string; hasta: string } | null }) {
  return (
    <ul className="grid grid-cols-1 gap-x-5 gap-y-12 xs:grid-cols-2 lg:grid-cols-3">
      {paquetes.map((p) => {
        const ruta = rutaPaquete(p.slug)
        const foto = PAQUETES_FOTO[p.slug]
        const collage = COMBOS_COLLAGE[p.slug]
        return (
          <li key={p.slug} className="flex flex-col">
            <div className="zc-escena" onPointerMove={seguirCursor}>
              <ImagenPendiente
                ruta={ruta}
                proporcion="4:5"
                alt={foto?.alt ?? p.nombre}
                sizes="(min-width: 1024px) 33vw, (min-width: 400px) 50vw, 100vw"
                className="zc-card rounded-card [container-type:inline-size]"
                imgClassName="zc-img"
                respaldo={collage ? <CollageZonas collage={collage} /> : undefined}
              >
                <BrilloHover />
                <NombreSobreFoto
                  nombre={p.nombre}
                  fondo={foto?.fondo ?? 'rosa'}
                  conFoto={existeImagen(ruta)}
                  className="zc-nombre"
                />
              </ImagenPendiente>
            </div>

            {p.enPromo && cupon && <CuponPromo nombre={cupon.nombre} hasta={cupon.hasta} className="mt-4 self-start" />}

            <h3 className="mt-4 text-[22px] text-ink">{p.nombre}</h3>
            <p className="text-[14px] text-neutral-600">{p.sesiones} sesiones de láser diodo</p>
            <div className="mt-3">
              <ChipsIncluye incluye={p.incluye} id={p.slug} />
            </div>

            <p className="mt-4 flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums">
                {formatPrecio(p.precio)}
              </span>
              {p.tachado !== null && (
                <span className="text-[15px] text-neutral-500 line-through tabular-nums">
                  <span className="sr-only">Precio regular </span>
                  {formatPrecio(p.tachado)}
                </span>
              )}
            </p>
            {p.ahorro !== null && (
              <p className="mt-1.5 text-[14px] font-semibold text-magenta">
                Ahorras {formatPrecio(p.ahorro)} contra zonas por separado
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
              {p.msi ? <p className="text-[14px] text-neutral-600">Hasta {p.msi} meses sin intereses</p> : <span />}
              <WhatsAppCTA
                variant="link"
                context={{
                  // Mismo sku que antes del rediseño, para no cortar el histórico en Meta y GA4.
                  sku: p.enPromo ? `promo-${p.slug}` : p.slug,
                  nombre: `${p.nombre}${p.enPromo && cupon ? ` de ${cupon.nombre}` : ''}`,
                  categoria: 'laser',
                  placement: 'card',
                  valor: p.precio,
                }}
              >
                Cotizar
              </WhatsAppCTA>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
