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
