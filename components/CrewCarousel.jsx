"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { TEAM } from "@/lib/team";

/*
  "Meet the Legion Crew" — interactive card deck.
  The active card sits in front; neighbours fan out behind it in 3D. It auto-advances while
  on screen (pauses on hover, drag or keyboard focus). Visitors can also scroll sideways
  (trackpad swipe / Shift + wheel), swipe or drag, use ← →, click a side card or a role chip.
*/

const CREW = TEAM.filter((m) => m.visible !== false);
const N = CREW.length;
const AUTO_MS = 3500;
const TBA = "To be announced";

function useIsWide() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true
  );
}

// shortest signed distance from the active card, wrapping around the deck
const offsetOf = (i, index) => {
  let d = i - index;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
};

function RoleIcon({ name, className = "h-10 w-10" }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    crown: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" {...c} />,
    gear: (
      <g {...c}>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
      </g>
    ),
    pulse: <path d="M2.5 12h4l2-5 4 10 2.5-6 1.5 1h5" {...c} />,
    dumbbell: <path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" {...c} />,
    heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z" {...c} />,
    sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" {...c} />,
    plus: (
      <g {...c}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v8M8 12h8" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {icons[name] ?? icons.plus}
    </svg>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-gunmetal py-2.5 first:border-t-0">
      <dt className="font-label shrink-0 text-[9px] uppercase text-steel">{label}</dt>
      <dd className={`text-right text-[13px] ${value ? "text-chrome" : "italic text-graphite"}`}>{value || TBA}</dd>
    </div>
  );
}

function CrewCard({ m, active }) {
  return (
    <article className="overflow-hidden rounded-[26px] border border-gunmetal bg-onyx shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]">
      {/* photo / placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {m.photo ? (
          <Image src={m.photo} alt={m.name || m.role} fill sizes="380px" className="object-cover grayscale-[30%]" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_35%,#3d3d41_0%,#1e1e20_55%,#0b0b0c_100%)] text-silver">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-graphite bg-carbon/60">
              <RoleIcon name={m.icon} />
            </span>
            <span className="font-label text-[9px] uppercase text-steel">Photo coming soon</span>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.12)_0%,transparent_32%)]" />
        <span className="font-label absolute left-4 top-4 rounded-full bg-carbon/80 px-3 py-1 text-[9px] uppercase text-silver backdrop-blur">
          {m.group}
        </span>
        {m.status && (
          <span className="btn-metal absolute right-4 top-4 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em]">
            {m.status === "planned" ? "Planned role" : "Open slot"}
          </span>
        )}
      </div>

      {/* details */}
      <div className="p-5 sm:p-6">
        <p className="font-label text-[9px] uppercase text-steel">{m.focus}</p>
        <h3 className="font-display text-metal mt-2 text-xl uppercase leading-tight sm:text-2xl">{m.role}</h3>
        <p className={`mt-1 text-sm ${m.name ? "text-platinum" : "italic text-steel"}`}>{m.name || "Name to be announced"}</p>

        {m.tagline && <p className="font-display mt-4 text-base uppercase leading-snug text-chrome">“{m.tagline}”</p>}
        {m.blurb && <p className="mt-2 text-[13px] leading-relaxed text-steel">{m.blurb}</p>}

        <motion.dl
          className="mt-4"
          initial={false}
          animate={{ opacity: active ? 1 : 0.35 }}
          transition={{ duration: 0.4 }}
        >
          <Detail label="Certifications" value={m.certifications} />
          <Detail label="Experience" value={m.experience} />
          <Detail label="Specialty" value={m.specialty} />
        </motion.dl>
        {m.note && <p className="font-label mt-3 text-[9px] uppercase text-silver">{m.note}</p>}
      </div>
    </article>
  );
}

