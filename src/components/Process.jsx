import { useRef, useState } from 'react'
import { processPaths } from '../data/site.js'
import { useFlightArrow } from '../hooks/useFlightArrow.js'

export default function Process() {
  const [pathId, setPathId] = useState(processPaths[0].id)
  const trackRef = useRef(null)
  const arrowRef = useRef(null)

  const active = processPaths.find((p) => p.id === pathId) ?? processPaths[0]

  // rebuild the flight path whenever the visible steps change
  useFlightArrow(trackRef, arrowRef, [pathId])

  return (
    <section className="section band-sky process" id="process">
      <div className="wrap">
        <h2 className="section-title">
          Two ways in.
          <br />
          Neither one starts with an invoice.
        </h2>

        <div className="path-tabs" role="tablist" aria-label="Choose a process path">
          {processPaths.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={p.id === pathId}
              className={`path-tab ${p.id === pathId ? 'active' : ''}`}
              onClick={() => setPathId(p.id)}
            >
              {p.tab}
            </button>
          ))}
        </div>
        <p className="path-blurb">{active.blurb}</p>

        <div className="process-track" ref={trackRef}>
          {/* the arrow that flies the path (points right at rest) */}
          <div className="flight-arrow" ref={arrowRef} aria-hidden="true">
            <svg viewBox="0 0 100 100" className="flight-arrow-svg">
              <defs>
                {/* Tail -> nose, deep to bright, so the nose leads the eye.
                    This was still the old violet/blue/teal trio, which is
                    why the arrow was the one blue thing on a red page. */}
                <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#7a0d16" />
                  <stop offset=".5" stopColor="#c1121f" />
                  <stop offset="1" stopColor="#ff4d5a" />
                </linearGradient>
              </defs>
              <path d="M96 50 L6 95 L27 50 L6 5 Z" fill="url(#arrowGrad)" />
              {/* the shaded underside, giving the dart some volume */}
              <path d="M96 50 L27 50 L6 95 Z" fill="#000" opacity=".28" />
            </svg>
          </div>

          {active.steps.map((step, i) => (
            <article
              className={`step ${i % 2 === 1 ? 'right' : ''}`}
              data-step
              key={`${active.id}-${step.num}`}
            >
              {/* Oversized number on the empty side of the row. The
                  zigzag left half the width blank at every step; this
                  fills it and doubles as the step marker. */}
              <span className="step-ghost" aria-hidden="true">
                {step.num}
              </span>

              <div className="step-card">
                <p className="step-num">{step.num}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
