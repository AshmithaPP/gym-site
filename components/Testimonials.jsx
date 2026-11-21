"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/testimonials";

/*
  Member stories carousel (after the reference layout, in Legion's steel palette):
  centre card = headline + quote + name/plan chips on the left, framed photo on the right;
  slim photo cards on each side shrink towards the edges, joined by little connector tabs.
  Auto-advances (pauses on hover/focus); side cards, dots, arrows and swipe all navigate.
  Sample reviews show a small "Sample" tag until real ones replace them in lib/testimonials.js.
*/

const EXPO = [0.16, 1, 0.3, 1];
const AUTO_MS = 6000;
const STORIES = TESTIMONIALS.filter((t) => t.image);
const N = STORIES.length;
const at = (i) => STORIES[((i % N) + N) % N];

function Connector({ className = "" }) {
  return <span aria-hidden className={`h-8 w-3 shrink-0 rounded-full border-y border-graphite/60 bg-gunmetal ${className}`} />;
}

// Slim neighbour card: just the photo; clicking it jumps to that story.
function SidePill({ story, onClick, size, dir, className = "" }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Show ${story.name}'s story`}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={`shrink-0 rounded-[26px] border border-gunmetal bg-onyx/90 p-2 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] ${size} ${className}`}
    >
      <span className="relative block h-full w-full overflow-hidden rounded-[20px]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.span
            key={story.name}
            custom={dir}
            className="absolute inset-0"
            variants={{
              enter: (d) => ({ x: d * 40, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d) => ({ x: d * -40, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EXPO }}
          >
            <Image src={story.image} alt="" fill sizes="110px" className="object-cover grayscale-[45%]" />
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

export default function Testimonials() {
  const [[index, dir], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const t = at(index);

  const go = (step) => setState(([i]) => [(((i + step) % N) + N) % N, step > 0 ? 1 : -1]);
  const jump = (i) => setState(([cur]) => [i, i >= cur ? 1 : -1]);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setState(([i]) => [(i + 1) % N, 1]), AUTO_MS);
    return () => clearTimeout(id);
  }, [index, paused]);

  return (
    <section id="stories" className="bg-steel-wall grain relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <motion.div
        className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EXPO }}
      >
        <p className="font-label text-[10px] uppercase text-steel sm:text-xs">Member stories</p>
        <h2 className="font-display text-metal mt-3 text-[clamp(2rem,6.5vw,3.75rem)] uppercase">Voices of the Legion</h2>
      </motion.div>

      <motion.div
        className="mx-auto flex max-w-7xl items-center justify-center"
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* left neighbours */}
        <SidePill story={at(index - 2)} dir={dir} onClick={() => go(-2)} size="h-[230px] w-[70px]" className="hidden xl:block" />
        <Connector className="hidden xl:block" />
        <SidePill story={at(index - 1)} dir={dir} onClick={() => go(-1)} size="h-[300px] w-[92px] lg:h-[340px] lg:w-[104px]" className="hidden md:block" />
        <Connector className="hidden md:block" />

        {/* centre card */}
        <div className="w-full max-w-[880px] rounded-[30px] border border-gunmetal bg-onyx/90 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur sm:p-3 md:w-[min(560px,66vw)] lg:w-[min(780px,62vw)]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={t.name}
              custom={dir}
              className="grid cursor-grab touch-pan-y active:cursor-grabbing lg:grid-cols-[1fr_1.05fr]"
              variants={{
                enter: (d) => ({ opacity: 0, x: d * 50, filter: "blur(6px)" }),
                center: { opacity: 1, x: 0, filter: "blur(0px)" },
                exit: (d) => ({ opacity: 0, x: d * -50, filter: "blur(6px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: EXPO }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) go(1);
                else if (info.offset.x > 50) go(-1);
              }}
              aria-live="polite"
            >
              {/* text */}
              <div className="flex flex-col p-5 sm:p-7 lg:min-h-[400px]">
                <h3 className="font-display text-metal text-[clamp(1.5rem,4vw,2rem)] uppercase leading-[1.1] lg:text-[clamp(1.4rem,2.4vw,2.25rem)]">{t.highlight}</h3>
                <blockquote className="mt-6 text-base leading-relaxed text-chrome sm:text-lg lg:mt-auto lg:pt-8">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex flex-col items-start gap-2">
                  <span className="flex items-center gap-2">
                    <span className="rounded-md bg-gunmetal/80 px-2.5 py-1 text-xs font-semibold text-platinum">{t.name}</span>
                    {t.sample && (
                      <span className="font-label rounded-full border border-dashed border-graphite px-2 py-0.5 text-[8px] uppercase text-steel" title="Sample review — replace with a real member review">
                        Sample
                      </span>
                    )}
                  </span>
                  <span className="rounded-md bg-gunmetal/50 px-2.5 py-1 text-xs text-silver">{t.plan} · Legion Fitness</span>
                </div>
              </div>

              {/* photo */}
              <div className="relative order-first aspect-[16/10] overflow-hidden rounded-[22px] lg:order-none lg:aspect-auto">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: EXPO }}
                >
                  <Image src={t.image} alt={t.imageAlt} fill sizes="(max-width: 1024px) 92vw, 420px" className="object-cover grayscale-[30%] contrast-[1.08]" />
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,transparent_30%)]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon via-carbon/60 to-transparent px-5 pb-5 pt-16 text-center">
                  <p className="font-display text-metal text-xl uppercase sm:text-2xl">{t.plan}</p>
                  <p className="font-label mt-1 text-[9px] uppercase text-silver">Where warriors are made</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* right neighbours */}
        <Connector className="hidden md:block" />
        <SidePill story={at(index + 1)} dir={dir} onClick={() => go(1)} size="h-[300px] w-[92px] lg:h-[340px] lg:w-[104px]" className="hidden md:block" />
        <Connector className="hidden xl:block" />
        <SidePill story={at(index + 2)} dir={dir} onClick={() => go(2)} size="h-[230px] w-[70px]" className="hidden xl:block" />
      </motion.div>

      {/* dots — the active one stretches and fills while it waits to advance */}
      <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10" role="tablist" aria-label="Choose a member story">
        {STORIES.map((s, i) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Story ${i + 1}: ${s.name}`}
            onClick={() => jump(i)}
            className={`relative h-2 overflow-hidden rounded-full transition-all duration-500 ${
              i === index ? "w-16 bg-gunmetal sm:w-20" : "w-2 bg-graphite hover:bg-steel"
            }`}
          >
            {i === index && (
              <motion.span
                key={`${index}-${paused}`}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-silver via-platinum to-silver"
                initial={{ scaleX: paused ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: paused ? 0 : AUTO_MS / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
