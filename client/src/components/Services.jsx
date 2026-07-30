import { services } from '../data/site.js'
import Reveal from './Reveal.jsx'

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <p className="kicker">// 01 — What we do</p>
        <h2 className="section-title">
          Four things,
          <br />
          done properly.
        </h2>

        <div className="cards-4">
          {services.map((s) => (
            <Reveal as="article" className="card" key={s.num}>
              <div className="card-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
              <ul className="ticks">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {s.link && (
                <a className="link-arrow" href={s.link.href}>
                  {s.link.label}
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
