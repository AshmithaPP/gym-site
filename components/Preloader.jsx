"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import GymGuys from "./GymGuys";

const STEPS = [0, 9, 18, 27, 40, 52, 60, 71, 84, 93, 100];
const EASE_QUART = [0.76, 0, 0.24, 1];

/*
  Stages
  count → counter ticks to 100 while the guys train
  lift  → the guys squat down for a beat, then launch up out of view
  leave → the whole panel slides up and the hero is revealed
*/
export default function Preloader({ onReveal, onFinish }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState("count");
  const value = STEPS[step];

  useEffect(() => {
    if (stage !== "count") return;
    if (step < STEPS.length - 1) {
      const delay = reduce ? 60 : step === 0 ? 700 : 260 + ((step * 37) % 5) * 30;
      const t = setTimeout(() => setStep((s) => s + 1), delay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage("lift"), reduce ? 100 : 500);
    return () => clearTimeout(t);
  }, [step, stage, reduce]);

  useEffect(() => {
    if (stage !== "lift") return;
    const t = setTimeout(() => {
      setStage("leave");
      onReveal?.();
    }, reduce ? 50 : 750);
    return () => clearTimeout(t);
  }, [stage, reduce, onReveal]);

  const liftDistance = typeof window !== "undefined" ? window.innerHeight * 1.2 : 1200;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-steel-wall grain"
      initial={{ y: 0 }}
      animate={stage === "leave" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: reduce ? 0.2 : 1, ease: EASE_QUART }}
      onAnimationComplete={() => {
        if (stage === "leave") onFinish?.();
      }}
      aria-live="polite"
      aria-busy={stage === "count"}
    >
      {/* spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(228,228,231,0.12)_0%,transparent_65%)]" />

      {/* the two lifters */}
      <motion.div
        className="relative w-[78vw] max-w-[560px] sm:w-[60vw] lg:w-[40vw]"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={
          stage === "count"
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 1, y: [0, 22, -liftDistance], scale: [1, 1.04, 0.9] }
        }
        transition={
          stage === "count"
            ? { type: "spring", stiffness: 120, damping: 14, delay: 0.15 }
            : { duration: reduce ? 0.2 : 1.1, times: [0, 0.22, 1], ease: ["easeOut", [0.7, 0, 0.84, 0]] }
        }
      >
        <GymGuys className="h-auto w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]" />
      </motion.div>

      <motion.p
        className="font-label relative mt-6 text-center text-[10px] font-medium uppercase tracking-[0.45em] text-steel sm:text-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={stage === "count" ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: stage === "count" ? 0.5 : 0 }}
      >
        Where warriors are made
      </motion.p>

      {/* rolling counter, bottom-right like the reference */}
      <div className="absolute bottom-6 right-5 flex items-end gap-3 sm:bottom-10 sm:right-10">
        <span className="font-label mb-2 text-[10px] uppercase tracking-[0.35em] text-steel sm:mb-4 sm:text-xs">Loading</span>
        <div className="relative h-[64px] overflow-hidden drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)] sm:h-[96px] lg:h-[128px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              className="font-display text-metal-flat block text-[64px] leading-none sm:text-[96px] lg:text-[128px]"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {String(value).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* progress line */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gunmetal">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-steel via-platinum to-silver"
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
