import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function NotFound() {
  useDocumentMeta({
    title: 'Página no encontrada',
    description: 'El enlace puede estar viejo o mal escrito.',
  })

  return (
    <PageShell title="Esta página no existe" intro="Puede que el enlace esté viejo o mal escrito.">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Volver al inicio
      </Link>
    </PageShell>
  )
}
