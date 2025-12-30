/**
 * Calculate rent path over time with annual step growth
 * Rent grows once per year (at the start of each year)
 */
export function calculateRentPath(
  initialRent: number,
  growthRate: number,
  months: number
): number[] {
  const rentPath: number[] = [];
  
  for (let month = 1; month <= months; month++) {
    const year = Math.floor((month - 1) / 12);
    const rent = initialRent * Math.pow(1 + growthRate, year);
    rentPath.push(rent);
  }
  
  return rentPath;
}

/**
 * Get rent amount at a specific month
 */
export function getRentAtMonth(
  initialRent: number,
  growthRate: number,
  month: number
): number {
  if (month <= 0) {
    return initialRent;
  }
  const year = Math.floor((month - 1) / 12);
  return initialRent * Math.pow(1 + growthRate, year);
}

