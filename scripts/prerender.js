/* ══════════════════════════════════════════════════════════
   POST-BUILD PRERENDER.

   This is a one-page React app with no server. As shipped by `vite build`,
   dist/index.html is just an empty <div id="root"> — every crawler that
   doesn't execute JavaScript (GPTBot, OAI-SearchBot, and plenty of link
   scrapers) sees nothing but the <title> and the JSON-LD in <head>.

   Renders the app via react-dom/server (src/entry-server.jsx, built by
   the `--ssr` step in package.json's build script) and writes that
   markup into dist/index.html. Real visitors get the full interactive
   site — main.jsx HYDRATES this markup (react-dom/client's hydrateRoot)
   rather than replacing it, so the fast static paint is what sticks
   instead of getting thrown away and repainted once the JS bundle
   loads.

   This used to run the built site in headless Chrome (Puppeteer) and
   capture the DOM after everything — including GSAP's scroll-driven
   animations — had already mounted. That worked for no-JS crawlers, but
   it captured a mid-animation snapshot (specific scroll-loop transform
   values, viewport-measured widths) that could never match a fresh
   client render, so React couldn't hydrate it — any real visit fell
   back to a full client-side re-render anyway. Real SSR renders the
   component tree once, synchronously, with no effects run (SSR never
   executes useEffect/useLayoutEffect) — the same state a fresh client
   render is in before its own effects fire — so the two sides agree and
   hydration succeeds. GSAP and every other effect-driven animation
   still starts exactly when and how it always has; nothing about their
   behavior changes here, only how the initial HTML gets built.

   Nothing here is committed; dist/ and dist-ssr/ are rebuilt fresh on
   every deploy.
   ══════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

async function main() {
  const entryPath = resolve(root, 'dist-ssr/entry-server.js')
  const { render } = await import(pathToFileURL(entryPath))

  const rootHtml = render()

  const indexPath = resolve(root, 'dist/index.html')
  const shell = readFileSync(indexPath, 'utf-8')
  const prerendered = shell.replace(
    '<div id="root"></div>',
    `<div id="root">${rootHtml}</div>`
  )

  if (prerendered === shell) {
    throw new Error('Prerender did not find <div id="root"></div> to replace — check dist/index.html output.')
  }

  writeFileSync(indexPath, prerendered)
  console.log(`Prerendered ${rootHtml.length.toLocaleString()} chars of markup into dist/index.html`)
}

main().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
