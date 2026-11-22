import { Input } from '../ui/Input';
import { FutureScene } from '../ui/FutureScene';
import type { UserProfile, Goal } from '../../engine/types';
import type { AvatarOptions } from '../../store/useStore';

interface Props {
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
  avatar: AvatarOptions;
}

function ensureGoal(goals: Goal[], type: Goal['type']): Goal {
  const existing = goals.find(g => g.type === type);
  if (existing) return existing;
  return {
    id: crypto.randomUUID(),
    type,
    label: '',
    targetAmount: type === 'financial' ? 10000 : type === 'career' ? 5000 : 3000,
    deadlineMonths: type === 'financial' ? 36 : type === 'career' ? 24 : 18,
    priority: type === 'financial' ? 2 : type === 'career' ? 1 : 3,
    description: '',
    ongoingCost: 0,
  };
}

const TYPE_CONFIG = [
  {
    type: 'financial' as const,
    icon: '◈',
    title: 'Personal Savings',
    subtitle: 'Build a fund, pay off debt, buy something specific',
    color: 'border-[#c9ddcd] bg-[#edf3ed]',
    titleColor: 'text-[#365844]',
  },
  {
    type: 'career' as const,
    icon: '◉',
    title: 'Career Goal',
    subtitle: 'Qualification, role change, earning more',
    color: 'border-[#c9d6e8] bg-[#edf1f8]',
    titleColor: 'text-[#2e4a6b]',
  },
  {
    type: 'personal' as const,
    icon: '◎',
    title: 'Personal Goal',
    subtitle: 'Travel, home, family, health, or anything that matters',
    color: 'border-[#e8d9c0] bg-[#faf4ea]',
    titleColor: 'text-[#6b4a1e]',
  },
];

export function StepPlans({ profile, update, avatar }: Props) {
  const getGoal = (type: Goal['type']) => profile.goals.find(g => g.type === type) ?? ensureGoal(profile.goals, type);

  const patchGoal = (type: Goal['type'], patch: Partial<Goal>) => {
    const existing = profile.goals.find(g => g.type === type);
    if (existing) {
      update({ goals: profile.goals.map(g => g.type === type ? { ...g, ...patch } : g) });
    } else {
      const fresh = { ...ensureGoal(profile.goals, type), ...patch };
      update({ goals: [...profile.goals, fresh] });
    }
  };

  // auto-add all 3 goals if not present yet
  const ensureAll = () => {
    const types: Goal['type'][] = ['financial', 'career', 'personal'];
    const missing = types.filter(t => !profile.goals.find(g => g.type === t));
    if (missing.length > 0) {
      update({ goals: [...profile.goals, ...missing.map(t => ensureGoal(profile.goals, t))] });
    }
  };

  if (profile.goals.length === 0) ensureAll();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">YOUR THREE PLANS</p>
        <h2 className="text-[30px] font-black tracking-tight text-[#25332c] leading-tight">Set your goals</h2>
        <p className="text-[12px] text-[#7e8a82]">One goal of each type. Focus creates results.</p>
      </div>

      {TYPE_CONFIG.map(tc => {
        const g = getGoal(tc.type);
        return (
          <div key={tc.type} className={`rounded-[13px] border ${tc.color} p-5 space-y-4`}>
            <div className="flex items-center gap-3">
              <span className={`text-[22px] leading-none ${tc.titleColor}`}>{tc.icon}</span>
              <div>
                <h3 className={`text-[13px] font-bold ${tc.titleColor}`}>{tc.title}</h3>
                <p className="text-[11px] text-[#7e8a82]">{tc.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="What's the goal?"
                value={g.label}
                onChange={e => patchGoal(tc.type, { label: e.target.value })}
                placeholder={tc.type === 'financial' ? 'e.g. First home deposit' : tc.type === 'career' ? 'e.g. Become a data analyst' : 'e.g. 3-month travel adventure'}
                className="sm:col-span-2"
              />
              <Input
                label="Target amount"
                type="number"
                prefix="£"
                value={g.targetAmount}
                onChange={e => patchGoal(tc.type, { targetAmount: +e.target.value })}
              />
              <Input
                label="In how many months?"
                type="number"
                suffix="months"
                value={g.deadlineMonths}
                onChange={e => patchGoal(tc.type, { deadlineMonths: +e.target.value })}
              />
            </div>
          </div>
        );
      })}

      <FutureScene goals={profile.goals} avatar={avatar} compact />
    </div>
  );
}
