---
name: Cire Depilación
description: Premium hair-removal clinic in CDMX and Metepec; warm white, deep plum ink, the brand pinks and orchid purple.
colors:
  blush-50: "#fde9f0"
  blush-100: "#fbd3e0"
  blush-200: "#fcc8d8"
  blush-300: "#feaac1"
  blush-400: "#f77fa3"
  blush-500: "#d6457a"
  blush-600: "#a32a57"
  blush-900: "#6b2450"
  ink: "#4a1838"
  morado-50: "#f6eaf5"
  morado-100: "#ecd3e8"
  morado-300: "#efa2da"
  morado-700: "#7a2c6e"
  paper: "#fdfbfa"
  surface: "#ffffff"
  text-body: "#404040"
  text-muted: "#525252"
  hairline: "rgba(0, 0, 0, 0.08)"
typography:
  display:
    fontFamily: "Jost, Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Jost, Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Jost, Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  price:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' on"
  body:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  control: "8px"
  thumb: "12px"
  card: "16px"
  band: "24px"
  full: "9999px"
spacing:
  gutter: "24px"
  gutter-wide: "40px"
  card: "24px"
  card-wide: "28px"
  section: "80px"
  section-wide: "112px"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.blush-900}"
    textColor: "{colors.surface}"
  link-action:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "44px"
  card-featured:
    backgroundColor: "{colors.blush-100}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-wide}"
  offer-field:
    backgroundColor: "{colors.blush-100}"
    textColor: "{colors.ink}"
    rounded: "{rounded.band}"
    padding: "64px 48px"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-wide}"
  tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
  nav-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "64px"
  announcement-bar:
    backgroundColor: "{colors.blush-900}"
    textColor: "{colors.surface}"
    height: "40px"
---

# Design System: Cire Depilación

## Overview

**Creative North Star: "The Quiet Clinic"**

The category standard of a premium aesthetic clinic, executed at full craft. A warm white ground, deep plum ink, the pink and orchid-purple families of Cire's own campaign flyers (the owner's favorite colors). Nothing performs: no atmosphere, no effects, no decoration that a real clinic would not have on its walls. Confidence comes from real photographs of Cire's cabins and specialists, exact prices set in tabular figures, and generous, even spacing.

Density is calm and editorial: one idea per section, a solid headline, one line of support, then the content (a price list, a definition list, three photos, three reviews). The single action everywhere is WhatsApp, and it always looks the same: a solid ink rectangle with soft corners. Everything secondary is an underlined text link.

This system replaces an earlier look (blush gradients, Bodoni display, liquid glass, drifting light, sheens and pulsing rings). That look is rejected as a whole.

**Key Characteristics:**
- Warm white paper, plum ink, the brand pink and orchid-purple scales; the saturated fuchsia and turquoise of the ads stay in the ads.
- One sans family (Hanken Grotesk) carrying every role through weight and size.
- Flat surfaces separated by hairlines and tinted bands, not shadows.
- Small radii on controls (8px), medium on cards and photos (16px); no pill buttons.
- Real Cire frames only, one color grade, 3:4 crops.
- Content is visible by default; motion is short and functional.

## Colors

Plum ink on warm paper; pink bands and featured fields; orchid-purple bands (promotions), tiles and accents (checks, data labels, icons, the announcement bar).

### Primary
- **Dusty Blush** (blush-100): the brand's color field. Fills the one featured offer card (Full Body), the closing offer field, the hero photo well and review avatars. Never a gradient.
- **Blush Wash** (blush-50): the alternating section band (`tone="alt"`) and the FAQ toggle well. Marks a change of section on scroll without a border.
- **Deep Rose** (blush-600): small semantic accents on paper: definition-list terms in the protocol block and the active-promotion line. Never body text, never a fill.
- **Rose Focus** (blush-500): the global focus outline and the small location/clock icons.
- **Selection Rose** (blush-200), **Tab Rose** (blush-300), **Ring Rose** (blush-400): text selection, tab hover border and tab focus ring respectively; supporting steps only.
- **Oxblood** (blush-900): the hover state of every ink button, the announcement bar, and text on blush-100 fields (at 80–85% for secondary lines).

