import { Input } from '../ui/Input';
import { CATEGORY_CONFIGS } from '../../engine/defaults';
import type { UserProfile, SpendingCategory } from '../../engine/types';

interface Props {
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
}

const OPTIONAL_CATS = CATEGORY_CONFIGS.filter(c => !c.isEssential);

export function StepExpenditure({ profile, update }: Props) {
  const updateCat = (cat: SpendingCategory, val: number) =>
    update({ monthlyDiscretionary: { ...profile.monthlyDiscretionary, [cat]: val } });

  const totalDiscretionary = OPTIONAL_CATS.reduce(
    (s, c) => s + (profile.monthlyDiscretionary[c.category] ?? 0), 0
  );
  const available = profile.monthlyTakeHome - profile.monthlyEssentials;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">YOUR SPENDING</p>
        <h2 className="text-[30px] font-black tracking-tight text-[#25332c] leading-tight">Current spending</h2>
        <p className="text-[12px] text-[#7e8a82]">
          Your actual monthly spend — not what you'd like it to be.
          Bills and essentials are already captured.
        </p>
      </div>

      <div className="rounded-[13px] border border-[#e5eae3] bg-white px-4 py-3 flex justify-between items-center">
        <span className="text-[11px] text-[#7e8a82] font-medium">Discretionary total</span>
        <div className="text-right">
          <span className={`text-[16px] font-black ${totalDiscretionary > available && available > 0 ? 'text-[#b05050]' : 'text-[#25332c]'}`}>
            £{totalDiscretionary.toLocaleString()}
          </span>
          {available > 0 && (
            <span className="text-[10px] text-[#aab8b0] ml-1">/ £{available.toLocaleString()} available</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {OPTIONAL_CATS.map(c => (
          <Input
            key={c.category}
            label={c.label}
            type="number"
            prefix="£"
            value={profile.monthlyDiscretionary[c.category] ?? 0}
            onChange={e => updateCat(c.category, +e.target.value)}
          />
        ))}
      </div>

      <p className="text-[10px] text-[#aab8b0] leading-relaxed">
        Self-tax settings — redirecting a slice of each category to your goals — are available in plan settings after you're set up.
      </p>
    </div>
  );
}
