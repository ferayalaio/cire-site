import { LinkCard, PageShell } from '../components/PageShell'
import { BLOG_POSTS, formatFecha } from '../data/blog'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function Blog() {
  useDocumentMeta({
    title: 'Blog de depilación láser y cuidado de la piel',
    description:
      'Guías de Cire Depilación sobre depilación láser, HIFU y tratamientos corporales: sesiones, cuidados y qué esperar, explicado por especialistas.',
  })

  return (
    <PageShell
      eyebrow="Blog"
      title="Guías y preguntas frecuentes"
      intro="Lo que nos preguntan en cabina, explicado con calma: cuántas sesiones, cómo prepararte y qué esperar de cada tratamiento."
      breadcrumbs={[{ label: 'Inicio', to: '/' }]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <LinkCard
            key={post.slug}
            to={`/blog/${post.slug}`}
            title={post.titulo}
            description={post.descripcion}
            meta={`${post.categoria} · ${formatFecha(post.fecha)}`}
          />
        ))}
      </div>
    </PageShell>
  )
}
