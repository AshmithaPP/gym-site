"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitEnquiry } from "@/lib/enquiry";

/*
  Enquiry flow for the pricing cards.
  There is no backend, so a submitted enquiry opens WhatsApp (SITE.whatsapp) or the visitor's
  mail app (SITE.email) with the message pre-filled. Until one of those is set in lib/site.js
  the form says so instead of pretending to send.
*/

const EnquiryContext = createContext(() => {});
const EXPO = [0.16, 1, 0.3, 1];

// open the enquiry pop-up from anywhere: const open = useEnquiry(); open("Plan name")
export const useEnquiry = () => useContext(EnquiryContext);

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
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");

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

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    const f = new FormData(e.currentTarget);
    const res = await submitEnquiry({
      plan,
      name: f.get("name"),
      email: f.get("email"),
      phone: f.get("phone"),
      message: f.get("message"),
    });
    if (res.success) {
      setStatus("sent");
    } else {
      setStatus("error");
      setErrorMessage(res.error || "Failed to send enquiry. Please try again.");
    }
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

        {status === "sent" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="btn-metal flex h-16 w-16 items-center justify-center rounded-full">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h4 className="font-display text-metal mt-6 text-2xl uppercase">Enquiry Received</h4>
            <p className="mt-3 max-w-xs text-sm text-steel">
              Thank you! We have received your enquiry and sent a confirmation email to your inbox.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-metal mt-6 rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em]"
            >
              Close
            </button>
          </div>
        ) : (
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
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={field}
                placeholder="Your email address"
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

            {status === "error" && (
              <p
                role="alert"
                className="rounded-lg border border-dashed border-red-500/50 bg-red-950/20 p-3 text-xs leading-relaxed text-red-300"
              >
                {errorMessage || "Failed to send enquiry. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-metal mt-2 rounded-md py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send enquiry"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
