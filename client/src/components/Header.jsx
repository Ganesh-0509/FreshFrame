import { useEffect, useState } from 'react'
import { nav } from '../data/site.js'
import { asset } from '../lib/asset.js'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap header-inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          {/* above the fold — deliberately NOT lazy-loaded */}
          <img src={asset('assets/logo.png')} alt="Fresh Frame logo" className="brand-mark" />
          <span className="brand-text">
            FRESH<span className="brand-accent">FRAME</span>
          </span>
        </a>

        <nav className={`nav ${open ? 'open' : ''}`}>
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn btn-primary btn-sm header-cta">
          Get a free mock
        </a>

        <button
          className={`nav-toggle ${open ? 'open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
