/* ══════════════════════════════════════════════════════════
   useSplitScroll — headline lines that arrive from both sides.

   Each element marked data-dir="left" or data-dir="right" starts
   off-screen on that side. Two things then happen to it:

     ENTRANCE  the lines fly in and settle at rest. It REPLAYS —
               scroll-triggered, so returning to the hero runs it
               again instead of finding it already finished.
     SCRUB     after that, scrolling eases them slightly apart and
               back, following the wheel rather than playing a
               fixed animation at you.

   REST IS ALWAYS x:0. Scroll progress 0 must put the lines exactly
   where the entrance left them. Getting that wrong is what stranded
   the headline off-screen once already.

   BOTH ANIMATIONS OWN x. Now that the entrance replays mid-page,
   they can be live at the same moment and would fight for the same
   property every frame — the line would visibly stutter. The scrub
   is therefore disabled while an entrance runs and handed back when
   it finishes. disable(false) leaves current values alone rather
   than reverting them, which would snap the line.

   Bails out entirely under reduced motion: the lines are simply
   placed at rest. A CSS media query cannot undo an inline transform
   GSAP has written, so it has to be handled here.
   ══════════════════════════════════════════════════════════ */

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useSplitScroll(ref, { travel = 0.75, drift = 0.16 } = {}) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const lines = Array.from(root.querySelectorAll('[data-dir]'))
    if (!lines.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(lines, { x: 0, opacity: 1 })
      return
    }

    const scrubs = []
    let running = 0

    const holdScrub = () => {
      running += 1
      if (running === 1) scrubs.forEach((st) => st.disable(false))
    }
    const releaseScrub = () => {
      running = Math.max(0, running - 1)
      if (running === 0) scrubs.forEach((st) => st.enable())
    }

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        const dir = line.dataset.dir === 'right' ? 1 : -1

        /* ── ENTRANCE ──
           Travel is a multiple of the line's own width, so a short line
           doesn't crawl in from three screens away while a long one
           barely moves.

           restart on the way down AND on the way back up; reset once
           fully past, so it is armed for the next visit. */
        gsap.fromTo(
          line,
          { x: () => dir * line.offsetWidth * travel, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'expo.out',
            delay: i * 0.09,
            onStart: holdScrub,
            onComplete: releaseScrub,
            scrollTrigger: {
              trigger: root,
              start: 'top 90%',
              end: 'bottom top',
              toggleActions: 'restart none restart reset',
            },
          }
        )

        /* ── SCRUB ──
           fromTo with an explicit { x: 0 } start and immediateRender
           false are both load-bearing. A plain gsap.to() records
           whatever x happens to be when the tween is BUILT — which is
           mid-entrance — and treats that off-screen value as "scroll
           progress 0". That is what stranded the headline. Stating both
           ends explicitly means progress 0 is always rest. */
        const scrub = gsap.fromTo(
          line,
          { x: 0 },
          {
            /* Capped in pixels as well as scaled by width: 42% of a long
               line is most of the screen, which read as broken rather
               than as parallax. */
            x: () => dir * Math.min(line.offsetWidth * drift, 190),
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        )
        if (scrub.scrollTrigger) scrubs.push(scrub.scrollTrigger)
      })
    }, root)

    /* Fonts land after first paint and change offsetWidth, which the
       travel distance is measured from. Without this the lines start
       from the wrong place on a cold load. */
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }

    return () => ctx.revert()
  }, [ref, travel, drift])
}
