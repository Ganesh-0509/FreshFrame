import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  /* GitHub Pages serves a project repo from a subfolder
     (username.github.io/repo-name/), not the domain root.
     './' makes every generated URL relative, so the build works at ANY
     path without the repo name being hardcoded here — subfolder, custom
     domain, or local `npm run preview` all work unchanged.
     This is safe because the site is a single page: all navigation is
     #anchors, so the document URL never changes and relative paths
     always resolve. Add client-side routing later and this must become
     an explicit '/repo-name/'. */
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    /* No proxy any more. The contact form posts straight to Web3Forms, so
       there's no local API to forward to — `npm run dev` in client/ is the
       whole development setup now. */
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
