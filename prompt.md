# Prompt

Build “Future Self”: a personalised financial planning app that turns spending choices, unspent money and career development into progress toward the user’s own goals.

Every user must have their own starting situation, career route, priorities, timelines, character and dream visual. Do not hard-code a particular lifestyle, profession or destination.

First deliver a working, responsive web prototype that we can review and refine.

1. SIGN-UP AND QUESTIONNAIRE

Immediately after sign-up, guide the user through:

Where are you now?
- Current employment, education or career stage.
- Monthly take-home income.
- Bills and essential expenses.
- Actual discretionary spending, broken down by category.
- Their monthly spending allowance/budget, recorded separately from actual spending.
- Current savings, investments, emergency savings and debts.
- Existing monthly saving habits.

Where do you want to go?
- One financial goal.
- One career or earning-capacity goal.
- One personal/life goal.
- Target amounts, deadlines and priorities.
- What achieving each goal actually means.
- Relevant ongoing costs, dependencies and constraints.

What are you willing to change?
- Spending habits they want to reduce.
- Categories they want to protect.
- Tax-free allowances they want to keep.
- Whether to automatically sweep all unspent money.
- Emergency-fund priority.
- How much future additional income they want to direct toward goals.
- Investment and financing preferences.

Distinguish confirmed information from editable assumptions. Never present example figures as facts about the user.

2. PERSONALISED ROUTE AND TIMELINE

Generate an individual route with short-, medium- and long-term milestones.

The route should connect:
Current situation → required actions → career development → earning capacity → saving/investment progress → goals.

Users must be able to edit their route. Do not assume everyone needs the same qualification, salary progression, allocation percentages or milestones.

Separate:
- Money needed to support a goal.
- Actions or qualifications required.
- Assumed future outcomes.
- Achievements actually completed.

Funding a course does not prove someone has qualified. Saving a deposit does not prove a purchase is affordable or approved.

3. THE “DELUSION METER”

Keep this exact product name.

Show whether the user’s current habits, available money, expected career progression and deadlines support their goals.

Display:
- Current-habit projection.
- Proposed-plan projection.
- Funding at each goal’s deadline.
- First projected target hit.
- Remaining shortfall.
- The assumptions responsible for the result.
- Changes that could close the gap.

Use a transparent funding-gap score:
For each goal:
shortfall percentage = max(0, 1 − funded amount at deadline / target).

Overall score = average shortfall percentage across the active goals × 100.

Explain that this is a planning measure, not a probability of success or a judgement of the person.

Do not manufacture a positive result or an alarming score. If a target takes decades, show that. If it is funded under the assumptions, show that too.

A target reached earlier might fall below target later, so distinguish “first target hit” from “money available at the deadline.”

4. SELF-TAX AND UNSPENT-MONEY SWEEP

The main accelerator is the money the user DOES NOT spend.

Self-tax is a voluntary transfer of the user’s existing money into their future plan. It is not income, government taxation or free money.

Example:
- £500 available after essentials.
- £200 spent on purchases.
- £40 self-tax transferred immediately.
- £260 remaining swept at month end.
- Total progress = £300.

Never count this as £340.

With a full sweep:
- Higher tax rates earmark money earlier.
- Allowances change the split between levy and sweep.
- Rates and allowances alone do not change total saving if actual spending is unchanged.
- Spending less creates more surplus.
- Do not automatically assume higher rates reduce spending; let the user enter or test that behavioural change.

Support a manual-transfer mode too, with an explicit contribution ceiling and visible unallocated cash.

5. SPENDING CATEGORIES AND RULES

Include these editable categories:

Bills
Charity
Eating out
Entertainment
Expenses
Family
Finances
General
Gifts
Groceries
Holidays
Income
Personal care
Savings
Shopping
Transfers
Transport

Rules:
- Bills and necessary expenses are zero-rated.
- Protect essential food, transport, care, family support and required repayments.
- Do not tax income or internal savings/transfers.
- Separate optional spending from essential spending where necessary.
- Suggest different rates based on the user’s habits and chosen priorities.
- Allow users to edit optional rates and monthly tax-free allowances.
- Tax only spending above the relevant allowance.
- Explain purchase price, self-tax and total immediate cash movement.

