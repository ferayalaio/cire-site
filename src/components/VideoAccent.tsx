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
 * Acento de video — clips reales, en loop, mudos y sin controles. A propósito
 * NO lleva `absolute`: va en el flujo normal, junto al título o contenido de
 * la sección, así siempre se ve sin importar el ancho de la ventana y sin
 * depender de un fondo grande difuminado.
 *
 * "Marco editorial": el clip sangra hasta el borde de la tarjeta (nada de
 * marco blanco con padding) y un blob difuminado del color de marca se asoma
 * detrás — así se ancla a la página en vez de leerse como una foto de
 * anuncio suelta. `caption` es opcional porque junto al h1 de una página
 * (ver PageShell) ya hay jerarquía de sobra; en tarjetas más chicas (precios,
 * CTA de WhatsApp) sí aporta un motivo de por qué ese clip está ahí.
 *
 * `.liquid-glass` (index.css) pone el "marquito de vidrio": un filo con
 * degradado que solo se ve en las esquinas/bordes redondeados, más un
 * highlight sutil arriba — no un borde sólido ni relleno, así el clip sigue
 * sangrando hasta el borde en vez de quedar con padding blanco alrededor.
 */
export function VideoAccent({ src, poster, className = '', caption }: VideoAccentProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blush-200/70 blur-md"
      />
      <div className="liquid-glass relative h-full w-full rounded-[1.75rem] shadow-[0_25px_55px_-25px_rgba(61,29,34,0.45)]">
        <LoopVideo src={src} poster={poster} className="h-full w-full object-cover" />

        {caption && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/75 to-transparent"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.1em] backdrop-blur-md">
                {caption.tag}
              </span>
              <p className="mt-1.5 font-display text-base">{caption.title}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
