// Source: "Legion Fitness Complete Pricing & Website Strategy" (Nov 2026). All prices in ₹, exclusive of GST.

export const STORY_IMAGES = [
  { src: "/images/story-join.jpg", alt: "Empty squat racks and dumbbells on the Legion gym floor" },
  { src: "/images/story-coach.jpg", alt: "Personal trainer correcting a client's push-up form" },
  { src: "/images/story-transform.jpg", alt: "Athlete's muscular back during a pull-up" },
  { src: "/images/story-compete.jpg", alt: "Bodybuilder bracing for a heavy lift under a spotlight" },
];

export const CHAPTERS = [
  { id: "join", step: "Step in", title: "Join the Legion" },
  { id: "coach", step: "Get coached", title: "Train one-to-one" },
  { id: "transform", step: "Transform", title: "Rebuild yourself" },
  { id: "compete", step: "Compete", title: "Take the stage" },
];

// standard = regular rate (shown struck through), promo = introductory launch price
export const MEMBERSHIPS = [
  { name: "Monthly", term: "1 month", standard: 3499, promo: 2999 },
  { name: "Quarterly", term: "3 months", standard: 6999, promo: 5999 },
  { name: "Half-Yearly", term: "6 months", standard: 9999, promo: 8999 },
  { name: "Annual", term: "12 months", standard: 15999, promo: 13999, best: true },
];

export const INTRO_PRICING_NOTE =
  "Introductory prices apply until the first 100 paid memberships are sold or for the first 30 days after opening, whichever comes first. Standard prices apply after that.";

export const INAUGURATION_OFFER = {
  title: "Inauguration offer",
  plan: "Annual membership",
  price: 9999,
  note: "Limited strictly to the first 100 members. Replaces the ₹13,999 annual introductory price for eligible members — offers can't be combined. T&C apply.",
};

export const PT_PACKAGES = [
  { sessions: 12, price: 6000 },
  { sessions: 15, price: 7500 },
  { sessions: 18, price: 9000 },
  { sessions: 21, price: 10500 },
];

export const PT_INCLUDES = [
  "Dedicated one-to-one personal trainer",
  "45–60 minutes per session",
  "Customised workout & personalised diet plan",
  "Coaching on machines, technique, form & posture",
  "Periodic InBody body composition analysis",
  "Lifestyle guidance & performance tracking",
];

export const TRANSFORMATIONS = [
  {
    name: "6-Week Transformation",
    tag: "One-to-one PT",
    price: 13999,
    weeks: 6,
    sessions: 18,
    includes: [
      "Everything in Regular One-to-One PT",
      "Day-1 Kickoff Blueprint: baseline, phases & plan",
      "Daily weighed-portion meal logs to your trainer on WhatsApp",
      "Off-session workout & cardio guidance",
      "Weekly InBody scan with an explained report",
      "Milestone photo & video documentation",
    ],
  },
  {
    name: "12-Week Transformation",
    tag: "Advanced coaching",
    price: 25999,
    weeks: 12,
    sessions: 36,
    featured: true,
    includes: [
      "Everything in the 6-Week programme",
      "Extended 12-week coaching cycle",
      "Weekly InBody reports with macro & training recalibration",
      "Comprehensive final transformation evaluation",
    ],
  },
];

export const SESSION_UPGRADE_NOTE =
  "Want a trainer beside you on every visit (5–6 sessions a week)? Higher-frequency upgrades are available at a custom fee — speak to management before enrolment.";

export const GENERAL_NOTES = [
  "All prices are exclusive of applicable GST.",
  "Gym membership and PT / transformation charges are separate.",
  "PT sessions are scheduled in advance; packages are non-transferable.",
  "Medical conditions, injuries or rehab needs must be disclosed before enrolment, with medical clearance.",
];
