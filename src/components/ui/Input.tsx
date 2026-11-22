import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  isAssumption?: boolean;
}

export function Input({ label, hint, prefix, suffix, isAssumption, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const isNumeric = props.type === 'number';
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="flex items-center gap-2 text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">
        {label}
        {isAssumption && (
          <span className="text-[8px] text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 bg-amber-50 tracking-normal lowercase font-semibold">assumption</span>
        )}
      </label>
      <div className="flex items-center rounded-[7px] border border-[#e5eae3] bg-white focus-within:border-[#648a74] transition-colors">
        {prefix && <span className="pl-3 text-[#7e8a82] text-sm select-none">{prefix}</span>}
        <input
          id={inputId}
          inputMode={isNumeric ? 'decimal' : undefined}
          className={`flex-1 bg-transparent px-3 py-[9px] text-[11px] text-[#25332c] placeholder-[#aab8b0] outline-none ${className}`}
          {...props}
        />
        {suffix && <span className="pr-3 text-[#7e8a82] text-sm select-none">{suffix}</span>}
      </div>
      {hint && <p className="text-[9px] text-[#7e8a82]">{hint}</p>}
    </div>
  );
}

interface SelectProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function Select({ label, hint, value, onChange, options }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rounded-[7px] border border-[#e5eae3] bg-white px-3 py-[9px] text-[11px] text-[#25332c] outline-none focus:border-[#648a74] transition-colors appearance-none cursor-pointer"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <p className="text-[9px] text-[#7e8a82]">{hint}</p>}
    </div>
  );
}
