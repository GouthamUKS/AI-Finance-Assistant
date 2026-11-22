import type {
  UserProfile,
  MonthSnapshot,
  ForecastResult,
  CareerStage,
  SpendingCategory,
} from './types';

const ESSENTIAL_CATEGORIES: SpendingCategory[] = [
  'bills', 'groceries', 'transport', 'family', 'finances', 'transfers', 'savings',
];

// Self-tax on a single category purchase
export function computeSelfTax(
  amount: number,
  rate: number,
  monthlyAllowance: number,
  spentSoFarThisMonth: number
): number {
  const taxableStart = Math.max(0, monthlyAllowance - spentSoFarThisMonth);
  const taxableAmount = Math.max(0, amount - taxableStart);
  return Math.round(taxableAmount * rate * 100) / 100;
}

export function runForecast(profile: UserProfile, horizonMonths: number): ForecastResult {
  const months: MonthSnapshot[] = [];

  // balances
  let emergencyBalance = profile.emergencySavings;
  const potBalances: Record<string, number> = {};
  for (const g of profile.goals) potBalances[g.id] = 0;
  let investmentBalance = profile.currentInvestments;
  let cashDeficit = Math.max(0, profile.currentDebt);
  let unallocatedCash = profile.currentSavings;

  // career tracking
  let currentStageIndex = 0;
  const sortedStages = [...profile.careerStages].sort((a, b) => a.startMonth - b.startMonth);
  const trainingPaid: Record<string, boolean> = {};
  const trainingPaidMonth: Record<string, number> = {};

  const monthlyReturn = (1 + profile.annualReturnRate) ** (1 / 12) - 1;

  // track pot category allowances monthly
  const monthlyAllowanceUsed: Record<SpendingCategory, number> = {} as Record<SpendingCategory, number>;

  for (let m = 0; m < horizonMonths; m++) {
    // reset monthly allowance tracking
    for (const k of Object.keys(profile.monthlyDiscretionary)) {
      monthlyAllowanceUsed[k as SpendingCategory] = 0;
    }

    // determine current career stage
    let activeStage: CareerStage | null = null;
    for (let i = sortedStages.length - 1; i >= 0; i--) {
      const stage = sortedStages[i];
      const trainedMonth = trainingPaidMonth[stage.id];
      const unlockMonth = trainedMonth !== undefined
        ? trainedMonth + stage.delayAfterFunding
        : stage.startMonth;
      if (m >= unlockMonth) {
        activeStage = stage;
        currentStageIndex = i;
        break;
      }
    }
    const income = activeStage
      ? activeStage.monthlyTakeHome
      : (sortedStages.length > 0 ? sortedStages[0].monthlyTakeHome : profile.monthlyTakeHome);

    // training expense this month
    let trainingExpense = 0;
    if (activeStage === null && sortedStages.length > 0) {
      const nextStage = sortedStages[0];
      if (!trainingPaid[nextStage.id] && m >= nextStage.startMonth) {
        trainingExpense = nextStage.trainingCost;
        trainingPaid[nextStage.id] = true;
        trainingPaidMonth[nextStage.id] = m;
      }
    } else if (activeStage && currentStageIndex + 1 < sortedStages.length) {
      const nextStage = sortedStages[currentStageIndex + 1];
      if (!trainingPaid[nextStage.id] && m >= nextStage.startMonth) {
        trainingExpense = nextStage.trainingCost;
        trainingPaid[nextStage.id] = true;
        trainingPaidMonth[nextStage.id] = m;
      }
    }

    // self-tax computation across categories
    let selfTaxCollected = 0;
    let charityRebate = 0;
    for (const [cat, spent] of Object.entries(profile.monthlyDiscretionary)) {
      const c = cat as SpendingCategory;
      if (ESSENTIAL_CATEGORIES.includes(c)) continue;
      const rate = profile.selfTaxRates[c] ?? 0;
      const allowance = profile.categoryAllowances[c] ?? 0;
      const tax = computeSelfTax(spent, Math.abs(rate), allowance, 0);
      if (rate < 0) {
        charityRebate += tax;
      } else {
        selfTaxCollected += tax;
      }
    }
    // rebate capped by collected levy
    charityRebate = Math.min(charityRebate, selfTaxCollected);
    selfTaxCollected -= charityRebate;

    const essentialSpend = profile.monthlyEssentials;
    const discretionarySpend = Object.values(profile.monthlyDiscretionary).reduce((a, b) => a + b, 0);

    // available after essentials + discretionary
    const available = income - essentialSpend - discretionarySpend - trainingExpense;
    const sweep = profile.autoSweep ? Math.max(0, available - selfTaxCollected) : 0;
    const totalSurplus = selfTaxCollected + sweep;

    // investment growth
    const investmentGrowth = Math.round(investmentBalance * monthlyReturn * 100) / 100;
    investmentBalance += investmentGrowth;

    // clear deficit first
    let remaining = totalSurplus;
    if (cashDeficit > 0) {
      const deficitPayment = Math.min(remaining, cashDeficit);
      cashDeficit -= deficitPayment;
      remaining -= deficitPayment;
    }

    // emergency fund allocation
    let emergencyContribution = 0;
    const emergencyGap = Math.max(0, profile.emergencyTarget - emergencyBalance);
    if (emergencyGap > 0) {
      let emergencyFraction = 0;
      if (profile.emergencyPriority === 'first') {
        emergencyFraction = 1;
      } else if (profile.emergencyPriority === 'alongside') {
        emergencyFraction = 0.2;
      } else {
        // starter: full until starter amount, then split
        emergencyFraction = emergencyBalance < profile.emergencyStarterAmount ? 1 : profile.emergencySplitFraction;
      }
      emergencyContribution = Math.min(remaining * emergencyFraction, emergencyGap);
      emergencyBalance += emergencyContribution;
      remaining -= emergencyContribution;
    }

    // pot contributions
    const potContributions: Record<string, number> = {};
    const activeGoals = profile.goals.filter(g => potBalances[g.id] < g.targetAmount);
    if (activeGoals.length > 0 && remaining > 0) {
      const totalPriority = activeGoals.reduce((s, g) => s + (4 - g.priority), 0);
      for (const g of activeGoals) {
        const fraction = (4 - g.priority) / totalPriority;
        const contribution = Math.min(remaining * fraction, g.targetAmount - potBalances[g.id]);
        potContributions[g.id] = Math.round(contribution * 100) / 100;
        potBalances[g.id] = Math.round((potBalances[g.id] + contribution) * 100) / 100;
        remaining -= contribution;
      }
    }

    // remainder to unallocated
    unallocatedCash = Math.max(0, remaining);

    const openingTrackedAssets = emergencyBalance + Object.values(potBalances).reduce((a, b) => a + b, 0) + investmentBalance + unallocatedCash;
    const closingTrackedAssets = emergencyBalance + Object.values(potBalances).reduce((a, b) => a + b, 0) + investmentBalance + unallocatedCash;

    months.push({
      month: m,
      income,
      essentialSpend,
      discretionarySpend,
      selfTaxCollected,
      charityRebate,
      netSweep: sweep,
      trainingExpense,
      emergencyContribution,
      potContributions: { ...potContributions },
      investmentGrowth,
      emergencyBalance,
      potBalances: { ...potBalances },
      investmentBalance,
      unallocatedCash,
      cashDeficit,
      careerStageId: activeStage?.id ?? 'base',
      openingTrackedAssets,
      closingTrackedAssets,
    });
  }

  // compute goal metrics
  const goalFundingAtDeadline: Record<string, number> = {};
  const firstTargetHit: Record<string, number | null> = {};
  const shortfallPercentage: Record<string, number> = {};

  for (const g of profile.goals) {
    const deadlineSnap = months[Math.min(g.deadlineMonths - 1, months.length - 1)];
    const fundedAtDeadline = deadlineSnap?.potBalances[g.id] ?? 0;
    goalFundingAtDeadline[g.id] = fundedAtDeadline;
    shortfallPercentage[g.id] = Math.max(0, 1 - fundedAtDeadline / g.targetAmount);

    // first time pot hits target
    const hit = months.find(snap => snap.potBalances[g.id] >= g.targetAmount);
    firstTargetHit[g.id] = hit?.month ?? null;
  }

  const scores = Object.values(shortfallPercentage);
  const overallDelusionScore = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100)
    : 0;

  return { months, goalFundingAtDeadline, firstTargetHit, shortfallPercentage, overallDelusionScore };
}

