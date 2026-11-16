/*
  Two chibi-style lifters drawn in SVG and animated with SMIL
  (SMIL keeps every transform in each part's own coordinate space,
  so there is no transform-origin juggling).

  Left guy  : alternating dumbbell curls
  Right guy : barbell back squats
*/

const SKIN = "#d9a47e";
const SKIN_SHADE = "#b9845f";
const LIP = "#6b3f2a";
const EASE = "0.45 0 0.55 1";

/* ---------- helpers ---------- */

function Dumbbell() {
  return (
    <>
      <rect x="-16" y="-2" width="32" height="4" rx="2" fill="#8b8b90" />
      <rect x="-20" y="-10" width="7" height="20" rx="2" fill="#1e1e20" stroke="#bfbfc3" strokeWidth="1.5" />
      <rect x="13" y="-10" width="7" height="20" rx="2" fill="#1e1e20" stroke="#bfbfc3" strokeWidth="1.5" />
      <circle r="6.5" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1" />
    </>
  );
}

/* One curling arm. `hand` is a list of "x y" points (keyframes). */
function CurlArm({ shoulder, elbow, hand, dur }) {
  const values = hand.join(";");
  const xs = hand.map((p) => p.split(" ")[0]).join(";");
  const ys = hand.map((p) => p.split(" ")[1]).join(";");
  const keyTimes = "0;0.25;0.5;0.75;1";
  const keySplines = `${EASE};${EASE};${EASE};${EASE}`;
  const [hx, hy] = hand[0].split(" ");

  return (
    <g>
      {/* upper arm — bulges at the top of the rep */}
      <line
        x1={shoulder[0]}
        y1={shoulder[1]}
        x2={elbow[0]}
        y2={elbow[1]}
        stroke={SKIN}
        strokeWidth="14"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-width"
          values={hand.map((p) => (Number(p.split(" ")[1]) < 140 ? 17 : 14)).join(";")}
          keyTimes={keyTimes}
          calcMode="spline"
          keySplines={keySplines}
          dur={dur}
          repeatCount="indefinite"
        />
      </line>
      {/* forearm */}
      <line x1={elbow[0]} y1={elbow[1]} x2={hx} y2={hy} stroke={SKIN} strokeWidth="12" strokeLinecap="round">
        <animate attributeName="x2" values={xs} keyTimes={keyTimes} calcMode="spline" keySplines={keySplines} dur={dur} repeatCount="indefinite" />
        <animate attributeName="y2" values={ys} keyTimes={keyTimes} calcMode="spline" keySplines={keySplines} dur={dur} repeatCount="indefinite" />
      </line>
      {/* dumbbell + fist */}
      <g transform={`translate(${hx} ${hy})`}>
        <animateTransform
          attributeName="transform"
          type="translate"
          values={values}
          keyTimes={keyTimes}
          calcMode="spline"
          keySplines={keySplines}
          dur={dur}
          repeatCount="indefinite"
        />
        <Dumbbell />
      </g>
    </g>
  );
}

/* ---------- Guy A : dumbbell curls ---------- */

