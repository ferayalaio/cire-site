/*
 * Sistema de imágenes del home (nov/26). Cada slot tiene su archivo fijo en
 * public/images/ (el que pide SHOTLIST.md), su proporción y su alt. El
 * componente <ImagenPendiente> decide si hay foto o tarjeta pendiente.
 *
 * FONDOS: las fotos de zona y de paquete van sobre un fondo liso que rota
 * entre rosa satinado, lila y ciruela (como un mosaico). El fondo de cada
 * toma está fijado acá, porque de él depende el color del nombre que va
 * encima: ciruela sobre rosa/lila, blanco sobre ciruela. El SHOTLIST usa este
 * mismo reparto. Los 8 del home están ordenados para que no se repita color
 * ni en fila ni en columna (4 columnas en escritorio, 2 en celular).
 */

export type FondoFoto = 'rosa' | 'lila' | 'ciruela'

export const FONDO_HEX: Record<FondoFoto, string> = {
  rosa: '#FDEAF0',
  lila: '#ECD3E8',
  ciruela: '#4B1839',
}

interface SlotZona {
  fondo: FondoFoto
  /** Complemento del alt: "Especialista de CIRE aplicando láser diodo {en…}". */
  en: string
}

export const ZONAS_FOTO: Record<string, SlotZona> = {
  // Los 8 del home
  'rostro-completo': { fondo: 'rosa', en: 'en el rostro' },
  bigote: { fondo: 'rosa', en: 'en el bigote' },
  axilas: { fondo: 'rosa', en: 'en la axila' },
  'brazos-completos': { fondo: 'rosa', en: 'en el brazo' },
  'espalda-completa': { fondo: 'rosa', en: 'en la espalda' },
  bikini: { fondo: 'rosa', en: 'en la zona de bikini' },
  'medias-piernas': { fondo: 'rosa', en: 'en la pantorrilla' },
  'medias-piernas-arriba': { fondo: 'rosa', en: 'en el muslo' },
  'medias-piernas-abajo': { fondo: 'rosa', en: 'en la pantorrilla' },
  'piernas-completas': { fondo: 'rosa', en: 'en la pierna' },
  // El resto de /laser/zonas (rotan rosa, lila, ciruela)
  'medio-rostro': { fondo: 'ciruela', en: 'en la mejilla y el mentón' },
  'medios-brazos': { fondo: 'rosa', en: 'en el antebrazo' },
  manos: { fondo: 'lila', en: 'en el dorso de la mano' },
  hombros: { fondo: 'ciruela', en: 'en el hombro' },
  'media-espalda': { fondo: 'rosa', en: 'en la espalda baja' },
  pecho: { fondo: 'lila', en: 'en el pecho' },
  pezones: { fondo: 'ciruela', en: 'en la areola' },
  abdomen: { fondo: 'rosa', en: 'en el abdomen' },
  gluteos: { fondo: 'lila', en: 'en el glúteo' },
  pies: { fondo: 'ciruela', en: 'en el empeine' },
}

export const PAQUETES_FOTO: Record<string, { fondo: FondoFoto; alt: string }> = {
  'full-body': { fondo: 'ciruela', alt: 'Clienta de CIRE en sesión de depilación láser de cuerpo completo' },
  'combo-sexy': { fondo: 'rosa', alt: 'Depilación láser de piernas completas, axilas y bikini en CIRE' },
  'combo-playa': { fondo: 'lila', alt: 'Depilación láser de medias piernas, axilas y bikini en CIRE' },
  'combo-piernas': { fondo: 'ciruela', alt: 'Depilación láser de piernas completas y bikini en CIRE' },
  'combo-axilas': { fondo: 'rosa', alt: 'Depilación láser de axilas y piernas completas en CIRE' },
  'combo-bikini': { fondo: 'lila', alt: 'Depilación láser de axilas y bikini en CIRE' },
}

/*
 * Collage de los combos (nov/26): mientras no haya foto en paquetes/{slug}.jpg,
 * la tarjeta arma la imagen con las ilustraciones de zonas/ (ver
 * <CollageZonas> en components/ZonasGrid.tsx). Si cambia un combo, solo se
 * editan estos datos.
 *
 * - `disposicion`: 'alto-derecha' = el primer tile ocupa toda la columna
 *   derecha y los otros dos se apilan a la izquierda; 'lado-a-lado' = dos
 *   tiles altos.
 * - `enfoque`: object-position ("x% y%") para que se vea la zona resaltada y
 *   no el aire de arriba. `zoom` acerca la imagen sobre ese mismo punto.
 */
export type DisposicionCollage = 'alto-derecha' | 'lado-a-lado'

