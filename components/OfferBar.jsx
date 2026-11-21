"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { INAUGURATION_OFFER } from "@/lib/pricing";
import { useEnquiry } from "./Enquiry";

const fmt = (n) => n.toLocaleString("en-IN");

/*
  Sticky bottom bar (after the reference): grand-opening offer on the left, Join now on the
  right, which scrolls to the enquiry form. Hidden over the hero; slides up once the visitor has
  scrolled past it (hero bottom above the middle of the screen) and hides again on the way back.
*/
export default function OfferBar() {
  const openEnquiry = useEnquiry();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", () => {
    const hero = document.getElementById("home");
    if (hero) setShow(hero.getBoundingClientRect().bottom < window.innerHeight * 0.5);
  });

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[70] overflow-hidden border-t border-white/70 bg-[linear-gradient(180deg,#f4f4f5_0%,#d4d4d8_55%,#b4b4b9_100%)] shadow-[0_-14px_34px_-10px_rgba(0,0,0,0.85)]"
      initial={{ y: "110%" }}
      animate={{ y: show ? "0%" : "110%" }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      role="region"
      aria-label="Grand opening offer"
    >
      <div aria-hidden className="pointer-events-none absolute -inset-y-6 -left-1/3 w-1/4 rotate-12 bg-gradient-to-r from-transparent via-white/70 to-transparent [animation:sheen_5s_ease-in-out_infinite]" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-6 sm:py-3 lg:px-10">
        <div className="min-w-0">
          <p className="font-display truncate text-[13px] text-carbon uppercase leading-tight xs:text-[15px] sm:text-lg">
            Grand Opening Offer
          </p>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-gunmetal sm:text-xs">
            Annual membership ₹{fmt(INAUGURATION_OFFER.price)}
            <span className="hidden xs:inline"> · First 100 members only</span>
            <span className="hidden sm:inline"> · + GST</span>
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => openEnquiry("Grand Opening Offer — Annual Membership")}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-carbon px-5 py-2.5 text-chrome shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_16px_-4px_rgba(0,0,0,0.6)] transition-colors hover:bg-charcoal text-[11px] font-bold uppercase tracking-[0.18em] sm:px-7 sm:py-3 sm:text-xs"
        >
          Join now
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
