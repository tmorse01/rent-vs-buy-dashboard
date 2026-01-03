import { LineChart } from "@mantine/charts";
import { Paper, Title, Stack, Box, Text } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";
import { formatCurrencyTooltip } from "../../utils/formatting";

interface MonthlyCostChartProps {
  timeline: TimelinePoint[];
}

export function MonthlyCostChart({ timeline }: MonthlyCostChartProps) {
  // Convert to yearly data for readability
  const yearlyData = [];

  for (let year = 1; year <= Math.ceil(timeline.length / 12); year++) {
    const month = year * 12;
    if (month > timeline.length) break;

    const point = timeline[month - 1];
    yearlyData.push({
      year: `Year ${year}`,
      owner: Math.round(point.ownerUnrecoverableMonthly),
      renter: Math.round(point.rentMonthly),
    });
  }

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="md">
        <Box>
          <Title order={4} mb="xs" fw={600}>
            Monthly Cost Comparison
          </Title>
          <Text size="sm" c="dimmed">
            Owner's monthly unrecoverable costs vs renter's monthly rent
          </Text>
        </Box>
        <Box style={{ width: "100%", height: 350 }}>
          <LineChart
            w="100%"
            h={350}
            data={yearlyData}
            dataKey="year"
            series={[
              { name: "owner", color: "blue.6", label: "Owner Monthly Costs" },
              {
                name: "renter",
                color: "cyan.6",
                label: "Renter Monthly Costs",
              },
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
