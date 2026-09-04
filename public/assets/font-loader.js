/* Swaps each preloaded font stylesheet's rel from "preload" to
   "stylesheet" once it's fetched, so the font CSS applies without
   having blocked the initial render. Pulled out of an inline onload
   attribute so pages can run a strict CSP (script-src 'self', no
   'unsafe-inline') without breaking font loading. */
document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (link) {
  link.addEventListener(
    'load',
    function () {
      this.rel = 'stylesheet'
    },
    { once: true }
  )
})
