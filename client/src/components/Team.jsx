import { team } from '../data/site.js'
import Reveal from './Reveal.jsx'

export default function Team() {
  return (
    <section className="section" id="team">
      <div className="wrap">
        <p className="kicker">// 05 — Who you're hiring</p>
        <h2 className="section-title">
          A brother and a sister,
          <br />
          and no one in between.
        </h2>
        <p className="section-lede">
          No account managers, no handoffs, no one repeating your brief back to someone else. The
          two people you meet are the two people who do the work.
        </p>

        <div className="team-grid">
          {team.map((person) => (
            <Reveal as="article" className="person" key={person.name}>
              <div className="person-photo">
                <img src={person.photo} alt={person.name} />
              </div>
              <div className="person-body">
                <h3>{person.name}</h3>
                <p className="person-role">{person.role}</p>
                <p className="person-bio">{person.bio}</p>
                <a
                  className="person-link"
                  href={person.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See {person.name.split(' ')[0]}'s portfolio ↗
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
