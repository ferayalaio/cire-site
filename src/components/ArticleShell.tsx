import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { FaqItem } from '../data/faq'
import { formatFecha, type BlogPost } from '../data/blog'
import { MARCA } from '../data/marca'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useArticleJsonLd, useFaqJsonLd } from '../hooks/useJsonLd'
import { Faq } from './Faq'
import { PageShell } from './PageShell'
import { WhatsAppSection } from './WhatsAppCTA'

/*
 * Plantilla de artículo del blog. Resuelve todo lo de SEO de una vez —title,
 * description, Article + FAQPage en JSON-LD, migas, fecha y autor visibles
 * (E-E-A-T)— para que cada artículo sea solo su texto.
 *
 * El cuerpo va en una columna angosta (max-w-2xl): a 7xl de ancho las líneas
 * largas se leen mal, y un artículo se lee entero, no se escanea como una
 * página de precios.
 */
export function ArticleShell({
  post,
  faq,
  whatsapp,
  children,
}: {
  post: BlogPost
  faq?: FaqItem[]
  whatsapp: { sku: string; nombre: string; categoria: string }
  children: ReactNode
}) {
  useDocumentMeta({ title: post.titulo, description: post.descripcion })
  useArticleJsonLd(post)
  useFaqJsonLd(faq ?? [])

  return (
    <PageShell
      eyebrow={post.categoria}
      title={post.titulo}
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Blog', to: '/blog' },
      ]}
    >
      <p className="-mt-6 text-sm text-neutral-400">
        Por el equipo de especialistas de {MARCA.nombre} · {MARCA.anosExperiencia} años de experiencia ·{' '}
        <time dateTime={post.fecha}>{formatFecha(post.fecha)}</time> · {post.minutos} min de lectura
      </p>

      <article className="article-body mt-10 max-w-2xl">{children}</article>

      {faq && faq.length > 0 && (
        <section className="mt-16 max-w-3xl">
          <Faq items={faq} />
        </section>
      )}

      <p className="mt-12 max-w-2xl text-sm text-neutral-400">
        Este artículo es informativo y no sustituye una valoración profesional. Cada piel y cada vello responden
        distinto: en tu primera cita una especialista revisa tu caso.{' '}
        <Link to="/blog" className="text-neutral-600 underline underline-offset-4 hover:text-neutral-900">
          Ver más artículos
        </Link>
      </p>

      <WhatsAppSection
        context={{ ...whatsapp, articulo: 'la' }}
        titulo="¿Quieres saber cuántas sesiones necesitas tú?"
        texto="Agenda tu valoración sin costo: revisamos tu piel y tu vello y te armamos el plan."
      >
        Escríbenos por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
