import { Link } from 'react-router-dom'
import type { Sucursal } from '../data/sucursales'

interface SucursalCardProps {
  sucursal: Sucursal
}

/*
 * Tarjeta de sucursal para el hub de /ubicaciones. A diferencia del LinkCard
 * genérico (solo texto), esta lleva una franja fotográfica: la marca vende un
 * servicio presencial y ver la sucursal antes de agendar reduce fricción.
 *
 * Mientras no haya foto cargada (`sucursal.foto` en src/data/sucursales.ts),
 * la franja no queda vacía ni con un ícono genérico: usa la inicial del
 * nombre en Bodoni Moda sobre el degradé blush de la marca, así la página no
 * se ve "a medio construir" antes de que lleguen las fotos reales.
 */
export function SucursalCard({ sucursal }: SucursalCardProps) {
  const inicial = sucursal.nombre.charAt(0)

  return (
    <Link
      to={`/ubicaciones/${sucursal.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_44px_-24px_rgba(0,0,0,0.28)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-blush-100 via-blush-50 to-white">
        {sucursal.foto ? (
          <img
            src={sucursal.foto}
            alt={`Sucursal ${sucursal.nombre}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
            <span
              className="text-6xl text-blush-300"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              {inicial}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span
          className="text-2xl uppercase text-neutral-900"
          style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400 }}
        >
          {sucursal.nombre}
        </span>
        <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">
          {sucursal.direccion || 'Agenda y te confirmamos la dirección exacta por WhatsApp.'}
        </span>
        <span className="flex-1" />
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900">
          Ver sucursal
          <span
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
