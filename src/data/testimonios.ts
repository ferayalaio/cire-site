import type { Testimonio } from './sucursales'
import { SUCURSALES } from './sucursales'

/*
 * Prueba social genérica para páginas que no tienen testimonios propios por
 * tratamiento (Home, Láser, Cera, HIFU, Otros servicios). Selección curada
 * cruzando sucursales en vez de listar las mismas citas que ya se leen en
 * cada página de sucursal: una por cada una de las que hoy tienen testimonios
 * cargadas en src/data/sucursales.ts.
 */
export const TESTIMONIOS_DESTACADOS: Testimonio[] = SUCURSALES.flatMap((sucursal) =>
  sucursal.testimonios?.length ? [sucursal.testimonios[0]] : [],
)

/*
 * Segunda curaduría (el otro testimonio de cada sucursal). Existe para que
 * páginas que se navegan una detrás de otra en el mismo recorrido — como
 * /laser y sus tres subpáginas — no repitan las mismas tres citas cada vez.
 */
export const TESTIMONIOS_DESTACADOS_ALT: Testimonio[] = SUCURSALES.flatMap((sucursal) =>
  sucursal.testimonios && sucursal.testimonios.length > 1 ? [sucursal.testimonios[1]] : [],
)
