# assets-src — image masters

Nothing in here is served. Vite copies `public/` into the build verbatim,
so anything left there ships whether or not a page asks for it; these are
the originals the shipped files were made FROM, kept out of the deploy.

| file | what it is |
|---|---|
| `ganesh-pro-original.jpeg`, `pro.png` | the shot now used for Ganesh — the WhatsApp original and the cut-out version of it. **This is the source of `ganesh-cut.webp`** |
| `ganesh.png`, `vino.png` | earlier originals as supplied — cut out, but matted onto flat `#f7f7f7`. `ganesh.png` is the striped-tee shot the pro one replaced |
| `ganesh-cut.png`, `vino-cut.png` | those two cut to real alpha and cropped to the subject. `vino-cut.png` is still the master for `vino-cut.webp`; `ganesh-cut.png` is now superseded |
| `logo.png` | 1254px brand master. `logo.webp` (144px), the favicons and `og-card.jpg` all come from this |
| `project-1.png`, `project-2.png` | full-resolution screenshots. The shipped `.webp` are 1200px, which is 2x the 546px they render at |

## Regenerating

The `.webp` files were encoded from these with Chromium's own encoder at
q0.90 — any WebP encoder gives the same result. Two things matter:

- **keep the alpha.** The two people are cutouts standing directly on the
  team sheet; lossy WebP carries a real alpha channel, so this works, but
  check the edges at 2x afterwards for a halo.
- **Ganesh is the exception: his is enlarged 2x on the way out.** WhatsApp
  capped his original at 720x1280 and he is a small figure in a wide
  architectural shot, so the usable subject is only 300x404 against a slot
  that renders 347px tall. Left to the browser that is a 1.7x upscale and
  the cut edge stair-steps. So it is resampled to 600x808 here instead,
  with the alpha edge blurred to blend the steps and a mild unsharp on the
  colour only. Replace it the moment there is a photo where he fills the
  frame — no amount of resampling invents detail that was never captured.
- **keep `og-card.jpg` a JPG.** Several link scrapers still do not read
  WebP, and that image exists to be read by someone else's parser.
