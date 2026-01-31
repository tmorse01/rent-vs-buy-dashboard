import {
  Paper,
  Title,
  Text,
  Stack,
  Table,
  Group,
  Box,
  Tooltip,
  Divider,
} from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";
import type {
  TimelinePoint,
  ScenarioInputs,
} from "../features/scenario/ScenarioInputs";
import { formatCurrency } from "../utils/formatting";

interface NetWorthStackComparisonProps {
  timeline: TimelinePoint[];
  inputs: ScenarioInputs;
}

export function NetWorthStackComparison({
  timeline,
  inputs,
}: NetWorthStackComparisonProps) {
  const horizonMonths = timeline.length;
  if (horizonMonths === 0) {
    return null; // Not enough data
  }

  const point = timeline[horizonMonths - 1];
  const horizonYears = point.year;
  const homeValue = point.homeValue;
  const downPaymentAmount =
    inputs.homePrice * (inputs.downPaymentPercent / 100);

  // Calculate net appreciation (after selling costs)
  const netAppreciation =
    homeValue * (1 - inputs.sellingCostRate / 100) - inputs.homePrice;

  // Get principal paid (cumulative)
  const principalPaid = point.ownerTotalPrincipalPaid;

  // Calculate cumulative monthly contributions (invested monthly savings)
  let cumulativeContributions = 0;
  for (let month = 1; month <= horizonMonths; month++) {
    cumulativeContributions += timeline[month - 1].renterMonthlyContribution;
  }

  const ownerTotalNetWorth = point.ownerNetWorth;
  const renterTotalNetWorth = point.renterNetWorth;
  const renterInvestmentGrowth =
    renterTotalNetWorth - downPaymentAmount - cumulativeContributions;

  // Net difference
  const netDifference = ownerTotalNetWorth - renterTotalNetWorth;

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm">
      <Stack gap="lg">
        <Box>
          <Group gap="xs" align="center">
            <Title order={3} mb="xs" fw={600}>
              Net Worth Stack — Side by Side ({horizonYears} Years)
            </Title>
            <Tooltip
              withArrow
              multiline
              label={
                <Stack gap={4}>
                  <Text size="sm" fw={600}>
                    That's with:
                  </Text>
                  <Text size="sm">• Conservative appreciation assumptions</Text>
                  <Text size="sm">• No tax benefits included</Text>
                  <Text size="sm">• No refinance scenarios</Text>
                  <Text size="sm">• Modest market returns on investments</Text>
                </Stack>
              }
            >
              <Box style={{ display: "flex", alignItems: "center" }}>
                <InfoCircle size={16} style={{ cursor: "help" }} />
              </Box>
            </Tooltip>
          </Group>
          <Text size="sm" c="dimmed">
            Breakdown of wealth components for buying vs. renting
          </Text>
        </Box>

        <Table.ScrollContainer minWidth={600}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Component</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Buying</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Renting</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>
                  <Text fw={500}>Down payment equity</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={600}>{formatCurrency(downPaymentAmount)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text c="dimmed">—</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Text fw={500}>Appreciation (net of selling)</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={600} c="green.7">
                    {formatCurrency(netAppreciation)}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text c="dimmed">—</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Text fw={500}>Principal paid</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={600}>{formatCurrency(principalPaid)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text c="dimmed">—</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Text fw={500}>Invested monthly savings</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text c="dimmed">—</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={600}>
                    {formatCurrency(cumulativeContributions)}
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Text fw={500}>Investment growth</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text c="dimmed">—</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={600}>{formatCurrency(renterInvestmentGrowth)}</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Text fw={700} size="lg">
                    Total net worth
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={700} size="lg" c="green.7">
                    {formatCurrency(ownerTotalNetWorth)}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={700} size="lg">
                    {formatCurrency(renterTotalNetWorth)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Divider />

        <Box>
          <Group justify="space-between" align="center">
            <Text fw={600} size="lg">
              Net Difference
            </Text>
            <Text
              fw={700}
              size="xl"
              c={netDifference > 0 ? "green.7" : "red.7"}
            >
              {netDifference > 0 ? "Buying ahead by" : "Renting ahead by"}{" "}
              {formatCurrency(Math.abs(netDifference))}
            </Text>
          </Group>
          {netDifference > 0 && (
            <Text size="sm" c="dimmed" mt="xs">
              after {horizonYears} years
            </Text>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
