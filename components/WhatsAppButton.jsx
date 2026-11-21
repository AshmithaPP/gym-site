"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { whatsappLink } from "@/lib/enquiry";

const MESSAGE = "Hi Legion Fitness! I'd like to know more about your memberships and programmes.";

/*
  Floating WhatsApp button, bottom-right on every section once the visitor starts scrolling.
  Until SITE.whatsapp is set in lib/site.js it scrolls to the enquiry form instead of opening
  a broken chat link.
*/
export default function WhatsAppButton() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 160));

  const href = whatsappLink(MESSAGE);
  const linkProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { href: "/#enquiry" };

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="wa"
          {...linkProps}
          aria-label={href ? "Chat with Legion Fitness on WhatsApp" : "Send Legion Fitness an enquiry"}
          className="group fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-[80] flex items-center sm:bottom-24 sm:right-6"
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          {/* tooltip (pointer devices) */}
          <span className="font-label pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full border border-gunmetal bg-onyx/95 px-4 py-2 text-[10px] uppercase text-chrome opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
            Chat with us
          </span>

          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_-6px_rgba(37,211,102,0.55)] sm:h-12 sm:w-12">
            {/* soft pulse */}
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.4s]" />
            <svg viewBox="0 0 32 32" className="relative h-[22px] w-[22px] sm:h-6 sm:w-6" fill="currentColor" aria-hidden>
              <path d="M16.02 3C8.84 3 3 8.83 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.97 12.97 0 0 0 16.02 29C23.2 29 29 23.17 29 16S23.2 3 16.02 3zm0 23.8c-2.03 0-4.02-.55-5.75-1.58l-.41-.25-3.96 1.04 1.06-3.86-.27-.4A10.73 10.73 0 0 1 5.24 16c0-5.95 4.84-10.79 10.78-10.79 5.95 0 10.78 4.84 10.78 10.79S21.97 26.8 16.02 26.8zm5.91-8.07c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.22.32-.84 1.06-1.03 1.28-.19.22-.38.24-.7.08-.32-.16-1.37-.5-2.6-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.5.14-.66.15-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.22.05-.4-.03-.57-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.12 1.32 3.33.16.22 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.25 1.48.21 2.03.13.62-.09 1.92-.78 2.19-1.54.27-.76.27-1.41.19-1.54-.08-.14-.3-.22-.62-.38z" />
            </svg>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
