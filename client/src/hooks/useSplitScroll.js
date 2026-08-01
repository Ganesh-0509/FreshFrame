/* ══════════════════════════════════════════════════════════
   useSplitScroll — headline lines that arrive from both sides.

   Each element marked data-dir="left" or data-dir="right" starts
   off-screen on that side. Two things then happen to it:

     ENTRANCE  on mount the lines fly in and settle. This runs once
               and is what you see before touching the scrollbar.
     SCRUB     after that, scroll position drives them back apart,
               so dragging the scrollbar pulls the words open and
               scrolling up closes them again. That is the
               "interactive" half — it follows the wheel rather than
               playing a fixed animation at you.

   Built on ScrollTrigger, already a dependency for the flight arrow.

   Bails out entirely when the OS asks for reduced motion: the lines
   are simply placed at rest. The CSS media query cannot undo an
   inline transform GSAP has written, so it has to be handled here.
   ══════════════════════════════════════════════════════════ */

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useSplitScroll(ref, { travel = 1.15, drift = 0.42 } = {}) {
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

        /* Travel is a multiple of the line's own width, so a short line
           doesn't crawl in from three screens away while a long one
           barely moves. */
        const from = () => dir * line.offsetWidth * travel

        gsap.fromTo(
          line,
          { x: from, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'expo.out',
            delay: i * 0.09,
          }
        )

        /* Then hand the same axis to the scrollbar. start:'top top' so
           it only engages once the entrance has somewhere to go. */
        gsap.to(line, {
          x: () => dir * line.offsetWidth * drift,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
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
