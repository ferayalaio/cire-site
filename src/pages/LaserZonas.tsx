import { Link } from 'react-router-dom'
import { LinkCard, PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Reveal, Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { COMBOS, ZONAS, formatPrecio, hayPrecio } from '../data/precios'
import { TESTIMONIOS_LASER_ZONAS } from '../data/testimonios'

export function LaserZonas() {
  useDocumentMeta({
    title: 'Depilación láser: precios por zona',
    description:
      'Cada zona de depilación láser por separado, con precio por sesión y por paquete. Si tratas más de una, los combos casi siempre salen mejor.',
  })

  return (
    <PageShell
      eyebrow="Depilación láser"
      title="Precios por zona"
      intro="Cada zona por separado. Si vas a tratar más de una, los combos casi siempre salen mejor. Con punta de zafiro que enfría la piel al momento, para mayor comodidad."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
    >
      <Reveal className="space-y-4">
        <SectionHeading>Tabla de zonas</SectionHeading>

        {/*
          Cinco columnas no entran en 375px. Antes el borde de la tarjeta
          usaba `overflow-hidden` y directamente recortaba "Sesiones" y el
          link de upsell sin dejar rastro de que faltaba algo. Ahora el
          scroll horizontal vive en un div interno (así el `rounded-2xl` de
          la tarjeta sigue recortando solo las esquinas) y el aviso de swipe
          solo se muestra en mobile, donde hace falta.
        */}
        <div className="overflow-hidden rounded-3xl border-2 border-blush-200 bg-white shadow-[0_25px_60px_-30px_rgba(130,69,79,0.35)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blush-600 to-blush-900 text-blush-50">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]">Zona</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]">Paquete</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]">Sesiones</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {ZONAS.map((zona, i) => (
                  <tr
                    key={zona.slug}
                    className={`border-b border-blush-100 transition-colors last:border-0 hover:bg-blush-100/70 ${
                      i % 2 === 1 ? 'bg-blush-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-neutral-900">{zona.nombre}</td>
                    <td className="px-5 py-4 text-base font-semibold text-blush-600">
                      {formatPrecio(zona.precioPaquete) ?? <span className="text-sm font-normal text-neutral-300">Pendiente</span>}
                    </td>
                    <td className="px-5 py-4">
                      {zona.sesiones !== null ? (
                        <span className="inline-flex items-center rounded-full bg-blush-50 px-2.5 py-1 text-xs font-semibold text-blush-600 ring-1 ring-inset ring-blush-200">
                          {zona.sesiones} sesiones
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {/*
                        Zonas sin combo exacto: el upsell a Full Body va en la
                        misma fila, no como bloque aparte, para que se lea en el
                        momento en que la persona está mirando justo esa zona.
                      */}
                      {zona.sinComboExacto && (
                        <Link
                          to="/laser/cuerpo-completo"
                          className="whitespace-nowrap text-xs font-semibold text-blush-500 underline hover:text-blush-700"
                        >
                          Ahorra más con Full Body →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-neutral-400 sm:hidden">Desliza para ver todas las columnas →</p>

        {!hayPrecio(...ZONAS.map((z) => z.precioPaquete)) && (
          <Placeholder label="Pendiente: cargar precios del tarifario en src/data/precios.ts" />
        )}
      </Reveal>

      <Reveal className="mt-16 space-y-6">
        <SectionHeading>Combos</SectionHeading>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-500">
          Si tratas más de una zona, un combo casi siempre sale mejor que sumarlas sueltas. El
          precio del combo es fijo: quitar una zona no genera descuento.
        </p>

        <div className="overflow-hidden rounded-3xl border-2 border-blush-200 bg-white shadow-[0_25px_60px_-30px_rgba(130,69,79,0.35)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blush-600 to-blush-900 text-blush-50">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]">Combo</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]">Paquete</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]">Sesiones</th>
                </tr>
              </thead>
              <tbody>
                {COMBOS.map((combo, i) => (
                  <tr
                    key={combo.slug}
                    className={`border-b border-blush-100 transition-colors last:border-0 hover:bg-blush-100/70 ${
                      i % 2 === 1 ? 'bg-blush-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-neutral-900">{combo.nombre}</td>
                    <td className="px-5 py-4 text-base font-semibold text-blush-600">
                      {formatPrecio(combo.precioPaquete) ?? <span className="text-sm font-normal text-neutral-300">Pendiente</span>}
                    </td>
                    <td className="px-5 py-4">
                      {combo.sesiones !== null ? (
                        <span className="inline-flex items-center rounded-full bg-blush-50 px-2.5 py-1 text-xs font-semibold text-blush-600 ring-1 ring-inset ring-blush-200">
                          {combo.sesiones} sesiones
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-neutral-400 sm:hidden">Desliza para ver todas las columnas →</p>
      </Reveal>

      <Reveal className="mt-16 space-y-4">
        <SectionHeading>Te puede convenir el Full Body</SectionHeading>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          <LinkCard
            to="/laser/cuerpo-completo"
            meta="Full Body"
            title="Cuerpo completo"
            description="Si estás sumando tres zonas o más, el paquete completo suele costar menos."
            accent
          />
          <LinkCard
            to="/laser/bikini"
            meta="4 niveles"
            title="Bikini"
            description="Del básico al brazilian, con la cobertura de cada nivel."
            accent
          />
        </Stagger>
      </Reveal>

      <Reveal className="mt-16">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER_ZONAS} />
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'laser-zonas', nombre: 'una zona', categoria: 'laser', articulo: 'la' }}
        titulo="¿No sabes por dónde empezar?"
        texto="Resultados visibles desde la primera sesión. Cuéntanos qué zona te interesa y te armamos la mejor combinación de precio."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
