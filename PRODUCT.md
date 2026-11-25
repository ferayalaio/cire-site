# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mujeres de entre 20 y 45 años en CDMX y Metepec que quieren depilación láser (y en menor medida cera, HIFU y tratamientos corporales). Llegan por dos vías, en proporción parecida:

- **Meta Ads (Instagram/Facebook), en el celular.** Vienen de un anuncio, todavía están evaluando y necesitan confianza y un precio claro antes de escribir.
- **Búsqueda en Google** ("depilación láser Coapa", "precio full body láser"). Llegan con la intención de comprar ya formada y buscan precio, sucursal y una razón para elegir Cire.

Lo que vienen a hacer: confirmar precio y paquete, sacarse el miedo al dolor y a que no funcione, elegir sucursal y abrir WhatsApp.

## Product Purpose

ciredepilacion.com es una landing que prepara a la clienta antes de la conversación, no un e-commerce. Su trabajo es que la persona llegue a WhatsApp ya decidida, con el precio y el paquete claros, para que el chat cierre más rápido. Por eso no hay formularios de contacto: todos los CTA abren un chat de WhatsApp con un mensaje prellenado según servicio y sucursal.

Éxito = clics a WhatsApp con contexto (servicio + sucursal) y tráfico orgánico a las páginas de zona y de sucursal.

## Positioning

- **Protocolo Láser Expert 8®**: protocolo propio y registrado, ajustado al tipo de piel y de vello. El ® va siempre.
- **Resultados desde la primera sesión**, gracias al láser diodo con punta de zafiro, que además enfría la piel (responde a la objeción del dolor).
- **Equipos láser de alta gama.** (Hoy no está documentado el modelo ni la marca del equipo; no inventarlos.)
- Respaldo: 9 años de experiencia y 5 sucursales (Polanco, Del Valle, Coapa, Oriente, Metepec).

## Operating Context

- El cierre pasa en WhatsApp (LeadSales); el sitio se queda antes de ese paso.
- Los precios cambian cada mes y hay promos de temporada (Buen Fin, Hot Sale, Aniversario Cire, Hot Summer); todo sale de `src/data/precios.ts` y el diseño no debe depender de un monto puntual.
- Meta Pixel + GA4 miden cada CTA (`src/lib/analytics.ts`).
- Prerender por ruta para SEO; cada página nueva necesita `useDocumentMeta`.

## Capabilities and Constraints

- Stack: React 19 + Vite + Tailwind 4 + React Router, prerenderizado y desplegado en Vercel.
- Mapa de rutas y prioridades en `README.md`. **`/laser/cuerpo-completo` (Full Body) es la página con mayor prioridad de conversión.**
- Decidido NO mostrar: el 5% de descuento en efectivo, la regla de 8 semanas de Del Valle, una calculadora para quitar zonas de un combo y el documento de COFEPRIS.
- Un precio en `null` se muestra como pendiente; nunca se inventa un número.
- La calificación 4.9 de Google **no está verificada**; no subirla de jerarquía ni marcarla como structured data hasta confirmarla.

## Brand Commitments

- **Logo actual** (`public/hero/logo.jpeg`, `public/hero/logo-160.webp`): se queda tal cual.
- **Paleta de la empresa** (actualizada el 2026-11-25 a partir de los flyers de campaña): familia rosa (pastel a vino), morado orquídea y ciruela profundo como tinta. **Rosa y morado son los favoritos de la dueña** y mandan en el sitio; el fucsia saturado y el turquesa de los flyers quedan para los anuncios. Tokens en `src/index.css`.
- Los claims aprobados de `src/data/marca.ts` (`CLAIMS`) se usan textuales y no se editan sin aprobación.
- Voz actual documentada en el README: profesional y directa, sin emojis ni cierres agresivos. No se declaró intocable.
- **Dirección visual: el estándar de la categoría, ejecutado con oficio** (elegido el 2026-11-24 frente a direcciones más conceptuales). La vara de acabado son las clínicas premium de depilación y estética: fotografía limpia, precio claro y mucho aire. Se rechazan tres extremos: lo hospitalario (frío, blanco clínico), el spa genérico (velas, piedras, relax) y lo barato (precios gritando, descuentos por todos lados).

## Evidence on Hand

- 16 reseñas reales de Google: capturas en `public/Reseñas/`, avatares en `public/avatars/` y textos en `src/data/testimonios.ts`. La sucursal asignada a cada reseña es aproximada, no verificada.
- `public/resultados-reales/` **no tiene fotos de antes/después**, a pesar del nombre: son fotos de procedimiento, y la de axila (modelo de estudio) parece de stock. No se presentan como "resultados" hasta tener comparativas reales de clientas. Las imágenes claramente de Cire son los posters de `public/videos/posters/` (uniforme y cabina de la marca) y la de moldeo corporal.
- Fotos reales de las 5 sucursales en `public/sucursales/`.
- Videos de procedimiento (láser, cera, HIFU) en `public/videos/`.
- Ausencias que no se deben fabricar: modelo y marca del equipo láser, fotos del equipo humano, certificaciones específicas con nombre, conteo de clientas atendidas y prensa.

## Product Principles

1. **Precio claro antes que persuasión.** La clienta tiene que salir sabiendo cuánto cuesta y qué incluye; esconder el precio rompe el modelo.
2. **Cada pantalla termina en WhatsApp con contexto.** Ningún CTA es genérico: lleva el servicio y la sucursal.
3. **Prueba real, nunca inventada.** Reseñas, resultados y sucursales reales; nada de testimonios, cifras ni sellos que no podamos respaldar.
4. **Mobile primero.** La mitad del tráfico viene de un anuncio en el celular; ahí se juzga el sitio.
5. **Confianza clínica sin frialdad de hospital.** La clienta tiene que sentir que es un lugar serio y de alta gama.

## Accessibility & Inclusion

Sin requisito formal establecido. Mínimo práctico: buen contraste del texto sobre el rosa y sobre los videos, y objetivos táctiles cómodos en el celular.
