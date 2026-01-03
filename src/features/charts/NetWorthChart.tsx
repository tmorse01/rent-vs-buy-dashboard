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
import { Paper, Title, Stack, Box, Text, useMantineTheme } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";

interface NetWorthChartProps {
  timeline: TimelinePoint[];
}

export function NetWorthChart({ timeline }: NetWorthChartProps) {
  const theme = useMantineTheme();
  
  // Convert to yearly data for readability
  const yearlyData = [];

  for (let year = 1; year <= Math.ceil(timeline.length / 12); year++) {
    const month = year * 12;
    if (month > timeline.length) break;

    const point = timeline[month - 1];
    yearlyData.push({
      year,
      owner: Math.round(point.ownerNetWorth),
      renter: Math.round(point.renterNetWorth),
    });
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="md">
        <Box>
          <Title order={4} mb="xs" fw={600}>
            Net Worth Over Time
          </Title>
          <Text size="sm" c="dimmed">
            Track how owner and renter net worth changes over the analysis
            period
          </Text>
        </Box>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.gray[2]} />
            <XAxis
              dataKey="year"
              label={{ value: "Years", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{
                value: "Net Worth ($)",
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
              stroke={theme.colors.blue[6]}
              name="Owner Net Worth"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="renter"
              stroke={theme.colors.cyan[6]}
              name="Renter Net Worth"
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
