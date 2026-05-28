import { AreaChart, CompositeChart } from "@mantine/charts";
import {
  Paper,
  Title,
  Stack,
  Box,
  Text,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { useMemo, useState } from "react";
import type {
  ScenarioInputs,
  TimelinePoint,
} from "../scenario/ScenarioInputs";
import {
  buildYearlyWealthBreakdown,
  computeHorizonWealthBreakdown,
} from "../../calculations/wealthBreakdown";
import { InsightPill } from "../../components/InsightPill";
import {
  formatCurrency,
  formatCurrencyTooltip,
  formatPercent,
} from "../../utils/formatting";

type WealthView = "netWorth" | "drivers";

interface WealthOverTimeChartProps {
  timeline: TimelinePoint[];
  inputs: ScenarioInputs;
  chartHeight?: number;
}

export function WealthOverTimeChart({
  timeline,
  inputs,
  chartHeight = 360,
}: WealthOverTimeChartProps) {
  const [view, setView] = useState<WealthView>("netWorth");

  const lastPoint = timeline[timeline.length - 1];
  const horizonYears = lastPoint?.year ?? 0;
  const ownerNetWorth = lastPoint?.ownerNetWorth ?? 0;
  const renterNetWorth = lastPoint?.renterNetWorth ?? 0;
  const netWorthDelta = ownerNetWorth - renterNetWorth;
  const scenarioLeader =
    netWorthDelta > 0 ? "Buy" : netWorthDelta < 0 ? "Rent" : "Tie";

  const netWorthYearlyData = useMemo(() => {
    const rows: { year: string; owner: number; renter: number }[] = [];
    const maxYear = Math.ceil(timeline.length / 12);

    for (let year = 1; year <= maxYear; year++) {
      const month = year * 12;
      if (month > timeline.length) break;
      const point = timeline[month - 1];
      rows.push({
        year: `Year ${year}`,
        owner: Math.round(point.ownerNetWorth),
        renter: Math.round(point.renterNetWorth),
      });
    }
    return rows;
  }, [timeline]);

  const driversYearlyData = useMemo(
    () =>
      buildYearlyWealthBreakdown(timeline, inputs).map((row) => ({
        year: `Year ${row.year}`,
        netAppreciation: Math.round(Math.max(0, row.netAppreciation)),
        principalPaid: Math.round(row.principalPaid),
        portfolioGrowth: Math.round(Math.max(0, row.portfolioGrowth)),
      })),
    [timeline, inputs],
  );

  const horizon = useMemo(
    () => computeHorizonWealthBreakdown(timeline, inputs),
    [timeline, inputs],
  );

  if (netWorthYearlyData.length === 0) {
    return null;
  }

  const buyLeads =
    horizon !== null && horizon.ownerNetWorth > horizon.renterNetWorth;
  const appreciationDominates =
    buyLeads &&
    horizon !== null &&
    horizon.appreciationSharePercent !== null &&
    horizon.appreciationSharePercent > 50;

  const netWorthLine2 =
    scenarioLeader === "Tie"
      ? `At ${horizonYears}y, net worth delta is ${formatCurrency(netWorthDelta)} (essentially tied).`
      : `At ${horizonYears}y, net worth delta is ${formatCurrency(netWorthDelta)} (${scenarioLeader === "Buy" ? "Buying" : "Renting"} ahead).`;

  const driversLine2 =
    horizon && horizon.appreciationSharePercent !== null
      ? `At ${horizon.horizonYears}y, appreciation is ${formatPercent(horizon.appreciationSharePercent, 0)} of owner equity gains (${formatCurrency(horizon.ownerEquityGain)}).${appreciationDominates ? " Appreciation leads." : ""}`
      : horizon
        ? `At ${horizon.horizonYears}y, owner equity gains total ${formatCurrency(horizon.ownerEquityGain)}.`
        : "\u00A0";

  const subtitle = (
    <Stack
      gap={4}
      style={{ minHeight: "4.5rem" }}
      aria-live="polite"
    >
      <Text size="sm" c="dimmed" lh={1.45}>
        {view === "netWorth"
          ? `Compare total net worth: owner home equity vs. renter investments over ${horizonYears} years.`
          : `How wealth builds: owner appreciation and principal vs. renter portfolio at ${formatPercent(inputs.annualAppreciationRate, 1)} appreciation and ${formatPercent(inputs.annualReturnRate, 1)} returns.`}
      </Text>
      <Text size="sm" c="dimmed" lh={1.45}>
        {view === "netWorth"
          ? netWorthLine2
          : driversLine2}
      </Text>
    </Stack>
  );

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
          <Group justify="space-between" align="flex-start" mb="xs" wrap="wrap">
            <Title order={4} fw={600}>
              Wealth over time
            </Title>
            <InsightPill variant="positive" size="leader">
              Leader · {scenarioLeader}
            </InsightPill>
          </Group>
          <SegmentedControl
            value={view}
            onChange={(v) => setView(v as WealthView)}
            data={[
              { label: "Net worth", value: "netWorth" },
              { label: "How wealth builds", value: "drivers" },
            ]}
            mb="sm"
            fullWidth
          />
          {subtitle}
        </Box>
        <Box style={{ width: "100%", height: chartHeight }}>
          {view === "netWorth" ? (
            <AreaChart
              w="100%"
              h={chartHeight}
              data={netWorthYearlyData}
              dataKey="year"
              series={[
                { name: "owner", color: "blue.6", label: "Owner net worth" },
                { name: "renter", color: "cyan.6", label: "Renter net worth" },
              ]}
              curveType="linear"
              withLegend
              withTooltip
              withDots
              withXAxis
              withYAxis
              yAxisProps={{
                tickFormatter: (value) => `$${value.toLocaleString()}`,
              }}
              fillOpacity={0.4}
              valueFormatter={(value: number) => formatCurrencyTooltip(value)}
              tooltipAnimationDuration={200}
            />
          ) : (
            <CompositeChart
              w="100%"
              h={chartHeight}
              data={driversYearlyData}
              dataKey="year"
              withLegend
              withTooltip
              withDots={false}
              withXAxis
              withYAxis
              yAxisProps={{
                tickFormatter: (value) => `$${value.toLocaleString()}`,
              }}
              valueFormatter={(value: number) => formatCurrencyTooltip(value)}
              tooltipAnimationDuration={200}
              series={[
                {
                  name: "netAppreciation",
                  label: "Net appreciation",
                  color: "green.6",
                  type: "area",
                },
                {
                  name: "principalPaid",
                  label: "Principal paid",
                  color: "blue.6",
                  type: "area",
                },
                {
                  name: "portfolioGrowth",
                  label: "Portfolio growth",
                  color: "cyan.6",
                  type: "line",
                },
              ]}
              areaProps={{ stackId: "owner" }}
            />
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