### Neutral
- **Ink** (ink): headlines, primary text, solid buttons, selected tabs and the footer. A neutral near-black chosen so the pink does not read cold next to it.
- **Warm Paper** (paper): the page ground and the sticky nav. Pure white would read clinical against the blush.
- **White** (surface): non-featured cards (price-by-zone list, reviews, branch panel) sitting on paper or blush-50, outlined by a 6% black ring.
- **Body Graphite** (text-body): lead paragraphs and answers.
- **Muted Graphite** (text-muted): supporting lines, captions, unselected tabs.
- **Hairline** (hairline): every divider, list rule and card-internal separator.

### Named Rules
**The Two Hue Rule.** The site uses the brand's two hues and nothing else: the pink family and the orchid-purple family, both taken from Cire's campaign flyers (nov 2026) and the owner's favorites. Pink carries bands and the one featured field; purple carries the promotions band, alternating tiles and small accents (`morado-700` for checks, data-list labels and icons). The flyers' saturated fuchsia and turquoise stay in the ads.

**The Featured Field Rule.** blush-100 as a card fill is reserved for the single primary offer in a block. Every other card is white with a hairline ring. Two pink cards side by side means neither is featured. The closing offer field is the same color at page scale: one per page, and it holds the standard ink button.

**The Flat Pink Rule.** Blush is always a flat fill. No gradients, no gradient text, no tinted glows.

## Typography

**Display Font:** Hanken Grotesk (with Helvetica Neue, Arial)
**Body Font:** Hanken Grotesk (same family)

**Character:** A single humanist grotesk carries the whole system, loaded at 400/500/600/700 with stylistic set ss01 on. Hierarchy comes from size and a consistent 600 weight on headings, with negative tracking on large sizes.

### Hierarchy
- **Display** (600, 2.5rem mobile, 3.25rem at sm, 3.75rem at lg, line-height 1.02, -0.03em, balanced): the page H1 only. Sentence case.
- **Headline** (600, 1.875rem mobile to 2.5rem at sm, line-height 1.1, -0.02em, balanced): section H2s, written as plain statements or the visitor's own question ("¿Duele?").
- **Title** (600, 1.5rem): card headings (Full Body, Por zona); 1.875rem for the branch panel name. List-row titles are 17-19px semibold.
- **Price** (600, 3rem, line-height 1, -0.03em, tabular figures): the featured price. Row prices are 17px semibold, also tabular.
- **Body** (400, 17px, line-height 1.625, max 60ch): leads and answers. Review quotes at 16px.
- **Label** (600, 15px): buttons, text links, nav brand, definition terms.
- **Caption** (400, 14px): secondary lines under row titles and review authors.

### Named Rules
**The Tabular Price Rule.** Every price is set with tabular figures and right-aligned in lists. A missing price reads "Precio por WhatsApp"; never invent a number.

**The No Kicker Rule.** A section starts with its headline. No eyebrow, overline, uppercase tag or numbered label above it.

## Layout

A single centered container (max 72rem) with 24px gutters on mobile and 40px from sm. Sections stack vertically with even padding: 80px top and bottom on mobile, 112px from sm. Sections alternate between paper and the blush-50 band; the page closes on a blush-100 offer field (24px radius, 48px by 24px padding, 64px by 48px from sm) inside the container, with the standard ink button; the footer is a full-bleed ink block.

The hero is a two-column grid on desktop (copy left at 1.05fr, photo right at 0.95fr, 64px gap) and stacks on mobile with the photo first, bleeding to the screen edges at 360px tall, then H1, support line, a full-width WhatsApp button and a "Ver precios" link. A hairline-topped trust line closes the hero copy.

Two-column splits (price card and zone list, protocol headline and definition list) use slightly unequal fractions (0.9–1.1fr) with 32–64px gaps on desktop and stack on mobile. Photo rows become horizontal snap rails on mobile (cards at 72% width so the next one peeks) and a three-column grid from sm.

