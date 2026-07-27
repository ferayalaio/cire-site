import { Navigate, useParams } from 'react-router-dom'

/*
 * `/paquetes/:slug` era la ruta canónica de una versión anterior del sitio,
 * cuando cada paquete tenía su propia URL. La estructura final la reemplazó
 * por páginas fijas agrupadas por servicio (`/laser/zonas`, `/laser/bikini`,
 * etc.), así que esto solo mapea los slugs viejos a dónde vive ese contenido
 * ahora, para no romper un link que alguien haya guardado de esa etapa.
 *
 * Un slug fuera del mapa cae al hub de láser y no a un destino específico
 * inventado: sigue siendo mejor que un 404 para un link viejo, y no arriesga
 * mandar a alguien a una página que no tiene que ver con lo que buscaba.
 */
const DESTINO: Record<string, string> = {
  'laser-cuerpo-completo': '/laser/cuerpo-completo',
  'laser-bikini-clasico': '/laser/bikini',
  'laser-bikini-frances': '/laser/bikini',
  'laser-bikini-brasileno': '/laser/bikini',
  'laser-bikini-completo': '/laser/bikini',
  'laser-axilas': '/laser/zonas',
  'laser-piernas-completas': '/laser/zonas',
  'laser-media-pierna': '/laser/zonas',
  'laser-brazos': '/laser/zonas',
  'laser-rostro': '/laser/zonas',
  'laser-espalda': '/laser/zonas',
  cera: '/cera',
  hifu: '/hifu',
  'post-operatorio': '/otros-servicios',
  'cire-sculpt': '/otros-servicios',
  aparatologia: '/otros-servicios',
}

export function PaqueteRedirect() {
  const { slug } = useParams<{ slug: string }>()
  const destino = slug ? DESTINO[slug] : undefined

  return <Navigate to={destino ?? '/laser'} replace />
}
