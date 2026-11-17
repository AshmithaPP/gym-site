"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendEnquiry } from "@/lib/enquiry";

/*
  Enquiry flow for the pricing cards.
  There is no backend, so a submitted enquiry opens WhatsApp (SITE.whatsapp) or the visitor's
  mail app (SITE.email) with the message pre-filled. Until one of those is set in lib/site.js
  the form says so instead of pretending to send.
*/

const EnquiryContext = createContext(() => {});
const EXPO = [0.16, 1, 0.3, 1];

export function EnquiryProvider({ children }) {
  const [plan, setPlan] = useState(null);
  return (
    <EnquiryContext.Provider value={setPlan}>
      {children}
      <AnimatePresence>
        {plan && (
          <EnquiryModal
            key="enquiry"
            plan={plan}
            onClose={() => setPlan(null)}
          />
        )}
      </AnimatePresence>
    </EnquiryContext.Provider>
  );
}

export function EnquireButton({
  plan,
  className = "",
  variant = "solid",
  label = "Enquire",
}) {
  const open = useContext(EnquiryContext);
  const styles =
    variant === "solid"
      ? "btn-metal text-carbon"
      : "border border-graphite text-silver hover:border-silver hover:text-platinum";
  return (
    <motion.button
      type="button"
      onClick={() => open(plan)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${styles} ${className}`}
    >
      {label}
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

function EnquiryModal({ plan, onClose }) {
  const firstField = useRef(null);
  const [notConnected, setNotConnected] = useState(false);

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const sent = sendEnquiry({
      subject: `Enquiry: ${f.get("plan")}`,
      lines: [
        `Name: ${f.get("name")}`,
        `Phone: ${f.get("phone")}`,
        f.get("message") ? `Message: ${f.get("message")}` : null,
      ],
    });
    if (sent) onClose();
    else setNotConnected(true);
  };

  const field =
    "w-full rounded-lg border border-gunmetal bg-carbon/70 px-4 py-3 text-sm text-chrome placeholder:text-graphite outline-none transition-colors focus:border-silver";

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        onClick={(e) => e.stopPropagation()}
        className="grain relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-gunmetal bg-onyx p-6 shadow-2xl sm:rounded-3xl sm:p-8"
        initial={{ y: 80, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{
          y: 60,
          scale: 0.96,
          opacity: 0,
          transition: { duration: 0.25, ease: EXPO },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gunmetal text-silver hover:border-silver hover:text-platinum"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <p className="font-label text-[10px] uppercase text-steel">Enquiry</p>
        <h3
          id="enquiry-title"
          className="font-display text-metal mt-2 pr-10 text-2xl uppercase sm:text-3xl"
        >
          {plan}
        </h3>
        <p className="mt-2 text-sm text-steel">
          Leave your details and our team will get back to you.
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input type="hidden" name="plan" value={plan} />
          <label className="grid gap-1.5">
            <span className="font-label text-[10px] uppercase text-silver">
              Name
            </span>
            <input
              ref={firstField}
              name="name"
              required
              autoComplete="name"
              className={field}
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-label text-[10px] uppercase text-silver">
              Phone
            </span>
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              className={field}
              placeholder="Your phone number"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-label text-[10px] uppercase text-silver">
              Message (optional)
            </span>
            <textarea
              name="message"
              rows={3}
              className={`${field} resize-none`}
              placeholder="Goals, preferred timings, questions…"
            />
          </label>

          {notConnected && (
            <p
              role="alert"
              className="rounded-lg border border-dashed border-graphite p-3 text-xs leading-relaxed text-steel"
            >
              Online enquiries aren&apos;t connected yet. Please visit or call
              the front desk for now.
            </p>
          )}

          <button
            type="submit"
            className="btn-metal mt-2 rounded-md py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
          >
            Send enquiry
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
