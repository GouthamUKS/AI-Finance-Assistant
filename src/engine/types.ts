export type SpendingCategory =
  | 'bills'
  | 'charity'
  | 'eating_out'
  | 'entertainment'
  | 'expenses'
  | 'family'
  | 'finances'
  | 'general'
  | 'gifts'
  | 'groceries'
  | 'holidays'
  | 'personal_care'
  | 'savings'
  | 'shopping'
  | 'transfers'
  | 'transport';

export interface CategoryConfig {
  category: SpendingCategory;
  label: string;
  taxRate: number;         // 0 = zero-rated, negative = rebate
  monthlyAllowance: number; // tax-free allowance
  isEssential: boolean;
}

export interface CareerStage {
  id: string;
  label: string;
  monthlyTakeHome: number;
  trainingCost: number;
  startMonth: number;      // earliest month this stage can begin (0-indexed from today)
  delayAfterFunding: number; // months delay after training is paid
  qualificationsRequired: string;
  shareToGoals: number;    // 0-1 fraction of additional income sent to goals
}

export interface Goal {
  id: string;
  type: 'financial' | 'career' | 'personal';
  label: string;
  targetAmount: number;
  deadlineMonths: number;  // months from now
  priority: number;        // 1-3 (1=highest)
  description: string;
  ongoingCost: number;     // monthly cost once reached
}

export interface UserProfile {
  // current situation
  monthlyTakeHome: number;
  monthlyEssentials: number;
  monthlyDiscretionary: Record<SpendingCategory, number>;
  monthlyBudget: number;
  currentSavings: number;
  currentInvestments: number;
  emergencySavings: number;
  currentDebt: number;
  existingMonthlySaving: number;

  // goals
  goals: Goal[];

  // what they'll change
  selfTaxRates: Record<SpendingCategory, number>;
  categoryAllowances: Record<SpendingCategory, number>;
  autoSweep: boolean;
  emergencyTarget: number;
  emergencyPriority: 'first' | 'alongside' | 'starter';
  emergencyStarterAmount: number;
  emergencySplitFraction: number;   // 0-1 when 'starter' mode
  futureIncomeToGoals: number;      // 0-1

  // student / job-switch intent (captured during onboarding)
  expectedGradSalary: number;
  expectedGradMonths: number;
  planningJobSwitch: boolean;
  jobSwitchSalary: number;
  jobSwitchMonths: number;

  // career
  careerStages: CareerStage[];

  // investment
  annualReturnRate: number;         // e.g. 0.07 for 7%
}

export interface MonthSnapshot {
  month: number;
  income: number;
  essentialSpend: number;
  discretionarySpend: number;
  selfTaxCollected: number;
  charityRebate: number;
  netSweep: number;             // unspent money swept at month end
  trainingExpense: number;
  emergencyContribution: number;
  potContributions: Record<string, number>;
  investmentGrowth: number;
  emergencyBalance: number;
  potBalances: Record<string, number>;
  investmentBalance: number;
  unallocatedCash: number;
  cashDeficit: number;          // unpaid deficit carried forward
  careerStageId: string;

  // reconciliation
  openingTrackedAssets: number;
  closingTrackedAssets: number;
}

export interface ForecastResult {
  months: MonthSnapshot[];
  goalFundingAtDeadline: Record<string, number>;
  firstTargetHit: Record<string, number | null>;  // month number or null
  shortfallPercentage: Record<string, number>;
  overallDelusionScore: number;
}

export interface ComparisonScenario {
  label: string;
  months: { month: number; totalWealth: number }[];
}
