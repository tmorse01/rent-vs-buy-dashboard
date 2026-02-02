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
import { useAppTheme } from "../theme/useAppTheme";
import { formatCurrency } from "../utils/formatting";
import { ColorAccentCard } from "./ColorAccentCard";

interface KeyInsightsProps {
  metrics: Metrics;
  timeline: TimelinePoint[];
}

export function KeyInsights({ metrics, timeline }: KeyInsightsProps) {
  const { theme, gradients, palette, shadows, borders } = useAppTheme();
  const { negativeAccent } = palette;
  const metricPillStyle = {
    color: theme.colors.dark[9],
    background: theme.white,
    padding: "6px 10px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    boxShadow: shadows.pill,
  } as const;
  const negativeMetricPillStyle = {
    ...metricPillStyle,
    color: theme.white,
    background: negativeAccent,
    boxShadow: shadows.pillNegative,
  } as const;

  const getDeltaIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={20} color={theme.white} />;
    if (value < 0)
      return <TrendingDown size={20} color={theme.colors.red[3]} />;
    return null;
  };

  const lastPoint = timeline[timeline.length - 1];
  const horizonYears = lastPoint?.year ?? 0;
  const ownerNetWorth = lastPoint?.ownerNetWorth ?? 0;
  const renterNetWorth = lastPoint?.renterNetWorth ?? 0;
  const netWorthDelta = ownerNetWorth - renterNetWorth;
  const unrecoverableOwner = lastPoint?.ownerTotalUnrecoverable ?? 0;
  const unrecoverableRenter = lastPoint?.renterTotalUnrecoverable ?? 0;
  const unrecoverableDifference = unrecoverableOwner - unrecoverableRenter;
  const scenarioLeader =
    netWorthDelta > 0 ? "Buy" : netWorthDelta < 0 ? "Rent" : "Tie";

  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard
          p="lg"
          radius="md"
          backgroundGradient={gradients.owner}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <TrendingUp size={18} />
                <Text size="lg" fw={700}>
                  Scenario Leader
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs">
                      The leading scenario is based on total net worth at the
                      end of the analysis horizon.
                    </Text>
                    <Text size="xs" mt={4} style={{ opacity: 0.9 }}>
                      A positive net worth delta favors buying, while a negative
                      delta favors renting.
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
              <span style={metricPillStyle}>{scenarioLeader}</span>
            </Title>
            <Text size="xs" fw={500} c="dimmed">
              Horizon: {horizonYears} years
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: borders.subtleLight,
                paddingTop: "12px",
              }}
            >
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Net worth gap
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(Math.abs(netWorthDelta))}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Owner
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(ownerNetWorth)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Renter
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(renterNetWorth)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </ColorAccentCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard
          p="lg"
          radius="md"
          backgroundGradient={gradients.purple}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <CurrencyDollar size={18} />
                <Text size="lg" fw={700}>
                  Net Worth Comparison
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs">
                      Net worth at the end of {horizonYears} years compares the
                      owner's equity and appreciation to the renter's investment
                      balance.
                    </Text>
                    <Text size="xs" mt={4} style={{ opacity: 0.9 }}>
                      Positive values favor buying; negative values favor
                      renting.
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
                  color: theme.white,
                }}
              >
                {netWorthDelta < 0 ? (
                  <span style={negativeMetricPillStyle}>
                    {formatCurrency(netWorthDelta)}
                  </span>
                ) : (
                  <span style={metricPillStyle}>
                    {formatCurrency(netWorthDelta)}
                  </span>
                )}
              </Title>
              {getDeltaIcon(netWorthDelta)}
            </Group>
            <Text size="xs" fw={500} c="dimmed">
              {netWorthDelta > 0
                ? "Owner advantage"
                : netWorthDelta < 0
                  ? "Renter advantage"
                  : "Even"}
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: borders.subtleLight,
                paddingTop: "12px",
              }}
            >
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Owner NW
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(ownerNetWorth)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Renter NW
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(renterNetWorth)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </ColorAccentCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard
          p="lg"
          radius="md"
          backgroundGradient={gradients.warning}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <AlertTriangle size={18} />
                <Text size="lg" fw={700}>
                  Unrecoverable Costs
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 320 }}>
                    <Text size="xs">
                      Unrecoverable costs include interest, taxes, insurance,
                      maintenance, and rent. Lower totals indicate the cheaper
                      cash-loss path over the full horizon.
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
                color: theme.white,
              }}
            >
              {unrecoverableDifference > 0 ? (
                <span style={negativeMetricPillStyle}>
                  {formatCurrency(Math.abs(unrecoverableDifference))}
                </span>
              ) : (
                <span style={metricPillStyle}>
                  {formatCurrency(Math.abs(unrecoverableDifference))}
                </span>
              )}
            </Title>
            <Text size="xs" fw={500} c="dimmed">
              {unrecoverableDifference > 0
                ? "Owner pays more"
                : "Renter pays more"}
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: borders.subtleLight,
                paddingTop: "12px",
              }}
            >
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Owner
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(unrecoverableOwner)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Renter
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(unrecoverableRenter)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </ColorAccentCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <ColorAccentCard p="lg" radius="md" backgroundGradient={gradients.teal}>
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <Calendar size={18} />
                <Text size="lg" fw={700}>
                  Break-Even Point
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs">
                      Cash-flow break-even is when owner unrecoverable costs are
                      less than or equal to rent. Net worth break-even is when
                      owner net worth exceeds renter net worth.
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
            <Stack gap="md">
              <div
                style={{
                  borderBottom: borders.subtleLight,
                  paddingBottom: "12px",
                }}
              >
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Cash Flow
                </Text>
                <Title order={3} fw={700} style={{ lineHeight: 1.1 }}>
                  <span style={metricPillStyle}>
                    {metrics.cashLossBreakEvenYear
                      ? `${metrics.cashLossBreakEvenYear} years`
                      : "N/A"}
                  </span>
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
                  <span style={metricPillStyle}>
                    {metrics.netWorthBreakEvenYear
                      ? `${metrics.netWorthBreakEvenYear} years`
                      : "N/A"}
                  </span>
                </Title>
                <Text size="xs" c="dimmed" mt={2}>
                  {metrics.netWorthBreakEvenYear
                    ? "Owner wealth ≥ renter"
                    : "No break-even in horizon"}
                </Text>
                {!metrics.netWorthBreakEvenYear && (
                  <Text size="xs" c="dimmed" style={{ opacity: 0.8 }} mt={4}>
                    Gap: {formatCurrency(Math.abs(netWorthDelta))}
                  </Text>
                )}
              </div>
            </Stack>
          </Stack>
        </ColorAccentCard>
      </Grid.Col>
    </Grid>
  );
}
