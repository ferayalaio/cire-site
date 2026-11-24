import { useEffect, useRef, useState } from 'react'

interface LoopVideoProps {
  src: string
  className?: string
  /**
   * Frame estático (jpg) que se ve mientras el .mp4 todavía no descarga lo
   * suficiente para pintar — sin esto el `<video>` se ve negro (su fondo por
   * default) durante ese hueco, que en navegación de ruta puede ser notorio
   * incluso con el archivo cacheado, porque el elemento nace vacío en cada
   * mount. Generado con ffmpeg a partir del propio clip (ver
   * public/videos/posters/), así siempre matchea el primer frame real.
   */
  poster?: string
  /**
   * Cargar el video apenas monta. Solo para lo que se ve sin hacer scroll
   * (el hero). El resto espera a estar cerca del viewport, ver abajo.
   */
  eager?: boolean
}

/*
 * Video en loop sin controles ni forma de que la persona lo pause: nada de
 * `controls`, y encima nunca queda a merced de que el navegador decida
 * bloquear el autoplay. React puede setear `muted` como atributo del
 * elemento sin tocar la propiedad `HTMLMediaElement.muted` del DOM real —
 * ahí es donde Chrome/Safari deciden si el autoplay corre o se bloquea, así
 * que si esa propiedad no queda en `true` a tiempo, el video arranca pausado
 * en su primer frame (se ve como "hay que darle play"). useEffect fuerza
 * `muted = true` en el elemento real y llama `play()` a mano; el `catch`
 * silencioso es porque un autoplay bloqueado ya no importa una vez que el
 * mute forzado lo desbloquea, así que no hace falta mostrar ese error en
 * consola. `onEnded` es un respaldo por si algún navegador no dispara el
 * loop nativo con el atributo solo.
 *
 * `preload="auto"` es explícito a propósito: el default del navegador para
 * video muted+autoplay suele ser más conservador (a veces solo trae
 * metadata), lo que alarga justo el hueco que `poster` cubre. El swap
 * poster → primer frame lo hace el navegador solo y no se nota como salto
 * porque el poster viene extraído del mismo frame.
 *
 * Carga diferida: salvo `eager`, el `src` no se asigna hasta que el video está
 * a ~300px de entrar en pantalla — mientras tanto se ve el poster (un jpg de
 * decenas de KB) y no se baja nada del mp4. Sin esto cada página descargaba
 * todos sus videos (2-5 MB cada uno) de entrada, compitiendo en el celular con
 * lo que sí se ve arriba y empeorando el LCP. De yapa, un video oculto con
 * `display: none` (los acentos `hidden md:block` en mobile) nunca intersecta,
 * así que en el teléfono directamente no se descarga.
 */
export function LoopVideo({ src, className, poster, eager = false }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [cerca, setCerca] = useState(eager)

  useEffect(() => {
    if (cerca) return
    const video = ref.current
    if (!video) return

    if (typeof IntersectionObserver === 'undefined') {
      setCerca(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCerca(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [cerca])

  useEffect(() => {
    const video = ref.current
    if (!video || !cerca) return
    video.muted = true
    video.play().catch(() => {})
  }, [src, cerca])

  return (
    <video
      ref={ref}
      className={className}
      src={cerca ? src : undefined}
      poster={poster}
      preload={cerca ? 'auto' : 'none'}
      autoPlay={cerca}
      loop
      muted
      playsInline
      disablePictureInPicture
      onEnded={(e) => {
        const video = e.currentTarget
        video.currentTime = 0
        video.play().catch(() => {})
      }}
    />
  )
}
