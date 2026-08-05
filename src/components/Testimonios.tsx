import type { Testimonio } from '../data/sucursales'
import { SectionHeading } from './PageShell'
import { Stagger } from './Reveal'

interface TestimoniosSectionProps {
  testimonios: Testimonio[]
  titulo?: string
}

/*
 * Fallback para el puñado de reseñas cuya cuenta de Google no tiene foto de
 * perfil (Google les pone su propio ícono de inicial-en-círculo). Cuando el
 * testimonio trae `avatarSrc` se usa la foto real recortada de la reseña.
 */
const AVATAR_TONES = [
  'bg-blush-100 text-blush-600',
  'bg-blush-200 text-blush-700',
  'bg-blush-300 text-blush-900',
  'bg-blush-400 text-blush-900',
]

function avatarTono(autor: string): string {
  let hash = 0
  for (let i = 0; i < autor.length; i++) hash = (hash * 31 + autor.charCodeAt(i)) % AVATAR_TONES.length
  return AVATAR_TONES[hash]
}

/*
 * Todas las reseñas curadas en src/data/testimonios.ts y sucursales.ts son de
 * 5 estrellas — no hay campo `estrellas` porque no hay ningún caso real de
 * otro valor todavía.
 */
function Estrellas() {
  return (
    <div aria-label="5 de 5 estrellas" className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
        </svg>
      ))}
    </div>
  )
}

/*
 * Tarjeta estilo reseña de Google (foto/inicial + nombre + estrellas +
 * negocio/sucursal + texto), igual a como piden mostrarlas en vez de la cita
 * decorativa que había antes.
 */
export function TestimoniosSection({ testimonios, titulo }: TestimoniosSectionProps) {
  if (testimonios.length === 0) return null

  // Con una sola reseña (HIFU, Láser Bikini, Láser Zonas y Láser Cuerpo
  // Completo llevan solo 1, ver testimonios.ts), meterla en el mismo grid de
  // 2-3 columnas la deja angosta y con columnas vacías al lado — acá se
  // estira a lo ancho en vez de a lo alto.
  const esUnaSola = testimonios.length === 1

  return (
    <div>
      <SectionHeading>{titulo ?? 'Lo que dicen nuestras clientas'}</SectionHeading>
      <Stagger className={esUnaSola ? 'mt-8' : 'mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'}>
        {testimonios.map((testimonio) => (
          <figure
            key={testimonio.autor}
            className={`rounded-2xl border border-black/[0.07] bg-white ${esUnaSola ? 'p-8 sm:p-10' : 'p-6'}`}
          >
            <div className="flex items-center gap-3">
              {testimonio.avatarSrc ? (
                <img
                  src={testimonio.avatarSrc}
                  alt=""
                  aria-hidden="true"
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarTono(testimonio.autor)}`}
                >
                  {testimonio.autor.charAt(0).toUpperCase()}
                </span>
              )}
              <figcaption>
                <p className="font-medium text-neutral-900">{testimonio.autor}</p>
                {testimonio.sucursal && <p className="text-sm text-neutral-400">{testimonio.sucursal}</p>}
              </figcaption>
            </div>
            <div className="mt-3">
              <Estrellas />
            </div>
            <blockquote className={`mt-3 text-neutral-600 ${esUnaSola ? 'max-w-2xl' : ''}`}>
              <p className="leading-relaxed">{testimonio.texto}</p>
            </blockquote>
          </figure>
        ))}
      </Stagger>
    </div>
  )
}
