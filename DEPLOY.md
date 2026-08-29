# Deploying — GitHub + GitHub Pages

The site is a static React build published to GitHub Pages by a GitHub Actions
workflow. Every push to `main` rebuilds and redeploys automatically.

Most of what's below is already done. What's left needs a browser login, which is
why it's written as steps for you to run rather than done for you.

---

## Read this first: what Pages can and can't do

GitHub Pages serves **static files only**. It cannot run Node, so it cannot run
a mail server. That's why the contact form has no backend at all — it opens the
visitor's own email client with a `mailto:` link addressed to
**freshframestud@gmail.com**, pre-filled with what they typed. There's no key,
no service, and nothing to configure — it works the moment the site is built.

```
Browser ──mailto:──> visitor's own email app ──> freshframestud@gmail.com
```

---

## 1. Push to GitHub

**Already done** — the repo exists, the remote is configured, and all commits
are pushed to https://github.com/Ganesh-0509/FreshFrame (public). Future changes
are just:

```
git push
```

Git will open a browser to sign in. If it asks for a password in the terminal
instead, that won't work — GitHub removed password auth. Use a **Personal
Access Token** as the password (github.com → Settings → Developer settings →
Personal access tokens → Tokens (classic) → Generate new token → tick `repo`).

> The repo is **public**, which is what free Pages requires — Pages on a private
> repo needs GitHub Pro. Everything you push is publicly readable, so keep
> credentials out of it.

---

## 2. Configure the repo

**a. Turn Pages on — DO THIS FIRST, the build fails without it**

Repo → **Settings → Pages** → under *Build and deployment*, set
**Source** to **GitHub Actions**.

Do *not* pick "Deploy from a branch" — the workflow in
`.github/workflows/deploy.yml` uses the Actions path.

Until you do this, every push fails with:

```
Get Pages site failed. Please verify that the repository has Pages
enabled and configured to build using GitHub Actions
```

That message comes from the `configure-pages` step and is the *only* thing
wrong — the site itself builds fine before it. The workflow can't turn Pages on
for you: `configure-pages` has an `enablement` option, but it needs a Personal
Access Token rather than the built-in `GITHUB_TOKEN`, which is more setup than
the three clicks above.

After enabling, re-run from **Actions → Deploy to GitHub Pages → Re-run jobs**.
No new push needed.

**b. Link-preview URLs — already done**

`index.html` has the `og:`/`twitter:`/canonical/schema URLs set to
`https://freshframe.studio/`. Nothing to change unless the domain moves again,
in which case update all of them — they must be absolute, because link
scrapers don't resolve relative paths.

**c. Deploy**

Push, or re-run from the **Actions** tab. First build takes about a minute.

---

## 3. Check it actually worked

- **Site loads, images appear.** If the page is unstyled or images are broken,
  the base path is wrong — see the troubleshooting note below.
- **Submit the contact form.** It should open your default email app with a
  message addressed to **freshframestud@gmail.com**, subject and body already
  filled in from what you typed. If nothing opens, the visitor's browser/OS has
  no default mail app configured — the WhatsApp link is the fallback for that.

---

## 4. Custom domain — freshframe.studio

**Done.** `public/CNAME` contains `freshframe.studio`, every canonical/OG/schema
URL points at it, DNS is configured at name.com (A records to GitHub's four IPs),
the domain is set in Settings → Pages, and **Enforce HTTPS is on** — the
certificate was approved and confirmed live.

`www.freshframe.studio` also has a CNAME record pointing at
`ganesh-0509.github.io.`; if GitHub's Pages settings still shows it as
"improperly configured," that's DNS propagation lag on GitHub's checker, not a
real problem — the apex domain works regardless and this typically clears on
its own within a few hours.

A custom domain serves from the root rather than a subfolder — the build
handles that automatically since `vite.config.js` uses a relative base, so no
path changes are needed either way.

---

## Troubleshooting

**Blank page, or CSS and images missing.** Almost always the base path.
`vite.config.js` sets `base: './'`, which makes every URL relative so the
build works at any subfolder or domain root without hardcoding a path.

**Images 404.** An image path lost its `asset()` wrapper. Every reference to
`public/` from JSX must go through `asset()` in `src/lib/asset.js` — a bare
`src="/assets/x.png"` only works when the site is served from the domain root.

**Contact form does nothing on click.** The visitor's device has no default
email client set — genuinely rare, but it's why the WhatsApp link exists as a
fallback right next to it.

**"Get Pages site failed."** Pages isn't enabled, or isn't set to *GitHub
Actions* as the source. Step 2a. This is the most common first-deploy failure
and the error doesn't say what to click.

**Site 404s but the workflow is green.** Give it a minute on the very first
deploy. If it persists on the `github.io` URL specifically, check the path
case — it's case-sensitive and must match the repo name exactly.

**"Node.js 20 is deprecated" warning.** Harmless. It refers to the runtime the
GitHub-provided actions use, not the Node that builds your site, and GitHub
migrates them automatically. Ignore it.

**Workflow fails on install.** The workflow uses `npm ci`, which needs
`package-lock.json` to match `package.json` exactly. If you change a dependency,
run `npm install` locally and commit the updated lockfile with it.
