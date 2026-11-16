"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import {
  CHAPTERS,
  GENERAL_NOTES,
  INAUGURATION_OFFER,
  MEMBERSHIPS,
  PT_INCLUDES,
  PT_PACKAGES,
  STORY_IMAGES,
  TRANSFORMATIONS,
} from "@/lib/pricing";

const EXPO = [0.16, 1, 0.3, 1];
const fmt = (n) => n.toLocaleString("en-IN");

/* ---------- small pieces ---------- */

// Price that counts up when it scrolls into view, and re-animates when the value changes.
function CountUp({ value, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => fmt(Math.round(v)));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.1, ease: EXPO });
    return () => controls.stop();
  }, [inView, value, mv]);

  return (
    <span ref={ref} className={className}>
      ₹<motion.span>{text}</motion.span>
    </span>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-silver" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO, delay: 0.08 * i } }),
};
const inViewProps = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } };

// Image shown inline on phones/tablets (on desktop the pinned travelling card shows it).
function MobileStoryImage({ index }) {
  const img = STORY_IMAGES[index];
  return (
    // the unclipped wrapper watches the viewport; a clipped element never counts as "in view"
    <motion.div className="mx-auto mb-8 w-[52vw] max-w-[300px] lg:hidden" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-silver/25 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)]"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)", rotate: -4 },
          show: { clipPath: "inset(0% 0% 0% 0%)", rotate: 0, transition: { duration: 1.1, ease: EXPO } },
        }}
      >
        <Image src={img.src} alt={img.alt} fill loading="eager" sizes="52vw" className="object-cover grayscale-[35%] contrast-[1.08]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_70%,rgba(255,255,255,0.08)_100%)]" />
      </motion.div>
    </motion.div>
  );
}

function ChapterHead({ index }) {
  const c = CHAPTERS[index];
  return (
    <motion.header {...inViewProps} className="mb-8">
      <motion.div variants={rise} custom={0} className="flex items-center gap-4">
        <span className="font-display text-5xl text-transparent [-webkit-text-stroke:1px_rgba(191,191,195,0.45)] sm:text-6xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px w-10 bg-silver/40" />
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-steel sm:text-xs">{c.step}</span>
      </motion.div>
      <motion.h3 variants={rise} custom={1} className="font-display text-metal mt-3 text-[clamp(2.6rem,9vw,4.5rem)] uppercase">
        {c.title}
      </motion.h3>
    </motion.header>
  );
}

/* ---------- chapters ---------- */

