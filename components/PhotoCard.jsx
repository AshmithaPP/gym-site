"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* Photo card styled after the cans in the reference: rounded, steel sheen, label at the bottom. */
export default function PhotoCard({ src, alt, title, sub, labelOpacity, sizes = "(max-width: 1024px) 60vw, 32vw" }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-silver/25 bg-onyx shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] sm:rounded-[28px]">
      <Image src={src} alt={alt} fill priority sizes={sizes} className="object-cover grayscale-[35%] contrast-[1.08]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_70%,rgba(255,255,255,0.08)_100%)]" />
      {title && (
        <motion.div
          style={labelOpacity ? { opacity: labelOpacity } : undefined}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon via-carbon/70 to-transparent px-4 pb-4 pt-14 sm:px-6 sm:pb-6"
        >
          <p className="font-display text-metal text-3xl uppercase sm:text-4xl lg:text-5xl">{title}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-silver sm:text-xs">{sub}</p>
        </motion.div>
      )}
    </div>
  );
}
