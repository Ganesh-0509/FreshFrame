import { useState } from 'react'
import { contact, contactSection } from '../data/site.js'
import PhoneDrop from './PhoneDrop.jsx'

/* ══════════════════════════════════════════════════════════
   The form posts to Web3Forms, not to our own server.

   GitHub Pages serves static files only — it cannot run Node, so the
   old POST /api/contact would just hit the 404 page. Web3Forms takes
   the submission and emails it on, which needs no backend at all.

   The access key is PUBLIC by design — it's write-only (it can submit
   to your form, nothing else) and is visible in the page source of
   every Web3Forms site. It's in an env var so it isn't committed, not
   because exposing it is dangerous.

   Set VITE_WEB3FORMS_KEY at BUILD time. Vite inlines VITE_* vars into
   the bundle, so it must be present when `vite build` runs — see the
   GitHub Actions workflow.
   ══════════════════════════════════════════════════════════ */
const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const looksLikeEmail = (s = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s).trim())

/* Shown on every failure path. Names the real channels from site.js so a
   visitor who can't submit still leaves with a way to reach us. */
const FALLBACK = `Could not send that — WhatsApp us on ${contact.whatsappDisplay} or email ${contact.email}.`

const EMPTY = {
  name: '',
  contact: '',
  business: '',
  need: contactSection.needs[0],
  message: '',
  botcheck: '', // Web3Forms' own honeypot field name
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [invalid, setInvalid] = useState({})
  const [status, setStatus] = useState({ text: '', kind: '' })
  const [sending, setSending] = useState(false)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setInvalid((v) => ({ ...v, [key]: false }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const missing = {}
    if (!form.name.trim()) missing.name = true
    if (!form.contact.trim()) missing.contact = true

    if (Object.keys(missing).length) {
      setInvalid(missing)
      setStatus({ text: 'Please fill in your name and how we can reach you.', kind: 'err' })
      return
    }

    /* No key means no email can possibly be sent. Fail loudly rather than
       showing a success message for a submission that goes nowhere. */
    if (!ACCESS_KEY) {
      console.error(
        'VITE_WEB3FORMS_KEY is not set, so the contact form cannot send. ' +
          'Add it to client/.env for local dev, or as a repo secret for the Pages build.'
      )
      setStatus({ text: FALLBACK, kind: 'err' })
      return
    }

    setSending(true)
    setStatus({ text: 'Sending…', kind: '' })

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New enquiry: ${form.name.trim()}${
            form.business.trim() ? ` — ${form.business.trim()}` : ''
          }`,
          from_name: 'Fresh Frame website',
          /* Only set reply-to when they gave an actual email. The contact
             field also accepts a WhatsApp number, which would make the
             reply-to header invalid and can get the mail rejected. */
          ...(looksLikeEmail(form.contact) ? { replyto: form.contact.trim() } : {}),

          // Everything below is forwarded into the email body as-is.
          Name: form.name.trim(),
          Contact: form.contact.trim(),
          Business: form.business.trim() || '—',
          Needs: form.need,
          Message: form.message.trim() || '—',

          /* Only send botcheck when it's actually filled. An unchecked HTML
             checkbox is absent from the payload entirely, so mirroring that
             avoids any risk of an empty string being read as "checked" —
             Web3Forms rejects a tripped honeypot with a 400. */
          ...(form.botcheck ? { botcheck: true } : {}),
        }),
      })

      const data = await res.json().catch(() => ({}))

      /* Web3Forms signals failure in the BODY as success:false, and can
         still return a non-2xx (400 bad key, 429 rate limited). Check both,
         so we never report a send that didn't happen. */
      if (!res.ok || data.success !== true) {
        throw new Error(data.message || data?.body?.message || `HTTP ${res.status}`)
      }

      setStatus({ text: "Got it — we'll reply today with next steps.", kind: 'ok' })
      setForm(EMPTY)
    } catch (err) {
      console.error('Contact form submit failed:', err?.message)
      setStatus({ text: FALLBACK, kind: 'err' })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section band-dark contact" id="contact">
      <div className="wrap contact-grid">
        {/* Its own column on the left, per the reference — not floated
            over the content, where it was getting clipped. */}
        <PhoneDrop />

        <div className="contact-copy">
          <p className="kicker">// 08 — Start here</p>

          {/* "ARE YOU / ready" from the reference: heavy display caps
              with the last word in the handwritten face. */}
          <h2 className="contact-ask">
            <span className="contact-ask-caps">Are you</span>
            <span className="contact-ask-script">ready</span>
          </h2>

          <p className="section-lede">{contactSection.lede}</p>

          <ul className="contact-list">
            <li>
              <span>Email</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <span>WhatsApp</span>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <span>Based in</span>
              {contact.location}
            </li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="cf-name">Your name</label>
            <input
              id="cf-name"
              className={invalid.name ? 'invalid' : ''}
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Your name"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-contact">Email or WhatsApp number</label>
            <input
              id="cf-contact"
              className={invalid.contact ? 'invalid' : ''}
              type="text"
              value={form.contact}
              onChange={set('contact')}
              placeholder="you@business.com"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-business">Business / project name</label>
            <input
              id="cf-business"
              type="text"
              value={form.business}
              onChange={set('business')}
              placeholder="Optional"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-need">What do you need?</label>
            <select id="cf-need" value={form.need} onChange={set('need')}>
              {contactSection.needs.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="cf-msg">Tell us a bit about it</label>
            <textarea
              id="cf-msg"
              rows="4"
              value={form.message}
              onChange={set('message')}
              placeholder="What the business does, and what you want built or automated."
            />
          </div>

          {/* honeypot — hidden from people, catches naive bots.
              Must be named "botcheck": Web3Forms rejects the submission
              server-side when it arrives filled in. */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="cf-botcheck">Leave this empty</label>
            <input id="cf-botcheck" name="botcheck" tabIndex={-1} value={form.botcheck} onChange={set('botcheck')} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
            {sending ? 'Sending…' : 'Send & get my free mock'}
          </button>

          <p className={`form-note ${status.kind}`} role="status">
            {status.text}
          </p>
        </form>
      </div>
    </section>
  )
}