**The Even Rhythm Rule.** Every content section uses the same vertical padding. Change of section is signalled by the blush-50 band, not by bigger gaps.

## Elevation & Depth

Flat by default. Depth is conveyed by tonal layering (paper, blush-50, white cards, blush-100 featured fields, the ink footer) and by hairlines: a 6% black ring around white cards and 8% black rules between list rows. Shadows appear only on elements that genuinely float above the page.

### Shadow Vocabulary
- **Floating action** (`box-shadow: 0 12px 30px -12px rgba(43,27,30,0.6)`): the fixed WhatsApp button only.
- **Dropdown** (`box-shadow: 0 18px 40px -20px rgba(43,27,30,0.35)`): nav dropdown panel.
- **Drawer** (`box-shadow: -20px 0 60px -15px rgba(0,0,0,0.35)`): mobile menu panel.

### Named Rules
**The Earned Shadow Rule.** A shadow means the element floats over content (fixed button, dropdown, drawer). Cards in the page flow never carry one.

**The Solid Nav Rule.** The sticky nav is paper at 95% with a light backdrop blur and a 6% hairline; it is the only blurred surface. No translucent glass panels anywhere else.

## Shapes

Rectangles with soft corners. Controls (buttons, tabs, icon buttons, FAQ toggle) use 8px; thumbnails and the dropdown 12px; cards, photos and the hero photo well 16px; the closing offer field 24px. Full rounding is limited to circular things: the logo and review initials. Dividers are 1px hairlines; there are no decorative borders or outlines.

**The No Pill Rule.** Buttons and tabs are rectangles with an 8px radius. Pill shapes are not used for actions, tags or chips.

## Components

### Buttons
Solid, quiet and always the same.
- **Shape:** soft rectangle (8px), minimum 48px tall.
- **Primary:** ink fill, white 15px semibold label, 12px by 24px padding, WhatsApp mark (18px) before the label. Full-width on mobile, auto width from sm.
- **Hover / Focus:** fill shifts to oxblood over 200ms; no scale, no lift. Focus is the global 2px blush-500 outline at 3px offset.
- **Floating:** the same ink button at 48px with the floating-action shadow, fixed bottom-right on every route, hidden by opacity when the in-page CTA is visible.
- **Text link (secondary):** ink 15px semibold, underlined at 4px offset with the underline at 25% ink, full ink on hover, 44px minimum hit area, trailing arrow for navigation. The WhatsApp `link` variant uses the same treatment with the WhatsApp mark, for per-row "Cotizar" in price lists.

### Cards / Containers
- **Corner Style:** 16px.
- **Featured:** blush-100 fill, no ring; holds the one primary offer with the large tabular price and its button.
- **Default:** white with a 6% black ring; 24px padding, 28px from sm. Internal sections separated by hairlines.
- **Shadow Strategy:** none (see Elevation).

### Lists and Definition Lists
Price rows, protocol facts, other treatments and FAQ items are hairline-divided lists with top and bottom rules and 16–20px vertical row padding. Definition terms are 15px semibold Deep Rose; values 17px ink.

### Tabs (branch selector)
Rectangular 8px tabs, 10px by 20px. Unselected: white with a 10% black border and muted text, rose border on hover. Selected: solid ink with white text. Horizontal snap rail on mobile.

### FAQ Accordion
Native details/summary, 17px semibold question, an 8px-radius toggle well (blush-50 with a Deep Rose plus that rotates to minus; ink fill when open). The answer opens with a 340ms height and fade transition; instant under reduced motion.

### Navigation
Sticky 64px bar on paper at 95% under a 40px oxblood announcement bar. Logo mark plus "Cire Depilación" in 15px semibold ink; desktop links 14px medium muted, ink when active; a compact ink "Agendar" button at the right. On mobile a 44px hamburger opens a right-side paper drawer with full-width ink buttons at the bottom.

