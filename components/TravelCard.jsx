"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { CHAPTERS, STORY_IMAGES } from "@/lib/pricing";
import { WHY_IMAGE } from "@/lib/features";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const HERO_TILT = -6;
const PARALLAX_DEPTH = 26;
const DESKTOP = 1024;
const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { stiffness: 110, damping: 11, mass: 0.8 };

const HERO_IMAGE = { src: "/images/hero-dumbbell.jpg", alt: "Athlete holding heavy dumbbells in the gym" };

/*
  One card that travels through three sections:
    A  hero slot   → B  Spotlight slot  (scroll 0 → e1)
    B              → C  Pricing slot    (scroll e1 → e2)
    pinned beside the pricing chapters  (scroll e2 → e3, desktop only)
    C              → D  Why Legion slot (scroll s4 → e4)
  Travel goes through an under-damped spring so the card bounces as it lands.
  Inside Pricing its photo changes to match the active chapter.
*/
export default function TravelCard({ start, stageRef, slots, storyRef, chapter, pointer }) {
  const [a, b, c, d] = slots;
  const g = {
    left: useMotionValue(0),
    top: useMotionValue(0),
    width: useMotionValue(0),
    bx: useMotionValue(0),
    by: useMotionValue(0),
    cx: useMotionValue(0),
    cy: useMotionValue(0),
    sb: useMotionValue(1),
    sc: useMotionValue(1),
    dx: useMotionValue(0),
    dy: useMotionValue(0),
    sd: useMotionValue(1),
    s4: useMotionValue(3),
    e4: useMotionValue(4),
    cap: useMotionValue(Infinity),
    offX: useMotionValue(0),
    e1: useMotionValue(1),
    e2: useMotionValue(2),
    e3: useMotionValue(2),
    ready: useMotionValue(0),
  };
  const [isDesktop, setIsDesktop] = useState(false);
  const [inPricing, setInPricing] = useState(false);
  const [inWhy, setInWhy] = useState(false);

  useEffect(() => {
    const els = [stageRef.current, a.current, b.current, c.current, storyRef.current, d.current];
    if (els.some((el) => !el)) return;
    const [stage, A, B, C, story, D] = els;

    const measure = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const s = stage.getBoundingClientRect();
      const ra = A.getBoundingClientRect();
      const rb = B.getBoundingClientRect();
      const rc = C.getBoundingClientRect();
      const rs = story.getBoundingClientRect();
      const rd = D.getBoundingClientRect();
      if (!ra.width) return;

      const desktop = window.innerWidth >= DESKTOP;
      setIsDesktop(desktop);

      g.left.set(ra.left - s.left);
      g.top.set(ra.top - s.top);
      g.width.set(ra.width);
      g.bx.set(rb.left - ra.left);
      g.by.set(rb.top - ra.top);
      g.cx.set(rc.left - ra.left);
      g.cy.set(rc.top - ra.top);
      g.sb.set(rb.width / ra.width);
      g.sc.set(rc.width / ra.width);
      g.dx.set(rd.left - ra.left);
      g.dy.set(rd.top - ra.top);
      g.sd.set(rd.width / ra.width);

      // B is centred in the viewport
      const e1 = Math.max(1, rb.top + sy + rb.height / 2 - vh / 2);
      // C reaches its resting place: vertically centred (desktop pins there)
      const pinTop = Math.max(90, (vh - rc.height) / 2);
      const e2 = Math.max(e1 + 1, desktop ? rc.top + sy - pinTop : rc.top + sy + rc.height / 2 - vh / 2);
      // pinning ends when the card's bottom meets the end of the chapters
      const e3 = desktop ? Math.max(e2, rs.bottom + sy - pinTop - rc.height) : e2;
      g.e1.set(e1);
      g.e2.set(e2);
      g.e3.set(e3);
      // Last flight. It only starts once D is close (so on phones the card doesn't drift over
      // the pricing chapters) and it finishes a little before D is centred, so the card has
      // already landed wherever the visitor stops scrolling.
      const maxScroll = document.documentElement.scrollHeight - vh;
      const land = desktop ? rd.top + sy + rd.height / 2 - vh / 2 - vh * 0.08 : rd.top + sy - vh * 0.55;
      const e4 = Math.max(e3 + 1, Math.min(land, maxScroll));
      g.s4.set(Math.max(e3, e4 - vh * (desktop ? 0.7 : 0.4)));
      g.e4.set(e4);
      // On phones C→D spans the whole pricing section (thousands of px), so a scrub would move
      // the card hundreds of px per few px of scroll. Instead the card enters from the side at
      // D's own height, so it lands precisely and never passes over the section's text.
      g.cap.set(desktop ? Infinity : 0);
      g.offX.set(desktop ? 0 : window.innerWidth * 1.1);
      g.ready.set(1);
    };

    const ro = new ResizeObserver(measure);
    els.forEach((el) => ro.observe(el));
    // Re-measure while scrolling (max once per frame). Layout can shift after the first
    // measurement (fonts, images, hot reload) without any observed element resizing,
    // which would leave the card short of its slot.
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
    // motion values in `g` are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef, a, b, c, d, storyRef]);

  const { scrollY } = useScroll();
  const p1 = useTransform([scrollY, g.e1], ([y, e1]) => clamp01(y / e1));
  const p2 = useTransform([scrollY, g.e1, g.e2], ([y, e1, e2]) => clamp01((y - e1) / (e2 - e1)));
  const pin = useTransform([scrollY, g.e2, g.e3], ([y, e2, e3]) => Math.min(Math.max(y - e2, 0), e3 - e2));
  const s1 = useSpring(p1, SPRING);
  const p3 = useTransform([scrollY, g.s4, g.e4], ([y, s4, e4]) => clamp01((y - s4) / Math.max(1, e4 - s4)));
  const s2 = useSpring(p2, SPRING);
  const s3 = useSpring(p3, SPRING);

  useMotionValueEvent(p2, "change", (v) => setInPricing(v > 0.55));
  useMotionValueEvent(p3, "change", (v) => setInWhy(v > 0.5));

  const fade = ([t]) => 1 - clamp01(t);
  const x = useTransform([s1, s2, s3, p3, g.bx, g.cx, g.dx, g.offX, pointer.mx], ([t1, t2, t3, q3, bx, cx, dx, offX, m]) => {
    const start = offX ? dx - offX : cx; // phones: start off-screen to the left of D
    const jump = q3 > 0 ? start - cx : 0;
    return t1 * bx + t2 * (cx - bx) + jump + t3 * (dx - start) + m * PARALLAX_DEPTH * fade([t1]);
  });
  const y = useTransform(
    [s1, s2, s3, p3, g.by, g.cy, g.dy, pin, g.e2, g.e3, g.cap, pointer.my],
    ([t1, t2, t3, q3, by, cy, dy, pn, e2, e3, cap, m]) => {
      const from = cy + (e3 - e2); // where the card sits when the last flight begins
      const start = Math.max(from, dy - cap); // ...or a capped distance above D
      const jump = q3 > 0 ? start - from : 0; // happens off-screen, the moment the flight begins
      return t1 * by + t2 * (cy - by) + pn + jump + t3 * (dy - start) + m * PARALLAX_DEPTH * fade([t1]);
    }
  );
  const scale = useTransform([s1, s2, s3, g.sb, g.sc, g.sd], ([t1, t2, t3, sb, sc, sd]) => 1 + (sb - 1) * t1 + (sc - sb) * t2 + (sd - sc) * t3);
  // hero tilt straightens out; a little swing on each later flight
  const rotate = useTransform([s1, s2, s3], ([t1, t2, t3]) =>
    HERO_TILT * (1 - t1) + Math.sin(Math.PI * clamp01(t2)) * 7 - Math.sin(Math.PI * clamp01(t3)) * 7
  );

  const heroLabel = useTransform(p1, [0, 0.3], [1, 0]);
  const storyLabel = useTransform([p2, p3], ([t2, t3]) => clamp01((t2 - 0.7) / 0.3) * (1 - clamp01(t3 / 0.3)));
  const whyLabel = useTransform(p3, [0.7, 1], [0, 1]);

  const storyIndex = isDesktop ? Math.max(chapter, 0) : 0;
  const img = inWhy ? WHY_IMAGE : inPricing ? STORY_IMAGES[storyIndex] : HERO_IMAGE;
  const ch = CHAPTERS[storyIndex];

  return (
    <motion.div
      className="absolute z-20"
      style={{ left: g.left, top: g.top, width: g.width, x, y, scale, opacity: g.ready, transformOrigin: "0 0" }}
    >
      <motion.div style={{ rotate }}>
        {/* drop-in with a springy bounce when the hero is revealed */}
        <motion.div
          initial={{ y: -900, rotate: -28, opacity: 0 }}
          animate={start ? { y: 0, rotate: 0, opacity: 1 } : { y: -900, rotate: -28, opacity: 0 }}
          transition={{
            y: { type: "spring", stiffness: 170, damping: 10, mass: 1.1, delay: 0.75 },
            rotate: { type: "spring", stiffness: 120, damping: 8, delay: 0.75 },
            opacity: { duration: 0.2, delay: 0.75 },
          }}
          whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 300, damping: 10 } }}
        >
          <div className="float-a">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-silver/25 bg-onyx shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] sm:rounded-[28px]">
              {/* photo: wipes up to the next one when the story moves on */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={img.src}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.18, zIndex: 1 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, zIndex: 1 }}
                  exit={{ zIndex: 0, opacity: 0, transition: { opacity: { delay: 0.9, duration: 0 } } }}
                  transition={{ duration: 0.9, ease: EXPO }}
                >
                  <Image src={img.src} alt={img.alt} fill priority sizes="(max-width: 1024px) 60vw, 32vw" className="object-cover grayscale-[35%] contrast-[1.08]" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 z-[2] bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_70%,rgba(255,255,255,0.08)_100%)]" />

              {/* hero label */}
              <motion.div
                style={{ opacity: heroLabel }}
                className="absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-carbon via-carbon/70 to-transparent px-4 pb-4 pt-14 sm:px-6 sm:pb-6"
              >
                <p className="font-display text-metal text-3xl uppercase sm:text-4xl lg:text-5xl">Strength</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-silver sm:text-xs">training</p>
              </motion.div>

              {/* pricing-story label: chapter progress + current chapter */}
              <motion.div style={{ opacity: storyLabel }} className="pointer-events-none absolute inset-0 z-[3]">
                {isDesktop && (
                  <div className="absolute inset-x-5 top-5 flex gap-1.5">
                    {CHAPTERS.map((cc, i) => (
                      <span key={cc.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
                        <motion.span
                          className="block h-full origin-left bg-platinum"
                          animate={{ scaleX: i <= storyIndex ? 1 : 0 }}
                          transition={{ duration: 0.6, ease: EXPO }}
                        />
                      </span>
                    ))}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon via-carbon/70 to-transparent px-4 pb-4 pt-14 sm:px-6 sm:pb-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={ch.id}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EXPO }}
                    >
                      <p className="text-[10px] uppercase tracking-[0.4em] text-silver sm:text-xs">
                        Chapter {String(storyIndex + 1).padStart(2, "0")}
                      </p>
                      <p className="font-display text-metal mt-1 text-3xl uppercase sm:text-4xl lg:text-5xl">{ch.step}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* "Why Legion" label */}
              <motion.div
                style={{ opacity: whyLabel }}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-carbon via-carbon/70 to-transparent px-4 pb-4 pt-14 sm:px-6 sm:pb-6"
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-silver sm:text-xs">Why Legion</p>
                <p className="font-display text-metal mt-1 text-3xl uppercase sm:text-4xl xl:text-5xl">Built different</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* floor shadow */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: start ? 1 : 0 }}
        transition={{ delay: 1.15, duration: 0.6 }}
      >
        <div className="float-a-shadow mx-auto h-4 w-3/4 rounded-[50%] bg-black/70 blur-md" />
      </motion.div>
    </motion.div>
  );
}
