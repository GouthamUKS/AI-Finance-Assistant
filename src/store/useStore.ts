import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, ForecastResult } from '../engine/types';
import { DEFAULT_PROFILE } from '../engine/defaults';
import { runForecast } from '../engine/calculator';

export type CharacterGender = 'male' | 'female' | 'other';

export interface AvatarOptions {
  gender: CharacterGender;
  skinTone: string;
  hairColor: string;
  hairStyle: number;  // 0-2 index
  outfitColor: string;
  glasses: boolean;
}

const DEFAULT_AVATAR: AvatarOptions = {
  gender: 'female',
  skinTone: '#FDDBB4',
  hairColor: '#1a1a1a',
  hairStyle: 0,
  outfitColor: '#1E40AF',
  glasses: false,
};

interface AppState {
  onboardingComplete: boolean;
  onboardingStep: number;
  profile: UserProfile;
  forecast: ForecastResult | null;
  name: string;
  occupation: string;
  avatar: AvatarOptions;
  avatarImageUrl: string | null;
  level: number;
  xp: number;

  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setName: (name: string) => void;
  setOccupation: (occ: string) => void;
  setAvatar: (a: Partial<AvatarOptions>) => void;
  setAvatarImageUrl: (url: string | null) => void;
  recomputeForecast: () => void;
  addXP: (amount: number) => void;
  resetOnboarding: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      onboardingStep: 0,
      profile: DEFAULT_PROFILE,
      forecast: null,
      name: '',
      occupation: '',
      avatar: DEFAULT_AVATAR,
      avatarImageUrl: null,
      level: 1,
      xp: 0,

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      completeOnboarding: () => {
        set({ onboardingComplete: true });
        get().recomputeForecast();
      },

      updateProfile: (partial) => {
        set(s => ({ profile: { ...s.profile, ...partial } }));
        get().recomputeForecast();
      },

      setName: (name) => set({ name }),
      setOccupation: (occupation) => set({ occupation }),
      setAvatar: (a) => set(s => ({ avatar: { ...s.avatar, ...a } })),
      setAvatarImageUrl: (url) => set({ avatarImageUrl: url }),

      recomputeForecast: () => {
        const forecast = runForecast(get().profile, 120);
        set({ forecast });
      },

      addXP: (amount) =>
        set(s => {
          const newXP = s.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          return { xp: newXP, level: newLevel };
        }),

      resetOnboarding: () =>
        set({
          onboardingComplete: false,
          onboardingStep: 0,
          profile: DEFAULT_PROFILE,
          forecast: null,
          name: '',
          occupation: '',
          avatar: DEFAULT_AVATAR,
          avatarImageUrl: null,
          level: 1,
          xp: 0,
        }),
    }),
    { name: 'future-self-v2' }
  )
);
