import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════════════════════════
   The handset that drops in on its cord.

   Three things happen at once, which is what sells it as one
   falling object rather than three separate animations:

     1. the cord DRAWS downward   (stroke-dashoffset)
     2. the handset FALLS         (y, on a back ease so it
                                   overshoots and settles)
     3. the handset SWINGS        (rotation, damped, starting
                                   slightly after the fall so it
                                   reads as momentum, not spin)

   The cord is drawn as a stroke rather than a filled shape so the
   dash trick works at all — a filled path cannot be "drawn".
   ══════════════════════════════════════════════════════════ */
export default function PhoneDrop() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const cord = root.querySelector('.ff-cord')
    const phone = root.querySelector('.ff-handset')
    if (!cord || !phone) return

    /* Reduced motion: show it already landed. Nothing drops, but the
       drawing is still complete rather than a stub of cord. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(cord, { strokeDashoffset: 0 })
      gsap.set(phone, { y: 0, rotation: 0, opacity: 1 })
      return
    }

    const len = cord.getTotalLength()

    const ctx = gsap.context(() => {
      gsap.set(cord, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(phone, { y: -len, rotation: -9, opacity: 0, transformOrigin: '50% 0%' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          /* fires a little before the section is centred, so the drop
             is already underway by the time it is properly in view */
          start: 'top 78%',
          once: true,
        },
      })

      tl.to(cord, { strokeDashoffset: 0, duration: 1.25, ease: 'power2.out' }, 0)
        .to(phone, { opacity: 1, duration: 0.2, ease: 'none' }, 0)
        .to(phone, { y: 0, duration: 1.25, ease: 'back.out(1.35)' }, 0)
        /* the swing starts late and rings down — a real handset keeps
           moving after the cord goes taut */
        .to(
          phone,
          { rotation: 0, duration: 2.1, ease: 'elastic.out(1, 0.34)' },
          0.55
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div className="ff-phone" ref={rootRef} aria-hidden="true">
      <svg viewBox="0 0 260 620" fill="none" preserveAspectRatio="xMidYMin meet">
        {/* ── the coiled cord ──
            Alternating cubic curves make the spring; it straightens out
            into a plain drop for the last stretch, the way a real cord
            does under the weight of the handset. */}
        <path
          className="ff-cord"
          d="M130 0
             c 30 16, 30 34, 0 50
             c -30 16, -30 34, 0 50
             c 30 16, 30 34, 0 50
             c -30 16, -30 34, 0 50
             c 30 16, 30 34, 0 50
             c -18 14, -18 26, 0 40
             L130 330"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* ── the handset ──
            Built from two bulbs and a thick curved neck rather than one
            traced outline: far easier to keep balanced, and it reads as
            a receiver at any size. */}
        <g className="ff-handset">
          <g transform="translate(130 330) rotate(-24)">
            <path
              d="M0 26 C 46 84, 46 146, 0 204"
              stroke="currentColor"
              strokeWidth="30"
              strokeLinecap="round"
            />
            <ellipse cx="0" cy="22" rx="40" ry="32" fill="currentColor" />
            <ellipse cx="0" cy="208" rx="40" ry="32" fill="currentColor" />

            {/* earpiece holes, the detail that makes it read as vintage */}
            <g className="ff-holes">
              <circle cx="0" cy="22" r="17" />
              <circle cx="0" cy="4" r="2.4" />
              <circle cx="0" cy="40" r="2.4" />
              <circle cx="-15" cy="22" r="2.4" />
              <circle cx="15" cy="22" r="2.4" />
              <circle cx="-11" cy="11" r="2.4" />
              <circle cx="11" cy="11" r="2.4" />
              <circle cx="-11" cy="33" r="2.4" />
              <circle cx="11" cy="33" r="2.4" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
