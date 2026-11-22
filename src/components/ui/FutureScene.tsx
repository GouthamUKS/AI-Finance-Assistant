import type { Goal } from '../../engine/types';
import type { AvatarOptions } from '../../store/useStore';
import { AvatarSVG } from './Avatar';

type SceneType = 'car' | 'house' | 'travel' | 'career' | 'fitness' | 'education' | 'savings' | 'default';

const PATTERNS: [SceneType, RegExp][] = [
  ['car',       /\b(car|vehicle|drive|driv|motorbike|motorcycle|tesla|wheels|bmw|audi)\b/i],
  ['house',     /\b(house|home|flat|deposit|mortgage|property|apartment|buy.{0,10}place)\b/i],
  ['travel',    /\b(travel|trip|holiday|vacation|flight|abroad|world|backpack|cruise|explore)\b/i],
  ['career',    /\b(career|job|promotion|salary|raise|analyst|developer|engineer|manager|profession)\b/i],
  ['fitness',   /\b(gym|fitness|health|weight|run|marathon|sport|muscle|yoga|triathlon)\b/i],
  ['education', /\b(degree|qualif|study|course|master|mba|phd|graduate|university|certif|learn)\b/i],
  ['savings',   /\b(save|saving|emergency|fund|invest|pension|retire|wealth|financial|rich)\b/i],
];

function detectScene(goals: Goal[]): { scene: SceneType; matchedLabel: string } {
  const labelled = goals.filter(g => g.label.trim().length > 1);
  const text = labelled.map(g => g.label).join(' ');
  for (const [scene, re] of PATTERNS) {
    if (re.test(text)) {
      const hit = labelled.find(g => re.test(g.label)) ?? labelled[0];
      return { scene, matchedLabel: hit?.label ?? '' };
    }
  }
  const hit = labelled[0];
  if (!hit) return { scene: 'default', matchedLabel: '' };
  if (hit.type === 'financial') return { scene: 'savings', matchedLabel: hit.label };
  if (hit.type === 'career') return { scene: 'career', matchedLabel: hit.label };
  return { scene: 'default', matchedLabel: hit.label };
}

const META: Record<SceneType, { bg: string; ground: string; tagline: string }> = {
  car:       { bg: 'linear-gradient(135deg,#dbeafe,#93c5fd)', ground: '#374151', tagline: 'Behind the wheel' },
  house:     { bg: 'linear-gradient(135deg,#f0fdf4,#86efac)', ground: '#3d7a52', tagline: 'Home sweet home' },
  travel:    { bg: 'linear-gradient(135deg,#fef9c3,#fbbf24)', ground: '#c4a040', tagline: 'Out in the world' },
  career:    { bg: 'linear-gradient(135deg,#f5f3ff,#c4b5fd)', ground: '#374151', tagline: 'Level up' },
  fitness:   { bg: 'linear-gradient(135deg,#ecfdf5,#6ee7b7)', ground: '#2d6a4f', tagline: 'Stronger every day' },
  education: { bg: 'linear-gradient(135deg,#eff6ff,#93c5fd)', ground: '#374151', tagline: 'Qualified' },
  savings:   { bg: 'linear-gradient(135deg,#fefce8,#fde047)', ground: '#6b6830', tagline: 'Financially free' },
  default:   { bg: 'linear-gradient(135deg,#edf3ed,#86efac)', ground: '#3d7a52', tagline: 'Your future self' },
};

// ── Scene props ──────────────────────────────────────────────────────────────

