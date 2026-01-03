import { describe, it, expect } from "vitest";
import {
  calculateMonthlyPayment,
  calculateAmortizationSchedule,
  getMortgageBalance,
  getMortgageInterest,
  getMortgagePrincipal,
} from "./amortization";

describe("Amortization Calculations", () => {
  describe("calculateMonthlyPayment", () => {
    it("calculates correct monthly payment for standard loan", () => {
      const principal = 400000;
      const monthlyRate = 0.005; // 6% annual = 0.5% monthly
      const termMonths = 360; // 30 years

      const payment = calculateMonthlyPayment(principal, monthlyRate, termMonths);

      // Should be approximately $2,398.20
      expect(payment).toBeCloseTo(2398.2, 1);
    });

    it("handles zero interest rate", () => {
      const principal = 400000;
      const monthlyRate = 0;
      const termMonths = 360;

      const payment = calculateMonthlyPayment(principal, monthlyRate, termMonths);

      expect(payment).toBeCloseTo(400000 / 360, 2);
    });

    it("calculates correct payment for 15-year loan", () => {
      const principal = 400000;
      const monthlyRate = 0.005;
      const termMonths = 180; // 15 years

      const payment = calculateMonthlyPayment(principal, monthlyRate, termMonths);

      // Should be approximately $3,375.43
      expect(payment).toBeCloseTo(3375.43, 1);
    });
  });

  describe("calculateAmortizationSchedule", () => {
    it("creates correct amortization schedule", () => {
      const principal = 400000;
      const annualRate = 0.06; // 6%
      const termMonths = 360;

      const schedule = calculateAmortizationSchedule(
        principal,
        annualRate,
        termMonths
      );

      expect(schedule).toHaveLength(360);
      // First entry balance is after first payment, so should be less than principal
      // First principal payment reduces the balance
      const firstPrincipalPayment = schedule[0].principal;
      expect(schedule[0].balance).toBeCloseTo(principal - firstPrincipalPayment, 0);
      expect(schedule[359].balance).toBeCloseTo(0, 1);

      // First payment should have more interest than principal
      expect(schedule[0].interest).toBeGreaterThan(schedule[0].principal);

      // Last payment should have more principal than interest
      expect(schedule[359].principal).toBeGreaterThan(schedule[359].interest);

      // Total of principal payments should equal original principal
      const totalPrincipal = schedule.reduce(
        (sum, entry) => sum + entry.principal,
        0
      );
      expect(totalPrincipal).toBeCloseTo(principal, 0);
    });

    it("payment amount is consistent across all months", () => {
      const schedule = calculateAmortizationSchedule(400000, 0.06, 360);

      const firstPayment = schedule[0].payment;
      schedule.forEach((entry) => {
        expect(entry.payment).toBeCloseTo(firstPayment, 2);
      });
    });
  });

  describe("getMortgageBalance", () => {
    it("returns correct balance at specific month", () => {
      const schedule = calculateAmortizationSchedule(400000, 0.06, 360);

      const balance12 = getMortgageBalance(12, schedule);
      const balance60 = getMortgageBalance(60, schedule);
      const balance120 = getMortgageBalance(120, schedule);

      expect(balance12).toBeLessThan(400000);
      expect(balance60).toBeLessThan(balance12);
      expect(balance120).toBeLessThan(balance60);
    });

    it("returns 0 for months beyond loan term", () => {
      const schedule = calculateAmortizationSchedule(400000, 0.06, 360);

      expect(getMortgageBalance(361, schedule)).toBe(0);
      expect(getMortgageBalance(500, schedule)).toBe(0);
    });
  });

  describe("getMortgageInterest", () => {
    it("returns correct interest for specific month", () => {
      const schedule = calculateAmortizationSchedule(400000, 0.06, 360);

      const interest1 = getMortgageInterest(1, schedule);
      const interest12 = getMortgageInterest(12, schedule);

      // Interest should decrease over time as balance decreases
      expect(interest1).toBeGreaterThan(interest12);
      expect(interest1).toBeCloseTo(2000, 0); // 6% of 400k / 12
    });

    it("returns 0 for invalid months", () => {
      const schedule = calculateAmortizationSchedule(400000, 0.06, 360);

      expect(getMortgageInterest(0, schedule)).toBe(0);
      expect(getMortgageInterest(361, schedule)).toBe(0);
    });
  });

  describe("getMortgagePrincipal", () => {
    it("returns correct principal for specific month", () => {
      const schedule = calculateAmortizationSchedule(400000, 0.06, 360);

      const principal1 = getMortgagePrincipal(1, schedule);
      const principal360 = getMortgagePrincipal(360, schedule);

      // Principal should increase over time
      expect(principal360).toBeGreaterThan(principal1);
    });
  });
});

