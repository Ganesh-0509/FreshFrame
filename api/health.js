/* Vercel serverless function — GET /api/health
   Quick way to confirm the SMTP env vars actually landed in the
   deployment. Reports whether they're set, never their values. */

import { smtpConfigured, RECIPIENTS } from './_lib/mail.js'

export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    smtp: smtpConfigured,
    recipients: RECIPIENTS.length,
  })
}