export default function CrewCarousel() {
  const [index, setIndex] = useState(0);
  const wide = useIsWide();
  const go = (step) => setIndex((i) => (((i + step) % N) + N) % N);

  // auto-advance while the deck is on screen and not being interacted with
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const [hold, setHold] = useState(false);
  const running = inView && !hold;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % N), AUTO_MS);
    return () => clearTimeout(id);
  }, [index, running]);

  // sideways scroll (trackpad swipe or Shift + wheel) moves the deck; vertical scroll is left
  // alone so the page still scrolls normally. One card per gesture.
  const deckRef = useRef(null);
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    let acc = 0;
    let locked = false;
    let unlock;
    const onWheel = (e) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      if (locked) return;
      acc += dx;
      if (Math.abs(acc) > 40) {
        const step = Math.sign(acc); // capture now — React runs the updater later, after acc is reset
        setIndex((i) => (((i + step) % N) + N) % N);
        acc = 0;
        locked = true;
        clearTimeout(unlock);
        unlock = setTimeout(() => (locked = false), 450);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(unlock);
    };
  }, []);

  // keep the active role chip visible in the (phone) horizontally-scrolling chip row —
  // scrolls only that row, never the page
  const chipsRef = useRef(null);
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.children[index];
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);

  // the deck's height follows the active card (cards differ in height), easing between sizes
  const cardRefs = useRef([]);
  const [deckH, setDeckH] = useState(null);
  useEffect(() => {
    const el = cardRefs.current[index];
    if (!el) return;
    const ro = new ResizeObserver(() => setDeckH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  // fan-out geometry per distance from the active card
  const layout = (off) => {
    const a = Math.abs(off);
    const spread = wide ? [0, 74, 132] : [0, 70, 120];
    if (a > 2)
      return { x: `${Math.sign(off) * 150}%`, scale: 0.6, rotateY: -Math.sign(off) * 30, opacity: 0, filter: "blur(4px) brightness(0.55)", zIndex: 0 };
    return {
      x: `${Math.sign(off) * spread[a]}%`,
      scale: [1, 0.84, 0.7][a],
      rotateY: -Math.sign(off) * [0, 16, 26][a],
      opacity: wide ? [1, 0.45, 0.18][a] : [1, 0.35, 0][a],
      filter: `blur(${[0, 2.5, 4][a]}px) brightness(${[1, 0.7, 0.55][a]})`,
      zIndex: 10 - a,
    };
  };

  return (
    <div
      ref={rootRef}
      className="outline-none"
      tabIndex={0}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      aria-roledescription="carousel"
      aria-label="Meet the Legion Crew"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {/* deck */}
      <div ref={deckRef} className="relative mx-auto h-[600px] w-full touch-pan-y transition-[height] duration-500 ease-out" style={deckH ? { height: deckH + 16 } : undefined}>
        {CREW.map((m, i) => {
          const off = offsetOf(i, index);
          const active = off === 0;
          const { zIndex, ...pose } = layout(off);
          return (
            // full-width centring wrapper (no transform) so cards of any breakpoint width stay centred
            <div key={m.id} className="pointer-events-none absolute inset-x-0 top-0 flex justify-center [perspective:1600px]" style={{ zIndex }}>
              <motion.div
                className="w-[min(86vw,340px)] sm:w-[360px] lg:w-[380px]"
                style={{ transformStyle: "preserve-3d", pointerEvents: Math.abs(off) > 2 ? "none" : "auto" }}
                initial={false}
                animate={pose}
                transition={{ type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}
                onClick={() => !active && setIndex(i)}
                drag={active ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setHold(true)}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                  setHold(false);
                }}
                aria-hidden={!active}
              >
                <div ref={(el) => (cardRefs.current[i] = el)} className={active ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}>
                  <CrewCard m={m} active={active} />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* counter + auto-advance progress */}
      <div className="mt-4 flex flex-col items-center gap-2.5">
        <p className="font-display text-lg text-chrome" aria-live="polite">
          {String(index + 1).padStart(2, "0")}
          <span className="text-graphite"> / {String(N).padStart(2, "0")}</span>
        </p>
        <span className="relative h-[3px] w-28 overflow-hidden rounded-full bg-gunmetal">
          <motion.span
            key={`${index}-${running}`}
            className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-silver via-platinum to-silver"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: running ? 1 : 0 }}
            transition={{ duration: running ? AUTO_MS / 1000 : 0.2, ease: "linear" }}
          />
        </span>
      </div>

      {/* role chips */}
      <div ref={chipsRef} className="relative mx-auto mt-8 flex max-w-5xl gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible">
        {CREW.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index ? "true" : undefined}
            className={`relative shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              i === index ? "text-carbon" : "border border-gunmetal text-steel hover:border-graphite hover:text-silver"
            }`}
          >
            {i === index && (
              <motion.span layoutId="crew-chip" className="btn-metal absolute inset-0 rounded-full" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="relative">{m.group === "Coaching" ? m.focus : m.role.replace("Chief Executive Officer", "CEO").replace("Chief Operating Officer", "COO")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
