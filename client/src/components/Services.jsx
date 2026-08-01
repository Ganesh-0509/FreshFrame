import { useCallback, useEffect, useRef, useState } from 'react'
import { services } from '../data/site.js'

/* How long each service holds before advancing on its own. */
const DWELL = 5200

export default function Services() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const tabsRef = useRef(null)

  const go = useCallback((i) => setActive((i + services.length) % services.length), [])

  /* Auto-advance, like the reference stepping through dishes.
     Two things switch it off, both deliberate:
       - hover/focus, so it never moves while being read or clicked
       - prefers-reduced-motion, since content that changes on its own
         is exactly what that setting is asking us not to do */
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setActive((i) => (i + 1) % services.length), DWELL)
    return () => clearInterval(id)
  }, [paused, active])

  /* Arrow keys move between tabs, which is what the tablist role
     promises a screen-reader user. */
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = active + (e.key === 'ArrowRight' ? 1 : -1)
    const i = (next + services.length) % services.length
    setActive(i)
    tabsRef.current?.querySelectorAll('.sv-tab')[i]?.focus()
  }

  const current = services[active]

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
          className="sv-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* The oversized number sitting behind the panel. */}
          <span className="sv-ghost" aria-hidden="true">
            {current.num}
          </span>

          <div className="sv-panel">
            {/* key forces a remount so the enter animation replays on
                every change — without it React reuses the node and
                nothing moves. */}
            <div className="sv-content" key={current.num}>
              <p className="sv-index">
                <span>{current.num}</span> / {String(services.length).padStart(2, '0')}
              </p>

              <h3 className="sv-title">{current.title}</h3>
              <p className="sv-blurb">{current.blurb}</p>

              <ul className="sv-items">
                {current.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {current.link && (
                <a className="link-arrow" href={current.link.href}>
                  {current.link.label}
                </a>
              )}
            </div>

            <div className="sv-arrows">
              <button
                className="sv-arrow"
                onClick={() => go(active - 1)}
                aria-label="Previous service"
              >
                &#8592;
              </button>
              <button
                className="sv-arrow"
                onClick={() => go(active + 1)}
                aria-label="Next service"
              >
                &#8594;
              </button>
            </div>
          </div>

          <div className="sv-tabs" role="tablist" ref={tabsRef} onKeyDown={onKeyDown}>
            {services.map((s, i) => (
              <button
                key={s.num}
                role="tab"
                aria-selected={i === active}
                tabIndex={i === active ? 0 : -1}
                className={`sv-tab ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="sv-tab-num">{s.num}</span>
                <span className="sv-tab-name">{s.title}</span>

                {/* Fills over one dwell, so the bar doubles as a
                    countdown to the next change. Remounted by the key
                    so the fill restarts rather than continuing. */}
                <span
                  className="sv-tab-bar"
                  key={`${s.num}-${active}-${paused}`}
                  data-running={i === active && !paused ? 'true' : 'false'}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
