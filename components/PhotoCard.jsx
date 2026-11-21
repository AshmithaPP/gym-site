"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* Photo card styled after the cans in the reference: rounded, steel sheen, label at the bottom. */
export default function PhotoCard({ src, alt, title, sub, labelOpacity, sizes = "(max-width: 1024px) 60vw, 32vw" }) {
  return (
    <div className="@container relative aspect-[4/5] overflow-hidden rounded-[22px] border border-silver/25 bg-onyx shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] sm:rounded-[28px]">
      <Image src={src} alt={alt} fill priority sizes={sizes} className="object-cover grayscale-[35%] contrast-[1.08]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_70%,rgba(255,255,255,0.08)_100%)]" />
      {title && (
        <motion.div
          style={labelOpacity ? { opacity: labelOpacity } : undefined}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon via-carbon/70 to-transparent px-[7cqw] pb-[7cqw] pt-[22cqw]"
        >
          <p className="font-display text-metal text-[11cqw] uppercase leading-[1.05]">{title}</p>
          <p className="font-label mt-1 text-[max(8px,5cqw)] uppercase tracking-[0.3em] text-silver">{sub}</p>
        </motion.div>
      )}
    </div>
  );
}
