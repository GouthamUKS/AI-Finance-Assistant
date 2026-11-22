import { useState } from 'react';
import type { ForecastResult } from '../../engine/types';

interface Props { forecast: ForecastResult; month?: number }

function fmt(n: number) { return `£${Math.round(n).toLocaleString()}`; }

export function OpenMath({ forecast, month = 11 }: Props) {
  const [open, setOpen] = useState(false);
  const snap = forecast.months[Math.min(month, forecast.months.length - 1)];
  if (!snap) return null;

  const closing =
    snap.emergencyBalance +
    Object.values(snap.potBalances).reduce((a, b) => a + b, 0) +
    snap.investmentBalance +
    snap.unallocatedCash;

  const rows: { label: string; value: number; sign: '+' | '−' | '=' }[] = [
    { label: 'Opening tracked assets',   value: snap.openingTrackedAssets, sign: '=' },
    { label: '+ Income received',        value: snap.income,               sign: '+' },
    { label: '+ Investment growth/loss', value: snap.investmentGrowth,     sign: '+' },
    { label: '− Essential spending',     value: snap.essentialSpend,       sign: '−' },
    { label: '− Discretionary spending', value: snap.discretionarySpend,   sign: '−' },
    { label: '− Training & expenses',    value: snap.trainingExpense,       sign: '−' },
    { label: '= Closing tracked assets', value: closing,                   sign: '=' },
  ];

  return (
    <div className="rounded-[13px] border border-[#e5eae3] bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">SEE WHERE EVERY PENNY GOES</p>
          <h3 className="text-[15px] font-black tracking-tight text-[#25332c] mt-1">Open the math</h3>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-[10px] font-bold text-[#62846e] cursor-pointer hover:text-[#293d33] transition-colors border-0 bg-transparent"
          aria-expanded={open}
        >
          {open ? 'Close ↑' : 'Show monthly flow ↓'}
        </button>
      </div>

      {open && (
        <div className="mt-4 font-mono">
          <table className="w-full text-[9px] border-collapse">
            <tbody>
              {rows.map(r => (
                <tr key={r.label} className={`border-b border-[#f0f4ef] ${r.sign === '=' ? 'font-bold text-[#25332c]' : 'text-[#7e8a82]'}`}>
                  <td className="py-2 font-sans">{r.label}</td>
                  <td className="py-2 text-right">{r.sign === '−' ? '− ' : ''}{fmt(r.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[8px] text-[#aab8b0] mt-3 font-sans leading-relaxed not-italic">
            Closing assets: emergency ({fmt(snap.emergencyBalance)}) + pots ({fmt(Object.values(snap.potBalances).reduce((a, b) => a + b, 0))}) + investments ({fmt(snap.investmentBalance)}) + unallocated ({fmt(snap.unallocatedCash)})
          </p>
        </div>
      )}
    </div>
  );
}
