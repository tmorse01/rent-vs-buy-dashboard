import type { AmortizationScheduleEntry } from '../features/scenario/ScenarioInputs';

/**
 * Calculate monthly mortgage payment using standard amortization formula
 */
export function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  termMonths: number
): number {
  if (monthlyRate === 0) {
    return principal / termMonths;
  }
  return (
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
}

/**
 * Calculate full amortization schedule
 */
export function calculateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number
): AmortizationScheduleEntry[] {
  const monthlyRate = annualRate / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, termMonths);
  const schedule: AmortizationScheduleEntry[] = [];
  
  let balance = principal;
  
  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPayment);
    
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
    });
  }
  
  return schedule;
}

/**
 * Get mortgage balance at a specific month
 */
export function getMortgageBalance(
  month: number,
  schedule: AmortizationScheduleEntry[]
): number {
  if (month <= 0) {
    return schedule[0]?.balance ?? 0;
  }
  if (month > schedule.length) {
    return 0; // Loan paid off
  }
  return schedule[month - 1].balance;
}

/**
 * Get interest payment at a specific month
 */
export function getMortgageInterest(
  month: number,
  schedule: AmortizationScheduleEntry[]
): number {
  if (month <= 0 || month > schedule.length) {
    return 0;
  }
  return schedule[month - 1].interest;
}

/**
 * Get principal payment at a specific month
 */
export function getMortgagePrincipal(
  month: number,
  schedule: AmortizationScheduleEntry[]
): number {
  if (month <= 0 || month > schedule.length) {
    return 0;
  }
  return schedule[month - 1].principal;
}

