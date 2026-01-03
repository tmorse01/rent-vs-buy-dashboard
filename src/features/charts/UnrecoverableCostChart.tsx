import { LineChart } from "@mantine/charts";
import { Paper, Title, Stack, Box, Text } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";

interface UnrecoverableCostChartProps {
  timeline: TimelinePoint[];
}

export function UnrecoverableCostChart({
  timeline,
}: UnrecoverableCostChartProps) {
  // Calculate average monthly unrecoverable cost per year
  const yearlyData = [];

  for (let year = 1; year <= Math.ceil(timeline.length / 12); year++) {
    const yearStartMonth = (year - 1) * 12;
    const yearEndMonth = Math.min(year * 12, timeline.length);
    const yearPoints = timeline.slice(yearStartMonth, yearEndMonth);

    if (yearPoints.length === 0) continue;

    const avgOwner =
      yearPoints.reduce((sum, p) => sum + p.ownerUnrecoverableMonthly, 0) /
      yearPoints.length;
    const avgRenter =
      yearPoints.reduce((sum, p) => sum + p.rentMonthly, 0) / yearPoints.length;

    yearlyData.push({
      year: `Year ${year}`,
      owner: Math.round(avgOwner),
      renter: Math.round(avgRenter),
    });
  }

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="md">
        <Box>
          <Title order={4} mb="xs" fw={600} style={{ wordBreak: "break-word" }}>
            Average Monthly Unrecoverable Cost
          </Title>
          <Text size="sm" c="dimmed" style={{ wordBreak: "break-word" }}>
            Compare owner's monthly unrecoverable costs vs renter's monthly rent
            over time
          </Text>
        </Box>
        <Box style={{ width: "100%", height: 400 }}>
          <LineChart
            w="100%"
            h={400}
            data={yearlyData}
            dataKey="year"
            series={[
              {
                name: "owner",
                color: "blue.6",
                label: "Owner Monthly Costs",
              },
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
            valueFormatter={(value: number) =>
              value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }
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
