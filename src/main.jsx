import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

/* dist/index.html ships real server-rendered markup (src/entry-server.jsx
   + scripts/prerender.js) so crawlers and the first paint both see real
   content, not an empty div. hydrateRoot reuses that markup instead of
   replacing it — see prerender.js for why that matters. Falls back to
   createRoot for `vite dev`, where #root really is empty. */
const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
