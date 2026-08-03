import type { Testimonio } from '../data/sucursales'
import { SectionHeading } from './PageShell'
import { Stagger } from './Reveal'

interface TestimoniosSectionProps {
  testimonios: Testimonio[]
  titulo?: string
}

/*
 * Mismo bloque que ya vivía inline en Sucursal.tsx (comilla en Bodoni Moda +
 * cita + autor), ahora reutilizable como prueba social genérica en páginas de
 * servicio que no tienen testimonios propios por tratamiento.
 */
export function TestimoniosSection({ testimonios, titulo }: TestimoniosSectionProps) {
  if (testimonios.length === 0) return null

  return (
    <div>
      <SectionHeading>{titulo ?? 'Lo que dicen nuestras clientas'}</SectionHeading>
      <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonios.map((testimonio) => (
          <figure key={testimonio.autor} className="rounded-2xl border border-black/[0.07] bg-white p-6">
            <span
              aria-hidden="true"
              className="text-4xl leading-none text-blush-300"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              &ldquo;
            </span>
            <blockquote className="mt-1 text-neutral-600">
              <p className="leading-relaxed">{testimonio.texto}</p>
            </blockquote>
            <figcaption className="mt-4 text-sm text-neutral-400">— {testimonio.autor}</figcaption>
          </figure>
        ))}
      </Stagger>
    </div>
  )
}
