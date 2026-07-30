# Deploying — push to GitHub, then Vercel

The repo is committed and ready. Everything below needs a browser login,
which is why it's a list for you to run rather than something already done.

Run all of these from the project folder:

```
f:\PROJECT\New folder\Website-freelance
```

---

## 1. Push to GitHub

You don't have the GitHub CLI installed, so the simplest route is the website.

**a. Create the empty repo**

Go to **https://github.com/new**

- Repository name: `freshframe-website` (or whatever you like)
- **Private** is fine — Vercel can still deploy from a private repo
- **Do not** tick "Add a README", "Add .gitignore" or "Add a license".
  The repo already has all three, and ticking them causes a conflict on
  first push.

**b. Push**

Copy the URL GitHub shows you, then:

```
git remote add origin https://github.com/YOUR-USERNAME/freshframe-website.git
git push -u origin main
```

Git will ask you to sign in — a browser window opens, approve it there.
If it asks for a password in the terminal instead, that won't work: GitHub
removed password auth. Use a **Personal Access Token** as the password
(github.com → Settings → Developer settings → Personal access tokens →
Tokens (classic) → Generate new token → tick `repo`).

**Optional but easier next time:** install the GitHub CLI
(`winget install GitHub.cli`), then `gh auth login` once and step (a)
collapses into a single `gh repo create freshframe-website --private --source=. --push`.

---

## 2. Deploy on Vercel

**a. Import the repo**

1. Go to **https://vercel.com/new**
2. Sign in with GitHub
3. Pick `freshframe-website`

**b. Leave every build setting alone**

`vercel.json` already sets them:

| Setting | Value | Where it comes from |
|---|---|---|
| Build command | `npm run build` | `vercel.json` |
| Output directory | `client/dist` | `vercel.json` |
| Install command | `npm install` | Vercel default |

If Vercel guesses a framework preset, set **Framework Preset → Other**.
Don't let it set the root directory to `client/` — the API functions live at
the project root and would be left out.

**c. Add the environment variables — do this BEFORE the first deploy**

In the import screen, expand **Environment Variables** and add:

| Name | Value |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `vinoism1703@gmail.com` |
| `SMTP_PASS` | *your 16-character Google App Password* |
| `MAIL_TO` | `vinoism1703@gmail.com,ganesh957kumar@gmail.com` |

Getting the App Password (Gmail rejects normal passwords):

1. The account needs **2-Step Verification** on
   → myaccount.google.com → Security → 2-Step Verification
2. Then **myaccount.google.com/apppasswords**
3. Create one named "Fresh Frame website", copy the 16 characters, no spaces

**Type it straight into Vercel.** Don't paste it into a chat, a file, or a
commit — it grants full send-as access to that Gmail account.

**d. Deploy**

Click Deploy. First build takes about a minute.

---

## 3. Check it actually worked

Once you have your `*.vercel.app` URL:

**Is SMTP wired up?** Open:

```
https://YOUR-SITE.vercel.app/api/health
```

You want `{"ok":true,"smtp":true,"recipients":2}`.

If `smtp` is `false`, the env vars didn't land — add them under
Settings → Environment Variables, then **Deployments → ⋯ → Redeploy**.
Environment variables are only read at deploy time; adding them does not
affect the build already running.

**Does mail arrive?** Fill in the contact form on the live site. Both
inboxes should get it within a few seconds. Check spam the first time —
Gmail sometimes filters the first message a new sender sends.

Then reply to it. The reply should go to whatever address the enquirer
typed, not back to yourselves.

---

## 4. After that

- **Custom domain** — Vercel → Settings → Domains. Add the domain, then
  point the nameservers or add the CNAME it shows you.
- **Lock down CORS** — once the domain is live, add
  `CORS_ORIGIN=https://yourdomain.com` as an env var.
- **Every `git push` to `main` redeploys automatically.** No further steps.

---

## Why the Express server isn't what runs in production

Worth knowing so it doesn't confuse you later.

Vercel is serverless — it has no long-running processes, so `app.listen()`
in `server/index.js` is never called there. If the contact form relied on
that file, it would 404 on the live site.

So there are two entry points sharing one piece of logic:

```
api/_lib/mail.js       ← validation, rate limit, email building. one copy.
├── api/contact.js     ← Vercel serverless function. THIS runs in production.
└── server/index.js    ← Express. Local `npm run dev` only.
```

`server/` is excluded from deploys via `.vercelignore`. Keep it — it's what
makes `npm run dev` work without installing the Vercel CLI, and it's your
escape hatch if you ever move to Render or Railway, where a normal Node
server *is* what you want.

One caveat: the in-memory rate limiter only covers a single warm serverless
instance on Vercel, so it's best-effort there. The honeypot does the real
spam filtering.
