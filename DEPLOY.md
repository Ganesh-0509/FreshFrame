# Deploying — GitHub + GitHub Pages

The site is a static React build published to GitHub Pages by a GitHub Actions
workflow. Every push to `main` rebuilds and redeploys automatically.

Everything below needs a browser login, which is why it's a list for you to run
rather than something already done. Run the commands from:

```
f:\PROJECT\New folder\Website-freelance
```

---

## Read this first: what Pages can and can't do

GitHub Pages serves **static files only**. It cannot run Node, so it cannot run
a mail server. That's why the contact form no longer posts to our own API — it
posts directly to **Web3Forms**, which takes the submission and emails it to you.

```
Browser ──POST──> api.web3forms.com ──email──> your inbox
```

Enquiries go to **vinoism1703@gmail.com** only. That fits the free plan exactly
— it delivers to one inbox, and a second recipient (`ccemail`) is a PRO feature.
Nothing to work around.

> **Which inbox is decided by the KEY, not by the code.** Whatever address you
> typed at web3forms.com is where enquiries land. There is no setting in this
> repo that changes it. If your key was created with a different address, the
> only fix is a new key — see step 2.

If you later want Ganesh's inbox on it too, the free route is a Gmail forwarding
filter on `no-reply@web3forms.com` rather than paying for PRO.

`server/` still contains a complete, working Node mail server. Nothing deploys
it and nothing runs it. It's kept as an escape hatch — see the note at the top
of `server/index.js` if you ever want to move to Render or Railway.

---

## 1. Push to GitHub

**Already done** — the repo exists, the remote is configured, and all commits
are pushed to https://github.com/Vino1705/FreshFrame (public). Future changes
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
> credentials out of it. `client/.env` and `server/.env` are gitignored for
> exactly this reason; the `.env.example` files are the ones that get committed.

---

## 2. Get a Web3Forms access key

This is the one step that can't be done for you — it needs access to the inbox
that receives the key.

1. Go to **https://web3forms.com**
2. Enter **`vinoism1703@gmail.com`** and submit
3. Web3Forms emails an **access key** to that inbox — copy it (check spam)

That's it. No account, no password, no card. Free plan is 250 submissions/month,
which is far more than this site will see.

Whichever address you enter here is where enquiries land — it is **not** set
anywhere in the code. To change it later, get a new key for the other inbox and
swap the secret in step 3b.

---

## 3. Configure the repo

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

**b. Add the access key**

Repo → **Settings → Secrets and variables → Actions** → *New repository secret*

| Name | Value |
|---|---|
| `VITE_WEB3FORMS_KEY` | your Web3Forms access key |

The name must match exactly. Vite inlines `VITE_*` variables **at build time**,
so if this is missing when the workflow runs, the form ships unable to send —
the build will still succeed, but Actions logs a warning and the form shows its
fallback message. Add the secret, then re-run the workflow.

> The key ends up readable in the published JavaScript. That's normal for
> Web3Forms and not a leak: the key is write-only, it can only submit to your
> own form. It's a secret here so it isn't committed to a public repo.

**c. Link-preview URLs — already done**

`client/index.html` has the `og:`/`twitter:` URLs set to
`https://Vino1705.github.io/FreshFrame/`. Nothing to change unless you rename
the repo or move to a custom domain, in which case update all three — they must
be absolute, because link scrapers don't resolve relative paths.

**d. Deploy**

Push, or re-run from the **Actions** tab. First build takes about a minute.
Your site lands at:

```
https://Vino1705.github.io/FreshFrame/
```

---

## 4. Check it actually worked

- **Site loads, images appear.** If the page is unstyled or images are broken,
  the base path is wrong — see the troubleshooting note below.
- **Submit the contact form.** The enquiry should reach
  **vinoism1703@gmail.com** within a few seconds. Check spam the first time —
  Gmail often filters the first message from a new sender. If it arrives at a
  different address, the key is registered to that one; get a new key.
- **Reply to the email.** It should address the enquirer, not yourself — the form
  sets `replyto`, but only when they typed an actual email address rather than a
  phone number.
- **Test the failure path** by submitting from a blocked network or with the
  secret removed: you should see *"Could not send that — WhatsApp us on…"*, never
  a false success. That's deliberate.

---

## 5. Optional — a custom domain

Pages → Settings → Pages → **Custom domain**. Add the domain, create a
`client/public/CNAME` file containing just the domain, and point your DNS at
GitHub. Then update the `og:` URLs again to the new domain.

A custom domain serves from the root rather than a subfolder. The build handles
that automatically — `vite.config.js` uses a relative base, so no path changes
are needed either way.

---

## Troubleshooting

**Blank page, or CSS and images missing.** Almost always the base path.
`client/vite.config.js` sets `base: './'`, which makes every URL relative so the
build works at any subfolder without hardcoding the repo name. If you ever add
client-side routing (React Router), relative base stops being safe and you must
set `base: '/your-repo-name/'` explicitly.

**Images 404 but CSS loads.** An image path lost its `asset()` wrapper. Every
reference to `client/public/` from JSX must go through
`asset()` in `client/src/lib/asset.js` — a bare `src="/assets/x.png"` resolves
to the domain root and 404s on a project-repo URL.

**Form says "Could not send".** Open the browser console. Either
`VITE_WEB3FORMS_KEY` wasn't set at build time, or Web3Forms returned an error —
the console logs which. A 429 means their rate limit; the free plan allows 250
submissions a month.

**"Get Pages site failed."** Pages isn't enabled, or isn't set to *GitHub
Actions* as the source. Step 3a. This is the most common first-deploy failure
and the error doesn't say what to click.

**Site 404s but the workflow is green.** Give it a minute on the very first
deploy. If it persists, check the path case — `/FreshFrame/` is case-sensitive
and must match the repo name exactly.

**"Node.js 20 is deprecated" warning.** Harmless. It refers to the runtime the
GitHub-provided actions use, not the Node that builds your site, and GitHub
migrates them automatically. Ignore it.

**Workflow fails on install.** There's no root lockfile covering `client/`, so
the workflow uses `npm install` rather than `npm ci`. If you add a root lockfile,
switch it back for reproducible builds.
