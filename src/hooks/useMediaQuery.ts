import { useEffect, useState } from 'react'

/*
 * Media query como estado de React, para los casos en que la diferencia entre
 * mobile y escritorio no es de estilos sino de QUÉ se monta. El hero es el
 * ejemplo: con dos <video> en el DOM (uno oculto por CSS) el navegador
 * descarga los dos, así que en celular se bajaban los ~2 MB del horizontal
 * además del vertical. Montando solo uno se baja el que se va a ver.
 *
 * El valor inicial se lee sincrónico en el initializer de useState — no en un
 * efecto — para que el primer paint ya tenga la variante correcta y no se vea
 * el hero de escritorio un frame antes de cambiar.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)

    // Además de suscribirse: entre el render inicial y este efecto el viewport
    // pudo cambiar (rotar el teléfono durante la carga).
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
