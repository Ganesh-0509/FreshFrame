/* ══════════════════════════════════════════════════════════
   ALL SITE CONTENT LIVES HERE.

   Edit this file to change any text, price, link or list item on
   the site. You should not need to open a component to change
   wording. Images live in public/assets/.
   ══════════════════════════════════════════════════════════ */

export const contact = {
  // Shown on the page and used as the mailto: target — the contact form
  // opens the visitor's own email client addressed here, so this is the
  // one place that decides where enquiries land.
  name: 'Fresh Frame',
  email: 'freshframestud@gmail.com',
  whatsapp: '917825083996',                // wa.me format: 91 + 10 digits, no spaces
  whatsappDisplay: '+91 78250 83996',      // what's shown to the visitor
  location: 'Chennai, India · working remotely',
}

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Automation', href: '#automation' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#team' },
  { label: 'Pricing', href: '#pricing' },
]

export const hero = {
  kicker: '</> We build. You grow.',
  // The h1 is written inline in components/Hero.jsx — the word "before"
  // carries the tri-colour gradient, which needs its own element.
  lede:
    "Fresh Frame is a two-person studio — one developer, one product lead. " +
    "We build websites, brand them, and automate the repetitive work behind them. " +
    "Tell us your idea and we'll build you a real, working mock first. " +
    'Not a PDF, not a template preview. You decide after you’ve seen it.',
  points: ['Free mock, no advance', 'You talk straight to the makers', 'Support after launch'],
}

export const marquee = [
  'Mock first, always',
  'Direct to the founders',
  'Zero advance',
  'Built, not templated',
  'Automation for any business',
  'Post-launch support',
]

export const services = [
  {
    num: '01',
    title: 'Websites',
    blurb: 'The main thing. Fast, responsive, and written by hand — so it stays yours.',
    items: ['Landing pages', 'Business & portfolio sites', 'E-commerce stores', 'Custom web apps'],
  },
  {
    num: '02',
    title: 'Automation',
    blurb:
      'Custom-built for how your business actually works. Not an off-the-shelf tool you have to bend around.',
    items: ['Order & enquiry handling', 'Invoices, quotes & reports', 'Follow-ups & reminders', 'Any repetitive task, really'],
    link: { label: 'See what we can automate ↓', href: '#automation' },
  },
  {
    num: '03',
    title: 'Branding',
    blurb: 'A site is only half of it. We make sure the rest of you looks the part too.',
    items: ['Logo & visual identity', 'Brand kit & guidelines', 'Social media templates', 'Website copywriting'],
  },
  {
    num: '04',
    title: 'Digital Solutions',
    blurb: 'The unglamorous work that decides whether anyone actually finds you.',
    items: ['SEO setup & search listing', 'Analytics & tracking', 'Domain, hosting & email', 'Maintenance & updates'],
  },
]

/* icon keys map to the inline SVGs in components/Automation.jsx */
export const automation = {
  title: ['If you do it twice a day,', "it shouldn't need a person."],
  lede:
    "Every business has a job someone does by hand because that's just how it's always been done. " +
    'Copying orders into a sheet. Typing the same invoice. Chasing the same follow-up. ' +
    'We find those, and we build something that does them for you.',
  ledeStrong: 'Built around your business, whatever it is.',
  tiles: [
    {
      icon: 'chat',
      title: 'Orders & enquiries',
      body: "A WhatsApp or web enquiry lands and it's logged, numbered and in front of you — without anyone retyping it.",
    },
    {
      icon: 'doc',
      title: 'Invoices & quotes',
      body: 'Pick the items, the document writes itself with the right rates, tax and numbering. Sent as a PDF in seconds.',
    },
    {
      icon: 'funnel',
      title: "Leads that don't get lost",
      body: 'Every enquiry from every channel lands in one list, tagged and assigned, so nobody falls through the gap.',
    },
    {
      icon: 'chart',
      title: 'Daily reports',
      body: "Yesterday's numbers in your inbox every morning, already totalled. No opening five tabs to find out how you did.",
    },
    {
      icon: 'bell',
      title: 'Stock & deadline alerts',
      body: "You get told when something's running low or a date is coming up — before it becomes the problem.",
    },
    {
      icon: 'clock',
      title: 'Reminders & follow-ups',
      body: 'Appointment confirmations, payment nudges, review requests — sent on time, every time, without you remembering.',
    },
  ],
  note: "Not sure if your thing can be automated? Tell us what it is — we'll say so straight if it can't.",
  cta: "Tell us what you'd automate",
}

