import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initTracking, trackPageView } from '../lib/analytics'
import { captureAttribution } from '../lib/attribution'

/*
 * Arranca el tracking (Meta Pixel + GA4) y reporta cada vista. Va una sola vez,
 * en el Layout, porque está montado en todas las rutas.
 *
 * Los pasos van en el mismo efecto y en este orden por dependencia real: la
 * atribución tiene que estar guardada antes de que se pueda tocar un CTA, y el
 * `init` tiene que haber corrido antes del primer PageView. Al ser
 * `initTracking` idempotente, correr esto en cada cambio de ruta no
 * reinicializa nada.
 *
 * El nombre quedó de cuando solo había pixel; hoy también arranca GA4.
 */
export function useMetaPixel(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    captureAttribution()
    initTracking()
    trackPageView(pathname)
  }, [pathname])
}
