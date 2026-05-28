import type { TimelinePoint } from "../features/scenario/ScenarioInputs";

export interface HorizonUnrecoverableStacks {
  horizonYears: number;
  mortgageInterest: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  pmi: number;
  ownerTotal: number;
  renterRent: number;
}

function sumOwnerComponentsThroughHorizon(timeline: TimelinePoint[]) {
  let mortgageInterest = 0;
  let propertyTax = 0;
  let insurance = 0;
  let maintenance = 0;
  let pmi = 0;

  for (const p of timeline) {
    mortgageInterest += p.mortgageInterest;
    propertyTax += p.propertyTax;
    insurance += p.insurance;
    maintenance += p.maintenance;
    pmi += p.pmi;
  }

  return {
    mortgageInterest: Math.round(mortgageInterest),
    propertyTax: Math.round(propertyTax),
    insurance: Math.round(insurance),
    maintenance: Math.round(maintenance),
    pmi: Math.round(pmi),
  };
}

/** Cumulative gross owner components and renter rent through the full horizon. */
export function computeHorizonUnrecoverableStacks(
  timeline: TimelinePoint[],
): HorizonUnrecoverableStacks | null {
  if (timeline.length === 0) return null;

  const last = timeline[timeline.length - 1];
  const parts = sumOwnerComponentsThroughHorizon(timeline);

  return {
    horizonYears: last.year,
    ...parts,
    ownerTotal: Math.round(last.ownerTotalUnrecoverable),
    renterRent: Math.round(last.renterTotalUnrecoverable),
  };
}

export function buildHorizonUnrecoverableBarData(
  stacks: HorizonUnrecoverableStacks,
): Record<string, string | number>[] {
  return [
    {
      side: "Buying",
      mortgageInterest: stacks.mortgageInterest,
      propertyTax: stacks.propertyTax,
      insurance: stacks.insurance,
      maintenance: stacks.maintenance,
      pmi: stacks.pmi,
      rent: 0,
    },
    {
      side: "Renting",
      mortgageInterest: 0,
      propertyTax: 0,
      insurance: 0,
      maintenance: 0,
      pmi: 0,
      rent: stacks.renterRent,
    },
  ];
}
