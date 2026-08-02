/* ══════════════════════════════════════════════════════════
   Resolve a path in client/public/ against the deploy base.

   WHY THIS EXISTS
   GitHub Pages serves a project repo from a subfolder, e.g.
   username.github.io/freshframe-website/. Vite rewrites asset URLs it
   can see at build time — imports, and paths inside index.html — but a
   plain string in JSX like src="/assets/logo.png" is just a runtime
   string, so it stays absolute and resolves to the domain ROOT. On a
   subfolder deploy that's a 404 for every image.

   vite.config.js sets base:'./', so BASE_URL is './' and the URLs this
   produces resolve relative to the current page. Works on Pages, on a
   custom domain, and in `npm run preview` with no change here.

   Accepts '/assets/x.png' or 'assets/x.png' — the leading slash is
   stripped either way, so callers don't have to care.
   ══════════════════════════════════════════════════════════ */

export function asset(path = '') {
  return import.meta.env.BASE_URL + String(path).replace(/^\/+/, '')
}
