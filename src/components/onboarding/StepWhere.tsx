import { Input } from '../ui/Input';
import { CATEGORY_CONFIGS } from '../../engine/defaults';
import type { UserProfile, SpendingCategory } from '../../engine/types';

interface Props {
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
}

const ESSENTIAL_CATS: SpendingCategory[] = ['bills', 'groceries', 'transport', 'family', 'finances', 'personal_care', 'savings', 'transfers'];

export function StepWhere({ profile, update }: Props) {
  const updateDiscretionary = (cat: SpendingCategory, val: number) => {
    update({ monthlyDiscretionary: { ...profile.monthlyDiscretionary, [cat]: val } });
  };

  const optionalCats = CATEGORY_CONFIGS.filter(c => !ESSENTIAL_CATS.includes(c.category));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Where are you now?</h2>
        <p className="text-sm text-slate-400">Your current financial picture. We use this to build your personal route.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Monthly take-home income"
          type="number"
          prefix="£"
          value={profile.monthlyTakeHome}
          onChange={e => update({ monthlyTakeHome: +e.target.value })}
          hint="After tax, national insurance, etc."
        />
        <Input
          label="Monthly essential expenses"
          type="number"
          prefix="£"
          value={profile.monthlyEssentials}
          onChange={e => update({ monthlyEssentials: +e.target.value })}
          hint="Rent, utilities, insurance, etc."
        />
        <Input
          label="Current savings"
          type="number"
          prefix="£"
          value={profile.currentSavings}
          onChange={e => update({ currentSavings: +e.target.value })}
        />
        <Input
          label="Emergency fund"
          type="number"
          prefix="£"
          value={profile.emergencySavings}
          onChange={e => update({ emergencySavings: +e.target.value })}
        />
        <Input
          label="Current investments"
          type="number"
          prefix="£"
          value={profile.currentInvestments}
          onChange={e => update({ currentInvestments: +e.target.value })}
        />
        <Input
          label="Current debt"
          type="number"
          prefix="£"
          value={profile.currentDebt}
          onChange={e => update({ currentDebt: +e.target.value })}
          hint="Total outstanding (excludes mortgage if covered in essentials)"
        />
      </div>

      <div>
        <h3 className="text-base font-medium text-white mb-3">Monthly discretionary spending</h3>
        <p className="text-xs text-slate-500 mb-4">Your actual spending, not your ideal. Be honest — this is for your eyes only.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {optionalCats.map(c => (
            <Input
              key={c.category}
              label={c.label}
              type="number"
              prefix="£"
              value={profile.monthlyDiscretionary[c.category] ?? 0}
              onChange={e => updateDiscretionary(c.category, +e.target.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
