# SHIGAA — Botanical Ritual

A buildless HTML, CSS and vanilla JavaScript homepage with a cinematic SHIGAA hero, local product bag and delivery-details form. GSAP 3.12.5 and ScrollTrigger, fonts, original product photographs and the original logo are bundled locally. No React or build tooling is required.

## Open the website

Open dist/gifting.html for the separate blue gifting-style landing page.

Open `dist/index.html`, or serve `dist/` using any static web server. Deploy the contents of `dist/` to your static host. The site works with relative asset paths and does not depend on a third-party CDN at runtime.

## Files

- `dist/index.html` — complete frontend preview, with a simple collection and brand story beneath the hero.
- `dist/hero.css` — responsive styling and brand tokens.
- `dist/hero.js` — product data, GSAP entrance, animated switching, desktop pointer parallax, accessible shopping bag, cart persistence, delivery form, keyboard controls and motion preferences.
- `dist/assets/` — original product images and logo, local fonts, GSAP and ScrollTrigger.
- `hero-fragment.html` — just the hero, preloader and shared SVG definitions, ready to insert in another frontend.
- `SOURCES.md` — exact source URLs, prices, ingredient provenance and palette notes.

## Integrate into an existing SHIGAA frontend

1. Copy `hero.css`, `hero.js` and the complete `assets/` folder into the same directory on your frontend. Keep the paths together, or update the stylesheet/script paths and initial image paths.
2. Include `assets/fonts.css` and `hero.css` in the page head. Include deferred scripts in this order: `assets/gsap.min.js`, `assets/ScrollTrigger.min.js`, `hero.js`. Load each library only once if the existing page already uses GSAP.
3. Replace the current hero with the contents of `hero-fragment.html`. Keep the SVG definitions: they supply the botanical illustrations, arrows and non-destructive presentation masks for the original photographs. The fragment does not include the preview header, footer, collection or story sections.
4. Keep the cart drawer markup from the fragment and load `hero.js` so Add to Bag buttons, quantity controls and the delivery form work. Map `#collection`, `#story` and `#ritual` to sections in the existing page, or change those anchor destinations.
5. If the existing frontend has a preloader, omit the fragment's `.sg-preloader` and coordinate the entrance timeline with that loader. By default this component waits two seconds, swipes up its own loader and starts the entrance sequence.
6. Component classes use an `sg-` prefix and are wrapped in `.shigaa-site`. `hero.css` also includes demo-level `body { margin: 0 }`, smooth scrolling and scroll-padding rules for `html`; remove those rules if your existing page owns them. The headline and product panel IDs must remain unique.

Brand variables live on `.shigaa-site`. `--sg-brand: #00a3e4` is sampled from the official logo. The complementary aqua, ivory, muted green and deeper cyan shades can be adjusted there and in the product records in `hero.js`.

## Behavior and accessibility

- Two-second preloader and staggered GSAP entrance with the requested timing offsets.
- Five manual product selectors, including the two newly added 100 ml oils, with no automatic carousel advance.
- Product buttons add any of the five products to an on-site bag. Quantities, removals, subtotal and cart count update immediately; cart contents persist in the browser. The mobile collection retains a two-column card grid.
- The bag includes a responsive delivery-details form with required-field and format validation.
- This static preview does not transmit orders or process payments. Connect a trusted order and payment service before accepting purchases.
- Current product fades out; next image enters with perspective, while details and the atmospheric colors update.
- Rapid clicks queue the latest selection to keep the image, price and destination synchronized.
- Arrow keys, Home and End operate the product tabs. Tabs have roving focus, selected states, a labelled panel and a live status message.
- Cursor parallax uses a smoothed `requestAnimationFrame` loop, only with a fine pointer on desktop.
- ScrollTrigger adds gentle movement without pinning or scroll interception.
- Decorative loops pause when the hero leaves the viewport or the page is hidden. A visible motion control also pauses them.
- `prefers-reduced-motion` bypasses the loader and entrance, removes continuous animation and makes product updates immediate. Live preference changes are handled.
- Content remains available if GSAP fails to load. The basic selector still works with vanilla JavaScript. If all JavaScript is disabled, the first product and working collection links remain visible, and the loader has a CSS failsafe.
- The hamburger menu is optional; the hero fragment works without the preview header.

## Validation

The hero layout and motion were reviewed before the on-site bag and delivery form were added. The updated shopping flow has not yet been browser-tested. Review it at phone and desktop widths before connecting an order service.

## Scope

This is a standalone frontend preview. No existing SHIGAA source repository or order-processing endpoint was available in the session, so the live shigaa.com website has not been changed. Product prices are a verified snapshot from 23 November 2026, not a live price feed.
