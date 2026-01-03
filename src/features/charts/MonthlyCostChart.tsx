import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Title, Stack, Box, Text } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";

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
      year,
      owner: Math.round(point.ownerUnrecoverableMonthly),
      rent: Math.round(point.rentMonthly),
    });
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

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
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: "Years", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{
                value: "Monthly Cost ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value: number | undefined) =>
                formatCurrency(value ?? 0)
              }
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="owner"
              stroke="#228be6"
              name="Owner Monthly Costs"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="rent"
              stroke="#fa5252"
              name="Renter Monthly Rent"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
