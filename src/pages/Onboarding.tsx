import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { AvatarMini } from '../components/ui/Avatar';
import { StepName } from '../components/onboarding/StepName';
import { StepCharacter } from '../components/onboarding/StepCharacter';
import { StepOccupation } from '../components/onboarding/StepOccupation';
import { StepPlans } from '../components/onboarding/StepPlans';
import { StepIncome } from '../components/onboarding/StepIncome';
import { StepExpenditure } from '../components/onboarding/StepExpenditure';

const STEPS = [
  { key: 'name',       label: 'Name'       },
  { key: 'character',  label: 'Character'  },
  { key: 'situation',  label: 'Situation'  },
  { key: 'plans',      label: 'Your Plans' },
  { key: 'income',     label: 'Finances'   },
  { key: 'spending',   label: 'Spending'   },
];

function canAdvance(step: number, name: string, occupation: string): boolean {
  if (step === 0) return name.trim().length > 0;
  if (step === 2) return occupation.trim().length > 0;
  return true;
}

export function Onboarding() {
  const navigate = useNavigate();
  const {
    onboardingStep: step,
    setOnboardingStep,
    profile,
    updateProfile,
    completeOnboarding,
    name,
    setName,
    occupation,
    setOccupation,
    avatar,
    setAvatar,
    avatarImageUrl,
    setAvatarImageUrl,
    addXP,
  } = useStore();

  const next = () => {
    if (!canAdvance(step, name, occupation)) return;
    if (step < STEPS.length - 1) {
      setOnboardingStep(step + 1);
      addXP(15);
    } else {
      completeOnboarding();
      addXP(50);
      navigate('/dashboard');
    }
  };

  const back = () => {
    if (step === 0) { navigate('/'); return; }
    setOnboardingStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f4] flex flex-col">
      {/* progress bar */}
      <div className="h-[3px] bg-[#e5eae3]">
        <div
          className="h-[3px] bg-[#293d33] transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#e5eae3] bg-white">
        <button
          onClick={back}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#69766e] hover:text-[#25332c] transition-colors cursor-pointer border-0 bg-transparent"
        >
          <ChevronLeft size={15} />
          {step === 0 ? 'Home' : 'Back'}
        </button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < step  ? 'w-6 bg-[#293d33]' :
                i === step ? 'w-8 bg-[#648a74]' :
                'w-4 bg-[#e5eae3]'
              }`}
            />
          ))}
        </div>

        {step > 1 ? (
          <AvatarMini options={avatar} />
        ) : (
          <span className="text-[11px] font-semibold text-[#aab8b0]">{step + 1} / {STEPS.length}</span>
        )}
      </header>

      {/* content */}
      <main className="flex-1 overflow-y-auto px-5 py-7 max-w-xl w-full mx-auto">
        <div key={step} className="step-enter">
          {step === 0 && <StepName name={name} setName={setName} />}
          {step === 1 && <StepCharacter avatar={avatar} setAvatar={setAvatar} avatarImageUrl={avatarImageUrl} setAvatarImageUrl={setAvatarImageUrl} />}
          {step === 2 && <StepOccupation occupation={occupation} setOccupation={setOccupation} name={name} profile={profile} update={updateProfile} />}
          {step === 3 && <StepPlans profile={profile} update={updateProfile} avatar={avatar} />}
          {step === 4 && <StepIncome profile={profile} update={updateProfile} name={name} occupation={occupation} />}
          {step === 5 && <StepExpenditure profile={profile} update={updateProfile} />}
        </div>
      </main>

      {/* footer */}
      <footer className="px-5 py-4 border-t border-[#e5eae3] bg-white max-w-xl w-full mx-auto">
        <Button
          onClick={next}
          disabled={!canAdvance(step, name, occupation)}
          variant="primary"
          className="w-full justify-center py-[11px] text-[12px]"
        >
          {step === STEPS.length - 1 ? `Build ${name ? `${name}'s` : 'my'} plan` : 'Continue'}
          <ChevronRight size={15} />
        </Button>
      </footer>
    </div>
  );
}
