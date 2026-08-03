import { work } from '../data/site.js'
import { asset } from '../lib/asset.js'
import Reveal from './Reveal.jsx'

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="wrap">
        <h2 className="section-title">
          Two projects.
          <br />
          Both shipped, both live.
        </h2>
        <p className="section-lede">
          We&rsquo;re a young studio and we&rsquo;d rather show you two we&rsquo;re proud of than
          twenty we&rsquo;re not. Click either one — they open the live site.
        </p>

        {/* Just the screenshots. Every caption, meta row and action bar
            was removed on request: the shot is the whole card and the
            card is the link. */}
        <div className="wk-feed">
          {work.map((p) => (
            <Reveal as="article" className="wk-post" key={p.url}>
              <a
                className="wk-card"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                /* The name is gone from the page but not from the
                   accessibility tree — without this the link announces
                   as "link, image" and is unusable on a screen reader. */
                aria-label={`${p.name} — open the live site in a new tab`}
              >
                <img src={asset(p.shot)} alt={p.alt} loading="lazy" decoding="async" />
                <span className="wk-open" aria-hidden="true">
                  &#8599;
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
