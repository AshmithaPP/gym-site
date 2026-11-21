"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FOOTER_LINKS, SITE } from "@/lib/site";

const EXPO = [0.16, 1, 0.3, 1];

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO, delay: i * 0.07 } }),
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.3 } };

const SOCIAL_ICONS = {
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" />
    </g>
  ),
  facebook: <path d="M13.5 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.3-1.4 1.4-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7v2.1H8.2V13h2.4v7z" fill="currentColor" />,
  youtube: (
    <g>
      <rect x="3" y="6" width="18" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor" />
    </g>
  ),
};

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 18, mass: 0.5 });
  // curtain-style reveal: the content lags behind the scroll, as if sitting underneath the page
  const contentY = useTransform(progress, [0, 1], ["-18%", "0%"]);

  const contact = [
    (SITE.address || SITE.mapUrl) && {
      label: "Visit",
      value: SITE.address && !SITE.address.startsWith("http") ? SITE.address : "Google Maps",
      href: SITE.mapUrl || (SITE.address && SITE.address.startsWith("http") ? SITE.address : undefined),
    },
    SITE.phone && { label: "Call", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
    SITE.phone2 && { label: "Call", value: SITE.phone2, href: `tel:${SITE.phone2.replace(/\s/g, "")}` },
    SITE.whatsapp && {
      label: "WhatsApp",
      value: SITE.whatsapp,
      href: `https://wa.me/${(SITE.whatsapp || "").replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`,
    },
    SITE.email && { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    SITE.hours && { label: "Hours", value: SITE.hours },
  ].filter(Boolean);
  const socials = Object.entries(SITE.socials).filter(([, url]) => url);
  // read the year in the browser only — Next can't prerender a live clock value
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => null
  );

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="contact" ref={ref} className="grain relative overflow-hidden border-t border-gunmetal bg-carbon">
      {/* soft top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(228,228,231,0.08),transparent_70%)]" />

      <motion.div style={{ y: contentY }} className="relative mx-auto max-w-7xl px-4 pb-44 pt-20 sm:px-6 sm:pt-24 lg:px-10 lg:pt-28">
        {/* CTA */}
        <motion.div {...inView} className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <motion.p variants={rise} className="font-label text-[10px] font-medium uppercase tracking-[0.4em] text-steel sm:text-xs">
              Your story starts today
            </motion.p>
            <motion.h2 variants={rise} custom={1} className="font-display text-metal mt-4 text-[clamp(2rem,6vw,3.75rem)] uppercase">
              Ready to become
              <br />a warrior?
            </motion.h2>
          </div>
          <motion.div variants={rise} custom={2}>
            <p className="max-w-md text-sm leading-relaxed text-steel sm:text-base">
              Start with a membership, add a coach, or commit to a full transformation. Every warrior begins with the
              first rep.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/#pricing"
                className="btn-metal inline-flex items-center gap-3 rounded-md px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
              >
                Join now
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {SITE.phone && (
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="rounded-md border border-graphite px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-silver transition-colors hover:border-silver hover:text-platinum"
                >
                  Call us
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="my-14 h-px origin-left bg-gradient-to-r from-silver/50 via-gunmetal to-transparent sm:my-16"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 1.2, ease: EXPO }}
        />

        {/* columns */}
        <motion.div
          {...inView}
          className={`grid grid-cols-2 gap-x-6 gap-y-10 ${contact.length ? "lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]" : "lg:grid-cols-[1.6fr_1fr_1fr]"}`}
        >
          <motion.div variants={rise} className="col-span-2 lg:col-span-1">
            <Image src="/images/legion-logo.png" alt="Legion Fitness" width={1198} height={210} className="h-9 w-auto sm:h-10" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel">
              Strength, coaching and accountability under one roof. {SITE.tagline}.
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(([name, url]) => (
                  <motion.a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 12 } }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gunmetal text-silver transition-colors hover:border-silver hover:text-platinum"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      {SOCIAL_ICONS[name]}
                    </svg>
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {FOOTER_LINKS.map((col, ci) => (
            <motion.nav key={col.title} variants={rise} custom={ci + 1} aria-label={col.title}>
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.3em] text-silver">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group inline-flex items-center gap-2 text-sm text-steel transition-colors hover:text-platinum">
                      <span className="h-px w-0 bg-platinum transition-all duration-300 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          {contact.length > 0 && (
            <motion.div variants={rise} custom={3} className="col-span-2 lg:col-span-1">
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.3em] text-silver">Contact</p>
              <ul className="mt-5 space-y-3">
                {contact.map((c) => (
                  <li key={c.label + c.value} className="text-sm">
                    <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-graphite">{c.label}</span>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-steel transition-colors hover:text-platinum"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <span className="text-steel">{c.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-start gap-5 border-t border-gunmetal pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-steel">
            ©{year ? ` ${year}` : ""} {SITE.name}. All rights reserved. <span className="text-graphite">·</span> Prices exclusive of GST.
          </p>
          <motion.button
            type="button"
            onClick={scrollTop}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
            className="font-label group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-silver"
          >
            Back to top
            <span className="btn-metal flex h-9 w-9 items-center justify-center rounded-full">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </motion.button>
        </div>
      </motion.div>
    </footer>
  );
}
