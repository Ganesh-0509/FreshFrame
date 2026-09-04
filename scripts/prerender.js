/* ══════════════════════════════════════════════════════════
   POST-BUILD PRERENDER.

   This is a one-page React app with no server. As shipped by `vite build`,
   dist/index.html is just an empty <div id="root"> — every crawler that
   doesn't execute JavaScript (GPTBot, OAI-SearchBot, and plenty of link
   scrapers) sees nothing but the <title> and the JSON-LD in <head>.

   This script runs the real built site in a headless browser, waits for
   React to render it exactly as a visitor would see it, and writes that
   rendered markup back into dist/index.html. Real visitors still get the
   full interactive site — main.jsx mounts on top of this markup exactly
   like it always did, it just now has real content to start from instead
   of an empty div.

   Nothing here is committed; dist/ is rebuilt fresh on every deploy.
   ══════════════════════════════════════════════════════════ */

import { preview } from 'vite'
import puppeteer from 'puppeteer'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

async function main() {
  const server = await preview({ root, preview: { port: 4173, strictPort: false } })
  const port = server.config.preview.port
  const url = `http://localhost:${port}/`

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0' })
    // Footer is the last thing App.jsx renders — its presence means the
    // whole component tree has mounted.
    await page.waitForSelector('.site-footer', { timeout: 10000 })

    let rootHtml = await page.$eval('#root', (el) => el.innerHTML)

    // GSAP (useSplitScroll, useCoverflow, useFlightArrow) sets transform/
    // opacity/filter directly on DOM nodes outside React, so whatever
    // these elements happen to be mid-animation at capture time (hero
    // lines mid-slide, carousel tiles mid-scroll, at whatever opacity/
    // scale that moment caught them at) gets baked into the "static"
    // snapshot. That's misleading for anyone who only ever sees this
    // markup — a crawler, or a real visitor for the brief window before
    // main.jsx takes over — since it can show content half-transparent
    // or offset. Strip it: it's GSAP's signature, so this never touches
    // the deterministic style attrs React itself renders (e.g. Services'
    // `--i` custom property), only GSAP-owned ones — which GSAP
    // overwrites the instant it runs anyway.
    rootHtml = rootHtml.replace(/ style="translate: none; rotate: none; scale: none;[^"]*"/g, '')

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
  } finally {
    await browser.close()
    await new Promise((resolvePromise) => server.httpServer.close(resolvePromise))
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
