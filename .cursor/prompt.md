## Goal

Build a React web dashboard that helps users compare **Rent vs Buy** over time, using both:

1. **Cash-loss view (unrecoverable costs)**
2. **Net worth view (balance-sheet)**

Users must be able to input real values for their scenario and see multiple graphs update live.

The app should also export a structured **analysis packet** (JSON) that a separate AI step can use for narrative recommendations. Do not integrate any AI API calls.

## Tech Constraints

- React + TypeScript + Vite
- Mantine component library (UI + forms + hooks)
- Charts:
  - Use **@mantine/charts** if available in the repo.
  - If a chart can’t be done well there, use Recharts directly (Mantine charts are Recharts under the hood).
- Keep calculations in pure functions (no React in calc files).

## High-Level Features (MVP)

### 1) Scenario Inputs (Single Page)

A form that captures:

- Home: price, down payment (% or $), rate, term
- Owner costs: property tax rate, insurance, maintenance (%/yr or $/mo), selling cost %, closing cost %
- Rent: current rent, rent growth %/yr
- Investments: annual return %
- Appreciation: annual appreciation % (for net worth)
- Horizon: 1–30 years

Required UX:

- Reasonable defaults (3% appreciation, 3% rent growth, 6% investment return, 1% maintenance, 8% selling cost)
- Inline validation and tooltips that explain assumptions
- “Save scenario” and “Load scenario” to/from localStorage

### 2) Graphs (Minimum 4)

Implement the following charts with readable legends and axis formatting:

1. **Avg Monthly Unrecoverable Cost vs Years**

   - Owner vs renter
   - Show 5/10/15 markers

2. **Monthly Cost Over Time**

   - Owner unrecoverable monthly vs rent monthly

3. **Net Worth Over Time**

   - Owner net worth vs renter net worth

4. **Owner Wealth Stack at 5/10/15**
   - A breakdown that shows _why_ buying stacks favorably:
     - Principal paid
     - Net appreciation (after selling costs)
     - Optional narrative overlay for “interest paid” (not part of net worth but good explanation)

### 3) Key Metrics Cards

Compute and display:

- Cash-loss break-even year (avg owner unrecoverable <= avg rent)
- Net-worth break-even year
- Net worth delta at 5/10/15 years
- Total unrecoverable costs paid by year N (owner vs renter)

### 4) Export

- Export scenario inputs JSON
- Export timeline CSV (monthly rows)
- Export “analysis packet” JSON:
  - inputs
  - computed metrics
  - 5/10/15 snapshots
  - notes field (user text)

## Calculation Rules (Keep It Simple + Transparent)

### Owner unrecoverable (monthly)

- Mortgage interest (from amortization schedule)
- Property tax monthly
- Insurance monthly
- Maintenance monthly
- PMI optional (only if down < 20% and enabled)

### Rent (monthly)

- Rent grows annually (step once per year) for MVP

### Net worth

Owner net worth at month t:

- (homeValue(t) \* (1 - sellingCostRate)) - mortgageBalance(t)

Renter net worth at month t:

- investmentBalance(t)
  Where investment balance grows by:
- initial deposit = down payment amount (toggle default ON: “invest down payment instead”)
- monthly contribution = max(0, ownerTotalOutflow - rent) OR a clear rule you choose, but document it in UI

### Appreciation and investment returns

- Use monthly compounding:
  - monthlyRate = (1 + annualRate)^(1/12) - 1

## Architecture Guidance

- Separate concerns:
  - `features/scenario` for form and persistence
  - `features/charts` for chart components
  - `calculations/` pure functions:
    - amortization
    - rent path
    - home value path
    - net worth series
    - metrics (break-evens, summaries)
- Create a single function:
  - `buildTimeline(inputs) => TimelinePoint[]`
- Create `computeMetrics(timeline, inputs) => Metrics`

## MVP Deliverables Checklist

- [ ] App renders with Mantine AppShell layout (nav + main)
- [ ] Scenario form works with defaults, validation, and localStorage save/load
- [ ] Timeline recalculates on change (debounced)
- [ ] 4 charts render and update live
- [ ] Metric cards show key values and update live
- [ ] Export buttons produce JSON + CSV
- [ ] Code is readable, typed, and organized

## After MVP (Plan Only — Do Not Build Yet)

Add stubs/routes for these future tools:

1. Sensitivity explorer (sliders for appreciation/rent growth/returns)
2. Refinance planner (rate change event at year X)
3. Scenario comparison (side-by-side multiple saved scenarios)

---

## Notes (Context From Our Discussion)

- “Unrecoverable loss” is defined narrowly: interest, maintenance, tax, insurance, etc.
- Net worth stacks for buying mainly due to:
  - leverage (appreciation on full asset)
  - principal paydown (forced savings)
  - inflation asymmetry (fixed payment vs rising rent)

Make sure the UI explains these plainly and matches the charts.

---

## Output Expectations

- Provide a runnable project with clear README for local dev
- Keep assumptions explicit and editable
- Avoid over-engineering; ship MVP first, then iterate
