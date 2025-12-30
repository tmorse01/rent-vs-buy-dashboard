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
import { Paper, Title } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";

interface NetWorthChartProps {
  timeline: TimelinePoint[];
}

export function NetWorthChart({ timeline }: NetWorthChartProps) {
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
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        Net Worth Over Time
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={yearlyData}>
          <CartesianGrid strokeDasharray="3 3" />
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
          <Legend />
          <Line
            type="monotone"
            dataKey="owner"
            stroke="#51cf66"
            name="Owner Net Worth"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="renter"
            stroke="#ffd43b"
            name="Renter Net Worth"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