// Comparison scenarios — same starting balances, four strategies
export function runComparisonScenarios(profile: UserProfile, horizonMonths: number) {
  const monthlyReturn = (1 + profile.annualReturnRate) ** (1 / 12) - 1;

  function indexInvestScenario() {
    let wealth = profile.currentSavings + profile.currentInvestments + profile.emergencySavings;
    const available = profile.monthlyTakeHome - profile.monthlyEssentials -
      Object.values(profile.monthlyDiscretionary).reduce((a, b) => a + b, 0);
    return Array.from({ length: horizonMonths }, (_, m) => {
      wealth = wealth * (1 + monthlyReturn) + Math.max(0, available);
      return { month: m, totalWealth: Math.round(wealth) };
    });
  }

  function spendScenario() {
    const wealth = profile.currentSavings + profile.currentInvestments + profile.emergencySavings;
    return Array.from({ length: horizonMonths }, (_, m) => ({
      month: m,
      totalWealth: Math.round(wealth * (1 + monthlyReturn) ** m),
    }));
  }

  function careerThenInvestScenario() {
    let wealth = profile.currentSavings + profile.currentInvestments + profile.emergencySavings;
    const sortedStages = [...profile.careerStages].sort((a, b) => a.startMonth - b.startMonth);
    return Array.from({ length: horizonMonths }, (_, m) => {
      let income = profile.monthlyTakeHome;
      for (let i = sortedStages.length - 1; i >= 0; i--) {
        if (m >= sortedStages[i].startMonth) { income = sortedStages[i].monthlyTakeHome; break; }
      }
      const available = income - profile.monthlyEssentials -
        Object.values(profile.monthlyDiscretionary).reduce((a, b) => a + b, 0);
      wealth = wealth * (1 + monthlyReturn) + Math.max(0, available);
      return { month: m, totalWealth: Math.round(wealth) };
    });
  }

  const planResult = runForecast(profile, horizonMonths);
  const planScenario = planResult.months.map(snap => ({
    month: snap.month,
    totalWealth: Math.round(
      snap.emergencyBalance +
      Object.values(snap.potBalances).reduce((a, b) => a + b, 0) +
      snap.investmentBalance +
      snap.unallocatedCash
    ),
  }));

  return [
    { label: 'Your Plan', months: planScenario },
    { label: 'Index Investing', months: indexInvestScenario() },
    { label: 'Career → Invest', months: careerThenInvestScenario() },
    { label: 'Spend It', months: spendScenario() },
  ];
}
