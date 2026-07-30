# Fresh Frame — website

**React (Vite) front end + Node/Express mail server.**

Enquiries from the contact form are emailed straight to
`vinoism1703@gmail.com` and `ganesh957kumar@gmail.com`. Nothing is stored anywhere.

**Status:** built, committed, and ready to deploy. What's still placeholder: **the public
email address and the WhatsApp number**, plus SMTP credentials need adding before mail
actually sends. See [What's left to do](#whats-left-to-do).

**To put it online:** follow [DEPLOY.md](DEPLOY.md) — GitHub, then Vercel, then the
environment variables. Both steps need a browser login, so they're written out as
instructions rather than done for you.

> **Note on production:** Vercel is serverless and never runs `server/index.js`. The live
> contact form is `api/contact.js`; the Express server is for local `npm run dev` only.
> Both share `api/_lib/mail.js`. DEPLOY.md explains why.

---

## How to run it

### First time only

```
npm run setup
```

That installs the root, client and server dependencies in one go.

### Every time after that

```
npm run dev
```

Two things start together:

| | | |
|---|---|---|
| React front end | **http://localhost:5173** | this is the one you open |
| Express mail server | http://localhost:5000 | runs in the background |

Open **http://localhost:5173**. Edits to any file reload the browser instantly.

> On Windows, use `localhost` and not `127.0.0.1` — Vite binds to IPv6 by default.

You can also run them separately if you want:

```
npm run dev:client
npm run dev:server
```

### Building for production

```
npm run build      # builds the React app into client/dist
npm start          # Express serves client/dist AND the /api routes on one port
```

In production it's a single server on one port. In development they're separate, and
Vite forwards `/api/*` through to Express so the front end never needs to know the port.

---

## Making the contact form send real email

Until you do this, the form works and confirms on screen, but submissions are only
**printed to the server console** — nothing is emailed. The server warns you about this
on startup.

Gmail will not accept your normal password. You need an **App Password**:

1. The Google account must have **2-Step Verification** turned on
   → myaccount.google.com → Security → 2-Step Verification
2. Then go to **myaccount.google.com/apppasswords**
3. Create one (name it "Fresh Frame website") and copy the 16-character code
4. Copy `server/.env.example` to `server/.env`
5. Put the 16 characters in `SMTP_PASS` — no spaces:

```
SMTP_USER=vinoism1703@gmail.com
SMTP_PASS=abcdefghijklmnop
MAIL_TO=vinoism1703@gmail.com,ganesh957kumar@gmail.com
```

6. Restart the server. `http://localhost:5000/api/health` should now report
   `"smtp": true`.

`server/.env` is gitignored. **Never commit it** — an App Password gives full access to
send mail as that account.

Whichever address is in `SMTP_USER` is the one mail is *sent from*. Both addresses in
`MAIL_TO` receive it. Hitting **Reply** in Gmail replies to the client, not to
yourselves — the server sets `replyTo` when they gave a valid email address.

### What the form already handles

- Name and contact are required; inline errors if they're missing
- A hidden honeypot field — bots that fill it get a fake success and are dropped
- Rate limited to **5 submissions per IP per 15 minutes**
- Length caps so nobody can post a novel
- HTML-escaped before it goes into the email body

---

## File structure

```
Website-freelance/
├── package.json              root scripts (setup, dev, build, start)
├── client/                   ── React front end ──
│   ├── index.html            page shell + font links
│   ├── vite.config.js        dev server + /api proxy
│   ├── public/assets/        logo, screenshots, photos
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           section order
│       ├── data/site.js      ← ALL CONTENT LIVES HERE
│       ├── styles/global.css theme + layout
│       ├── hooks/
│       │   └── useFlightArrow.js   the scroll arrow
│       └── components/       one file per section
└── server/                   ── Node/Express ──
    ├── index.js              /api/contact, /api/health, static serve
    ├── .env.example          copy to .env and fill in
    └── package.json
```

### Where to change things

| I want to change… | Edit |
|---|---|
| Any text, price, list item, link | `client/src/data/site.js` |
| Colours, spacing, layout | `client/src/styles/global.css` |
| Section order | `client/src/App.jsx` |
| The big section headings (h2) | the individual component in `client/src/components/` |
| Where email goes | `server/.env` → `MAIL_TO` |

`site.js` holds all the repeating content — services, automation tiles, projects,
process steps, team, pricing, FAQ. The one-off `<h2>` headings sit in their components,
because several of them need a line break in a specific place.

---

## What we built

### The design — a light tri-colour system

Two colours come off the logo, the third is added so the page isn't all one temperature.
**No peach and no beige anywhere.**

| Token | Value | |
|---|---|---|
| `--blue` | `#2563eb` | the logo's blue — primary |
| `--violet` | `#7c3aed` | the logo's outer edge |
| `--teal` | `#0f766e` | **the third colour** |
| `--paper` | `#ffffff` | page base |
| `--paper-2` | `#f5f7fe` | cool lavender-white band |
| `--paper-3` | `#eef4fb` | cool sky-white band |
| `--ink` | `#0d1220` | the one dark band, and the footer |

**How the three get distributed.** Every section declares its own `--accent`, and all
the small details — kickers, tick marks, hover borders, links, focus rings — read from
that one variable. Change a section's accent and the whole section re-tints.

```
#services    blue      #process  blue      #faq      blue
#automation  violet    #team     violet    #contact  teal
#work        teal      #pricing  teal
```

Neighbouring sections never share an accent. Within a section it subdivides further —
the four service cards, six automation tiles, three pricing tiers and two people all
take their own colour. The service cards sit on a 2×2 grid, so the colours have to
differ both across *and* down.

All three appear together in a few deliberate places: the hero headline gradient, the
step numbers, the rule above the marquee, the top edge of the contact form — and the
arrow.

### Band rhythm

The page alternates white and tinted bands so it doesn't read as one flat sheet:

```
hero        white (soft tri-colour glow)
marquee     lavender strip
services    white
automation  lavender
work        white
process     sky-white, rounded slab   ← the arrow lives here
team        white
pricing     lavender
faq         white
contact     DARK — the one dark band, anchoring the call to action
footer      dark
```

The dark contact band works by re-declaring the theme tokens (`.band-dark`), so every
card, label and input inside it inverts automatically rather than needing its own rules.
Its accents switch to light variants — `#5eead4` teal, `#7ea8ff` blue — because the
dark-on-light values would be invisible there.

### Accessibility

Every text colour is checked at **≥4.5:1** (WCAG AA) against the lightest surface it
can appear on. Measured, not guessed:

| Token | Worst case (on `#eef4fb`) |
|---|---|
| `--text` `#1a2136` | 14.4:1 |
| `--muted` `#5a6178` | 5.6:1 |
| `--violet` `#7c3aed` | 5.2:1 |
| `--teal` `#0f766e` | 4.9:1 |
| `--dim` `#626980` | 4.9:1 |
| `--blue` `#2563eb` | 4.7:1 |

On the dark band: teal 12.6:1, violet 8.1:1, blue 7.9:1.

If you change any of these, re-check the ratio. Two earlier picks (`#0d9488` teal and
`#858ca3` dim) both failed and had to be darkened — a colour that *looks* fine on white
often isn't.

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

- [ ] **SMTP credentials.** Follow the App Password steps above, or the form sends nothing.
- [ ] **Public email address.** `hello@freshframe.in` in `site.js` is invented. Either
      register it or put a real Gmail there. (This is the address shown on the page —
      separate from where submissions are delivered, which is already correct.)
- [ ] **WhatsApp number.** `contact.whatsapp` and `contact.whatsappDisplay` in `site.js`
      are both `00000 00000`.
- [ ] **Read the two project descriptions** and correct anything wrong.

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
- [ ] **Open Graph tags** in `client/index.html`, so the link previews properly on
      WhatsApp and LinkedIn. Worth doing before you send it to clients.
- [ ] **Delete the duplicate `logo.png`** in the project root — the one the site uses is
      `client/public/assets/logo.png`.
- [ ] **Set `CORS_ORIGIN`** in `server/.env` to your real domain once deployed.
- [ ] Real device testing on one Android and one iPhone.

### Deliberately not built

- **Testimonials.** Add the section once you have two real quotes from the two clients.
  An invented or empty one costs more trust than it buys.

### Deployment

Configured for Vercel — `vercel.json` sets the build, and `api/` holds the serverless
contact endpoint. Step-by-step instructions, including the environment variables, are in
**[DEPLOY.md](DEPLOY.md)**.

If you ever move off Vercel, `server/index.js` is a normal Express app that serves both
the built client and the API on one port (`npm run build && npm start`) — that works on
Render, Railway, or any plain Node host.
