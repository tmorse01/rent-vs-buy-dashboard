import {
  Fragment,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Stack,
  Table,
  Paper,
  Box,
} from "@mantine/core";
import {
  listScenarios,
  getScenarioMetadata,
  type SavedScenario,
} from "../features/scenario/scenarioStorage";
import type {
  Metrics,
  ScenarioInputs,
  TimelinePoint,
} from "../features/scenario/ScenarioInputs";
import { mergeScenarioInputs } from "../features/scenario/scenarioDefaults";
import { buildTimeline } from "../calculations/timeline";
import { computeMetrics } from "../calculations/metrics";
import { formatCurrency, formatPercent } from "../utils/formatting";
import { COMPARED_SCENARIOS_QUERY_KEY } from "../utils/shareScenario";

function formatSavedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function loadSavedScenariosSorted(): SavedScenario[] {
  return listScenarios()
    .map((name) => getScenarioMetadata(name))
    .filter((s): s is SavedScenario => s !== null)
    .sort(
      (a, b) =>
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    );
}

interface ComputedScenario {
  saved: SavedScenario;
  inputs: ScenarioInputs;
  timeline: TimelinePoint[];
  metrics: Metrics;
  last: TimelinePoint | null;
}

function downPaymentAmount(inputs: ScenarioInputs): number {
  return (inputs.homePrice * inputs.downPaymentPercent) / 100;
}

function loanAmount(inputs: ScenarioInputs): number {
  return inputs.homePrice - downPaymentAmount(inputs);
}

function milestoneAvailable(
  inputs: ScenarioInputs,
  timeline: TimelinePoint[],
  years: 5 | 10 | 15,
): boolean {
  return years <= inputs.horizonYears && years * 12 <= timeline.length;
}

const NA = "N/A";

type RowGetter = (c: ComputedScenario) => string;

interface RowDef {
  label: string;
  value: RowGetter;
}

interface GroupDef {
  title: string;
  rows: RowDef[];
}

