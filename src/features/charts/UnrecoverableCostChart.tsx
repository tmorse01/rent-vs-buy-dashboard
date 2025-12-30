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
import { Paper, Title } from "@mantine/core";
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
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        Avg Monthly Unrecoverable Cost vs Years
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
            name="Owner (Avg Monthly)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="renter"
            stroke="#fa5252"
            name="Renter (Avg Monthly)"
            strokeWidth={2}
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
    </Paper>
  );
}
