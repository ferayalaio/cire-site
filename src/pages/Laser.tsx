import { LinkCard, PageShell, Placeholder } from '../components/PageShell'
import { WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CLAIMS, MARCA } from '../data/marca'
import { MSI } from '../data/precios'

export function Laser() {
  useDocumentMeta({
    title: 'Depilación láser de diodo — Protocolo Láser Expert 8®',
    description:
      'Depilación láser de diodo con punta de zafiro. Elige cómo armar tu tratamiento: zona por zona, un nivel de bikini, o Full Body en una sola sesión.',
  })

  return (
    <PageShell
      eyebrow={MARCA.protocolo}
      title="Láser de diodo"
      intro="Elige cómo quieres armar tu tratamiento: zona por zona, un nivel de bikini, o cuerpo completo en una sola sesión."
    >
      <div className="stagger-fade grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard
          to="/laser/zonas"
          meta="A la carta"
          title="Por zonas"
          description="Precio de cada zona individual y a qué combo te conviene pasarte si tratas más de una."
        />
        <LinkCard
          to="/laser/bikini"
          meta="4 niveles"
          title="Bikini"
          description="Del bikini básico al brazilian, con la cobertura de cada nivel."
        />
        <LinkCard
          to="/laser/cuerpo-completo"
          meta="Full Body"
          title="Cuerpo completo"
          description="Todas las zonas en una sesión, al mejor precio por área."
        />
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl text-neutral-900">El protocolo</h2>
          <p className="text-sm leading-relaxed text-neutral-600">{CLAIMS.protocolo}</p>
          <p className="text-sm leading-relaxed text-neutral-600">{CLAIMS.tecnologia}</p>
          <p className="text-sm leading-relaxed text-neutral-600">{CLAIMS.experiencia}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl text-neutral-900">Antes y después</h2>
          <Placeholder label="Pendiente: subir fotos de antes/después a public/antes-despues/" />
        </div>
      </div>

      {MSI.disponible && (
        <p className="mt-12 text-sm text-neutral-400">
          Meses sin intereses disponibles{MSI.meses.length > 0 ? ` a ${MSI.meses.join(' y ')} meses` : ''}
          . {MSI.nota}
        </p>
      )}

      <div className="mt-16">
        <WhatsAppCTA context={{ sku: 'laser', nombre: 'depilación láser', categoria: 'laser', placement: 'seccion' }}>
          Escríbenos por WhatsApp
        </WhatsAppCTA>
      </div>
    </PageShell>
  )
}