function buildRowGroups(): GroupDef[] {
  return [
    {
      title: "Meta",
      rows: [
        {
          label: "Scenario name",
          value: (c) => c.saved.name,
        },
        {
          label: "Saved date",
          value: (c) => formatSavedDate(c.saved.savedAt),
        },
      ],
    },
    {
      title: "Home & loan",
      rows: [
        {
          label: "Home price",
          value: (c) => formatCurrency(c.inputs.homePrice),
        },
        {
          label: "Down payment",
          value: (c) =>
            `${formatPercent(c.inputs.downPaymentPercent, 1)} (${formatCurrency(downPaymentAmount(c.inputs))})`,
        },
        {
          label: "Loan amount",
          value: (c) => formatCurrency(loanAmount(c.inputs)),
        },
        {
          label: "Interest rate (APR)",
          value: (c) => formatPercent(c.inputs.interestRate, 2),
        },
        {
          label: "Loan term",
          value: (c) => `${c.inputs.loanTermYears} years`,
        },
        {
          label: "PMI enabled",
          value: (c) => (c.inputs.pmiEnabled ? "Yes" : "No"),
        },
        {
          label: "PMI rate",
          value: (c) =>
            c.inputs.pmiEnabled
              ? formatPercent(c.inputs.pmiRate, 2)
              : NA,
        },
        {
          label: "Extra principal (monthly)",
          value: (c) => formatCurrency(c.inputs.extraPrincipalPayment),
        },
      ],
    },
    {
      title: "Owner costs",
      rows: [
        {
          label: "Property tax rate",
          value: (c) => formatPercent(c.inputs.propertyTaxRate, 2),
        },
        {
          label: "Insurance (monthly)",
          value: (c) => formatCurrency(c.inputs.insuranceMonthly),
        },
        {
          label: "Maintenance rate",
          value: (c) => formatPercent(c.inputs.maintenanceRate, 2),
        },
        {
          label: "Selling cost rate",
          value: (c) => formatPercent(c.inputs.sellingCostRate, 1),
        },
        {
          label: "Closing cost rate",
          value: (c) => formatPercent(c.inputs.closingCostRate, 1),
        },
        {
          label: "Mortgage interest tax benefit (modeled)",
          value: (c) =>
            c.inputs.mortgageInterestTaxDeductionEnabled ? "Yes" : "No",
        },
        {
          label: "Combined marginal rate (interest)",
          value: (c) =>
            c.inputs.mortgageInterestTaxDeductionEnabled
              ? formatPercent(c.inputs.marginalTaxRate, 2)
              : NA,
        },
      ],
    },
    {
      title: "Rent & market",
      rows: [
        {
          label: "Current rent (monthly)",
          value: (c) => formatCurrency(c.inputs.currentRent),
        },
        {
          label: "Rent growth (annual)",
          value: (c) => formatPercent(c.inputs.rentGrowthRate, 1),
        },
        {
          label: "Investment return (annual)",
          value: (c) => formatPercent(c.inputs.annualReturnRate, 1),
        },
        {
          label: "Appreciation (annual)",
          value: (c) => formatPercent(c.inputs.annualAppreciationRate, 1),
        },
      ],
    },
    {
      title: "Horizon",
      rows: [
        {
          label: "Analysis horizon",
          value: (c) => `${c.inputs.horizonYears} years`,
        },
      ],
    },
    {
      title: "Break-even & milestones",
      rows: [
        {
          label: "Cash-loss break-even",
          value: (c) =>
            c.metrics.cashLossBreakEvenYear != null
              ? `${c.metrics.cashLossBreakEvenYear} years`
              : NA,
        },
        {
          label: "Net-worth break-even",
          value: (c) =>
            c.metrics.netWorthBreakEvenYear != null
              ? `${c.metrics.netWorthBreakEvenYear} years`
              : NA,
        },
        {
          label: "Net worth delta (5 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 5)
              ? formatCurrency(c.metrics.netWorthDelta5)
              : NA,
        },
        {
          label: "Net worth delta (10 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 10)
              ? formatCurrency(c.metrics.netWorthDelta10)
              : NA,
        },
        {
          label: "Net worth delta (15 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 15)
              ? formatCurrency(c.metrics.netWorthDelta15)
              : NA,
        },
        {
          label: "Cumulative unrecoverable — owner (5 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 5)
              ? formatCurrency(c.metrics.totalUnrecoverableOwner5)
              : NA,
        },
        {
          label: "Cumulative unrecoverable — renter (5 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 5)
              ? formatCurrency(c.metrics.totalUnrecoverableRenter5)
              : NA,
        },
        {
          label: "Cumulative unrecoverable — owner (10 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 10)
              ? formatCurrency(c.metrics.totalUnrecoverableOwner10)
              : NA,
        },
        {
          label: "Cumulative unrecoverable — renter (10 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 10)
              ? formatCurrency(c.metrics.totalUnrecoverableRenter10)
              : NA,
        },
        {
          label: "Cumulative unrecoverable — owner (15 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 15)
              ? formatCurrency(c.metrics.totalUnrecoverableOwner15)
              : NA,
        },
        {
          label: "Cumulative unrecoverable — renter (15 years)",
          value: (c) =>
            milestoneAvailable(c.inputs, c.timeline, 15)
              ? formatCurrency(c.metrics.totalUnrecoverableRenter15)
              : NA,
        },
      ],
    },
    {
      title: "End of horizon",
      rows: [
        {
          label: "Owner net worth",
          value: (c) =>
            c.last ? formatCurrency(c.last.ownerNetWorth) : NA,
        },
        {
          label: "Renter net worth",
          value: (c) =>
            c.last ? formatCurrency(c.last.renterNetWorth) : NA,
        },
        {
          label: "Net worth delta (owner − renter)",
          value: (c) =>
            c.last
              ? formatCurrency(
                  c.last.ownerNetWorth - c.last.renterNetWorth,
                )
              : NA,
        },
        {
          label: "Cumulative unrecoverable — owner",
          value: (c) =>
            c.last
              ? formatCurrency(c.last.ownerTotalUnrecoverable)
              : NA,
        },
        {
          label: "Cumulative unrecoverable — renter",
          value: (c) =>
            c.last
              ? formatCurrency(c.last.renterTotalUnrecoverable)
              : NA,
        },
        {
          label: "Home value",
          value: (c) => (c.last ? formatCurrency(c.last.homeValue) : NA),
        },
        {
          label: "Mortgage balance",
          value: (c) =>
            c.last ? formatCurrency(c.last.mortgageBalance) : NA,
        },
        {
          label: "Rent (final month)",
          value: (c) =>
            c.last ? formatCurrency(c.last.rentMonthly) : NA,
        },
        {
          label: "Mortgage interest tax benefit (final month)",
          value: (c) =>
            c.last
              ? formatCurrency(c.last.mortgageInterestTaxBenefitMonthly)
              : NA,
        },
        {
          label: "Owner unrecoverable (final month)",
          value: (c) =>
            c.last
              ? formatCurrency(c.last.ownerUnrecoverableMonthly)
              : NA,
        },
      ],
    },
  ];
}

