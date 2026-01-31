## Plan: Dashboard content reorganization

Reframe the dashboard into five sections: simplified inputs (Buy vs Rent), top-four KPI cards, analysis charts, detailed metrics, and final break-even recommendation. This plan maps the new structure onto existing components and calculations so copy/ordering changes are straightforward and minimize logic changes while clarifying narrative flow.

### Steps 4

1. Reorganize the left sidebar in [src/features/scenario/ScenarioForm.tsx](src/features/scenario/ScenarioForm.tsx) into two labeled groups using existing `ScenarioInputs` fields.
2. Recompose the Home layout in [src/routes/Home.tsx](src/routes/Home.tsx) to enforce the new section order and titles, keeping `Layout` and `KeyInsights` consistent.
3. Update top-four KPI card content by refining `KeyInsights` and `MetricsDisplay` layouts in [src/components/KeyInsights.tsx](src/components/KeyInsights.tsx) and [src/components/MetricsDisplay.tsx](src/components/MetricsDisplay.tsx) to show scenario winner, net worth comparison, unrecoverable cost comparison, and break-even point.
4. Move charts into an “Analysis Charts” section using existing chart components in [src/features/charts/NetWorthChart.tsx](src/features/charts/NetWorthChart.tsx), [src/features/charts/UnrecoverableCostChart.tsx](src/features/charts/UnrecoverableCostChart.tsx), and [src/features/charts/WealthStackChart.tsx](src/features/charts/WealthStackChart.tsx), then place “Detailed Metrics” and “Break-even & Recommendation” sections using [src/components/MetricsDisplay.tsx](src/components/MetricsDisplay.tsx) and `breakEven` content in [src/components/KeyInsights.tsx](src/components/KeyInsights.tsx).

### Further Considerations 2

1. Do you want to add the unused monthly cost chart from [src/features/charts/MonthlyCostChart.tsx](src/features/charts/MonthlyCostChart.tsx) into “Analysis Charts”?
2. For recommendations, should the copy be static guidance or depend on computed break-even and net worth advantage from [src/calculations/metrics.ts](src/calculations/metrics.ts)?
