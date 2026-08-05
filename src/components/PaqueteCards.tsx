import { Stagger } from './Reveal'
import { WhatsAppCTA } from './WhatsAppCTA'
import type { PaqueteConSesiones } from '../data/precios'
import { formatPrecio } from '../data/precios'

/*
 * Mismo diseño de tarjetas que usa /hifu para HIFU_PROTOCOLOS (ver Hifu.tsx),
 * factorizado acá porque ahora lo comparten tres rutas más: los catálogos de
 * Moldeo Corporal, Cire Sculpt Anticelulítico y Cire Sculpt Post Operativo.
 * Si el diseño de /hifu cambia y quiere desviarse del de estas rutas, hay que
 * volver a separarlos — por ahora son literalmente el mismo componente.
 */

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

interface PaqueteCardsProps {
  paquetes: PaqueteConSesiones[]
  /** Categoría enviada al contexto de analytics/WhatsApp de cada tarjeta. */
  categoria: string
}

export function PaqueteCards({ paquetes, categoria }: PaqueteCardsProps) {
  return (
    <Stagger className="grid gap-6 md:grid-cols-3" step={90}>
      {paquetes.map((paquete) => (
        <div
          key={paquete.slug}
          className={`flex flex-col rounded-3xl border bg-white p-7 transition-all duration-300 ${
            paquete.destacado
              ? 'border-blush-300 shadow-[0_35px_70px_-30px_rgba(166,94,109,0.45)] md:-translate-y-3'
              : 'border-black/[0.07] hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)]'
          }`}
        >
          {paquete.destacado && (
            <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-blush-500 px-3 py-1 text-xs font-medium text-white">
              Más popular
            </span>
          )}

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-blush-500">{paquete.duracion}</p>
          <h3 className="mt-2 text-2xl text-neutral-900">{paquete.nombre}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{paquete.resumen}</p>

          <p className="mt-6 text-3xl text-neutral-900">
            {formatPrecio(paquete.precioDesde) ?? <span className="text-neutral-300">Precio pendiente</span>}
          </p>

          <ul className="mt-5 space-y-2.5">
            {paquete.incluye.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-600">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush-500" />
                {item}
              </li>
            ))}
          </ul>

          <WhatsAppCTA
            variant={paquete.destacado ? 'primary' : 'secondary'}
            className="mt-7 w-full"
            context={{
              sku: paquete.slug,
              nombre: paquete.nombre,
              categoria,
              placement: 'card',
              valor: paquete.precioDesde ?? undefined,
            }}
          >
            Consultar por WhatsApp
          </WhatsAppCTA>
        </div>
      ))}
    </Stagger>
  )
}
