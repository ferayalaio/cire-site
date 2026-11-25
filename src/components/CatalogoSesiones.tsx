import { WhatsAppCTA } from './WhatsAppCTA'
import type { WhatsAppClickContext } from '../lib/analytics'
import type { PaqueteConSesiones } from '../data/precios'
import { formatPrecio } from '../data/precios'

/* Foto real de cabina (abdomen, cabezal corporal) con la corrección de color
   de todo el sitio; ver DESIGN.md, "Real Frame". */
export const FOTO_CORPORAL = {
  src: '/sesion/otros-corporal.jpg',
  alt: 'Especialista de Cire con uniforme de la marca aplicando un tratamiento corporal en abdomen',
}

/*
 * Bloque de precios de las tres rutas hijas (moldeo, Cire Sculpt, post op).
 * Reemplaza en estas páginas a PaqueteCards: en lugar de tres tarjetas
 * iguales, el precio de entrada va en el único campo destacado y los paquetes
 * en una lista con filas, igual que la página de Full Body.
 *
 * El precio por sesión es solo la división del precio del paquete entre sus
 * sesiones (las de `duracion`); no es un dato nuevo.
 */

function sesionesDe(paquete: PaqueteConSesiones): number | null {
  const match = paquete.duracion.match(/^(\d+)/)
  return match ? Number(match[1]) : null
}

/** "Moldeo Cire-Na (6 sesiones)" → "Moldeo Cire-Na". */
function tratamientoDe(paquete: PaqueteConSesiones): string {
  return paquete.nombre.replace(/\s*\(.*\)\s*$/, '')
}

function listaSesiones(numeros: number[]): string {
  const textos = numeros.map(String)
  if (textos.length <= 1) return textos.join('')
  return `${textos.slice(0, -1).join(', ')} y ${textos[textos.length - 1]}`
}

interface CatalogoSesionesProps {
  /** Nombre del servicio, encabezado del campo destacado. */
  titulo: string
  paquetes: PaqueteConSesiones[]
  /** Categoría para el contexto de analytics/WhatsApp de cada fila. */
  categoria: string
  /** Contexto de la página para el botón principal (se le agrega placement). */
  context: Omit<WhatsAppClickContext, 'placement'>
  ctaLabel: string
}

export function CatalogoSesiones({ titulo, paquetes, categoria, context, ctaLabel }: CatalogoSesionesProps) {
  const precios = paquetes.map((p) => p.precioDesde).filter((p): p is number => p !== null)
  const desde = precios.length > 0 ? Math.min(...precios) : null

  const numeros = [...new Set(paquetes.map(sesionesDe).filter((n): n is number => n !== null))].sort(
    (a, b) => a - b,
  )

  const grupos = paquetes.reduce<{ nombre: string; paquetes: PaqueteConSesiones[] }[]>((acc, paquete) => {
    const nombre = tratamientoDe(paquete)
    const grupo = acc.find((g) => g.nombre === nombre)
    if (grupo) grupo.paquetes.push(paquete)
    else acc.push({ nombre, paquetes: [paquete] })
    return acc
  }, [])
  const variosGrupos = grupos.length > 1

  return (
    <section id="precios" className="scroll-anchor grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-8">
      <article className="rounded-2xl bg-blush-100 p-6 sm:p-8 lg:sticky lg:top-[calc(6rem+var(--anuncio-h,0px))]">
        <h2 className="text-2xl text-ink">{titulo}</h2>
        {numeros.length > 0 && (
          <p className="mt-1 text-[15px] text-blush-900/80">Paquetes de {listaSesiones(numeros)} sesiones</p>
        )}

        {desde !== null ? (
          <>
            <p className="mt-6 text-[15px] text-blush-900/80">Desde</p>
            <p className="mt-1 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
              {formatPrecio(desde)}
            </p>
          </>
        ) : (
          <p className="mt-6 text-[1.5rem] font-semibold text-ink">Precio por WhatsApp</p>
        )}

        <WhatsAppCTA context={{ ...context, placement: 'card' }} className="mt-8 w-full sm:w-auto">
          {ctaLabel}
        </WhatsAppCTA>
      </article>

      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] sm:p-8">
        <h2 className="text-2xl text-ink">Precios por número de sesiones</h2>

        {grupos.map((grupo) => (
          <div key={grupo.nombre} className={variosGrupos ? 'mt-8' : undefined}>
            {variosGrupos && (
              <h3 className="border-b border-black/[0.08] pb-3 text-[19px] font-semibold text-ink">{grupo.nombre}</h3>
            )}
            <ul className={`divide-y divide-linea ${variosGrupos ? 'mt-1' : 'mt-3'}`}>
              {grupo.paquetes.map((paquete) => {
                const sesiones = sesionesDe(paquete)
                const porSesion =
                  paquete.precioDesde !== null && sesiones !== null && sesiones > 1
                    ? formatPrecio(Math.round(paquete.precioDesde / sesiones))
                    : undefined

                return (
                  <li key={paquete.slug} className="flex items-start justify-between gap-4 py-4 sm:gap-8">
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-semibold text-ink">
                        {variosGrupos ? paquete.duracion : paquete.nombre}
                      </p>
                      <p className="mt-1 max-w-[46ch] text-[15px] leading-snug text-neutral-600">{paquete.resumen}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end text-right">
                      <p className="text-[17px] font-semibold text-ink tabular-nums">
                        {formatPrecio(paquete.precioDesde) ?? 'Precio por WhatsApp'}
                      </p>
                      {porSesion && (
                        <p className="text-[14px] text-neutral-600 tabular-nums">{porSesion} por sesión</p>
                      )}
                      <WhatsAppCTA
                        variant="link"
                        context={{
                          sku: paquete.slug,
                          nombre: paquete.nombre,
                          categoria,
                          placement: 'card',
                          valor: paquete.precioDesde ?? undefined,
                        }}
                      >
                        Consultar
                      </WhatsAppCTA>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