### Photography
Real frames from Cire's own videos only: cabins, uniforms, the actual hand piece. Every home raster carries one shared ffmpeg grade (colortemperature=12000 at mix 0.8, then eq saturation 0.78, brightness 0.04, contrast 1.03), which cools the magenta LED cast and mutes saturation so the frames read as a series. The hero is a muted looping re-encode of the Full Body video with a poster frame, framed at 50% 35%. Session photos are cropped 3:4 at 16px radius; treatment thumbnails are graded copies of the same sources (12px radius, square).

**The Real Frame Rule.** No stock, no illustration, no AI imagery, and nothing presented as a before/after unless it is a real comparison of a client.

### Motion
Content is always visible, including in prerendered HTML: there are no scroll-reveal entrances anywhere (the old Reveal/Stagger components were removed). Route changes are a plain fade (200ms in, 120ms out, ease-out cubic-bezier(0.22, 1, 0.36, 1)). State changes are 200ms color transitions. Everything collapses to instant under reduced motion.

## Do's and Don'ts

### Do:
- **Do** use the solid ink button for every WhatsApp action and an underlined text link for everything secondary.
- **Do** reserve blush-100 card fill for the single featured offer in a block; every other card is white with a 6% ring.
- **Do** set prices in tabular figures and fall back to "Precio por WhatsApp" when a price is missing.
- **Do** separate list rows and card regions with 8% black hairlines.
- **Do** alternate sections between paper and blush-50 at the same vertical padding (80px, 112px from sm).
- **Do** use only real Cire frames with the shared grade, cropped 3:4 for photo rows.
- **Do** keep all content visible; no scroll-triggered entrances.

### Don't:
- **Don't** use gradient text or blush gradients of any kind.
- **Don't** use glass panels, frosted cards, blobs, drifting glows, particles or sheens.
- **Don't** put an eyebrow, kicker or uppercase tag above a headline.
- **Don't** use pill-shaped buttons, tags or chips.
- **Don't** add pulse rings, ping animations or hover scaling to buttons.
- **Don't** add a second accent hue or a second type family.
- **Don't** give in-flow cards a shadow.

---

## Actualización 2026-11-25: "La cabina CIRE"

Esta sección manda sobre lo anterior cuando choquen.

- **Paleta por uso.** Hueso `#FCFBF9` es el fondo general. Ciruela `#4B1839` va en texto, botones, footer y UNA sección oscura por página (en el inicio, "¿Duele?"). Magenta `#7B2C6E` va en la barra superior y los acentos. Rosa satinado `#FDEAF0` se usa en máximo dos bandas, nunca dos seguidas. Rosa promo `#FDD1E2` es solo para promociones (cupón, CTA final). Lila `#ECD3E8` va en los fondos de foto y en el borde de las tarjetas pendientes. Tokens en `src/index.css` (`bg-hueso`, `text-ciruela`, `border-linea`, etc.).
- **Tipografía.** Los titulares van en Jost 400/500, una geométrica que hace eco del wordmark CIRE. El texto corrido sigue en Hanken Grotesk. H1 de 38 / 56 / 72 / 80 px; H2 de 34 / 48 px.
- **Radios por nivel.** `rounded-media` 24 px (hero, macro, banner), `rounded-card` 12 px (tarjetas, posters, miniaturas), `rounded-btn` 8 px y píldora para chips y cupones. Sin sombras: las secciones se separan con fondo, espacio o línea fina.
- **Imágenes.** Siempre con `<ImagenPendiente ruta proporcion alt>`. Las fotos van en `public/images/` con los nombres de `SHOTLIST.md`; `scripts/imagenes.mjs` genera AVIF/WebP/JPG y el manifiesto. Sin foto, el componente muestra la tarjeta "Imagen pendiente" con la misma caja.
- **Promos.** Solo como cupón (`.cupon`, borde punteado) desde `data/promos.ts`; se apagan solas al pasar `hasta`. Nunca precios ni stickers dentro de una foto.
- **Precios.** Las vistas leen `lib/precios.ts` (vigente, tachado, ahorro calculado). Nunca se escribe un ahorro a mano.
