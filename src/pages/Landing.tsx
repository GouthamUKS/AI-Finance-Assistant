import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function Landing() {
  const navigate = useNavigate();
  const { resetOnboarding } = useStore();

  const start = () => {
    resetOnboarding();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#f6f8f4] flex flex-col">
      <header className="px-6 sm:px-10 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[11px] bg-[#293d33] text-white flex items-center justify-center font-black text-lg leading-none">f</div>
          <span className="font-black tracking-tight text-[#25332c] text-sm">future self</span>
        </div>
        <span className="text-[9px] font-bold text-[#819087] tracking-[0.7px]">prototype · simulated</span>
      </header>

      <main className="flex-1 px-6 sm:px-10 pt-10 pb-16 max-w-5xl mx-auto w-full flex flex-col">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-4">YOUR FUTURE, YOUR TERMS</p>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6 text-[#25332c]">
          Small choices.<br />
          <em className="not-italic text-[#73917d]">Big becoming.</em>
        </h1>

        <p className="text-[13px] text-[#7e8a82] max-w-xs leading-relaxed mb-10">
          Connect today's choices to the future you're building — goals, income, and all the gaps.
        </p>

        <button
          onClick={start}
          className="self-start inline-flex items-center gap-3 bg-[#293d33] text-white font-bold px-[14px] py-[11px] rounded-[9px] hover:bg-[#365744] transition-colors text-[11px] cursor-pointer"
        >
          Personalise my plan ↗
        </button>

        <div className="mt-20 border-t border-[#e5eae3] pt-8 grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-10">
          {[
            { label: 'Delusion Meter',  desc: 'Honest gap analysis on every goal.' },
            { label: 'Self-Tax',        desc: 'Redirect unspent money automatically.' },
            { label: '10-year view',    desc: 'Month-by-month projection, one engine.' },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[12px] font-bold text-[#25332c] tracking-tight">{f.label}</p>
              <p className="text-[11px] text-[#7e8a82] mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-6 sm:px-10 py-5 border-t border-[#e5eae3]">
        <p className="text-[9px] text-[#aab8b0]">
          No real money moves. No bank connection. All numbers are simulated.
        </p>
      </footer>
    </div>
  );
}
