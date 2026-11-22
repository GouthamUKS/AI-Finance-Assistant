interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  height?: string;
}

export function ProgressBar({ value, color = 'bg-[#74a18a]', label, showValue = false, height = 'h-[5px]' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex flex-col gap-1">
      {(label || showValue) && (
        <div className="flex justify-between text-[9px] text-[#7e8a82]">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-[#edf1ec] rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
