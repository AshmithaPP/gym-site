"use client";

import { useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import Hero from "./Hero";
import Spotlight from "./Spotlight";
import Pricing from "./Pricing";
import Features from "./Features";
import TravelCard from "./TravelCard";
import Footer from "./Footer";
import EnquirySection from "./EnquirySection";
import Testimonials from "./Testimonials";
import WhatsAppButton from "./WhatsAppButton";
import OfferBar from "./OfferBar";
import { EnquiryProvider } from "./Enquiry";

export default function Experience() {
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

  return (
    <EnquiryProvider>
      <main ref={stageRef} className="relative overflow-clip">
        <Hero start={true} pointer={pointer} slotRef={heroSlotRef} />
        <Spotlight slotRef={spotSlotRef} />
        <Pricing slotRef={priceSlotRef} storyRef={storyRef} onChapter={setChapter} />
        <Features slotRef={whySlotRef} />
        <Testimonials />
        <EnquirySection />
        <TravelCard
          start={true}
          stageRef={stageRef}
          slots={[heroSlotRef, spotSlotRef, priceSlotRef, whySlotRef]}
          storyRef={storyRef}
          chapter={chapter}
          pointer={pointer}
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <OfferBar />
    </EnquiryProvider>
  );
}
