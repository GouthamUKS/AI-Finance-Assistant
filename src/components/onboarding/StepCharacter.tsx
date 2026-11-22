import { useState } from 'react';
import type { AvatarOptions, CharacterGender } from '../../store/useStore';
import { AvatarSVG } from '../ui/Avatar';
import { generateAvatarImage } from '../../services/generateAvatar';

interface Props {
  avatar: AvatarOptions;
  setAvatar: (a: Partial<AvatarOptions>) => void;
  avatarImageUrl: string | null;
  setAvatarImageUrl: (url: string | null) => void;
}

const SKIN_TONES = [
  { hex: '#FDDBB4', label: 'Light' },
  { hex: '#E8A878', label: 'Light tan' },
  { hex: '#C68642', label: 'Medium' },
  { hex: '#8D5524', label: 'Deep tan' },
  { hex: '#4A2912', label: 'Deep' },
];
const HAIR_COLORS = [
  { hex: '#1a1a1a', label: 'Black' },
  { hex: '#8B4513', label: 'Brown' },
  { hex: '#D4A017', label: 'Blonde' },
  { hex: '#E8793A', label: 'Auburn' },
  { hex: '#94a3b8', label: 'Silver' },
];
const OUTFIT_COLORS = [
  { hex: '#1E40AF', label: 'Navy' },
  { hex: '#059669', label: 'Green' },
  { hex: '#DC2626', label: 'Red' },
  { hex: '#7C3AED', label: 'Purple' },
  { hex: '#374151', label: 'Charcoal' },
  { hex: '#0891b2', label: 'Teal' },
];

const HAIR_STYLE_LABELS: Record<CharacterGender, string[]> = {
  female: ['Long', 'Bob', 'Bun'],
  male:   ['Short', 'Fade', 'Wavy'],
  other:  ['Medium', 'Short', 'Locs'],
};

const GENDER_OPTIONS: { value: CharacterGender; label: string }[] = [
  { value: 'female', label: 'She / Her'   },
  { value: 'male',   label: 'He / Him'    },
  { value: 'other',  label: 'They / Them' },
];

function Swatch({ color, active, onClick, label }: { color: string; active: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      style={{ background: color }}
      className={`w-10 h-10 rounded-full cursor-pointer transition-transform focus-visible:outline-2 focus-visible:outline-[#293d33] focus-visible:outline-offset-2 ${
        active ? 'ring-2 ring-[#293d33] ring-offset-2 ring-offset-white scale-110' : 'hover:scale-105'
      }`}
      aria-label={label ?? `Color ${color}`}
      aria-pressed={active}
    />
  );
}

export function StepCharacter({ avatar, setAvatar, avatarImageUrl, setAvatarImageUrl }: Props) {
  const styles = HAIR_STYLE_LABELS[avatar.gender];
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const generate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      const url = await generateAvatarImage(avatar);
      setAvatarImageUrl(url);
    } catch (e) {
      setGenError('Generation failed — try again');
    } finally {
      setGenerating(false);
    }
  };

  const clearGenerated = () => setAvatarImageUrl(null);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase">CHOOSE YOUR CHARACTER</p>
        <h2 className="text-[30px] font-black tracking-tight text-[#25332c] leading-tight">Create your character</h2>
        <p className="text-[12px] text-[#7e8a82]">This is you, working toward your goals.</p>
      </div>

      <div className="flex flex-col items-center gap-5">
        {/* preview */}
        <div className="w-44 h-56 rounded-[20px] bg-gradient-to-b from-[#edf3ed] to-[#d9e8d9] border border-[#e5eae3] flex items-end justify-center overflow-hidden shadow-sm relative">
          {avatarImageUrl ? (
            <>
              <img src={avatarImageUrl} alt="Generated avatar" className="w-full h-full object-cover object-top" />
              <button
                onClick={clearGenerated}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white text-[10px] font-bold flex items-center justify-center cursor-pointer hover:bg-black/60"
                aria-label="Remove generated image"
              >✕</button>
            </>
          ) : generating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-2 border-[#648a74] border-t-transparent rounded-full animate-spin" />
              <p className="text-[9px] font-bold text-[#648a74]">Generating…</p>
            </div>
          ) : (
            <AvatarSVG options={avatar} size={176} />
          )}
        </div>

        {/* Generate button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={generate}
            disabled={generating}
            className="px-5 py-2.5 rounded-[9px] text-[11px] font-bold border border-[#648a74] bg-[#293d33] text-white cursor-pointer hover:bg-[#1e2f27] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating…' : avatarImageUrl ? 'Regenerate' : 'Generate my character'}
          </button>
          {genError && <p className="text-[10px] text-red-500">{genError}</p>}
          {!avatarImageUrl && (
            <p className="text-[9px] text-[#aab8b0]">AI-generated 3D character based on your choices</p>
          )}
        </div>

        {/* gender */}
        <div className="flex gap-2">
          {GENDER_OPTIONS.map(g => (
            <button
              key={g.value}
              onClick={() => setAvatar({ gender: g.value, hairStyle: 0 })}
              className={`px-4 py-2 rounded-[9px] text-[11px] font-semibold border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#293d33] ${
                avatar.gender === g.value
                  ? 'border-[#648a74] bg-[#edf3ed] text-[#365844] font-bold'
                  : 'border-[#e5eae3] text-[#69766e] bg-white hover:bg-[#f6f8f4]'
              }`}
              aria-pressed={avatar.gender === g.value}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* customisation grid */}
        <div className="w-full max-w-sm space-y-5">
          <div>
            <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-2">Skin tone</p>
            <div className="flex gap-3 flex-wrap">
              {SKIN_TONES.map(t => (
                <Swatch key={t.hex} color={t.hex} label={t.label} active={avatar.skinTone === t.hex} onClick={() => setAvatar({ skinTone: t.hex })} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-2">Hair colour</p>
            <div className="flex gap-3 flex-wrap">
              {HAIR_COLORS.map(c => (
                <Swatch key={c.hex} color={c.hex} label={c.label} active={avatar.hairColor === c.hex} onClick={() => setAvatar({ hairColor: c.hex })} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-2">Hair style</p>
            <div className="flex gap-2">
              {styles.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setAvatar({ hairStyle: i })}
                  className={`flex-1 py-2.5 rounded-[9px] text-[11px] border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#293d33] ${
                    avatar.hairStyle === i
                      ? 'border-[#648a74] bg-[#edf3ed] text-[#365844] font-bold'
                      : 'border-[#e5eae3] text-[#69766e] bg-white hover:bg-[#f6f8f4]'
                  }`}
                  aria-pressed={avatar.hairStyle === i}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-2">Outfit</p>
            <div className="flex gap-3 flex-wrap">
              {OUTFIT_COLORS.map(c => (
                <Swatch key={c.hex} color={c.hex} label={c.label} active={avatar.outfitColor === c.hex} onClick={() => setAvatar({ outfitColor: c.hex })} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black tracking-[1.15px] text-[#819087] uppercase mb-2">Accessories</p>
            <button
              onClick={() => setAvatar({ glasses: !avatar.glasses })}
              className={`px-4 py-2 rounded-[9px] text-[11px] font-semibold border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#293d33] ${
                avatar.glasses
                  ? 'border-[#648a74] bg-[#edf3ed] text-[#365844] font-bold'
                  : 'border-[#e5eae3] text-[#69766e] bg-white hover:bg-[#f6f8f4]'
              }`}
              aria-pressed={avatar.glasses}
            >
              Glasses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