function CarProp() {
  return (
    <svg viewBox="0 0 130 80" width="130" height="80" aria-hidden="true">
      <ellipse cx="65" cy="74" rx="58" ry="5" fill="#00000018" />
      <path d="M 14 52 L 14 38 Q 14 32 21 32 L 42 18 Q 50 12 64 12 Q 80 12 88 18 L 108 32 Q 115 32 115 38 L 115 52 Z" fill="#5a7d6a" />
      <path d="M 44 18 Q 54 14 66 14 Q 78 14 86 18 L 100 32 L 28 32 Z" fill="#7a9d8a" />
      <path d="M 70 16 L 94 32 L 74 32 Z" fill="#b0d4e8" opacity="0.85" />
      <path d="M 44 18 L 68 18 L 70 32 L 30 32 Z" fill="#b0d4e8" opacity="0.85" />
      <circle cx="34" cy="52" r="13" fill="#252f26" />
      <circle cx="34" cy="52" r="9" fill="#374151" />
      <circle cx="34" cy="52" r="5" fill="#8a9a8a" />
      <circle cx="96" cy="52" r="13" fill="#252f26" />
      <circle cx="96" cy="52" r="9" fill="#374151" />
      <circle cx="96" cy="52" r="5" fill="#8a9a8a" />
      <line x1="66" y1="32" x2="66" y2="52" stroke="#4a6a58" strokeWidth="1.8" />
      <ellipse cx="113" cy="42" rx="3" ry="4" fill="#fffde7" opacity="0.9" />
      <ellipse cx="14" cy="44" rx="2.5" ry="3.5" fill="#ff9090" opacity="0.7" />
    </svg>
  );
}

function HouseProp() {
  return (
    <svg viewBox="0 0 100 105" width="90" height="95" aria-hidden="true">
      <ellipse cx="50" cy="102" rx="46" ry="4" fill="#00000018" />
      <rect x="14" y="48" width="72" height="55" rx="3" fill="#c8d8b8" />
      <path d="M 6 50 L 50 8 L 94 50 Z" fill="#8a9a7a" />
      <rect x="62" y="12" width="10" height="20" rx="2" fill="#a09080" />
      <rect x="37" y="68" width="26" height="35" rx="4" fill="#6b7a60" />
      <circle cx="59" cy="85" r="2.8" fill="#c8a060" />
      <rect x="16" y="54" width="22" height="16" rx="2" fill="#b8d8f0" opacity="0.9" />
      <line x1="27" y1="54" x2="27" y2="70" stroke="#c0c8d0" strokeWidth="1" />
      <line x1="16" y1="62" x2="38" y2="62" stroke="#c0c8d0" strokeWidth="1" />
      <rect x="62" y="54" width="22" height="16" rx="2" fill="#b8d8f0" opacity="0.9" />
      <line x1="73" y1="54" x2="73" y2="70" stroke="#c0c8d0" strokeWidth="1" />
      <line x1="62" y1="62" x2="84" y2="62" stroke="#c0c8d0" strokeWidth="1" />
    </svg>
  );
}

function TravelProp() {
  return (
    <svg viewBox="0 0 85 112" width="80" height="105" aria-hidden="true">
      <ellipse cx="44" cy="108" rx="38" ry="4" fill="#00000018" />
      <rect x="12" y="30" width="64" height="68" rx="8" fill="#c8b080" />
      <rect x="12" y="30" width="64" height="12" rx="8" fill="#b8a070" />
      <rect x="12" y="40" width="64" height="3" fill="#a08860" />
      <rect x="30" y="8" width="26" height="6" rx="3" fill="#8a7050" />
      <rect x="30" y="10" width="8" height="22" rx="4" fill="#8a7050" />
      <rect x="48" y="10" width="8" height="22" rx="4" fill="#8a7050" />
      <rect x="12" y="30" width="8" height="68" rx="4" fill="#b8a070" opacity="0.55" />
      <rect x="68" y="30" width="8" height="68" rx="4" fill="#b8a070" opacity="0.55" />
      <rect x="22" y="54" width="20" height="13" rx="3" fill="#d4604a" opacity="0.9" />
      <rect x="46" y="68" width="22" height="11" rx="3" fill="#4a7cb8" opacity="0.9" />
      <circle cx="22" cy="100" r="7" fill="#374151" />
      <circle cx="22" cy="100" r="4" fill="#6b7280" />
      <circle cx="64" cy="100" r="7" fill="#374151" />
      <circle cx="64" cy="100" r="4" fill="#6b7280" />
      <rect x="36" y="58" width="14" height="10" rx="2" fill="#c8a060" />
    </svg>
  );
}

