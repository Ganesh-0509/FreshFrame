import { useEffect, useRef, useState } from 'react'

/* ══════════════════════════════════════════════════════════
   Reveal — adds `.in` while its children are on screen.

   IT REPLAYS. `.in` is removed again once the element has left
   the viewport completely, so returning to a section runs its
   animation again rather than finding it already finished. Every
   CSS animation keyed off `.in` restarts for free: removing and
   re-adding a class restarts an animation.

   ENTER/LEAVE both key off isIntersecting (any overlap at all) against
   a root shrunk 60px at the bottom — not an intersectionRatio threshold.

   A ratio threshold (this used to require 16% of the element visible)
   fails on anything taller than roughly 6x the viewport: on a phone,
   the price cards, team stage and automation flow can each run well
   past that, so the ratio never climbed high enough and those sections
   stayed invisible for large stretches of scroll. Firing on first
   overlap fixes that regardless of element height, at the cost of the
   entrance sometimes starting a few px earlier on short elements —
   not a visible difference in practice.
   ══════════════════════════════════════════════════════════ */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      /* Shown permanently: no entrance, so nothing to replay either. */
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
