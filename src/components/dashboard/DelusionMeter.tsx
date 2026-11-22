import { ProgressBar } from '../ui/ProgressBar';
import type { ForecastResult, UserProfile } from '../../engine/types';

interface Props {
  forecast: ForecastResult;
  profile: UserProfile;
}

function scoreLabel(score: number): string {
  if (score === 0)  return 'Within reach';
  if (score <= 20)  return 'A few shifts could help';
  if (score <= 50)  return 'A plan in progress';
  if (score <= 80)  return 'Ambitious territory';
  return 'Significant gap';
}

function gaugeColor(score: number): string {
  if (score <= 20) return '#74a18a';
  if (score <= 50) return '#d4a04a';
  return '#c06060';
}

function barColor(shortfall: number): string {
  if (shortfall === 0) return 'bg-[#74a18a]';
  if (shortfall < 0.5) return 'bg-[#d4a04a]';
  return 'bg-[#c06060]';
}

function Gauge({ score }: { score: number }) {
  const fillDeg = Math.round((Math.min(score, 100) / 100) * 280);
  const color = gaugeColor(score);
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{
        width: 100, height: 100, borderRadius: '50%',
        background: `conic-gradient(${color} 0 ${fillDeg}deg, #eaf0e9 ${fillDeg}deg 280deg, transparent 280deg)`,
      }}
    >
      <div className="absolute rounded-full bg-white" style={{ inset: 9 }} />
      <div className="relative z-10 text-center">
        <strong className="block text-[26px] font-black leading-none text-[#25332c]">{score}</strong>
        <small className="text-[8px] text-[#7e8a82]">gap score</small>
      </div>
    </div>
  );
}

export function DelusionMeter({ forecast, profile }: Props) {
  const { overallDelusionScore, shortfallPercentage, goalFundingAtDeadline, firstTargetHit } = forecast;

  return (
    <div className="rounded-[13px] border border-[#e5eae3] bg-white p-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">YOUR REALITY CHECK</p>
          <h3 className="text-[15px] font-black tracking-tight text-[#25332c] mt-1 mb-0">Delusion Meter</h3>
        </div>
        <span className="inline-block rounded-[20px] bg-[#f0f4ef] text-[#688473] px-2 py-1 text-[8px] font-bold">Planning measure</span>
      </div>

      <div className="flex items-center gap-5 py-3">
        <Gauge score={overallDelusionScore} />
        <div>
          <p className="text-[12px] font-bold text-[#25332c]">{scoreLabel(overallDelusionScore)}</p>
          <p className="text-[9px] text-[#7e8a82] leading-relaxed mt-1 max-w-[200px]">
            Average shortfall across active goals at their deadlines.
          </p>
          <span className="inline-block mt-2 rounded-[20px] bg-[#f0f4ef] text-[#688473] px-2 py-1 text-[8px] font-bold">Not a probability or judgement</span>
        </div>
      </div>

      <p className="text-[8px] text-[#89948d] leading-relaxed border-t border-[#eef0ec] pt-2 mt-1">
        Score = average max(0, 1 − funded at deadline ÷ target) × 100. Assumes £{profile.monthlyTakeHome.toLocaleString()} take-home, £{profile.monthlyEssentials.toLocaleString()} essentials, {Math.round(profile.annualReturnRate * 100)}% return.
      </p>

      {profile.goals.length > 0 && (
        <div className="mt-3 space-y-0 divide-y divide-[#eef0ec]">
          {profile.goals.map(g => {
            const funded = goalFundingAtDeadline[g.id] ?? 0;
            const shortfall = shortfallPercentage[g.id] ?? 0;
            const hit = firstTargetHit[g.id];
            const fundedPct = Math.min(100, (funded / g.targetAmount) * 100);
            return (
              <div key={g.id} className="py-3 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[12px] font-semibold text-[#25332c]">{g.label || 'Unnamed goal'}</span>
                  <span className="text-[9px] text-[#7e8a82] tabular-nums">
                    £{funded.toLocaleString()} / £{g.targetAmount.toLocaleString()}
                  </span>
                </div>
                <ProgressBar value={fundedPct} color={barColor(shortfall)} />
                <div className="flex justify-between text-[8px] text-[#89948d]">
                  <span>{hit !== null ? `First hit month ${hit + 1}` : 'Target not reached in 10 yr'}</span>
                  <span>{shortfall === 0 ? 'funded ✓' : `${Math.round(shortfall * 100)}% short`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
