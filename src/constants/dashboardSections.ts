/** DOM ids for dashboard sections (Home). Key Insights cards link here. */
export const DASHBOARD_SECTION_IDS = {
  netWorthComparison: "section-net-worth-comparison",
  wealthOverTime: "section-wealth-over-time",
  unrecoverableCosts: "section-unrecoverable-costs",
  detailedMetrics: "section-detailed-metrics",
  breakEven: "section-break-even-recommendation",
} as const;

/** Offset so scroll position clears the fixed app header (~56px). */
export const DASHBOARD_SECTION_SCROLL_MARGIN_PX = 72;

export function scrollToDashboardSection(
  id: (typeof DASHBOARD_SECTION_IDS)[keyof typeof DASHBOARD_SECTION_IDS],
) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
