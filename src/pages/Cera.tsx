import { useEffect } from 'react'
import { PageShell, Placeholder } from '../components/PageShell'
import { Reveal } from '../components/Reveal'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { CERA, formatPrecio } from '../data/precios'

export function Cera() {
  useDocumentMeta({
    title: 'Depilación con cera italiana',
    description:
      'Depilación con cera italiana para quien prefiere resultado inmediato o no es candidata a láser. Zonas, precios y turnos.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'Depilación con cera', categoria: 'Depilacion con Cera', sku: 'cera' })
  }, [])

  return (
    <PageShell
      eyebrow="Servicios"
      title="Depilación con cera"
      intro="Cera italiana, para quien prefiere resultado inmediato o no es candidata a láser."
    >
      <Reveal className="space-y-4">
        <h2 className="text-2xl text-neutral-900">Zonas y precios</h2>
        {CERA.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
            <table className="w-full text-left text-sm">
              <tbody>
                {CERA.map((zona) => (
                  <tr key={zona.slug} className="border-b border-black/[0.05] transition-colors last:border-0 hover:bg-blush-50/60">
                    <td className="px-5 py-4 text-neutral-900">{zona.nombre}</td>
                    <td className="px-5 py-4 text-neutral-600">
                      {formatPrecio(zona.precio) ?? <span className="text-neutral-300">Pendiente</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Placeholder label="Pendiente: tabla de zonas con precio en src/data/precios.ts (campo CERA)" />
        )}
      </Reveal>

      <Reveal className="mt-12 space-y-4">
        <h2 className="text-2xl text-neutral-900">Cera vs. láser</h2>
        <Placeholder label="Pendiente: comparativa para ayudar a decidir" />
      </Reveal>

      <WhatsAppSection
        context={{ sku: 'cera', nombre: 'la depilación con cera', categoria: 'cera', articulo: 'la' }}
        titulo="Saca tu turno"
        texto="Dinos qué zona y en qué sucursal, y te confirmamos precio y disponibilidad."
      />
    </PageShell>
  )
}
