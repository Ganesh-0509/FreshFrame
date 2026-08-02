import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════════════════════════
   The vintage handset that drops in on its coiled cord.

   Drawn rather than photographed so it can be recoloured from
   the theme and stays sharp at any size. The "premium" read
   comes from three things a flat silhouette does not have:

     • a body gradient running light-left to dark-right, which
       is what makes a glossy moulded object look round
     • a specular highlight down the left edge
     • a darker shadow side and a soft contact shadow

   MOTION — three things run together so it reads as one falling
   object rather than three separate animations:
     1. the cord DRAWS downward  (stroke-dashoffset)
     2. the handset FALLS        (back ease, so it overshoots)
     3. the handset SWINGS       (damped elastic, starting late
                                  so it reads as momentum)
   ══════════════════════════════════════════════════════════ */
export default function PhoneDrop() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const cord = root.querySelector('.ff-cord')
    const phone = root.querySelector('.ff-handset')
    if (!cord || !phone) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(cord, { strokeDashoffset: 0 })
      gsap.set(phone, { y: 0, rotation: 0, opacity: 1 })
      return
    }

    const len = cord.getTotalLength()

    const ctx = gsap.context(() => {
      gsap.set(cord, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(phone, { y: -len, rotation: -14, opacity: 0, transformOrigin: '50% 0%' })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 85%',
            end: 'bottom top',
            /* enter / leave / enterBack / leaveBack.
               restart on the way down AND on the way back up, reset
               once it is fully past — so the handset drops again every
               time the section is visited, from either direction. */
            toggleActions: 'restart none restart reset',
          },
        })
        /* Slower than a normal UI transition on purpose. The drop is
           the thing being looked at, so it is given time to be seen. */
        .to(cord, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }, 0)
        .to(phone, { opacity: 1, duration: 0.18, ease: 'none' }, 0)
        .to(phone, { y: 0, duration: 1.5, ease: 'back.out(1.4)' }, 0)
        .to(phone, { rotation: 0, duration: 2.6, ease: 'elastic.out(1, 0.3)' }, 0.7)
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div className="ff-phone" ref={rootRef} aria-hidden="true">
      <svg viewBox="0 0 300 880" fill="none" preserveAspectRatio="xMidYMin meet">
        <defs>
          {/* Left-lit body. The hard step near 70% is the shadow
              turn — a smooth ramp reads as matte, a fast one as gloss. */}
          <linearGradient id="ffBody" x1="0" y1="0" x2="1" y2="0.15">
            <stop offset="0" stopColor="#7e1d24" />
            <stop offset="0.22" stopColor="#c1121f" />
            <stop offset="0.52" stopColor="#9c1019" />
            <stop offset="0.74" stopColor="#5e0c13" />
            <stop offset="1" stopColor="#3d070c" />
          </linearGradient>

          <linearGradient id="ffCap" x1="0.1" y1="0" x2="0.95" y2="0.9">
            <stop offset="0" stopColor="#d0313c" />
            <stop offset="0.38" stopColor="#b01420" />
            <stop offset="1" stopColor="#4a080e" />
          </linearGradient>

          <linearGradient id="ffCord" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8f1620" />
            <stop offset="0.5" stopColor="#c1121f" />
            <stop offset="1" stopColor="#6d0d14" />
          </linearGradient>
        </defs>

        {/* ── the coiled cord ──
            Six alternating curves make the spring, then it straightens
            under the weight of the handset the way a real cord does. */}
        <path
          className="ff-cord"
          d="M150 2
             c 40 20, 40 44, 0 64
             c -40 20, -40 44, 0 64
             c 40 20, 40 44, 0 64
             c -40 20, -40 44, 0 64
             c 34 18, 34 38, 0 56
             c -24 14, -24 30, 0 44
             L150 424"
          stroke="url(#ffCord)"
          strokeWidth="9"
          strokeLinecap="round"
        />

        <g className="ff-handset">
          <g transform="translate(150 424) rotate(-21)">
            {/* contact shadow, so it sits in space rather than on glass */}
            <ellipse cx="6" cy="392" rx="66" ry="16" fill="#000" opacity=".34" />

            {/* neck — stroked so the gradient follows the curve */}
            <path
              d="M0 62 C 96 156, 96 292, 0 384"
              stroke="url(#ffBody)"
              strokeWidth="54"
              strokeLinecap="round"
            />

            {/* the two flared caps */}
            <ellipse cx="0" cy="56" rx="62" ry="52" fill="url(#ffCap)" />
            <ellipse cx="0" cy="388" rx="62" ry="52" fill="url(#ffCap)" />

            {/* specular highlight down the lit edge — the single detail
                that does most of the work for "glossy" */}
            <ellipse cx="-30" cy="52" rx="15" ry="30" fill="#fff" opacity=".30" />
            <ellipse cx="-28" cy="384" rx="14" ry="27" fill="#fff" opacity=".24" />
            <path
              d="M22 96 C 76 170, 76 280, 22 350"
              stroke="#fff"
              strokeOpacity=".16"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* earpiece: recessed ring plus the hole pattern */}
            <ellipse cx="0" cy="56" rx="34" ry="28" fill="#3d070c" opacity=".85" />
            <g className="ff-holes">
              <circle cx="0" cy="56" r="3.6" />
              <circle cx="0" cy="38" r="3.2" />
              <circle cx="0" cy="74" r="3.2" />
              <circle cx="-19" cy="56" r="3.2" />
              <circle cx="19" cy="56" r="3.2" />
              <circle cx="-14" cy="43" r="3.2" />
              <circle cx="14" cy="43" r="3.2" />
              <circle cx="-14" cy="69" r="3.2" />
              <circle cx="14" cy="69" r="3.2" />
            </g>

            {/* mouthpiece cap, plainer than the earpiece */}
            <ellipse cx="0" cy="388" rx="34" ry="28" fill="#3d070c" opacity=".8" />
            <circle cx="0" cy="388" r="9" fill="#26050a" />
          </g>
        </g>
      </svg>
    </div>
  )
}
