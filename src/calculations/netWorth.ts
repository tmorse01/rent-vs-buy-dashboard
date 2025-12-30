/**
 * Calculate owner net worth at a specific point in time
 * Owner net worth = (homeValue * (1 - sellingCostRate)) - mortgageBalance
 */
export function calculateOwnerNetWorth(
  homeValue: number,
  sellingCostRate: number,
  mortgageBalance: number
): number {
  return homeValue * (1 - sellingCostRate) - mortgageBalance;
}

/**
 * Calculate renter investment balance with monthly compounding
 * Uses monthly compounding: monthlyRate = (1 + annualRate)^(1/12) - 1
 */
export function calculateRenterNetWorth(
  initialDeposit: number,
  monthlyContribution: number,
  annualReturnRate: number,
  month: number
): number {
  if (month <= 0) {
    return initialDeposit;
  }
  
  // Monthly compounding rate
  const monthlyRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1;
  
  // Calculate balance with monthly contributions
  // Formula: FV = PV * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)
  let balance = initialDeposit;
  
  for (let m = 1; m <= month; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }
  
  return balance;
}

/**
 * Calculate renter investment balance path over time
 */
export function calculateRenterNetWorthPath(
  initialDeposit: number,
  monthlyContribution: number,
  annualReturnRate: number,
  months: number
): number[] {
  const netWorthPath: number[] = [];
  
  for (let month = 1; month <= months; month++) {
    netWorthPath.push(
      calculateRenterNetWorth(initialDeposit, monthlyContribution, annualReturnRate, month)
    );
  }
  
  return netWorthPath;
}

