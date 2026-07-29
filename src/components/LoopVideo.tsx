import { useEffect, useRef } from 'react'

interface LoopVideoProps {
  src: string
  className?: string
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
 */
export function LoopVideo({ src, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [src])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      autoPlay
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
