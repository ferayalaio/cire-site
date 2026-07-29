import { FRONT_VIDEO } from '../lib/constants'
import { WhatsAppCTA } from './WhatsAppCTA'

/*
 * El video (hero.mp4) es panorámico 16:9. De `sm` para arriba el viewport se
 * acerca a esa proporción y `object-cover` a pantalla completa se ve bien,
 * pero en un teléfono angosto y alto forzarlo a llenar todo el alto recorta
 * casi todo el ancho del encuadre — se ve como un zoom exagerado, no como el
 * video real.
 *
 * Por eso mobile y desktop usan una composición distinta, controlada con
 * breakpoints (no dos componentes separados):
 * - Mobile (default): el video vive en su propia franja con `aspect-video`
 *   (su proporción nativa, cero recorte) arriba; abajo, un panel propio con
 *   fondo de marca (no el video) contiene título y CTA.
 * - `sm:` y superior: vuelve al video de fondo completo de siempre, con el
 *   título y el CTA superpuestos encima.
 */
export function Hero() {
  return (
    <section className="relative flex h-dvh w-full flex-col overflow-hidden bg-black sm:block">
      {/* Layer 1 — franja de video en mobile; fondo completo desde sm */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:absolute sm:inset-0 sm:aspect-auto sm:h-full">
        <video
          className="h-full w-full object-cover"
          src={FRONT_VIDEO}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/*
        Layer 2 — scrim para que el texto blanco y el nav se lean sobre el
        video claro. Solo aplica desde sm: en mobile el título ya no va
        encima del video, sino en el panel de abajo.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-[45dvh] bg-gradient-to-b from-black/25 to-transparent sm:block" />

      {/*
        Layer 3 — panel de contenido. En mobile es un bloque normal (flex-1
        reparte el alto restante bajo la franja de video) con su propio
        fondo oscuro de marca. Desde sm se vuelve una capa transparente
        superpuesta al video, y título/CTA pasan a `absolute` dentro de ella
        — mismo posicionamiento que antes.
      */}
      <div className="relative z-20 flex flex-1 flex-col justify-between bg-gradient-to-b from-black to-blush-900 px-6 py-10 sm:absolute sm:inset-0 sm:block sm:flex-none sm:justify-normal sm:bg-none sm:px-0 sm:py-0">
        <h1 className="heading-1 leading-[0.9] text-white text-[2.75rem] sm:absolute sm:inset-x-0 sm:top-28 sm:px-10 sm:text-[4.25rem] md:top-32 md:text-[5.5rem] lg:text-[6.5rem]">
          <span className="block animate-slide-in-left motion-reduce:animate-none">Cire</span>
          <span className="block animate-slide-in-right motion-reduce:animate-none [animation-delay:250ms]">
            depilación
          </span>
        </h1>

        {/*
          CTA del hero. Es la superficie que más tráfico de anuncios recibe,
          así que va con sku propio (`home-hero`) — si compartiera el del
          botón flotante no se podría comparar cuál de los dos convierte.
        */}
        <div className="sm:absolute sm:inset-x-0 sm:bottom-28 sm:px-10">
          <WhatsAppCTA
            context={{
              sku: 'home-hero',
              nombre: 'sus servicios',
              categoria: 'general',
              placement: 'hero',
            }}
          >
            Agenda por WhatsApp
          </WhatsAppCTA>
        </div>
      </div>
    </section>
  )
}
