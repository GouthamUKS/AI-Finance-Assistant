import { TrendingDown, Briefcase, Shield, BarChart2 } from 'lucide-react';
import { generateSuggestions } from '../../engine/suggestions';
import type { UserProfile, ForecastResult } from '../../engine/types';
import { Button } from '../ui/Button';

interface Props { profile: UserProfile; forecast: ForecastResult }

const TYPE_ICON: Record<string, React.ReactNode> = {
  spending:  <TrendingDown size={13} />,
  saving:    <BarChart2 size={13} />,
  career:    <Briefcase size={13} />,
  emergency: <Shield size={13} />,
};

export function Suggestions({ profile, forecast }: Props) {
  const suggestions = generateSuggestions(profile, forecast);

  return (
    <div className="rounded-[13px] border border-[#e5eae3] bg-white p-4 flex flex-col">
      <div className="mb-1">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">THE NEXT SMALL STEP</p>
        <h3 className="text-[15px] font-black tracking-tight text-[#25332c] mt-1 mb-1">Build a plan around your life</h3>
        <p className="text-[9px] text-[#7e8a82] leading-relaxed">
          Record what comes in, what you spend, what you want to protect, and where you'd like to go.
        </p>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 divide-y divide-[#f0f4ef] flex-1">
          {suggestions.slice(0, 3).map((s, i) => (
            <div key={s.id} className="py-2.5 first:pt-1">
              <div className="flex items-start gap-2">
                <span className="text-[#819087] mt-0.5 shrink-0">{TYPE_ICON[s.type]}</span>
                <div>
                  <p className="text-[11px] font-semibold text-[#25332c]">{s.title}</p>
                  <p className="text-[9px] text-[#7e8a82] leading-relaxed mt-0.5">{s.detail}</p>
                </div>
                <span className="text-[8px] text-[#aab8b0] shrink-0 tabular-nums mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && (
        <p className="text-[11px] text-[#7e8a82] mt-3 flex-1">Your plan is well-structured. No significant gaps detected.</p>
      )}

      <Button variant="soft" size="sm" className="mt-4 w-full justify-center">
        Edit assumptions →
      </Button>
    </div>
  );
}
