import { computeSelfTax } from '../../engine/calculator';
import { CATEGORY_CONFIGS } from '../../engine/defaults';
import type { UserProfile } from '../../engine/types';

interface Props { profile: UserProfile }

export function SelfTaxPanel({ profile }: Props) {
  const taxableCats = CATEGORY_CONFIGS.filter(c => !c.isEssential);

  let totalLevy = 0;
  let charityRebate = 0;
  const rows: { label: string; spent: number; taxed: number; allowance: number }[] = [];

  for (const c of taxableCats) {
    const spent = profile.monthlyDiscretionary[c.category] ?? 0;
    const rate = profile.selfTaxRates[c.category] ?? 0;
    const allowance = profile.categoryAllowances[c.category] ?? 0;
    const tax = computeSelfTax(spent, Math.abs(rate), allowance, 0);
    if (rate < 0) {
      charityRebate += tax;
    } else {
      totalLevy += tax;
    }
    if (spent > 0) rows.push({ label: c.label, spent, taxed: rate < 0 ? -tax : tax, allowance });
  }
  const netRebate = Math.min(charityRebate, totalLevy);
  const netLevy = totalLevy - netRebate;

  const totalDiscretionary = Object.values(profile.monthlyDiscretionary).reduce((a, b) => a + b, 0);
  const available = profile.monthlyTakeHome - profile.monthlyEssentials - totalDiscretionary;
  const sweep = profile.autoSweep ? Math.max(0, available - netLevy) : 0;
  const totalProgress = netLevy + sweep;

  return (
    <div className="rounded-[13px] border border-[#e5eae3] bg-white p-4 space-y-4">
      <div>
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">MONEY WITH INTENTION</p>
        <h3 className="text-[15px] font-black tracking-tight text-[#25332c] mt-1 mb-0">Self-Tax & Sweep</h3>
        <p className="text-[9px] text-[#7e8a82] mt-1">Voluntary transfer of your own money into your plan</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Self-tax levy',      value: netLevy,       color: 'text-[#648a74]'  },
          { label: 'End-of-month sweep', value: sweep,          color: 'text-[#50725c]' },
          { label: 'Total to plan',      value: totalProgress,  color: 'text-[#25332c]' },
        ].map(item => (
          <div key={item.label} className="rounded-[9px] bg-[#f6f8f4] border border-[#e5eae3] p-3 text-center">
            <p className={`text-[16px] font-black ${item.color}`}>£{Math.round(item.value).toLocaleString()}</p>
            <p className="text-[8px] text-[#7e8a82] mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {charityRebate > 0 && (
        <div className="rounded-[9px] border border-[#c9ddcd] bg-[#edf3ed] p-3 text-[9px] text-[#50725c]">
          Charity rebate: £{Math.round(netRebate)} returned (funded from levy, not from goals).
          {netRebate < charityRebate && ` Rebate capped — only £${Math.round(netRebate)} available.`}
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">Category breakdown</p>
        {rows.map(r => (
          <div key={r.label} className="flex justify-between text-[9px]">
            <span className="text-[#7e8a82]">{r.label}</span>
            <div className="flex gap-3 text-right">
              <span className="text-[#aab8b0] w-16">£{r.spent} spent</span>
              <span className="text-[#aab8b0] w-16">£{r.allowance} free</span>
              <span className={`w-14 font-semibold ${r.taxed < 0 ? 'text-[#648a74]' : 'text-[#405c48]'}`}>
                {r.taxed < 0 ? '−' : '+'}£{Math.abs(Math.round(r.taxed))}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[9px] text-[#aab8b0] leading-relaxed italic">
        Rates and allowances alone do not change total saving if spending is unchanged. Spending less is what creates more surplus.
      </p>
    </div>
  );
}
