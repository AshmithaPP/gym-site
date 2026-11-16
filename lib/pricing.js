// Source: "Legion Fitness Official Pricing & Programme Brief". All prices in ₹, exclusive of GST.

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

export const MEMBERSHIPS = [
  { name: "Monthly", term: "1 month", standard: 2999, promo: 2699 },
  { name: "Quarterly", term: "3 months", standard: 5999, promo: 5499 },
  { name: "Half-Yearly", term: "6 months", standard: 8999, promo: 7999 },
  { name: "Annual", term: "12 months", standard: 13999, promo: 11999, best: true },
];

export const INAUGURATION_OFFER = {
  title: "Inauguration offer",
  plan: "Annual membership",
  price: 9999,
  note: "Limited to the first 100 members. Subject to offer validity and terms & conditions.",
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
  "Weekly progress monitoring",
  "Technique, form & posture correction",
  "InBody body composition analysis",
];

export const TRANSFORMATIONS = [
  {
    name: "6-Week Transformation",
    tag: "One-to-one PT",
    price: 13999,
    weeks: 6,
    sessions: 18,
    includes: [
      "Everything in Regular PT",
      "Daily WhatsApp check-ins with your trainer",
      "Daily nutrition & food-intake monitoring",
      "Weekly assessments + InBody analysis",
      "Before & after photo / video documentation",
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
      "Extended 12-week coaching period",
      "Continuous lifestyle guidance & accountability",
      "Regular InBody body composition assessments",
      "Comprehensive evaluation at completion",
    ],
  },
];

export const GENERAL_NOTES = [
  "All prices are exclusive of applicable GST.",
  "Gym membership is charged separately from PT and transformation programmes.",
  "PT sessions are scheduled in advance; packages are non-transferable.",
  "Transformation enrolment is subject to an initial consultation and fitness assessment.",
];
