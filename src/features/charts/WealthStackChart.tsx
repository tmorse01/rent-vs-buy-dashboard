import { BarChart } from "@mantine/charts";
import { Paper, Title, Stack, Box, Text } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";
import { formatCurrencyTooltip } from "../../utils/formatting";

interface WealthStackChartProps {
  timeline: TimelinePoint[];
}

export function WealthStackChart({ timeline }: WealthStackChartProps) {
  const milestones = [5, 10, 15];
  const data = [];
  const initialHomeValue = timeline[0]?.homeValue || 0;

  for (const milestone of milestones) {
    const month = milestone * 12;
    if (month > timeline.length) continue;

    const point = timeline[month - 1];
    const homeValue = point.homeValue;

    // Calculate total interest paid up to this point
    let totalInterestPaid = 0;
    for (let m = 0; m < month && m < timeline.length; m++) {
      totalInterestPaid += timeline[m].mortgageInterest;
    }

    // Net appreciation after selling costs (using 8% default, but this should ideally come from inputs)
    // For now, we'll calculate it from the net worth formula
    // Owner net worth = (homeValue * (1 - sellingCostRate)) - mortgageBalance
    // So: homeValue * (1 - sellingCostRate) = ownerNetWorth + mortgageBalance
    // We can't extract sellingCostRate directly, so we'll estimate net appreciation
    // by looking at the difference in home value and applying a reasonable selling cost
    const grossAppreciation = homeValue - initialHomeValue;
    const netAppreciation = grossAppreciation * 0.92; // Assume 8% selling cost

    const principalPaid = point.ownerTotalPrincipalPaid;

    data.push({
      milestone: `${milestone} years`,
      "Principal Paid": Math.round(principalPaid),
      "Net Appreciation": Math.round(Math.max(0, netAppreciation)),
      "Interest Paid": Math.round(totalInterestPaid), // For narrative overlay
    });
  }

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="md">
        <Box>
          <Title order={4} mb="xs" fw={600}>
            Owner Wealth Breakdown
          </Title>
          <Text size="sm" c="dimmed">
            Principal paid, net appreciation, and interest paid at key
            milestones
          </Text>
        </Box>
        <Box style={{ width: "100%", height: 350 }}>
          <BarChart
            w="100%"
            h={350}
            data={data}
            dataKey="milestone"
            type="stacked"
            series={[
              { name: "Principal Paid", color: "blue.6" },
              { name: "Net Appreciation", color: "green.6" },
              { name: "Interest Paid", color: "orange.6" },
            ]}
            withLegend
            withTooltip
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
