/* ══════════════════════════════════════════════════════════
   MAIL LOGIC — validation, rate limiting, and the email itself.

   Used only by server/index.js, which is NOT part of the live site.
   See the note at the top of that file: the GitHub Pages build posts
   to Web3Forms instead, because Pages can't run Node.
   ══════════════════════════════════════════════════════════ */

import nodemailer from 'nodemailer'

/* Comma-separated. Defaults to Ganesh only, matching the live site —
   the Web3Forms key there is registered to that inbox. */
export const RECIPIENTS = (process.env.MAIL_TO || 'ganesh957kumar@gmail.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const smtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)

let cached = null

/* Cached so we don't re-handshake SMTP on every submission. */
export function getTransporter() {
  if (!smtpConfigured) return null
  if (cached) return cached
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return cached
}

const esc = (s = '') =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  )

const looksLikeEmail = (s = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s).trim())

/* ── validation ──
   Returns null when fine, or { status, error } when not.
   `drop: true` means a bot tripped the honeypot: respond 200 so
   it thinks it succeeded, but send nothing. */
export function validate(body = {}) {
  const { name = '', contact = '', message = '', _gotcha = '' } = body

  if (String(_gotcha).trim()) return { drop: true }

  if (!String(name).trim() || !String(contact).trim()) {
    return { status: 400, error: 'Name and contact are required.' }
  }
  if (String(name).length > 200 || String(message).length > 5000) {
    return { status: 400, error: 'That is longer than we can accept.' }
  }
  return null
}

/* ── rate limiting ──
   In-memory, so it resets on restart and doesn't span multiple
   instances. Best-effort by design: the honeypot does the real work. */
const WINDOW_MS = 15 * 60 * 1000
const MAX_HITS = 5
const hits = new Map()

export function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // crude ceiling, never unbounded
  return false
}

/* ── the email itself ── */
export function buildMail(body = {}) {
  const { name = '', contact = '', business = '', need = '', message = '' } = body

  const rows = [
    ['Name', name],
    ['Contact', contact],
    ['Business', business || '—'],
    ['Needs', need || '—'],
  ]

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nMessage:\n${message || '—'}\n\n---\nSent from the Fresh Frame contact form.`

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#1a2136">
      <h2 style="margin:0 0 4px;font-size:19px">New enquiry — Fresh Frame</h2>
      <p style="margin:0 0 18px;color:#5a6178;font-size:13px">via the website contact form</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="padding:9px 14px 9px 0;border-bottom:1px solid #e6e9f2;color:#626980;
                         font-size:12px;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;
                         vertical-align:top">${esc(k)}</td>
              <td style="padding:9px 0;border-bottom:1px solid #e6e9f2;font-weight:600">${esc(v)}</td>
            </tr>`
          )
          .join('')}
      </table>
      <p style="margin:20px 0 6px;color:#626980;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Message</p>
      <div style="white-space:pre-wrap;background:#f5f7fe;border:1px solid #e6e9f2;border-radius:10px;padding:14px 16px">${
        esc(message) || '—'
      }</div>
    </div>`

  return {
    from: `"Fresh Frame Website" <${process.env.SMTP_USER}>`,
    to: RECIPIENTS,
    subject: `New enquiry: ${String(name).trim()}${business ? ` — ${String(business).trim()}` : ''}`,
    // so hitting Reply goes to the client, not to ourselves
    replyTo: looksLikeEmail(contact) ? String(contact).trim() : undefined,
    text,
    html,
  }
}

/* Sends, or logs to the console when SMTP isn't configured so a
   submission is never silently lost in development. */
export async function deliver(body) {
  const mail = buildMail(body)
  const transporter = getTransporter()

  if (!transporter) {
    console.log('\n──── contact form (not emailed, SMTP unset) ────\n' + mail.text + '\n')
    return { delivered: false }
  }

  await transporter.sendMail(mail)
  return { delivered: true }
}
