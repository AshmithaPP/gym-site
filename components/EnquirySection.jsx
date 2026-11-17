"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendEnquiry } from "@/lib/enquiry";

const EXPO = [0.16, 1, 0.3, 1];

// Options mirror the programmes in the pricing brief.
const NEEDS = [
  "Gym membership",
  "Personal training",
  "6-week transformation",
  "12-week transformation",
  "Contest prep & physique coaching",
  "Not sure yet — help me choose",
];
const SESSIONS = ["Morning", "Evening"];

const STEPS = [
  ["01", "Tell us your goal", "Pick what you're training for — or let us help you choose."],
  ["02", "Choose your time", "Morning or evening, we'll plan around your day."],
  ["03", "We get back to you", "Our team reaches out to talk programmes and pricing."],
];

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO, delay: 0.07 * i } }),
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } };

const field =
  "w-full rounded-xl border border-gunmetal bg-carbon/70 px-4 py-3.5 text-sm text-chrome outline-none transition-colors placeholder:text-graphite focus:border-silver";

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="font-label mb-2 block text-[10px] uppercase text-silver">
      {children}
    </label>
  );
}

export default function EnquirySection() {
  const [session, setSession] = useState(SESSIONS[0]);
  const [status, setStatus] = useState("idle"); // idle | sent | not-connected

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const sent = sendEnquiry({
      subject: `Enquiry: ${f.get("need")}`,
      lines: [`Name: ${f.get("name")}`, `Phone: ${f.get("phone")}`, `Training need: ${f.get("need")}`, `Preferred session: ${session}`],
    });
    setStatus(sent ? "sent" : "not-connected");
    if (sent) e.currentTarget.reset();
  };

  return (
    <section id="enquiry" className="bg-steel-wall grain relative overflow-hidden px-4 py-24 sm:px-6 sm:py-28 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* left: pitch */}
        <motion.div {...inView} className="text-center lg:text-left">
          <motion.p variants={rise} className="font-label text-[10px] uppercase text-steel sm:text-xs">
            Enquiry
          </motion.p>
          <motion.h2 variants={rise} custom={1} className="font-display text-metal mt-4 text-[clamp(2.2rem,8vw,4.25rem)] uppercase">
            Start your story
          </motion.h2>
          <motion.p variants={rise} custom={2} className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-steel sm:text-base lg:mx-0">
            Tell us what you want to train for and when you can make it. We&apos;ll help you pick the right plan.
          </motion.p>

          <ul className="mx-auto mt-10 grid max-w-md gap-5 text-left lg:mx-0">
            {STEPS.map(([n, t, d], i) => (
              <motion.li key={n} variants={rise} custom={3 + i} className="flex gap-4">
                <span className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-graphite text-sm text-chrome">
                  {n}
                </span>
                <span>
                  <span className="block text-sm font-bold uppercase text-chrome">{t}</span>
                  <span className="mt-1 block text-sm text-steel">{d}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* right: form */}
        <motion.div
          className="relative rounded-3xl border border-gunmetal bg-onyx/85 p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur sm:p-8"
          initial={{ opacity: 0, y: 60, rotate: 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="sent"
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
              >
                <span className="btn-metal flex h-16 w-16 items-center justify-center rounded-full">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </svg>
                </span>
                <p className="font-display text-metal mt-6 text-3xl uppercase">Almost there</p>
                <p className="mt-3 max-w-xs text-sm text-steel">Send the message that just opened and our team will get back to you.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-silver underline-offset-8 hover:text-platinum hover:underline"
                >
                  Send another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} {...inView} exit={{ opacity: 0 }} className="grid gap-5">
                <motion.div variants={rise}>
                  <Label htmlFor="enq-name">Name</Label>
                  <input id="enq-name" name="name" required autoComplete="name" placeholder="Your full name" className={field} />
                </motion.div>

                <motion.div variants={rise} custom={1}>
                  <Label htmlFor="enq-phone">Number</Label>
                  <input
                    id="enq-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9+\s\-]{8,}"
                    title="Enter a valid phone number"
                    placeholder="Your phone number"
                    className={field}
                  />
                </motion.div>

                <motion.div variants={rise} custom={2}>
                  <Label htmlFor="enq-need">Training need</Label>
                  <div className="relative">
                    <select id="enq-need" name="need" required defaultValue="" className={`${field} appearance-none pr-11`}>
                      <option value="" disabled>
                        Choose your goal
                      </option>
                      {NEEDS.map((n) => (
                        <option key={n} value={n} className="bg-onyx">
                          {n}
                        </option>
                      ))}
                    </select>
                    <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>

                <motion.fieldset variants={rise} custom={3}>
                  <legend className="font-label mb-2 block text-[10px] uppercase text-silver">Session</legend>
                  <div role="radiogroup" className="grid grid-cols-2 gap-2 rounded-xl border border-gunmetal bg-carbon/70 p-1.5">
                    {SESSIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={session === s}
                        onClick={() => setSession(s)}
                        className={`relative flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase transition-colors ${
                          session === s ? "text-carbon" : "text-silver hover:text-platinum"
                        }`}
                      >
                        {session === s && (
                          <motion.span layoutId="enq-session" className="btn-metal absolute inset-0 rounded-lg" transition={{ type: "spring", stiffness: 420, damping: 30 }} />
                        )}
                        <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          {s === "Morning" ? (
                            <>
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
                            </>
                          ) : (
                            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
                          )}
                        </svg>
                        <span className="relative">{s}</span>
                      </button>
                    ))}
                  </div>
                </motion.fieldset>

                {status === "not-connected" && (
                  <p role="alert" className="rounded-lg border border-dashed border-graphite p-3 text-xs leading-relaxed text-steel">
                    Online enquiries aren&apos;t connected yet. Please visit or call the front desk for now.
                  </p>
                )}

                <motion.button
                  variants={rise}
                  custom={4}
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-metal group relative mt-1 inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl py-4 text-xs font-bold uppercase tracking-[0.25em]"
                >
                  <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 skew-x-[-20deg] bg-white/50 opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100" />
                  Send enquiry
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
