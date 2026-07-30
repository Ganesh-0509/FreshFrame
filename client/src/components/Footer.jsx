import { nav } from '../data/site.js'

const footerNav = [...nav, { label: 'FAQ', href: '#faq' }, { label: 'Contact', href: '#contact' }]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <img src="/assets/logo.png" alt="Fresh Frame logo" className="brand-mark" />
          <div>
            <p className="footer-name">
              FRESH<span className="brand-accent">FRAME</span>
            </p>
            <p className="footer-tag">We build. You grow.</p>
          </div>
        </div>

        <nav className="footer-nav">
          {footerNav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <p className="footer-copy">
          © {new Date().getFullYear()} Fresh Frame. Built by hand, by us.
        </p>
      </div>
    </footer>
  )
}
