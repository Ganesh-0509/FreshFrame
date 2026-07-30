import { work } from '../data/site.js'
import Reveal from './Reveal.jsx'

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="wrap">
        <p className="kicker">// 03 — Selected work</p>
        <h2 className="section-title">
          Two projects.
          <br />
          Both shipped, both live.
        </h2>
        <p className="section-lede">
          We're a young studio and we'd rather show you two we're proud of than twenty we're not.
          Click either one — they're live right now.
        </p>

        {work.map((p, i) => (
          <Reveal
            as="article"
            className={`work-row ${i % 2 === 1 ? 'reverse' : ''}`}
            key={p.url}
          >
            <a
              className="work-shot"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${p.name} in a new tab`}
            >
              <img src={p.shot} alt={p.alt} />
              <span className="work-shot-badge">Visit site ↗</span>
            </a>

            <div className="work-info">
              <p className="work-index">{p.index}</p>
              <h3>
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.name}
                </a>
              </h3>
              <p className="work-desc">{p.desc}</p>
              <ul className="work-meta">
                {p.meta.map(([label, value]) => (
                  <li key={label}>
                    <span>{label}</span> {value}
                  </li>
                ))}
              </ul>
              <a className="link-arrow" href={p.url} target="_blank" rel="noopener noreferrer">
                Visit live site ↗
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
