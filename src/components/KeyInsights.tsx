import { Grid, Paper, Text, Title, Group, Stack, Tooltip } from "@mantine/core";
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
import { GRADIENTS } from "../theme/colors";
import { formatCurrency } from "../utils/formatting";

interface KeyInsightsProps {
  metrics: Metrics;
  timeline: TimelinePoint[];
}

export function KeyInsights({ metrics, timeline }: KeyInsightsProps) {
  const getDeltaIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={20} />;
    if (value < 0) return <TrendingDown size={20} />;
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
        <Paper
          p="lg"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.owner,
            border: "none",
          }}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <CurrencyDollar size={18} color="white" />
                <Text size="sm" fw={600} c="white" style={{ opacity: 0.95 }}>
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
                  color="white"
                  style={{ opacity: 0.7, cursor: "help" }}
                />
              </Tooltip>
            </Group>
            <Title order={2} c="white" fw={700} style={{ lineHeight: 1.1 }}>
              {formatCurrency(totalMonthlyPayment)}
            </Title>
            {firstMonth && (
              <Stack
                gap="xs"
                mt="xs"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  paddingTop: "12px",
                }}
              >
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                    Mortgage
                  </Text>
                  <Text size="xs" c="white" fw={600}>
                    {formatCurrency(firstMonth.mortgagePayment)}
                  </Text>
                </Group>
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                    Tax
                  </Text>
                  <Text size="xs" c="white" fw={600}>
                    {formatCurrency(firstMonth.propertyTax)}
                  </Text>
                </Group>
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                    Insurance
                  </Text>
                  <Text size="xs" c="white" fw={600}>
                    {formatCurrency(firstMonth.insurance)}
                  </Text>
                </Group>
                <Group justify="space-between" gap="xs">
                  <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                    Maintenance
                  </Text>
                  <Text size="xs" c="white" fw={600}>
                    {formatCurrency(firstMonth.maintenance)}
                  </Text>
                </Group>
                {firstMonth.pmi > 0 && (
                  <Group justify="space-between" gap="xs">
                    <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                      PMI
                    </Text>
                    <Text size="xs" c="white" fw={600}>
                      {formatCurrency(firstMonth.pmi)}
                    </Text>
                  </Group>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Grid.Col>
      {/* Unrecoverable Costs - Larger */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Paper
          p="lg"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.warning,
            border: "none",
          }}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <AlertTriangle size={18} color="white" />
                <Text size="sm" fw={600} c="white" style={{ opacity: 0.95 }}>
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
                  color="white"
                  style={{ opacity: 0.7, cursor: "help" }}
                />
              </Tooltip>
            </Group>
            <Title order={2} c="white" fw={700} style={{ lineHeight: 1.1 }}>
              {formatCurrency(Math.abs(unrecoverableDifference))}
            </Title>
            <Text size="xs" c="white" fw={500} style={{ opacity: 0.9 }}>
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
                <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                  Owner
                </Text>
                <Text size="xs" c="white" fw={600}>
                  {formatCurrency(unrecoverableOwner10)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                  Renter
                </Text>
                <Text size="xs" c="white" fw={600}>
                  {formatCurrency(unrecoverableRenter10)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Combined Break-Even Card */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Paper
          p="lg"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.breakEvenCash,
            border: "none",
          }}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <Calendar size={18} color="white" />
                <Text size="sm" fw={600} c="white" style={{ opacity: 0.95 }}>
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
                  color="white"
                  style={{ opacity: 0.7, cursor: "help" }}
                />
              </Tooltip>
            </Group>
            <Stack gap="md">
              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "12px",
                }}
              >
                <Text
                  size="xs"
                  c="white"
                  fw={500}
                  style={{ opacity: 0.9 }}
                  mb={4}
                >
                  Cash Flow
                </Text>
                <Title order={3} c="white" fw={700} style={{ lineHeight: 1.1 }}>
                  {metrics.cashLossBreakEvenYear
                    ? `${metrics.cashLossBreakEvenYear} years`
                    : "N/A"}
                </Title>
                <Text size="xs" c="white" style={{ opacity: 0.8 }} mt={2}>
                  {metrics.cashLossBreakEvenYear
                    ? "Owner costs ≤ rent"
                    : "No break-even found"}
                </Text>
              </div>
              <div>
                <Text
                  size="xs"
                  c="white"
                  fw={500}
                  style={{ opacity: 0.9 }}
                  mb={4}
                >
                  Net Worth
                </Text>
                <Title order={3} c="white" fw={700} style={{ lineHeight: 1.1 }}>
                  {metrics.netWorthBreakEvenYear
                    ? `${metrics.netWorthBreakEvenYear} years`
                    : "N/A"}
                </Title>
                <Text size="xs" c="white" style={{ opacity: 0.8 }} mt={2}>
                  {metrics.netWorthBreakEvenYear
                    ? "Owner wealth ≥ renter"
                    : "No break-even in horizon"}
                </Text>
                {!metrics.netWorthBreakEvenYear && (
                  <Text size="xs" c="white" style={{ opacity: 0.7 }} mt={4}>
                    Gap: {formatCurrency(Math.abs(metrics.netWorthDelta10))}
                  </Text>
                )}
              </div>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Net Worth Advantage - Multi-timeframe */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Paper
          p="lg"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background:
              metrics.netWorthDelta10 > 0
                ? GRADIENTS.positive
                : GRADIENTS.negative,
            border: "none",
          }}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <CurrencyDollar size={18} color="white" />
                <Text size="sm" fw={600} c="white" style={{ opacity: 0.95 }}>
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
                  color="white"
                  style={{ opacity: 0.7, cursor: "help" }}
                />
              </Tooltip>
            </Group>
            <Group gap="xs" align="center" wrap="nowrap">
              <Title
                order={2}
                c="white"
                fw={700}
                style={{ lineHeight: 1.1, flex: 1 }}
              >
                {formatCurrency(metrics.netWorthDelta10)}
              </Title>
              {getDeltaIcon(metrics.netWorthDelta10)}
            </Group>
            <Text size="xs" c="white" fw={500} style={{ opacity: 0.9 }}>
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
                <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                  5yr
                </Text>
                <Text size="xs" c="white" fw={600}>
                  {formatCurrency(metrics.netWorthDelta5)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                  15yr
                </Text>
                <Text size="xs" c="white" fw={600}>
                  {formatCurrency(metrics.netWorthDelta15)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
