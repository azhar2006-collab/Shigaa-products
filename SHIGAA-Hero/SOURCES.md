# Source and asset record

Existing catalog prices were verified on 23 November 2026 using SHIGAA's original website and downloaded product-page HTML. The two new oil names, sizes and prices are transcribed from the product screenshots supplied for this update.

| Product | Size shown | Listed price | Crossed-out price | Source |
| --- | --- | --- | --- | --- |
| Shigaa Refoll Hair Growth Oil | 100 ml | ₹150 | ₹200 | https://shigaa.com/product.php?id=107 |
| Facial Pack | 100 gm | ₹250 | ₹350 | https://shigaa.com/product.php?id=97 |
| Face Glow Cream | No size specified on the product page | ₹170 | ₹250 | https://shigaa.com/product.php?id=98 |
| Shigaa Anti Dandruff Oil | 100 ml | ₹150 | ₹200 | Product screenshot supplied by the site owner |
| Anti Lice Oil | 100 ml | ₹150 | ₹200 | Product screenshot supplied by the site owner |

Descriptions for the first three products summarize the source ingredient lists: hibiscus, amla, sesame and coconut oils for Refoll; multani mitti, kasturi manjal, beetroot and carrot for Facial Pack; aloe vera and vitamin E for Face Glow Cream. The two new display descriptions identify the 100 ml size and packaging without adding ingredient claims. Hair/beauty categories follow the source catalog navigation. The founder attribution comes from https://shigaa.com/index.php and the story destination is https://shigaa.com/about.php.

## Original brand and product imagery

- `assets/logo.png`: https://shigaa.com/assets/uploads/logo.png
- `assets/refoll-28.jpg`: https://shigaa.com/assets/uploads/product_photos/28.jpg
- `assets/product-107.jpg`: https://shigaa.com/assets/uploads/product-featured-107.jpg
- `assets/product-97.jpg`: https://shigaa.com/assets/uploads/product-featured-97.jpg
- `assets/product-98.jpg`: https://shigaa.com/assets/uploads/product-featured-98.jpg
- assets/product-anti-dandruff.jpg: product-only crop from the pink SHIGAA Special Anti Dandruff Oil screenshot supplied for this update.
- assets/product-anti-lice.jpg: product-only crop from the blue SHIGAA New Anti Lice Oil screenshot supplied for this update.

These files preserve the downloaded original bytes. The hero uses SVG presentation masks and ordinary CSS transforms to exclude the white photographic backdrop, float the products and cast soft shadows. Packaging, label artwork and proportions have not been regenerated, recolored or redesigned. Product thumbnails and the collection use the original photographs. Botanical SVG illustrations are decorative, not ingredient or certification claims.

## Palette

The most frequent non-white exact pixel value in the original logo is RGB (0, 163, 228), `#00a3e4`. The original cyan/white/charcoal logo is used intact. Supporting colors are art-directed derivatives and complements: deeper cyan `#006d92`, ink `#263b38`, warm neutral `#f5f6ef`, aqua `#a9d9d4`, and muted herbal greens. The three product atmospheres shift toward aqua, warm sage and soft green.

## Local dependencies

- GSAP 3.12.5: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
- ScrollTrigger 3.12.5: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
- The original license/copyright headers are retained in both library files. See https://gsap.com/ for their terms.
- Cormorant Garamond, regular and italic: Google Fonts, https://fonts.google.com/specimen/Cormorant+Garamond
- Manrope, regular and semibold: Google Fonts, https://fonts.google.com/specimen/Manrope
- Fonts are served locally from `assets/fonts.css`; font license files are bundled in `assets/licenses/`.
