/* ══════════════════════════════════════════════════════════
   FRESH FRAME — self-hosted mail server  ⚠ NOT CURRENTLY IN USE

   The live site is a static build on GitHub Pages, and Pages cannot
   run Node. The contact form therefore posts directly to Web3Forms
   (see client/src/components/Contact.jsx) and nothing here runs.

   This is kept as a working escape hatch. It's a complete Express app
   that serves BOTH the built client and the mail API on one port, so
   if you ever outgrow Web3Forms — you want the enquiry to hit both
   inboxes without paying for PRO, or you want to store submissions —
   you can deploy this to Render or Railway unchanged:

       npm --prefix client run build && npm start

   Then point the form back at POST /api/contact and set CORS_ORIGIN
   to the site's domain.

   Needs server/.env — copy .env.example and fill it in.
   ══════════════════════════════════════════════════════════ */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  validate,
  rateLimited,
  deliver,
  smtpConfigured,
  RECIPIENTS,
} from './lib/mail.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 5000

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '32kb' }))
app.use(cors({ origin: process.env.CORS_ORIGIN || true }))

if (!smtpConfigured) {
  console.warn(
    '\n  ⚠  SMTP_USER / SMTP_PASS are not set, so no email will actually be sent.\n' +
      '     Submissions will be logged to this console instead.\n' +
      '     Copy server/.env.example to server/.env and fill it in.\n'
  )
}

app.post('/api/contact', async (req, res) => {
  const bad = validate(req.body)
  if (bad?.drop) return res.json({ ok: true }) // honeypot
  if (bad) return res.status(bad.status).json({ error: bad.error })

  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many submissions. Try again in a little while.' })
  }

  try {
    const { delivered } = await deliver(req.body)

    /* Same rule as the serverless handler: a submission that wasn't
       emailed is a failure, not a success. The body was logged above so
       it isn't lost locally, but the form must not claim it was sent. */
    if (!delivered) {
      console.error('  ⚠  Not delivered — set SMTP_PASS in server/.env. Logged above instead.')
      return res.status(503).json({ error: 'Email is not configured on the server.' })
    }

    res.json({ ok: true, delivered })
  } catch (err) {
    console.error('sendMail failed:', err.message)
    res.status(502).json({ error: 'Could not send the email.' })
  }
})

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, smtp: smtpConfigured, recipients: RECIPIENTS.length })
)

/* serve the built React app, so `npm start` works as a single host too */
const dist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(dist))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(dist, 'index.html'), (err) => (err ? next() : undefined))
})

app.listen(PORT, () => {
  console.log(`  Fresh Frame dev server on http://localhost:${PORT}`)
  console.log(`  Enquiries go to: ${RECIPIENTS.join(', ')}`)
})
