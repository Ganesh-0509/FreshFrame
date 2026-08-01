import { work } from '../data/site.js'
import { asset } from '../lib/asset.js'
import Reveal from './Reveal.jsx'

/* Turns "standardfireworkssivakasi.com" into "@standardfireworkssivakasi"
   for the post header, the way the reference card is titled. */
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
          {work.map((p, i) => (
            <Reveal as="article" className="wk-post" key={p.url}>
              <span className="wk-tag">{i === 0 ? 'New post' : 'Post'}</span>

              {/* The whole card is the link, so there is no separate
                  "Visit site" button or link line any more. */}
              <a
                className="wk-card"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.name} in a new tab`}
              >
                <header className="wk-head">
                  <span className="wk-handle">{handle(p.url)}</span>
                  <span className="wk-index">{p.index.split('—')[0].trim()}</span>
                </header>

                {/* Deliberately uncropped and unfiltered: the point of
                    this section is that you can see the actual site. */}
                <div className="wk-shot">
                  <img src={asset(p.shot)} alt={p.alt} loading="lazy" decoding="async" />
                </div>

                <div className="wk-body">
                  <h3 className="wk-name">{p.name}</h3>
                  <p className="wk-desc">{p.desc}</p>
                </div>

                {/* The reference's like/comment/share bar, carrying the
                    project's real facts instead of fake engagement. */}
                <footer className="wk-actions">
                  {p.meta.map(([label, value]) => (
                    <span className="wk-action" key={label}>
                      <i className="wk-ico" aria-hidden="true" data-ico={label} />
                      <b>{label}</b>
                      <em>{value}</em>
                    </span>
                  ))}
                </footer>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
