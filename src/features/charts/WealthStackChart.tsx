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
import { Paper, Title } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";

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
      year: `${milestone} years`,
      principalPaid: Math.round(principalPaid),
      netAppreciation: Math.round(Math.max(0, netAppreciation)),
      interestPaid: Math.round(totalInterestPaid), // For narrative overlay
    });
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const COLORS = ["#228be6", "#51cf66", "#ffd43b"];

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        Owner Wealth Stack at 5/10/15 Years
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={formatCurrency} />
          <YAxis dataKey="year" type="category" width={80} />
          <Tooltip
            formatter={(value: number | undefined) =>
              formatCurrency(value ?? 0)
            }
          />
          <Legend />
          <Bar
            dataKey="principalPaid"
            stackId="wealth"
            fill={COLORS[0]}
            name="Principal Paid"
          />
          <Bar
            dataKey="netAppreciation"
            stackId="wealth"
            fill={COLORS[1]}
            name="Net Appreciation (after selling costs)"
          />
          <Bar
            dataKey="interestPaid"
            stackId="narrative"
            fill={COLORS[2]}
            name="Interest Paid (not part of net worth)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
