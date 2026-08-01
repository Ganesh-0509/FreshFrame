import { work } from '../data/site.js'
import { asset } from '../lib/asset.js'

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

        {/* Cards are sticky with stepped offsets, so each one comes to
            rest over the one before it as you scroll — the overlap is
            the scroll itself rather than a triggered animation. */}
        <div className="wk-stack">
          {work.map((p, i) => (
            <article className="wk-post" key={p.url} style={{ '--i': i }}>
              <a
                className="wk-card"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.name} in a new tab`}
              >
                {/* ── post header ── */}
                <header className="wk-head">
                  <span className="wk-avatar" aria-hidden="true">
                    {p.name.charAt(0)}
                  </span>
                  <span className="wk-who">
                    <b>{handle(p.url)}</b>
                    <em>{p.index.split('—')[1]?.trim() || 'Project'}</em>
                  </span>
                  <span className="wk-more" aria-hidden="true">
                    &#8226;&#8226;&#8226;
                  </span>
                </header>

                {/* ── the shot, name sitting on it ── */}
                <div className="wk-shot">
                  <img src={asset(p.shot)} alt={p.alt} loading="lazy" decoding="async" />
                  <h3 className="wk-name">{p.name}</h3>
                </div>

                {/* ── the caption column ── */}
                <div className="wk-side">
                  <div className="wk-bar" aria-hidden="true">
                    <span className="wk-act wk-act-like" />
                    <span className="wk-act wk-act-chat" />
                    <span className="wk-act wk-act-send" />
                    <span className="wk-act wk-act-save" />
                  </div>

                  <p className="wk-likes">
                    <b>Live</b> since launch &middot; built by <b>Fresh&nbsp;Frame</b>
                  </p>

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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
