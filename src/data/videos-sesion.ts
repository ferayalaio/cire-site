/*
 * Videos de "Así es una sesión en Cire" (home). Numerados igual que en la
 * carpeta original (Downloads/Videos-LandingPage/<n>.mp4), convertidos a
 * 540x960 H.264 con audio en public/videos/sesion/video-<n>.mp4.
 *
 * Reglas (pedidas por la dueña, 2026-11-25):
 * - Cada visita ve 3 de estos videos, elegidos al azar, en orden al azar.
 * - Los videos 2 y 3 nunca salen juntos.
 * - Dentro de la misma visita la selección se mantiene (sessionStorage), para
 *   que el home no cambie si la persona va a otra página y regresa.
 *
 * Para agregar un video: convertirlo igual que los demás, sumarlo a VIDEOS y,
 * si no puede convivir con otro, agregar el par a NUNCA_JUNTOS.
 */

export interface VideoSesionData {
  id: number
  titulo: string
  /** Etiqueta corta visible debajo del video. */
  etiqueta: string
}

export const VIDEOS: VideoSesionData[] = [
  { id: 1, titulo: 'Video: por qué elegir Cire para tu depilación láser', etiqueta: 'Por qué Cire' },
  { id: 2, titulo: 'Video: cómo es una sesión del paquete de cuerpo completo en una cabina de Cire', etiqueta: 'Full Body en cabina' },
  { id: 3, titulo: 'Video: cómo es la depilación láser de bikini en Cire y sus 4 diseños', etiqueta: 'Bikini: 4 diseños' },
  { id: 4, titulo: 'Video: diferencia entre el láser con punta de zafiro y el rastrillo', etiqueta: 'Zafiro vs. rastrillo' },
  { id: 5, titulo: 'Video: depilación láser diodo en Ciudad de México con Cire', etiqueta: 'Láser diodo en CDMX' },
  { id: 6, titulo: 'Video: sesión de láser en zona íntima con el equipo calibrado a tu tipo de piel', etiqueta: 'Zona íntima' },
]

/** Pares de videos que no pueden mostrarse en la misma visita. */
const NUNCA_JUNTOS: [number, number][] = [[2, 3]]

const CUANTOS = 3
const STORAGE_KEY = 'cire-videos-sesion'

/** Lo que muestra el HTML prerenderizado, antes de que el navegador elija. */
const POR_DEFECTO = [1, 4, 6]

/*
 * Poster: cuadro real del video con la cara visible y sin subtítulos encima,
 * en public/images/sesiones/{n}-poster.jpg (ver SHOTLIST.md). Si falta, cae
 * al poster anterior.
 */
export function rutaVideo(id: number, posterOptimizado?: string): { src: string; poster: string } {
  return { src: `/videos/sesion/video-${id}.mp4`, poster: posterOptimizado ?? `/videos/sesion/video-${id}.jpg` }
}

function esValida(ids: number[]): boolean {
  return (
    ids.length === CUANTOS &&
    new Set(ids).size === CUANTOS &&
    ids.every((id) => VIDEOS.some((v) => v.id === id)) &&
    !NUNCA_JUNTOS.some(([a, b]) => ids.includes(a) && ids.includes(b))
  )
}

/** Todas las combinaciones de 3 que respetan NUNCA_JUNTOS. */
function combinacionesValidas(): number[][] {
  const ids = VIDEOS.map((v) => v.id)
  const out: number[][] = []
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++)
      for (let k = j + 1; k < ids.length; k++) {
        const combo = [ids[i], ids[j], ids[k]]
        if (esValida(combo)) out.push(combo)
      }
  return out
}

function barajar<T>(items: T[]): T[] {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/**
 * Los 3 videos de esta visita. En el servidor (prerender) devuelve siempre el
 * mismo set; en el navegador sortea uno y lo guarda para el resto de la visita.
 */
export function elegirVideos(): VideoSesionData[] {
  const porId = (ids: number[]) => ids.map((id) => VIDEOS.find((v) => v.id === id)!)

  if (typeof window === 'undefined') return porId(POR_DEFECTO)

  try {
    const guardado = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? 'null')
    if (Array.isArray(guardado) && esValida(guardado)) return porId(guardado)
  } catch {
    /* storage bloqueado o dato corrupto: se sortea de nuevo */
  }

  const combos = combinacionesValidas()
  const elegidos = barajar(combos[Math.floor(Math.random() * combos.length)])

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(elegidos))
  } catch {
    /* sin storage: la rotación sigue funcionando, solo no se recuerda en la visita */
  }

  return porId(elegidos)
}
