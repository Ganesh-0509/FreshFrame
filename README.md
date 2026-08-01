# Fresh Frame — website

**Static React (Vite) site, deployed to GitHub Pages.**

Enquiries from the contact form are emailed to **vinoism1703@gmail.com** via
[Web3Forms](https://web3forms.com). Nothing is stored anywhere.

**Status:** built and ready to deploy. Repo, remote and link-preview URLs are all set
to https://github.com/Vino1705/FreshFrame. **One thing is outstanding: the Web3Forms
access key.** See [What's left to do](#whats-left-to-do).

**To put it online:** follow [DEPLOY.md](DEPLOY.md) — GitHub, then Pages, then the
access key. Those steps need a browser login, so they're written out as instructions
rather than done for you.

> **Why there's no backend.** GitHub Pages serves static files only — it can't run
> Node, so it can't run a mail server. The form posts straight to Web3Forms instead.
> `server/` still holds a complete Express mail server, but **nothing deploys or runs
> it**; it's an escape hatch, explained at the top of `server/index.js`.
>
> The free plan delivers to **one inbox**, which is all this needs — enquiries go to
> Vinothini, who handles client engagement. A second recipient (`ccemail`) is a PRO
> feature; if you want Ganesh on it later, a Gmail forwarding filter does it free.

---

## How to run it

### First time only

```
npm run setup
```

Installs the client dependencies.

Then copy `client/.env.example` to `client/.env` and paste in your Web3Forms access
key. Without it the site still runs, but the form shows its fallback message instead
of sending — see [Making the contact form send real email](#making-the-contact-form-send-real-email).

### Every time after that

```
npm run dev
```

One process now. Open **http://localhost:5173**. Edits reload the browser instantly.

> On Windows, use `localhost` and not `127.0.0.1` — Vite binds to IPv6 by default.

> `VITE_*` variables are inlined at **build** time, not read at run time. After
> editing `client/.env` you must restart `npm run dev` or the change won't apply.

### Building for production

```
npm run build      # builds the static site into client/dist
npm run preview    # serves that build locally so you can check it
```

You don't normally need either — pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds and publishes to Pages automatically.

---

## Making the contact form send real email

Until you do this the form shows *"Could not send that — WhatsApp us on…"* on every
submission. That's deliberate: it never claims to have sent something it hasn't.

1. Go to **https://web3forms.com**
2. Enter the inbox that should receive enquiries. They email you an **access key**
3. Copy `client/.env.example` to `client/.env` and paste it in:

```
VITE_WEB3FORMS_KEY=your-access-key-here
```

4. Restart `npm run dev` — Vite only reads env vars at startup
5. For the live site, add the same value as a repo secret named
   `VITE_WEB3FORMS_KEY` (DEPLOY.md step 3b)

**Where enquiries land is set by the key, not by the code.** Register the key to
`vinoism1703@gmail.com` and that's where they go. Nothing in `site.js` or anywhere
else controls it — there is no setting in this repo for it. To change the destination
you get a new key for the other inbox and swap the secret. Editing files does nothing.

> **On the key being public.** It ends up readable in the built JavaScript. That's
> how Web3Forms works and it isn't a leak — the key is write-only, it can only submit
> to your own form. It lives in an env var so it isn't committed to a public repo.

### What the form already handles

- Name and contact are required; inline errors if they're missing
- A hidden `botcheck` honeypot — Web3Forms drops submissions that arrive with it filled
- `replyto` set to the enquirer, **but only when they typed an actual email address** —
  a phone number would make the header invalid and can get the mail rejected. So
  hitting Reply works when they gave an email, and does nothing surprising when they didn't
- Rate limiting and spam filtering are handled by Web3Forms (free plan: 250/month)
- Every failure path — no key, network error, bad key, 429 — shows the WhatsApp and
  email fallback rather than a false success

---

## File structure

```
Website-freelance/
├── package.json              root scripts (setup, dev, build, preview)
├── .github/workflows/
│   └── deploy.yml            builds + publishes to Pages on every push to main
├── client/                   ── the site. this is what deploys ──
│   ├── index.html            page shell, font links, link-preview tags
│   ├── vite.config.js        base:'./' — the Pages subfolder fix
│   ├── .env.example          copy to .env, add your Web3Forms key
│   ├── public/
│   │   ├── .nojekyll         stops Pages running the files through Jekyll
│   │   └── assets/           logo, screenshots, photos
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           section order
│       ├── data/site.js      ← ALL CONTENT LIVES HERE
│       ├── lib/asset.js      resolves public/ paths against the deploy base
│       ├── styles/
│       │   ├── global.css    ← IMPORTS ONLY. no rules. controls order
│       │   ├── theme.css     ← ALL COLOUR, FONT + SHAPE TOKENS
│       │   ├── base.css      reset, bands, shared type, buttons, reveal
│       │   └── sections/     one .css per section, same names as below
│       ├── hooks/
│       │   └── useFlightArrow.js   the scroll arrow
│       └── components/       one .jsx per section
└── server/                   ── ⚠ NOT DEPLOYED. escape hatch only ──
    ├── index.js              Express: /api/contact + serves client/dist
    ├── lib/mail.js           validation, rate limiting, the email itself
    ├── .env.example          only needed if you actually host this
    └── package.json
```

> **`client/src/lib/asset.js` matters more than it looks.** Pages serves a project
> repo from `username.github.io/repo-name/`, not the root. Vite rewrites paths it
> can see at build time, but a plain string like `src="/assets/logo.png"` in JSX is
> just a runtime string — it stays absolute and 404s. Every reference to
> `client/public/` from a component must go through `asset()`.

### Where to change things

| I want to change… | Edit |
|---|---|
| Any text, price, list item, link | `client/src/data/site.js` |
| **Any colour or font, site-wide** | `client/src/styles/theme.css` |
| **One section's look or motion** | `client/src/styles/sections/<name>.css` |
| Something shared by 2+ sections | `client/src/styles/base.css` |
| Section order | `client/src/App.jsx` |
| The big section headings (h2) | the individual component in `client/src/components/` |
| Where email goes | the inbox on your Web3Forms key — change it at web3forms.com |
| An image | drop it in `client/public/assets/`, reference it via `asset()` |

`site.js` holds all the repeating content — services, automation tiles, projects,
process steps, team, pricing, FAQ. The one-off `<h2>` headings sit in their components,
because several of them need a line break in a specific place.

### The stylesheet is split one file per section

`global.css` used to be a single 1,171-line file. It is now imports only, and each
section owns its own stylesheet:

```
styles/
├── global.css              imports, in page order. NO RULES HERE
├── theme.css               every token. the only file a retheme touches
├── base.css                reset, bands, .kicker/.section-title, buttons, .reveal
└── sections/
    header.css   hero.css      marquee.css   services.css
    automation.css  work.css   process.css   team.css
    pricing.css   faq.css      contact.css   footer.css
```

Every section file is laid out the same way: **THEME → LAYOUT → RESPONSIVE →
ANIMATION**. That section's breakpoints live in its own file rather than a shared
media-query block at the bottom, and each file ends with an empty `ANIMATION` block
ready for motion to be dropped in.

Two rules keep it that way:

- **Section files never hardcode a colour.** They read tokens from `theme.css`, so a
  palette change is one file, not thirteen.
- **Anything used by two or more sections belongs in `base.css`**, not copied around.

Anything added to an `ANIMATION` block is automatically neutralised by the
`prefers-reduced-motion` query at the end of `base.css`.

---

## What we built

### The design — near-black and crimson

A single red family on a near-black page, with heavy poster display type. Replaced the
old light blue/violet/teal system.

| Token | Value | |
|---|---|---|
| `--red` | `#ee4a57` | the workhorse accent |
| `--red-2` | `#ff4d5a` | hover and emphasis |
| `--red-deep` | `#8f1620` | **large display type only** — fails contrast by design |
| `--rose` | `#c9736f` | soft secondary |
| `--ok` | `#5ec98b` | the one deliberate non-red, see below |
| `--paper` | `#0b0b0d` | page base |
| `--surface` | `#131317` | cards |
| `--ink` | `#050506` | deepest band — contact and footer |

Type: **Anton** for poster headings, **Caveat** for handwritten asides (`.script`),
Inter for body, JetBrains Mono for labels.

**Contrast is measured against `--surface-2` (`#1b1b21`), the lightest surface any text
can land on** — not the page base, which would flatter every ratio by about 1.5× and
hide failures on cards. Every text token clears AA body (4.5:1); the figures are in
`theme.css`. The reference crimson `#e63946` sits at 4.1:1 on cards and **fails**, so
`--red` is nudged to `#ee4a57` — the least-bright red that passes. `--red-deep` fails
deliberately and is only used by `.ghost-type`, which is decorative.

`--ok` is green rather than red because a success message in red is indistinguishable
from an error. It is used in exactly one place.

**Per-section accent.** Every section reads `--accent`, so one line in `theme.css`
restyles a whole section. All eight currently point at `--red` to match the reference;
they are listed separately so they can diverge.

### Band rhythm

The page is dark throughout, so the bands are now steps on one near-black ramp rather
than an alternation between white and tint. Separation comes from small lightness
shifts and hairline borders instead of colour:

```
hero        --paper    #0b0b0d   (soft red glow)
marquee     --paper-2  #101013
services    --paper    #0b0b0d
automation  --paper-2  #101013
work        --paper    #0b0b0d
process     --paper-3  #15151a   rounded slab  ← the arrow lives here
team        --paper    #0b0b0d
pricing     --paper-2  #101013
faq         --paper    #0b0b0d
contact     --ink      #050506   the deepest band, anchoring the CTA
footer      --ink      #050506
```

`.band-dark` used to flip every token so light components inverted onto the one dark
strip. With the page dark throughout that inversion is meaningless, so it now only goes
darker and lifts its accent to `--red-2`, which reads more strongly against `--ink`.

### Accessibility

Every text colour is checked at **≥4.5:1** (WCAG AA) against the lightest surface it
can appear on — `--surface-2` `#1b1b21`. Measured, not guessed:

| Token | Worst case (on `#1b1b21`) |
|---|---|
| `--text` `#f5f3f1` | 15.5:1 |
| `--ok` `#5ec98b` | 8.3:1 |
| `--muted` `#a5a09b` | 6.6:1 |
| `--red-2` `#ff4d5a` | 5.3:1 |
| `--rose` `#c9736f` | 5.0:1 |
| `--dim` `#8b857f` | 4.7:1 |
| `--red` `#ee4a57` | 4.7:1 |
| `--red-deep` `#8f1620` | **1.9:1 — display only** |

Measuring against the page base instead would have flattered every figure by roughly
1.5× and hidden a real failure on cards.

**`--red` is not the reference crimson.** `#e63946` from the reference image measures
4.1:1 on card surfaces and fails AA. Since `.kicker` is small text, `--red` was moved to
`#ee4a57`, the least-bright red that clears 4.5:1. The difference is barely visible; the
failure would not have been.

`--red-deep` fails deliberately. It is used only by `.ghost-type`, the oversized
decorative word behind a section, which carries no information.

If you change any of these, re-measure against `#1b1b21`. A colour that *looks* fine on
the page base often isn't fine on a card.

### The sections

| # | Section | Purpose |
|---|---|---|
| 1 | **Header** | Sticky, goes white + blurred on scroll. Burger menu under 860px. |
| 2 | **Hero** | Leads with the mock-first promise. Dark code window as the one deliberately dark object on a light page, with four floating service chips. |
| 3 | **Marquee** | Scrolling promises. Cheap reassurance right after the hero. |
| 4 | **Services** | Four cards, 2×2 — Websites, **Automation**, Branding, Digital Solutions. |
| 5 | **Automation** | Its own section, because it's a different product from web work and needs explaining rather than listing. Six example tiles plus a four-step strip. Framed around the customer's problem, not the technology. |
| 6 | **Work** | Two real projects, alternating. Both fully clickable. |
| 7 | **Process** | **Two paths, switchable.** See below. The flight arrow lives here. |
| 8 | **About** | You and Ganesh, with links to both personal portfolios. |
| 9 | **Pricing** | Three tiers as ranges, plus the Care plan add-on. |
| 10 | **FAQ** | Eight questions, one open at a time. Three cover automation. |
| 11 | **Contact** | Form + email + WhatsApp, on the dark band. |
| 12 | **Footer** | Logo, tagline, nav. |

### The two process paths

This was the inconsistency in the earlier version, now resolved. The two offers are
genuinely different, so the Process section has a **switch** between them:

**"I want a website"** — we build a basic mock first, free, and you decide at step three.

**"I want a product built"** — tell us what's slowing you down → we get on a call and
talk features → we scope it and quote in writing → we build, you try it on real work →
handover and support.

Automations don't get a free mock, and the FAQ says so plainly and explains why: a
workflow isn't something you can look at in a browser and judge in five minutes. You
still commit nothing until you've seen the scope and the price.

Both paths are in `site.js` under `processPaths`. Add a step and the arrow re-measures
itself automatically.

### The two projects

Both cards link to the live site — the screenshot, the title and the explicit link all
navigate, and a *"Visit site ↗"* badge fades in on hover (always visible on touch).

| | Project |
|---|---|
| **01** | **Standard Fireworks, Sivakasi** — [standardfireworkssivakasi.com](https://standardfireworkssivakasi.com/). Wholesale/retail crackers, Sivakasi direct to Chennai. Product catalogue, price list, tiered volume discounts, Deepavali ordering. |
| **02** | **Cafe by Cassette** — [cafe-by-cassette.netlify.app](https://cafe-by-cassette.netlify.app/). Cassette-themed music café in Kattupakkam, Chennai. Story, bestsellers, menu, WhatsApp reservations. |

I wrote both descriptions from what's visible on the live sites. **Read them and correct
anything I got wrong about the brief** — I know what shipped, not what the clients asked
for.

### The flight arrow

The thing from ecell.in/chapters. One arrow, **no visible line**.

Code: `client/src/hooks/useFlightArrow.js`.

1. It reads the **live position** of every `.step-card` and builds an array of `{x, y}`
   points from their inner edges.
2. That array *is* the flight path. It is never drawn — the arrow is the only visible thing.
3. The zig-zag doesn't come from the animation. It comes from the **CSS layout** — cards
   alternate left and right, so the anchor points naturally stagger.
4. `curviness: 1.2` arcs it smoothly between cards instead of snapping at hard corners.
5. `autoRotate: true` keeps the nose pointed along the direction of travel — that's what
   makes it read as a journey rather than a floating icon.
6. `scrub: 1` is the important one. The arrow isn't playing an animation — it is **welded
   to your scrollbar**, with 1 second of smoothing. Stop scrolling and it stops. Scroll
   back up and it flies back up.
7. Scrolling up flips the SVG 180° so it never travels tail-first.
8. It rebuilds on resize, after fonts load, **and when you switch process paths** — the
   path is measured from real layout, and all three change card positions.

The original arrow is black on beige. Ours runs all three colours along its length —
violet at the tail, blue through the middle, teal at the nose.

**Tuning it** — all in `buildFlightPath()`:

| Change | Effect |
|---|---|
| `curviness` (1.2) | higher = wider, loopier arcs |
| `scrub` (1) | higher = laggier; `true` = locked exactly to scroll |
| `inset` (`arrowW * 0.42`) | how far onto each card the arrow rides |
| `box.height * 0.3` | where vertically on each card it lands |
| `start` / `end` (`'top 55%'`) | when the flight begins and ends |

**Moving it elsewhere:** give that section's cards `data-step` and `.step-card`, wrap
them in a `position: relative` container, and pass that container's ref to the hook. It
needs **at least 3–4 cards** for the zig-zag to read as a path; with 2 it's a straight
hop. That's why it isn't on the Work section.

---

## What's left to do

### Done

- [x] Converted from static HTML to React + Node
- [x] Contact form emails both of you, with honeypot + rate limiting
- [x] Both projects — real names, descriptions, screenshots, working links
- [x] Both photos, and both personal portfolio links in the About section
- [x] Automation added as a full product line
- [x] Light tri-colour theme, no peach or beige, all contrast verified
- [x] Two process paths — free mock for websites, a call for products
- [x] Pricing updated to ranges + Care plan add-on

### Blocking — before anyone sees this

- [ ] **Web3Forms access key.** Go to web3forms.com, enter `vinoism1703@gmail.com`,
      and they email you a key. Put it in `client/.env` for local dev, and add it as the
      repo secret `VITE_WEB3FORMS_KEY` for the Pages build. **This is the only thing
      standing between you and a working site.** Until then the form shows an error,
      which is deliberate — see below.
- [x] **Recipient.** Enquiries go to `vinoism1703@gmail.com` — the key must be
      registered to that inbox. One recipient fits the free plan exactly.
- [x] **Link-preview URLs** set to `https://Vino1705.github.io/FreshFrame/`.
- [x] **Public email address.** `ganesh957kumar@gmail.com`.
- [x] **WhatsApp number.** `+91 90427 85843`.
- [ ] **Read the two project descriptions** and correct anything wrong.

> **Why an unconfigured form errors instead of pretending.** It used to return
> `200 {ok:true}` when mail wasn't configured, so the visitor was told *"Got it — we'll
> reply today"* while the enquiry reached nothing but a console. A forgotten setting
> meant enquiries were lost silently, with the customer believing otherwise. Now every
> failure path — missing key, network error, rejected key, rate limit — shows the
> WhatsApp and email fallback. A success message means the email actually sent.

### Decisions to confirm

- [ ] **Pricing.** ₹3,000–6,000 / ₹8,000–15,000 / ₹15,000–30,000 and the ₹500–1,500
      Care plan are the numbers you gave. The **feature lists under each tier are mine** —
      check they match what you actually include at each price.
- [ ] **Turnaround times.** The FAQ commits you in writing to a **2–3 day** mock, **about
      a week** for a single-page build, and **two to three** for larger sites.
- [ ] **Support window.** Premium says **30 days** after launch.
- [ ] **Zero advance.** The hero and Process promise a free mock with no advance for
      websites. Make sure you're both happy being held to that.
- [ ] **City.** Set to Chennai, inferred from both clients being Chennai-area.

### Technical

- [ ] **Compress the images.** `logo.png` **1.8 MB** (loads twice), `project-2.png`
      **2.3 MB**, `project-1.png` **1.3 MB** — about 5.4 MB before anything else. On
      mobile data this will crawl. TinyPNG or Squoosh; screenshots should be well under
      300 KB each as `.jpg`.
- [ ] **Favicon.** Reusing the full logo. A 512×512 square crop looks better in a tab.
- [x] **Open Graph tags** added to `client/index.html`, pointing at the real Pages URL.
      The share image is the logo as a stand-in; a 1200×630 JPG is better.
- [x] **Deleted the duplicate `logo.png`** from the project root.
- [x] **`loading="lazy"`** on the project screenshots, team photos and footer logo. The
      header logo stays eager on purpose — it's above the fold.
- [x] **Pages subfolder paths.** `base:'./'` plus `asset()` — verified by serving the
      build from a subfolder; without it all five images 404'd.
- [ ] Real device testing on one Android and one iPhone.

### Deliberately not built

- **Testimonials.** Add the section once you have two real quotes from the two clients.
  An invented or empty one costs more trust than it buys.

### Deployment

**GitHub Pages**, published by `.github/workflows/deploy.yml` on every push to `main`.
Step-by-step setup — repo, Pages source, the access key — is in
**[DEPLOY.md](DEPLOY.md)**.

If you ever outgrow Web3Forms (more than one recipient without paying, or you want to
store submissions), `server/index.js` is a complete Express app that serves the built
client and the mail API on one port. Deploy it to Render or Railway unchanged with
`npm run build && npm run start:server`, and point the form back at `/api/contact`.
