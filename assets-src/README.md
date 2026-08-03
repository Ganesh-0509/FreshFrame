# assets-src — image masters

Nothing in here is served. Vite copies `public/` into the build verbatim,
so anything left there ships whether or not a page asks for it; these are
the originals the shipped files were made FROM, kept out of the deploy.

| file | what it is |
|---|---|
| `ganesh.png`, `vino.png` | the originals as supplied — cut out, but matted onto flat `#f7f7f7` |
| `ganesh-cut.png`, `vino-cut.png` | those two cut to real alpha and cropped to the subject. Lossless masters for the `.webp` in `public/assets/` |
| `pro.png` | an alternative shot of Ganesh. Better pose and wardrobe, but the subject is only 300x404 — the team slot renders 347px tall, so a 2x screen upscales it 1.7x and the cut edge visibly stair-steps. Needs the full-resolution original before it can be used |
| `logo.png` | 1254px brand master. `logo.webp` (144px), the favicons and `og-card.jpg` all come from this |
| `project-1.png`, `project-2.png` | full-resolution screenshots. The shipped `.webp` are 1200px, which is 2x the 546px they render at |

## Regenerating

The `.webp` files were encoded from these with Chromium's own encoder at
q0.90 — any WebP encoder gives the same result. Two things matter:

- **keep the alpha.** The two people are cutouts standing directly on the
  team sheet; lossy WebP carries a real alpha channel, so this works, but
  check the edges at 2x afterwards for a halo.
- **keep `og-card.jpg` a JPG.** Several link scrapers still do not read
  WebP, and that image exists to be read by someone else's parser.
