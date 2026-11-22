import { Input, Select } from '../ui/Input';
import { CATEGORY_CONFIGS } from '../../engine/defaults';
import type { UserProfile } from '../../engine/types';

interface Props {
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
}

export function StepChanges({ profile, update }: Props) {
  const taxableCats = CATEGORY_CONFIGS.filter(c => !c.isEssential);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">What are you willing to change?</h2>
        <p className="text-sm text-slate-400">Set your self-tax rates and sweep preferences. Zero-rated categories are never taxed.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-1">
          <p className="text-sm font-medium text-blue-300">How self-tax works</p>
          <p className="text-xs text-slate-400">
            Self-tax is a voluntary transfer of your own money into your plan. It is not government tax or free money.
            Charity has a negative rate — a rebate funded only from positive levies. Spending less creates more surplus.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1">Sweep unspent money?</label>
          <div className="flex gap-3">
            {(['true', 'false'] as const).map(v => (
              <button
                key={v}
                onClick={() => update({ autoSweep: v === 'true' })}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  String(profile.autoSweep) === v
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                {v === 'true' ? 'Auto sweep' : 'Manual only'}
              </button>
            ))}
          </div>
        </div>

        <Select
          label="Emergency fund priority"
          value={profile.emergencyPriority}
          onChange={v => update({ emergencyPriority: v as UserProfile['emergencyPriority'] })}
          options={[
            { value: 'first',    label: 'Fill emergency fund first' },
            { value: 'alongside', label: 'Build alongside goals' },
            { value: 'starter',  label: 'Starter buffer, then split' },
          ]}
        />

        <Input
          label="Emergency fund target"
          type="number"
          prefix="£"
          value={profile.emergencyTarget}
          onChange={e => update({ emergencyTarget: +e.target.value })}
        />

        {profile.emergencyPriority === 'starter' && (
          <>
            <Input
              label="Starter buffer amount"
              type="number"
              prefix="£"
              value={profile.emergencyStarterAmount}
              onChange={e => update({ emergencyStarterAmount: +e.target.value })}
            />
            <Input
              label="Emergency split (after starter)"
              type="number"
              suffix="%"
              value={Math.round(profile.emergencySplitFraction * 100)}
              onChange={e => update({ emergencySplitFraction: +e.target.value / 100 })}
              hint="% of surplus to emergency until full"
            />
          </>
        )}

        <Input
          label="Expected annual investment return"
          type="number"
          suffix="%"
          value={Math.round(profile.annualReturnRate * 100)}
          onChange={e => update({ annualReturnRate: +e.target.value / 100 })}
          isAssumption
          hint="0% disables growth. Use negative for a stress test."
        />
      </div>

      <div>
        <h3 className="text-base font-medium text-white mb-1">Self-tax rates by category</h3>
        <p className="text-xs text-slate-500 mb-4">Tax applies only to spending above your monthly allowance. Charity rate is negative (rebate).</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {taxableCats.map(c => (
            <div key={c.category} className="space-y-2">
              <Input
                label={`${c.label} — rate`}
                type="number"
                suffix="%"
                value={Math.round((profile.selfTaxRates[c.category] ?? 0) * 100)}
                onChange={e => update({ selfTaxRates: { ...profile.selfTaxRates, [c.category]: +e.target.value / 100 } })}
              />
              <Input
                label="Allowance"
                type="number"
                prefix="£"
                value={profile.categoryAllowances[c.category] ?? 0}
                onChange={e => update({ categoryAllowances: { ...profile.categoryAllowances, [c.category]: +e.target.value } })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