export interface TileCollage {
  /** Slug de la ilustración en zonas/ (sin .jpg). */
  zona: string
  etiqueta: string
  enfoque?: string
  zoom?: number
}

export interface Collage {
  fondo: string
  disposicion: DisposicionCollage
  tiles: TileCollage[]
}

const PIERNAS_ALTO: TileCollage = { zona: 'piernas-completas', etiqueta: 'Piernas', enfoque: '50% 60%' }
const AXILAS_CHICO: TileCollage = { zona: 'axilas', etiqueta: 'Axilas', enfoque: '32% 64%', zoom: 1.5 }
const BIKINI_CHICO: TileCollage = { zona: 'bikini', etiqueta: 'Bikini a elegir', enfoque: '50% 45%', zoom: 1.3 }

export const COMBOS_COLLAGE: Record<string, Collage> = {
  'combo-sexy': {
    fondo: '#D4EFEA',
    disposicion: 'alto-derecha',
    tiles: [PIERNAS_ALTO, AXILAS_CHICO, BIKINI_CHICO],
  },
  'combo-playa': {
    fondo: '#F9D9E6',
    disposicion: 'alto-derecha',
    // Medias piernas: la clienta elige arriba o abajo; el collage usa abajo.
    tiles: [{ zona: 'medias-piernas-abajo', etiqueta: 'Medias piernas', enfoque: '50% 55%' }, AXILAS_CHICO, BIKINI_CHICO],
  },
  'combo-piernas': {
    fondo: '#D6F6F9',
    disposicion: 'lado-a-lado',
    tiles: [PIERNAS_ALTO, { ...BIKINI_CHICO, enfoque: '50% 50%', zoom: 1.15 }],
  },
  'combo-axilas': {
    fondo: '#FBE3EC',
    disposicion: 'lado-a-lado',
    tiles: [{ ...AXILAS_CHICO, enfoque: '28% 60%', zoom: 1.2 }, PIERNAS_ALTO],
  },
  'combo-bikini': {
    fondo: '#EEDCF3',
    disposicion: 'lado-a-lado',
    tiles: [{ ...AXILAS_CHICO, enfoque: '28% 60%', zoom: 1.2 }, { ...BIKINI_CHICO, enfoque: '50% 50%', zoom: 1.15 }],
  },
}

/**
 * Rosa del fondo de las ilustraciones de zonas/ (medido en los PNG). El
 * degradado bajo el nombre de la tarjeta sale de este color para que no se
 * note la orilla.
 */
export const FONDO_ILUSTRACION = '#FAE1EF'

/** Ruta del archivo de una zona o paquete (relativa a public/images/). */
export const rutaZona = (slug: string) => `zonas/${slug}.jpg`
/*
 * Diagrama de zonas del Full Body (home, junto al precio). Trae los nombres de
 * las zonas dentro de la imagen; el alt los repite para Google y lectores de
 * pantalla. Si cambia el diagrama, cambia esto.
 */
export const RUTA_DIAGRAMA = 'diagramas/cuerpo-completo.jpg'
export const DIAGRAMA_FULL_BODY_ALT =
  'Diagrama de zonas incluidas en depilación láser de cuerpo completo. De frente: cuello, hombros, axilas, escote y pecho, areolas, brazos completos, abdomen completo, línea alba, manos y dedos, bikini a elegir, piernas completas, y pies, empeines y dedos. De espalda: nuca, espalda completa y glúteos. Rostro: frente y entrecejo, patillas y mejillas, bozo, y mentón y barbilla.'

export const rutaPaquete = (slug: string) => `paquetes/${slug}.jpg`

export function altZona(slug: string): string {
  const en = ZONAS_FOTO[slug]?.en ?? ''
  return `Especialista de CIRE aplicando láser diodo ${en}`.trim()
}

export const TRATAMIENTOS_FOTO: Record<string, { ruta: string; alt: string; actual: string }> = {
  cera: {
    ruta: 'tratamientos/cera.jpg',
    alt: 'Especialista de CIRE aplicando cera italiana en cabina',
    actual: '/sesion/otros-cera-principal.jpg',
  },
  hifu: {
    ruta: 'tratamientos/hifu.jpg',
    alt: 'Sesión de HIFU 4D facial en una cabina de CIRE',
    actual: '/sesion/otros-hifu-referencia-1.jpg',
  },
  corporales: {
    ruta: 'tratamientos/corporales.jpg',
    alt: 'Tratamiento corporal con radiofrecuencia en una cabina de CIRE',
    actual: '/sesion/otros-corporal.jpg',
  },
}
