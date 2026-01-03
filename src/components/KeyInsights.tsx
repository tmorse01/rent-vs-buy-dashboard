import { Grid, Text, Title, Group, Stack, Tooltip } from "@mantine/core";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CurrencyDollar,
  AlertTriangle,
  InfoCircle,
} from "tabler-icons-react";
import type {
  Metrics,
  TimelinePoint,
} from "../features/scenario/ScenarioInputs";
import { GRADIENTS, COLORS } from "../theme/colors";
import { formatCurrency } from "../utils/formatting";
import { ColorAccentCard } from "./ColorAccentCard";

interface KeyInsightsProps {
  metrics: Metrics;
  timeline: TimelinePoint[];
}

export function KeyInsights({ metrics, timeline }: KeyInsightsProps) {
  const getDeltaIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={20} color="#000000" />;
    if (value < 0)
      return <TrendingDown size={20} color={COLORS.error.primary} />;
    return null;
  };

  const unrecoverableOwner10 = metrics.totalUnrecoverableOwner10;
  const unrecoverableRenter10 = metrics.totalUnrecoverableRenter10;
  const unrecoverableDifference = unrecoverableOwner10 - unrecoverableRenter10;

  // Get first month's payment breakdown
  const firstMonth = timeline[0];
  const totalMonthlyPayment = firstMonth
    ? firstMonth.mortgagePayment +
      firstMonth.propertyTax +
      firstMonth.insurance +
      firstMonth.maintenance +
      firstMonth.pmi
    : 0;

  return (
    <Grid gutter="md">
      {/* Monthly Payment Breakdown - Larger */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard
          p="lg"
          radius="md"
          gradient={GRADIENTS.owner}
          accentColor="#2563eb"
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <CurrencyDollar size={18} />
                <Text size="sm" fw={600}>
                  Monthly Payment
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs" fw={600}>
                      Monthly Payment Breakdown
                    </Text>
                    <Text size="xs">
                      This is the total monthly cost of homeownership,
                      including:
                    </Text>
                    <Text size="xs">
                      • Mortgage: Principal + interest payment
                    </Text>
                    <Text size="xs">• Tax: Monthly property tax</Text>
                    <Text size="xs">• Insurance: Homeowners insurance</Text>
                    <Text size="xs">
                      • Maintenance: Estimated monthly maintenance costs
                    </Text>
                    {firstMonth?.pmi > 0 && (
                      <Text size="xs">
                        • PMI: Private mortgage insurance (if applicable)
                      </Text>
                    )}
                    <Text size="xs" mt={4} style={{ opacity: 0.9 }}>
                      This represents your total monthly cash outflow as a
                      homeowner.
                    </Text>
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Title order={2} fw={700} style={{ lineHeight: 1.1 }}>
              {formatCurrency(totalMonthlyPayment)}
            </Title>
            {firstMonth && (
              <Stack
                gap="xs"
                mt="xs"
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  paddingTop: "12px",
                }}
              >
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="dimmed">
                    Mortgage
                  </Text>
                  <Text size="xs" fw={600}>
                    {formatCurrency(firstMonth.mortgagePayment)}
                  </Text>
                </Group>
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="dimmed">
                    Tax
                  </Text>
                  <Text size="xs" fw={600}>
                    {formatCurrency(firstMonth.propertyTax)}
                  </Text>
                </Group>
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="dimmed">
                    Insurance
                  </Text>
                  <Text size="xs" fw={600}>
                    {formatCurrency(firstMonth.insurance)}
                  </Text>
                </Group>
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="dimmed">
                    Maintenance
                  </Text>
                  <Text size="xs" fw={600}>
                    {formatCurrency(firstMonth.maintenance)}
                  </Text>
                </Group>
                {firstMonth.pmi > 0 && (
                  <Group justify="space-between" gap="xs">
                    <Text size="xs" c="dimmed">
                      PMI
                    </Text>
                    <Text size="xs" fw={600}>
                      {formatCurrency(firstMonth.pmi)}
                    </Text>
                  </Group>
                )}
              </Stack>
            )}
          </Stack>
        </ColorAccentCard>
      </Grid.Col>
      {/* Unrecoverable Costs - Larger */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard
          p="lg"
          radius="md"
          gradient={GRADIENTS.warning}
          accentColor="#f59e0b"
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <AlertTriangle size={18} />
                <Text size="sm" fw={600}>
                  Unrecoverable (10yr)
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs" fw={600}>
                      Unrecoverable Costs (10-Year)
                    </Text>
                    <Text size="xs">
                      Unrecoverable costs are expenses that don't build equity
                      or wealth:
                    </Text>
                    <Text size="xs" fw={600} mt={4}>
                      Owner unrecoverable costs include:
                    </Text>
                    <Text size="xs">• Mortgage interest (not principal)</Text>
                    <Text size="xs">• Property taxes</Text>
                    <Text size="xs">• Insurance</Text>
                    <Text size="xs">• Maintenance & repairs</Text>
                    <Text size="xs">• PMI (if applicable)</Text>
                    <Text size="xs">• Closing costs (amortized)</Text>
                    <Text size="xs" fw={600} mt={4}>
                      Renter unrecoverable costs:
                    </Text>
                    <Text size="xs">• Total rent paid over 10 years</Text>
                    <Text size="xs" mt={4} style={{ opacity: 0.9 }}>
                      The difference shows who pays more in non-recoverable
                      expenses.
                    </Text>
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Title
              order={2}
              fw={700}
              style={{
                lineHeight: 1.1,
                color:
                  unrecoverableDifference > 0
                    ? COLORS.error.primary
                    : "#000000",
              }}
            >
              {formatCurrency(Math.abs(unrecoverableDifference))}
            </Title>
            <Text
              size="xs"
              fw={500}
              c={unrecoverableDifference > 0 ? "red.7" : undefined}
            >
              {unrecoverableDifference > 0
                ? "Owner pays more"
                : "Renter pays more"}
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.2)",
                paddingTop: "12px",
              }}
            >
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Owner
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(unrecoverableOwner10)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Renter
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(unrecoverableRenter10)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </ColorAccentCard>
      </Grid.Col>

      {/* Combined Break-Even Card */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard
          p="lg"
          radius="md"
          gradient={GRADIENTS.teal}
          accentColor="#14b8a6"
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <Calendar size={18} />
                <Text size="sm" fw={600}>
                  Break-Even
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 320 }}>
                    <Text size="xs" fw={600}>
                      Break-Even Analysis
                    </Text>
                    <Text size="xs" fw={600} mt={4}>
                      Cash Flow Break-Even:
                    </Text>
                    <Text size="xs">
                      The year when the owner's average monthly unrecoverable
                      costs become less than or equal to the renter's average
                      monthly rent. This is when owning becomes cheaper on a
                      monthly cash-flow basis.
                    </Text>
                    <Text size="xs" fw={600} mt={4}>
                      Net Worth Break-Even:
                    </Text>
                    <Text size="xs">
                      The year when the owner's total net worth (home equity +
                      investments) exceeds the renter's net worth (investments
                      only). This is when owning becomes more financially
                      advantageous overall.
                    </Text>
                    {(!metrics.cashLossBreakEvenYear ||
                      !metrics.netWorthBreakEvenYear) && (
                      <>
                        <Text size="xs" fw={600} mt={4}>
                          To achieve break-even, consider:
                        </Text>
                        <Text size="xs">• Increase home appreciation rate</Text>
                        <Text size="xs">• Decrease investment return rate</Text>
                        <Text size="xs">• Increase down payment %</Text>
                        <Text size="xs">• Decrease mortgage interest rate</Text>
                        <Text size="xs">• Increase time horizon</Text>
                      </>
                    )}
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Stack gap="md">
              <div
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  paddingBottom: "12px",
                }}
              >
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Cash Flow
                </Text>
                <Title order={3} fw={700} style={{ lineHeight: 1.1 }}>
                  {metrics.cashLossBreakEvenYear
                    ? `${metrics.cashLossBreakEvenYear} years`
                    : "N/A"}
                </Title>
                <Text size="xs" c="dimmed" mt={2}>
                  {metrics.cashLossBreakEvenYear
                    ? "Owner costs ≤ rent"
                    : "No break-even found"}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Net Worth
                </Text>
                <Title order={3} fw={700} style={{ lineHeight: 1.1 }}>
                  {metrics.netWorthBreakEvenYear
                    ? `${metrics.netWorthBreakEvenYear} years`
                    : "N/A"}
                </Title>
                <Text size="xs" c="dimmed" mt={2}>
                  {metrics.netWorthBreakEvenYear
                    ? "Owner wealth ≥ renter"
                    : "No break-even in horizon"}
                </Text>
                {!metrics.netWorthBreakEvenYear && (
                  <Text size="xs" c="dimmed" style={{ opacity: 0.8 }} mt={4}>
                    Gap: {formatCurrency(Math.abs(metrics.netWorthDelta10))}
                  </Text>
                )}
              </div>
            </Stack>
          </Stack>
        </ColorAccentCard>
      </Grid.Col>

      {/* Net Worth Advantage - Multi-timeframe */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard
          p="lg"
          radius="md"
          gradient={GRADIENTS.positive}
          accentColor="#10b981"
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <CurrencyDollar size={18} />
                <Text size="sm" fw={600}>
                  NW Advantage
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs" fw={600}>
                      Net Worth Advantage (10-Year)
                    </Text>
                    <Text size="xs">
                      This shows the difference between owner and renter net
                      worth after 10 years.
                    </Text>
                    <Text size="xs" fw={600} mt={4}>
                      Owner Net Worth includes:
                    </Text>
                    <Text size="xs">
                      • Home equity (down payment + principal paid)
                    </Text>
                    <Text size="xs">• Home appreciation</Text>
                    <Text size="xs">
                      • Investment returns on remaining savings
                    </Text>
                    <Text size="xs" fw={600} mt={4}>
                      Renter Net Worth includes:
                    </Text>
                    <Text size="xs">
                      • Investment returns on all savings (down payment +
                      monthly savings from lower costs)
                    </Text>
                    <Text size="xs" mt={4} style={{ opacity: 0.9 }}>
                      Positive values favor buying, negative values favor
                      renting. The 5-year and 15-year values show how the
                      advantage changes over time.
                    </Text>
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Group gap="xs" align="center" wrap="nowrap">
              <Title
                order={2}
                fw={700}
                style={{
                  lineHeight: 1.1,
                  flex: 1,
                  color:
                    metrics.netWorthDelta10 > 0
                      ? "#000000"
                      : COLORS.error.primary,
                }}
              >
                {formatCurrency(metrics.netWorthDelta10)}
              </Title>
              {getDeltaIcon(metrics.netWorthDelta10)}
            </Group>
            <Text
              size="xs"
              fw={500}
              c={metrics.netWorthDelta10 > 0 ? undefined : "red.7"}
            >
              {metrics.netWorthDelta10 > 0
                ? "Owner advantage (10yr)"
                : "Renter advantage (10yr)"}
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.2)",
                paddingTop: "12px",
              }}
            >
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  5yr
                </Text>
                <Text
                  size="xs"
                  fw={600}
                  c={metrics.netWorthDelta5 > 0 ? undefined : "red.7"}
                >
                  {formatCurrency(metrics.netWorthDelta5)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  15yr
                </Text>
                <Text
                  size="xs"
                  fw={600}
                  c={metrics.netWorthDelta15 > 0 ? undefined : "red.7"}
                >
                  {formatCurrency(metrics.netWorthDelta15)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </ColorAccentCard>
      </Grid.Col>
    </Grid>
  );
}
