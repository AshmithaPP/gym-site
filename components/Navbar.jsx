"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = ["Home", "About", "Programs", "Trainers", "Pricing"];

export default function Navbar({ start }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -30 }}
      animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-10 lg:py-7">
        <a href="#home" aria-label="Legion Fitness home" className="shrink-0">
          <Image
            src="/images/legion-logo.png"
            alt="Legion Fitness — Where warriors are made"
            width={1198}
            height={210}
            priority
            className="h-7 w-auto sm:h-9 lg:h-10"
          />
        </a>

        <ul className="hidden items-center gap-8 lg:flex xl:gap-11">
          {LINKS.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="group relative text-[12px] font-medium uppercase tracking-[0.2em] text-steel transition-colors hover:text-platinum"
              >
                {l}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-silver transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="btn-metal hidden rounded-md px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            Contact
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-gunmetal lg:hidden"
          >
            <span className={`h-px w-5 bg-chrome transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-chrome transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mx-4 overflow-hidden rounded-xl border border-gunmetal bg-onyx/95 backdrop-blur lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-col p-2">
              {LINKS.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-silver hover:bg-gunmetal hover:text-platinum"
                  >
                    {l}
                  </a>
                </li>
              ))}
              <li className="p-2 sm:hidden">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn-metal block rounded-md py-3 text-center text-xs font-bold uppercase tracking-[0.2em]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
