import { Link } from 'react-router-dom'

/*
 * Tarjeta de servicio de "Elige tu tratamiento" (05/ago/26).
 *
 * Reemplaza al LinkCard genérico que había acá (ver PageShell.tsx, que lo sigue
 * usando en los hubs internos). El problema del LinkCard en el home no era el
 * estilo sino la jerarquía: las cuatro tarjetas eran rectángulos blancos con
 * texto gris, exactamente iguales entre sí y a las de beneficios y sucursales,
 * en la sección que decide a qué servicio entra la persona. Sin una imagen y
 * sin una etiqueta que diferencie, la elección se hace leyendo cuatro párrafos.
 *
 * Qué cambia:
 *
 * - Imagen real de la técnica (frames de los videos que ya usan las páginas de
 *   cada servicio, ver constants.ts), no un ícono. Es lo que se reconoce antes
 *   de leer.
 * - Badge de alto contraste en la esquina: "POPULAR", "RESULTADO INMEDIATO",
 *   "LÁSER DIODO". Es la etiqueta que separa una tarjeta de la de al lado en un
 *   escaneo de dos segundos.
 * - Elevación al hover (`-translate-y-2` + sombra + borde blush) con la imagen
 *   haciendo un zoom lento por debajo. La tarjeta entera es el link, así que el
 *   hover no tiene que adivinar dónde está el área clickeable.
 *
 * El texto va sobre un degradado que arranca desde abajo y no en una franja
 * blanca debajo de la foto: así la tarjeta tiene una sola silueta y la altura
 * no depende de cuántas líneas mida la descripción de cada servicio.
 */

export interface Tratamiento {
  to: string
  title: string
  description: string
  /** Etiqueta de la esquina. Corto y en mayúsculas: es un sello, no una frase. */
  badge: string
  /** `true` en el badge que tiene que ganar la mirada (uno solo por grilla). */
  badgeDestacado?: boolean
  /** Frame de la técnica, de `public/`. */
  imagen: string
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TratamientoCard({ to, title, description, badge, badgeDestacado, imagen }: Tratamiento) {
  return (
    <Link
      to={to}
      className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-black/[0.07] bg-ink shadow-[0_10px_30px_-24px_rgba(30,30,30,0.6)] transition-all duration-300 hover:-translate-y-2 hover:border-blush-300 hover:shadow-[0_35px_60px_-25px_rgba(166,94,109,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2"
    >
      {/* `alt=""` + `aria-hidden`: la imagen es ambiente de la técnica, y el
          nombre del servicio ya está como texto justo debajo — describirla otra
          vez solo agrega ruido en el lector de pantalla. */}
      <img
        src={imagen}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Velo vertical: transparente arriba para que se vea la técnica, casi
          sólido abajo para que el texto blanco tenga contraste real sin
          depender del frame que le tocó a cada servicio. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,14,15,0.95)_0%,rgba(20,14,15,0.8)_38%,rgba(20,14,15,0.25)_70%,rgba(20,14,15,0.1)_100%)]"
      />

      <span
        className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-lg ${
          badgeDestacado
            ? 'bg-blush-500 text-white shadow-blush-900/40'
            : 'bg-white text-blush-900 shadow-black/25'
        }`}
      >
        {badge}
      </span>

      <div className="relative z-10 p-6">
        <h3 className="text-2xl leading-tight text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{description}</p>

        {/* La pastilla de "Ver más" se enciende al hover en vez de aparecer:
            visible siempre (para que se sepa que la tarjeta lleva a algún
            lado) pero apagada, así el hover tiene una respuesta clara. */}
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-2 pl-4 pr-2 text-xs font-medium text-white backdrop-blur-md transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-blush-900">
          Ver más
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:bg-blush-100">
            <ArrowUpRightIcon />
          </span>
        </span>
      </div>
    </Link>
  )
}
