import { describe, it, expect } from "vitest";
import {
  calculateOwnerNetWorth,
  calculateRenterNetWorth,
  calculateRenterNetWorthPath,
} from "./netWorth";

describe("Net Worth Calculations", () => {
  describe("calculateOwnerNetWorth", () => {
    it("calculates net worth correctly", () => {
      const homeValue = 600000;
      const sellingCostRate = 0.08; // 8%
      const mortgageBalance = 400000;

      const netWorth = calculateOwnerNetWorth(
        homeValue,
        sellingCostRate,
        mortgageBalance
      );

      // Net proceeds = 600k * 0.92 = 552k
      // Net worth = 552k - 400k = 152k
      expect(netWorth).toBeCloseTo(152000, 0);
    });

    it("handles zero selling costs", () => {
      const netWorth = calculateOwnerNetWorth(600000, 0, 400000);

      expect(netWorth).toBe(200000);
    });

    it("handles fully paid mortgage", () => {
      const netWorth = calculateOwnerNetWorth(600000, 0.08, 0);

      expect(netWorth).toBeCloseTo(552000, 0);
    });
  });

  describe("calculateRenterNetWorth", () => {
    it("returns initial deposit for month 0", () => {
      const initialDeposit = 100000;
      const result = calculateRenterNetWorth(
        initialDeposit,
        500,
        0.06,
        0
      );

      expect(result).toBe(initialDeposit);
    });

    it("calculates investment balance with monthly compounding", () => {
      const initialDeposit = 100000;
      const monthlyContribution = 500;
      const annualReturnRate = 0.06; // 6%

      const month12 = calculateRenterNetWorth(
        initialDeposit,
        monthlyContribution,
        annualReturnRate,
        12
      );

      // Should have grown from initial deposit plus 12 contributions
      expect(month12).toBeGreaterThan(initialDeposit + 12 * monthlyContribution);
    });

    it("handles zero return rate", () => {
      const initialDeposit = 100000;
      const monthlyContribution = 500;

      const month12 = calculateRenterNetWorth(
        initialDeposit,
        monthlyContribution,
        0,
        12
      );

      // Should be initial + 12 contributions
      expect(month12).toBe(initialDeposit + 12 * monthlyContribution);
    });

    it("calculates correct balance after 10 years", () => {
      const initialDeposit = 100000;
      const monthlyContribution = 500;
      const annualReturnRate = 0.06;

      const month120 = calculateRenterNetWorth(
        initialDeposit,
        monthlyContribution,
        annualReturnRate,
        120
      );

      // Should be significantly more than principal (initial + contributions)
      const principal = initialDeposit + 120 * monthlyContribution;
      expect(month120).toBeGreaterThan(principal);

      // Should be approximately 250k-300k range
      expect(month120).toBeGreaterThan(250000);
      expect(month120).toBeLessThan(350000);
    });
  });

  describe("calculateRenterNetWorthPath", () => {
    it("generates correct path over time", () => {
      const initialDeposit = 100000;
      const monthlyContribution = 500;
      const annualReturnRate = 0.06;
      const months = 12;

      const path = calculateRenterNetWorthPath(
        initialDeposit,
        monthlyContribution,
        annualReturnRate,
        months
      );

      expect(path).toHaveLength(12);
      expect(path[0]).toBeCloseTo(
        calculateRenterNetWorth(
          initialDeposit,
          monthlyContribution,
          annualReturnRate,
          1
        ),
        0
      );

      // Values should be increasing
      for (let i = 1; i < path.length; i++) {
        expect(path[i]).toBeGreaterThan(path[i - 1]);
      }
    });
  });
});

