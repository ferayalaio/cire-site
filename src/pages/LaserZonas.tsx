import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  PageShell,
  Placeholder,
  SectionHeading,
} from "../components/PageShell";
import { TestimoniosSection } from "../components/Testimonios";
import { WhatsAppCTA, WhatsAppSection } from "../components/WhatsAppCTA";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import {
  COMBOS,
  FULL_BODY,
  NIVELES_BIKINI,
  ZONAS,
  formatPrecio,
  hayPrecio,
} from "../data/precios";
import { TESTIMONIOS_LASER_ZONAS } from "../data/testimonios";

/*
 * Precios por zona (rediseño nov/26). Es una página de precios, así que el
 * primer bloque es la lista misma: cada zona en una fila con su paquete
 * alineado a la derecha en cifras tabulares y un "Cotizar" de texto. La
 * tabla de cinco columnas que había antes no entraba en 375px y obligaba a
 * deslizar; las filas de lista sí entran.
 *
 * Al lado (abajo en celular) va el único campo rosa de la página: el Full
 * Body, que es el upsell principal. Las zonas sin combo exacto repiten ese
 * upsell en su propia fila, para que se lea justo cuando la persona mira esa
 * zona.
 */

/** Mismo trato de link secundario que el home: subrayado al 25%, tinta llena al hover. */
const LINK =
  "inline-flex min-h-11 items-center text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink";

function PrecioFila({ precio }: { precio: number | null }) {
  return (
    <p className="shrink-0 text-right text-[17px] font-semibold text-ink tabular-nums">
      {formatPrecio(precio) ?? "Por WhatsApp"}
    </p>
  );
}

function Fila({ children }: { children: ReactNode }) {
  return <li className="flex items-center gap-4 py-4">{children}</li>;
}

/** Precio y "Cotizar": apilados en celular para que el nombre de la zona tenga ancho; en fila desde sm. */
function Accion({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col items-end sm:flex-row sm:items-center sm:gap-4">
      {children}
    </div>
  );
}