export const work = [
  {
    index: 'Project 01 — Retail',
    name: 'Standard Fireworks, Sivakasi',
    url: 'https://standardfireworkssivakasi.com/',
    shot: '/assets/project-1.webp',
    alt: 'Standard Fireworks Sivakasi homepage',
    desc:
      'A wholesale and retail cracker business selling direct from Sivakasi to Chennai and across ' +
      'South India. They needed a real storefront for the Deepavali season: a browsable product ' +
      'catalogue, the full price list, and volume discounts that climb as the order grows. Orders ' +
      'come straight through to them.',
    meta: [
      ['Scope', 'Website · Branding · Digital Solutions'],
      ['Features', 'Product catalogue · Price list · Tiered discounts · Enquiry flow'],
      ['Live at', 'standardfireworkssivakasi.com'],
    ],
  },
  {
    index: 'Project 02 — Food & Beverage',
    name: 'Cafe by Cassette',
    url: 'https://cafe-by-cassette.netlify.app/',
    shot: '/assets/project-2.webp',
    alt: 'Cafe by Cassette homepage',
    desc:
      'A cassette-themed music café in Kattupakkam, Chennai. The brief was atmosphere first — the ' +
      'site had to feel like walking into the room. Story, bestsellers and the full menu, with ' +
      'table reservations going straight to WhatsApp instead of a form nobody checks.',
    meta: [
      ['Scope', 'Website · Branding'],
      ['Features', 'Menu · Bestsellers · WhatsApp reservations · Google reviews'],
      ['Live at', 'cafe-by-cassette.netlify.app'],
    ],
  },
]

/* ─────────────────────────────────────────────────────────
   TWO PROCESS PATHS.
   Websites get a free mock built up front. Products and
   automations get a call to work out the features first,
   because you can't mock a workflow you haven't scoped.
   The flight arrow flies whichever path is on screen.
   ───────────────────────────────────────────────────────── */
export const processPaths = [
  {
    id: 'website',
    tab: 'I want a website',
    blurb: 'You see a real page before you decide anything. Nothing is owed until step three.',
    steps: [
      {
        num: '01',
        title: 'Talk, don’t brief',
        body: 'A call or a WhatsApp message. Twenty minutes is usually enough for us to understand what you’re trying to do.',
      },
      {
        num: '02',
        title: 'We build it. Free.',
        body: 'A real page you can open and click through — not a picture of one. Free, and yours to look at for as long as you need.',
      },
      {
        num: '03',
        title: 'Walk away, or don’t',
        body: 'Like it? We keep going. Don’t? You walk away owing us nothing. This is the whole reason we work this way.',
      },
      {
        num: '04',
        title: 'The real thing',
        body: 'Ganesh writes the real thing. Vinothini keeps you updated so you’re never wondering what’s happening.',
      },
      {
        num: '05',
        title: 'Live, and looked after',
        body: 'Domain, hosting, handover, and the training to run it yourself. Then we stay reachable — we don’t disappear.',
      },
    ],
  },
  {
    id: 'product',
    tab: 'I want a product built',
    blurb:
      'Automations and custom products start with a conversation instead of a mock — a workflow has to be understood before it can be built.',
    steps: [
      {
        num: '01',
        title: 'Name the bottleneck',
        body: 'The task you keep repeating, the thing that breaks every month. You don’t need to know what the solution looks like.',
      },
      {
        num: '02',
        title: 'We take it apart',
        body: 'A proper conversation about what it must do, what it shouldn’t, and where it has to fit with what you already use.',
      },
      {
        num: '03',
        title: 'Price in writing, first',
        body: 'You get the feature list and the number in writing before anything is built. If it isn’t worth automating, we’ll tell you that instead.',
      },
      {
        num: '04',
        title: 'You break it early',
        body: 'You run it on real work while we’re still building, so problems surface early rather than after handover.',
      },
      {
        num: '05',
        title: 'Yours to run',
        body: 'It runs itself. You get the walkthrough and the logins, and we stay on hand when something needs changing.',
      },
    ],
  },
]

/* `style` picks the treatment in components/Team.jsx:
     'mono'  — high-contrast black and white, editorial. Professional.
     'plum'  — warm maroon end, script accent. Classic.
   Both share ONE horizontal poster, one at each outer corner.
   Bios are two sentences each, on purpose — a poster is not a CV. */
export const team = [
  {
    style: 'mono',
    name: 'Ganesh Kumar',
    role: 'Full-Stack Developer · ML',
    tagline: 'If it runs, he wrote it',
    facts: ['Front to back, no handover', 'Trains and ships ML models'],
    /* Alpha cutout, cropped to the subject — the Team section stands
       these ON the sheet rather than inside a plate, so a matted
       background would show as a white box. */
    photo: '/assets/ganesh-cut.webp',
    /* Two sentences. The first says what he does, the second says the
       thing nobody else in the room can do. Nothing else earns its
       place on a poster. */
    bio:
      'Builds the whole thing — what you see and everything underneath that makes it work. ' +
      'He also trains the models behind the smarter automations.',
    portfolio: 'https://ganesh-0509.github.io/',
  },
  {
    style: 'plum',
    name: 'Vinothini',
    role: 'Frontend Developer · Product',
    tagline: 'Knows what you meant, not just what you said',
    facts: ['Scopes it before a line is written', 'Builds the front end you touch'],
    photo: '/assets/vino-cut.webp',
    bio:
      'Works out what you actually need, then builds the front end of it herself. ' +
      'The person who took your brief is the one shaping your screens.',
    portfolio: 'https://vinothini-port.vercel.app/',
  },
]

