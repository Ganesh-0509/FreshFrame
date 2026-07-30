import { useState } from 'react'
import { contact, contactSection } from '../data/site.js'

const EMPTY = {
  name: '',
  contact: '',
  business: '',
  need: contactSection.needs[0],
  message: '',
  _gotcha: '', // honeypot
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

    setSending(true)
    setStatus({ text: 'Sending…', kind: '' })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) throw new Error(data.error || 'Request failed')

      setStatus({ text: "Got it — we'll reply today with next steps.", kind: 'ok' })
      setForm(EMPTY)
    } catch (err) {
      setStatus({
        text: 'Could not send that. Message us on WhatsApp instead?',
        kind: 'err',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section band-dark contact" id="contact">
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <p className="kicker">// 08 — Start here</p>
          <h2 className="section-title">
            {contactSection.title[0]}
            <br />
            {contactSection.title[1]}
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

          {/* honeypot — hidden from people, catches naive bots */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="cf-gotcha">Leave this empty</label>
            <input id="cf-gotcha" tabIndex={-1} value={form._gotcha} onChange={set('_gotcha')} />
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