export function LaserZonas() {
  useDocumentMeta({
    title: "Precios de depilación láser por zona",
    description:
      "Precio de depilación láser por zona y por paquete de 8 sesiones: axilas, piernas, brazos, rostro, espalda y más. Compara contra los combos.",
  });

  const bikiniDesde = NIVELES_BIKINI.map((n) => n.precioPaquete).filter(
    (p): p is number => p !== null,
  );

  return (
    <PageShell
      title="Precios de depilación láser por zona"
      intro="Cada zona por separado. Si vas a tratar más de una, los combos casi siempre salen mejor. Con punta de zafiro que enfría la piel al momento, para mayor comodidad."
      breadcrumbs={[
        { label: "Inicio", to: "/" },
        { label: "Láser", to: "/laser" },
      ]}
    >
      {/* ---------------------------------------------- Zonas + Full Body --- */}
      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-8">
        <div className="rounded-2xl bg-white px-5 py-6 ring-1 ring-black/[0.06] sm:p-8">
          <h2 className="text-2xl text-ink">Precio por zona</h2>
          <p className="mt-1 text-[15px] text-neutral-600">
            Paquete por zona, en {ZONAS.length} zonas
          </p>

          <ul className="mt-4 divide-y divide-black/[0.08]">
            {ZONAS.map((zona) => (
              <Fila key={zona.slug}>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold text-ink">
                    {zona.nombre}
                  </p>
                  {zona.sesiones !== null && (
                    <p className="text-[14px] text-neutral-600">
                      {zona.sesiones} sesiones
                      {zona.opciones &&
                        `, ${zona.opciones.map((o) => o.nombre.toLowerCase()).join(" o ")} a elegir`}
                    </p>
                  )}
                  {zona.sinComboExacto && (
                    <Link
                      to="/laser/cuerpo-completo"
                      className="mt-0.5 inline-flex min-h-6 items-center text-[14px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      Ahorra más con Full Body
                    </Link>
                  )}
                </div>
                <Accion>
                  <PrecioFila precio={zona.precioPaquete} />
                  <WhatsAppCTA
                    variant="link"
                    context={{
                      sku: `laser-zona-${zona.slug}`,
                      nombre: `láser en ${zona.nombre}`,
                      categoria: "laser",
                      placement: "card",
                      valor: zona.precioPaquete ?? undefined,
                    }}
                  >
                    Cotizar
                  </WhatsAppCTA>
                </Accion>
              </Fila>
            ))}
          </ul>

          {!hayPrecio(...ZONAS.map((z) => z.precioPaquete)) && (
            <div className="mt-4">
              <Placeholder label="Pendiente: cargar precios del tarifario en src/data/precios.ts" />
            </div>
          )}
        </div>

        <div className="space-y-5 lg:sticky lg:top-28">
          <article className="rounded-2xl bg-blush-100 p-6 sm:p-8">
            <h2 className="text-2xl text-ink text-balance">
              Te puede convenir el Full Body
            </h2>
            <p className="mt-2 text-[17px] leading-relaxed text-blush-900">
              Si estás sumando tres zonas o más, el paquete completo suele
              costar menos.
            </p>
            <p className="mt-6 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
              {formatPrecio(FULL_BODY.precioPaquete) ?? "Precio por WhatsApp"}
            </p>
            <p className="mt-2 text-[15px] text-blush-900/85">
              Cuerpo completo, {FULL_BODY.sesiones ?? 8} sesiones
            </p>
            <div className="mt-5 border-t border-blush-900/10 pt-3">
              <Link to="/laser/cuerpo-completo" className={LINK}>
                Ver qué incluye el Full Body
              </Link>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] sm:p-8">
            <h2 className="text-2xl text-ink">Bikini</h2>
            <p className="mt-2 text-[17px] leading-relaxed text-neutral-700">
              Del básico al brazilian, con la cobertura de cada nivel.
            </p>
            {bikiniDesde.length > 0 && (
              <p className="mt-3 text-[15px] text-neutral-600">
                {NIVELES_BIKINI.length} niveles, desde{" "}
                <span className="font-semibold text-ink tabular-nums">
                  {formatPrecio(Math.min(...bikiniDesde))}
                </span>
              </p>
            )}
            <div className="mt-5 border-t border-black/[0.08] pt-3">
              <Link to="/laser/bikini" className={LINK}>
                Ver los {NIVELES_BIKINI.length} niveles de bikini
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------------- Combos ----- */}
      <section className="mt-20 grid gap-8 sm:mt-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading>Combos</SectionHeading>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-neutral-700">
            Si tratas más de una zona, un combo casi siempre sale mejor que
            sumarlas sueltas. El precio del combo es fijo: quitar una zona no
            genera descuento.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-2 ring-1 ring-black/[0.06] sm:px-8 sm:py-4">
          <ul className="divide-y divide-black/[0.08]">
            {COMBOS.map((combo) => (
              <Fila key={combo.slug}>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold text-ink">
                    {combo.nombre}
                  </p>
                  {combo.sesiones !== null && (
                    <p className="text-[14px] text-neutral-600">
                      {combo.sesiones} sesiones
                    </p>
                  )}
                </div>
                <Accion>
                  <PrecioFila precio={combo.precioPaquete} />
                  <WhatsAppCTA
                    variant="link"
                    context={{
                      sku: combo.slug,
                      nombre: combo.nombre,
                      categoria: "laser",
                      articulo: "el",
                      placement: "card",
                      valor: combo.precioPaquete ?? undefined,
                    }}
                  >
                    Cotizar
                  </WhatsAppCTA>
                </Accion>
              </Fila>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20 sm:mt-28">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER_ZONAS} />
      </section>

      <WhatsAppSection
        id="agendar"
        context={{
          sku: "laser-zonas",
          nombre: "una zona",
          categoria: "laser",
          articulo: "la",
        }}
        titulo="¿No sabes por dónde empezar?"
        texto="Resultados visibles desde la primera sesión. Cuéntanos qué zona te interesa y te armamos la mejor combinación de precio."
      >
        Consultar por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  );
}
