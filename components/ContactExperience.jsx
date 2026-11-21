"use client";

import { motion } from "framer-motion";
import Navbar from "./Navbar";
import EnquirySection from "./EnquirySection";
import ContactCards from "./ContactCards";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

const EXPO = [0.16, 1, 0.3, 1];
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, ease: EXPO, delay: 0.1 + i * 0.1 } }),
};

export default function ContactExperience() {
  return (
    <>
      <main className="relative overflow-clip">
        {/* intro */}
        <section className="bg-steel-wall grain relative overflow-hidden px-4 pb-4 pt-32 sm:px-6 sm:pt-36 lg:px-10 lg:pt-40">
          <Navbar start />
          <motion.span
            aria-hidden
            className="font-display pointer-events-none absolute -right-[3%] top-[22%] select-none text-[22vw] uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(191,191,195,0.07)] lg:text-[14vw]"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: EXPO, delay: 0.2 }}
          >
            Contact
          </motion.span>
          <motion.div className="relative mx-auto max-w-3xl text-center" initial="hidden" animate="show">
            <motion.p variants={rise} className="font-label text-[10px] uppercase text-steel sm:text-xs">
              Contact
            </motion.p>
            <motion.h1 variants={rise} custom={1} className="font-display text-metal mt-4 text-[clamp(2.2rem,8vw,4.75rem)] uppercase leading-[1.05]">
              Let&apos;s talk training
            </motion.h1>
            <motion.p variants={rise} custom={2} className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-steel sm:text-base">
              Send us an enquiry, call, WhatsApp or drop by — we&apos;ll help you find the right plan.
            </motion.p>
          </motion.div>
        </section>

        <EnquirySection />
        <ContactCards />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
