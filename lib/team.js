// "Meet the Legion Crew" — 12 slots from the Pricing & Website Strategy brief.
//
// Fill in name / certifications / experience / specialty / photo as staff are confirmed.
// Anything left as "" shows "To be announced". To hide a slot (e.g. the COO until appointed),
// set `visible: false`. `status` shows a small badge: "planned" | "open" (leave out when filled).
// photo: put the image in public/images/team/ and use e.g. "/images/team/ceo.jpg".

const blank = { name: "", certifications: "", experience: "", specialty: "", photo: "" };

export const TEAM = [
  {
    ...blank,
    id: "ceo",
    group: "Leadership",
    role: "Chief Executive Officer",
    focus: "Leadership & Vision",
    icon: "crown",
    visible: true,
  },
  {
    ...blank,
    id: "coo",
    group: "Leadership",
    role: "Chief Operating Officer",
    focus: "Operations & Member Experience",
    icon: "gear",
    status: "planned",
    visible: true, // set to false to hide until appointed
  },
  {
    ...blank,
    id: "physio",
    group: "Clinical care",
    role: "In-House Physiotherapist",
    focus: "Rehabilitation, Mobility & Injury Care",
    note: "Available by prior appointment",
    icon: "pulse",
    visible: true,
  },
  ...Array.from({ length: 6 }, (_, i) => ({
    ...blank,
    id: `coach-${i + 1}`,
    group: "Coaching",
    role: "Certified Personal Trainer",
    focus: `Coach ${String(i + 1).padStart(2, "0")}`,
    icon: "dumbbell",
    visible: true,
  })),
  {
    ...blank,
    id: "front-desk",
    group: "Community",
    role: "Front Desk & Community Lead",
    focus: "Reception",
    tagline: "The Heart of Our Community",
    blurb: "Welcoming every member and keeping the Legion community connected.",
    icon: "heart",
    visible: true,
  },
  {
    ...blank,
    id: "facility-care",
    group: "Facility care",
    role: "Hygiene & Facility Care Specialist",
    focus: "Housekeeping",
    tagline: "The Hero Behind Our Spotless Floor",
    blurb: "Keeping every corner of the training floor clean and sanitised.",
    icon: "sparkle",
    visible: true,
  },
  {
    ...blank,
    id: "flex",
    group: "Team",
    role: "Flexible Team Slot",
    focus: "Coach · Nutritionist · Support Specialist",
    blurb: "Reserved for an additional coach, nutritionist or support specialist.",
    icon: "plus",
    status: "open",
    visible: true,
  },
];
