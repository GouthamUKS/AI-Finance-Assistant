import type { ReactNode } from 'react';
import type { AvatarOptions } from '../../store/useStore';

const LIP: Record<string, string> = {
  '#FDDBB4': '#c87060', '#E8A878': '#b56050',
  '#C68642': '#a05040', '#8D5524': '#8a3a2e', '#4A2912': '#7a3025',
};
const NOSE_TINT: Record<string, string> = {
  '#FDDBB4': '#e8956a', '#E8A878': '#c47050',
  '#C68642': '#a86230', '#8D5524': '#7a4020', '#4A2912': '#3a1e08',
};

interface HairGeom { back: ReactNode; front: ReactNode }

// capTop: center y of crown cap = cy - ry*0.7 → cap bottom = cy - ry*0.7 + ry*0.3 ≈ cy - ry*0.4
// This keeps hair strictly on the top ~30% of the head, well above the eyes (ey = cy - 4).
function buildHair(
  gender: string, style: number,
  cx: number, cy: number, rx: number, ry: number,
  color: string,
): HairGeom {
  // Crown cap: small ellipse covering only the top of the head
  const capCy  = cy - ry * 0.72;   // center near top of head
  const capRy  = ry * 0.32;        // bottom of cap ≈ cy - ry*0.4, well above eyes
  const bangY  = cy - ry * 0.35;   // fringe sits just below hairline
  const hl     = <ellipse key="hl" cx={cx - rx * 0.18} cy={capCy - capRy * 0.5} rx={rx * 0.22} ry={capRy * 0.4} fill="white" opacity={0.14} />;

  if (gender === 'female') {
    if (style === 0) return { // Long
      back: [
        <path key="l" d={`M${cx-rx*.7},${cy-ry*.55} C${cx-rx*1.4},${cy-ry*.1} ${cx-rx*1.65},${cy+ry*1.2} ${cx-rx*1.15},${cy+ry*2.7} C${cx-rx*.8},${cy+ry*3.1} ${cx-rx*.35},${cy+ry*2.7} ${cx-rx*.45},${cy+ry*1.3}Z`} fill={color} />,
        <path key="r" d={`M${cx+rx*.7},${cy-ry*.55} C${cx+rx*1.4},${cy-ry*.1} ${cx+rx*1.65},${cy+ry*1.2} ${cx+rx*1.15},${cy+ry*2.7} C${cx+rx*.8},${cy+ry*3.1} ${cx+rx*.35},${cy+ry*2.7} ${cx+rx*.45},${cy+ry*1.3}Z`} fill={color} />,
        // back cap (behind head, sets the head-top colour)
        <ellipse key="bcap" cx={cx} cy={capCy} rx={rx*1.02} ry={capRy*1.1} fill={color} />,
      ],
      front: [
        <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.98} ry={capRy} fill={color} />,
        // bangs — thin fringe at forehead
        <path key="bangs" d={`M${cx-rx*.82},${bangY} Q${cx-rx*.2},${bangY-ry*.14} ${cx+rx*.2},${bangY-ry*.04} Q${cx+rx*.5},${bangY+ry*.04} ${cx+rx*.82},${bangY}`}
          stroke={color} strokeWidth={ry * 0.13} fill="none" strokeLinecap="round" />,
        hl,
      ],
    };
    if (style === 1) return { // Bob
      back: [
        <path key="l" d={`M${cx-rx*.72},${cy-ry*.55} C${cx-rx*1.35},${cy-ry*.05} ${cx-rx*1.42},${cy+ry*.55} ${cx-rx*1.0},${cy+ry*.95} C${cx-rx*.8},${cy+ry*1.05} ${cx-rx*.45},${cy+ry*.92} ${cx-rx*.5},${cy+ry*.3}Z`} fill={color} />,
        <path key="r" d={`M${cx+rx*.72},${cy-ry*.55} C${cx+rx*1.35},${cy-ry*.05} ${cx+rx*1.42},${cy+ry*.55} ${cx+rx*1.0},${cy+ry*.95} C${cx+rx*.8},${cy+ry*1.05} ${cx+rx*.45},${cy+ry*.92} ${cx+rx*.5},${cy+ry*.3}Z`} fill={color} />,
        <ellipse key="bcap" cx={cx} cy={capCy} rx={rx*1.02} ry={capRy*1.1} fill={color} />,
      ],
      front: [
        <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.98} ry={capRy} fill={color} />,
        <path key="bangs" d={`M${cx-rx*.8},${bangY} Q${cx},${bangY-ry*.16} ${cx+rx*.8},${bangY}`}
          stroke={color} strokeWidth={ry * 0.12} fill="none" strokeLinecap="round" />,
        hl,
      ],
    };
    // Bun
    return {
      back: [<ellipse key="bcap" cx={cx} cy={capCy} rx={rx*1.02} ry={capRy*1.1} fill={color} />],
      front: [
        <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.96} ry={capRy} fill={color} />,
        // tight side panels
        <ellipse key="sl" cx={cx-rx*.76} cy={cy-ry*.28} rx={rx*.18} ry={ry*.28} fill={color} />,
        <ellipse key="sr" cx={cx+rx*.76} cy={cy-ry*.28} rx={rx*.18} ry={ry*.28} fill={color} />,
        // bun above head
        <circle key="bun" cx={cx} cy={cy-ry*1.3} r={ry*.38} fill={color} />,
        <circle key="bunhl" cx={cx-ry*.1} cy={cy-ry*1.38} r={ry*.14} fill="white" opacity={0.14} />,
      ],
    };
  }

  if (gender === 'male') {
    if (style === 0) return { // Short
      back: [<ellipse key="bcap" cx={cx} cy={capCy} rx={rx*1.02} ry={capRy*1.05} fill={color} />],
      front: [
        <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.96} ry={capRy} fill={color} />,
        // sideburn panels (beside ears, below cap)
        <rect key="sl" x={cx-rx-1} y={cy-ry*.58} width={rx*.2} height={ry*.44} rx={2.5} fill={color} />,
        <rect key="sr" x={cx+rx-rx*.2+1} y={cy-ry*.58} width={rx*.2} height={ry*.44} rx={2.5} fill={color} />,
        hl,
      ],
    };
    if (style === 1) return { // Fade
      back: [<ellipse key="bcap" cx={cx} cy={capCy} rx={rx*.98} ry={capRy*.9} fill={color} />],
      front: [
        <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.92} ry={capRy*.82} fill={color} />,
      ],
    };
    // Wavy
    return {
      back: [<ellipse key="bcap" cx={cx} cy={capCy} rx={rx*1.02} ry={capRy*1.1} fill={color} />],
      front: [
        <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.98} ry={capRy} fill={color} />,
        // wave bumps on top
        <ellipse key="w1" cx={cx-rx*.38} cy={capCy-capRy*.65} rx={rx*.28} ry={capRy*.55} fill={color} />,
        <ellipse key="w2" cx={cx+rx*.1}  cy={capCy-capRy*.75} rx={rx*.26} ry={capRy*.5}  fill={color} />,
        <ellipse key="w3" cx={cx+rx*.46} cy={capCy-capRy*.6}  rx={rx*.22} ry={capRy*.45} fill={color} />,
        // side panels
        <ellipse key="sl" cx={cx-rx*.78} cy={cy-ry*.3} rx={rx*.2} ry={ry*.35} fill={color} />,
        <ellipse key="sr" cx={cx+rx*.78} cy={cy-ry*.3} rx={rx*.2} ry={ry*.35} fill={color} />,
        hl,
      ],
    };
  }

  // other/neutral
  if (style === 0) return { // Medium
    back: [
      <path key="l" d={`M${cx-rx*.7},${cy-ry*.55} C${cx-rx*1.32},${cy-ry*.05} ${cx-rx*1.52},${cy+ry*1.2} ${cx-rx*1.02},${cy+ry*2.2} C${cx-rx*.72},${cy+ry*2.45} ${cx-rx*.32},${cy+ry*2.0} ${cx-rx*.38},${cy+ry*.5}Z`} fill={color} />,
      <path key="r" d={`M${cx+rx*.7},${cy-ry*.55} C${cx+rx*1.32},${cy-ry*.05} ${cx+rx*1.52},${cy+ry*1.2} ${cx+rx*1.02},${cy+ry*2.2} C${cx+rx*.72},${cy+ry*2.45} ${cx+rx*.32},${cy+ry*2.0} ${cx+rx*.38},${cy+ry*.5}Z`} fill={color} />,
      <ellipse key="bcap" cx={cx} cy={capCy} rx={rx*1.02} ry={capRy*1.1} fill={color} />,
    ],
    front: [
      <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.98} ry={capRy} fill={color} />,
      hl,
    ],
  };
  if (style === 1) return { // Short
    back: [<ellipse key="bcap" cx={cx} cy={capCy} rx={rx*.99} ry={capRy*1.05} fill={color} />],
    front: [
      <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.95} ry={capRy*.9} fill={color} />,
      hl,
    ],
  };
  // Locs
  return {
    back: [
      <ellipse key="bcap" cx={cx} cy={capCy} rx={rx*1.02} ry={capRy*1.1} fill={color} />,
      ...[-0.68, -0.28, 0.14, 0.54].map((o, i) => (
        <path key={i} d={`M${cx+o*rx},${cy+ry*.3} Q${cx+o*rx-rx*.07},${cy+ry*1.5} ${cx+o*rx+rx*.04},${cy+ry*2.6}`}
          stroke={color} strokeWidth={rx*.21} fill="none" strokeLinecap="round" />
      )),
    ],
    front: [
      <ellipse key="cap" cx={cx} cy={capCy} rx={rx*.98} ry={capRy} fill={color} />,
      ...[-0.4, 0, 0.4].map((o, i) => (
        <ellipse key={`tl${i}`} cx={cx+o*rx} cy={capCy-capRy*.5} rx={rx*.12} ry={capRy*.7} fill={color} />
      )),
    ],
  };
}