function CareerProp() {
  return (
    <svg viewBox="0 0 110 92" width="110" height="92" aria-hidden="true">
      <ellipse cx="55" cy="88" rx="52" ry="4" fill="#00000018" />
      <rect x="8" y="4" width="94" height="64" rx="6" fill="#2d3748" />
      <rect x="13" y="9" width="84" height="55" rx="4" fill="#1a202c" />
      <rect x="20" y="17" width="28" height="2.5" rx="1" fill="#68d391" opacity="0.85" />
      <rect x="52" y="17" width="18" height="2.5" rx="1" fill="#f6ad55" opacity="0.75" />
      <rect x="24" y="23" width="42" height="2.5" rx="1" fill="#63b3ed" opacity="0.85" />
      <rect x="20" y="29" width="22" height="2.5" rx="1" fill="#fc8181" opacity="0.75" />
      <rect x="46" y="29" width="34" height="2.5" rx="1" fill="#68d391" opacity="0.65" />
      <rect x="24" y="35" width="50" height="2.5" rx="1" fill="#b794f4" opacity="0.75" />
      <rect x="20" y="41" width="30" height="2.5" rx="1" fill="#63b3ed" opacity="0.85" />
      <rect x="20" y="47" width="45" height="2.5" rx="1" fill="#f6ad55" opacity="0.55" />
      <rect x="68" y="41" width="2" height="6" rx="1" fill="#68d391" opacity="0.9" />
      <rect x="8" y="67" width="94" height="4" rx="2" fill="#4a5568" />
      <rect x="4" y="70" width="102" height="12" rx="5" fill="#2d3748" />
      <rect x="14" y="73" width="82" height="5" rx="2" fill="#4a5568" />
    </svg>
  );
}

function FitnessProp() {
  return (
    <svg viewBox="0 0 125 72" width="125" height="72" aria-hidden="true">
      <ellipse cx="62" cy="66" rx="58" ry="5" fill="#00000018" />
      <rect x="30" y="29" width="62" height="12" rx="6" fill="#6b7280" />
      <rect x="40" y="31" width="42" height="8" rx="4" fill="#9ca3af" opacity="0.5" />
      <rect x="4" y="17" width="20" height="36" rx="6" fill="#374151" />
      <rect x="2" y="23" width="10" height="24" rx="5" fill="#4b5563" />
      <rect x="22" y="21" width="10" height="28" rx="4" fill="#4b5563" />
      <rect x="100" y="17" width="20" height="36" rx="6" fill="#374151" />
      <rect x="112" y="23" width="10" height="24" rx="5" fill="#4b5563" />
      <rect x="92" y="21" width="10" height="28" rx="4" fill="#4b5563" />
    </svg>
  );
}

function EducationProp() {
  return (
    <svg viewBox="0 0 100 112" width="95" height="106" aria-hidden="true">
      <ellipse cx="50" cy="108" rx="45" ry="4" fill="#00000018" />
      <rect x="18" y="72" width="64" height="36" rx="5" fill="#f8f0d8" />
      <rect x="18" y="72" width="64" height="6" rx="3" fill="#c8a060" />
      <rect x="18" y="102" width="64" height="6" rx="3" fill="#c8a060" />
      <rect x="28" y="84" width="44" height="2" rx="1" fill="#c8b090" opacity="0.8" />
      <rect x="32" y="89" width="36" height="2" rx="1" fill="#c8b090" opacity="0.65" />
      <rect x="28" y="94" width="44" height="2" rx="1" fill="#c8b090" opacity="0.8" />
      <path d="M 42 77 L 50 87 L 58 77" stroke="#c84040" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="8" y="38" width="84" height="10" rx="2" fill="#374151" />
      <path d="M 18 40 L 50 6 L 82 40 Z" fill="#374151" />
      <circle cx="50" cy="6" r="5.5" fill="#c8a060" />
      <line x1="50" y1="6" x2="80" y2="20" stroke="#c8a060" strokeWidth="2.2" />
      <line x1="80" y1="20" x2="80" y2="52" stroke="#c8a060" strokeWidth="2.2" />
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1="80" y1="52" x2={72 + i * 4} y2="62" stroke="#c8a060" strokeWidth="1.6" />
      ))}
    </svg>
  );
}

