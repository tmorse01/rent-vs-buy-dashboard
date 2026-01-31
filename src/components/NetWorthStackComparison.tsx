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
  // Get data at 10-year milestone
  const month10 = 10 * 12;
  if (month10 > timeline.length) {
    return null; // Not enough data
  }

  const point10 = timeline[month10 - 1];
  const initialHomeValue = timeline[0]?.homeValue || inputs.homePrice;
  const homeValue10 = point10.homeValue;

  // Calculate net appreciation (after selling costs)
  const netAppreciation =
    homeValue10 * (1 - inputs.sellingCostRate / 100) -
    initialHomeValue * (1 - inputs.sellingCostRate / 100);

  // Get principal paid (cumulative)
  const principalPaid = point10.ownerTotalPrincipalPaid;

  // Calculate total net gain for buying
  const buyingTotalNetGain = netAppreciation + principalPaid;

  // Calculate cumulative monthly contributions (invested monthly savings)
  let cumulativeContributions = 0;
  for (let month = 1; month <= month10 && month <= timeline.length; month++) {
    cumulativeContributions += timeline[month - 1].renterMonthlyContribution;
  }

  // Total net gain for renter is just the invested monthly savings
  // (the cumulative contributions, not including initial deposit or returns)
  const renterTotalNetGain = cumulativeContributions;

  // Net difference
  const netDifference = buyingTotalNetGain - renterTotalNetGain;

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm">
      <Stack gap="lg">
        <Box>
          <Group gap="xs" align="center">
            <Title order={3} mb="xs" fw={600}>
              Net Worth Stack — Side by Side (10 Years)
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
                  <Text fw={700} size="lg">
                    Total net gain
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={700} size="lg" c="green.7">
                    {formatCurrency(buyingTotalNetGain)}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text fw={700} size="lg">
                    {formatCurrency(renterTotalNetGain)}
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
              after 10 years
            </Text>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
