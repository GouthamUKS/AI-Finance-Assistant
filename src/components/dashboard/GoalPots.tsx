import { Wallet, TrendingUp, Heart } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import type { ForecastResult, UserProfile } from '../../engine/types';

interface Props { forecast: ForecastResult; profile: UserProfile }

const GOAL_ICONS = [
  <Wallet size={16} />,
  <TrendingUp size={16} />,
  <Heart size={16} />,
];
const GOAL_BAR = ['bg-[#6f9e87]', 'bg-[#e2aa78]', 'bg-[#897bd0]'];
const HORIZON = (months: number) =>
  months < 24 ? 'SHORT TERM' : months < 60 ? 'MEDIUM TERM' : 'LONG TERM';
const GOAL_DESCS = [
  'A financial milestone you choose',
  'Career development and earning capacity',
  'A personal or life goal you choose',
];

export function GoalPots({ forecast, profile }: Props) {
  if (profile.goals.length === 0) return null;
  const latestSnap = forecast.months[forecast.months.length - 1];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {profile.goals.map((g, i) => {
        const balance = latestSnap?.potBalances[g.id] ?? 0;
        const pct = Math.min(100, (balance / g.targetAmount) * 100);
        const deadlineSnap = forecast.months[Math.min(g.deadlineMonths - 1, forecast.months.length - 1)];
        const atDeadline = deadlineSnap?.potBalances[g.id] ?? 0;
        const shortfall = Math.max(0, g.targetAmount - atDeadline);

        return (
          <div key={g.id} className="rounded-[13px] border border-[#e5eae3] bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-[10px] bg-[#edf2e9] text-[#688c74] flex items-center justify-center">
                {GOAL_ICONS[i % 3]}
              </div>
              <span className="text-[8px] font-black tracking-[0.6px] text-[#879289] uppercase">
                {HORIZON(g.deadlineMonths)}
              </span>
            </div>

            <h3 className="text-[13px] font-bold text-[#25332c] tracking-tight mb-1">{g.label || 'Unnamed goal'}</h3>
            <p className="text-[9px] text-[#7e8a82] leading-relaxed min-h-[28px] mb-2">
              {GOAL_DESCS[i % 3]}
            </p>

            <div className="text-[18px] font-black text-[#25332c] leading-none">
              £{Math.round(atDeadline).toLocaleString()}
              <span className="text-[9px] font-normal text-[#7e8a82] ml-1">of £{g.targetAmount.toLocaleString()}</span>
            </div>

            <ProgressBar value={pct} color={GOAL_BAR[i % 3]} height="h-[5px]" />

            <div className="flex justify-between text-[8px] text-[#819087] mt-1">
              <span>{shortfall > 0 ? `£${Math.round(shortfall).toLocaleString()} short at deadline` : 'Target funded ✓'}</span>
              <span>{g.deadlineMonths} months</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
