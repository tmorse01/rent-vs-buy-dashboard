import { Grid } from '@mantine/core';
import { MetricCard } from './MetricCard';
import type { Metrics } from '../features/scenario/ScenarioInputs';

interface MetricsDisplayProps {
  metrics: Metrics;
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Cash-Loss Break-Even"
          value={metrics.cashLossBreakEvenYear ? `${metrics.cashLossBreakEvenYear} years` : null}
          description="Year when avg owner unrecoverable ≤ avg rent"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Net-Worth Break-Even"
          value={metrics.netWorthBreakEvenYear ? `${metrics.netWorthBreakEvenYear} years` : null}
          description="Year when owner net worth ≥ renter net worth"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Net Worth Delta (5 years)"
          value={metrics.netWorthDelta5}
          description="Owner - Renter net worth difference"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Net Worth Delta (10 years)"
          value={metrics.netWorthDelta10}
          description="Owner - Renter net worth difference"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Net Worth Delta (15 years)"
          value={metrics.netWorthDelta15}
          description="Owner - Renter net worth difference"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Unrecoverable Owner (5 years)"
          value={metrics.totalUnrecoverableOwner5}
          description="Cumulative owner unrecoverable costs"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Unrecoverable Renter (5 years)"
          value={metrics.totalUnrecoverableRenter5}
          description="Cumulative renter costs"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Unrecoverable Owner (10 years)"
          value={metrics.totalUnrecoverableOwner10}
          description="Cumulative owner unrecoverable costs"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Unrecoverable Renter (10 years)"
          value={metrics.totalUnrecoverableRenter10}
          description="Cumulative renter costs"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Unrecoverable Owner (15 years)"
          value={metrics.totalUnrecoverableOwner15}
          description="Cumulative owner unrecoverable costs"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Unrecoverable Renter (15 years)"
          value={metrics.totalUnrecoverableRenter15}
          description="Cumulative renter costs"
        />
      </Grid.Col>
    </Grid>
  );
}

