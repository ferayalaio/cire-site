/*
 * Índice del blog. Cada artículo es su propio componente en src/pages/blog/
 * (el contenido es JSX, con enlaces internos reales), y acá vive solo lo que
 * necesitan el listado, el <head> y el sitemap.
 *
 * Para publicar uno nuevo: crear el componente, agregarlo acá y la ruta en
 * App.tsx. El prerender lo toma de BLOG_POSTS (ver entry-server.tsx), así que
 * entra solo al sitemap.
 *
 * Regla de contenido: todo dato sobre tratamientos sale de los manuales
 * oficiales de Cire. Nada de porcentajes, tiempos ni promesas que no estén ahí.
 */
export interface BlogPost {
  slug: string
  titulo: string
  /** Para la meta description y la tarjeta del índice. 140-160 caracteres. */
  descripcion: string
  /** ISO, fecha de publicación. */
  fecha: string
  /** ISO, última revisión del contenido. */
  actualizado: string
  minutos: number
  categoria: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'cuantas-sesiones-depilacion-laser',
    titulo: '¿Cuántas sesiones de depilación láser necesito?',
    descripcion:
      'Cuántas sesiones de depilación láser diodo se necesitan, cada cuánto se hacen y qué cambia en cada una. Lo que influye según tu zona, piel y vello.',
    fecha: '2026-11-24',
    actualizado: '2026-11-24',
    minutos: 5,
    categoria: 'Depilación láser',
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

/* "24 de noviembre de 2026", sin depender del locale del navegador ni del servidor. */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export function formatFecha(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${y}`
}