function ChapterJoin() {
  return (
    <>
      <p className="mb-8 max-w-lg text-sm leading-relaxed text-steel sm:text-base">
        Every story starts with walking through the door. Pick the membership that fits your commitment —
        the longer you stay, the less you pay.
      </p>

      <motion.div {...inViewProps} className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4">
        {MEMBERSHIPS.map((m, i) => (
          <motion.div
            key={m.name}
            variants={rise}
            custom={i}
            className={`relative rounded-2xl border p-5 transition-colors ${
              m.best ? "border-silver/50 bg-gunmetal/60" : "border-gunmetal bg-onyx/70 hover:border-graphite"
            }`}
          >
            {m.best && (
              <span className="btn-metal absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]">
                Best value
              </span>
            )}
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-silver">{m.name}</p>
            <p className="mt-0.5 text-[11px] text-steel">{m.term}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <CountUp value={m.promo} className="font-display text-metal text-4xl" />
              <span className="text-xs text-steel line-through">₹{fmt(m.standard)}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="relative mt-5 overflow-hidden rounded-2xl border border-silver/40 bg-gradient-to-br from-gunmetal to-onyx p-5 sm:p-6"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: "spring", stiffness: 160, damping: 12 }}
      >
        <div className="pointer-events-none absolute -inset-y-4 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:sheen_3.6s_ease-in-out_infinite]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-silver">{INAUGURATION_OFFER.title}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm text-chrome">{INAUGURATION_OFFER.plan}</span>
          <CountUp value={INAUGURATION_OFFER.price} className="font-display text-metal text-5xl" />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-steel">{INAUGURATION_OFFER.note}</p>
      </motion.div>
    </>
  );
}

function ChapterCoach() {
  const [pick, setPick] = useState(0);
  const pkg = PT_PACKAGES[pick];

  return (
    <>
      <p className="mb-8 max-w-lg text-sm leading-relaxed text-steel sm:text-base">
        Then you meet your coach. Every PT client gets a dedicated trainer, a programme and diet plan built around
        their goals, and someone watching their form on every rep.
      </p>

      <motion.div {...inViewProps} className="rounded-2xl border border-gunmetal bg-onyx/70 p-5 sm:p-6">
        <motion.p variants={rise} className="text-[11px] font-medium uppercase tracking-[0.3em] text-steel">
          Sessions per month
        </motion.p>
        <motion.div variants={rise} custom={1} className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Sessions per month">
          {PT_PACKAGES.map((p, i) => (
            <button
              key={p.sessions}
              type="button"
              role="radio"
              aria-checked={pick === i}
              onClick={() => setPick(i)}
              className={`relative rounded-lg py-3 text-sm font-bold transition-colors ${
                pick === i ? "text-carbon" : "bg-gunmetal/50 text-silver hover:bg-gunmetal"
              }`}
            >
              {pick === i && (
                <motion.span layoutId="pt-pick" className="btn-metal absolute inset-0 rounded-lg" transition={{ type: "spring", stiffness: 400, damping: 28 }} />
              )}
              <span className="relative">{p.sessions}</span>
            </button>
          ))}
        </motion.div>

        <motion.div variants={rise} custom={2} className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <CountUp value={pkg.price} className="font-display text-metal text-5xl sm:text-6xl" />
            <span className="ml-2 text-xs text-steel">/ month</span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-steel">
            {pkg.sessions} sessions · ₹{fmt(pkg.price / pkg.sessions)} each
          </p>
        </motion.div>

        <motion.ul variants={rise} custom={3} className="mt-6 grid gap-2.5 border-t border-gunmetal pt-5 sm:grid-cols-2">
          {PT_INCLUDES.map((t) => (
            <li key={t} className="flex gap-2.5 text-sm text-silver">
              <Check />
              {t}
            </li>
          ))}
        </motion.ul>
        <p className="mt-5 text-[11px] text-steel">Gym membership is charged separately.</p>
      </motion.div>
    </>
  );
}

function ChapterTransform() {
  return (
    <>
      <p className="mb-8 max-w-lg text-sm leading-relaxed text-steel sm:text-base">
        For the ones who want a before and an after. Structured, goal-driven coaching with daily accountability —
        for fat loss, muscle gain, a physique goal or a big occasion.
      </p>

      <motion.div {...inViewProps} className="grid gap-4 md:grid-cols-2">
        {TRANSFORMATIONS.map((t, i) => (
          <motion.article
            key={t.name}
            variants={rise}
            custom={i}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 15 } }}
            className={`flex flex-col rounded-2xl border p-5 sm:p-6 ${
              t.featured ? "border-silver/50 bg-gunmetal/60" : "border-gunmetal bg-onyx/70"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-steel">{t.tag}</p>
            <h4 className="font-display mt-1 text-3xl uppercase text-chrome">{t.name}</h4>
            <CountUp value={t.price} className="font-display text-metal mt-4 text-5xl" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                [t.weeks, "weeks"],
                [t.sessions, "sessions"],
                [3, "per week"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-lg bg-carbon/60 py-2">
                  <p className="font-display text-2xl text-chrome">{n}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-steel">{l}</p>
                </div>
              ))}
            </div>
            <ul className="mt-5 grid gap-2.5">
              {t.includes.map((x) => (
                <li key={x} className="flex gap-2.5 text-sm text-silver">
                  <Check />
                  {x}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>

      <motion.div
        className="mt-5 rounded-2xl border border-dashed border-graphite p-5 text-xs leading-relaxed text-steel"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-bold uppercase tracking-[0.2em] text-silver">Conditional Results Assurance — T&amp;C apply. </span>
        If you fully follow the programme and don&apos;t see measurable progress on your agreed goals, we may offer a
        conditional refund or extra coaching at no added coaching fee, after review. Eligibility and remedies are set
        out in a signed agreement; no guaranteed physical outcome is implied. Gym membership not included.
      </motion.div>
    </>
  );
}

function ChapterCompete() {
  return (
    <>
      <p className="mb-8 max-w-lg text-sm leading-relaxed text-steel sm:text-base">
        And for some, the story ends under the stage lights. Specialised coaching for bodybuilding competitions and
        advanced physique development.
      </p>
      <motion.div {...inViewProps} className="rounded-2xl border border-silver/40 bg-gradient-to-br from-gunmetal to-onyx p-6 sm:p-8">
        <motion.p variants={rise} className="text-[10px] font-bold uppercase tracking-[0.3em] text-steel">
          Advanced contest preparation & physique coaching
        </motion.p>
        <motion.p variants={rise} custom={1} className="font-display text-metal mt-3 text-5xl uppercase sm:text-6xl">
          Custom quote
        </motion.p>
        <motion.p variants={rise} custom={2} className="mt-3 max-w-md text-sm text-silver">
          Pricing depends on your requirements, preparation timeline and coaching scope. We&apos;ll plan it together.
        </motion.p>
        <motion.a
          variants={rise}
          custom={3}
          href="#contact"
          className="btn-metal mt-6 inline-flex items-center gap-3 rounded-md px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
        >
          Request a quote
        </motion.a>
      </motion.div>
    </>
  );
}

const CHAPTER_BODIES = [ChapterJoin, ChapterCoach, ChapterTransform, ChapterCompete];

/* ---------- section ---------- */

export default function Pricing({ slotRef, storyRef, onChapter }) {
  return (
    <section id="pricing" className="bg-steel-wall grain relative overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-x-16 lg:gap-y-20">
          {/* intro */}
          <motion.div {...inViewProps} className="mx-auto max-w-3xl text-center lg:col-start-2 lg:row-start-1 lg:mx-0 lg:text-left">
            <motion.p variants={rise} className="text-[10px] font-medium uppercase tracking-[0.4em] text-steel sm:text-xs">
              Pricing & programmes
            </motion.p>
            <motion.h2 variants={rise} custom={1} className="font-display text-metal mt-4 text-[clamp(3rem,11vw,5.5rem)] uppercase">
              Every warrior has a story
            </motion.h2>
            <motion.p variants={rise} custom={2} className="mx-auto mt-5 max-w-xl text-sm lg:mx-0 leading-relaxed text-steel sm:text-base">
              Four chapters, from your first day on the floor to stepping on stage. Scroll through and find where yours
              begins.
            </motion.p>
          </motion.div>

          {/* left: the travelling card lands here, then stays pinned on desktop */}
          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div
              ref={slotRef}
              aria-hidden
              className="mx-auto aspect-[4/5] w-[52vw] max-w-[300px] lg:w-full lg:max-w-[400px]"
            />
          </div>

          {/* right: the chapters */}
          <div ref={storyRef} className="lg:col-start-2 lg:row-start-2">
            {CHAPTER_BODIES.map((Body, i) => (
              <motion.section
                key={CHAPTERS[i].id}
                aria-labelledby={`chapter-${i}`}
                className="flex min-h-0 flex-col justify-center border-t border-gunmetal py-14 first:border-t-0 first:pt-0 lg:min-h-[90vh] lg:py-20"
                viewport={{ margin: "-45% 0px -45% 0px" }}
                onViewportEnter={() => onChapter?.(i)}
              >
                {i > 0 && <MobileStoryImage index={i} />}
                <div id={`chapter-${i}`}>
                  <ChapterHead index={i} />
                </div>
                <Body />
              </motion.section>
            ))}
          </div>
        </div>

        {/* fine print */}
        <motion.ul {...inViewProps} className="mx-auto mt-16 grid max-w-4xl gap-3 border-t border-gunmetal pt-8 sm:grid-cols-2">
          {GENERAL_NOTES.map((n, i) => (
            <motion.li key={n} variants={rise} custom={i} className="flex gap-2.5 text-xs leading-relaxed text-steel">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-silver/60" />
              {n}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
