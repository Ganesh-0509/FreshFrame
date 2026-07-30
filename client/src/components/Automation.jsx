import { Fragment } from 'react'
import { automation } from '../data/site.js'
import Reveal from './Reveal.jsx'

/* keyed off `icon` in data/site.js */
const ICONS = {
  chat: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 10h8M8 13h5" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M9 12h6M9 16h4M14 3v4h4" />
    </>
  ),
  funnel: <path d="M3 4h18l-7 8v8l-4-2v-6z" />,
  chart: (
    <>
      <path d="M4 20h17" />
      <path d="M6 20v-7M11 20V6M16 20v-10M21 20v-4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 3H4z" />
      <path d="M10 22h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" />
    </>
  ),
}

const FLOW = [
  { num: '01', text: 'Show us the task you keep repeating' },
  { num: '02', text: "We map it and tell you honestly if it's worth automating" },
  { num: '03', text: 'We scope it and quote before building anything' },
  { num: '04', text: 'It runs itself. We stay on hand.' },
]

export default function Automation() {
  return (
    <section className="section band-tint automation" id="automation">
      <div className="wrap">
        <p className="kicker">// 02 — Automation</p>
        <h2 className="section-title">
          {automation.title[0]}
          <br />
          {automation.title[1]}
        </h2>
        <p className="section-lede">
          {automation.lede} <strong>{automation.ledeStrong}</strong>
        </p>

        <div className="auto-grid">
          {automation.tiles.map((tile) => (
            <Reveal as="article" className="auto-tile" key={tile.title}>
              <span className="auto-ico" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[tile.icon]}
                </svg>
              </span>
              <h3>{tile.title}</h3>
              <p>{tile.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="auto-flow">
          {FLOW.map((step, i) => (
            <Fragment key={step.num}>
              {i > 0 && (
                <span className="auto-flow-sep" aria-hidden="true">
                  →
                </span>
              )}
              <div className="auto-flow-step">
                <span className="auto-flow-num">{step.num}</span>
                <p>{step.text}</p>
              </div>
            </Fragment>
          ))}
        </Reveal>

        <p className="auto-note">{automation.note}</p>
        <a href="#contact" className="btn btn-primary">
          {automation.cta}
        </a>
      </div>
    </section>
  )
}
