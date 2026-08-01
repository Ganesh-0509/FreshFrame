import { work } from '../data/site.js'
import { asset } from '../lib/asset.js'
import Reveal from './Reveal.jsx'

/* "standardfireworkssivakasi.com" -> "@standardfireworkssivakasi" */
const handle = (url) =>
  '@' + url.replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[./]/)[0]

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
          We&rsquo;re a young studio and we&rsquo;d rather show you two we&rsquo;re proud of than
          twenty we&rsquo;re not. Tap either card — they&rsquo;re live right now.
        </p>

        <div className="wk-feed">
          {work.map((p) => (
            <Reveal as="article" className="wk-post" key={p.url}>
              {/* One anchor around the whole card — no separate link. */}
              <a
                className="wk-card"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.name} in a new tab`}
              >
                {/* ── the shot, with the name sitting ON it ── */}
                <div className="wk-shot">
                  <img src={asset(p.shot)} alt={p.alt} loading="lazy" decoding="async" />
                  <h3 className="wk-name">{p.name}</h3>
                </div>

                {/* ── the caption, alongside rather than beneath ── */}
                <div className="wk-side">
                  <header className="wk-head">
                    <span className="wk-avatar" aria-hidden="true" />
                    <span className="wk-who">
                      <b>{handle(p.url)}</b>
                      <em>{p.index.split('—')[1]?.trim() || 'Project'}</em>
                    </span>
                  </header>

                  <p className="wk-desc">{p.desc}</p>

                  <dl className="wk-meta">
                    {p.meta.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <span className="wk-go">Open the live site &#8594;</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
