import {
  Grid,
  Paper,
  Text,
  Title,
  Group,
  Stack,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
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
    <Grid gutter="sm">
      {/* Monthly Payment Breakdown */}
      <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
        <Paper
          p="md"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.owner,
            border: "none",
          }}
        >
          <Stack gap={6}>
            <Group gap={6} wrap="nowrap">
              <CurrencyDollar size={20} color="white" />
              <Text
                size="xs"
                fw={600}
                c="white"
                style={{ opacity: 0.9 }}
                lineClamp={1}
              >
                Monthly Payment
              </Text>
            </Group>
            <Title order={2} c="white" fw={700} style={{ lineHeight: 1.2 }}>
              {formatCurrency(totalMonthlyPayment)}
            </Title>
            {firstMonth && (
              <Stack gap={3} mt={4}>
                <Text
                  size="xs"
                  c="white"
                  style={{ opacity: 0.7 }}
                  lineClamp={1}
                >
                  Mortgage: {formatCurrency(firstMonth.mortgagePayment)}
                </Text>
                <Text
                  size="xs"
                  c="white"
                  style={{ opacity: 0.7 }}
                  lineClamp={1}
                >
                  Tax: {formatCurrency(firstMonth.propertyTax)}
                </Text>
                <Text
                  size="xs"
                  c="white"
                  style={{ opacity: 0.7 }}
                  lineClamp={1}
                >
                  Insurance: {formatCurrency(firstMonth.insurance)}
                </Text>
                <Text
                  size="xs"
                  c="white"
                  style={{ opacity: 0.7 }}
                  lineClamp={1}
                >
                  Maint: {formatCurrency(firstMonth.maintenance)}
                </Text>
                {firstMonth.pmi > 0 && (
                  <Text
                    size="xs"
                    c="white"
                    style={{ opacity: 0.7 }}
                    lineClamp={1}
                  >
                    PMI: {formatCurrency(firstMonth.pmi)}
                  </Text>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Grid.Col>
      {/* Unrecoverable Costs - Combined */}
      <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
        <Paper
          p="md"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.warning,
            border: "none",
          }}
        >
          <Stack gap={6}>
            <Group gap={6} wrap="nowrap">
              <AlertTriangle size={20} color="white" />
              <Text
                size="xs"
                fw={600}
                c="white"
                style={{ opacity: 0.9 }}
                lineClamp={1}
              >
                Unrecoverable (10yr)
              </Text>
            </Group>
            <Title order={2} c="white" fw={700} style={{ lineHeight: 1.2 }}>
              {formatCurrency(Math.abs(unrecoverableDifference))}
            </Title>
            <Text size="xs" c="white" style={{ opacity: 0.8 }} lineClamp={1}>
              {unrecoverableDifference > 0
                ? "Owner pays more"
                : "Renter pays more"}
            </Text>
            <Stack gap={3} mt={4}>
              <Text size="xs" c="white" style={{ opacity: 0.7 }} lineClamp={1}>
                Owner: {formatCurrency(unrecoverableOwner10)}
              </Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }} lineClamp={1}>
                Renter: {formatCurrency(unrecoverableRenter10)}
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Cash-Loss Break-Even */}
      <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
        <Paper
          p="md"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.breakEvenCash,
            border: "none",
          }}
        >
          <Stack gap={6}>
            <Group gap={6} wrap="nowrap">
              <Calendar size={20} color="white" />
              <Text
                size="xs"
                fw={600}
                c="white"
                style={{ opacity: 0.9 }}
                lineClamp={1}
              >
                Cash Break-Even
              </Text>
            </Group>
            <Title order={2} c="white" fw={700} style={{ lineHeight: 1.2 }}>
              {metrics.cashLossBreakEvenYear
                ? `${metrics.cashLossBreakEvenYear}`
                : "N/A"}
            </Title>
            <Text size="xs" c="white" style={{ opacity: 0.8 }} lineClamp={2}>
              {metrics.cashLossBreakEvenYear
                ? `years until owner costs ≤ rent`
                : "No break-even found"}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Net-Worth Break-Even */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Paper
          p="md"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.breakEvenNetWorth,
            border: "none",
          }}
        >
          <Stack gap={6}>
            <Group gap={6} wrap="nowrap" justify="space-between">
              <Group gap={6} wrap="nowrap" style={{ flex: 1 }}>
                <Calendar size={20} color="white" />
                <Text
                  size="xs"
                  fw={600}
                  c="white"
                  style={{ opacity: 0.9 }}
                  lineClamp={1}
                >
                  NW Break-Even
                </Text>
              </Group>
              {!metrics.netWorthBreakEvenYear && (
                <Tooltip
                  label={
                    <Stack gap={4} style={{ maxWidth: 280 }}>
                      <Text size="xs" fw={600}>
                        To achieve break-even, consider:
                      </Text>
                      <Text size="xs">• Increase home appreciation rate</Text>
                      <Text size="xs">• Decrease investment return rate</Text>
                      <Text size="xs">• Increase down payment %</Text>
                      <Text size="xs">• Decrease mortgage interest rate</Text>
                      <Text size="xs">• Increase time horizon</Text>
                    </Stack>
                  }
                  withArrow
                  multiline
                >
                  <ActionIcon
                    variant="subtle"
                    size="xs"
                    color="white"
                    style={{ opacity: 0.8 }}
                  >
                    <InfoCircle size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
            <Title order={2} c="white" fw={700} style={{ lineHeight: 1.2 }}>
              {metrics.netWorthBreakEvenYear
                ? `${metrics.netWorthBreakEvenYear}`
                : "N/A"}
            </Title>
            <Text size="xs" c="white" style={{ opacity: 0.8 }} lineClamp={2}>
              {metrics.netWorthBreakEvenYear
                ? `years until owner wealth ≥ renter`
                : "No break-even in horizon"}
            </Text>
            {!metrics.netWorthBreakEvenYear && (
              <Stack gap={3} mt={4}>
                <Text
                  size="xs"
                  c="white"
                  style={{ opacity: 0.7 }}
                  lineClamp={1}
                >
                  Gap: {formatCurrency(Math.abs(metrics.netWorthDelta10))}
                </Text>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Net Worth Advantage - Multi-timeframe */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Paper
          p="md"
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
          <Stack gap={6}>
            <Group gap={6} wrap="nowrap">
              <CurrencyDollar size={20} color="white" />
              <Text
                size="xs"
                fw={600}
                c="white"
                style={{ opacity: 0.9 }}
                lineClamp={1}
              >
                NW Advantage
              </Text>
            </Group>
            <Group gap={4} align="center" wrap="nowrap">
              <Title
                order={2}
                c="white"
                fw={700}
                style={{ lineHeight: 1.2, flex: 1 }}
              >
                {formatCurrency(metrics.netWorthDelta10)}
              </Title>
              {getDeltaIcon(metrics.netWorthDelta10)}
            </Group>
            <Text size="xs" c="white" style={{ opacity: 0.8 }} lineClamp={1}>
              {metrics.netWorthDelta10 > 0
                ? "Owner advantage (10yr)"
                : "Renter advantage (10yr)"}
            </Text>
            <Stack gap={3} mt={4}>
              <Text size="xs" c="white" style={{ opacity: 0.7 }} lineClamp={1}>
                5yr: {formatCurrency(metrics.netWorthDelta5)}
              </Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }} lineClamp={1}>
                15yr: {formatCurrency(metrics.netWorthDelta15)}
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
