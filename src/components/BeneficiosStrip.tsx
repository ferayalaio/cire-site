/*
 * Cintillo de beneficios clave, pegado debajo del hero (05/ago/26).
 *
 * Es la primera banda oscura de la página y ese es medio el punto: el hero
 * termina en video y lo que seguía era fondo rosa claro hasta el final del
 * scroll. Un corte de negro sólido acá le pone un piso al hero —lo cierra en
 * vez de dejarlo desvanecerse— y marca el arranque del contenido.
 *
 * Tres beneficios y no seis: es un cintillo de una línea, no una sección. Lo
 * que se desarrolla (el protocolo, la normativa, los años) vive en "Por qué
 * elegir Cire", que va justo debajo — acá solo van los tres titulares que
 * contestan "¿por qué acá?" mientras el ojo todavía viene bajando del hero.
 *
 * `-mt-px` cierra la costura contra el hero: entre dos bloques de fondo distinto
 * a ciertos zooms el navegador deja una línea de subpíxel del fondo de la página.
 */

interface IconProps {
  className?: string
}

function ChipIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HeartHandIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 8.4c1-1.7 2.6-2.2 3.9-1.6 1.4.6 2 2.3 1.3 3.8-.7 1.6-2.8 3.1-5.2 4.5-2.4-1.4-4.5-2.9-5.2-4.5-.7-1.5-.1-3.2 1.3-3.8 1.3-.6 2.9-.1 3.9 1.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 13.5V20M20.5 13.5V20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SparkleIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5c.4 3.6 1.2 6 2.6 7.4 1.4 1.4 3.8 2.2 7.4 2.6-3.6.4-6 1.2-7.4 2.6-1.4 1.4-2.2 3.8-2.6 7.4-.4-3.6-1.2-6-2.6-7.4-1.4-1.4-3.8-2.2-7.4-2.6 3.6-.4 6-1.2 7.4-2.6 1.4-1.4 2.2-3.8 2.6-7.4Z" />
    </svg>
  )
}

const ITEMS = [
  {
    key: 'tecnologia',
    titulo: 'Tecnología de última generación',
    texto: 'Láser diodo con punta de zafiro',
    Icon: ChipIcon,
  },
  {
    key: 'atencion',
    titulo: 'Atención personalizada',
    texto: 'Protocolo según tu piel y tu vello',
    Icon: HeartHandIcon,
  },
  {
    key: 'resultados',
    titulo: 'Resultados visibles',
    texto: 'Desde la primera sesión',
    Icon: SparkleIcon,
  },
]

export function BeneficiosStrip() {
  return (
    <section aria-label="Por qué Cire" className="relative -mt-px overflow-hidden bg-ink text-white">
      {/* Resplandor blush apenas perceptible: es lo que evita que la banda se
          lea como un rectángulo negro pegado y la ata a la paleta del sitio. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-blush-500/25 blur-3xl"
      />

      {/*
       * Riel horizontal en celular y grilla desde `sm`, el mismo recurso que el
       * resto del sitio (ver `.no-scrollbar`): apilados en vertical los tres
       * items son media pantalla de scroll para algo que se tiene que leer al
       * pasar.
       *
       * Los separadores son `divide-x` desde `sm` nada más: en el riel las
       * tarjetas ya se separan por el corte de la pantalla.
       */}
      <ul className="no-scrollbar relative mx-auto flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10 sm:overflow-visible sm:px-10 sm:py-7">
        {ITEMS.map(({ key, titulo, texto, Icon }) => (
          <li
            key={key}
            className="flex w-[78%] shrink-0 snap-start items-center gap-3.5 sm:w-auto sm:justify-center sm:px-6"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blush-400/40 bg-blush-500/15 text-blush-200">
              <Icon />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-white">{titulo}</p>
              <p className="mt-0.5 text-xs leading-snug text-white/55">{texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
