"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import CrewCarousel from "./CrewCarousel";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

const EXPO = [0.16, 1, 0.3, 1];

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, ease: EXPO, delay: 0.1 + i * 0.1 } }),
};

const STANDARDS = [
  ["Certified coaches", "Qualified professionals delivering structured, safe, science-backed coaching."],
  ["Zero rotation", "PT clients keep one dedicated trainer for their whole programme."],
  ["One roof", "Strength, cardio, CrossFit, recovery and in-house physiotherapy."],
];

export default function AboutExperience() {
  return (
    <>
      <main className="relative overflow-clip">
        {/* intro */}
        <section className="bg-steel-wall grain relative overflow-hidden px-4 pb-10 pt-32 sm:px-6 sm:pt-36 lg:px-10 lg:pt-40">
          <Navbar start />
          <motion.span
            aria-hidden
            className="font-display pointer-events-none absolute -right-[4%] top-[18%] select-none text-[24vw] uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(191,191,195,0.07)] lg:text-[15vw]"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: EXPO, delay: 0.2 }}
          >
            Crew
          </motion.span>

          <motion.div className="relative mx-auto max-w-3xl text-center" initial="hidden" animate="show">
            <motion.p variants={rise} className="font-label text-[10px] uppercase text-steel sm:text-xs">
              About Legion
            </motion.p>
            <motion.h1 variants={rise} custom={1} className="font-display text-metal mt-4 text-[clamp(2.2rem,8vw,4.75rem)] uppercase leading-[1.05]">
              Meet the Legion Crew
            </motion.h1>
            <motion.p variants={rise} custom={2} className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-steel sm:text-base">
              Twelve roles, one standard. From leadership and clinical care to the coaches on the floor and the people
              who keep it running — this is the team behind every warrior.
            </motion.p>
          </motion.div>

          <motion.ul className="relative mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3" initial="hidden" animate="show">
            {STANDARDS.map(([t, d], i) => (
              <motion.li key={t} variants={rise} custom={3 + i} className="rounded-2xl border border-gunmetal bg-onyx/70 p-4 text-center sm:text-left">
                <p className="font-display text-sm uppercase text-chrome">{t}</p>
                <p className="mt-1 text-xs leading-relaxed text-steel">{d}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* crew deck */}
        <section id="crew" className="bg-steel-wall grain relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: EXPO }}
          >
            <CrewCarousel />
          </motion.div>
        </section>

        {/* CTA */}
        <section className="bg-steel-wall grain relative px-4 pb-24 sm:px-6 lg:px-10">
          <motion.div
            className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-gunmetal bg-onyx/80 p-8 text-center sm:p-10 md:flex-row md:justify-between md:text-left"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <div>
              <p className="font-display text-metal text-2xl uppercase sm:text-3xl">Train with the crew</p>
              <p className="mt-2 text-sm text-steel">Tell us your goal and we&apos;ll match you with the right coach.</p>
            </div>
            <Link
              href="/#enquiry"
              className="btn-metal inline-flex shrink-0 items-center gap-3 rounded-md px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
            >
              Enquire now
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
