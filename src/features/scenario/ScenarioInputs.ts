export interface ScenarioInputs {
  // Home details
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number; // Annual percentage rate
  loanTermYears: number;

  // Owner costs
  propertyTaxRate: number; // Annual percentage of home value
  insuranceMonthly: number;
  maintenanceRate: number; // Annual percentage of home value
  sellingCostRate: number; // Percentage (e.g., 8% = 0.08)
  closingCostRate: number; // Percentage

  // Rent details
  currentRent: number;
  rentGrowthRate: number; // Annual percentage

  // Investment assumptions
  annualReturnRate: number; // Annual percentage for investments

  // Appreciation
  annualAppreciationRate: number; // Annual percentage

  // Time horizon
  horizonYears: number; // 1-30 years

  // PMI (Private Mortgage Insurance)
  pmiEnabled: boolean;
  pmiRate: number; // Annual percentage (only if down < 20%)
}

export interface TimelinePoint {
  month: number;
  year: number;
  
  // Owner costs
  ownerUnrecoverableMonthly: number;
  mortgageInterest: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  pmi: number;
  mortgagePayment: number;
  mortgagePrincipal: number;
  mortgageBalance: number;
  
  // Rent
  rentMonthly: number;
  
  // Home value
  homeValue: number;
  
  // Net worth
  ownerNetWorth: number;
  renterNetWorth: number;
  
  // Investment tracking
  renterInvestmentBalance: number;
  renterMonthlyContribution: number;
  
  // Cumulative totals
  ownerTotalUnrecoverable: number;
  renterTotalUnrecoverable: number;
  ownerTotalPrincipalPaid: number;
}

export interface Metrics {
  cashLossBreakEvenYear: number | null; // Year when avg owner unrecoverable <= avg rent
  netWorthBreakEvenYear: number | null; // Year when owner net worth >= renter net worth
  netWorthDelta5: number; // Owner - Renter at 5 years
  netWorthDelta10: number; // Owner - Renter at 10 years
  netWorthDelta15: number; // Owner - Renter at 15 years
  totalUnrecoverableOwner5: number;
  totalUnrecoverableRenter5: number;
  totalUnrecoverableOwner10: number;
  totalUnrecoverableRenter10: number;
  totalUnrecoverableOwner15: number;
  totalUnrecoverableRenter15: number;
}

export interface AmortizationScheduleEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

