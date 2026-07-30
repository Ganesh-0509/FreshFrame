import { hero } from '../data/site.js'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker">{hero.kicker}</p>
          <h1>
            See your website
            <br />
            <em>before</em> you pay for it.
          </h1>
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

        <div className="hero-visual" aria-hidden="true">
          <div className="code-window">
            <div className="cw-bar">
              <span />
              <span />
              <span />
              <i>freshframe.dev</i>
            </div>
            <pre className="cw-body">
              <code>
                <span className="c-key">const</span> <span className="c-var">freshFrame</span> ={' '}
                {'{'}
                {'\n'}  <span className="c-prop">team</span>: [
                <span className="c-str">'Ganesh'</span>, <span className="c-str">'Vinothini'</span>],
                {'\n'}  <span className="c-prop">builds</span>: [
                <span className="c-str">'websites'</span>, <span className="c-str">'brands'</span>,
                {'\n'}            <span className="c-str">'automations'</span>],
                {'\n'}  <span className="c-prop">mockFirst</span>:{' '}
                <span className="c-bool">true</span>,
                {'\n'}  <span className="c-prop">advance</span>: <span className="c-num">0</span>,
                {'\n'}
                {'}'};
                {'\n\n'}
                <span className="c-var">freshFrame</span>.<span className="c-fn">build</span>(
                <span className="c-str">'your idea'</span>);
                {'\n'}
                <span className="c-com">{'// → you grow'}</span>
              </code>
            </pre>
          </div>

          {hero.chips.map((chip, i) => (
            <div className={`float-chip chip-${i + 1}`} key={chip}>
              {chip}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
