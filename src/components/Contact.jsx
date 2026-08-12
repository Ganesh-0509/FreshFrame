import { useState } from 'react'
import { contact, contactSection } from '../data/site.js'
import PhoneDrop from './PhoneDrop.jsx'

/* ══════════════════════════════════════════════════════════
   No backend, no third-party form service — the form just builds a
   mailto: link and hands it to the visitor's own email client,
   addressed to contact.email. It leaves the browser exactly like
   clicking the "Email" link in the sidebar; nothing is transmitted to
   or stored by Fresh Frame or anyone else in between.
   ══════════════════════════════════════════════════════════ */

const EMPTY = {
  name: '',
  contact: '',
  business: '',
  need: contactSection.needs[0],
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [invalid, setInvalid] = useState({})
  const [status, setStatus] = useState({ text: '', kind: '' })

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setInvalid((v) => ({ ...v, [key]: false }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const missing = {}
    if (!form.name.trim()) missing.name = true
    if (!form.contact.trim()) missing.contact = true

    if (Object.keys(missing).length) {
      setInvalid(missing)
      setStatus({ text: 'Please fill in your name and how we can reach you.', kind: 'err' })
      return
    }

    const subject = `New enquiry: ${form.name.trim()}${
      form.business.trim() ? ` — ${form.business.trim()}` : ''
    }`
    const body = [
      `Name: ${form.name.trim()}`,
      `Contact: ${form.contact.trim()}`,
      `Business: ${form.business.trim() || '—'}`,
      `Needs: ${form.need}`,
      '',
      form.message.trim() || '(No message)',
    ].join('\n')

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setStatus({
      text: `Opening your email app, addressed to ${contact.name}. If nothing happened, WhatsApp us on ${contact.whatsappDisplay} instead.`,
      kind: 'ok',
    })
  }

  return (
    <section className="section band-dark contact" id="contact">
      <div className="wrap contact-grid">
        {/* Its own column on the left, per the reference — not floated
            over the content, where it was getting clipped. */}
        <PhoneDrop />

        <div className="contact-copy">
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
              <a href={`mailto:${contact.email}`}>
                {contact.name} — {contact.email}
              </a>
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

          <button type="submit" className="btn btn-primary btn-block">
            Send & get my free mock
          </button>

          <p className={`form-note ${status.kind}`} role="status">
            {status.text}
          </p>
        </form>
      </div>
    </section>
  )
}
