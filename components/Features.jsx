"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { CORE_DIFFERENTIATORS } from "@/lib/features";

/*
  Compact "Why Legion?" section (sits right before the enquiry form).
  The travelling story card lands in the centre slot (slotRef → <TravelCard/>), and the four
  core differentiators slide out from behind it as you scroll — two to each side on desktop,
  stacked under the card on phones/tablets.
*/

const EXPO = [0.16, 1, 0.3, 1];
const FLY = 280; // px each desktop card travels out from behind the centre card

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
    coach: (
      <g {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </g>
    ),
    userCheck: (
      <g {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M16 11l2 2 4-4" />
      </g>
    ),
    shield: (
      <g {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </g>
    ),
    facility: <path d="M6 18h12M6 6h12M9 6v12M15 6v12M4 9h2v6H4zM18 9h2v6h-2z" {...common} />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      {paths[name] ?? paths.shield}
    </svg>
  );
}

// Same layout on both sides: icon on the left, short title + one-line promise, left-aligned.
function CardBody({ item }) {
  return (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-gunmetal bg-onyx/85 p-5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-colors hover:border-graphite lg:min-h-[128px]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gunmetal text-chrome ring-1 ring-graphite">
        <Icon name={item.icon} />
      </span>
      <span className="min-w-0 text-left">
        <span className="font-display block text-[17px] uppercase leading-tight text-chrome sm:text-lg">{item.title}</span>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-steel sm:text-sm">{item.short}</span>
      </span>
    </div>
  );
}

// Desktop: scrubbed by scroll — slides out from behind the centre card and settles with a spring.
function DesktopCard({ item, side, row, progress }) {
  const start = 0.35 + row * 0.14;
  const t = useTransform(progress, [start, start + 0.35], [0, 1]);
  const x = useTransform(t, (v) => (1 - v) * FLY * -side);
  const scale = useTransform(t, [0, 1], [0.7, 1]);
  const rotate = useTransform(t, (v) => (1 - v) * side * -8);
  const opacity = useTransform(t, [0, 0.35], [0, 1]);

  return (
    <motion.div className="w-full max-w-[360px]" style={{ x, scale, rotate, opacity }} whileHover={{ y: -4 }}>
      <CardBody item={item} />
    </motion.div>
  );
}

// Phones / tablets: slide in from alternating sides as each card enters the viewport.
function MobileCard({ item, index }) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: index % 2 ? 40 : -40, scale: 0.94 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 160, damping: 16 }}
    >
      <CardBody item={item} />
    </motion.div>
  );
}

export default function Features({ slotRef }) {
  const stageRef = useRef(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 14, mass: 0.6 });

  const left = CORE_DIFFERENTIATORS.slice(0, 2);
  const right = CORE_DIFFERENTIATORS.slice(2);

  const renderSide = (list, side) =>
    list.map((item, row) =>
      isDesktop ? (
        <DesktopCard key={item.id} item={item} side={side} row={row} progress={progress} />
      ) : (
        <MobileCard key={item.id} item={item} index={row + (side > 0 ? 2 : 0)} />
      )
    );

  return (
    <section id="about" className="bg-steel-wall grain relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
      <div id="why-legion">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center lg:mb-14"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {[
            <p key="k" className="font-label text-[10px] uppercase text-steel sm:text-xs">
              Why Legion?
            </p>,
            <h2 key="h" className="font-display text-metal mt-4 text-[clamp(2rem,7vw,3.75rem)] uppercase">
              Built different
            </h2>,
            <p key="p" className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-steel sm:text-base">
              Four promises we keep, every single day.
            </p>,
          ].map((el) => (
            <motion.div key={el.key} variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO } } }}>
              {el}
            </motion.div>
          ))}
        </motion.div>

        <div
          ref={stageRef}
          className="mx-auto grid max-w-xl grid-cols-1 items-center justify-items-center gap-4 sm:grid-cols-2 lg:max-w-6xl lg:grid-cols-[1fr_auto_1fr] lg:gap-x-10 lg:gap-y-0"
        >
          {/* landing spot for the travelling card — first on phones, centre column on desktop */}
          <div
            ref={slotRef}
            aria-hidden
            className="order-first mb-6 aspect-[4/5] w-[52vw] max-w-[280px] sm:col-span-2 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:w-[280px]"
          />

          <div className="contents lg:col-start-1 lg:row-start-1 lg:flex lg:w-full lg:flex-col lg:items-end lg:gap-6">{renderSide(left, -1)}</div>
          <div className="contents lg:col-start-3 lg:row-start-1 lg:flex lg:w-full lg:flex-col lg:items-start lg:gap-6">{renderSide(right, 1)}</div>
        </div>
      </div>
    </section>
  );
}
