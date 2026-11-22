import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { UserProfile } from '../engine/types';
import type { ForecastResult } from '../engine/types';
import type { AvatarOptions } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { AvatarSVG } from '../components/ui/Avatar';
import { DelusionMeter } from '../components/dashboard/DelusionMeter';
import { SelfTaxPanel } from '../components/dashboard/SelfTaxPanel';
import { GoalPots } from '../components/dashboard/GoalPots';
import { ComparisonChart } from '../components/dashboard/ComparisonChart';
import { CharacterPanel } from '../components/dashboard/CharacterPanel';
import { OpenMath } from '../components/dashboard/OpenMath';
import { Suggestions } from '../components/dashboard/Suggestions';
import { FutureScene } from '../components/ui/FutureScene';

type Page = 'Overview' | 'Your route' | 'Spending rules' | 'Compare futures';
const NAV: Page[] = ['Overview', 'Your route', 'Spending rules', 'Compare futures'];

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, forecast, name, avatar, level, xp, recomputeForecast } = useStore();
  const [page, setPage] = useState<Page>('Overview');

  if (!forecast) {
    recomputeForecast();
    return (
      <div className="min-h-screen bg-[#f6f8f4] flex items-center justify-center">
        <p className="text-[#7e8a82] text-sm">Building forecast…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      {/* sidebar — desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[228px] bg-white border-r border-[#e5eae3] flex-col px-4 py-6 z-20">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-[34px] h-[34px] rounded-[11px] bg-[#293d33] text-white flex items-center justify-center font-black text-lg leading-none">f</div>
          <span className="font-black tracking-tight text-[#25332c] text-sm">future self</span>
        </div>

        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-2.5 px-2">YOUR SPACE</p>

        <nav className="flex flex-col gap-1">
          {NAV.map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`text-left px-3 py-[11px] rounded-[9px] text-[12px] transition-colors cursor-pointer border-0 bg-transparent ${
                page === p
                  ? 'bg-[#edf3ed] text-[#365844] font-bold'
                  : 'text-[#69766e] hover:bg-[#f6f8f4] font-medium'
              }`}
            >
              {p}
            </button>
          ))}
        </nav>

        <div className="mt-8 p-3 rounded-[12px] text-[11px]" style={{ background: 'linear-gradient(135deg,#e9e4d7,#c9ddcd)' }}>
          <strong className="block text-[#25332c]">Your future, your way</strong>
          <small className="block text-[#738078] mt-1 text-[10px]">A plan that starts with you</small>
        </div>

        <div className="mt-auto border-t border-[#e5eae3] pt-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#edf3ed] overflow-hidden flex items-end justify-center shrink-0">
            <AvatarSVG options={avatar} size={32} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#25332c] truncate">{name || 'Your plan'}</p>
            <p className="text-[9px] text-[#7e8a82]">Lv {level} · {xp} XP</p>
          </div>
        </div>
      </aside>

      {/* mobile header */}
      <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-[#e5eae3] flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-[9px] bg-[#293d33] text-white flex items-center justify-center font-black text-sm shrink-0 leading-none">f</div>
        <div className="flex gap-1 overflow-x-auto">
          {NAV.map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-[7px] text-[11px] cursor-pointer transition-colors border-0 ${
                page === p ? 'bg-[#edf3ed] text-[#365844] font-bold' : 'text-[#69766e] font-medium bg-transparent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={() => navigate('/onboarding')} className="ml-auto shrink-0">
          Edit
        </Button>
      </header>

      <div className="lg:ml-[228px]">
        {/* top bar — desktop */}
        <header className="hidden lg:flex h-[62px] bg-white border-b border-[#e5eae3] items-center justify-between px-[34px] sticky top-0 z-10">
          <span className="text-[9px] font-black tracking-[1px] text-[#7c8981] uppercase">YOUR PLAN / {page.toUpperCase()}</span>
          <div className="flex items-center gap-3">
            <span className="rounded-[20px] bg-[#edf3ed] text-[#61816d] px-2.5 py-1 text-[8px] font-black tracking-[0.7px]">SIMULATED PLAN</span>
            <button
              onClick={() => navigate('/onboarding')}
              className="text-[11px] font-bold text-[#62846e] cursor-pointer hover:text-[#293d33] transition-colors border-0 bg-transparent"
            >
              Edit plan ↗
            </button>
          </div>
        </header>

        <main className="max-w-[1250px] mx-auto px-4 sm:px-[34px] py-7">
          {/* heading */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">
                {page === 'Overview' ? 'YOUR FUTURE, YOUR TERMS' :
                 page === 'Your route' ? 'FROM HERE TO THERE' :
                 page === 'Spending rules' ? 'MONEY WITH INTENTION' : 'SAME CASH, DIFFERENT PATHS'}
              </p>
              <h1 className="text-[30px] font-black tracking-tight text-[#25332c] mt-1 mb-1 leading-tight">
                Small choices. <em className="not-italic text-[#73917d]">Big becoming.</em>
              </h1>
              <p className="text-[12px] text-[#7e8a82] m-0">
                {page === 'Overview' ? 'Connect today\'s choices to the future you\'re building.' :
                 page === 'Your route' ? 'Edit the stages, deadlines and assumptions to make this route yours.' :
                 page === 'Spending rules' ? 'Protect essentials. Set optional rates and allowances around your choices.' :
                 'Compare projected account balances across four strategies.'}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/onboarding')}
              className="shrink-0 hidden sm:flex"
            >
              Edit plan ↗
            </Button>
          </div>

          {/* notice */}
          <div className="flex items-start gap-2.5 mb-5 bg-[#eef3ed] border border-[#e1e9df] rounded-[9px] px-3 py-2.5 text-[10px] text-[#647268] leading-relaxed">
            <strong className="text-[#405c48] shrink-0">Illustrative scenario</strong>
            <span>All figures are editable examples — not facts about you.</span>
          </div>

          {page === 'Overview' && (
            <OverviewContent forecast={forecast} profile={profile} level={level} xp={xp} avatar={avatar} />
          )}
          {page === 'Your route' && (
            <div className="space-y-4">
              <CharacterPanel gender={avatar.gender} level={level} xp={xp} goalsCount={profile.goals.length} avatar={avatar} />
              {profile.careerStages.length > 0 && (
                <div className="rounded-[13px] border border-[#e5eae3] bg-white p-4 space-y-3">
                  <h3 className="text-[15px] font-bold text-[#25332c] tracking-tight">Career Route</h3>
                  <div className="space-y-3">
                    {profile.careerStages.map((s, i) => (
                      <div key={s.id} className="flex items-start gap-3">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#648a74] shrink-0" />
                        <div>
                          <p className="text-[12px] font-semibold text-[#25332c]">{s.label || `Stage ${i + 1}`}</p>
                          <p className="text-[9px] text-[#7e8a82]">
                            £{s.monthlyTakeHome.toLocaleString()}/mo · Month {s.startMonth}+
                          </p>
                          {s.qualificationsRequired && (
                            <p className="text-[9px] text-amber-600 italic mt-0.5">{s.qualificationsRequired}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {profile.careerStages.length === 0 && (
                <div className="rounded-[13px] border border-[#e5eae3] bg-white p-5 text-center">
                  <p className="text-[12px] text-[#7e8a82]">No career stages added yet.</p>
                  <p className="text-[10px] text-[#aab8b0] mt-1">Add a career stage in plan settings to see your route.</p>
                </div>
              )}
            </div>
          )}
          {page === 'Spending rules' && <SelfTaxPanel profile={profile} />}
          {page === 'Compare futures' && <ComparisonChart profile={profile} />}
        </main>
      </div>
    </div>
  );
}

function OverviewContent({ forecast, profile, level, xp, avatar }: {
  forecast: ForecastResult;
  profile: UserProfile;
  level: number;
  xp: number;
  avatar: AvatarOptions;
}) {
  return (
    <div className="space-y-4">
      {/* hero */}
      <div
        className="relative overflow-hidden rounded-[15px] p-6 text-white min-h-[225px] flex flex-col"
        style={{ background: 'linear-gradient(112deg,#253c32,#456d56 65%,#8eaa91)' }}
      >
        <div className="absolute right-[7%] -top-[42px] w-[220px] h-[220px] rounded-full pointer-events-none" style={{ background: '#ead8a6', opacity: 0.88 }} />
        <div className="absolute -right-[4%] -bottom-[100px] pointer-events-none" style={{ width: '58%', height: 210, borderRadius: '50% 50% 0 0', background: '#80a58b' }} />

        <div className="relative z-10 max-w-[360px]">
          <span className="inline-block rounded-[20px] px-2 py-1.5 text-[8px] font-black tracking-[0.8px] mb-4" style={{ background: 'rgba(255,255,255,0.2)' }}>YOUR FUTURE SELF ✦</span>
          <h2 className="text-[27px] font-black leading-[1.15] tracking-tight mb-2 max-w-[300px]">Your future,<br />your way</h2>
          <p className="text-[10px] leading-relaxed mb-4" style={{ color: '#dbe5dc', maxWidth: 315 }}>
            A plan shaped around your own goals, priorities and pace.
          </p>
        </div>
        <div className="absolute bottom-5 left-6 text-[9px] font-bold tracking-wide z-10" style={{ color: '#dce8de' }}>
          10 YEAR VIEW · £{profile.monthlyTakeHome.toLocaleString()} TAKE-HOME / MONTH
        </div>
      </div>

      {/* 2-col: meter + small panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        <DelusionMeter forecast={forecast} profile={profile} />
        <Suggestions profile={profile} forecast={forecast} />
      </div>

      {/* goals */}
      <div className="flex items-end justify-between mt-2 mb-1">
        <div>
          <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">THE NEXT CHAPTER</p>
          <h2 className="text-[20px] font-black tracking-tight text-[#25332c] mt-1">Your three goals</h2>
        </div>
      </div>
      <GoalPots forecast={forecast} profile={profile} />

      {/* lower: future scene + chart + character */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-4">
        <FutureScene goals={profile.goals} avatar={avatar} compact />
        <ComparisonChart profile={profile} />
        <CharacterPanel gender={avatar.gender} level={level} xp={xp} goalsCount={profile.goals.length} avatar={avatar} />
      </div>

      {/* open the math */}
      <OpenMath forecast={forecast} />

      {/* assumptions */}
      <div className="rounded-[13px] border border-amber-100 bg-amber-50 p-4">
        <p className="text-[9px] font-black tracking-[1.15px] text-amber-700 uppercase mb-2">KEY ASSUMPTIONS</p>
        <ul className="space-y-1">
          {[
            `${Math.round(profile.annualReturnRate * 100)}% annual return`,
            profile.autoSweep ? 'Auto-sweep on' : 'Manual transfers',
            `Emergency: ${profile.emergencyPriority}`,
          ].map(a => (
            <li key={a} className="text-[9px] text-amber-700/70 flex gap-1.5">
              <span className="text-amber-500 mt-0.5">·</span>{a}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[9px] text-[#aab8b0] leading-relaxed">
        Prototype only. Accounts, achievements and transfers are simulated; nothing connects to a bank or moves money.
      </p>
    </div>
  );
}
