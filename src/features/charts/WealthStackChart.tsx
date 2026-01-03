import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Title, Stack, Box, Text, useMantineTheme } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";
import { COLORS } from "../../theme/colors";
import {
  formatCurrencyCompact,
  formatCurrencyTooltip,
} from "../../utils/formatting";

interface WealthStackChartProps {
  timeline: TimelinePoint[];
}

export function WealthStackChart({ timeline }: WealthStackChartProps) {
  const theme = useMantineTheme();
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
      year: `${milestone} years`,
      principalPaid: Math.round(principalPaid),
      netAppreciation: Math.round(Math.max(0, netAppreciation)),
      interestPaid: Math.round(totalInterestPaid), // For narrative overlay
    });
  }

  const formatTooltip = (value: number | undefined, name?: string) => {
    if (value === undefined) return "";
    return [formatCurrencyTooltip(value), name || ""];
  };

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
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.colors.gray[2]}
            />
            <XAxis
              type="number"
              tickFormatter={formatCurrencyCompact}
              label={{
                value: "Amount ($)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis dataKey="year" type="category" width={80} />
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: theme.white,
                border: `1px solid ${theme.colors.gray[3]}`,
                borderRadius: theme.radius.md,
              }}
            />
            <Legend
              wrapperStyle={{ paddingBottom: "10px" }}
              iconSize={16}
              style={{ fontSize: "14px" }}
            />
            <Bar
              dataKey="principalPaid"
              stackId="wealth"
              fill={COLORS.owner.primary}
              name="Principal Paid"
            />
            <Bar
              dataKey="netAppreciation"
              stackId="wealth"
              fill={COLORS.success.primary}
              name="Net Appreciation (after selling costs)"
            />
            <Bar
              dataKey="interestPaid"
              stackId="narrative"
              fill={COLORS.warning.primary}
              name="Interest Paid (not part of net worth)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
