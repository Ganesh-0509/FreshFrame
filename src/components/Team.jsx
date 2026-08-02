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

        {/* ONE horizontal poster. Both people on the same sheet, each
            in an outer corner, with the ampersand holding the middle —
            they're siblings, so the layout should say "a pair", not
            "two profiles that happen to be adjacent". */}
        <Reveal className="tm-poster">
          {/* Direct child of the poster, NOT of a half: .tm-half is
              position:relative, so nested here its left:50% would centre
              it inside one half instead of the sheet. */}
          <span className="tm-amp" aria-hidden="true">
            &amp;
          </span>

          {team.map((person) => (
            <div className={`tm-half tm-${person.style}`} key={person.name}>
              <div className="tm-photo">
                <img src={asset(person.photo)} alt={person.name} loading="lazy" decoding="async" />
              </div>

              <h3 className="tm-name">
                {person.name.split(' ').map((word, w) => (
                  <span key={word + w}>{word}</span>
                ))}
              </h3>

              <p className="tm-role">{person.role}</p>
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
          ))}
        </Reveal>
      </div>
    </section>
  )
}
