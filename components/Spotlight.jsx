"use client";

import { motion } from "framer-motion";
import { useEnquiry } from "./Enquiry";

const WORD = "STRENGTH";
const EXPO = [0.16, 1, 0.3, 1];

function SpotlightCopy({ className, view }) {
  const openEnquiry = useEnquiry();
  return (
    <motion.div
      className={`flex-col ${className}`}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={view}
      transition={{ duration: 0.9, ease: EXPO, delay: 0.3 }}
    >
      <p className="max-w-md text-sm leading-relaxed text-steel sm:text-base lg:text-sm xl:text-base">
        Progressive strength programs built around the big lifts, coached by
        people who actually lift.
      </p>
      <button
        type="button"
        onClick={() => openEnquiry("Strength Training Program")}
        className="btn-metal mt-6 inline-flex items-center gap-3 rounded-md px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
      >
        Join now
      </button>
    </motion.div>
  );
}

/*
  Second section, after the "GREEN APPLE" reference: a huge word sits behind the
  centre slot, and the hero photo (TravelCard) lands in that slot as you scroll.
*/
export default function Spotlight({ slotRef }) {
  const view = { once: false, amount: 0.35 };

  return (
    <section
      id="programs"
      className="bg-steel-wall grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6"
    >
      <div className="relative flex w-full justify-center">
        {/* giant word behind the card */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
          <div className="inline-flex flex-col">
            {/* the heading triggers the reveal: the letters start clipped, so they can't be "in view" themselves */}
            <motion.h2
              aria-label="Strength"
              className="font-display flex whitespace-nowrap text-[14vw] uppercase leading-[0.9] drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)] lg:text-[min(13.5vw,12.5rem)]"
              initial="hidden"
              whileInView="show"
              viewport={view}
            >
              {WORD.split("").map((ch, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="inline-block overflow-hidden pb-[0.04em]"
                >
                  <motion.span
                    className="text-metal-flat inline-block"
                    variants={{
                      hidden: { y: "105%" },
                      show: {
                        y: "0%",
                        transition: {
                          duration: 0.9,
                          ease: EXPO,
                          delay:
                            0.05 + Math.abs(i - (WORD.length - 1) / 2) * 0.06,
                        },
                      },
                    }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
            <motion.span
              className="font-display mt-1 self-start pl-[0.4vw] text-[4vw] uppercase leading-none text-gunmetal lg:text-[min(2.6vw,2.4rem)]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={view}
              transition={{ duration: 0.9, ease: EXPO, delay: 0.35 }}
            >
              Training
            </motion.span>
          </div>
        </div>

        {/* landing spot for the travelling hero card */}
        <div
          ref={slotRef}
          className="relative aspect-[4/5] w-[52vw] max-w-[340px] sm:w-[40vw] lg:w-[24vw] lg:max-w-[380px]"
        />

        {/* desktop: to the right of the card, under "GTH", clear of the card's path */}
        <SpotlightCopy
          view={view}
          className="absolute right-[calc(50%-min(41vw,38rem))] top-[calc(50%+min(6.5vw,6rem))] z-30 hidden w-[min(22vw,20rem)] items-end text-right lg:flex"
        />
      </div>

      {/* phones / tablets: below the card */}
      <SpotlightCopy
        view={view}
        className="relative z-30 mt-14 flex items-center text-center lg:hidden"
      />
    </section>
  );
}
