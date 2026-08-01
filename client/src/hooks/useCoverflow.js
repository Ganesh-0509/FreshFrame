import { useEffect } from 'react'
import gsap from 'gsap'

/* ══════════════════════════════════════════════════════════
   useCoverflow — a carousel that runs itself.

   The row scrolls on its own whenever the section is on screen,
   and each card is scaled and desaturated by its distance from
   the centre of the viewport, so whatever is in the middle is
   in focus. That focus pass is what makes it read as a carousel
   rather than a marquee.

   SEAMLESS LOOP
   The caller renders the tiles TWICE. This animates x from 0 to
   -50% of the track and repeats, so the moment the first copy
   leaves the frame the second is exactly where it started and
   the seam is invisible. Any other loop needs a jump.

   IT ONLY RUNS WHEN VISIBLE
   An IntersectionObserver pauses it off-screen. An animation
   ticking on a section nobody is looking at is pure battery
   drain, and on a long page most sections are off-screen most
   of the time.

   Hover pauses it too, so a card can be read without chasing it.
   ══════════════════════════════════════════════════════════ */
export default function useCoverflow(sectionRef, trackRef, { speed = 46 } = {}) {
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const cards = Array.from(track.children)
    if (!cards.length) return

    /* Distance from viewport centre -> scale, fade, saturation. */
    const focus = () => {
      const mid = window.innerWidth / 2
      cards.forEach((card) => {
        const box = card.getBoundingClientRect()
        if (box.width === 0) return
        const t = Math.min(Math.abs(box.left + box.width / 2 - mid) / (box.width * 1.4), 1)
        gsap.set(card, {
          scale: 1 - t * 0.20,
          opacity: 1 - t * 0.5,
          filter: `saturate(${1 - t * 0.75})`,
        })
      })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      /* Leave it still and fully legible. The rail is horizontally
         scrollable in CSS, so nothing becomes unreachable. */
      gsap.set(cards, { scale: 1, opacity: 1, filter: 'none' })
      return
    }

    let tween
    const ctx = gsap.context(() => {
      /* Duration from distance, not a fixed number — otherwise adding a
         tile silently speeds the whole row up. */
      const half = () => track.scrollWidth / 2

      tween = gsap.to(track, {
        x: () => -half(),
        duration: () => half() / speed,
        ease: 'none',
        repeat: -1,
        onUpdate: focus,
      })
    }, section)

    focus()

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? tween?.play() : tween?.pause()),
      { threshold: 0 }
    )
    io.observe(section)

    const stop = () => tween?.pause()
    const start = () => {
      /* Only resume if the section is actually on screen — otherwise a
         mouseleave as the user scrolls away restarts it invisibly. */
      const box = section.getBoundingClientRect()
      if (box.bottom > 0 && box.top < window.innerHeight) tween?.play()
    }
    section.addEventListener('mouseenter', stop)
    section.addEventListener('mouseleave', start)
    section.addEventListener('focusin', stop)
    section.addEventListener('focusout', start)

    return () => {
      io.disconnect()
      section.removeEventListener('mouseenter', stop)
      section.removeEventListener('mouseleave', start)
      section.removeEventListener('focusin', stop)
      section.removeEventListener('focusout', start)
      ctx.revert()
    }
  }, [sectionRef, trackRef, speed])
}