const ROW_GROUPS = buildRowGroups();

const cellStyle: CSSProperties = {
  textAlign: "right",
  whiteSpace: "nowrap",
  minWidth: 132,
};

const stickyLabelCell: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 2,
  backgroundColor: "var(--mantine-color-body)",
  whiteSpace: "nowrap",
  maxWidth: 280,
};

const stickyCornerCell: CSSProperties = {
  ...stickyLabelCell,
  top: 0,
  zIndex: 4,
};

const stickyHeaderCell: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: "var(--mantine-color-body)",
};

export function ScenarioCompare() {
  const [searchParams] = useSearchParams();
  const comparisonSearch = searchParams.toString();
  const selectedScenarioNames = useMemo(
    () =>
      new URLSearchParams(comparisonSearch)
        .getAll(COMPARED_SCENARIOS_QUERY_KEY)
        .filter(Boolean),
    [comparisonSearch],
  );
  const hasExplicitComparisonSelection = searchParams.has(
    COMPARED_SCENARIOS_QUERY_KEY,
  );

  const { columns, savedScenarioCount } = useMemo(() => {
    const saved = loadSavedScenariosSorted();
    const selectedSaved = hasExplicitComparisonSelection
      ? saved.filter((s) => selectedScenarioNames.includes(s.name))
      : saved;

    return {
      savedScenarioCount: saved.length,
      columns: selectedSaved.map((s) => {
        const inputs = mergeScenarioInputs(s.inputs);
        const timeline = buildTimeline(inputs);
        const metrics = computeMetrics(timeline, inputs);
        const last =
          timeline.length > 0 ? timeline[timeline.length - 1]! : null;
        return {
          saved: s,
          inputs,
          timeline,
          metrics,
          last,
        } satisfies ComputedScenario;
      }),
    };
  }, [
    hasExplicitComparisonSelection,
    selectedScenarioNames,
  ]);

  const minWidth = 260 + columns.length * 140;

  return (
    <Container size="xl" style={{ maxWidth: "100%" }} py="lg">
      <Stack gap="lg">
        <Stack gap="xs">
          <GroupTop>
            <Title order={1}>Scenarios</Title>
          </GroupTop>
          <Text c="dimmed" size="sm" maw={720}>
            Saved scenarios are listed in the sidebar. This table compares
            their inputs and outcomes using the same calculations as the
            dashboard.
          </Text>
        </Stack>

        {savedScenarioCount === 0 ? (
          <Paper p="xl" withBorder radius="md">
            <Text c="dimmed" ta="center">
              No saved scenarios yet. Save one from the dashboard (Scenario
              inputs in the sidebar on desktop, or the expandable section at the
              top on mobile, then the save icon), then return here.
            </Text>
          </Paper>
        ) : columns.length === 0 ? (
          <Paper p="xl" withBorder radius="md">
            <Text c="dimmed" ta="center">
              Select at least one saved scenario in the sidebar to compare.
            </Text>
          </Paper>
        ) : (
          <Table.ScrollContainer minWidth={minWidth}>
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={stickyCornerCell}>Metric</Table.Th>
                  {columns.map((c) => (
                    <Table.Th
                      key={c.saved.name}
                      style={stickyHeaderCell}
                      title={c.saved.name}
                    >
                      <Box
                        style={{
                          maxWidth: 160,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.saved.name}
                      </Box>
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {ROW_GROUPS.map((group) => (
                  <Fragment key={group.title}>
                    <Table.Tr>
                      <Table.Td
                        colSpan={columns.length + 1}
                        style={{
                          backgroundColor: "var(--mantine-color-gray-1)",
                        }}
                      >
                        <Text fw={700} size="sm">
                          {group.title}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                    {group.rows.map((row) => (
                      <Table.Tr key={`${group.title}-${row.label}`}>
                        <Table.Td style={stickyLabelCell}>
                          <Text size="sm">{row.label}</Text>
                        </Table.Td>
                        {columns.map((c) => (
                          <Table.Td key={c.saved.name} style={cellStyle}>
                            <Text size="sm">{row.value(c)}</Text>
                          </Table.Td>
                        ))}
                      </Table.Tr>
                    ))}
                  </Fragment>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Stack>
    </Container>
  );
}

function GroupTop({ children }: { children: ReactNode }) {
  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "var(--mantine-spacing-sm)",
      }}
    >
      {children}
    </Box>
  );
}
