import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { NIVELES_BIKINI, formatPrecio, type NivelBikini } from '../data/precios'
import { PROMO_TEMPORADA, precioPromoZona } from '../data/promos'
import { IlustracionBikini } from './IlustracionBikini'
import { WhatsAppCTA } from './WhatsAppCTA'

/*
 * Los 4 niveles de bikini (nov/26).
 *
 * Escritorio: cuatro columnas en blanco. Al pasar el cursor, el color del nivel
 * sube desde abajo y aparece su ilustración; al hacer clic, ese color se abre
 * desde la columna hasta ocupar todo el bloque con el detalle (cobertura,
 * precio y CTA). Del detalle se salta a otro nivel con las miniaturas o con las
 * flechas del teclado; Esc vuelve.
 *
 * Mobile (sin hover): tarjetas ya coloreadas, una por nivel, que se despliegan
 * al tocarlas.
 *
 * El color sube de tono del básico al brazilian (mismo criterio que antes: el
 * orden se ve antes de leerse). Pares fondo/texto con contraste AA: blush-200
 * con tinta; blush-500, magenta y tinta con blanco.
 */

const EASE = [0.22, 1, 0.36, 1] as const

interface Estilo {
  fondo: string
  /** Número del nivel sobre blanco. */
  acento: string
  claro: boolean
}

const ESTILOS: Estilo[] = [
  { fondo: '#fcc8d8', acento: '#a32a57', claro: true },
  { fondo: '#d6457a', acento: '#d6457a', claro: false },
  { fondo: '#7b2c6e', acento: '#7b2c6e', claro: false },
  { fondo: '#4b1839', acento: '#4b1839', claro: false },
]

const estilo = (i: number) => ESTILOS[i] ?? ESTILOS[ESTILOS.length - 1]
const numero = (i: number) => String(i + 1).padStart(2, '0')
/** "Bikini Brazilian" → "Brazilian": la palabra que distingue al nivel. */
const apellido = (n: NivelBikini) => n.nombre.replace(/^Bikini\s+/i, '')

const LISTA_PROMO = PROMO_TEMPORADA.listas.find((l) => l.slug === 'perfect-bikini')

function precios(n: NivelBikini) {
  const promo = precioPromoZona(n.slug)
  return {
    actual: formatPrecio(promo ?? n.precioPaquete),
    regular: promo !== null ? formatPrecio(n.precioPaquete) : undefined,
    valor: promo ?? n.precioPaquete ?? undefined,
    msi: promo !== null ? LISTA_PROMO?.msi : undefined,
  }
}

function ctaContext(n: NivelBikini, valor: number | undefined) {
  return { sku: n.slug, nombre: n.nombre, categoria: 'laser' as const, placement: 'card' as const, valor }
}

