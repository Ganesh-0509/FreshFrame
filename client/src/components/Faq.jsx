import { useState } from 'react'
import { faq } from '../data/site.js'

export default function Faq() {
  // accordion — one answer open at a time
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="section" id="faq">
      <div className="wrap wrap-narrow">
        <p className="kicker">// 07 — Questions</p>
        <h2 className="section-title">
          The things
          <br />
          everyone asks.
        </h2>

        <div className="faq">
          {faq.map((item, i) => (
            <details
              className="faq-item"
              key={item.q}
              open={openIndex === i}
              onToggle={(e) => {
                if (e.currentTarget.open) setOpenIndex(i)
                else if (openIndex === i) setOpenIndex(null)
              }}
            >
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
