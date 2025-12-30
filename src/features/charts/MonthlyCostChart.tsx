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
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        Monthly Cost Over Time
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
          <Legend />
          <Line
            type="monotone"
            dataKey="owner"
            stroke="#228be6"
            name="Owner Unrecoverable"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="rent"
            stroke="#fa5252"
            name="Rent"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
