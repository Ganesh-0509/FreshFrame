/* ══════════════════════════════════════════════════════════
   useSplitScroll — headline lines that arrive from both sides.

   Each element marked data-dir="left" or data-dir="right" starts
   off-screen on that side. Two things then happen to it:

     ENTRANCE  on mount the lines fly in and settle at rest. This runs
               once and is what you see before touching the scrollbar.
     SCRUB     after that, scrolling down eases them slightly apart and
               scrolling back up brings them in again, following the
               wheel rather than playing a fixed animation at you.

   REST IS ALWAYS x:0. Scroll progress 0 must put the lines exactly
   where the entrance left them. Getting that wrong is what stranded
   the headline off-screen — see the long note on the scrub tween.

   Built on ScrollTrigger, already a dependency for the flight arrow.

   Bails out entirely when the OS asks for reduced motion: the lines
   are simply placed at rest. The CSS media query cannot undo an
   inline transform GSAP has written, so it has to be handled here.
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

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(lines, { x: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        const dir = line.dataset.dir === 'right' ? 1 : -1

        /* ENTRANCE — plays once and finishes at rest (x:0).
           Travel is a multiple of the line's own width, so a short line
           doesn't crawl in from three screens away while a long one
           barely moves. */
        gsap.fromTo(
          line,
          { x: () => dir * line.offsetWidth * travel, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'expo.out',
            delay: i * 0.09,
          }
        )

        /* SCRUB — the same axis, handed to the scrollbar.

           fromTo with an explicit { x: 0 } start, and immediateRender
           false, are both load-bearing. A plain gsap.to() records
           whatever x happens to be when the tween is BUILT, and this is
           built while the entrance is still mid-flight — so it captured
           the off-screen start position and treated that as "scroll
           progress 0". The result was the headline flying in and then
           being yanked straight back off-screen, and never returning
           when you scrolled back up.

           Stating both ends explicitly means progress 0 is always rest,
           whatever the entrance is doing at the time. */
        gsap.fromTo(
          line,
          { x: 0 },
          {
            /* Capped in pixels as well as scaled by width: 42% of a long
               line is most of the screen, which is what made this read
               as broken rather than as a parallax. */
            x: () => dir * Math.min(line.offsetWidth * drift, 190),
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
              /* re-measure widths on resize rather than reusing the
                 distances captured at first paint */
              invalidateOnRefresh: true,
            },
          }
        )
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
