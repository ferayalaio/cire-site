import type { CSSProperties, ReactNode } from 'react'
import manifiesto from '../data/imagenes-manifest.json'

/*
 * <ImagenPendiente> (nov/26): el único componente de imagen del home.
 *
 * Recibe la ruta del archivo (relativa a public/images/, con el nombre de
 * SHOTLIST.md) y su proporción. Si el archivo existe (está en el manifiesto
 * que genera scripts/imagenes.mjs antes de dev y build), pinta un <picture>
 * con AVIF/WebP/JPG y srcset. Si no existe, pinta la tarjeta "Imagen
 * pendiente" con EXACTAMENTE la misma proporción y radio, así el layout no se
 * mueve cuando llega la foto. Reemplazar una foto = subir el archivo.
 *
 * - `children` es el texto que el diseño final lleva sobre la foto (nombre de
 *   la zona o del combo). Se pinta en los dos estados.
 * - `respaldo` es lo que se ve mientras falta la foto definitiva cuando ya
 *   hay algo provisional (el video actual del hero, las miniaturas actuales de
 *   "Otros tratamientos"). Sin `respaldo`, va la tarjeta pendiente.
 * - En desarrollo la tarjeta muestra además la ruta y la proporción; en
 *   producción solo "Imagen pendiente".
 */

interface Entrada {
  w: number
  h: number
  anchos: number[]
  base: string
}

const MANIFIESTO = manifiesto as Record<string, Entrada>

export function existeImagen(ruta: string): boolean {
  return ruta in MANIFIESTO
}

/** URL de la versión JPG más grande (para <video poster>, og:image, etc.). */
export function urlImagen(ruta: string): string | undefined {
  const e = MANIFIESTO[ruta]
  if (!e) return undefined
  return `${e.base}-${e.anchos[e.anchos.length - 1]}.jpg`
}

interface Props {
  ruta: string
  /** "4:5", "3:2", "1:1", "9:16"… */
  proporcion: string
  alt: string
  /** Atributo sizes del srcset. */
  sizes?: string
  /** Solo el hero: carga inmediata y con prioridad. */
  prioridad?: boolean
  /** Clases del contenedor (radio, ancho). La proporción la pone el componente. */
  className?: string
  /** Clases extra de la <img> (p. ej. object-position). */
  imgClassName?: string
  /** Estilo extra de la <img> (object-position o zoom que vienen de datos). */
  imgStyle?: CSSProperties
  /**
   * Reemplaza la proporción fija por clases propias (el hero recorta distinto
   * en celular). Deben dar la misma caja que tendrá la foto final.
   */
  claseProporcion?: string
  respaldo?: ReactNode
  children?: ReactNode
}

export function ImagenPendiente({
  ruta,
  proporcion,
  alt,
  sizes = '100vw',
  prioridad = false,
  className = '',
  imgClassName = '',
  imgStyle,
  claseProporcion,
  respaldo,
  children,
}: Props) {
  const entrada = MANIFIESTO[ruta]
  const [pw, ph] = proporcion.split(':').map(Number)
  const style: CSSProperties | undefined = claseProporcion ? undefined : { aspectRatio: `${pw} / ${ph}` }
  const caja = `relative overflow-hidden ${claseProporcion ?? ''} ${className}`

  if (entrada) {
    const srcset = (ext: string) => entrada.anchos.map((w) => `${entrada.base}-${w}.${ext} ${w}w`).join(', ')
    const mayor = entrada.anchos[entrada.anchos.length - 1]
    return (
      <div className={caja} style={style}>
        <picture>
          <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
          <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
          <img
            src={`${entrada.base}-${mayor}.jpg`}
            srcSet={srcset('jpg')}
            sizes={sizes}
            alt={alt}
            width={entrada.w}
            height={entrada.h}
            loading={prioridad ? 'eager' : 'lazy'}
            fetchPriority={prioridad ? 'high' : undefined}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
            style={imgStyle}
          />
        </picture>
        {children}
      </div>
    )
  }

  if (respaldo) {
    return (
      <div className={caja} style={style}>
        {respaldo}
        {children}
      </div>
    )
  }

  return (
    <div
      className={`${caja} border border-lila bg-white`}
      style={style}
      role="img"
      aria-label={`${alt} (imagen pendiente)`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3 text-center">
        <span className="text-[13px] font-semibold text-ciruela">Imagen pendiente</span>
        {import.meta.env.DEV && (
          <span className="text-[11px] leading-snug text-neutral-500">
            {ruta}
            <br />
            {proporcion}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