function Flecha({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NivelesBikini() {
  return (
    <MotionConfig reducedMotion="user">
      <NivelesEscritorio />
      <NivelesMobile />
    </MotionConfig>
  )
}

/* -------------------------------------------------------------------------- */
/* Escritorio                                                                 */
/* -------------------------------------------------------------------------- */

function NivelesEscritorio() {
  const [abierto, setAbierto] = useState<number | null>(null)
  const columnas = useRef<(HTMLButtonElement | null)[]>([])
  const ultimo = useRef(0)

  const cerrar = () => {
    setAbierto(null)
    // Devuelve el foco a la columna que abrió el detalle.
    requestAnimationFrame(() => columnas.current[ultimo.current]?.focus())
  }

  return (
    <div className="relative hidden h-[620px] overflow-hidden rounded-media border border-black/[0.07] bg-white lg:block">
      <ol className="grid h-full grid-cols-4" aria-label="Niveles de bikini" inert={abierto !== null}>
        {NIVELES_BIKINI.map((nivel, i) => {
          const e = estilo(i)
          const p = precios(nivel)
          const textoHover = e.claro ? '' : 'group-hover:text-white group-focus-visible:text-white'
          return (
            <li key={nivel.slug} className="h-full border-l border-black/[0.06] first:border-l-0">
              <button
                ref={(el) => {
                  columnas.current[i] = el
                }}
                type="button"
                onClick={() => {
                  ultimo.current = i
                  setAbierto(i)
                }}
                aria-expanded={abierto === i}
                aria-controls="detalle-nivel-bikini"
                className="group relative flex h-full w-full flex-col overflow-hidden px-8 pb-9 pt-10 text-left outline-none"
              >
                {/* Color del nivel: sube desde abajo al pasar el cursor. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
                  style={{ backgroundColor: e.fondo }}
                />

                {/* Ilustración: flota hacia arriba con su sombra. */}
                <span className="relative grid flex-1 place-items-center" aria-hidden="true">
                  <span className="flex translate-y-6 scale-90 flex-col items-center opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-75 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                    <IlustracionBikini
                      slug={nivel.slug}
                      className={`${nivel.slug === 'bikini-brazilian' ? 'w-[210px]' : 'w-[168px]'} drop-shadow-[0_18px_22px_rgba(43,10,30,0.22)]`}
                    />
                    <span className="mt-6 h-3 w-28 rounded-[50%] bg-black/25 blur-md" />
                  </span>
                </span>

                <span className="relative">
                  {/* El acento va por variable CSS: un `style.color` directo le ganaría al hover. */}
                  <span
                    className={`block text-[15px] font-medium tabular-nums text-[var(--acento)] transition-colors duration-500 ${e.claro ? '' : 'group-hover:text-white/75 group-focus-visible:text-white/75'}`}
                    style={{ ['--acento' as string]: e.acento }}
                  >
                    {numero(i)}
                  </span>
                  <span
                    className={`mt-3 block text-[2rem] font-semibold leading-[1.04] tracking-[-0.025em] text-ink transition-colors duration-500 ${textoHover}`}
                  >
                    Bikini
                    <br />
                    {apellido(nivel)}
                  </span>
                  <span
                    className={`mt-3 block text-[15px] text-neutral-600 transition-colors duration-500 ${e.claro ? 'group-hover:text-ink/75' : 'group-hover:text-white/75 group-focus-visible:text-white/75'}`}
                  >
                    {p.actual ? `${p.actual} · ${nivel.sesiones ?? 8} sesiones` : 'Precio por WhatsApp'}
                  </span>
                  <span
                    className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[14px] font-semibold transition-colors duration-500 ${
                      e.claro
                        ? 'border-ink/20 text-ink group-hover:border-ink/40'
                        : 'border-ink/20 text-ink group-hover:border-white/50 group-hover:text-white group-focus-visible:border-white/50 group-focus-visible:text-white'
                    }`}
                  >
                    Ver nivel
                    <Flecha className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <AnimatePresence>
        {abierto !== null && (
          <DetalleEscritorio key="detalle" index={abierto} onCambiar={setAbierto} onCerrar={cerrar} />
        )}
      </AnimatePresence>
    </div>
  )
}

/** Recorte que deja visible solo la columna `i` (de 4). */
const recorteColumna = (i: number, total: number) => {
  const ancho = 100 / total
  return `inset(0% ${100 - ancho * (i + 1)}% 0% ${ancho * i}%)`
}

function DetalleEscritorio({
  index,
  onCambiar,
  onCerrar,
}: {
  index: number
  onCambiar: (i: number) => void
  onCerrar: () => void
}) {
  const total = NIVELES_BIKINI.length
  const nivel = NIVELES_BIKINI[index]
  const e = estilo(index)
  const p = precios(nivel)
  const volver = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    volver.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onCerrar()
      if (ev.key === 'ArrowRight') onCambiar((index + 1) % total)
      if (ev.key === 'ArrowLeft') onCambiar((index - 1 + total) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, total, onCambiar, onCerrar])

  const tinta = e.claro ? 'text-ink' : 'text-white'
  const tintaSuave = e.claro ? 'text-ink/70' : 'text-white/75'

  return (
    <motion.section
      id="detalle-nivel-bikini"
      aria-label={nivel.nombre}
      className="absolute inset-0 z-10 overflow-hidden"
      initial={{ clipPath: recorteColumna(index, total), backgroundColor: e.fondo }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', backgroundColor: e.fondo }}
      exit={{ clipPath: recorteColumna(index, total), transition: { duration: 0.6, ease: EASE, delay: 0.1 } }}
      transition={{ clipPath: { duration: 0.8, ease: EASE }, backgroundColor: { duration: 0.6, ease: EASE } }}
    >
      <AnimatePresence mode="popLayout" initial={true}>
        <motion.div
          key={nivel.slug}
          className="absolute inset-0"
          initial="fuera"
          animate="dentro"
          exit="salida"
          variants={{ fuera: {}, dentro: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } }, salida: {} }}
        >
          {/* Palabra gigante de fondo, como en un lookbook. Decorativa. */}
          <motion.p
            aria-hidden="true"
            className="pointer-events-none absolute left-10 top-6 select-none whitespace-nowrap text-[10.5rem] font-bold leading-none tracking-[-0.055em] text-white"
            style={{ opacity: e.claro ? 0.85 : 0.95 }}
            variants={{
              fuera: { y: 70, opacity: 0 },
              dentro: { y: 0, opacity: e.claro ? 0.85 : 0.95, transition: { duration: 0.9, ease: EASE } },
              salida: { y: -30, opacity: 0, transition: { duration: 0.3, ease: EASE } },
            }}
          >
            {apellido(nivel)}
          </motion.p>

          {/* Ilustración al frente de la palabra. */}
          <motion.div
            aria-hidden="true"
            className="absolute bottom-24 left-[36%] right-[25%] top-28 flex flex-col items-center justify-center"
            variants={{
              fuera: { y: 50, scale: 0.86, opacity: 0 },
              dentro: { y: 0, scale: 1, opacity: 1, transition: { duration: 1, ease: EASE } },
              salida: { y: -20, scale: 0.96, opacity: 0, transition: { duration: 0.3, ease: EASE } },
            }}
          >
            <IlustracionBikini
              slug={nivel.slug}
              className={`${nivel.slug === 'bikini-brazilian' ? 'w-full max-w-[460px]' : 'w-[300px]'} drop-shadow-[0_30px_40px_rgba(43,10,30,0.3)]`}
            />
            <span className="mt-8 h-4 w-48 rounded-[50%] bg-black/25 blur-lg" />
          </motion.div>

          {/* Texto del nivel. */}
          <div className="absolute bottom-10 left-10 max-w-[340px]">
            <motion.p
              className={`text-[15px] font-medium tabular-nums ${tintaSuave}`}
              variants={{
                fuera: { y: 16, opacity: 0 },
                dentro: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
                salida: { opacity: 0, transition: { duration: 0.2 } },
              }}
            >
              {numero(index)} / {numero(total - 1)}
            </motion.p>
            <motion.h3
              className={`mt-2 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] ${tinta}`}
              variants={{
                fuera: { y: 20, opacity: 0 },
                dentro: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
                salida: { opacity: 0, transition: { duration: 0.2 } },
              }}
            >
              Bikini
              <br />
              {apellido(nivel)}
            </motion.h3>
            <motion.p
              className={`mt-3 text-[15px] font-medium ${tinta}`}
              variants={{
                fuera: { y: 16, opacity: 0 },
                dentro: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
                salida: { opacity: 0, transition: { duration: 0.2 } },
              }}
            >
              {nivel.sesiones ?? 8} sesiones · Láser diodo · Punta de zafiro
            </motion.p>
            <motion.p
              className={`mt-3 text-[16px] leading-relaxed ${tintaSuave}`}
              variants={{
                fuera: { y: 16, opacity: 0 },
                dentro: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
                salida: { opacity: 0, transition: { duration: 0.2 } },
              }}
            >
              {nivel.cobertura}
            </motion.p>
            <motion.button
              ref={volver}
              type="button"
              onClick={onCerrar}
              className={`mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold ${tinta} underline decoration-current/30 underline-offset-4 outline-offset-4 hover:decoration-current`}
              variants={{
                fuera: { y: 16, opacity: 0 },
                dentro: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
                salida: { opacity: 0, transition: { duration: 0.2 } },
              }}
            >
              <Flecha className="h-4 w-4 rotate-180" />
              Ver los 4 niveles
            </motion.button>
          </div>

          {/* Precio y CTA. */}
          <motion.div
            className="absolute bottom-10 right-10 flex flex-col items-end text-right"
            variants={{
              fuera: { y: 20, opacity: 0 },
              dentro: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
              salida: { opacity: 0, transition: { duration: 0.2 } },
            }}
          >
            {p.regular && (
              <p className={`mb-2 rounded-full px-3 py-1 text-[13px] font-semibold ${e.claro ? 'bg-white/70 text-ink' : 'bg-white/15 text-white'}`}>
                {PROMO_TEMPORADA.nombre} · {PROMO_TEMPORADA.hastaTexto}
              </p>
            )}
            {p.actual ? (
              <p className={`flex items-baseline gap-3 ${tinta}`}>
                {p.regular && <s className={`text-[17px] ${tintaSuave}`}>{p.regular}</s>}
                <span className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">{p.actual}</span>
              </p>
            ) : (
              <p className={`text-[17px] font-semibold ${tinta}`}>Precio por WhatsApp</p>
            )}
            <p className={`mt-1.5 text-[14px] ${tintaSuave}`}>
              Paquete de {nivel.sesiones ?? 8} sesiones{p.msi ? ` · hasta ${p.msi} MSI` : ''}
            </p>
            <WhatsAppCTA variant="secondary" className="mt-5 border-transparent" context={ctaContext(nivel, p.valor)}>
              Cotizar {apellido(nivel)}
            </WhatsAppCTA>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Miniaturas para saltar entre niveles sin cerrar. */}
      <div className="absolute right-10 top-10 z-10 flex gap-2" role="group" aria-label="Cambiar de nivel">
        {NIVELES_BIKINI.map((n, i) => (
          <button
            key={n.slug}
            type="button"
            onClick={() => onCambiar(i)}
            aria-label={n.nombre}
            aria-current={i === index ? 'true' : undefined}
            className={`grid h-14 w-14 place-items-center rounded-xl transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 ${
              i === index ? 'bg-white shadow-[0_8px_20px_-8px_rgba(43,10,30,0.45)]' : e.claro ? 'bg-white/40 hover:bg-white/70' : 'bg-white/10 hover:bg-white/25'
            }`}
          >
            <IlustracionBikini slug={n.slug} className={n.slug === 'bikini-brazilian' ? 'w-11' : 'w-9'} />
          </button>
        ))}
      </div>
    </motion.section>
  )
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                     */
/* -------------------------------------------------------------------------- */

function NivelesMobile() {
  const [abierto, setAbierto] = useState<number | null>(null)

  return (
    <ol className="flex flex-col gap-3 lg:hidden" aria-label="Niveles de bikini">
      {NIVELES_BIKINI.map((nivel, i) => {
        const e = estilo(i)
        const p = precios(nivel)
        const open = abierto === i
        const tinta = e.claro ? 'text-ink' : 'text-white'
        const tintaSuave = e.claro ? 'text-ink/70' : 'text-white/75'
        const panelId = `nivel-bikini-${nivel.slug}`

        return (
          <motion.li
            key={nivel.slug}
            layout
            transition={{ layout: { duration: 0.6, ease: EASE } }}
            className="overflow-hidden rounded-card"
            style={{ backgroundColor: e.fondo, borderRadius: 12 }}
          >
            <motion.button
              layout="position"
              type="button"
              onClick={() => setAbierto(open ? null : i)}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex w-full items-center gap-4 px-5 py-5 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className={`block text-[14px] font-medium tabular-nums ${tintaSuave}`}>{numero(i)}</span>
                <span className={`mt-1 block text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] ${tinta}`}>
                  {nivel.nombre}
                </span>
                <span className={`mt-1 block text-[15px] ${tintaSuave}`}>
                  {p.regular && <s className="mr-2">{p.regular}</s>}
                  <span className={`font-semibold ${tinta}`}>{p.actual ?? 'Precio por WhatsApp'}</span>
                  {p.actual ? ` · ${nivel.sesiones ?? 8} sesiones` : ''}
                </span>
              </span>
              <motion.span
                layout
                transition={{ layout: { duration: 0.6, ease: EASE } }}
                aria-hidden="true"
                className="shrink-0"
              >
                <IlustracionBikini
                  slug={nivel.slug}
                  className={`${nivel.slug === 'bikini-brazilian' ? (open ? 'w-40' : 'w-28') : open ? 'w-24' : 'w-16'} drop-shadow-[0_10px_14px_rgba(43,10,30,0.25)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                />
              </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="px-5 pb-6">
                    <p className={`text-[16px] leading-relaxed ${tintaSuave}`}>{nivel.cobertura}</p>
                    <p className={`mt-3 text-[14px] ${tintaSuave}`}>
                      Láser diodo · Punta de zafiro{p.msi ? ` · hasta ${p.msi} MSI` : ''}
                    </p>
                    <WhatsAppCTA variant="secondary" className="mt-5 w-full border-transparent" context={ctaContext(nivel, p.valor)}>
                      Cotizar {apellido(nivel)}
                    </WhatsAppCTA>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </ol>
  )
}
