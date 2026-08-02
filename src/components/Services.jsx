import { useEffect, useRef, useState } from 'react'
import { services } from '../data/site.js'

/* How long a panel holds before advancing on its own.
   Also hardcoded as the countdown duration in services.css — change
   both together or the bar lies about when the next switch lands. */
const DWELL = 5200

export default function Services() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const deckRef = useRef(null)

  const go = (i) => setActive((i + services.length) % services.length)

  /* Auto-advance, stopped by hover/focus so it never moves while being
     read, and disabled entirely under reduced motion — content that
     changes on its own is what that setting asks us to avoid. */
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((i) => (i + 1) % services.length), DWELL)
    return () => clearInterval(id)
  }, [paused, active])

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = (active + (e.key === 'ArrowRight' ? 1 : -1) + services.length) % services.length
    setActive(i)
    deckRef.current?.querySelectorAll('.sv-slide')[i]?.focus()
  }

  return (
    <section className="section" id="services">
      <div className="wrap">
        <p className="kicker">// 01 — What we do</p>
        <h2 className="section-title">
          Four things,
          <br />
          done properly.
        </h2>

        <div
          className="sv-deck"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* The sideways script label running up the left edge. */}
          <p className="sv-rail" aria-hidden="true">
            what we build
          </p>

          {/* Fanned panels. Collapsed ones show only their vertical tab;
              the open one expands to fill the rest of the row. */}
          <div className="sv-fan" role="tablist" ref={deckRef} onKeyDown={onKeyDown}>
            {services.map((s, i) => (
              <button
                key={s.num}
                role="tab"
                aria-selected={i === active}
                tabIndex={i === active ? 0 : -1}
                className={`sv-slide ${i === active ? 'is-open' : ''}`}
                style={{ '--i': i }}
                onClick={() => setActive(i)}
              >
                {/* The skew is on the panel, so everything inside is
                    counter-skewed to stand back up straight. */}
                <span className="sv-slide-inner">
                  <span className="sv-tab">
                    <span className="sv-tab-num">{s.num}</span>
                    <span className="sv-tab-name">{s.title}</span>
                  </span>

                  <span className="sv-open" aria-hidden={i !== active}>
                    <span className="sv-open-num">{s.num}</span>
                    <span className="sv-open-title">{s.title}</span>
                    <span className="sv-open-blurb">{s.blurb}</span>
                    <span className="sv-open-items">
                      {s.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </span>
                  </span>
                </span>

                {i === active && (
                  <span
                    className="sv-countdown"
                    key={`${s.num}-${paused}`}
                    data-running={paused ? 'false' : 'true'}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}

            <button className="sv-next" onClick={() => go(active + 1)} aria-label="Next service">
              &#8594;
            </button>
          </div>

          <div className="sv-dots" aria-hidden="true">
            {services.map((s, i) => (
              <span key={s.num} className={i === active ? 'is-on' : ''} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
