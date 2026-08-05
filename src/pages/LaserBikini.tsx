import { PageShell, Placeholder } from '../components/PageShell'
import { Reveal, Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA, WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { NIVELES_BIKINI, formatPrecio, hayPrecio } from '../data/precios'
import { TESTIMONIOS_LASER_BIKINI } from '../data/testimonios'

/*
 * Los 4 niveles van de menor a mayor cobertura (ver comentario en
 * data/precios.ts) — esta escala de intensidad hace que ese orden se *vea*,
 * no solo se lea: el rosa se satura progresivamente del básico al brazilian,
 * así el ojo capta "voy subiendo de nivel" antes de leer una sola palabra.
 * Es el gancho visual pedido, pero anclado al contenido real en vez de un
 * color puesto porque sí.
 */
const NIVEL_ACCENTS = [
  { badge: 'bg-blush-100 text-blush-500', bar: 'from-blush-200 to-blush-300', border: 'hover:border-blush-200', price: 'text-blush-500' },
  { badge: 'bg-blush-200 text-blush-600', bar: 'from-blush-300 to-blush-400', border: 'hover:border-blush-300', price: 'text-blush-500' },
  { badge: 'bg-blush-400 text-white', bar: 'from-blush-400 to-blush-500', border: 'hover:border-blush-400', price: 'text-blush-600' },
  { badge: 'bg-blush-500 text-white', bar: 'from-blush-500 to-blush-600', border: 'hover:border-blush-500', price: 'text-blush-600' },
]

export function LaserBikini() {
  useDocumentMeta({
    title: 'Depilación láser de bikini — 4 niveles',
    description:
      'Los cuatro niveles de bikini en depilación láser, del básico al brazilian, con la cobertura de cada uno.',
  })

  return (
    <PageShell
      eyebrow="Depilación láser"
      title="Bikini"
      intro="Cuatro niveles según cuánta cobertura quieres. Si dudas, en cabina te ayudamos a elegir. Con punta de zafiro que enfría la piel al momento, para mayor comodidad en zonas sensibles."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
    >
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {NIVELES_BIKINI.map((nivel, index) => {
          const accent = NIVEL_ACCENTS[index] ?? NIVEL_ACCENTS[NIVEL_ACCENTS.length - 1]
          return (
            <div
              key={nivel.slug}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 pt-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)] ${accent.border}`}
            >
              {/* Franja de intensidad: el mismo degradé que sube de nivel en nivel, para que la progresión se note antes de leer nada. */}
              <span className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent.bar}`} aria-hidden="true" />

              <div className="flex items-center gap-3">
                {/*
                  Icono propio de marca. `nivel.icono` viene vacío hasta que se
                  suban los cuatro archivos a public/iconos-bikini/ — mientras
                  tanto se muestra el número de orden, nunca un icono genérico
                  que se confunda con el definitivo. Ahora relleno de color (no
                  ya un contorno punteado) para que también cargue su parte
                  del gancho visual.
                */}
                {nivel.icono ? (
                  <img src={nivel.icono} alt="" className="h-10 w-10" />
                ) : (
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-transform duration-300 group-hover:scale-110 ${accent.badge}`}
                  >
                    {index + 1}
                  </span>
                )}
                <span className="text-xl text-neutral-900">{nivel.nombre}</span>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-500">
                {nivel.cobertura || 'Pendiente: descripción de cobertura de este nivel.'}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                {hayPrecio(nivel.precioSesion, nivel.precioPaquete) ? (
                  <>
                    {/*
                      El precio por sesión, cuando existe, es el destacado
                      (es el número que la persona compara entre niveles); si
                      no hay, el de paquete pasa a ocupar ese lugar en vez de
                      quedarse en gris pequeño sin nada al lado.
                    */}
                    {formatPrecio(nivel.precioSesion) && (
                      <span className={`text-2xl font-medium ${accent.price}`}>{formatPrecio(nivel.precioSesion)}</span>
                    )}
                    {formatPrecio(nivel.precioPaquete) && (
                      <span className={formatPrecio(nivel.precioSesion) ? 'text-sm text-neutral-400' : `text-2xl font-medium ${accent.price}`}>
                        {formatPrecio(nivel.precioPaquete)} paquete
                        {nivel.sesiones ? ` (${nivel.sesiones} sesiones)` : ''}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-neutral-300">Precio pendiente</span>
                )}
              </div>

              {/*
                Un CTA por nivel y no uno solo al pie: es la diferencia entre saber
                que la campaña generó un clic "de bikini" y saber que lo generó
                del nivel brazilian. `valor` habilita ROAS en cuanto haya precio.
              */}
              <WhatsAppCTA
                variant="secondary"
                className="mt-6 w-full"
                context={{
                  sku: nivel.slug,
                  nombre: nivel.nombre,
                  categoria: 'laser',
                  placement: 'card',
                  valor: nivel.precioPaquete ?? undefined,
                }}
              >
                Consultar por WhatsApp
              </WhatsAppCTA>
            </div>
          )
        })}
      </Stagger>

      {!NIVELES_BIKINI.some((n) => n.cobertura) && (
        <div className="mt-10">
          <Placeholder label="Pendiente: descripción de cobertura de cada nivel y precios en src/data/precios.ts" />
        </div>
      )}

      <Reveal className="mt-16">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER_BIKINI} />
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'laser-bikini', nombre: 'un nivel de bikini', categoria: 'laser' }}
        titulo="¿No sabes qué nivel elegir?"
        texto="Resultados visibles desde la primera sesión. Cuéntanos qué buscas y te ayudamos a decidir cuál te conviene."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
