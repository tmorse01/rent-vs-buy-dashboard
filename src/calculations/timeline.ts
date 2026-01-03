import type { ScenarioInputs, TimelinePoint } from '../features/scenario/ScenarioInputs';
import { calculateAmortizationSchedule } from './amortization';
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
  const monthlyRate = (inputs.interestRate / 100) / 12;
  
  // Calculate base amortization schedule (without extra payments)
  const baseSchedule = calculateAmortizationSchedule(
    loanPrincipal,
    inputs.interestRate / 100,
    termMonths
  );
  
  const timeline: TimelinePoint[] = [];
  
  let ownerTotalUnrecoverable = 0;
  let renterTotalUnrecoverable = 0;
  let ownerTotalPrincipalPaid = 0;
  let renterInvestmentBalance = downPaymentAmount; // Start with down payment invested
  
  // Track current mortgage balance dynamically (accounting for extra payments)
  let currentMortgageBalance = loanPrincipal;
  const baseMonthlyPayment = baseSchedule[0]?.payment || 0;
  
  for (let month = 1; month <= totalMonths; month++) {
    const year = Math.ceil(month / 12);
    
    // Check if loan is already paid off
    if (currentMortgageBalance <= 0) {
      // Loan is paid off, no more mortgage payments
      const mortgageBalance = 0;
      const mortgageInterest = 0;
      const mortgagePrincipal = 0;
      const mortgagePayment = 0;
      
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
      const pmi = 0; // No PMI if loan is paid off
      
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
      
      continue; // Skip to next month
    }
    
    // Calculate mortgage payment for this month
    // Interest is calculated on current balance (which may be lower due to extra payments)
    const mortgageInterest = currentMortgageBalance * monthlyRate;
    
    // Base principal payment: base payment minus interest
    // Since interest is lower when balance is lower, principal portion increases naturally
    const basePrincipal = Math.min(
      baseMonthlyPayment - mortgageInterest,
      currentMortgageBalance // Can't pay more than remaining balance
    );
    
    // Add extra principal payment (if specified)
    const extraPrincipal = Math.min(
      inputs.extraPrincipalPayment || 0,
      Math.max(0, currentMortgageBalance - basePrincipal) // Don't exceed remaining balance after base payment
    );
    
    const mortgagePrincipal = basePrincipal + extraPrincipal;
    // Total payment = base payment + extra principal
    const mortgagePayment = baseMonthlyPayment + extraPrincipal;
    
    // Update balance for next month
    currentMortgageBalance = Math.max(0, currentMortgageBalance - mortgagePrincipal);
    const mortgageBalance = currentMortgageBalance;
    
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
    // PMI drops when LTV reaches 80% (balance <= loanPrincipal * 0.8)
    let pmi = 0;
    if (inputs.pmiEnabled && inputs.downPaymentPercent < 20) {
      if (mortgageBalance > loanPrincipal * 0.8) {
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

