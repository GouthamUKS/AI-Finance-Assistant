import { ProgressBar } from '../ui/ProgressBar';
import { AvatarSVG } from '../ui/Avatar';
import type { AvatarOptions } from '../../store/useStore';

interface Props {
  gender: AvatarOptions['gender'];
  level: number;
  xp: number;
  goalsCount: number;
  avatar: AvatarOptions;
}

function levelTitle(level: number): string {
  if (level < 3)  return 'Planner';
  if (level < 6)  return 'Builder';
  if (level < 10) return 'Investor';
  if (level < 15) return 'Strategist';
  return 'Visionary';
}

const QUESTS = [
  { id: 'goals',  label: 'Set 3 goals',             xp: 20, done: (g: number) => g >= 3 },
  { id: 'review', label: 'Open the Delusion Meter', xp: 10, done: () => true },
  { id: 'career', label: 'Add a career stage',      xp: 15, done: () => false },
];

export function CharacterPanel({ level, xp, goalsCount, avatar }: Props) {
  const xpToNext = level * 100;
  const xpThisLevel = xp - (level - 1) * 100;
  const questDone = [goalsCount >= 3, true, false];

  return (
    <div className="rounded-[13px] border border-[#e5eae3] bg-[#fbf9f2] p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-20 h-24 rounded-[12px] bg-[#edf3ed] border border-[#e5eae3] flex items-end justify-center overflow-hidden shrink-0">
          <AvatarSVG options={avatar} size={80} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-bold text-[#25332c]">{levelTitle(level)}</span>
            <span className="text-[8px] text-[#648a74] border border-[#b8d4c0] rounded px-1.5 py-0.5 bg-[#edf3ed] font-bold shrink-0">Lv {level}</span>
          </div>
          <p className="text-[9px] text-[#7e8a82] mt-0.5">{xp} XP total</p>
          <div className="mt-2">
            <ProgressBar value={(xpThisLevel / xpToNext) * 100} color="bg-[#648a74]" />
            <p className="text-[9px] text-[#aab8b0] mt-1">{xpThisLevel} / {xpToNext} XP</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-2">GROW AS YOU GO</p>
        <div className="space-y-1.5">
          {QUESTS.map((q, i) => (
            <div key={q.id} className={`flex items-center justify-between rounded-[8px] px-3 py-2 ${questDone[i] ? 'bg-[#edf3ed] border border-[#c9ddcd]' : 'bg-white border border-[#e5eae3]'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${questDone[i] ? 'bg-[#648a74] border-[#648a74]' : 'border-[#c8d4c5]'}`}>
                  {questDone[i] && <span className="text-white" style={{ fontSize: 9 }}>✓</span>}
                </div>
                <span className={`text-[9px] font-medium ${questDone[i] ? 'text-[#50725c] line-through opacity-60' : 'text-[#25332c]'}`}>{q.label}</span>
              </div>
              <span className="text-[9px] text-[#af8848] font-bold shrink-0">+{q.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[9px] text-[#aab8b0] leading-relaxed">Rewards for planning and consistency. Prototype only — achievements are simulated.</p>
    </div>
  );
}