function CurlGuy() {
  const dur = "1.6s";
  const leftHand = ["66 184", "60 156", "64 128", "60 156", "66 184"];
  const rightHand = ["136 128", "140 156", "134 184", "140 156", "136 128"];

  return (
    <g>
      <ellipse cx="100" cy="263" rx="50" ry="7" fill="#000" opacity="0.5" />

      {/* legs, socks, shoes */}
      <rect x="83" y="212" width="13" height="38" rx="6" fill={SKIN} />
      <rect x="104" y="212" width="13" height="38" rx="6" fill={SKIN} />
      <rect x="83" y="239" width="13" height="9" fill="#e4e4e7" />
      <rect x="104" y="239" width="13" height="9" fill="#e4e4e7" />
      <path d="M71 259 Q71 246 84 246 L95 246 Q100 246 100 252 L100 261 L73 261 Q71 261 71 259Z" fill="#f5f5f6" />
      <path d="M129 259 Q129 246 116 246 L105 246 Q100 246 100 252 L100 261 L127 261 Q129 261 129 259Z" fill="#f5f5f6" />
      <path d="M71 258 L100 258 M100 258 L129 258" stroke="#8b8b90" strokeWidth="3" />

      {/* shorts */}
      <path d="M71 180 L129 180 L132 216 L104 218 L100 203 L96 218 L68 216 Z" fill="#3d3d41" stroke="#4a4a4f" strokeWidth="1" />
      <path d="M72 184 L69.5 214 M128 184 L130.5 214" stroke="#bfbfc3" strokeWidth="2.2" />

      {/* neck + shoulders */}
      <rect x="93" y="94" width="14" height="16" fill={SKIN_SHADE} />
      <path d="M69 126 Q69 106 90 103 L110 103 Q131 106 131 126 L127 160 L73 160 Z" fill={SKIN} />
      {/* tank top */}
      <path
        d="M83 104 L92 103 Q100 115 108 103 L117 104 Q119 126 126 134 L129 186 L71 186 L74 134 Q81 126 83 104 Z"
        fill="#141415"
        stroke="#4a4a4f"
        strokeWidth="1.2"
      />
      <text x="100" y="152" textAnchor="middle" fontSize="8.5" fontWeight="900" letterSpacing="1" fill="#bfbfc3">
        LEGION
      </text>
      <path d="M86 157 L114 157" stroke="#8b8b90" strokeWidth="1.2" />

      {/* head */}
      <circle cx="66" cy="70" r="7" fill={SKIN_SHADE} />
      <circle cx="134" cy="70" r="7" fill={SKIN_SHADE} />
      <circle cx="100" cy="66" r="34" fill={SKIN} />
      {/* cap */}
      <path d="M65 62 C65 30 82 21 100 21 C118 21 135 30 135 62 Z" fill="#161617" />
      <path d="M100 22 L100 60 M82 27 Q76 44 76 60 M118 27 Q124 44 124 60" stroke="#2b2b2e" strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="22" r="3" fill="#3d3d41" />
      <circle cx="100" cy="42" r="8.5" fill="#161617" stroke="#bfbfc3" strokeWidth="2" />
      <text x="100" y="46" textAnchor="middle" fontSize="11" fontWeight="900" fill="#e4e4e7">
        L
      </text>
      <path d="M61 60 Q100 51 139 60 Q141 68 132 70 Q100 62 68 70 Q59 68 61 60Z" fill="#0b0b0c" />
      {/* sunglasses */}
      <path d="M78 72 L68 70 M122 72 L132 70" stroke="#0b0b0c" strokeWidth="2.5" />
      <rect x="77" y="68" width="21" height="12" rx="5" fill="#0b0b0c" />
      <rect x="102" y="68" width="21" height="12" rx="5" fill="#0b0b0c" />
      <path d="M97 72 L103 72" stroke="#0b0b0c" strokeWidth="3" />
      <path d="M81 71.5 L87 71.5 M106 71.5 L112 71.5" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
      {/* nose + mouth */}
      <path d="M100 79 Q103.5 84 100 85.5" stroke={SKIN_SHADE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M93 90 Q100 95.5 107 90" stroke={LIP} strokeWidth="2.6" fill="none" strokeLinecap="round" />

      {/* sweat drop */}
      <path d="M140 46 Q144 53 140 56 Q136 53 140 46Z" fill="#cfe3f2">
        <animateTransform attributeName="transform" type="translate" values="0 0; 3 22" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.7;1" dur="1.6s" repeatCount="indefinite" />
      </path>

      {/* arms */}
      <CurlArm shoulder={[73, 121]} elbow={[64, 152]} hand={leftHand} dur={dur} />
      <CurlArm shoulder={[127, 121]} elbow={[136, 152]} hand={rightHand} dur={dur} />
    </g>
  );
}

/* ---------- Guy B : barbell squats ---------- */

function SquatGuy() {
  const dur = "2s";
  const kt = "0;0.5;1";
  const ks = `${EASE};${EASE}`;
  const anim = { keyTimes: kt, calcMode: "spline", keySplines: ks, dur, repeatCount: "indefinite" };

  return (
    <g>
      <ellipse cx="100" cy="263" rx="56" ry="7" fill="#000" opacity="0.5">
        <animate attributeName="rx" values="56;62;56" {...anim} />
      </ellipse>

      {/* legs — knees push out on the way down */}
      <path d="M90 212 L89 231 L88 247" stroke={SKIN} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <animate attributeName="d" values="M90 212 L89 231 L88 247;M90 228 L76 238 L88 247;M90 212 L89 231 L88 247" {...anim} />
      </path>
      <path d="M110 212 L111 231 L112 247" stroke={SKIN} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <animate attributeName="d" values="M110 212 L111 231 L112 247;M110 228 L124 238 L112 247;M110 212 L111 231 L112 247" {...anim} />
      </path>
      <rect x="81.5" y="240" width="13" height="8" fill="#e4e4e7" />
      <rect x="105.5" y="240" width="13" height="8" fill="#e4e4e7" />
      <path d="M71 259 Q71 246 84 246 L95 246 Q100 246 100 252 L100 261 L73 261 Q71 261 71 259Z" fill="#1e1e20" stroke="#4a4a4f" strokeWidth="1" />
      <path d="M129 259 Q129 246 116 246 L105 246 Q100 246 100 252 L100 261 L127 261 Q129 261 129 259Z" fill="#1e1e20" stroke="#4a4a4f" strokeWidth="1" />
      <path d="M71 258 L100 258 M100 258 L129 258" stroke="#f5f5f6" strokeWidth="3" />

      {/* everything above the hips moves down & up */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 16;0 0" {...anim} />

        {/* barbell sits on the traps, behind the torso */}
        <path d="M2 106 L198 106" stroke="#8b8b90" strokeWidth="4" strokeLinecap="round" />
        <rect x="27" y="99" width="6" height="14" rx="1.5" fill="#bfbfc3" />
        <rect x="167" y="99" width="6" height="14" rx="1.5" fill="#bfbfc3" />
        <rect x="14" y="82" width="12" height="48" rx="3" fill="#1e1e20" stroke="#bfbfc3" strokeWidth="1.5" />
        <rect x="4" y="88" width="9" height="36" rx="2.5" fill="#2b2b2e" stroke="#8b8b90" strokeWidth="1.5" />
        <rect x="174" y="82" width="12" height="48" rx="3" fill="#1e1e20" stroke="#bfbfc3" strokeWidth="1.5" />
        <rect x="187" y="88" width="9" height="36" rx="2.5" fill="#2b2b2e" stroke="#8b8b90" strokeWidth="1.5" />

        {/* shorts */}
        <path d="M71 180 L129 180 L132 216 L104 218 L100 203 L96 218 L68 216 Z" fill="#101011" stroke="#4a4a4f" strokeWidth="1" />
        <path d="M72 184 L69.5 214 M128 184 L130.5 214" stroke="#e4e4e7" strokeWidth="2" />

        {/* neck + tee */}
        <rect x="93" y="94" width="14" height="16" fill={SKIN_SHADE} />
        <path d="M69 124 Q71 106 90 103 Q100 110 110 103 Q129 106 131 124 L129 186 L71 186 Z" fill="#2b2b2e" stroke="#4a4a4f" strokeWidth="1.2" />
        <path d="M90 103 Q100 110 110 103" stroke="#3d3d41" strokeWidth="3" fill="none" />
        <path d="M92 138 L108 138 L108 150 Q100 157 92 150 Z" fill="none" stroke="#bfbfc3" strokeWidth="1.8" />
        <text x="100" y="149" textAnchor="middle" fontSize="9" fontWeight="900" fill="#e4e4e7">
          LF
        </text>

        {/* arms gripping the bar */}
        <path d="M73 119 L57 134 L52 108" stroke={SKIN} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M127 119 L143 134 L148 108" stroke={SKIN} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M73 119 L64 127.5 M127 119 L136 127.5" stroke="#2b2b2e" strokeWidth="17" strokeLinecap="round" />
        <circle cx="52" cy="107" r="7" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1" />
        <circle cx="148" cy="107" r="7" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1" />

        {/* head */}
        <circle cx="100" cy="66" r="34" fill={SKIN} />
        <path d="M66 60 C63 30 84 23 102 25 C121 26 137 36 134 60 C126 45 112 41 100 43 C88 41 74 47 66 60Z" fill="#161617" />
        {/* brows, eyes, blush, gritted teeth */}
        <path d="M81 61 L94 65 M119 61 L106 65" stroke="#161617" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="88" cy="73" rx="3.6" ry="4.6" fill="#161617" />
        <ellipse cx="112" cy="73" rx="3.6" ry="4.6" fill="#161617" />
        <circle cx="89.3" cy="71.3" r="1.2" fill="#fff" />
        <circle cx="113.3" cy="71.3" r="1.2" fill="#fff" />
        <circle cx="80" cy="83" r="4.5" fill="#e58c7a" opacity="0.45" />
        <circle cx="120" cy="83" r="4.5" fill="#e58c7a" opacity="0.45" />
        <path d="M100 77 Q103.5 82 100 83.5" stroke={SKIN_SHADE} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="92.5" y="87" width="15" height="7" rx="3.5" fill="#fff" stroke={LIP} strokeWidth="1.6" />
        <path d="M100 87 L100 94" stroke={LIP} strokeWidth="1" />
        {/* headphones */}
        <path d="M64 66 C61 21 139 21 136 66" stroke="#bfbfc3" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="57" y="57" width="13" height="23" rx="5.5" fill="#e4e4e7" stroke="#8b8b90" strokeWidth="1.5" />
        <rect x="130" y="57" width="13" height="23" rx="5.5" fill="#e4e4e7" stroke="#8b8b90" strokeWidth="1.5" />
      </g>
    </g>
  );
}

export default function GymGuys({ className = "" }) {
  return (
    <svg
      viewBox="0 0 440 280"
      className={className}
      role="img"
      aria-label="Two lifters training: one doing dumbbell curls, one doing barbell squats"
    >
      <g transform="translate(10 6)">
        <CurlGuy />
      </g>
      <g transform="translate(230 6)">
        <SquatGuy />
      </g>
    </svg>
  );
}
