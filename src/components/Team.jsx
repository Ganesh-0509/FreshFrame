import { useEffect, useRef, useState } from 'react'
import { team } from '../data/site.js'
import { asset } from '../lib/asset.js'
import Reveal from './Reveal.jsx'

/* ══════════════════════════════════════════════════════════
   TEAM — one stage, two people, a divider that follows the cursor.

   The old version put both of them side by side at once, which meant
   two columns of prose fighting for the same sheet and two photos
   cropped down to postage stamps to make room. Nothing lined up
   because nothing had space.

   So: only one of them is ever argued at a time. At rest the divider
   sits in the middle and you see two figures and two names — a
   portrait, not a CV. Move onto HIS half and the divider swings right:
   he grows and his copy unfolds on the right of his half, against the
   divider. Move onto HERS and it swings the other way, her copy
   unfolding on the left of hers. Leave the stage and it settles back
   to even. Nothing to grab, nothing to learn.

   WHY IT CANNOT OSCILLATE
   Opening a half only ever makes that half WIDER, so the pointer that
   triggered it is still inside it afterwards. There is no cursor
   position where opening one half hands the pointer to the other, so
   hover can't flip-flop and needs no dead zone.

   HOW THE REVEAL WORKS
   Each half is a window (`overflow:hidden`) onto a content block of
   FIXED width, pinned to that half's outer edge. Widening the half
   slides more of the block into view; it never reflows, so type never
   re-wraps as the sheet moves. Geometry is set so that at the resting
   50/50 the window ends exactly where the copy begins.

   `--stage-w` is the one measurement JS has to supply, because those
   fixed widths are fractions of the STAGE, and a percentage inside a
   half would resolve against the half instead.

   WITHOUT A POINTER
   Tapping a half opens it, and focusing a portfolio link opens the half
   it lives in — which is what makes that link reachable by keyboard at
   all, since it sits in copy that is transparent until its half opens.
   Below 900px there is no divider: two stacked blocks, both fully open.
   ══════════════════════════════════════════════════════════ */

/* Where the divider parks. Symmetric about REST so the two halves
   behave identically, and short of the edges so the receding half keeps
   a band of its own colour rather than being squeezed to a line. */
const MIN = 16
const MAX = 84
const REST = 50

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const unit = (v) => clamp(v, 0, 1).toFixed(3)

export default function Team() {
  const stageRef = useRef(null)
  /* null = nobody has the sheet. Only ever 'l', 'r' or null — the
     divider has three parking spots and CSS eases between them. */
  const [held, setHeld] = useState(null)
  const split = held === 'l' ? MAX : held === 'r' ? MIN : REST

  /* Written straight onto the node, not held in state: a window resize
     should not re-render the section, and the value is only ever read
     back by CSS. */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const write = () => el.style.setProperty('--stage-w', `${Math.round(el.getBoundingClientRect().width)}px`)
    write()

    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', write)
      return () => window.removeEventListener('resize', write)
    }
    const ro = new ResizeObserver(write)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* A half's share of its travel, 0 (fully receded) to 1 (holding the
     sheet). Drives size, colour and how far out the figure stands. */
  const grow = [(split - MIN) / (MAX - MIN), (MAX - split) / (MAX - MIN)]
  /* Whether the COPY has earned the sheet — only past the midpoint, so
     the resting state is two portraits and nothing to read. */
  const open = [(split - REST) / (MAX - REST), (REST - split) / (REST - MIN)]

  /* Where the figure stands, as a fraction of the STAGE in from its own
     outer edge. Deliberately a tent, not a ramp: hard against the outer
     margin at both ends of the travel, furthest in at rest.

     At rest that puts the two of them either side of the ampersand,
     close enough to read as a pair. Opening a half walks its figure back
     out to the margin to clear room for the copy; closing one walks it
     out too, so it slides off the sheet instead of being sliced in half
     by the divider. Same motion both ways — they part. */
  const standX = grow.map((g) => 0.035 + 0.74 * g * (1 - g))

  return (
    <section className="section" id="team">
      <div className="wrap">
        <h2 className="section-title">
          A brother and a sister,
          <br />
          and no one in between.
        </h2>
        <p className="section-lede">
          No account managers, no handoffs, no one repeating your brief back to someone else. The
          two people you meet are the two people who do the work.
        </p>

        <Reveal className="tm-reveal">
          <div
            ref={stageRef}
            className="tm-stage"
            /* Reset lives on the STAGE, not on each half: leaving one
               half for the other must not flicker through the resting
               position on the way. */
            onMouseLeave={() => setHeld(null)}
            style={{
              '--p': split.toFixed(3),
              '--lg': unit(grow[0]),
              '--rg': unit(grow[1]),
              '--lo': unit(open[0]),
              '--ro': unit(open[1]),
              '--lx': standX[0].toFixed(4),
              '--rx': standX[1].toFixed(4),
              /* how far from the resting half-and-half, either way */
              '--away': unit(Math.max(open[0], open[1])),
            }}
          >
            {team.map((person, i) => {
              const side = i === 0 ? 'l' : 'r'
              const first = person.name.split(' ')[0]
              return (
                <div
                  key={person.name}
                  className={`tm-side tm-side--${side} tm-${person.style}`}
                  /* The whole interaction. Safe to fire on enter alone:
                     opening a half can only widen it, so the pointer
                     that opened it stays inside it. */
                  onMouseEnter={() => setHeld(side)}
                  /* Touch has no hover — a tap does the same thing. */
                  onClick={(e) => {
                    if (e.target.closest('a')) return
                    setHeld(side)
                  }}
                  /* And the keyboard reaches the portfolio link by
                     tabbing. That link lives in copy that is transparent
                     until its half opens, so opening on focus is what
                     makes it reachable at all. */
                  onFocusCapture={() => setHeld(side)}
                >
                  <div className="tm-inner">
                    <div className="tm-figure">
                      <img
                        className="tm-cut"
                        src={asset(person.photo)}
                        {...(person.photoSmall && {
                          srcSet: `${asset(person.photoSmall)} 400w, ${asset(person.photo)} 600w`,
                          sizes: '(max-width: 900px) 45vw, 34vw',
                        })}
                        alt={person.name}
                        loading="lazy"
                        decoding="async"
                      />
                      <h3 className="tm-name">
                        {person.name.split(' ').map((word, w) => (
                          <span key={word + w}>{word}</span>
                        ))}
                      </h3>
                      <p className="tm-role">{person.role}</p>
                    </div>

                    <div className="tm-copy">
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
                        {first}&rsquo;s portfolio &#8599;
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* The ampersand from the old poster, riding the seam. It is
                a mark, not a control — inert to the pointer, so moving
                across it never interrupts the half underneath. */}
            <div className="tm-handle" aria-hidden="true">
              <span className="tm-knob">
                <span className="tm-amp">&amp;</span>
              </span>
            </div>
          </div>
        </Reveal>

        <p className="tm-hint" aria-hidden="true">
          Hover either of us to read more
        </p>
      </div>
    </section>
  )
}
