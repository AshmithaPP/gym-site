"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/enquiry";

/*
  Contact detail cards. Built from lib/site.js — a card only appears when its detail is set.
  Each card rises in with a stagger, tilts towards the pointer (mouse only), and gets a
  light sweep + icon bounce on hover.
*/

const EXPO = [0.16, 1, 0.3, 1];
const tel = (n) => `tel:${n.replace(/[^\d+]/g, "")}`;

function Icon({ name }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    pin: (
      <g {...c}>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </g>
    ),
    phone: <path d="M5 3.5h3.2l1.6 4.2-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.2 1.6V17a2 2 0 0 1-2 2A14.5 14.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" {...c} />,
    whatsapp: (
      <g {...c}>
        <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
        <path d="M9.2 8.6c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.4.8-.5.3-1.5.5-2.6.1a8 8 0 0 1-4.4-4.4c-.4-1.1-.2-2.1.1-2.6z" />
      </g>
    ),
    mail: (
      <g {...c}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M4 7l8 6 8-6" />
      </g>
    ),
    clock: (
      <g {...c}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      {icons[name]}
    </svg>
  );
}

function TiltCard({ card, i }) {
  const isEmail = card.icon === "mail";
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="[perspective:1000px]"
      initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 120, damping: 15, delay: i * 0.1 }}
    >
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover="hover"
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gunmetal bg-onyx/85 p-6 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] backdrop-blur transition-colors hover:border-graphite sm:p-7 xl:p-5 2xl:p-7"
      >
        {/* light sweep */}
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

        <motion.span
          variants={{ hover: { y: -4, rotate: -8, scale: 1.08 } }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="btn-metal flex h-14 w-14 items-center justify-center rounded-2xl"
        >
          <Icon name={card.icon} />
        </motion.span>

        <p className="font-label mt-6 text-[10px] uppercase text-steel">{card.label}</p>
        <h3 className="font-display text-metal mt-2 text-base uppercase leading-tight sm:text-lg">{card.title}</h3>

        <div className="mt-3 grid gap-1">
          {card.lines.map((l) =>
            l.href ? (
              <a
                key={l.text}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className={`text-chrome underline-offset-4 transition-colors hover:text-platinum hover:underline ${
                  isEmail
                    ? "whitespace-nowrap text-xs sm:text-[13px] xl:text-[11.5px] 2xl:text-sm tracking-tight lowercase [font-family:system-ui,-apple-system,sans-serif]"
                    : "[overflow-wrap:anywhere] text-sm sm:text-[15px]"
                }`}
              >
                {l.text}
              </a>
            ) : (
              <p
                key={l.text}
                className={`text-chrome ${
                  isEmail
                    ? "whitespace-nowrap text-xs sm:text-[13px] xl:text-[11.5px] 2xl:text-sm tracking-tight lowercase [font-family:system-ui,-apple-system,sans-serif]"
                    : "[overflow-wrap:anywhere] text-sm sm:text-[15px]"
                }`}
              >
                {l.text}
              </p>
            )
          )}
        </div>

        {card.action && (
          <a
            href={card.action.href}
            target={card.action.external ? "_blank" : undefined}
            rel={card.action.external ? "noopener noreferrer" : undefined}
            className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-silver transition-colors hover:text-platinum"
          >
            {card.action.label}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </motion.article>
    </motion.div>
  );
}

export default function ContactCards() {
  const wa = whatsappLink("Hi Legion Fitness! I'd like to know more about your memberships and programmes.");
  const phones = [SITE.phone, SITE.phone2].filter(Boolean);

  const cards = [
    (SITE.address || SITE.mapUrl) && {
      icon: "pin",
      label: "Visit us",
      title: "Find the gym",
      lines: [{ text: SITE.address && SITE.address !== "Google Maps Location" ? SITE.address : "Legion Fitness on Google Maps" }],
      action: SITE.mapUrl && { label: "Open in Maps", href: SITE.mapUrl, external: true },
    },
    phones.length && {
      icon: "phone",
      label: "Call us",
      title: "Talk to the team",
      lines: phones.map((p) => ({ text: p, href: tel(p) })),
      action: { label: "Call now", href: tel(phones[0]) },
    },
    wa && {
      icon: "whatsapp",
      label: "WhatsApp",
      title: "Chat with us",
      lines: [{ text: SITE.whatsapp }],
      action: { label: "Start chat", href: wa, external: true },
    },
    SITE.email && {
      icon: "mail",
      label: "Email",
      title: "Write to us",
      lines: [{ text: SITE.email, href: `mailto:${SITE.email}` }],
      action: { label: "Send email", href: `mailto:${SITE.email}` },
    },
    SITE.hours && {
      icon: "clock",
      label: "Hours",
      title: "When we're open",
      lines: [{ text: SITE.hours }],
    },
  ].filter(Boolean);

  return (
    <section id="contact-details" className="bg-steel-wall grain relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
      <motion.div
        className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EXPO }}
      >
        <p className="font-label text-[10px] uppercase text-steel sm:text-xs">Reach us</p>
        <h2 className="font-display text-metal mt-3 text-[clamp(2rem,6.5vw,3.5rem)] uppercase">Contact details</h2>
      </motion.div>

      <div className={`mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 sm:gap-5 ${cards.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
        {cards.map((c, i) => (
          <TiltCard key={c.label} card={c} i={i} />
        ))}
      </div>
    </section>
  );
}
