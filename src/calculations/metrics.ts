import type { ScenarioInputs, TimelinePoint, Metrics } from '../features/scenario/ScenarioInputs';

/**
 * Compute key metrics from timeline data
 */
export function computeMetrics(timeline: TimelinePoint[], inputs: ScenarioInputs): Metrics {
  const metrics: Metrics = {
    cashLossBreakEvenYear: null,
    netWorthBreakEvenYear: null,
    netWorthDelta5: 0,
    netWorthDelta10: 0,
    netWorthDelta15: 0,
    totalUnrecoverableOwner5: 0,
    totalUnrecoverableRenter5: 0,
    totalUnrecoverableOwner10: 0,
    totalUnrecoverableRenter10: 0,
    totalUnrecoverableOwner15: 0,
    totalUnrecoverableRenter15: 0,
  };
  
  if (timeline.length === 0) {
    return metrics;
  }
  
  // Calculate average monthly unrecoverable costs for each year
  const yearlyAverages: Array<{ year: number; avgOwner: number; avgRenter: number }> = [];
  
  for (let year = 1; year <= inputs.horizonYears; year++) {
    const yearStartMonth = (year - 1) * 12 + 1;
    const yearEndMonth = Math.min(year * 12, timeline.length);
    const yearPoints = timeline.slice(yearStartMonth - 1, yearEndMonth);
    
    if (yearPoints.length === 0) continue;
    
    const totalOwner = yearPoints.reduce((sum, p) => sum + p.ownerUnrecoverableMonthly, 0);
    const totalRenter = yearPoints.reduce((sum, p) => sum + p.rentMonthly, 0);
    
    yearlyAverages.push({
      year,
      avgOwner: totalOwner / yearPoints.length,
      avgRenter: totalRenter / yearPoints.length,
    });
  }
  
  // Find cash-loss break-even year (when avg owner unrecoverable <= avg rent)
  for (const avg of yearlyAverages) {
    if (avg.avgOwner <= avg.avgRenter && metrics.cashLossBreakEvenYear === null) {
      metrics.cashLossBreakEvenYear = avg.year;
      break;
    }
  }
  
  // Find net-worth break-even year (when owner net worth >= renter net worth)
  for (let year = 1; year <= inputs.horizonYears; year++) {
    const month = year * 12;
    if (month > timeline.length) break;
    
    const point = timeline[month - 1];
    if (point.ownerNetWorth >= point.renterNetWorth && metrics.netWorthBreakEvenYear === null) {
      metrics.netWorthBreakEvenYear = year;
      break;
    }
  }
  
  // Calculate net worth deltas and totals at 5/10/15 years
  const milestones = [5, 10, 15];
  
  for (const milestone of milestones) {
    const month = milestone * 12;
    if (month > timeline.length) continue;
    
    const point = timeline[month - 1];
    const delta = point.ownerNetWorth - point.renterNetWorth;
    
    if (milestone === 5) {
      metrics.netWorthDelta5 = delta;
      metrics.totalUnrecoverableOwner5 = point.ownerTotalUnrecoverable;
      metrics.totalUnrecoverableRenter5 = point.renterTotalUnrecoverable;
    } else if (milestone === 10) {
      metrics.netWorthDelta10 = delta;
      metrics.totalUnrecoverableOwner10 = point.ownerTotalUnrecoverable;
      metrics.totalUnrecoverableRenter10 = point.renterTotalUnrecoverable;
    } else if (milestone === 15) {
      metrics.netWorthDelta15 = delta;
      metrics.totalUnrecoverableOwner15 = point.ownerTotalUnrecoverable;
      metrics.totalUnrecoverableRenter15 = point.renterTotalUnrecoverable;
    }
  }
  
  return metrics;
}

