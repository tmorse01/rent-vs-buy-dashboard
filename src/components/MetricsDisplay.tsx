import { Grid, Tabs, Title, Stack, Box, Text } from "@mantine/core";
import { useMemo } from "react";
import { MetricCard } from "./MetricCard";
import type {
  Metrics,
  ScenarioInputs,
  TimelinePoint,
} from "../features/scenario/ScenarioInputs";
import {
  Calendar,
  CurrencyDollar,
  TrendingUp,
} from "tabler-icons-react";
import { computeHorizonWealthBreakdown } from "../calculations/wealthBreakdown";
import { formatPercent } from "../utils/formatting";

interface MetricsDisplayProps {
  metrics: Metrics;
  timeline: TimelinePoint[];
  inputs: ScenarioInputs;
}

export function MetricsDisplay({
  metrics,
  timeline,
  inputs,
}: MetricsDisplayProps) {
  const horizon = useMemo(
    () => computeHorizonWealthBreakdown(timeline, inputs),
    [timeline, inputs],
  );

  const netWorthDeltaData: number[] = [];
  for (let year = 1; year <= Math.ceil(timeline.length / 12); year++) {
    const month = year * 12;
    if (month > timeline.length) break;
    const point = timeline[month - 1];
    netWorthDeltaData.push(Math.round(point.ownerNetWorth - point.renterNetWorth));
  }

  const buyLeads =
    horizon !== null && horizon.ownerNetWorth > horizon.renterNetWorth;
  const appreciationDominates =
    buyLeads &&
    horizon !== null &&
    horizon.appreciationSharePercent !== null &&
    horizon.appreciationSharePercent > 50;

  return (
    <Tabs defaultValue="decision">
      <Tabs.List>
        <Tabs.Tab value="decision" leftSection={<Calendar size={16} />}>
          Decision Points
        </Tabs.Tab>
        <Tabs.Tab value="financial" leftSection={<CurrencyDollar size={16} />}>
          Financial Impact
        </Tabs.Tab>
        <Tabs.Tab value="growth" leftSection={<TrendingUp size={16} />}>
          Growth & returns
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="decision" pt="md">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Cash-Loss Break-Even"
              value={
                metrics.cashLossBreakEvenYear
                  ? `${metrics.cashLossBreakEvenYear} years`
                  : null
              }
              description="Year when avg owner unrecoverable ≤ avg rent"
              icon={<Calendar size={20} />}
              tooltip="The year when the owner's average monthly unrecoverable costs become less than or equal to the renter's average monthly rent."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Net-Worth Break-Even"
              value={
                metrics.netWorthBreakEvenYear
                  ? `${metrics.netWorthBreakEvenYear} years`
                  : null
              }
              description="Year when owner net worth ≥ renter net worth"
              icon={<Calendar size={20} />}
              tooltip="The year when the owner's total net worth exceeds the renter's net worth."
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
              trend={
                metrics.netWorthDelta5 > 0
                  ? "up"
                  : metrics.netWorthDelta5 < 0
                    ? "down"
                    : "neutral"
              }
              tooltip="The difference between owner and renter net worth after 5 years."
              sparklineData={netWorthDeltaData}
              sparklineColor={
                metrics.netWorthDelta5 > 0
                  ? "green"
                  : metrics.netWorthDelta5 < 0
                    ? "red"
                    : "blue"
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Net Worth Delta (10 years)"
              value={metrics.netWorthDelta10}
              description="Owner - Renter net worth difference"
              icon={<CurrencyDollar size={20} />}
              trend={
                metrics.netWorthDelta10 > 0
                  ? "up"
                  : metrics.netWorthDelta10 < 0
                    ? "down"
                    : "neutral"
              }
              tooltip="The difference between owner and renter net worth after 10 years."
              sparklineData={netWorthDeltaData}
              sparklineColor={
                metrics.netWorthDelta10 > 0
                  ? "green"
                  : metrics.netWorthDelta10 < 0
                    ? "red"
                    : "blue"
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Net Worth Delta (15 years)"
              value={metrics.netWorthDelta15}
              description="Owner - Renter net worth difference"
              icon={<CurrencyDollar size={20} />}
              trend={
                metrics.netWorthDelta15 > 0
                  ? "up"
                  : metrics.netWorthDelta15 < 0
                    ? "down"
                    : "neutral"
              }
              tooltip="The difference between owner and renter net worth after 15 years."
              sparklineData={netWorthDeltaData}
              sparklineColor={
                metrics.netWorthDelta15 > 0
                  ? "green"
                  : metrics.netWorthDelta15 < 0
                    ? "red"
                    : "blue"
              }
            />
          </Grid.Col>
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value="growth" pt="md">
        <Stack gap="md">
          <Box>
            <Title order={4} mb="sm">
              Scenario rates
            </Title>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Home Appreciation Rate"
                  value={formatPercent(inputs.annualAppreciationRate, 1)}
                  description="Annual home value growth assumption"
                  icon={<TrendingUp size={20} />}
                  tooltip="Edit in Scenario inputs. Drives net appreciation on the owner side over your horizon."
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Annual Investment Return"
                  value={formatPercent(inputs.annualReturnRate, 1)}
                  description="Portfolio return on renter investments"
                  icon={<TrendingUp size={20} />}
                  tooltip="Edit in Scenario inputs. Compounds the down payment and monthly savings invested while renting."
                />
              </Grid.Col>
            </Grid>
          </Box>

          {horizon && (
            <Box>
              <Title order={4} mb="sm">
                Wealth drivers at {horizon.horizonYears} years
              </Title>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <MetricCard
                    title="Net Appreciation"
                    value={horizon.netAppreciation}
                    description="After selling costs, vs. purchase price"
                    icon={<TrendingUp size={20} />}
                    tooltip="homeValue × (1 − selling cost) − home price at horizon."
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <MetricCard
                    title="Principal Paid"
                    value={horizon.principalPaid}
                    description="Cumulative mortgage principal"
                    icon={<TrendingUp size={20} />}
                    tooltip="Equity built through mortgage paydown."
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <MetricCard
                    title="Portfolio Growth"
                    value={horizon.portfolioGrowth}
                    description="Renter investment gains above contributions"
                    icon={<TrendingUp size={20} />}
                    tooltip="Renter net worth minus down payment minus cumulative monthly contributions."
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <MetricCard
                    title="Appreciation Share of Owner Gain"
                    value={
                      horizon.appreciationSharePercent !== null
                        ? formatPercent(horizon.appreciationSharePercent, 0)
                        : null
                    }
                    description="Net appreciation ÷ (appreciation + principal)"
                    icon={<TrendingUp size={20} />}
                    tooltip="Share of owner equity gains from home appreciation vs. principal paydown."
                  />
                </Grid.Col>
              </Grid>
              {appreciationDominates && (
                <Text size="sm" c="dimmed" mt="xs">
                  Buying leads on net worth, and home appreciation accounts for
                  more than half of owner equity gains—appreciation is the
                  primary wealth driver in this scenario.
                </Text>
              )}
            </Box>
          )}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
}
