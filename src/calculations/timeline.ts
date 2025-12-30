import type { ScenarioInputs, TimelinePoint } from '../features/scenario/ScenarioInputs';
import { calculateAmortizationSchedule, getMortgageBalance, getMortgageInterest, getMortgagePrincipal } from './amortization';
import { getRentAtMonth } from './rent';
import { calculateHomeValue } from './homeValue';
import { calculateOwnerNetWorth } from './netWorth';

/**
 * Build complete timeline with all monthly data points
 */
export function buildTimeline(inputs: ScenarioInputs): TimelinePoint[] {
  const totalMonths = inputs.horizonYears * 12;
  const downPaymentAmount = inputs.homePrice * (inputs.downPaymentPercent / 100);
  const loanPrincipal = inputs.homePrice - downPaymentAmount;
  const termMonths = inputs.loanTermYears * 12;
  
  // Calculate amortization schedule
  const schedule = calculateAmortizationSchedule(
    loanPrincipal,
    inputs.interestRate / 100,
    termMonths
  );
  
  const timeline: TimelinePoint[] = [];
  
  let ownerTotalUnrecoverable = 0;
  let renterTotalUnrecoverable = 0;
  let ownerTotalPrincipalPaid = 0;
  let renterInvestmentBalance = downPaymentAmount; // Start with down payment invested
  
  for (let month = 1; month <= totalMonths; month++) {
    const year = Math.ceil(month / 12);
    
    // Mortgage calculations
    const mortgageBalance = getMortgageBalance(month, schedule);
    const mortgageInterest = getMortgageInterest(month, schedule);
    const mortgagePrincipal = getMortgagePrincipal(month, schedule);
    const mortgagePayment = mortgageInterest + mortgagePrincipal;
    
    // Home value
    const homeValue = calculateHomeValue(
      inputs.homePrice,
      inputs.annualAppreciationRate / 100,
      month
    );
    
    // Owner unrecoverable costs
    const propertyTax = (homeValue * (inputs.propertyTaxRate / 100)) / 12;
    const maintenance = (homeValue * (inputs.maintenanceRate / 100)) / 12;
    const insurance = inputs.insuranceMonthly;
    
    // PMI calculation (only if down < 20% and enabled)
    let pmi = 0;
    if (inputs.pmiEnabled && inputs.downPaymentPercent < 20) {
      if (month <= termMonths && mortgageBalance > loanPrincipal * 0.8) {
        // PMI typically drops when LTV reaches 80%
        pmi = (loanPrincipal * (inputs.pmiRate / 100)) / 12;
      }
    }
    
    const ownerUnrecoverableMonthly =
      mortgageInterest + propertyTax + insurance + maintenance + pmi;
    
    ownerTotalUnrecoverable += ownerUnrecoverableMonthly;
    ownerTotalPrincipalPaid += mortgagePrincipal;
    
    // Rent
    const rentMonthly = getRentAtMonth(
      inputs.currentRent,
      inputs.rentGrowthRate / 100,
      month
    );
    
    renterTotalUnrecoverable += rentMonthly;
    
    // Renter investment contribution
    // Monthly contribution = max(0, ownerTotalOutflow - rent)
    const ownerTotalOutflow = mortgagePayment + propertyTax + insurance + maintenance + pmi;
    const renterMonthlyContribution = Math.max(0, ownerTotalOutflow - rentMonthly);
    
    // Update renter investment balance with monthly compounding
    const monthlyReturnRate = Math.pow(1 + inputs.annualReturnRate / 100, 1 / 12) - 1;
    renterInvestmentBalance = renterInvestmentBalance * (1 + monthlyReturnRate) + renterMonthlyContribution;
    
    // Net worth calculations
    const ownerNetWorth = calculateOwnerNetWorth(
      homeValue,
      inputs.sellingCostRate / 100,
      mortgageBalance
    );
    
    const renterNetWorth = renterInvestmentBalance;
    
    timeline.push({
      month,
      year,
      ownerUnrecoverableMonthly,
      mortgageInterest,
      propertyTax,
      insurance,
      maintenance,
      pmi,
      mortgagePayment,
      mortgagePrincipal,
      mortgageBalance,
      rentMonthly,
      homeValue,
      ownerNetWorth,
      renterNetWorth,
      renterInvestmentBalance,
      renterMonthlyContribution,
      ownerTotalUnrecoverable,
      renterTotalUnrecoverable,
      ownerTotalPrincipalPaid,
    });
  }
  
  return timeline;
}

