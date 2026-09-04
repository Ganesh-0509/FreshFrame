/* ══════════════════════════════════════════════════════════
   SSR ENTRY — used only at build time (scripts/prerender.js), never
   shipped to the browser. Renders the exact same component tree as
   main.jsx to a plain HTML string via react-dom/server, with no
   effects run (SSR never executes useEffect/useLayoutEffect) — so the
   markup reflects the component tree exactly as it looks BEFORE GSAP
   or any other effect touches the DOM. That's what makes it safe to
   hydrate: the client's own first render, also pre-effect, matches it
   exactly, so hydrateRoot has nothing to reconcile. Animations then
   start from useEffect exactly as they always have — nothing about
   their timing or behavior changes.
   ══════════════════════════════════════════════════════════ */
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function render() {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
