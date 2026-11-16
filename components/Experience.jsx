"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import Preloader from "./Preloader";
import Hero from "./Hero";
import Spotlight from "./Spotlight";
import Pricing from "./Pricing";
import Features from "./Features";
import TravelCard from "./TravelCard";
import Footer from "./Footer";

export default function Experience() {
  const [revealed, setRevealed] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [chapter, setChapter] = useState(0);

  const stageRef = useRef(null);
  const heroSlotRef = useRef(null);
  const spotSlotRef = useRef(null);
  const priceSlotRef = useRef(null);
  const storyRef = useRef(null);
  const whySlotRef = useRef(null);

  // shared mouse parallax (hero cards + travelling card)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 80, damping: 14 });
  const my = useSpring(rawY, { stiffness: 80, damping: 14 });
  const pointer = { rawX, rawY, mx, my };

  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleFinish = useCallback(() => setLoaderGone(true), []);

  useEffect(() => {
    if (loaderGone) document.body.classList.remove("is-loading");
  }, [loaderGone]);

  return (
    <>
      {!loaderGone && <Preloader onReveal={handleReveal} onFinish={handleFinish} />}
      <main ref={stageRef} className="relative overflow-clip">
        <Hero start={revealed} pointer={pointer} slotRef={heroSlotRef} />
        <Spotlight slotRef={spotSlotRef} />
        <Pricing slotRef={priceSlotRef} storyRef={storyRef} onChapter={setChapter} />
        <Features slotRef={whySlotRef} />
        <TravelCard
          start={revealed}
          stageRef={stageRef}
          slots={[heroSlotRef, spotSlotRef, priceSlotRef, whySlotRef]}
          storyRef={storyRef}
          chapter={chapter}
          pointer={pointer}
        />
      </main>
      <Footer />
    </>
  );
}
