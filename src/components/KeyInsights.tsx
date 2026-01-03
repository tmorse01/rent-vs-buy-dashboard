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
      {/* Unrecoverable Costs - Combined */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
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
                Unrecoverable Costs (10yr)
              </Text>
            </Group>
            <Title order={1} c="white" fw={700}>
              {formatCurrency(Math.abs(unrecoverableDifference))}
            </Title>
            <Text size="sm" c="white" style={{ opacity: 0.8 }}>
              {unrecoverableDifference > 0
                ? "Owner pays more"
                : "Renter pays more"}
            </Text>
            <Stack gap={4} mt="xs">
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                Owner: {formatCurrency(unrecoverableOwner10)}
              </Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                Renter: {formatCurrency(unrecoverableRenter10)}
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Cash-Loss Break-Even */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
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

      {/* Net-Worth Break-Even */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
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
            <Group gap="xs" mb="xs" justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
                <Calendar size={24} color="white" />
                <Text size="sm" fw={600} c="white" style={{ opacity: 0.9 }}>
                  Net-Worth Break-Even
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
                    size="sm"
                    color="white"
                    style={{ opacity: 0.8 }}
                  >
                    <InfoCircle size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
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
            {!metrics.netWorthBreakEvenYear && (
              <Stack gap={4} mt="xs">
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                  Current gap:{" "}
                  {formatCurrency(Math.abs(metrics.netWorthDelta10))}
                </Text>
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                  Renter ahead at 10yr
                </Text>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Net Worth Advantage - Multi-timeframe */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
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
                Net Worth Advantage
              </Text>
            </Group>
            <Group gap="xs" align="center">
              <Title order={1} c="white" fw={700}>
                {formatCurrency(metrics.netWorthDelta10)}
              </Title>
              {getDeltaIcon(metrics.netWorthDelta10)}
            </Group>
            <Text size="sm" c="white" style={{ opacity: 0.8 }} mb="xs">
              {metrics.netWorthDelta10 > 0
                ? "Owner advantage (10yr)"
                : "Renter advantage (10yr)"}
            </Text>
            <Stack gap={4}>
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                5yr: {formatCurrency(metrics.netWorthDelta5)}
              </Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                15yr: {formatCurrency(metrics.netWorthDelta15)}
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
