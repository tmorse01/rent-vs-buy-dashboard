# Calculation Methodology

This document explains how all major metrics are calculated in the Rent vs. Buy Dashboard.

## Table of Contents

1. [Unrecoverable Costs](#unrecoverable-costs)
2. [Net Worth Calculations](#net-worth-calculations)
3. [Break-Even Calculations](#break-even-calculations)
4. [Home Value Appreciation](#home-value-appreciation)
5. [Mortgage Calculations](#mortgage-calculations)
6. [Investment Returns](#investment-returns)
7. [Rent Growth](#rent-growth)

---

## Unrecoverable Costs

Unrecoverable costs are expenses that don't build equity or wealth—money spent that you'll never get back. This is the core concept for comparing renting vs. buying.

### Owner Unrecoverable Costs

For homeowners, unrecoverable costs are calculated monthly as:

```
ownerUnrecoverableMonthly = mortgageInterest + propertyTax + insurance + maintenance + PMI
```

Where:

- **Mortgage Interest**: The interest portion of the monthly mortgage payment (from amortization schedule)
- **Property Tax**: `(homeValue * propertyTaxRate) / 12`
- **Insurance**: Fixed monthly homeowners insurance amount
- **Maintenance**: `(homeValue * maintenanceRate) / 12`
- **PMI**: Private Mortgage Insurance (only if down payment < 20% and PMI enabled)
  - PMI = `(loanPrincipal * pmiRate) / 12` (until LTV reaches 80%)

**Cumulative Total:**
```
totalUnrecoverableOwner = Σ(ownerUnrecoverableMonthly) for all months
```

### Renter Unrecoverable Costs

For renters, the only unrecoverable cost is rent:

```
renterUnrecoverableMonthly = rentMonthly
```

**Cumulative Total:**
```
totalUnrecoverableRenter = Σ(rentMonthly) for all months
```

### Key Insight

The principal portion of mortgage payments is **NOT** unrecoverable—it builds equity. Only the interest and other non-equity-building costs are considered unrecoverable.

---

## Net Worth Calculations

Net worth represents the total financial position of each scenario, accounting for assets, liabilities, and investments.

### Owner Net Worth

Owner net worth is calculated as:

```
ownerNetWorth = (homeValue * (1 - sellingCostRate)) - mortgageBalance
```

Where:

- **homeValue**: Current market value of the home (with appreciation)
- **sellingCostRate**: Percentage of home value lost to selling costs (typically 6-8%)
- **mortgageBalance**: Remaining principal balance on the mortgage

This formula accounts for:
- Home appreciation over time
- Selling costs that reduce net proceeds
- Remaining mortgage debt

**Example:**
- Home value: $600,000
- Selling cost rate: 8%
- Mortgage balance: $400,000
- Net worth = ($600,000 × 0.92) - $400,000 = $152,000

### Renter Net Worth

Renter net worth is the investment balance, calculated with monthly compounding:

```
renterNetWorth = renterInvestmentBalance
```

The investment balance grows through:
1. Initial deposit (down payment amount)
2. Monthly contributions (difference between owner's total outflow and rent)
3. Investment returns with monthly compounding

### Net Worth Delta

The difference between owner and renter net worth:

```
netWorthDelta = ownerNetWorth - renterNetWorth
```

Positive values indicate the owner is ahead financially.

---

## Break-Even Calculations

Break-even points identify when one option becomes financially superior to the other.

### Cash-Loss Break-Even

The year when the owner's average monthly unrecoverable costs become less than or equal to the renter's average monthly rent.

**Calculation:**
1. For each year, calculate average monthly unrecoverable costs:
   ```
   avgOwnerUnrecoverable = Σ(ownerUnrecoverableMonthly) / 12
   ```
2. For each year, calculate average monthly rent:
   ```
   avgRenterRent = Σ(rentMonthly) / 12
   ```
3. Find the first year where:
   ```
   avgOwnerUnrecoverable ≤ avgRenterRent
   ```

This indicates when owning becomes cheaper on a monthly cash-flow basis.

### Net-Worth Break-Even

The year when the owner's net worth exceeds the renter's net worth.

**Calculation:**
1. For each year (at month = year × 12), calculate:
   - `ownerNetWorth` (from home value and mortgage balance)
   - `renterNetWorth` (from investment balance)
2. Find the first year where:
   ```
   ownerNetWorth ≥ renterNetWorth
   ```

This accounts for equity building, appreciation, and investment returns.

---

## Home Value Appreciation

Home value grows over time using monthly compounding appreciation.

### Monthly Compounding Formula

```
homeValue = initialValue × (1 + monthlyRate)^month
```

Where:

- **initialValue**: Starting home price
- **monthlyRate**: Monthly appreciation rate
  ```
  monthlyRate = (1 + annualAppreciationRate)^(1/12) - 1
  ```
- **month**: Number of months since purchase

### Net Appreciation (After Selling Costs)

When calculating net appreciation for wealth comparisons:

```
grossAppreciation = homeValue - initialHomeValue
netAppreciation = (homeValue × (1 - sellingCostRate)) - (initialHomeValue × (1 - sellingCostRate))
```

This accounts for the fact that selling costs reduce the net proceeds from appreciation.

**Example:**
- Initial value: $500,000
- Current value: $650,000
- Selling cost rate: 8%
- Net appreciation = ($650,000 × 0.92) - ($500,000 × 0.92) = $138,000

---

## Mortgage Calculations

Mortgage payments are calculated using standard amortization formulas.

### Monthly Payment

The monthly mortgage payment is calculated using the amortization formula:

```
monthlyPayment = principal × (monthlyRate × (1 + monthlyRate)^termMonths) / ((1 + monthlyRate)^termMonths - 1)
```

Where:

- **principal**: Loan amount (home price - down payment)
- **monthlyRate**: `annualInterestRate / 12`
- **termMonths**: Loan term in months (e.g., 360 for 30 years)

If `monthlyRate = 0` (no interest):
```
monthlyPayment = principal / termMonths
```

### Amortization Schedule

For each month in the loan term:

1. **Interest Payment:**
   ```
   interest = balance × monthlyRate
   ```

2. **Principal Payment:**
   ```
   principalPayment = monthlyPayment - interest
   ```

3. **New Balance:**
   ```
   balance = balance - principalPayment
   ```

### Cumulative Principal Paid

The total principal paid up to a given month:

```
ownerTotalPrincipalPaid = Σ(principalPayment) for all months up to current month
```

This represents forced savings that build equity.

---

## Investment Returns

Renters invest their savings (down payment + monthly differences) and earn returns.

### Initial Investment

The renter starts with the down payment amount invested:

```
initialInvestment = homePrice × (downPaymentPercent / 100)
```

### Monthly Contribution

Each month, the renter invests the difference between what the owner pays and what they pay in rent:

```
ownerTotalOutflow = mortgagePayment + propertyTax + insurance + maintenance + PMI
renterMonthlyContribution = max(0, ownerTotalOutflow - rentMonthly)
```

If rent is higher than the owner's total outflow, no contribution is made (the renter is already paying more).

### Investment Balance with Monthly Compounding

The investment balance grows with monthly compounding:

```
monthlyRate = (1 + annualReturnRate)^(1/12) - 1

For each month:
  balance = balance × (1 + monthlyRate) + monthlyContribution
```

This is equivalent to the future value formula with monthly contributions:

```
FV = PV × (1 + r)^n + PMT × (((1 + r)^n - 1) / r)
```

Where:
- **PV**: Present value (initial investment)
- **PMT**: Monthly contribution
- **r**: Monthly return rate
- **n**: Number of months

### Total Net Gain (Renter)

The renter's total net gain is the investment balance minus the initial down payment:

```
renterTotalNetGain = renterInvestmentBalance - initialDownPayment
```

This represents the growth of invested savings.

---

## Rent Growth

Rent increases annually using step growth (not monthly compounding).

### Annual Step Growth

Rent grows once per year at the start of each year:

```
rentMonthly = initialRent × (1 + rentGrowthRate)^year
```

Where:

- **initialRent**: Starting monthly rent
- **rentGrowthRate**: Annual rent growth rate (as decimal, e.g., 0.03 for 3%)
- **year**: Current year (0-indexed, so year 1 = 0, year 2 = 1, etc.)

**Calculation for a specific month:**
```
year = floor((month - 1) / 12)
rentMonthly = initialRent × (1 + rentGrowthRate)^year
```

### Example

- Initial rent: $2,500/month
- Annual growth: 3%
- Month 1-12: $2,500/month
- Month 13-24: $2,575/month ($2,500 × 1.03)
- Month 25-36: $2,652.25/month ($2,500 × 1.03²)

---

## Implementation Notes

### Monthly vs. Annual Compounding

- **Home appreciation**: Uses monthly compounding for more accurate growth
- **Investment returns**: Uses monthly compounding to match monthly contributions
- **Rent growth**: Uses annual step growth (more realistic for rental markets)

### Timeline Calculation

All calculations are performed month-by-month to build a complete timeline:

1. For each month (1 to `horizonYears × 12`):
   - Calculate home value (with appreciation)
   - Calculate mortgage balance and payments (from amortization schedule)
   - Calculate owner unrecoverable costs
   - Calculate rent (with annual growth)
   - Calculate renter investment balance (with monthly compounding)
   - Calculate net worth for both scenarios
   - Accumulate totals

2. From the timeline, extract metrics:
   - Break-even years
   - Net worth deltas at milestones (5, 10, 15 years)
   - Cumulative unrecoverable costs

### Key Files

- **`src/calculations/timeline.ts`**: Main timeline builder
- **`src/calculations/amortization.ts`**: Mortgage calculations
- **`src/calculations/homeValue.ts`**: Home appreciation
- **`src/calculations/rent.ts`**: Rent growth
- **`src/calculations/netWorth.ts`**: Net worth calculations
- **`src/calculations/metrics.ts`**: Metric extraction from timeline

---

## Assumptions and Limitations

1. **Constant growth rates**: Assumes consistent appreciation, rent growth, and investment returns
2. **No tax benefits**: Does not account for mortgage interest deductions or capital gains
3. **No refinancing**: Assumes original mortgage terms throughout
4. **Perfect investment**: Assumes renter invests all savings consistently
5. **Selling costs**: Uses fixed percentage (typically 6-8%)
6. **PMI**: Drops automatically at 80% LTV (may not reflect all lender policies)

Actual results may vary based on market conditions, individual circumstances, and timing.

