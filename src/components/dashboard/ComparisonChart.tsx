import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { runComparisonScenarios } from '../../engine/calculator';
import type { UserProfile } from '../../engine/types';
import { useState } from 'react';

interface Props { profile: UserProfile }

const COLORS = ['#6f9e87', '#e2aa78', '#897bd0', '#c06060'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e5eae3] rounded-[9px] p-3 text-[9px] space-y-1 shadow-sm">
      <p className="text-[#7e8a82] mb-1 font-semibold">Month {label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }} className="font-medium">{p.name}</span>
          <span className="text-[#25332c] font-bold">£{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function ComparisonChart({ profile }: Props) {
  const [returnRate, setReturnRate] = useState(profile.annualReturnRate);
  const scenarios = runComparisonScenarios({ ...profile, annualReturnRate: returnRate }, 120);

  const data = scenarios[0].months
    .filter((_, i) => i % 3 === 0)
    .map(({ month }) => {
      const row: Record<string, number> = { month };
      for (const s of scenarios) {
        const snap = s.months.find(x => x.month === month);
        if (snap) row[s.label] = snap.totalWealth;
      }
      return row;
    });

  return (
    <div className="rounded-[13px] border border-[#e5eae3] bg-white p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">PROJECTED TRACKED ASSETS</p>
          <h3 className="text-[15px] font-black tracking-tight text-[#25332c] mt-1">Your goals, one path</h3>
          <p className="text-[9px] text-[#7e8a82] mt-0.5">Same starting balances and income across all 4 strategies</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[9px] text-[#7e8a82] font-semibold">Return</label>
          <input
            type="number"
            inputMode="decimal"
            className="w-14 border border-[#e5eae3] rounded-[6px] px-2 py-1 text-[11px] text-[#25332c] outline-none focus:border-[#648a74] bg-white"
            value={Math.round(returnRate * 100)}
            onChange={e => setReturnRate(+e.target.value / 100)}
          />
          <span className="text-[9px] text-[#7e8a82]">% /yr</span>
        </div>
      </div>

      <div className="h-[170px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ede7" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#7e8a82', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `M${v}`}
            />
            <YAxis
              tick={{ fill: '#7e8a82', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 8, color: '#77837b' }}
              iconType="circle"
              iconSize={8}
            />
            {scenarios.map((s, i) => (
              <Line
                key={s.label}
                type="monotone"
                dataKey={s.label}
                stroke={COLORS[i]}
                strokeWidth={s.label === 'Your Plan' ? 3 : 2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3 flex-wrap">
        {scenarios.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1 text-[8px] text-[#77837b]">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
            {s.label}
          </span>
        ))}
      </div>

      <p className="text-[8px] text-[#aab8b0] leading-relaxed">
        Excludes inflation, fees, taxes. Investment returns are illustrative — not guaranteed.
      </p>
    </div>
  );
}
