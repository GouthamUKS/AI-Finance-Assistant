interface Props {
  name: string;
  setName: (n: string) => void;
}

export function StepName({ name, setName }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center space-y-2">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">YOUR FUTURE, YOUR TERMS</p>
        <h2 className="text-[30px] font-black tracking-tight text-[#25332c] leading-tight">What's your name?</h2>
        <p className="text-[12px] text-[#7e8a82]">We'll use this to personalise your plan.</p>
      </div>
      <div className="w-full max-w-sm space-y-1">
        <label htmlFor="onboarding-name" className="sr-only">Your first name</label>
        <input
          id="onboarding-name"
          type="text"
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your first name"
          className="w-full text-center text-2xl font-black bg-transparent border-b-2 border-[#648a74]/60 focus:border-[#293d33] outline-none text-[#25332c] placeholder-[#c8d4c5] pb-2 transition-colors tracking-tight"
          onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
        />
      </div>
      {name && (
        <p className="text-[12px] text-[#7e8a82]">
          Nice to meet you, <span className="text-[#25332c] font-bold">{name}</span>.
        </p>
      )}
    </div>
  );
}