export function AvatarSVG({ options, size = 120 }: { options: AvatarOptions; size?: number }) {
  const { skinTone, hairColor, hairStyle, outfitColor, gender, glasses = false } = options;
  const vw = 100, vh = 130;
  const cx = 50;
  const hcy = 43;      // head center y
  const hrx = 25.5;    // head rx
  const hry = 27;      // head ry
  const nTop = hcy + hry - 5;
  const nBot = nTop + 13;
  const nW = 10;
  const ey = hcy - 4;  // eye y
  const lip = LIP[skinTone] ?? '#b06050';
  const noseTint = NOSE_TINT[skinTone] ?? '#c07050';
  const h = buildHair(gender, hairStyle, cx, hcy, hrx, hry, hairColor);

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={size} height={size * (vh / vw)} aria-hidden="true" overflow="visible">
      <defs>
        <radialGradient id={`fg-${skinTone.replace('#','')}`} cx="43%" cy="36%" r="58%">
          <stop offset="0%" stopColor="white" stopOpacity="0.14" />
          <stop offset="80%" stopColor="black" stopOpacity="0.07" />
        </radialGradient>
      </defs>

      {/* Hair back (behind face) */}
      <g fill={hairColor}>{h.back}</g>

      {/* Body */}
      <path
        d={`M${cx-nW*2.6},${nBot+1} Q${cx-nW*4.0},${nBot+10} ${cx-nW*4.4},${vh} L${cx+nW*4.4},${vh} Q${cx+nW*4.0},${nBot+10} ${cx+nW*2.6},${nBot+1}Z`}
        fill={outfitColor} opacity={0.93}
      />
      {/* Collar V detail */}
      <path
        d={`M${cx-5},${nBot} L${cx-10},${nBot+9} L${cx},${nBot+13} L${cx+10},${nBot+9} L${cx+5},${nBot}Z`}
        fill="white" opacity={0.16}
      />
      {/* Shoulder sheen */}
      <ellipse cx={cx-nW*2.8} cy={nBot+8} rx={nW*.7} ry={nW*.35} fill="white" opacity={0.12} />
      <ellipse cx={cx+nW*2.8} cy={nBot+8} rx={nW*.7} ry={nW*.35} fill="white" opacity={0.12} />

      {/* Neck */}
      <rect x={cx - nW/2} y={nTop} width={nW} height={nBot - nTop + 2} rx={nW/2} fill={skinTone} />

      {/* Head */}
      <ellipse cx={cx} cy={hcy} rx={hrx} ry={hry} fill={skinTone} />
      <ellipse cx={cx} cy={hcy} rx={hrx} ry={hry} fill={`url(#fg-${skinTone.replace('#','')})`} />

      {/* Ears */}
      <ellipse cx={cx - hrx + 1} cy={hcy + 2} rx={4.2} ry={5.5} fill={skinTone} />
      <path d={`M${cx-hrx+3},${hcy} Q${cx-hrx+5},${hcy+2} ${cx-hrx+3},${hcy+5}`}
        stroke={noseTint} strokeWidth="0.9" fill="none" opacity={0.5} />
      <ellipse cx={cx + hrx - 1} cy={hcy + 2} rx={4.2} ry={5.5} fill={skinTone} />
      <path d={`M${cx+hrx-3},${hcy} Q${cx+hrx-5},${hcy+2} ${cx+hrx-3},${hcy+5}`}
        stroke={noseTint} strokeWidth="0.9" fill="none" opacity={0.5} />

      {/* Hair front (crown, over head) */}
      <g fill={hairColor}>{h.front}</g>

      {/* Eyebrows */}
      <path d={`M${cx-13},${ey-7.5} Q${cx-8},${ey-10} ${cx-3},${ey-8}`}
        stroke={hairColor} strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <path d={`M${cx+3},${ey-8} Q${cx+8},${ey-10} ${cx+13},${ey-7.5}`}
        stroke={hairColor} strokeWidth="2.1" fill="none" strokeLinecap="round" />

      {/* Eye whites */}
      <ellipse cx={cx - 8} cy={ey} rx={5.6} ry={4.4} fill="white" />
      <ellipse cx={cx + 8} cy={ey} rx={5.6} ry={4.4} fill="white" />

      {/* Iris */}
      <circle cx={cx - 8} cy={ey} r={3.0} fill="#634A36" />
      <circle cx={cx + 8} cy={ey} r={3.0} fill="#634A36" />

      {/* Pupils */}
      <circle cx={cx - 8} cy={ey} r={1.65} fill="#1a1008" />
      <circle cx={cx + 8} cy={ey} r={1.65} fill="#1a1008" />

      {/* Upper lid shadow */}
      <ellipse cx={cx - 8} cy={ey - 2.6} rx={5.6} ry={1.9} fill="#00000018" />
      <ellipse cx={cx + 8} cy={ey - 2.6} rx={5.6} ry={1.9} fill="#00000018" />

      {/* Eye lash line top */}
      <path d={`M${cx-14},${ey-3.8} Q${cx-8},${ey-5.5} ${cx-2},${ey-3.8}`}
        stroke="#00000028" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d={`M${cx+2},${ey-3.8} Q${cx+8},${ey-5.5} ${cx+14},${ey-3.8}`}
        stroke="#00000028" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Specular highlights */}
      <circle cx={cx - 6.3} cy={ey - 1.4} r={1.15} fill="white" opacity={0.9} />
      <circle cx={cx + 9.7} cy={ey - 1.4} r={1.15} fill="white" opacity={0.9} />

      {/* Cheek blush */}
      <ellipse cx={cx - 15} cy={hcy + 10} rx={7.5} ry={4.5} fill="#ff9090" opacity={0.11} />
      <ellipse cx={cx + 15} cy={hcy + 10} rx={7.5} ry={4.5} fill="#ff9090" opacity={0.11} />

      {/* Nose */}
      <path d={`M${cx},${hcy+2} Q${cx+2.8},${hcy+6.5} ${cx+1.2},${hcy+9}`}
        stroke={noseTint} strokeWidth="1.1" fill="none" opacity={0.55} />
      <circle cx={cx - 2.8} cy={hcy + 9} r={1.9} fill={noseTint} opacity={0.5} />
      <circle cx={cx + 2.8} cy={hcy + 9} r={1.9} fill={noseTint} opacity={0.5} />

      {/* Upper lip (cupid's bow) */}
      <path d={`M${cx-7},${hcy+13.5} Q${cx-4},${hcy+12} ${cx-1.5},${hcy+13.5} Q${cx},${hcy+12.5} ${cx+1.5},${hcy+13.5} Q${cx+4},${hcy+12} ${cx+7},${hcy+13.5}Z`}
        fill={lip} />
      {/* Lower lip */}
      <path d={`M${cx-7},${hcy+13.5} Q${cx},${hcy+18.5} ${cx+7},${hcy+13.5}Z`}
        fill={lip} opacity={0.82} />
      {/* Lip line */}
      <path d={`M${cx-7},${hcy+13.5} Q${cx},${hcy+14.5} ${cx+7},${hcy+13.5}`}
        stroke={lip} strokeWidth="0.55" fill="none" opacity={0.55} />

      {/* Glasses */}
      {glasses && (
        <>
          <rect x={cx - 15.5} y={ey - 5.5} width={12.5} height={10} rx={3.2} fill="none" stroke="#374151" strokeWidth="1.4" />
          <rect x={cx + 3} y={ey - 5.5} width={12.5} height={10} rx={3.2} fill="none" stroke="#374151" strokeWidth="1.4" />
          <path d={`M${cx-3},${ey-1.5} L${cx+3},${ey-1.5}`} stroke="#374151" strokeWidth="1.4" />
          <path d={`M${cx-15.5},${ey-1} L${cx-20},${ey+1}`} stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
          <path d={`M${cx+15.5},${ey-1} L${cx+20},${ey+1}`} stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
          <rect x={cx - 15.5} y={ey - 5.5} width={12.5} height={10} rx={3.2} fill="#93c5fd" opacity={0.14} />
          <rect x={cx + 3} y={ey - 5.5} width={12.5} height={10} rx={3.2} fill="#93c5fd" opacity={0.14} />
        </>
      )}
    </svg>
  );
}

export function AvatarMini({ options }: { options: AvatarOptions }) {
  return (
    <div className="w-9 h-9 rounded-full bg-[#edf3ed] border border-[#e5eae3] overflow-hidden flex items-end justify-center">
      <AvatarSVG options={options} size={38} />
    </div>
  );
}
