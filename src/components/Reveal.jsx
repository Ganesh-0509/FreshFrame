import { useEffect, useRef, useState } from 'react'

/* ══════════════════════════════════════════════════════════
   Reveal — adds `.in` while its children are on screen.

   IT REPLAYS. `.in` is removed again once the element has left
   the viewport completely, so returning to a section runs its
   animation again rather than finding it already finished. Every
   CSS animation keyed off `.in` restarts for free: removing and
   re-adding a class restarts an animation.

   Two thresholds, deliberately different:

     ENTER at 0.16 — a sliver at the edge of the screen should not
                     start a sequence the reader cannot see yet.
     LEAVE at 0    — only reset once the element is fully gone.
                     Resetting the moment it dropped below 0.16
                     would re-trigger while it was still half on
                     screen, and flicker as you scrolled.

   The enter threshold stays low because an element taller than
   the viewport can never reach a high ratio.
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
      ([entry]) => {
        if (!entry.isIntersecting) setShown(false)
        else if (entry.intersectionRatio >= 0.16) setShown(true)
      },
      { threshold: [0, 0.16], rootMargin: '0px 0px -60px 0px' }
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
