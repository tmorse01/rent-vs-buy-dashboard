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
import { Paper, Title, Stack, Box, Text, useMantineTheme } from "@mantine/core";
import type { TimelinePoint } from "../scenario/ScenarioInputs";
import {
  formatCurrencyCompact,
  formatCurrencyTooltip,
} from "../../utils/formatting";
import type { TooltipProps } from "recharts";

interface UnrecoverableCostChartProps {
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

export function UnrecoverableCostChart({
  timeline,
}: UnrecoverableCostChartProps) {
  const theme = useMantineTheme();

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

  const maxYear = Math.ceil(timeline.length / 12);

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
            {maxYear >= 5 && (
              <ReferenceLine
                x={5}
                stroke={theme.colors.gray[5]}
                strokeDasharray="3 3"
                label={{
                  value: "5 years",
                  position: "top",
                  fill: theme.colors.gray[7],
                }}
              />
            )}
            {maxYear >= 10 && (
              <ReferenceLine
                x={10}
                stroke={theme.colors.gray[5]}
                strokeDasharray="3 3"
                label={{
                  value: "10 years",
                  position: "top",
                  fill: theme.colors.gray[7],
                }}
              />
            )}
            {maxYear >= 15 && (
              <ReferenceLine
                x={15}
                stroke={theme.colors.gray[5]}
                strokeDasharray="3 3"
                label={{
                  value: "15 years",
                  position: "top",
                  fill: theme.colors.gray[7],
                }}
              />
            )}
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
