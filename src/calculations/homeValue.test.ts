import { describe, it, expect } from "vitest";
import { calculateHomeValue, calculateHomeValuePath } from "./homeValue";

describe("Home Value Calculations", () => {
  describe("calculateHomeValue", () => {
    it("returns initial value for month 0", () => {
      const initialValue = 500000;
      const result = calculateHomeValue(initialValue, 0.03, 0);

      expect(result).toBe(initialValue);
    });

    it("calculates appreciation with monthly compounding", () => {
      const initialValue = 500000;
      const annualRate = 0.03; // 3% annual
      const month12 = calculateHomeValue(initialValue, annualRate, 12);

      // After 12 months at 3% annual, should be approximately 515,000
      expect(month12).toBeCloseTo(515000, 0);
    });

    it("handles zero appreciation", () => {
      const initialValue = 500000;
      const month12 = calculateHomeValue(initialValue, 0, 12);

      expect(month12).toBe(initialValue);
    });

    it("calculates correct value after 10 years", () => {
      const initialValue = 500000;
      const annualRate = 0.03;
      const month120 = calculateHomeValue(initialValue, annualRate, 120);

      // After 10 years at 3%: 500k * (1.03)^10 ≈ 671,958
      expect(month120).toBeCloseTo(671958, 0);
    });

    it("handles negative appreciation", () => {
      const initialValue = 500000;
      const annualRate = -0.02; // -2% annual
      const month12 = calculateHomeValue(initialValue, annualRate, 12);

      expect(month12).toBeLessThan(initialValue);
      expect(month12).toBeCloseTo(490000, 0);
    });
  });

  describe("calculateHomeValuePath", () => {
    it("generates correct path over time", () => {
      const initialValue = 500000;
      const annualRate = 0.03;
      const months = 12;

      const path = calculateHomeValuePath(initialValue, annualRate, months);

      expect(path).toHaveLength(12);
      expect(path[0]).toBeCloseTo(
        calculateHomeValue(initialValue, annualRate, 1),
        0
      );
      expect(path[11]).toBeCloseTo(
        calculateHomeValue(initialValue, annualRate, 12),
        0
      );

      // Values should be increasing
      for (let i = 1; i < path.length; i++) {
        expect(path[i]).toBeGreaterThan(path[i - 1]);
      }
    });
  });
});

