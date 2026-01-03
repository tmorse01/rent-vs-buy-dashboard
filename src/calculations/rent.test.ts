import { describe, it, expect } from "vitest";
import { getRentAtMonth, calculateRentPath } from "./rent";

describe("Rent Calculations", () => {
  describe("getRentAtMonth", () => {
    it("returns initial rent for month 0", () => {
      const initialRent = 2000;
      const result = getRentAtMonth(initialRent, 0.03, 0);

      expect(result).toBe(initialRent);
    });

    it("calculates rent with annual step growth", () => {
      const initialRent = 2000;
      const growthRate = 0.03; // 3% annual

      // Months 1-12 should be same (year 0)
      expect(getRentAtMonth(initialRent, growthRate, 1)).toBe(2000);
      expect(getRentAtMonth(initialRent, growthRate, 12)).toBe(2000);

      // Month 13 should be year 1 (3% increase)
      expect(getRentAtMonth(initialRent, growthRate, 13)).toBeCloseTo(2060, 0);

      // Month 24 should still be year 1
      expect(getRentAtMonth(initialRent, growthRate, 24)).toBeCloseTo(2060, 0);

      // Month 25 should be year 2
      expect(getRentAtMonth(initialRent, growthRate, 25)).toBeCloseTo(2121.8, 0);
    });

    it("handles zero growth", () => {
      const initialRent = 2000;
      const month120 = getRentAtMonth(initialRent, 0, 120);

      expect(month120).toBe(initialRent);
    });

    it("handles high growth rates", () => {
      const initialRent = 2000;
      const growthRate = 0.1; // 10% annual

      const month13 = getRentAtMonth(initialRent, growthRate, 13);
      const month25 = getRentAtMonth(initialRent, growthRate, 25);

      expect(month13).toBeCloseTo(2200, 0);
      expect(month25).toBeCloseTo(2420, 0);
    });
  });

  describe("calculateRentPath", () => {
    it("generates correct rent path", () => {
      const initialRent = 2000;
      const growthRate = 0.03;
      const months = 24;

      const path = calculateRentPath(initialRent, growthRate, months);

      expect(path).toHaveLength(24);

      // First 12 months should be same
      for (let i = 0; i < 12; i++) {
        expect(path[i]).toBe(initialRent);
      }

      // Months 12-23 should be year 1 rate
      const year1Rent = initialRent * 1.03;
      for (let i = 12; i < 24; i++) {
        expect(path[i]).toBeCloseTo(year1Rent, 0);
      }
    });
  });
});

