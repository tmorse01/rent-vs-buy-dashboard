import { AreaChart } from "@mantine/charts";
import { Paper, Title, Stack, Box, Text, Group, Badge } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";
import { formatCurrency, formatCurrencyTooltip } from "../../utils/formatting";

interface NetWorthChartProps {
  timeline: TimelinePoint[];
}

export function NetWorthChart({ timeline }: NetWorthChartProps) {
  const lastPoint = timeline[timeline.length - 1];
  const horizonYears = lastPoint?.year ?? 0;
  const ownerNetWorth = lastPoint?.ownerNetWorth ?? 0;
  const renterNetWorth = lastPoint?.renterNetWorth ?? 0;
  const netWorthDelta = ownerNetWorth - renterNetWorth;
  const scenarioLeader =
    netWorthDelta > 0 ? "Buy" : netWorthDelta < 0 ? "Rent" : "Tie";

  // Convert to yearly data for readability
  const yearlyData = [];
  const maxYear = Math.ceil(timeline.length / 12);

  for (let year = 1; year <= maxYear; year++) {
    const month = year * 12;
    if (month > timeline.length) break;

    const point = timeline[month - 1];
    yearlyData.push({
      year: `Year ${year}`,
      owner: Math.round(point.ownerNetWorth),
      renter: Math.round(point.renterNetWorth),
    });
  }

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="md">
        <Box>
          <Group justify="space-between" align="center" mb="xs">
            <Title order={4} fw={600}>
              Net Worth Over Time
            </Title>
            <Badge
              color={
                scenarioLeader === "Buy"
                  ? "blue"
                  : scenarioLeader === "Rent"
                    ? "cyan"
                    : "gray"
              }
            >
              Leader: {scenarioLeader}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Final ({horizonYears}y) net worth delta:{" "}
            {formatCurrency(netWorthDelta)}
          </Text>
        </Box>
        <Box style={{ width: "100%", height: 400 }}>
          <AreaChart
            w="100%"
            h={400}
            data={yearlyData}
            dataKey="year"
            series={[
              { name: "owner", color: "blue.6", label: "Owner Net Worth" },
              { name: "renter", color: "cyan.6", label: "Renter Net Worth" },
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
            tooltipProps={{
              cursor: { stroke: "blue", strokeWidth: 1 },
            }}
            tooltipAnimationDuration={200}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