function SavingsProp() {
  return (
    <svg viewBox="0 0 100 100" width="95" height="95" aria-hidden="true">
      <ellipse cx="52" cy="96" rx="44" ry="4" fill="#00000018" />
      {[4, 3, 2, 1, 0].map(i => (
        <g key={i}>
          <ellipse cx="52" cy={70 - i * 10} rx="30" ry="10" fill={i % 2 === 0 ? '#c89820' : '#b88010'} />
          <rect x="22" y={60 - i * 10} width="60" height="10" fill={i % 2 === 0 ? '#b88010' : '#a87000'} />
          <ellipse cx="52" cy={60 - i * 10} rx="30" ry="10" fill={i % 2 === 0 ? '#d4a832' : '#c89820'} />
        </g>
      ))}
      {/* £ drawn as simple shapes, no font dependency */}
      <path d="M 48 14 Q 40 14 40 22 L 40 26 L 36 26 L 36 29 L 40 29 L 40 34 L 36 34 L 36 37 L 60 37 L 60 34 L 44 34 L 44 29 L 56 29 L 56 26 L 44 26 L 44 22 Q 44 18 48 18 Q 52 18 54 20 L 57 17 Q 54 14 48 14 Z"
        fill="white" opacity="0.9" />
    </svg>
  );
}

function DefaultProp() {
  return (
    <svg viewBox="0 0 90 110" width="85" height="104" aria-hidden="true">
      <ellipse cx="45" cy="106" rx="38" ry="4" fill="#00000018" />
      <path d="M 25 15 L 65 15 L 72 50 Q 72 70 45 72 Q 18 70 18 50 Z" fill="#d4a832" />
      <path d="M 32 18 L 42 18 L 40 48 Q 36 50 32 44 Z" fill="white" opacity="0.18" />
      <path d="M 18 22 Q 6 22 6 35 Q 6 48 18 48" stroke="#c89820" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 72 22 Q 84 22 84 35 Q 84 48 72 48" stroke="#c89820" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="39" y="72" width="12" height="18" rx="2" fill="#c89820" />
      <rect x="22" y="88" width="46" height="10" rx="4" fill="#b88010" />
      <rect x="28" y="96" width="34" height="6" rx="2" fill="#c89820" />
      {[[-16, -32], [16, -32], [0, -40]].map(([dx, dy], i) => (
        <circle key={i} cx={45 + dx} cy={45 + dy} r={2.8} fill="#fef08a" opacity={0.85} />
      ))}
    </svg>
  );
}

function SceneProp({ scene }: { scene: SceneType }) {
  switch (scene) {
    case 'car':       return <CarProp />;
    case 'house':     return <HouseProp />;
    case 'travel':    return <TravelProp />;
    case 'career':    return <CareerProp />;
    case 'fitness':   return <FitnessProp />;
    case 'education': return <EducationProp />;
    case 'savings':   return <SavingsProp />;
    default:          return <DefaultProp />;
  }
}

// ── Public component ─────────────────────────────────────────────────────────

interface Props {
  goals: Goal[];
  avatar: AvatarOptions;
  compact?: boolean;
}

export function FutureScene({ goals, avatar, compact = false }: Props) {
  const labelled = goals.filter(g => g.label.trim().length > 2);
  if (labelled.length === 0) return null;

  const { scene, matchedLabel } = detectScene(goals);
  const meta = META[scene];
  const displayLabel = matchedLabel || meta.tagline;

  const h = compact ? 190 : 220;

  return (
    <div
      className="rounded-[16px] overflow-hidden relative"
      style={{ background: meta.bg, height: `${h}px` }}
    >
      {/* Ground strip */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-b-[16px]"
        style={{ height: '34px', backgroundColor: meta.ground }}
      />

      {/* Avatar + prop */}
      <div className="absolute inset-0 flex items-end justify-around px-6 pb-8">
        <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))' }}>
          <AvatarSVG options={avatar} size={compact ? 96 : 112} />
        </div>
        <div className="flex items-end">
          <SceneProp scene={scene} />
        </div>
      </div>

      {/* Label */}
      <div className="absolute top-4 left-5 z-10">
        <p className="text-[8px] font-black tracking-[1.2px] uppercase" style={{ color: 'rgba(0,0,0,0.38)' }}>
          YOUR FUTURE SELF
        </p>
        <p
          className="text-[16px] font-black tracking-tight leading-tight mt-0.5 max-w-[160px]"
          style={{ color: 'rgba(0,0,0,0.75)' }}
        >
          {displayLabel}
        </p>
      </div>
    </div>
  );
}
