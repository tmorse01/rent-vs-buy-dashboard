import type { ScenarioInputs, TimelinePoint } from '../features/scenario/ScenarioInputs';
import { calculateAmortizationSchedule } from './amortization';
import { getRentAtMonth } from './rent';
import { calculateHomeValue } from './homeValue';
import { calculateOwnerNetWorth } from './netWorth';

/** MACRS/GDS-style residential rental period used for a straight-line depreciation approximation. */
export const RESIDENTIAL_RENTAL_MACRS_YEARS = 27.5;

/** Tax savings when itemizing deductible mortgage interest at the combined marginal rate. */
export function monthlyMortgageInterestTaxBenefit(
  inputs: ScenarioInputs,
  mortgageInterest: number,
): number {
  if (!inputs.mortgageInterestTaxDeductionEnabled || mortgageInterest <= 0) {
    return 0;
  }
  const rate = Math.min(50, Math.max(0, inputs.marginalTaxRate)) / 100;
  return mortgageInterest * rate;
}

/**
 * Monthly cash-flow value of modeled rental depreciation: annual deduction /
 * RESIDENTIAL_RENTAL_MACRS_YEARS × marginal rate ÷ 12. Uses purchase-price
 * building allocation (excluding land); does not vary with appreciation.
 */
export function monthlyRentalDepreciationTaxBenefit(
  inputs: ScenarioInputs,
): number {
  if (
    !inputs.houseHackEnabled ||
    !inputs.rentalDepreciationTaxBenefitEnabled
  ) {
    return 0;
  }
  const rsf = inputs.rentalSquareFootage;
  const tsf = inputs.totalSquareFootage;
  if (!(rsf > 0 && tsf > 0 && rsf <= tsf)) {
    return 0;
  }
  const landPct = Math.min(
    50,
    Math.max(0, inputs.landValuePercentOfPurchase),
  );
  const depreciableBuilding = inputs.homePrice * (1 - landPct / 100);
  const annualDepreciationDeduction =
    (depreciableBuilding * (rsf / tsf)) / RESIDENTIAL_RENTAL_MACRS_YEARS;
  const rate = Math.min(50, Math.max(0, inputs.marginalTaxRate)) / 100;
  return (annualDepreciationDeduction * rate) / 12;
}

export function houseHackRentalIncomeAtMonth(
  inputs: ScenarioInputs,
  month: number,
): number {
  if (!inputs.houseHackEnabled) {
    return 0;
  }
  return getRentAtMonth(
    inputs.houseHackMonthlyRent,
    inputs.houseHackRentGrowthAnnualPercent / 100,
    month,
  );
}

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
      
      const houseHackRentalIncomeMonthly =
        houseHackRentalIncomeAtMonth(inputs, month);
      const rentalDepreciationTaxBenefitMonthly =
        monthlyRentalDepreciationTaxBenefit(inputs);

      const mortgageInterestTaxBenefitMonthly =
        monthlyMortgageInterestTaxBenefit(inputs, mortgageInterest);

      const ownerUnrecoverableMonthly = Math.max(
        0,
        mortgageInterest +
          propertyTax +
          insurance +
          maintenance +
          pmi -
          mortgageInterestTaxBenefitMonthly -
          houseHackRentalIncomeMonthly -
          rentalDepreciationTaxBenefitMonthly,
      );

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
      const ownerTotalOutflow =
        mortgagePayment +
        propertyTax +
        insurance +
        maintenance +
        pmi -
        houseHackRentalIncomeMonthly;
      const renterMonthlyContribution = Math.max(
        0,
        ownerTotalOutflow -
          mortgageInterestTaxBenefitMonthly -
          rentalDepreciationTaxBenefitMonthly -
          rentMonthly,
      );
      
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
        mortgageInterestTaxBenefitMonthly,
        houseHackRentalIncomeMonthly,
        rentalDepreciationTaxBenefitMonthly,
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
    // PMI drops when LTV reaches 80% (mortgageBalance / homeValue <= 0.8)
    let pmi = 0;
    if (inputs.pmiEnabled && inputs.downPaymentPercent < 20) {
      const ltv = mortgageBalance / homeValue; // Loan-to-value ratio
      if (ltv > 0.8) {
        // PMI applies when LTV > 80% and drops when LTV reaches 80%
        pmi = (loanPrincipal * (inputs.pmiRate / 100)) / 12;
      }
    }

    const mortgageInterestTaxBenefitMonthly =
      monthlyMortgageInterestTaxBenefit(inputs, mortgageInterest);

    const houseHackRentalIncomeMonthly =
      houseHackRentalIncomeAtMonth(inputs, month);
    const rentalDepreciationTaxBenefitMonthly =
      monthlyRentalDepreciationTaxBenefit(inputs);

    const ownerUnrecoverableMonthly = Math.max(
      0,
      mortgageInterest +
        propertyTax +
        insurance +
        maintenance +
        pmi -
        mortgageInterestTaxBenefitMonthly -
        houseHackRentalIncomeMonthly -
        rentalDepreciationTaxBenefitMonthly,
    );

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
    // Monthly contribution = max(0, ownerTotalOutflow - tax benefit equivalent - rent)
    const ownerTotalOutflow =
      mortgagePayment +
      propertyTax +
      insurance +
      maintenance +
      pmi -
      houseHackRentalIncomeMonthly;
    const renterMonthlyContribution = Math.max(
      0,
      ownerTotalOutflow -
        mortgageInterestTaxBenefitMonthly -
        rentalDepreciationTaxBenefitMonthly -
        rentMonthly,
    );
    
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
      mortgageInterestTaxBenefitMonthly,
      houseHackRentalIncomeMonthly,
      rentalDepreciationTaxBenefitMonthly,
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

