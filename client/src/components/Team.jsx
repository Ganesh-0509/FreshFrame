import { team } from '../data/site.js'
import { asset } from '../lib/asset.js'
import Reveal from './Reveal.jsx'

export default function Team() {
  return (
    <section className="section" id="team">
      <div className="wrap">
        <p className="kicker">// 05 — Who you&rsquo;re hiring</p>
        <h2 className="section-title">
          A brother and a sister,
          <br />
          and no one in between.
        </h2>
        <p className="section-lede">
          No account managers, no handoffs, no one repeating your brief back to someone else. The
          two people you meet are the two people who do the work.
        </p>
      </div>

      {/* One full-width horizontal band each, alternating sides, with a
          different treatment per person — see `style` in data/site.js. */}
      {team.map((person, i) => (
        <Reveal
          as="article"
          className={`tm-band tm-${person.style} ${i % 2 === 1 ? 'tm-flip' : ''}`}
          key={person.name}
        >
          <div className="wrap tm-inner">
            <div className="tm-photo">
              <img src={asset(person.photo)} alt={person.name} loading="lazy" decoding="async" />
            </div>

            <div className="tm-copy">
              <p className="tm-role">{person.role}</p>

              <h3 className="tm-name">
                {person.name.split(' ').map((word, w) => (
                  <span key={word + w}>{word}</span>
                ))}
              </h3>

              <p className="tm-tagline">{person.tagline}</p>
              <p className="tm-bio">{person.bio}</p>

              <ul className="tm-facts">
                {person.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <a
                className="tm-link"
                href={person.portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                {person.name.split(' ')[0]}&rsquo;s portfolio &#8599;
              </a>
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  )
}
