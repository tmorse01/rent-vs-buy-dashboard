/**
 * Calculate home value at a specific month using monthly compounding appreciation
 * monthlyRate = (1 + annualRate)^(1/12) - 1
 */
export function calculateHomeValue(
  initialValue: number,
  annualAppreciationRate: number,
  month: number
): number {
  if (month <= 0) {
    return initialValue;
  }
  
  // Monthly compounding rate
  const monthlyRate = Math.pow(1 + annualAppreciationRate, 1 / 12) - 1;
  
  return initialValue * Math.pow(1 + monthlyRate, month);
}

/**
 * Calculate home value path over time
 */
export function calculateHomeValuePath(
  initialValue: number,
  annualAppreciationRate: number,
  months: number
): number[] {
  const homeValuePath: number[] = [];
  
  for (let month = 1; month <= months; month++) {
    homeValuePath.push(calculateHomeValue(initialValue, annualAppreciationRate, month));
  }
  
  return homeValuePath;
}

