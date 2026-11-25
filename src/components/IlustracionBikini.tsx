import { useId } from 'react'

/*
 * Ilustraciones de los 4 niveles de bikini, redibujadas en SVG a partir del
 * flyer "Elige tu perfect bikini" (nov/26). Van en vector y no recortadas del
 * flyer porque en el detalle se muestran a ~320px y el recorte se veía borroso.
 *
 * Lenguaje: medallón color piel, pliegues de la ingle en un tono más oscuro y,
 * en rosa, el vello que se CONSERVA en cada nivel. Del básico al brazilian la
 * mancha rosa cambia (media luna, gota) y en french y brazilian ya no hay; el
 * brazilian suma la vista trasera.
 */

// Colores tomados del flyer.
const PIEL_CLARA = '#fdd3b6'
const PIEL = '#f8bb95'
const PLIEGUE = '#f19b6c'
const VELLO = '#ff6584'
const ARO = '#6b2c5a'

/** Vello que se conserva, por nivel (null = nada). */
const VELLO_PATH: Record<string, string | null> = {
  // Media luna ancha: tapa recta, fondo redondo.
  'bikini-basico': 'M79 73 Q79 68 84 68 H116 Q121 68 121 73 C119 86 109 95 100 95 C91 95 81 86 79 73Z',
  // Gota vertical: redonda arriba, en punta abajo.
  'bikini-sexy': 'M100 47 C107.5 47 112 53 112 61 C112 73 105.5 85 100 91 C94.5 85 88 73 88 61 C88 53 92.5 47 100 47Z',
  // Como en el flyer: sin mancha rosa.
  'bikini-french': null,
  'bikini-brazilian': null,
}

function Medallon({ vista, vello, x = 0 }: { vista: 'frente' | 'espalda'; vello?: string | null; x?: number }) {
  const id = useId()
  const grad = `piel-${id}`
  const clip = `clip-${id}`

  return (
    <g transform={`translate(${x} 0)`}>
      <defs>
        <radialGradient id={grad} cx="36%" cy="28%" r="82%">
          <stop offset="0" stopColor={PIEL_CLARA} />
          <stop offset="1" stopColor={PIEL} />
        </radialGradient>
        <clipPath id={clip}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#${grad})`} />
      <g clipPath={`url(#${clip})`} fill="none" stroke={PLIEGUE} strokeWidth="5" strokeLinecap="round">
        {vista === 'frente' ? (
          <>
            <path d="M37 62 C58 88 80 106 100 106 C120 106 142 88 163 62" />
            <path d="M100 106 V210" />
          </>
        ) : (
          <>
            <path d="M100 -10 V134" />
            <path d="M94 142 C70 162 44 164 20 150" />
            <path d="M106 142 C130 162 156 164 180 150" />
          </>
        )}
      </g>
      {vello && <path d={vello} fill={VELLO} />}
      {/* Aro ciruela, como en el flyer. */}
      <circle cx="100" cy="100" r="93" fill="none" stroke={ARO} strokeWidth="6" />
    </g>
  )
}

export function IlustracionBikini({ slug, className = '' }: { slug: string; className?: string }) {
  if (slug === 'bikini-brazilian') {
    return (
      <svg viewBox="0 0 372 200" className={className} aria-hidden="true">
        <Medallon vista="espalda" x={172} />
        <Medallon vista="frente" vello={null} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <Medallon vista="frente" vello={VELLO_PATH[slug]} />
    </svg>
  )
}
