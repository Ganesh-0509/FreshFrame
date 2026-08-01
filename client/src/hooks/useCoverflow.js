import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════════════════════════
   useCoverflow — the poster-carousel scroll from the reference.

   Two things happen, and they are separate on purpose:

     TRACK   vertical scroll is converted into horizontal travel,
             so the row slides past as you scroll the page. No
             pinning: pinning hijacks the scrollbar and makes the
             rest of the page feel broken on a trackpad.

     CARDS   each card is scaled and dimmed by its distance from
             the centre of the viewport, so whichever card is in
             the middle is the one in focus. That is what makes
             it read as a carousel rather than a sliding strip.

   The card pass runs from ScrollTrigger's onUpdate rather than its
   own scroll listener, so both stay on the same rAF tick and the
   scale can never lag the travel by a frame.
   ══════════════════════════════════════════════════════════ */
export default function useCoverflow(sectionRef, trackRef, { travel = 0.55 } = {}) {
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const cards = Array.from(track.children)
    if (!cards.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      /* Leave it as a plain readable row. The track is horizontally
         scrollable via CSS, so nothing becomes unreachable. */
      gsap.set(cards, { scale: 1, opacity: 1 })
      return
    }

    const focus = () => {
      const mid = window.innerWidth / 2
      cards.forEach((card) => {
        const box = card.getBoundingClientRect()
        const dist = Math.abs(box.left + box.width / 2 - mid)
        /* 0 at dead centre, 1 once it is a full card-width away */
        const t = Math.min(dist / (box.width * 1.15), 1)
        gsap.set(card, {
          scale: 1 - t * 0.22,
          opacity: 1 - t * 0.55,
          filter: `saturate(${1 - t * 0.7})`,
          zIndex: Math.round((1 - t) * 100),
        })
      })
    }

    const ctx = gsap.context(() => {
      /* Overflow is how far the row extends past the viewport; without
         it a short row would scroll off into empty space. */
      const overflow = () => Math.max(track.scrollWidth - window.innerWidth, 0)

      gsap.fromTo(
        track,
        { x: () => overflow() * travel },
        {
          x: () => -overflow() * travel,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: focus,
            onRefresh: focus,
          },
        }
      )
    }, section)

    focus()
    return () => ctx.revert()
  }, [sectionRef, trackRef, travel])
}
