import type { ScenarioInputs } from "./ScenarioInputs";

export const DEFAULT_SCENARIO_INPUTS: ScenarioInputs = {
  homePrice: 500000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTermYears: 30,
  propertyTaxRate: 1.2,
  insuranceMonthly: 150,
  maintenanceRate: 1,
  sellingCostRate: 8,
  closingCostRate: 3,
  currentRent: 2500,
  rentGrowthRate: 3,
  annualReturnRate: 6,
  annualAppreciationRate: 3,
  horizonYears: 15,
  pmiEnabled: true,
  pmiRate: 0.5,
  extraPrincipalPayment: 0,
  mortgageInterestTaxDeductionEnabled: false,
  marginalTaxRate: 24,
  houseHackEnabled: false,
  houseHackMonthlyRent: 1200,
  houseHackRentGrowthAnnualPercent: 3,
  rentalSquareFootage: 1300,
  totalSquareFootage: 3000,
  landValuePercentOfPurchase: 20,
  rentalDepreciationTaxBenefitEnabled: false,
};

export function mergeScenarioInputs(
  partial: Partial<ScenarioInputs>,
): ScenarioInputs {
  return { ...DEFAULT_SCENARIO_INPUTS, ...partial };
}
