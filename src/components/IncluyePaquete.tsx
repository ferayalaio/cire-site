import { MARCA } from '../data/marca'
import { MSI } from '../data/precios'

/*
 * "Lo que incluye tu paquete" (nov/26). Inspirado en las tablas comparativas
 * de otras clínicas, pero sin compararse con nadie: solo lo que el paquete de
 * Cire trae, y cada línea sale de un dato o claim aprobado (marca.ts, MSI,
 * FAQ del home). Si una condición cambia, se cambia en data/, no aquí.
 */

export function IncluyePaquete({ className = '' }: { className?: string }) {
  const items = [
    { titulo: `8 sesiones con el ${MARCA.protocolo}`, detalle: 'El protocolo estándar, ajustado a tu tipo de piel y vello.' },
    { titulo: 'Evaluación sin costo', detalle: 'Una especialista revisa tu piel y tu vello antes de empezar.' },
    { titulo: 'Punta de zafiro que enfría la piel', detalle: 'En el mismo momento del disparo, para mayor comodidad.' },
    ...(MSI.disponible && MSI.meses.length > 0
      ? [{ titulo: `Hasta ${Math.max(...MSI.meses)} meses sin intereses`, detalle: 'Con tarjetas participantes.' }]
      : []),
    {
      titulo: 'Precios publicados',
      detalle: `Por zona y por paquete, en este sitio. ${MARCA.cantidadSucursales} sucursales en CDMX y Metepec.`,
    },
  ]

  return (
    <div className={className}>
      <h3 className="text-[1.5rem] text-ink">Lo que incluye tu paquete</h3>
      {/* Ficha técnica: filas con divisor fino, sin íconos de relleno. */}
      <ul className="mt-4 divide-y divide-linea border-y border-linea">
        {items.map((item) => (
          <li key={item.titulo} className="py-4">
            <span>
              <span className="block text-[17px] font-semibold text-ink">{item.titulo}</span>
              <span className="block text-[15px] leading-snug text-neutral-600">{item.detalle}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
