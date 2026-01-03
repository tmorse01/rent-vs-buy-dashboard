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
import {
  formatCurrencyCompact,
  formatCurrencyTooltip,
} from "../../utils/formatting";
import type { TooltipProps } from "recharts";

interface MonthlyCostChartProps {
  timeline: TimelinePoint[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    name?: string;
    color?: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const theme = useMantineTheme();

  if (!active || !payload || !payload.length) return null;

  const ownerValue = payload.find((p) => p.dataKey === "owner")?.value || 0;
  const renterValue = payload.find((p) => p.dataKey === "renter")?.value || 0;
  const diff = ownerValue - renterValue;
  const diffText =
    diff > 0
      ? `Owner pays ${formatCurrencyTooltip(Math.abs(diff))} more`
      : `Renter pays ${formatCurrencyTooltip(Math.abs(diff))} more`;

  return (
    <div
      style={{
        backgroundColor: theme.white,
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        boxShadow: theme.shadows.sm,
      }}
    >
      <div style={{ marginBottom: "4px", fontWeight: "bold" }}>
        Year {label}
      </div>
      {payload.map((entry, index: number) => (
        <div key={index} style={{ color: entry.color, marginBottom: "2px" }}>
          {entry.name}: {formatCurrencyTooltip(entry.value || 0)}/month
        </div>
      ))}
      <div
        style={{
          marginTop: "4px",
          fontSize: "12px",
          opacity: 0.8,
          color: theme.colors.gray[7],
        }}
      >
        {diffText}
      </div>
    </div>
  );
}

export function MonthlyCostChart({ timeline }: MonthlyCostChartProps) {
  const theme = useMantineTheme();

  // Convert to yearly data for readability
  const yearlyData = [];

  for (let year = 1; year <= Math.ceil(timeline.length / 12); year++) {
    const month = year * 12;
    if (month > timeline.length) break;

    const point = timeline[month - 1];
    yearlyData.push({
      year,
      owner: Math.round(point.ownerUnrecoverableMonthly),
      renter: Math.round(point.rentMonthly),
    });
  }

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
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.colors.gray[2]}
            />
            <XAxis
              dataKey="year"
              label={{ value: "Years", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickFormatter={formatCurrencyCompact}
              label={{
                value: "Monthly Cost ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingBottom: "10px" }}
              iconType="line"
              iconSize={16}
              style={{ fontSize: "14px" }}
            />
            <Line
              type="monotone"
              dataKey="owner"
              stroke={theme.colors.blue[6]}
              name="Owner Monthly Costs"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="renter"
              stroke={theme.colors.cyan[6]}
              name="Renter Monthly Costs"
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
