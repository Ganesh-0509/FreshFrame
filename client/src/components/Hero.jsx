import { useRef } from 'react'
import { hero } from '../data/site.js'
import useSplitScroll from '../hooks/useSplitScroll.js'

export default function Hero() {
  const titleRef = useRef(null)
  useSplitScroll(titleRef)

  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />

      {/* The oversized word behind everything, as in the reference.
          aria-hidden and unselectable: it is texture, not content, and
          it deliberately fails contrast because nothing depends on
          reading it. The real headline sits on top. */}
      <div className="hero-ghost" aria-hidden="true">
        FRESH<span>FRAME</span>
      </div>

      <div className="wrap hero-inner">
        <p className="kicker">{hero.kicker}</p>

        <p className="hero-script">Hello,</p>

        {/* Each line arrives from the side named here, then the
            scrollbar drives them apart again — see useSplitScroll. */}
        <h1 className="hero-title" ref={titleRef}>
          <span className="hero-line" data-dir="left">
            See your website
          </span>
          <span className="hero-line" data-dir="right">
            <em>before</em> you pay
          </span>
        </h1>

        <div className="hero-body">
          <p className="lede">{hero.lede}</p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Get your free mock
            </a>
            <a href="#work" className="btn btn-ghost">
              See our work
            </a>
          </div>

          <ul className="hero-points">
            {hero.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
