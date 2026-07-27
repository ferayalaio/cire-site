import { useEffect } from 'react'
import { PageShell, Placeholder } from '../components/PageShell'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { trackViewContent } from '../lib/analytics'
import { HIFU, formatPrecio } from '../data/precios'

export function Hifu() {
  useDocumentMeta({
    title: 'HIFU — Cire Lift Protocol',
    description:
      'Ultrasonido focalizado de alta intensidad para tensar la piel sin cirugía ni tiempo de recuperación. Zonas, resultados y valoración.',
  })

  useEffect(() => {
    trackViewContent({ nombre: 'HIFU — Cire Lift Protocol', categoria: 'HIFU', sku: 'hifu' })
  }, [])

  return (
    <PageShell
      eyebrow="Cire Lift Protocol"
      title="HIFU"
      intro="Ultrasonido focalizado de alta intensidad para tensar sin cirugía ni tiempo de recuperación."
    >
      <div className="space-y-4">
        <h2 className="text-2xl text-neutral-900">Qué es el Cire Lift Protocol</h2>
        <Placeholder label="Pendiente: explicación del protocolo y en qué se diferencia" />
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-2xl text-neutral-900">Zonas y precios</h2>
        {HIFU.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.07] text-neutral-400">
                  <th className="px-5 py-3 font-normal">Zona</th>
                  <th className="px-5 py-3 font-normal">Disparos</th>
                  <th className="px-5 py-3 font-normal">Precio</th>
                </tr>
              </thead>
              <tbody>
                {HIFU.map((zona) => (
                  <tr key={zona.slug} className="border-b border-black/[0.05] transition-colors last:border-0 hover:bg-blush-50/60">
                    <td className="px-5 py-4 text-neutral-900">{zona.nombre}</td>
                    <td className="px-5 py-4 text-neutral-600">{zona.disparos ?? '—'}</td>
                    <td className="px-5 py-4 text-neutral-600">
                      {formatPrecio(zona.precio) ?? <span className="text-neutral-300">Pendiente</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Placeholder label="Pendiente: zonas tratables, número de disparos y precio en src/data/precios.ts (campo HIFU)" />
        )}
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-2xl text-neutral-900">Resultados</h2>
        <Placeholder label="Pendiente: en cuánto tiempo se ve, cuánto dura, cada cuánto repetir" />
      </div>

      <WhatsAppSection
        context={{ sku: 'hifu', nombre: 'HIFU — Cire Lift Protocol', categoria: 'hifu' }}
        titulo="Agenda tu valoración"
        texto="El HIFU se cotiza según la zona y los disparos que necesites. Escríbenos y lo vemos."
      />
    </PageShell>
  )
}
