/* ══════════════════════════════════════════════════════════
   FRESH FRAME — local development mail server

   In PRODUCTION on Vercel this file does not run. Vercel has no
   long-lived processes, so api/contact.js handles it there.

   This exists so `npm run dev` works without the Vercel CLI, and
   so the project can also be hosted on Render/Railway if you ever
   move off Vercel. Both paths share api/_lib/mail.js.

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
} from '../api/_lib/mail.js'

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
