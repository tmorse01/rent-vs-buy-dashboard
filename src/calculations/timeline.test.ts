import { describe, it, expect } from "vitest";
import { buildTimeline } from "./timeline";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";

describe("Timeline Calculations", () => {
  const createBaseInputs = (): ScenarioInputs => ({
    homePrice: 500000,
    downPaymentPercent: 20,
    interestRate: 6,
    loanTermYears: 30,
    propertyTaxRate: 1.2,
    insuranceMonthly: 150,
    maintenanceRate: 1,
    sellingCostRate: 8,
    closingCostRate: 3,
    currentRent: 2000,
    rentGrowthRate: 3,
    annualReturnRate: 6,
    annualAppreciationRate: 3,
    horizonYears: 15,
    pmiEnabled: false,
    pmiRate: 0.5,
  });

  it("generates correct timeline length", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    expect(timeline).toHaveLength(15 * 12); // 15 years * 12 months
  });

  it("calculates increasing home value over time", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Home value should increase over time
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].homeValue).toBeGreaterThanOrEqual(
        timeline[i - 1].homeValue
      );
    }
  });

  it("calculates decreasing mortgage balance over time", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Mortgage balance should decrease over time
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].mortgageBalance).toBeLessThanOrEqual(
        timeline[i - 1].mortgageBalance
      );
    }
  });

  it("calculates increasing rent over time", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Rent should increase annually
    expect(timeline[0].rentMonthly).toBe(2000);
    expect(timeline[12].rentMonthly).toBeGreaterThan(2000); // Year 2
    expect(timeline[24].rentMonthly).toBeGreaterThan(timeline[12].rentMonthly);
  });

  it("calculates cumulative unrecoverable costs correctly", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Cumulative costs should increase over time
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].ownerTotalUnrecoverable).toBeGreaterThan(
        timeline[i - 1].ownerTotalUnrecoverable
      );
      expect(timeline[i].renterTotalUnrecoverable).toBeGreaterThan(
        timeline[i - 1].renterTotalUnrecoverable
      );
    }
  });

  it("calculates increasing principal paid over time", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Principal paid should increase over time
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].ownerTotalPrincipalPaid).toBeGreaterThan(
        timeline[i - 1].ownerTotalPrincipalPaid
      );
    }
  });

  it("calculates renter investment balance with compounding", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Investment balance should increase over time
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].renterInvestmentBalance).toBeGreaterThan(
        timeline[i - 1].renterInvestmentBalance
      );
    }
  });
});

