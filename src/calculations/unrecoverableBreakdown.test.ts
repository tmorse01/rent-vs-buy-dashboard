import { describe, it, expect } from "vitest";
import {
  buildHorizonUnrecoverableBarData,
  computeHorizonUnrecoverableStacks,
} from "./unrecoverableBreakdown";
import { buildTimeline } from "./timeline";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";
import { mergeScenarioInputs } from "../features/scenario/scenarioDefaults";

describe("unrecoverableBreakdown", () => {
  const createBaseInputs = (): ScenarioInputs =>
    mergeScenarioInputs({
      homePrice: 500000,
      downPaymentPercent: 20,
      interestRate: 6,
      loanTermYears: 30,
      propertyTaxRate: 1.2,
      insuranceMonthly: 150,
      maintenanceRate: 1,
      sellingCostRate: 8,
      closingCostRate: 3,
      currentRent: 2800,
      rentGrowthRate: 3,
      annualReturnRate: 6,
      annualAppreciationRate: 3,
      horizonYears: 5,
      pmiEnabled: false,
      pmiRate: 0.5,
      extraPrincipalPayment: 0,
      mortgageInterestTaxDeductionEnabled: false,
      marginalTaxRate: 24,
      houseHackEnabled: false,
      rentalDepreciationTaxBenefitEnabled: false,
    });

  it("sums components through full horizon", () => {
    const timeline = buildTimeline(createBaseInputs());
    const stacks = computeHorizonUnrecoverableStacks(timeline);

    expect(stacks).not.toBeNull();
    expect(stacks!.horizonYears).toBe(5);
    expect(stacks!.mortgageInterest).toBeGreaterThan(0);
    expect(stacks!.renterRent).toBeGreaterThan(0);
  });

  it("matches timeline cumulative totals at horizon", () => {
    const timeline = buildTimeline(createBaseInputs());
    const stacks = computeHorizonUnrecoverableStacks(timeline)!;
    const point = timeline[timeline.length - 1];

    expect(stacks.renterRent).toBe(Math.round(point.renterTotalUnrecoverable));
    expect(stacks.ownerTotal).toBe(Math.round(point.ownerTotalUnrecoverable));
  });

  it("builds buy and rent bar rows with non-overlapping stacks", () => {
    const timeline = buildTimeline(createBaseInputs());
    const stacks = computeHorizonUnrecoverableStacks(timeline)!;
    const data = buildHorizonUnrecoverableBarData(stacks);

    expect(data).toHaveLength(2);
    expect(data[0].side).toBe("Buying");
    expect(data[1].side).toBe("Renting");
    expect(data[0].rent).toBe(0);
    expect(data[1].mortgageInterest).toBe(0);
    expect(data[1].rent).toBe(stacks.renterRent);
  });
});