Support negative rates, such as a charity rebate of up to 5%.
- Fund rebates only from available positive levies.
- Never create an overdraft.
- If a rebate is returned as spendable money, exclude it from the automatic sweep so the reward is not immediately reversed.
- Show its effect on goal funding.

Never encourage unnecessary purchases to generate more self-tax.

6. EMERGENCY FUND AND THREE GOAL POTS

Keep the emergency fund separate from:
- Career progression.
- Financial saving/investment.
- Personal/life goals.

Allow configurable emergency targets and priorities:
- Emergency fund first.
- Build it alongside goals.
- A starter buffer followed by a configurable split.

Once the reserve target is reached, redirect its share toward the three pots.

Allocate goal money using proportions suited to the individual’s priorities and deadlines. Show how these proportions change over time.

When a goal is fully funded, redistribute future contributions transparently.

Never count the same money toward multiple goals or reserves.

7. CAREER DEVELOPMENT MUST AFFECT THE MAIN FORECAST

Connect career spending to potential earning capacity.

Support editable career stages with:
- Required development budget.
- Qualifications, skills or other conditions.
- Earliest possible transition date.
- Delay after funding or completing development.
- Expected total monthly take-home income at each stage.
- Share of additional income directed toward goals.

Use absolute salary levels, not stacked salaries.

Training-dependent increases must not begin before their conditions and delay are satisfied. Calendar-based income changes should apply consistently across comparison scenarios.

Show:
- No-pay-rise scenario.
- User’s expected progression scenario.
- Effect on actual contributions and goal dates.

Career outcomes are assumptions, not guaranteed returns. Do not compound skills using an arbitrary investment-return percentage.

Course costs become expenses when paid. Future wages are not assets.

Keep gross salary separate from take-home income.

8. COMPARISON GRAPH

Compare alternative uses of the same available cash:

- Index investing, including an illustrative S&P 500 scenario where appropriate.
- Career development followed by investing.
- Spending the money.
- The user’s personalised three-pot plan.

Use the same starting balances, emergency priority, shared income assumptions and investment-return assumption.

Clearly label what the graph measures. Do not compare cumulative salary against an investment account and call both “wealth.”

Show a no-pay-rise career counterfactual.

Make return assumptions editable, including 0% and negative-return scenarios. Never silently change returns when the user changes a deadline.

Disclose whether inflation, fees, taxes, currency effects and future living-cost changes are included.

9. ORIGINAL CHARACTERS AND GAMIFICATION

Create original male and female character options, both modestly dressed.

Let users personalise their character and visualise their own ambition through an editable dream scene or uploaded image.

Use:
- Levels.
- Meaningful quests.
- Skill milestones.
- Progress indicators.
- Visual development tied to completed actions.

Reward planning, learning and consistency—not spending, wealth or larger deposits.

Keep forecast progress separate from achievements observed in real life. Do not shame users for having less money.

10. ONE FINANCIAL ENGINE

Use one month-by-month calculation engine for every dashboard, graph, meter and timeline.

Include:
- Income and career-stage changes.
- Essential and discretionary spending.
- Self-tax, rebates and sweep.
- Emergency allocation.
- Pot contributions.
- Investment growth.
- Training expenses.
- Unallocated cash and deficits.

Positive surplus must clear earlier cash deficits before funding new goals. Do not assume free borrowing.

Use consistent timing and penny-accurate accounting.

Provide an “Open the math” view:

Opening tracked assets
+ income received
+ investment growth/loss
− actual spending
− training and other expenses paid
= closing tracked assets.

Closing assets must reconcile to the actual account/pot balances.

11. DELIVERY AND ACCEPTANCE

Deliver:
- A polished mobile-friendly interactive prototype.
- Clean source code.
- Separate calculation logic and presentation.
- Editable assumptions and documented formulas.
- Meaningful automated tests.

Test:
- The £500 / £200 example without double-counting.
- Zero income and spending above income.
- Deficit repayment before saving.
- Allowances above spending.
- Charity rebates exceeding available levies.
- Career funding and delayed salary changes.
- No pay rise.
- Emergency-fund completion and redistribution.
- Negative investment returns.
- Targets already reached.
- Identical values across dashboards and charts.
- Monthly accounting reconciliation.

Prototype accounts, achievements and money transfers must be clearly identified as simulated. Do not imply a live bank connection or actual movement of funds.


