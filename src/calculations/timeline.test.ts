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
    extraPrincipalPayment: 0,
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

  it("ownerUnrecoverableMonthly excludes principal payment", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Check first few months to verify calculation
    for (let i = 0; i < Math.min(12, timeline.length); i++) {
      const point = timeline[i];

      // Unrecoverable cost should equal: interest + propertyTax + insurance + maintenance + pmi
      // It should NOT include mortgagePrincipal
      const expectedUnrecoverable =
        point.mortgageInterest +
        point.propertyTax +
        point.insurance +
        point.maintenance +
        point.pmi;

      expect(point.ownerUnrecoverableMonthly).toBeCloseTo(
        expectedUnrecoverable,
        2
      );

      // Verify principal is NOT included - unrecoverable should be less than mortgage payment
      // (mortgage payment = interest + principal, but unrecoverable = interest + other costs)
      // Note: unrecoverable can be greater than mortgage payment because it includes
      // property tax, insurance, maintenance, and PMI which are not part of mortgage payment

      // The key check: unrecoverable should NOT include principal
      // If we add principal to unrecoverable, it should be different from unrecoverable alone
      const unrecoverablePlusPrincipal =
        point.ownerUnrecoverableMonthly + point.mortgagePrincipal;
      expect(unrecoverablePlusPrincipal).toBeGreaterThan(
        point.ownerUnrecoverableMonthly
      );

      // Verify that mortgage payment = interest + principal
      expect(point.mortgagePayment).toBeCloseTo(
        point.mortgageInterest + point.mortgagePrincipal,
        2
      );
    }
  });

  it("mortgage interest decreases over time as loan is paid down", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Interest should decrease over time as balance decreases
    for (let i = 1; i < timeline.length; i++) {
      // Interest should generally decrease (or stay same if balance is same)
      // Allow small floating point differences
      expect(timeline[i].mortgageInterest).toBeLessThanOrEqual(
        timeline[i - 1].mortgageInterest + 0.01
      );
    }
  });

  it("unrecoverable costs trend - interest decreases but property tax/maintenance increase with appreciation", () => {
    const inputs = createBaseInputs();
    const timeline = buildTimeline(inputs);

    // Check first year vs later years
    const firstMonth = timeline[0];
    const year5Month = timeline[59]; // Month 60 (5 years)
    const year10Month = timeline[119]; // Month 120 (10 years)

    console.log("\nUnrecoverable Cost Components Over Time:");
    console.log("Month 1:");
    console.log("  Interest:", firstMonth.mortgageInterest.toFixed(2));
    console.log("  Property Tax:", firstMonth.propertyTax.toFixed(2));
    console.log("  Maintenance:", firstMonth.maintenance.toFixed(2));
    console.log("  Insurance:", firstMonth.insurance.toFixed(2));
    console.log("  Total Unrecoverable:", firstMonth.ownerUnrecoverableMonthly.toFixed(2));
    
    if (year5Month) {
      console.log("\nMonth 60 (Year 5):");
      console.log("  Interest:", year5Month.mortgageInterest.toFixed(2));
      console.log("  Property Tax:", year5Month.propertyTax.toFixed(2));
      console.log("  Maintenance:", year5Month.maintenance.toFixed(2));
      console.log("  Insurance:", year5Month.insurance.toFixed(2));
      console.log("  Total Unrecoverable:", year5Month.ownerUnrecoverableMonthly.toFixed(2));
      console.log("  Change from Month 1:", (year5Month.ownerUnrecoverableMonthly - firstMonth.ownerUnrecoverableMonthly).toFixed(2));
    }
    
    if (year10Month) {
      console.log("\nMonth 120 (Year 10):");
      console.log("  Interest:", year10Month.mortgageInterest.toFixed(2));
      console.log("  Property Tax:", year10Month.propertyTax.toFixed(2));
      console.log("  Maintenance:", year10Month.maintenance.toFixed(2));
      console.log("  Insurance:", year10Month.insurance.toFixed(2));
      console.log("  Total Unrecoverable:", year10Month.ownerUnrecoverableMonthly.toFixed(2));
      console.log("  Change from Month 1:", (year10Month.ownerUnrecoverableMonthly - firstMonth.ownerUnrecoverableMonthly).toFixed(2));
    }

    // Interest should definitely decrease
    if (year5Month) {
      expect(year5Month.mortgageInterest).toBeLessThan(firstMonth.mortgageInterest);
    }
    if (year10Month) {
      expect(year10Month.mortgageInterest).toBeLessThan(year5Month.mortgageInterest);
    }

    // Property tax and maintenance increase with home appreciation
    if (year5Month) {
      expect(year5Month.propertyTax).toBeGreaterThan(firstMonth.propertyTax);
      expect(year5Month.maintenance).toBeGreaterThan(firstMonth.maintenance);
    }
  });
});
