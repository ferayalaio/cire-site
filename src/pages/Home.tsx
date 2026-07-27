import { Hero } from '../components/Hero'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function Home() {
  useDocumentMeta({
    title: 'Cire Depilación — Láser Expert 8®, cera y HIFU',
    description:
      'Depilación láser de diodo con punta de zafiro, cera italiana y HIFU. 9 años de experiencia y 5 sucursales en Ciudad de México y Metepec. Agenda tu cita por WhatsApp.',
  })

  return <Hero />
}
