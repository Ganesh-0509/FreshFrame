import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

/* ══════════════════════════════════════════════════════════
   THE FLIGHT ARROW

   One arrow, no visible line. It flies down an invisible path
   stitched from the corners of the step cards, and its position
   is welded to the scrollbar (scrub) rather than played as an
   animation — stop scrolling and it stops.

   autoRotate keeps the nose pointed along the direction of
   travel, which is what makes it read as a journey.

   Pass the active process path in `deps` so the path is rebuilt
   when the user switches tabs and the cards underneath change.
   ══════════════════════════════════════════════════════════ */
export function useFlightArrow(trackRef, arrowRef, deps = []) {
  useEffect(() => {
    const track = trackRef.current
    const arrow = arrowRef.current
    if (!track || !arrow) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      arrow.style.opacity = '0'
      return
    }

    const cards = Array.from(track.querySelectorAll('[data-step] .step-card'))
    if (cards.length < 2) {
      arrow.style.opacity = '0'
      return
    }

    let tween = null
    let cancelled = false
    let resizeTimer = null
    let lastWidth = window.innerWidth

    const teardown = () => {
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
        tween = null
      }
      gsap.killTweensOf(arrow)
    }

    const build = () => {
      if (cancelled) return
      teardown()

      const trackBox = track.getBoundingClientRect()
      const arrowW = arrow.offsetWidth
      const arrowH = arrow.offsetHeight
      const inset = arrowW * 0.42

      // Anchor points ride the inner edge of each card so the arrow
      // crosses the middle on every hop. Cards alternate left/right,
      // so the path zig-zags on its own.
      const points = cards.map((card, i) => {
        const box = card.getBoundingClientRect()
        const cardOnLeft = i % 2 === 0

        const x = cardOnLeft
          ? box.right - trackBox.left - inset
          : box.left - trackBox.left + inset

        const y = box.top - trackBox.top + box.height * 0.3

        return { x: x - arrowW / 2, y: y - arrowH / 2 }
      })

      gsap.set(arrow, { x: points[0].x, y: points[0].y, opacity: 1 })

      tween = gsap.to(arrow, {
        motionPath: {
          path: points,
          curviness: 1.2, // soft arcs between cards, not hard corners
          autoRotate: true, // nose follows the direction of travel
        },
        ease: 'none',
        scrollTrigger: {
          trigger: cards[0],
          endTrigger: cards[cards.length - 1],
          start: 'top 55%',
          end: 'top 55%',
          scrub: 1, // 1s of smoothing lag behind the scrollbar
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // scrolling back up? flip it so it never flies tail-first
            const svg = arrow.querySelector('.flight-arrow-svg')
            if (svg) {
              svg.style.transform = self.direction === -1 ? 'rotate(180deg)' : 'rotate(0deg)'
            }
          },
        },
      })

      ScrollTrigger.refresh()
    }

    // one frame of breathing room so layout has settled after render
    const raf = requestAnimationFrame(build)

    // The path is measured from live layout, so it has to be
    // re-measured whenever the layout changes.
    const onResize = () => {
      if (window.innerWidth === lastWidth) return // ignore mobile URL-bar jitter
      lastWidth = window.innerWidth
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 220)
    }
    window.addEventListener('resize', onResize)

    // Fonts landing late can shift card heights.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) build()
      })
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      teardown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
