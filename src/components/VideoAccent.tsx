import { LoopVideo } from './LoopVideo'

interface VideoAccentCaption {
  tag: string
  title: string
}

interface VideoAccentProps {
  src: string
  /** Frame estático mostrado hasta que el clip decodifica (ver LoopVideo) — sin esto, el marco se ve negro un instante al entrar a la ruta. */
  poster?: string
  className?: string
  caption?: VideoAccentCaption
}

/*
 * Acento de video: clips reales de Cire, en loop, mudos y sin controles. Va en
 * el flujo normal junto al título o al contenido de la sección. Marco plano
 * (rounded-2xl, sin vidrio ni resplandor; ver DESIGN.md). `caption` es
 * opcional: junto al h1 de una página ya hay jerarquía de sobra.
 */
export function VideoAccent({ src, poster, className = '', caption }: VideoAccentProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-blush-100">
        <LoopVideo src={src} poster={poster} className="h-full w-full object-cover" />

        {caption && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/60 to-transparent"
            />
            <p className="absolute bottom-4 left-4 right-4 text-[15px] font-semibold text-white">
              {caption.title}
              <span className="block text-[14px] font-normal text-white/85">{caption.tag}</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
