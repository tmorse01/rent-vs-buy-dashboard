import { Grid, Paper, Text, Title, Group, Stack } from "@mantine/core";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CurrencyDollar,
} from "tabler-icons-react";
import type { Metrics } from "../features/scenario/ScenarioInputs";

interface KeyInsightsProps {
  metrics: Metrics;
}

export function KeyInsights({ metrics }: KeyInsightsProps) {
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const getDeltaIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={20} />;
    if (value < 0) return <TrendingDown size={20} />;
    return null;
  };

  return (
    <Grid gutter="md">
      {/* Break-Even Metrics */}
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <Paper
          p="xl"
          withBorder
          radius="md"
          style={{
            height: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
                : "No break-even found"}
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
                ? "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
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
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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
