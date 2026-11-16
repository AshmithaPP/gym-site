"use client";

import { motion, useTransform } from "framer-motion";
import Navbar from "./Navbar";
import PhotoCard from "./PhotoCard";

const EXPO = [0.16, 1, 0.3, 1];

// The front card is <TravelCard/>; it sits over the hero slot below and scrolls into the next section.
const CARDS = [
  {
    src: "/images/hero-deadlift.jpg",
    alt: "Lifter setting up a heavy deadlift",
    title: "Power",
    sub: "lifting",
    rotate: 16,
    depth: 44,
    delay: 0.95,
    float: "float-b",
    // tilted card that runs off the right edge, like the second can
    className: "right-[-10%] top-[30%] z-10 w-[52%] sm:right-[-4%] sm:w-[44%] lg:right-[-16%] lg:top-[26%] lg:w-[50%]",
  },
];

function BounceCard({ card, start, mx, my }) {
  const x = useTransform(mx, (v) => v * card.depth);
  const y = useTransform(my, (v) => v * card.depth);

  return (
    <motion.div className={`absolute ${card.className}`} style={{ x, y }}>
      {/* drop-in with a springy bounce */}
      <motion.div
        initial={{ y: -900, rotate: card.rotate - 28, opacity: 0 }}
        animate={start ? { y: 0, rotate: card.rotate, opacity: 1 } : { y: -900, rotate: card.rotate - 28, opacity: 0 }}
        transition={{
          y: { type: "spring", stiffness: 170, damping: 10, mass: 1.1, delay: card.delay },
          rotate: { type: "spring", stiffness: 120, damping: 8, delay: card.delay },
          opacity: { duration: 0.2, delay: card.delay },
        }}
        whileHover={{ scale: 1.05, rotate: card.rotate * 0.4, transition: { type: "spring", stiffness: 300, damping: 10 } }}
      >
        {/* idle float */}
        <div className={card.float}>
          <PhotoCard src={card.src} alt={card.alt} title={card.title} sub={card.sub} />
        </div>
      </motion.div>

      {/* floor shadow that breathes with the float */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: start ? 1 : 0 }}
        transition={{ delay: card.delay + 0.4, duration: 0.6 }}
      >
        <div className={`mx-auto h-4 w-3/4 rounded-[50%] bg-black/70 blur-md ${card.float}-shadow`} />
      </motion.div>
    </motion.div>
  );
}

export default function Hero({ start, pointer, slotRef }) {
  const { rawX, rawY, mx, my } = pointer;

  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const line = {
    hidden: { y: "110%" },
    show: (i) => ({ y: "0%", transition: { duration: 1.1, ease: EXPO, delay: 0.25 + i * 0.12 } }),
  };
  const fade = {
    hidden: { opacity: 0, y: 24 },
    show: (d) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EXPO, delay: d } }),
  };
  const state = start ? "show" : "hidden";

  return (
    <section
      id="home"
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="bg-steel-wall grain relative min-h-[100svh] overflow-hidden"
    >
      <Navbar start={start} />

      {/* giant outlined word in the background */}
      <motion.span
        aria-hidden
        className="font-display pointer-events-none absolute bottom-[-4%] right-[-2%] select-none text-[34vw] uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(191,191,195,0.08)] lg:bottom-auto lg:top-[8%] lg:text-[22vw]"
        initial={{ opacity: 0, x: 80 }}
        animate={start ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
        transition={{ duration: 1.6, ease: EXPO, delay: 0.4 }}
      >
        Legion
      </motion.span>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:px-10 lg:pb-0 lg:pt-24">
        {/* copy */}
        <div className="relative z-30">
          <motion.div
            className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.4em] text-steel sm:text-xs"
            variants={fade}
            custom={0.2}
            initial="hidden"
            animate={state}
          >
            <span className="h-px w-8 bg-silver/60 sm:w-12" />
            Where warriors are made
          </motion.div>

          <h1 className="font-display text-metal whitespace-nowrap text-[13vw] uppercase sm:text-[11vw] lg:text-[clamp(4rem,6.4vw,5.75rem)]">
            {["Train harder", "Live stronger"].map((t, i) => (
              <span key={t} className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" variants={line} custom={i} initial="hidden" animate={state}>
                  {t}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-md text-sm leading-relaxed text-steel sm:text-base"
            variants={fade}
            custom={0.55}
            initial="hidden"
            animate={state}
          >
            Heavy iron, expert coaching and a crew that pushes you further. Build real strength, sharpen your
            conditioning and become the strongest version of yourself at Legion Fitness.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap items-center gap-5" variants={fade} custom={0.7} initial="hidden" animate={state}>
            <a
              href="#programs"
              className="btn-metal group inline-flex items-center gap-3 rounded-md px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
            >
              Explore more
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#pricing" className="text-xs font-medium uppercase tracking-[0.2em] text-silver underline-offset-8 hover:text-platinum hover:underline">
              View pricing
            </a>
          </motion.div>
        </div>

        {/* bouncing gym photos */}
        <div className="relative mx-auto h-[400px] w-full max-w-[560px] xs:h-[460px] sm:h-[540px] lg:mx-0 lg:h-[min(78vh,660px)] lg:max-w-none">
          <div
            ref={slotRef}
            aria-hidden
            className="absolute left-[4%] top-[4%] aspect-[4/5] w-[56%] sm:left-[10%] sm:w-[48%] lg:left-[6%] lg:top-[2%] lg:w-[54%]"
          />
          {CARDS.map((card) => (
            <BounceCard key={card.src} card={card} start={start} mx={mx} my={my} />
          ))}
        </div>
      </div>
    </section>
  );
}
