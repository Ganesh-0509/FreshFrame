import { Fragment } from 'react'
import { marquee } from '../data/site.js'

export default function Marquee() {
  // duplicated so the -50% keyframe loops seamlessly
  const items = [...marquee, ...marquee]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {/* Fragment, not a wrapper element — the span/i need to be direct
            children of the track for the nth-of-type colour rotation to work */}
        {items.map((text, i) => (
          <Fragment key={i}>
            <span>{text}</span>
            <i>◆</i>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
