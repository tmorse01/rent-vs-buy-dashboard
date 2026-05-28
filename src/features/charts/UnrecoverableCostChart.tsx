import { BarChart } from "@mantine/charts";
import { Paper, Title, Stack, Box, Text } from "@mantine/core";
import { useMemo } from "react";
import type { TimelinePoint } from "../scenario/ScenarioInputs";
import {
  buildHorizonUnrecoverableBarData,
  computeHorizonUnrecoverableStacks,
} from "../../calculations/unrecoverableBreakdown";
import { formatCurrency, formatCurrencyTooltip } from "../../utils/formatting";
import { COLORS } from "../../theme/colors";

const { ownerUnrecoverable: BUY } = COLORS.chart;

const STACK_SERIES = [
  {
    name: "mortgageInterest",
    label: "Mortgage interest",
    color: BUY.mortgageInterest,
  },
  { name: "propertyTax", label: "Property tax", color: BUY.propertyTax },
  { name: "insurance", label: "Insurance", color: BUY.insurance },
  { name: "maintenance", label: "Maintenance", color: BUY.maintenance },
  { name: "pmi", label: "PMI", color: BUY.pmi },
  { name: "rent", label: "Rent", color: BUY.rent },
] as const;

interface UnrecoverableCostChartProps {
  timeline: TimelinePoint[];
  mortgageInterestTaxDeductionEnabled?: boolean;
  houseHackEnabled?: boolean;
  rentalDepreciationTaxBenefitEnabled?: boolean;
  chartHeight?: number;
}

export function UnrecoverableCostChart({
  timeline,
  mortgageInterestTaxDeductionEnabled = false,
  houseHackEnabled = false,
  rentalDepreciationTaxBenefitEnabled = false,
  chartHeight = 400,
}: UnrecoverableCostChartProps) {
  const stacks = useMemo(
    () => computeHorizonUnrecoverableStacks(timeline),
    [timeline],
  );

  const chartData = useMemo(
    () => (stacks ? buildHorizonUnrecoverableBarData(stacks) : []),
    [stacks],
  );

  if (!stacks || chartData.length === 0) {
    return null;
  }

  const difference = stacks.ownerTotal - stacks.renterRent;

  const taxNote =
    mortgageInterestTaxDeductionEnabled ||
    houseHackEnabled ||
    rentalDepreciationTaxBenefitEnabled
      ? " Buying stack shows gross cost components; modeled tax offsets and rental income reduce counted owner unrecoverable totals elsewhere."
      : "";

  return (
    <Paper
      p="xl"
      withBorder
      radius="md"
      shadow="sm"
      style={{ width: "100%", height: "100%" }}
    >
      <Stack gap="md">
        <Box style={{ wordBreak: "break-word" }}>
          <Title order={4} mb="xs" fw={600}>
            Cumulative unrecoverable spend
          </Title>
          <Text size="sm" c="dimmed">
            Total cash that does not build equity over {stacks.horizonYears}{" "}
            years—stacked bars for buying vs. renting.
            {taxNote}
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Buying (counted total {formatCurrency(stacks.ownerTotal)}) vs.
            renting ({formatCurrency(stacks.renterRent)})
            {difference === 0
              ? " — tied."
              : difference > 0
                ? ` — buying paid ${formatCurrency(difference)} more.`
                : ` — renting paid ${formatCurrency(Math.abs(difference))} more.`}
          </Text>
        </Box>
        <Box style={{ width: "100%", height: chartHeight }}>
          <BarChart
            w="100%"
            h={chartHeight}
            data={chartData}
            dataKey="side"
            type="stacked"
            series={[...STACK_SERIES]}
            withLegend
            withTooltip
            withXAxis
            withYAxis
            yAxisProps={{
              tickFormatter: (value) => `$${value.toLocaleString()}`,
            }}
            valueFormatter={(value: number) => formatCurrencyTooltip(value)}
            tooltipAnimationDuration={200}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