/* ─────────────────────────────────────────────────────────
   PRICING — bands, not fixed numbers, because scope varies.
   ───────────────────────────────────────────────────────── */
export const pricing = {
  tiers: [
    {
      name: 'Basic',
      for: 'For a first web presence',
      price: '3,000–6,000',
      items: [
        'One well-built page',
        'Mobile responsive',
        'WhatsApp & call buttons',
        'Photo gallery',
        'Basic SEO setup',
      ],
      cta: 'Start with a free mock',
      featured: false,
    },
    {
      name: 'Standard',
      for: 'For a growing business',
      price: '8,000–15,000',
      items: [
        '3–5 pages',
        'Full gallery & content',
        'Google Maps & reviews',
        'Contact form & enquiries',
        'Basic SEO setup',
        '2 rounds of revisions',
      ],
      cta: 'Start with a free mock',
      featured: true,
      badge: 'Most chosen',
    },
    {
      name: 'Premium',
      for: 'For established businesses',
      price: '15,000–30,000',
      items: [
        'Everything in Standard',
        'Online ordering / booking',
        'Your own domain, set up',
        'Branding & brand kit',
        'Analytics & search listing',
        '30 days support after launch',
      ],
      cta: 'Start with a free mock',
      featured: false,
    },
  ],
  carePlan: {
    label: 'Optional add-on · attach to any package',
    name: 'Care plan',
    price: '500–1,500',
    unit: '/ month',
    body: 'Ongoing maintenance — hosting, content changes, edits and support whenever you need. Cancel anytime.',
  },
  note:
    "Automation pricing isn't a fixed rate card — every business's workflow is different, so we scope it " +
    'honestly on a call before any number gets attached. As a reference point: our most recent build — a ' +
    'full ordering platform with a 252-product catalogue, tiered volume discounts, delivery-zone logic, and ' +
    'a complete self-serve admin panel — came to ₹15,000–30,000 for the build, with ongoing care from ' +
    '₹1,500/month. Simpler automations (a single workflow, a form-to-WhatsApp pipeline) run well under that.',
}

export const faq = [
  {
    q: 'Is the mock really free?',
    a: "Yes, for websites. We build you a working page based on your brief and send you the link. If you don't want to go ahead after seeing it, that's the end of it — no invoice, no obligation. It's how we'd want to be sold to.",
  },
  {
    q: 'How long does the mock take?',
    a: 'Usually 2–3 days from the time we’ve understood your brief. The full build depends on scope — a single-page site is about a week, a larger site two to three.',
  },
  {
    q: "What if I don't like the mock?",
    a: "Tell us why and we'll do one more pass, or you walk away. We'd rather find out we're not a fit at this stage than three weeks in.",
  },
  {
    q: 'Do automations get a free mock too?',
    a: "No, and here's why: a workflow isn't something you can look at in a browser and judge in five minutes. So automations start with a call instead. We work through the features with you, then give you the scope and the price in writing before anything gets built. You still commit nothing until you've seen that.",
  },
  {
    q: 'What kind of automation can you actually build?',
    a: "If a person is doing it repeatedly on a computer or a phone, it can usually be automated — order and enquiry handling, invoices and quotes, daily reports, stock alerts, reminders and follow-ups. We don't resell a tool; we build it around how your business already works.",
  },
  {
    q: 'Do I need a website to get an automation built?',
    a: 'No. The two are separate. Plenty of businesses have a workflow worth fixing and no website at all — we’re happy to do just the automation.',
  },
  {
    q: 'Do I need to buy the domain and hosting myself?',
    a: 'You can, and we’ll help you pick. Or we’ll set it all up and hand you the logins. Either way the accounts are in your name — you own everything.',
  },
  {
    q: 'Can I update the site myself afterwards?',
    a: 'Yes. We hand over a short walkthrough of how to change text, images and prices. Anything bigger, message us — or take the Care plan and we handle it.',
  },
]

export const contactSection = {
  title: ['Tell us the idea.', "We'll show you what it looks like."],
  lede: 'Fill this in, or just message us on WhatsApp — whichever is easier. We reply the same day.',
  needs: [
    'A new website',
    'Redesign of an existing site',
    'An automation for my business',
    'A custom product built',
    'Branding / logo',
    'E-commerce store',
    'Something else',
  ],
}
