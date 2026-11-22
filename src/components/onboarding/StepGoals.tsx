import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import type { UserProfile, Goal } from '../../engine/types';

interface Props {
  profile: UserProfile;
  update: (p: Partial<UserProfile>) => void;
}

function newGoal(type: Goal['type']): Goal {
  return {
    id: crypto.randomUUID(),
    type,
    label: '',
    targetAmount: 10000,
    deadlineMonths: 36,
    priority: 2,
    description: '',
    ongoingCost: 0,
  };
}

export function StepGoals({ profile, update }: Props) {
  const setGoals = (goals: Goal[]) => update({ goals });

  const addGoal = (type: Goal['type']) => setGoals([...profile.goals, newGoal(type)]);
  const removeGoal = (id: string) => setGoals(profile.goals.filter(g => g.id !== id));
  const patchGoal = (id: string, partial: Partial<Goal>) =>
    setGoals(profile.goals.map(g => g.id === id ? { ...g, ...partial } : g));

  const goalsByType = (type: Goal['type']) => profile.goals.filter(g => g.type === type);

  const typeConfig: { type: Goal['type']; label: string; desc: string; color: string }[] = [
    { type: 'financial', label: 'Financial Goal',  desc: 'Save, invest, buy, pay off',   color: 'text-emerald-400' },
    { type: 'career',    label: 'Career Goal',     desc: 'Qualification, role, earning', color: 'text-blue-400'    },
    { type: 'personal',  label: 'Personal / Life', desc: 'Travel, home, family, health', color: 'text-amber-400'   },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Where do you want to go?</h2>
        <p className="text-sm text-slate-400">Up to one goal per type. Focus your plan.</p>
      </div>

      {typeConfig.map(tc => (
        <div key={tc.type} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${tc.color}`}>{tc.label}</h3>
              <p className="text-xs text-slate-500">{tc.desc}</p>
            </div>
            {goalsByType(tc.type).length === 0 && (
              <Button size="sm" variant="ghost" onClick={() => addGoal(tc.type)}>
                <Plus size={14} /> Add
              </Button>
            )}
          </div>

          {goalsByType(tc.type).map(g => (
            <div key={g.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Goal name"
                  value={g.label}
                  onChange={e => patchGoal(g.id, { label: e.target.value })}
                  placeholder="e.g. First home deposit"
                />
                <Input
                  label="Target amount"
                  type="number"
                  prefix="£"
                  value={g.targetAmount}
                  onChange={e => patchGoal(g.id, { targetAmount: +e.target.value })}
                />
                <Input
                  label="Deadline (months from now)"
                  type="number"
                  suffix="months"
                  value={g.deadlineMonths}
                  onChange={e => patchGoal(g.id, { deadlineMonths: +e.target.value })}
                />
                <Select
                  label="Priority"
                  value={String(g.priority)}
                  onChange={v => patchGoal(g.id, { priority: +v as 1 | 2 | 3 })}
                  options={[
                    { value: '1', label: '1 — Highest' },
                    { value: '2', label: '2 — Medium' },
                    { value: '3', label: '3 — Lower' },
                  ]}
                />
                <Input
                  label="What reaching this means"
                  value={g.description}
                  onChange={e => patchGoal(g.id, { description: e.target.value })}
                  placeholder="Describe the outcome"
                  className="sm:col-span-2"
                />
                <Input
                  label="Ongoing monthly cost once reached"
                  type="number"
                  prefix="£"
                  value={g.ongoingCost}
                  onChange={e => patchGoal(g.id, { ongoingCost: +e.target.value })}
                  hint="Mortgage, subscriptions, etc. (optional)"
                  isAssumption
                />
              </div>
              <Button size="sm" variant="danger" onClick={() => removeGoal(g.id)}>
                <Trash2 size={14} /> Remove goal
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
