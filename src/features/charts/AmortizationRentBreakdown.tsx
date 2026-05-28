import { LineChart } from "@mantine/charts";
import {
  Paper,
  Title,
  Stack,
  Box,
  Text,
  SegmentedControl,
  ScrollArea,
  Table,
} from "@mantine/core";
import { useMemo, useState } from "react";
import type { TimelinePoint } from "../scenario/ScenarioInputs";
import { formatCurrencyTooltip } from "../../utils/formatting";
import { useThemeColors } from "../../theme/useThemeColors";

interface AmortizationRentBreakdownProps {
  timeline: TimelinePoint[];
}

function formatTableCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function AmortizationRentBreakdown({
  timeline,
}: AmortizationRentBreakdownProps) {
  const { data: dataColors } = useThemeColors();
  const [view, setView] = useState<"chart" | "schedule">("chart");

  const yearlyChartData = useMemo(() => {
    const rows: {
      year: string;
      principal: number;
      interest: number;
      rent: number;
    }[] = [];

    for (let year = 1; year <= Math.ceil(timeline.length / 12); year++) {
      const yearStartMonth = (year - 1) * 12;
      const yearEndMonth = Math.min(year * 12, timeline.length);
      const yearPoints = timeline.slice(yearStartMonth, yearEndMonth);

      if (yearPoints.length === 0) continue;

      const avgPrincipal =
        yearPoints.reduce((sum, p) => sum + p.mortgagePrincipal, 0) /
        yearPoints.length;
      const avgInterest =
        yearPoints.reduce((sum, p) => sum + p.mortgageInterest, 0) /
        yearPoints.length;
      const avgRent =
        yearPoints.reduce((sum, p) => sum + p.rentMonthly, 0) /
        yearPoints.length;

      rows.push({
        year: `Year ${year}`,
        principal: Math.round(avgPrincipal),
        interest: Math.round(avgInterest),
        rent: Math.round(avgRent),
      });
    }

    return rows;
  }, [timeline]);

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="md">
        <Box>
          <Title order={4} mb="xs" fw={600} style={{ wordBreak: "break-word" }}>
            Monthly principal, interest & rent
          </Title>
          <Text size="sm" c="dimmed" style={{ wordBreak: "break-word" }}>
            Principal builds equity. Interest and rent are unrecoverable costs.
            The chart shows each year&apos;s average monthly amounts; the
            schedule lists every month in your horizon.
          </Text>
        </Box>

        <SegmentedControl
          fullWidth
          value={view}
          onChange={(v) => setView(v as "chart" | "schedule")}
          data={[
            { label: "Chart", value: "chart" },
            { label: "Schedule", value: "schedule" },
          ]}
        />

        {view === "chart" ? (
          <Box style={{ width: "100%", height: 400 }}>
            <LineChart
              w="100%"
              h={400}
              data={yearlyChartData}
              dataKey="year"
              series={[
                {
                  name: "principal",
                  color: "blue.6",
                  label: "Principal (equity)",
                },
                {
                  name: "interest",
                  color: "orange.6",
                  label: "Interest (unrecoverable)",
                },
                {
                  name: "rent",
                  color: "cyan.6",
                  label: "Rent (unrecoverable)",
                },
              ]}
              curveType="linear"
              withLegend
              withTooltip
              withDots
              withXAxis
              withYAxis
              yAxisProps={{
                tickFormatter: (value) => `$${value.toLocaleString()}`,
              }}
              valueFormatter={(value: number) => formatCurrencyTooltip(value)}
              tooltipProps={{
                cursor: { stroke: dataColors.owner, strokeWidth: 1 },
              }}
              tooltipAnimationDuration={200}
            />
          </Box>
        ) : (
          <ScrollArea h={440} type="auto" offsetScrollbars>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Month</Table.Th>
                  <Table.Th>Year</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Principal</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Interest</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Rent</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>
                    Loan balance
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {timeline.map((point) => (
                  <Table.Tr key={point.month}>
                    <Table.Td>{point.month}</Table.Td>
                    <Table.Td>{point.year}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {formatTableCurrency(point.mortgagePrincipal)}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {formatTableCurrency(point.mortgageInterest)}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {formatTableCurrency(point.rentMonthly)}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {formatTableCurrency(point.mortgageBalance)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Stack>
    </Paper>
  );
}
