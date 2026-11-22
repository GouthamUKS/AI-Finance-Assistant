import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { UserProfile, CareerStage } from '../../engine/types';

interface Props {
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
  characterGender: 'male' | 'female';
  setGender: (g: 'male' | 'female') => void;
}

function newStage(): CareerStage {
  return {
    id: crypto.randomUUID(),
    label: '',
    monthlyTakeHome: 3000,
    trainingCost: 0,
    startMonth: 12,
    delayAfterFunding: 3,
    qualificationsRequired: '',
    shareToGoals: 0.5,
  };
}

export function StepCareer({ profile, update, characterGender, setGender }: Props) {
  const setStages = (stages: CareerStage[]) => update({ careerStages: stages });
  const add = () => setStages([...profile.careerStages, newStage()]);
  const remove = (id: string) => setStages(profile.careerStages.filter(s => s.id !== id));
  const patch = (id: string, p: Partial<CareerStage>) =>
    setStages(profile.careerStages.map(s => s.id === id ? { ...s, ...p } : s));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Career & character</h2>
        <p className="text-sm text-slate-400">Career stages feed directly into your forecast. Training is an expense when paid.</p>
      </div>

      {/* Character select */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3">Choose your character</h3>
        <div className="flex gap-4">
          {(['female', 'male'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 rounded-2xl border py-6 flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                characterGender === g
                  ? 'border-blue-500 bg-blue-600/15 text-blue-300'
                  : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              <span className="text-5xl" role="img" aria-label={g}>
                {g === 'female' ? '👩' : '👨'}
              </span>
              <span className="text-sm font-medium capitalize">{g}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">Character appearance evolves as you hit milestones.</p>
      </div>

      {/* Career stages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-medium text-white">Career stages</h3>
            <p className="text-xs text-slate-500">Optional. Each stage shows the absolute take-home — not stacked.</p>
          </div>
          <Button size="sm" variant="ghost" onClick={add}>
            <Plus size={14} /> Add stage
          </Button>
        </div>

        {profile.careerStages.length === 0 && (
          <p className="text-sm text-slate-500 italic">No career stages added. Your income will stay constant throughout the forecast.</p>
        )}

        <div className="space-y-4">
          {profile.careerStages.map((s, i) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Stage {i + 1}</span>
                <Button size="sm" variant="danger" onClick={() => remove(s.id)}>
                  <Trash2 size={12} />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Stage name"
                  value={s.label}
                  onChange={e => patch(s.id, { label: e.target.value })}
                  placeholder="e.g. Senior Developer"
                />
                <Input
                  label="Monthly take-home at this stage"
                  type="number"
                  prefix="£"
                  value={s.monthlyTakeHome}
                  onChange={e => patch(s.id, { monthlyTakeHome: +e.target.value })}
                  isAssumption
                />
                <Input
                  label="Training cost (one-off)"
                  type="number"
                  prefix="£"
                  value={s.trainingCost}
                  onChange={e => patch(s.id, { trainingCost: +e.target.value })}
                />
                <Input
                  label="Earliest start (months from now)"
                  type="number"
                  suffix="months"
                  value={s.startMonth}
                  onChange={e => patch(s.id, { startMonth: +e.target.value })}
                />
                <Input
                  label="Delay after training paid"
                  type="number"
                  suffix="months"
                  value={s.delayAfterFunding}
                  onChange={e => patch(s.id, { delayAfterFunding: +e.target.value })}
                  hint="Study/qualification period before salary applies"
                />
                <Input
                  label="Share of extra income to goals"
                  type="number"
                  suffix="%"
                  value={Math.round(s.shareToGoals * 100)}
                  onChange={e => patch(s.id, { shareToGoals: +e.target.value / 100 })}
                />
                <Input
                  label="Requirements / conditions"
                  value={s.qualificationsRequired}
                  onChange={e => patch(s.id, { qualificationsRequired: e.target.value })}
                  placeholder="e.g. CFA Level 2, 3 years experience"
                  className="sm:col-span-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
