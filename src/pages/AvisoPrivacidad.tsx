import { PageShell, Placeholder } from '../components/PageShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { COFEPRIS } from '../data/marca'

export function AvisoPrivacidad() {
  useDocumentMeta({
    title: 'Aviso de privacidad',
    description: 'Aviso de privacidad de Cire Depilación.',
  })

  return (
    <PageShell eyebrow="Legal" title="Aviso de privacidad">
      {/* El texto legal lo define el cliente; no se redacta acá. */}
      <Placeholder label="Pendiente: texto del aviso de privacidad provisto por Cire (LFPDPPP)" />

      <p className="mt-10 text-sm leading-relaxed text-neutral-500">{COFEPRIS}</p>
    </PageShell>
  )
}
