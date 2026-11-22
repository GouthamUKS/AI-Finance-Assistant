import { Input } from '../ui/Input';
import type { UserProfile } from '../../engine/types';

interface Props {
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
  name: string;
  occupation: string;
}

const WORKING = new Set(['Employed full-time', 'Employed part-time', 'Self-employed / Freelance']);

export function StepIncome({ profile, update, name, occupation }: Props) {
  const takeHome = WORKING.has(occupation) ? profile.monthlyTakeHome : (profile.expectedGradSalary ?? 0);
  const surplus = takeHome - profile.monthlyEssentials;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">YOUR FINANCES</p>
        <h2 className="text-[30px] font-black tracking-tight text-[#25332c] leading-tight">
          {name ? `${name}'s` : 'Your'} finances
        </h2>
        <p className="text-[12px] text-[#7e8a82]">Current savings, debts and essential costs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Monthly essential expenses"
          type="number"
          prefix="£"
          value={profile.monthlyEssentials}
          onChange={e => update({ monthlyEssentials: +e.target.value })}
          hint="Rent/mortgage, utilities, insurance, subscriptions"
          className="sm:col-span-2"
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
          label="Total debt"
          type="number"
          prefix="£"
          value={profile.currentDebt}
          onChange={e => update({ currentDebt: +e.target.value })}
          hint="Paid off before goal saving begins"
        />
      </div>

      {surplus > 0 && takeHome > 0 && (
        <div className="rounded-[13px] border border-[#c9ddcd] bg-[#edf3ed] p-4">
          <p className="text-[13px] font-bold text-[#365844]">
            £{surplus.toLocaleString()} left after essentials
          </p>
          <p className="text-[11px] text-[#619070] mt-0.5">
            This is your discretionary budget — we'll break it down on the next step.
          </p>
        </div>
      )}

      {surplus <= 0 && takeHome > 0 && (
        <div className="rounded-[13px] border border-[#e8d9c0] bg-[#faf4ea] p-4">
          <p className="text-[13px] font-bold text-[#6b4a1e]">Expenses exceed income</p>
          <p className="text-[11px] text-[#9c7a4a] mt-0.5">
            The forecast will show this as a deficit. Improving income or cutting essentials closes the gap.
          </p>
        </div>
      )}
    </div>
  );
}
