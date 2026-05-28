import { describe, it, expect } from "vitest";
import {
  buildYearlyWealthBreakdown,
  computeHorizonWealthBreakdown,
} from "./wealthBreakdown";
import { buildTimeline } from "./timeline";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";
import { mergeScenarioInputs } from "../features/scenario/scenarioDefaults";

describe("wealthBreakdown", () => {
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
      horizonYears: 15,
      pmiEnabled: false,
      pmiRate: 0.5,
      extraPrincipalPayment: 0,
      mortgageInterestTaxDeductionEnabled: false,
      marginalTaxRate: 24,
      houseHackEnabled: false,
      rentalDepreciationTaxBenefitEnabled: false,
    });

  it("builds one row per year through the horizon", () => {
    const inputs = createBaseInputs();
    inputs.horizonYears = 10;
    const timeline = buildTimeline(inputs);
    const yearly = buildYearlyWealthBreakdown(timeline, inputs);

    expect(yearly).toHaveLength(10);
    expect(yearly[0].year).toBe(1);
    expect(yearly[9].year).toBe(10);
  });

  it("net appreciation grows with positive appreciation rate", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);
    const yearly = buildYearlyWealthBreakdown(timeline, inputs);

    expect(yearly[yearly.length - 1].netAppreciation).toBeGreaterThan(
      yearly[0].netAppreciation,
    );
  });

  it("handles zero appreciation", () => {
    const inputs = createBaseInputs();
    inputs.annualAppreciationRate = 0;
    const timeline = buildTimeline(inputs);
    const horizon = computeHorizonWealthBreakdown(timeline, inputs);

    expect(horizon).not.toBeNull();
    expect(horizon!.netAppreciation).toBeLessThanOrEqual(0);
    expect(horizon!.principalPaid).toBeGreaterThan(0);
  });

  it("computes appreciation share when owner equity gain is positive", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);
    const horizon = computeHorizonWealthBreakdown(timeline, inputs);

    expect(horizon).not.toBeNull();
    expect(horizon!.ownerEquityGain).toBeGreaterThan(0);
    expect(horizon!.appreciationSharePercent).not.toBeNull();
    expect(horizon!.appreciationSharePercent!).toBeGreaterThan(0);
    expect(horizon!.appreciationSharePercent!).toBeLessThanOrEqual(100);
  });

  it("returns null appreciation share when owner equity gain is zero", () => {
    const inputs = createBaseInputs();
    inputs.annualAppreciationRate = 0;
    inputs.horizonYears = 1;
    const timeline = buildTimeline(inputs);
    const horizon = computeHorizonWealthBreakdown(timeline, inputs);

    if (horizon!.ownerEquityGain <= 0) {
      expect(horizon!.appreciationSharePercent).toBeNull();
    }
  });

  it("supports horizons shorter than 5 years", () => {
    const inputs = createBaseInputs();
    inputs.horizonYears = 3;
    const timeline = buildTimeline(inputs);
    const yearly = buildYearlyWealthBreakdown(timeline, inputs);

    expect(yearly).toHaveLength(3);
    expect(computeHorizonWealthBreakdown(timeline, inputs)?.horizonYears).toBe(
      3,
    );
  });
});
