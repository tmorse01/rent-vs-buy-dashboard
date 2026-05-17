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
  Grid,
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

function cumulativeOwnerUnrecoverableParts(timeline: TimelinePoint[]) {
  let mortgageInterest = 0;
  let propertyTax = 0;
  let insurance = 0;
  let maintenance = 0;
  let pmi = 0;
  for (const p of timeline) {
    mortgageInterest += p.mortgageInterest;
    propertyTax += p.propertyTax;
    insurance += p.insurance;
    maintenance += p.maintenance;
    pmi += p.pmi;
  }
  return { mortgageInterest, propertyTax, insurance, maintenance, pmi };
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

  const unrecoverableParts = cumulativeOwnerUnrecoverableParts(timeline);
  const ownerTotalUnrecoverable = point.ownerTotalUnrecoverable;
  const renterTotalUnrecoverable = point.renterTotalUnrecoverable;
  const unrecoverableDifference = ownerTotalUnrecoverable - renterTotalUnrecoverable;

  return (
    <Grid gutter="lg">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper p="xl" withBorder radius="md" shadow="sm" h="100%">
          <Stack gap="lg">
            <Box>
              <Group gap="xs" align="center">
                <Title order={3} mb="xs" fw={600}>
                  Net Worth Stack ({horizonYears} Years)
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
                      <Text size="sm">
                        {inputs.mortgageInterestTaxDeductionEnabled
                          ? "• Mortgage-interest tax write-off is modeled elsewhere (monthly snapshot, unrecoverable); not duplicated in these net-worth stack figures"
                          : "• Mortgage-interest taxes are not included in equity figures"}
                      </Text>
                      <Text size="sm">
                        {inputs.houseHackEnabled
                          ? "• House hacking (rent offsets + depreciation tax shield when enabled) is modeled in monthly cash-loss math only; not flowed into these stack figures"
                          : "• Optional house hacking is not modeled in this breakdown"}
                      </Text>
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

            <Table.ScrollContainer minWidth={360}>
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
                      <Group gap={6} wrap="nowrap">
                        <Text fw={500}>Upfront capital</Text>
                        <Tooltip
                          withArrow
                          label={
                            <Text size="sm">
                              Same dollar amount as the buyer&apos;s down payment:
                              locked in home equity when buying, invested on day
                              one when renting (see calculations timeline).
                            </Text>
                          }
                        >
                          <Box style={{ display: "flex", alignItems: "center" }}>
                            <InfoCircle
                              size={14}
                              style={{ cursor: "help", opacity: 0.6 }}
                            />
                          </Box>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>{formatCurrency(downPaymentAmount)}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>{formatCurrency(downPaymentAmount)}</Text>
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
                  Net difference
                </Text>
                <Text
                  fw={700}
                  size="xl"
                  c={
                    netDifference === 0
                      ? undefined
                      : netDifference > 0
                        ? "green.7"
                        : "red.7"
                  }
                >
                  {netDifference === 0
                    ? "Tied at horizon"
                    : netDifference > 0
                      ? `Buying ahead by ${formatCurrency(Math.abs(netDifference))}`
                      : `Renting ahead by ${formatCurrency(Math.abs(netDifference))}`}
                </Text>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                After {horizonYears} years (balance sheet view)
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper p="xl" withBorder radius="md" shadow="sm" h="100%">
          <Stack gap="lg">
            <Box>
              <Group gap="xs" align="center">
                <Title order={3} mb="xs" fw={600}>
                  Unrecoverable Cost Stack ({horizonYears} Years)
                </Title>
                <Tooltip
                  withArrow
                  multiline
                  w={320}
                  label={
                    <Stack gap={4}>
                      <Text size="sm">
                        Cumulative costs that do not build equity: owner side
                        is interest, taxes, insurance, maintenance, and PMI;
                        renter side is rent. Principal and down payment are not
                        included here.
                      </Text>
                    </Stack>
                  }
                >
                  <Box style={{ display: "flex", alignItems: "center" }}>
                    <InfoCircle size={16} style={{ cursor: "help" }} />
                  </Box>
                </Tooltip>
              </Group>
              <Text size="sm" c="dimmed">
                Cash you do not get back, summed through the horizon
              </Text>
            </Box>

            <Table.ScrollContainer minWidth={360}>
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
                      <Text fw={500}>Mortgage interest</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>
                        {formatCurrency(unrecoverableParts.mortgageInterest)}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text c="dimmed">—</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text fw={500}>Property tax</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>
                        {formatCurrency(unrecoverableParts.propertyTax)}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text c="dimmed">—</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text fw={500}>Insurance</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>
                        {formatCurrency(unrecoverableParts.insurance)}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text c="dimmed">—</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text fw={500}>Maintenance</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>
                        {formatCurrency(unrecoverableParts.maintenance)}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text c="dimmed">—</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text fw={500}>PMI</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>
                        {formatCurrency(unrecoverableParts.pmi)}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text c="dimmed">—</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text fw={500}>Rent</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text c="dimmed">—</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600}>
                        {formatCurrency(renterTotalUnrecoverable)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text fw={700} size="lg">
                        Total unrecoverable
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={700} size="lg" c="orange.7">
                        {formatCurrency(ownerTotalUnrecoverable)}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={700} size="lg" c="orange.7">
                        {formatCurrency(renterTotalUnrecoverable)}
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
                  Unrecoverable difference
                </Text>
                <Text
                  fw={700}
                  size="xl"
                  c={
                    unrecoverableDifference === 0
                      ? undefined
                      : unrecoverableDifference > 0
                        ? "red.7"
                        : "green.7"
                  }
                >
                  {unrecoverableDifference === 0
                    ? "Tied at horizon"
                    : unrecoverableDifference > 0
                      ? `Buying paid more by ${formatCurrency(Math.abs(unrecoverableDifference))}`
                      : `Renting paid more by ${formatCurrency(Math.abs(unrecoverableDifference))}`}
                </Text>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                Owner total minus renter total (cumulative through{" "}
                {horizonYears} years). Lower unrecoverable spend is better for
                cash lost.
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
