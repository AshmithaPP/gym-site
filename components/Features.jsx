"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FEATURES } from "@/lib/features";

const EXPO = [0.16, 1, 0.3, 1];
const FLY = 300; // px each desktop pill travels out from behind the card

function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false
  );
}

function Icon({ name }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    check: <path d="M5 12.5l4.5 4.5L19 7.5" {...common} />,
    clock: (
      <g {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5l3 2" />
      </g>
    ),
    plate: (
      <g {...common}>
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3.5" />
      </g>
    ),
    scan: (
      <g {...common}>
        <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
        <circle cx="12" cy="9" r="2" />
        <path d="M8.5 16.5c.6-2 1.9-3 3.5-3s2.9 1 3.5 3" />
      </g>
    ),
    chat: <path d="M5 18.5V7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6a2.5 2.5 0 0 1-2.5 2.5H9l-4 2.5z" {...common} />,
    chart: <path d="M4 19h16M7 15l3.5-4 3 2.5L18 8" {...common} />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      {paths[name]}
    </svg>
  );
}

// Card styled after the reference: icon in a soft circle, title, one-line subtitle.
function PillBody({ f }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-gunmetal bg-onyx/85 px-4 py-4 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-colors hover:border-graphite sm:px-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gunmetal text-chrome ring-1 ring-graphite">
        <Icon name={f.icon} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-chrome sm:text-[15px]">{f.title}</span>
        <span className="mt-0.5 block text-xs text-steel">{f.sub}</span>
      </span>
    </div>
  );
}

// Desktop: scrubbed by scroll — slides out from behind the centre card with a springy settle.
function DesktopPill({ f, side, row, progress }) {
  const start = 0.35 + row * 0.1;
  const t = useTransform(progress, [start, start + 0.35], [0, 1]);
  const x = useTransform(t, (v) => (1 - v) * FLY * -side);
  const scale = useTransform(t, [0, 1], [0.7, 1]);
  const rotate = useTransform(t, (v) => (1 - v) * side * -8);
  const opacity = useTransform(t, [0, 0.35], [0, 1]);

  return (
    <motion.div className="w-full max-w-[320px]" style={{ x, scale, rotate, opacity }} whileHover={{ y: -4 }}>
      <PillBody f={f} />
    </motion.div>
  );
}

// Phones / tablets: slide in from alternating sides as each card enters the viewport.
function MobilePill({ f, index }) {
  const from = index % 2 ? 40 : -40;
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: from, scale: 0.94 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 160, damping: 16 }}
    >
      <PillBody f={f} />
    </motion.div>
  );
}

export default function Features({ slotRef }) {
  const stageRef = useRef(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 14, mass: 0.6 });

  const left = FEATURES.slice(0, 3);
  const right = FEATURES.slice(3);

  const renderSide = (list, side) =>
    list.map((f, row) =>
      isDesktop ? (
        <DesktopPill key={f.title} f={f} side={side} row={row} progress={progress} />
      ) : (
        <MobilePill key={f.title} f={f} index={row + (side > 0 ? 3 : 0)} />
      )
    );

  return (
    <section id="about" className="bg-steel-wall grain relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 sm:pb-32 lg:px-10 lg:pt-32">
      <motion.div
        className="mx-auto mb-12 max-w-2xl text-center lg:mb-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        {[
          <p key="k" className="font-label text-[10px] font-medium uppercase tracking-[0.4em] text-steel sm:text-xs">
            Why Legion
          </p>,
          <h2 key="h" className="font-display text-metal mt-4 text-[clamp(2.2rem,9vw,4.75rem)] uppercase">
            Built different
          </h2>,
          <p key="p" className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-steel sm:text-base">
            Every chapter of your story is coached, measured and adjusted. This is what you get when you train with us.
          </p>,
        ].map((el) => (
          <motion.div
            key={el.key}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO } } }}
          >
            {el}
          </motion.div>
        ))}
      </motion.div>

      <div
        ref={stageRef}
        className="mx-auto grid max-w-6xl grid-cols-1 items-center justify-items-center gap-4 sm:max-w-xl lg:max-w-6xl lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12 lg:gap-y-0"
      >
        {/* landing spot for the travelling card — first on phones, centre column on desktop */}
        <div ref={slotRef} aria-hidden className="order-first mb-6 aspect-[4/5] w-[52vw] max-w-[300px] lg:order-none lg:col-start-2 lg:row-start-1 lg:mb-0 lg:w-[300px]" />

        <div className="flex w-full flex-col gap-4 lg:col-start-1 lg:row-start-1 lg:items-end lg:gap-6">{renderSide(left, -1)}</div>
        <div className="flex w-full flex-col gap-4 lg:col-start-3 lg:row-start-1 lg:items-start lg:gap-6">{renderSide(right, 1)}</div>
      </div>
    </section>
  );
}
