import type { UserProfile, ForecastResult } from './types';
import { runForecast } from './calculator';
import { CATEGORY_CONFIGS } from './defaults';

export interface Suggestion {
  id: string;
  title: string;
  detail: string;
  impact: 'high' | 'medium' | 'low';
  type: 'spending' | 'saving' | 'career' | 'emergency';
}

export function generateSuggestions(profile: UserProfile, forecast: ForecastResult): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // 1. Auto sweep not enabled
  if (!profile.autoSweep) {
    const withSweep = runForecast({ ...profile, autoSweep: true }, 120);
    if (withSweep.overallDelusionScore < forecast.overallDelusionScore) {
      const diff = forecast.overallDelusionScore - withSweep.overallDelusionScore;
      suggestions.push({
        id: 'sweep',
        title: 'Enable auto-sweep',
        detail: `Automatically redirecting unspent money each month reduces your gap score by ${diff} points.`,
        impact: diff >= 15 ? 'high' : diff >= 5 ? 'medium' : 'low',
        type: 'saving',
      });
    }
  }

  // 2. Test reducing each discretionary category by 20%
  const taxableCats = CATEGORY_CONFIGS.filter(c => !c.isEssential);
  for (const c of taxableCats) {
    const spent = profile.monthlyDiscretionary[c.category] ?? 0;
    if (spent < 20) continue;
    const reduced = Math.round(spent * 0.8);
    const newDiscretionary = { ...profile.monthlyDiscretionary, [c.category]: reduced };
    const test = runForecast({ ...profile, monthlyDiscretionary: newDiscretionary }, 120);
    const diff = forecast.overallDelusionScore - test.overallDelusionScore;
    if (diff >= 3) {
      suggestions.push({
        id: `cut-${c.category}`,
        title: `Spend less on ${c.label}`,
        detail: `Cutting ${c.label} from £${spent} to £${reduced}/month (-£${spent - reduced}) reduces your gap score by ${diff} points.`,
        impact: diff >= 15 ? 'high' : diff >= 7 ? 'medium' : 'low',
        type: 'spending',
      });
    }
  }

  // 3. No career stages — suggest adding one
  if (profile.careerStages.length === 0 && profile.goals.length > 0) {
    suggestions.push({
      id: 'career',
      title: 'Add a career stage',
      detail: 'No income growth is modelled. Adding a career stage — even a modest pay rise — can significantly close the gap on long-term goals.',
      impact: 'medium',
      type: 'career',
    });
  }

  // 4. Emergency priority consuming too much
  if (profile.emergencyPriority === 'first' && profile.goals.length > 0) {
    const withStarter = runForecast({ ...profile, emergencyPriority: 'starter', emergencyStarterAmount: 1000 }, 120);
    const diff = forecast.overallDelusionScore - withStarter.overallDelusionScore;
    if (diff >= 3) {
      suggestions.push({
        id: 'emergency',
        title: 'Switch to a starter emergency buffer',
        detail: `Building a £1,000 starter buffer first, then splitting, frees up capital sooner and reduces your gap score by ${diff} points.`,
        impact: diff >= 10 ? 'medium' : 'low',
        type: 'emergency',
      });
    }
  }

  // 5. Return rate at 0 or negative — remind them it's editable
  if (profile.annualReturnRate <= 0) {
    suggestions.push({
      id: 'returns',
      title: 'Investment return set to 0%',
      detail: 'You\'re using a 0% return scenario. Adjust in settings to model realistic growth (e.g. 4-7% for index funds). Keep 0% as a stress-test reference.',
      impact: 'medium',
      type: 'saving',
    });
  }

  // sort: high first
  const order = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => order[a.impact] - order[b.impact]);

  return suggestions.slice(0, 5);
}
