import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoopVideo } from './LoopVideo'

/*
 * Carrusel de "Otros tratamientos" en el home (nov/26).
 *
 * Una diapositiva por tratamiento: video en bucle (o foto mientras no haya
 * video), qué es, precios de referencia y enlace a su página. Avanza solo cada
 * `intervalo` ms; se pausa al pasar el mouse, al enfocar con teclado, cuando
 * la pestaña está oculta o la sección no está en pantalla. Con
 * prefers-reduced-motion no avanza solo: se navega con flechas y puntos.
 *
 * Solo el video de la diapositiva activa se monta, así no se descargan los
 * tres a la vez.
 */

export interface PrecioTratamiento {
  etiqueta: string
  precio: string
}

export interface DiapositivaTratamiento {
  to: string
  titulo: string
  /** Frase corta bajo el título. */
  bajada: string
  /** Qué es, en uno o dos párrafos cortos. */
  descripcion: string
  precios: PrecioTratamiento[]
  /** Ruta del .mp4 en loop. Sin video, se ve `poster`. */
  video?: string
  /** Foto o primer frame del video. */
  poster: string
  alt: string
}

interface Props {
  diapositivas: DiapositivaTratamiento[]
  /** Milisegundos entre diapositivas. */
  intervalo?: number
}

function Flecha({ direccion }: { direccion: 'izq' | 'der' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d={direccion === 'der' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CarruselTratamientos({ diapositivas, intervalo = 8000 }: Props) {
  const [activa, setActiva] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reducido, setReducido] = useState(false)
  /* Cambia en cada avance para reiniciar la barra de progreso. */
  const [ciclo, setCiclo] = useState(0)
  const raiz = useRef<HTMLDivElement>(null)
  const toqueX = useRef<number | null>(null)
  const total = diapositivas.length

  const ir = useCallback(
    (i: number) => {
      setActiva(((i % total) + total) % total)
      setCiclo((c) => c + 1)
    },
    [total],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducido(mq.matches)
    const cambio = (e: MediaQueryListEvent) => setReducido(e.matches)
    mq.addEventListener('change', cambio)
    return () => mq.removeEventListener('change', cambio)
  }, [])

  useEffect(() => {
    const el = raiz.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const cambio = () => setPausado(document.hidden)
    document.addEventListener('visibilitychange', cambio)
    return () => document.removeEventListener('visibilitychange', cambio)
  }, [])

  const corriendo = !pausado && visible && !reducido && total > 1

  /* Al reanudar, la cuenta de 8 s y la barra arrancan juntas desde cero. */
  useEffect(() => {
    if (corriendo) setCiclo((c) => c + 1)
  }, [corriendo])

  useEffect(() => {
    if (!corriendo) return
    const t = window.setTimeout(() => ir(activa + 1), intervalo)
    return () => window.clearTimeout(t)
  }, [corriendo, activa, ciclo, intervalo, ir])

  return (
    <div
      ref={raiz}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Otros tratamientos"
      className="mt-8"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausado(false)
      }}
      onTouchStart={(e) => {
        toqueX.current = e.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(e) => {
        const inicio = toqueX.current
        toqueX.current = null
        const fin = e.changedTouches[0]?.clientX
        if (inicio === null || fin === undefined) return
        const dx = fin - inicio
        if (Math.abs(dx) > 50) ir(activa + (dx < 0 ? 1 : -1))
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') ir(activa + 1)
        if (e.key === 'ArrowLeft') ir(activa - 1)
      }}
    >
      <div className="grid">
        {diapositivas.map((d, i) => {
          const esActiva = i === activa
          return (
            <div
              key={d.to}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}: ${d.titulo}`}
              aria-hidden={!esActiva}
              inert={!esActiva}
              className={`col-start-1 row-start-1 grid gap-6 transition-opacity duration-700 ease-out motion-reduce:transition-none lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 ${
                esActiva ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-lila lg:aspect-[5/4]">
                {d.video && esActiva ? (
                  <LoopVideo
                    src={d.video}
                    poster={d.poster}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={d.poster}
                    alt={d.alt}
                    loading="lazy"
                    width={960}
                    height={720}
                    className="tono-cabina absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>

              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-magenta tabular-nums">
                  {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-[1.75rem] leading-tight text-ink sm:text-[2.25rem]">{d.titulo}</h3>
                <p className="mt-2 text-[17px] font-semibold text-ink">{d.bajada}</p>
                <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-neutral-700">{d.descripcion}</p>

                <dl className="mt-6 divide-y divide-linea border-y border-linea">
                  {d.precios.map((p) => (
                    <div key={p.etiqueta} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[15px] text-neutral-700">{p.etiqueta}</dt>
                      <dd className="text-[17px] font-semibold text-ink tabular-nums">{p.precio}</dd>
                    </div>
                  ))}
                </dl>

                <Link
                  to={d.to}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                >
                  Ver precios y detalles
                  <Flecha direccion="der" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {total > 1 && (
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => ir(activa - 1)}
            aria-label="Tratamiento anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-ink transition-colors hover:bg-lila"
          >
            <Flecha direccion="izq" />
          </button>

          <div className="flex flex-1 gap-2">
            {diapositivas.map((d, i) => (
              <button
                key={d.to}
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ver ${d.titulo}`}
                aria-current={i === activa}
                className="group flex min-h-11 flex-1 items-center"
              >
                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-ink/15">
                  {i < activa && <span className="absolute inset-0 bg-ink" />}
                  {i === activa && (
                    <span
                      key={ciclo}
                      className="absolute inset-0 origin-left bg-ink"
                      style={
                        reducido
                          ? { transform: 'scaleX(1)' }
                          : {
                              animation: `progreso-carrusel ${intervalo}ms linear both`,
                              animationPlayState: corriendo ? 'running' : 'paused',
                            }
                      }
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => ir(activa + 1)}
            aria-label="Siguiente tratamiento"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-ink transition-colors hover:bg-lila"
          >
            <Flecha direccion="der" />
          </button>
        </div>
      )}
    </div>
  )
}
