import { Grid, Paper, Text, Title, Group, Stack } from "@mantine/core";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CurrencyDollar,
  AlertTriangle,
} from "tabler-icons-react";
import type { Metrics } from "../features/scenario/ScenarioInputs";
import { GRADIENTS } from "../theme/colors";
import { formatCurrency } from "../utils/formatting";

interface KeyInsightsProps {
  metrics: Metrics;
}

export function KeyInsights({ metrics }: KeyInsightsProps) {
  const getDeltaIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={20} />;
    if (value < 0) return <TrendingDown size={20} />;
    return null;
  };

  const unrecoverableOwner10 = metrics.totalUnrecoverableOwner10;
  const unrecoverableRenter10 = metrics.totalUnrecoverableRenter10;
  const unrecoverableDifference = unrecoverableOwner10 - unrecoverableRenter10;

  return (
    <Grid gutter="md">
      {/* Unrecoverable Losses - Most Prominent */}
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <Paper
          p="xl"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.warning,
            border: "none",
          }}
        >
          <Stack gap="xs">
            <Group gap="xs" mb="xs">
              <AlertTriangle size={24} color="white" />
              <Text size="sm" fw={600} c="white" style={{ opacity: 0.9 }}>
                Unrecoverable Losses (10yr)
              </Text>
            </Group>
            <Title order={1} c="white" fw={700}>
              {formatCurrency(unrecoverableOwner10)}
            </Title>
            <Text size="sm" c="white" style={{ opacity: 0.8 }}>
              Owner: {formatCurrency(unrecoverableOwner10)}
            </Text>
            <Text size="sm" c="white" style={{ opacity: 0.8 }}>
              Renter: {formatCurrency(unrecoverableRenter10)}
            </Text>
            <Text size="xs" c="white" style={{ opacity: 0.7 }} mt="xs">
              {unrecoverableDifference > 0
                ? `Owner pays ${formatCurrency(Math.abs(unrecoverableDifference))} more`
                : `Renter pays ${formatCurrency(Math.abs(unrecoverableDifference))} more`}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Break-Even Metrics */}
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <Paper
          p="xl"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.breakEvenCash,
            border: "none",
          }}
        >
          <Stack gap="xs">
            <Group gap="xs" mb="xs">
              <Calendar size={24} color="white" />
              <Text size="sm" fw={600} c="white" style={{ opacity: 0.9 }}>
                Cash-Loss Break-Even
              </Text>
            </Group>
            <Title order={1} c="white" fw={700}>
              {metrics.cashLossBreakEvenYear
                ? `${metrics.cashLossBreakEvenYear}`
                : "N/A"}
            </Title>
            <Text size="sm" c="white" style={{ opacity: 0.8 }}>
              {metrics.cashLossBreakEvenYear
                ? `years until owner costs ≤ rent`
                : "No break-even found"}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <Paper
          p="xl"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.breakEvenNetWorth,
            border: "none",
          }}
        >
          <Stack gap="xs">
            <Group gap="xs" mb="xs">
              <Calendar size={24} color="white" />
              <Text size="sm" fw={600} c="white" style={{ opacity: 0.9 }}>
                Net-Worth Break-Even
              </Text>
            </Group>
            <Title order={1} c="white" fw={700}>
              {metrics.netWorthBreakEvenYear
                ? `${metrics.netWorthBreakEvenYear}`
                : "N/A"}
            </Title>
            <Text size="sm" c="white" style={{ opacity: 0.8 }}>
              {metrics.netWorthBreakEvenYear
                ? `years until owner wealth ≥ renter`
                : "No break-even in horizon"}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Net Worth Advantage at 10 years - Most Important */}
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <Paper
          p="xl"
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
          <Stack gap="xs">
            <Group gap="xs" mb="xs">
              <CurrencyDollar size={24} color="white" />
              <Text size="sm" fw={600} c="white" style={{ opacity: 0.9 }}>
                10-Year Advantage
              </Text>
            </Group>
            <Group gap="xs" align="center">
              <Title order={1} c="white" fw={700}>
                {formatCurrency(metrics.netWorthDelta10)}
              </Title>
              {getDeltaIcon(metrics.netWorthDelta10)}
            </Group>
            <Text size="sm" c="white" style={{ opacity: 0.8 }}>
              {metrics.netWorthDelta10 > 0
                ? "Owner advantage"
                : "Renter advantage"}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Total Cost Difference */}
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <Paper
          p="xl"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: GRADIENTS.neutral,
            border: "none",
          }}
        >
          <Stack gap="xs">
            <Group gap="xs" mb="xs">
              <CurrencyDollar size={24} color="white" />
              <Text size="sm" fw={600} c="white" style={{ opacity: 0.9 }}>
                Cost Difference (10yr)
              </Text>
            </Group>
            <Title order={1} c="white" fw={700}>
              {formatCurrency(
                metrics.totalUnrecoverableOwner10 -
                  metrics.totalUnrecoverableRenter10
              )}
            </Title>
            <Text size="sm" c="white" style={{ opacity: 0.8 }}>
              {metrics.totalUnrecoverableOwner10 >
              metrics.totalUnrecoverableRenter10
                ? "Owner pays more"
                : "Renter pays more"}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
