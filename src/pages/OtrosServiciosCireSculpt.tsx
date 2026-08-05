import { PageShell, SectionHeading } from '../components/PageShell'
import { PaqueteCards } from '../components/PaqueteCards'
import { Reveal } from '../components/Reveal'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CIRE_SCULPT_ANTICELULITICO } from '../data/precios'

export function OtrosServiciosCireSculpt() {
  useDocumentMeta({
    title: 'Cire Sculpt Anticelulítico — precios',
    description: 'Precios de Cire Sculpt Anti por número de sesiones.',
  })

  return (
    <PageShell
      eyebrow="Otros servicios"
      title="Cire Sculpt Anticelulítico"
      intro="Cire Sculpt Anti, con precio por número de sesiones."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Otros servicios', to: '/otros-servicios' },
      ]}
    >
      <Reveal className="space-y-6">
        <SectionHeading>Precios</SectionHeading>
        <PaqueteCards paquetes={CIRE_SCULPT_ANTICELULITICO} categoria="otros" />
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'cire-sculpt', nombre: 'Cire Sculpt Anticelulítico', categoria: 'otros', articulo: 'el' }}
        titulo="¿Empezamos con Cire Sculpt?"
        texto="Te confirmamos disponibilidad y el número de sesiones que te conviene por WhatsApp."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
