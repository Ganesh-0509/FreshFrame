/* Vercel serverless function — POST /api/contact
   Vercel has no long-lived processes, so the Express server in
   server/ never runs in production. This is the production
   endpoint. Both share api/_lib/mail.js. */

import { validate, rateLimited, deliver } from './_lib/mail.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  // Vercel parses JSON bodies automatically, but be defensive in
  // case a client sends a raw string.
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON.' })
    }
  }

  const bad = validate(body)
  if (bad?.drop) return res.status(200).json({ ok: true }) // honeypot
  if (bad) return res.status(bad.status).json({ error: bad.error })

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many submissions. Try again in a little while.' })
  }

  try {
    const { delivered } = await deliver(body)
    return res.status(200).json({ ok: true, delivered })
  } catch (err) {
    console.error('sendMail failed:', err?.message)
    return res.status(502).json({ error: 'Could not send the email.' })
  }
}
