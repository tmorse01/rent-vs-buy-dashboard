import type {
  ScenarioInputs,
  TimelinePoint,
} from "../features/scenario/ScenarioInputs";

export interface WealthBreakdownSnapshot {
  year: number;
  netAppreciation: number;
  principalPaid: number;
  portfolioGrowth: number;
}

export interface HorizonWealthBreakdown {
  horizonYears: number;
  netAppreciation: number;
  principalPaid: number;
  portfolioGrowth: number;
  ownerEquityGain: number;
  appreciationSharePercent: number | null;
  ownerNetWorth: number;
  renterNetWorth: number;
}

function cumulativeContributionsThroughMonth(
  timeline: TimelinePoint[],
  throughMonth: number,
): number {
  let total = 0;
  for (let month = 1; month <= throughMonth; month++) {
    total += timeline[month - 1].renterMonthlyContribution;
  }
  return total;
}

function snapshotAtMonth(
  timeline: TimelinePoint[],
  inputs: ScenarioInputs,
  month: number,
): WealthBreakdownSnapshot {
  const point = timeline[month - 1];
  const downPaymentAmount =
    inputs.homePrice * (inputs.downPaymentPercent / 100);
  const netAppreciation =
    point.homeValue * (1 - inputs.sellingCostRate / 100) - inputs.homePrice;
  const principalPaid = point.ownerTotalPrincipalPaid;
  const cumulativeContributions = cumulativeContributionsThroughMonth(
    timeline,
    month,
  );
  const portfolioGrowth =
    point.renterNetWorth - downPaymentAmount - cumulativeContributions;

  return {
    year: point.year,
    netAppreciation,
    principalPaid,
    portfolioGrowth,
  };
}

export function buildYearlyWealthBreakdown(
  timeline: TimelinePoint[],
  inputs: ScenarioInputs,
): WealthBreakdownSnapshot[] {
  if (timeline.length === 0) return [];

  const rows: WealthBreakdownSnapshot[] = [];
  const maxYear = Math.ceil(timeline.length / 12);

  for (let year = 1; year <= maxYear; year++) {
    const month = year * 12;
    if (month > timeline.length) break;
    rows.push(snapshotAtMonth(timeline, inputs, month));
  }

  return rows;
}

export function computeHorizonWealthBreakdown(
  timeline: TimelinePoint[],
  inputs: ScenarioInputs,
): HorizonWealthBreakdown | null {
  if (timeline.length === 0) return null;

  const month = timeline.length;
  const snapshot = snapshotAtMonth(timeline, inputs, month);
  const point = timeline[month - 1];
  const ownerEquityGain =
    snapshot.netAppreciation + snapshot.principalPaid;
  const appreciationSharePercent =
    ownerEquityGain > 0
      ? (snapshot.netAppreciation / ownerEquityGain) * 100
      : null;

  return {
    horizonYears: point.year,
    netAppreciation: snapshot.netAppreciation,
    principalPaid: snapshot.principalPaid,
    portfolioGrowth: snapshot.portfolioGrowth,
    ownerEquityGain,
    appreciationSharePercent,
    ownerNetWorth: point.ownerNetWorth,
    renterNetWorth: point.renterNetWorth,
  };
}
