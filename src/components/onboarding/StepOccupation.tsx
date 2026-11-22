import { Input } from '../ui/Input';
import type { UserProfile } from '../../engine/types';

const EMPLOYMENT_OPTIONS = [
  'Employed full-time',
  'Employed part-time',
  'Self-employed / Freelance',
  'Student',
  'Job searching',
  'Career break',
  'Retired',
];

const WORKING = new Set(['Employed full-time', 'Employed part-time', 'Self-employed / Freelance']);

interface Props {
  occupation: string;
  setOccupation: (o: string) => void;
  name: string;
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
}

export function StepOccupation({ occupation, setOccupation, name, profile, update }: Props) {
  const isStudent = occupation === 'Student';
  const isWorking = WORKING.has(occupation);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">YOUR SITUATION</p>
        <h2 className="text-[30px] font-black tracking-tight text-[#25332c] leading-tight">
          What do you do{name ? `, ${name}` : ''}?
        </h2>
        <p className="text-[12px] text-[#7e8a82]">Your current situation shapes what's realistic.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {EMPLOYMENT_OPTIONS.map(o => (
          <button
            key={o}
            onClick={() => setOccupation(o)}
            className={`rounded-[9px] border px-3 py-3 text-[11px] font-medium text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#293d33] ${
              occupation === o
                ? 'border-[#648a74] bg-[#edf3ed] text-[#365844] font-bold'
                : 'border-[#e5eae3] text-[#69766e] bg-white hover:bg-[#f6f8f4]'
            }`}
            aria-pressed={occupation === o}
          >
            {o}
          </button>
        ))}
      </div>

      <Input
        label="Or describe your situation"
        value={EMPLOYMENT_OPTIONS.includes(occupation) ? '' : occupation}
        onChange={e => setOccupation(e.target.value)}
        placeholder="e.g. Part-time nurse, studying evenings"
        hint="Optional — helps personalise suggestions"
      />

      {isStudent && (
        <div className="rounded-[13px] border border-[#c9ddcd] bg-[#edf3ed] p-5 space-y-4">
          <p className="text-[9px] font-black tracking-[1.15px] text-[#648a74] uppercase">After graduation</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Expected monthly take-home"
              type="number"
              prefix="£"
              value={profile.expectedGradSalary || ''}
              onChange={e => update({ expectedGradSalary: +e.target.value })}
              hint="Post-tax, post-graduation estimate"
              isAssumption
            />
            <Input
              label="Months until graduation"
              type="number"
              suffix="months"
              value={profile.expectedGradMonths || ''}
              onChange={e => update({ expectedGradMonths: +e.target.value })}
            />
          </div>
        </div>
      )}

      {isWorking && (
        <div className="rounded-[13px] border border-[#c9ddcd] bg-[#edf3ed] p-5 space-y-5">
          <Input
            label="Monthly take-home (post tax & NI)"
            type="number"
            prefix="£"
            value={profile.monthlyTakeHome || ''}
            onChange={e => update({ monthlyTakeHome: +e.target.value })}
            hint="Your actual bank deposit each month"
          />

          <div className="space-y-2">
            <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">Planning a job switch?</p>
            <div className="flex gap-2">
              {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(({ val, label }) => (
                <button
                  key={label}
                  onClick={() => update({ planningJobSwitch: val })}
                  className={`px-5 py-2 rounded-[9px] text-[11px] border transition-colors cursor-pointer font-semibold ${
                    profile.planningJobSwitch === val
                      ? 'border-[#648a74] bg-white text-[#365844] font-bold'
                      : 'border-[#e5eae3] text-[#69766e] bg-white/60 hover:bg-white'
                  }`}
                  aria-pressed={profile.planningJobSwitch === val}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {profile.planningJobSwitch && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Expected take-home at new job"
                type="number"
                prefix="£"
                value={profile.jobSwitchSalary || ''}
                onChange={e => update({ jobSwitchSalary: +e.target.value })}
                isAssumption
              />
              <Input
                label="In how many months?"
                type="number"
                suffix="months"
                value={profile.jobSwitchMonths || ''}
                onChange={e => update({ jobSwitchMonths: +e.target.value })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
