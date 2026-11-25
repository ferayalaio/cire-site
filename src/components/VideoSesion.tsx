import { useEffect, useRef, useState } from 'react'

/*
 * Video de sesión real con narración (nov/26). Los reels traen subtítulos
 * quemados en la imagen, así que se entienden sin audio: arrancan solos, mudos
 * y en bucle cuando entran en pantalla, y se pausan al salir (no gastan datos
 * ni batería fuera de vista). El botón activa el sonido de ese video.
 *
 * Con `prefers-reduced-motion` no arrancan solos: se ve el poster y el mismo
 * botón los reproduce con sonido.
 */
export function VideoSesion({ src, poster, titulo, etiqueta }: { src: string; poster: string; titulo: string; etiqueta?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [reproduciendo, setReproduciendo] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* el navegador bloqueó el autoplay: queda el poster y el botón */
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  function alternarSonido() {
    const video = ref.current
    if (!video) return
    const siguiente = !muted
    video.muted = siguiente
    setMuted(siguiente)
    if (video.paused) {
      video.play().catch(() => {})
    }
  }

  return (
    <figure>
      <div className="relative overflow-hidden rounded-card bg-lila">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        className="aspect-[9/16] w-full object-cover"
        aria-label={titulo}
      />
      <button
        type="button"
        onClick={alternarSonido}
        aria-pressed={!muted}
        className="absolute bottom-3 left-3 inline-flex min-h-11 items-center gap-2 rounded-btn bg-ink/85 px-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
          {muted ? (
            <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
        {muted ? (reproduciendo ? 'Activar sonido' : 'Ver con sonido') : 'Silenciar'}
      </button>
      </div>
      <figcaption className="mt-3 text-[15px] font-semibold text-ink">
        {etiqueta ?? <span className="sr-only">{titulo}</span>}
        {etiqueta && <span className="sr-only">. {titulo}</span>}
      </figcaption>
    </figure>
  )
}
