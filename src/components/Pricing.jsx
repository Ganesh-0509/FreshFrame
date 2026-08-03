import { pricing } from '../data/site.js'
import Reveal from './Reveal.jsx'

export default function Pricing() {
  const { tiers, carePlan, note } = pricing

  return (
    <section className="section band-tint" id="pricing">
      <div className="wrap">
        <h2 className="section-title">
          Told upfront.
          <br />
          No "contact us for a quote."
        </h2>
        <p className="section-lede">
          Ranges, not fixed numbers — where you land depends on how much you need. Every website
          package starts with the free mock, so you only pay once you've seen what you're buying.
        </p>

        <div className="cards-3 pricing-grid">
          {tiers.map((tier) => (
            <Reveal
              as="article"
              className={`card price-card ${tier.featured ? 'featured' : ''}`}
              key={tier.name}
            >
              {tier.badge && <div className="price-badge">{tier.badge}</div>}
              <h3>{tier.name}</h3>
              <p className="price-for">{tier.for}</p>
              <p className="price">
                <span className="cur">₹</span>
                {tier.price}
              </p>
              <ul className="ticks">
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`btn ${tier.featured ? 'btn-primary' : 'btn-ghost'} btn-block`}
              >
                {tier.cta}
              </a>
            </Reveal>
          ))}
        </div>

        <p className="care-label">+ {carePlan.label}</p>
        <Reveal className="care-plan">
          <div>
            <h3>{carePlan.name}</h3>
            <span className="care-tag">Monthly</span>
          </div>
          <p className="care-body">{carePlan.body}</p>
          <p className="care-price">
            <span className="cur">₹</span>
            {carePlan.price}
            <small>{carePlan.unit}</small>
          </p>
        </Reveal>

        <p className="pricing-note">{note}</p>
      </div>
    </section>
  )
}
