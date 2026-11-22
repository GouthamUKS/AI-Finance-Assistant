import type { UserProfile, SpendingCategory, CategoryConfig } from './types';

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  { category: 'bills',        label: 'Bills',         taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'charity',      label: 'Charity',       taxRate: -0.05, monthlyAllowance: 50,  isEssential: false },
  { category: 'eating_out',   label: 'Eating Out',    taxRate: 0.1,   monthlyAllowance: 50,  isEssential: false },
  { category: 'entertainment',label: 'Entertainment', taxRate: 0.1,   monthlyAllowance: 30,  isEssential: false },
  { category: 'expenses',     label: 'Expenses',      taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'family',       label: 'Family',        taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'finances',     label: 'Finances',      taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'general',      label: 'General',       taxRate: 0.05,  monthlyAllowance: 20,  isEssential: false },
  { category: 'gifts',        label: 'Gifts',         taxRate: 0.05,  monthlyAllowance: 30,  isEssential: false },
  { category: 'groceries',    label: 'Groceries',     taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'holidays',     label: 'Holidays',      taxRate: 0.15,  monthlyAllowance: 50,  isEssential: false },
  { category: 'personal_care',label: 'Personal Care', taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'savings',      label: 'Savings',       taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'shopping',     label: 'Shopping',      taxRate: 0.1,   monthlyAllowance: 50,  isEssential: false },
  { category: 'transfers',    label: 'Transfers',     taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
  { category: 'transport',    label: 'Transport',     taxRate: 0,     monthlyAllowance: 0,   isEssential: true  },
];

function makeRecord<T>(value: T): Record<SpendingCategory, T> {
  const rec = {} as Record<SpendingCategory, T>;
  for (const c of CATEGORY_CONFIGS) rec[c.category] = value;
  return rec;
}

export const DEFAULT_PROFILE: UserProfile = {
  monthlyTakeHome: 2500,
  monthlyEssentials: 1200,
  monthlyDiscretionary: {
    bills: 0, charity: 20, eating_out: 150, entertainment: 80,
    expenses: 0, family: 0, finances: 0, general: 50, gifts: 30,
    groceries: 0, holidays: 100, personal_care: 0, savings: 0,
    shopping: 150, transfers: 0, transport: 0,
  },
  monthlyBudget: 500,
  currentSavings: 2000,
  currentInvestments: 0,
  emergencySavings: 500,
  currentDebt: 0,
  existingMonthlySaving: 0,
  goals: [],
  selfTaxRates: (() => {
    const rec = makeRecord(0);
    for (const c of CATEGORY_CONFIGS) rec[c.category] = c.taxRate;
    return rec;
  })(),
  categoryAllowances: (() => {
    const rec = makeRecord(0);
    for (const c of CATEGORY_CONFIGS) rec[c.category] = c.monthlyAllowance;
    return rec;
  })(),
  autoSweep: true,
  emergencyTarget: 3000,
  emergencyPriority: 'starter',
  emergencyStarterAmount: 1000,
  emergencySplitFraction: 0.2,
  futureIncomeToGoals: 0.5,
  expectedGradSalary: 0,
  expectedGradMonths: 24,
  planningJobSwitch: false,
  jobSwitchSalary: 0,
  jobSwitchMonths: 12,
  careerStages: [],
  annualReturnRate: 0.07,
};
