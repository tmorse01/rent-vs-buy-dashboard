import { Grid, Tabs, Title, Stack, Box } from '@mantine/core';
import { MetricCard } from './MetricCard';
import type { Metrics } from '../features/scenario/ScenarioInputs';
import { 
  Calendar, 
  CurrencyDollar, 
  Receipt,
  Clock 
} from 'tabler-icons-react';

interface MetricsDisplayProps {
  metrics: Metrics;
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <Tabs defaultValue="decision">
      <Tabs.List>
        <Tabs.Tab value="decision" leftSection={<Calendar size={16} />}>
          Decision Points
        </Tabs.Tab>
        <Tabs.Tab value="financial" leftSection={<CurrencyDollar size={16} />}>
          Financial Impact
        </Tabs.Tab>
        <Tabs.Tab value="costs" leftSection={<Receipt size={16} />}>
          Cost Comparison
        </Tabs.Tab>
        <Tabs.Tab value="time" leftSection={<Clock size={16} />}>
          Time-Based Analysis
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="decision" pt="md">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Cash-Loss Break-Even"
              value={metrics.cashLossBreakEvenYear ? `${metrics.cashLossBreakEvenYear} years` : null}
              description="Year when avg owner unrecoverable ≤ avg rent"
              icon={<Calendar size={20} />}
              tooltip="The year when the owner's average monthly unrecoverable costs become less than or equal to the renter's average monthly rent. This is when owning becomes cheaper on a monthly cash-flow basis."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Net-Worth Break-Even"
              value={metrics.netWorthBreakEvenYear ? `${metrics.netWorthBreakEvenYear} years` : null}
              description="Year when owner net worth ≥ renter net worth"
              icon={<Calendar size={20} />}
              tooltip="The year when the owner's total net worth (home equity + investments) exceeds the renter's net worth (investments only). This is when owning becomes more financially advantageous overall."
            />
          </Grid.Col>
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value="financial" pt="md">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Net Worth Delta (5 years)"
              value={metrics.netWorthDelta5}
              description="Owner - Renter net worth difference"
              icon={<CurrencyDollar size={20} />}
              trend={metrics.netWorthDelta5 > 0 ? 'up' : metrics.netWorthDelta5 < 0 ? 'down' : 'neutral'}
              tooltip="The difference between owner and renter net worth after 5 years. Positive values mean the owner is ahead, negative means the renter is ahead. This helps assess short-term financial impact."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Net Worth Delta (10 years)"
              value={metrics.netWorthDelta10}
              description="Owner - Renter net worth difference"
              icon={<CurrencyDollar size={20} />}
              trend={metrics.netWorthDelta10 > 0 ? 'up' : metrics.netWorthDelta10 < 0 ? 'down' : 'neutral'}
              tooltip="The difference between owner and renter net worth after 10 years. This is often a key decision point for long-term homeownership. Positive values favor buying, negative values favor renting."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Net Worth Delta (15 years)"
              value={metrics.netWorthDelta15}
              description="Owner - Renter net worth difference"
              icon={<CurrencyDollar size={20} />}
              trend={metrics.netWorthDelta15 > 0 ? 'up' : metrics.netWorthDelta15 < 0 ? 'down' : 'neutral'}
              tooltip="The difference between owner and renter net worth after 15 years. This shows the long-term financial impact of the decision. Generally, longer time horizons favor buying due to equity building and appreciation."
            />
          </Grid.Col>
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value="costs" pt="md">
        <Stack gap="md">
          <Box>
            <Title order={4} mb="sm">5-Year Costs</Title>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Total Unrecoverable Owner (5 years)"
                  value={metrics.totalUnrecoverableOwner5}
                  description="Cumulative owner unrecoverable costs"
                  icon={<Receipt size={20} />}
                  tooltip="Total unrecoverable costs for the owner over 5 years. This includes interest, property taxes, insurance, maintenance, PMI, and closing costs. These are costs that don't build equity."
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Total Unrecoverable Renter (5 years)"
                  value={metrics.totalUnrecoverableRenter5}
                  description="Cumulative renter costs"
                  icon={<Receipt size={20} />}
                  tooltip="Total rent paid by the renter over 5 years. This is the renter's primary unrecoverable cost."
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box>
            <Title order={4} mb="sm">10-Year Costs</Title>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Total Unrecoverable Owner (10 years)"
                  value={metrics.totalUnrecoverableOwner10}
                  description="Cumulative owner unrecoverable costs"
                  icon={<Receipt size={20} />}
                  tooltip="Total unrecoverable costs for the owner over 10 years. As time passes, principal payments reduce the mortgage balance, but unrecoverable costs continue."
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Total Unrecoverable Renter (10 years)"
                  value={metrics.totalUnrecoverableRenter10}
                  description="Cumulative renter costs"
                  icon={<Receipt size={20} />}
                  tooltip="Total rent paid by the renter over 10 years, including rent growth over time."
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box>
            <Title order={4} mb="sm">15-Year Costs</Title>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Total Unrecoverable Owner (15 years)"
                  value={metrics.totalUnrecoverableOwner15}
                  description="Cumulative owner unrecoverable costs"
                  icon={<Receipt size={20} />}
                  tooltip="Total unrecoverable costs for the owner over 15 years. By this point, significant principal has been paid down, reducing interest costs."
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Total Unrecoverable Renter (15 years)"
                  value={metrics.totalUnrecoverableRenter15}
                  description="Cumulative renter costs"
                  icon={<Receipt size={20} />}
                  tooltip="Total rent paid by the renter over 15 years, including cumulative rent growth."
                />
              </Grid.Col>
            </Grid>
          </Box>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="time" pt="md">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="5-Year Net Worth"
              value={metrics.netWorthDelta5}
              description="Owner advantage at 5 years"
              icon={<Clock size={20} />}
              trend={metrics.netWorthDelta5 > 0 ? 'up' : metrics.netWorthDelta5 < 0 ? 'down' : 'neutral'}
              tooltip="Net worth difference after 5 years. Short-term view of the financial impact. Early years often favor renting due to high upfront costs of buying."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="10-Year Net Worth"
              value={metrics.netWorthDelta10}
              description="Owner advantage at 10 years"
              icon={<Clock size={20} />}
              trend={metrics.netWorthDelta10 > 0 ? 'up' : metrics.netWorthDelta10 < 0 ? 'down' : 'neutral'}
              tooltip="Net worth difference after 10 years. This is often the break-even point where homeownership starts to show financial advantages."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="15-Year Net Worth"
              value={metrics.netWorthDelta15}
              description="Owner advantage at 15 years"
              icon={<Clock size={20} />}
              trend={metrics.netWorthDelta15 > 0 ? 'up' : metrics.netWorthDelta15 < 0 ? 'down' : 'neutral'}
              tooltip="Net worth difference after 15 years. Long-term view showing the compounding benefits of homeownership including equity and appreciation."
            />
          </Grid.Col>
        </Grid>
      </Tabs.Panel>
    </Tabs>
  );
}

