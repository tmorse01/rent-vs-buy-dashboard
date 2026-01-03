import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
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
      year,
      owner: Math.round(avgOwner),
      renter: Math.round(avgRenter),
    });
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

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
        <ResponsiveContainer width="100%" height={400}>
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
              dataKey="renter"
              stroke="#fa5252"
              name="Renter Monthly Costs"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <ReferenceLine
              x={5}
              stroke="#868e96"
              strokeDasharray="3 3"
              label={{ value: "5 years", position: "top" }}
            />
            <ReferenceLine
              x={10}
              stroke="#868e96"
              strokeDasharray="3 3"
              label={{ value: "10 years", position: "top" }}
            />
            <ReferenceLine
              x={15}
              stroke="#868e96"
              strokeDasharray="3 3"
              label={{ value: "15 years", position: "top" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
