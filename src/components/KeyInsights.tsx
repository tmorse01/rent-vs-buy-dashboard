import {
  Box,
  Text,
  Title,
  Group,
  Stack,
  Tooltip,
  Collapse,
  UnstyledButton,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CurrencyDollar,
  AlertTriangle,
  InfoCircle,
  ChevronDown,
  ChevronUp,
} from "tabler-icons-react";
import type {
  Metrics,
  TimelinePoint,
  ScenarioInputs,
} from "../features/scenario/ScenarioInputs";
import { useAppTheme } from "../theme/useAppTheme";
import { formatCurrency } from "../utils/formatting";
import { ColorAccentCard } from "./ColorAccentCard";
import { InsightPill } from "./InsightPill";
import {
  DASHBOARD_SECTION_IDS,
  scrollToDashboardSection,
} from "../constants/dashboardSections";

/** Minimum width per KPI card before wrapping to the next row */
const KPI_CARD_MIN_WIDTH_PX = 260;

const kpiCardSlotStyle = {
  flex: `1 1 ${KPI_CARD_MIN_WIDTH_PX}px`,
  minWidth: KPI_CARD_MIN_WIDTH_PX,
  maxWidth: "100%",
  display: "flex",
} as const;

interface KeyInsightsProps {
  metrics: Metrics;
  timeline: TimelinePoint[];
  inputs: ScenarioInputs;
}

function scenarioLeaderWhy(
  leader: "Buy" | "Rent" | "Tie",
  inputs: ScenarioInputs,
): { summary: string; primary: string; secondary: string | null } {
  if (leader === "Tie") {
    return {
      summary: "Essentially tied at the horizon.",
      primary:
        "Ending net worth is essentially tied—small changes in appreciation, rent growth, or returns could swing it.",
      secondary: null,
    };
  }

  if (leader === "Buy") {
    const appreciation = inputs.annualAppreciationRate;
    const returns = inputs.annualReturnRate;
    const secondary =
      appreciation >= returns
        ? `${appreciation}% home appreciation vs. ${returns}% portfolio return: leverage on the full home plus paydown can beat compounded rent savings.`
        : `${returns}% portfolio return vs. ${appreciation}% appreciation, yet paydown and equity still put owning ahead here.`;
    return {
      summary: "Home equity is ahead of the invested portfolio.",
      primary:
        "Buy wins on total net worth: home equity (appreciation + mortgage paydown) is beating the invested portfolio from the same down payment and monthly savings gap.",
      secondary,
    };
  }

  const appreciation = inputs.annualAppreciationRate;
  const returns = inputs.annualReturnRate;
  const secondary =
    returns >= appreciation
      ? `${returns}% portfolio return vs. ${appreciation}% appreciation: compounded savings are winning the race.`
      : `${appreciation}% appreciation, but ownership costs and the savings math still leave renting ahead at this horizon.`;
  return {
    summary: "Invested savings are ahead of home equity.",
    primary:
      "Rent wins on total net worth: invested rent savings are compounding faster than sell-today home equity from appreciation and paydown.",
    secondary,
  };
}

export function KeyInsights({ metrics, timeline, inputs }: KeyInsightsProps) {
  const { theme, gradients, borders } = useAppTheme();
  const [leaderDetailsOpen, { toggle: toggleLeaderDetails }] =
    useDisclosure(false);

  const cardJumpLinkStyle = {
    alignSelf: "flex-start" as const,
    opacity: 0.92,
    textUnderlineOffset: 3,
    color: theme.white,
    fontWeight: 600,
    fontSize: theme.fontSizes.xs,
  };

  const getDeltaIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={20} color={theme.white} />;
    if (value < 0)
      return <TrendingDown size={20} color={theme.colors.red[3]} />;
    return null;
  };

  const lastPoint = timeline[timeline.length - 1];
  const horizonYears = lastPoint?.year ?? 0;
  const ownerNetWorth = lastPoint?.ownerNetWorth ?? 0;
  const renterNetWorth = lastPoint?.renterNetWorth ?? 0;
  const netWorthDelta = ownerNetWorth - renterNetWorth;
  const unrecoverableOwner = lastPoint?.ownerTotalUnrecoverable ?? 0;
  const unrecoverableRenter = lastPoint?.renterTotalUnrecoverable ?? 0;
  const unrecoverableDifference = unrecoverableOwner - unrecoverableRenter;
  const scenarioLeader =
    netWorthDelta > 0 ? "Buy" : netWorthDelta < 0 ? "Rent" : "Tie";
  const leaderWhy = scenarioLeaderWhy(scenarioLeader, inputs);

  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch",
        gap: "var(--mantine-spacing-md)",
      }}
    >
      <Box style={kpiCardSlotStyle}>
        <ColorAccentCard
          p="lg"
          radius="md"
          backgroundGradient={gradients.owner}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="wrap" justify="space-between" align="flex-start">
              <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                <TrendingUp size={18} />
                <Text size="lg" fw={700}>
                  Scenario Leader
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs">
                      Leader follows whoever has higher total net worth at the
                      end of the horizon (same rule as Net Worth Comparison).
                    </Text>
                    <Text size="xs" mt={4} style={{ opacity: 0.9 }}>
                      This card is the why; Net Worth Comparison shows the
                      dollar gap and balances.
                    </Text>
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Title
              order={2}
              fw={700}
              style={{ lineHeight: 1.1, fontSize: "inherit", margin: 0 }}
            >
              <InsightPill variant="positive" size="leader">
                {scenarioLeader}
              </InsightPill>
            </Title>
            <Text size="xs" fw={500} c="dimmed">
              Horizon: {horizonYears} years
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: borders.subtleLight,
                paddingTop: "12px",
              }}
            >
              <Text size="sm" fw={500} style={{ lineHeight: 1.45 }}>
                {leaderWhy.summary}
              </Text>
              <UnstyledButton
                type="button"
                onClick={toggleLeaderDetails}
                aria-expanded={leaderDetailsOpen}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  alignSelf: "flex-start",
                  padding: 0,
                  color: "rgba(255, 255, 255, 0.92)",
                  fontSize: theme.fontSizes.xs,
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                {leaderDetailsOpen ? (
                  <ChevronUp size={14} aria-hidden />
                ) : (
                  <ChevronDown size={14} aria-hidden />
                )}
                {leaderDetailsOpen ? "Hide detail" : "Why it leads"}
              </UnstyledButton>
              <Collapse in={leaderDetailsOpen}>
                <Stack gap="sm" pt={4}>
                  <Text size="sm" fw={500} style={{ lineHeight: 1.5 }}>
                    {leaderWhy.primary}
                  </Text>
                  {leaderWhy.secondary ? (
                    <Text size="xs" c="dimmed" style={{ lineHeight: 1.45 }}>
                      {leaderWhy.secondary}
                    </Text>
                  ) : null}
                </Stack>
              </Collapse>
            </Stack>
            <Anchor
              href={`#${DASHBOARD_SECTION_IDS.netWorthComparison}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToDashboardSection(
                  DASHBOARD_SECTION_IDS.netWorthComparison,
                );
              }}
              underline="always"
              style={cardJumpLinkStyle}
            >
              View net worth comparison chart
            </Anchor>
          </Stack>
        </ColorAccentCard>
      </Box>

      <Box style={kpiCardSlotStyle}>
        <ColorAccentCard
          p="lg"
          radius="md"
          backgroundGradient={gradients.purple}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="wrap" justify="space-between" align="flex-start">
              <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                <CurrencyDollar size={18} />
                <Text size="lg" fw={700}>
                  Net Worth Comparison
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs">
                      Net worth at the end of {horizonYears} years compares the
                      owner's equity and appreciation to the renter's investment
                      balance.
                    </Text>
                    <Text size="xs" mt={4} style={{ opacity: 0.9 }}>
                      Positive values favor buying; negative values favor
                      renting.
                    </Text>
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Group gap="xs" align="center" wrap="nowrap">
              <Title
                order={2}
                fw={700}
                style={{
                  lineHeight: 1.1,
                  flex: 1,
                  minWidth: 0,
                  color: theme.white,
                  fontSize: "inherit",
                  margin: 0,
                }}
              >
                <InsightPill
                  variant={netWorthDelta < 0 ? "negative" : "positive"}
                >
                  {formatCurrency(netWorthDelta)}
                </InsightPill>
              </Title>
              {getDeltaIcon(netWorthDelta)}
            </Group>
            <Text size="xs" fw={500} c="dimmed">
              {netWorthDelta > 0
                ? "Owner advantage"
                : netWorthDelta < 0
                  ? "Renter advantage"
                  : "Even"}
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: borders.subtleLight,
                paddingTop: "12px",
              }}
            >
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Owner
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(ownerNetWorth)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Renter
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(renterNetWorth)}
                </Text>
              </Group>
            </Stack>
            <Anchor
              href={`#${DASHBOARD_SECTION_IDS.netWorthComparison}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToDashboardSection(
                  DASHBOARD_SECTION_IDS.netWorthComparison,
                );
              }}
              underline="always"
              style={cardJumpLinkStyle}
            >
              View stacked net worth breakdown
            </Anchor>
          </Stack>
        </ColorAccentCard>
      </Box>

      <Box style={kpiCardSlotStyle}>
        <ColorAccentCard
          p="lg"
          radius="md"
          backgroundGradient={gradients.warning}
        >
          <Stack gap="md">
            <Group gap="xs" wrap="wrap" justify="space-between" align="flex-start">
              <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                <AlertTriangle size={18} />
                <Text size="lg" fw={700}>
                  Unrecoverable Costs
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 320 }}>
                    <Text size="xs">
                      Unrecoverable costs include interest, taxes, insurance,
                      maintenance, and rent. Lower totals indicate the cheaper
                      cash-loss path over the full horizon.
                      {inputs.mortgageInterestTaxDeductionEnabled
                        ? " When the interest write-off is modeled, deductible interest lowers the owner’s counted cost by the estimated tax savings."
                        : ""}
                      {inputs.houseHackEnabled
                        ? " When house hacking is modeled, gross rental income lowers the counted owner burden; it is not vacancy- or expense-adjusted."
                        : ""}
                      {inputs.rentalDepreciationTaxBenefitEnabled
                        ? " Rental depreciation modeling further lowers burdens as a simplified tax shield (see Documentation)."
                        : ""}
                    </Text>
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Title
              order={2}
              fw={700}
              style={{
                lineHeight: 1.1,
                color: theme.white,
                fontSize: "inherit",
                margin: 0,
              }}
            >
              <InsightPill
                variant={unrecoverableDifference > 0 ? "negative" : "positive"}
              >
                {formatCurrency(Math.abs(unrecoverableDifference))}
              </InsightPill>
            </Title>
            <Text size="xs" fw={500} c="dimmed">
              {unrecoverableDifference > 0
                ? "Owner pays more"
                : "Renter pays more"}
            </Text>
            <Stack
              gap="xs"
              mt="xs"
              style={{
                borderTop: borders.subtleLight,
                paddingTop: "12px",
              }}
            >
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Owner
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(unrecoverableOwner)}
                </Text>
              </Group>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  Renter
                </Text>
                <Text size="xs" fw={600}>
                  {formatCurrency(unrecoverableRenter)}
                </Text>
              </Group>
            </Stack>
            <Anchor
              href={`#${DASHBOARD_SECTION_IDS.unrecoverableCosts}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToDashboardSection(
                  DASHBOARD_SECTION_IDS.unrecoverableCosts,
                );
              }}
              underline="always"
              style={cardJumpLinkStyle}
            >
              View cumulative unrecoverable spend
            </Anchor>
          </Stack>
        </ColorAccentCard>
      </Box>

      <Box style={kpiCardSlotStyle}>
        <ColorAccentCard p="lg" radius="md" backgroundGradient={gradients.teal}>
          <Stack gap="md">
            <Group gap="xs" wrap="wrap" justify="space-between" align="flex-start">
              <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                <Calendar size={18} />
                <Text size="lg" fw={700}>
                  Break-Even Point
                </Text>
              </Group>
              <Tooltip
                label={
                  <Stack gap={4} style={{ maxWidth: 300 }}>
                    <Text size="xs">
                      Cash-flow break-even is when owner unrecoverable costs are
                      less than or equal to rent. Net worth break-even is when
                      owner net worth exceeds renter net worth.
                    </Text>
                  </Stack>
                }
                withArrow
                multiline
              >
                <InfoCircle
                  size={16}
                  style={{ cursor: "help", opacity: 0.7 }}
                />
              </Tooltip>
            </Group>
            <Stack gap="md">
              <div
                style={{
                  borderBottom: borders.subtleLight,
                  paddingBottom: "12px",
                }}
              >
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Cash Flow
                </Text>
                <Title
                  order={3}
                  fw={700}
                  style={{ lineHeight: 1.1, fontSize: "inherit", margin: 0 }}
                >
                  <InsightPill variant="positive" size="compact">
                    {metrics.cashLossBreakEvenYear
                      ? `${metrics.cashLossBreakEvenYear} years`
                      : "N/A"}
                  </InsightPill>
                </Title>
                <Text size="xs" c="dimmed" mt={2}>
                  {metrics.cashLossBreakEvenYear
                    ? "Owner costs ≤ rent"
                    : "No break-even found"}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Net Worth
                </Text>
                <Title
                  order={3}
                  fw={700}
                  style={{ lineHeight: 1.1, fontSize: "inherit", margin: 0 }}
                >
                  <InsightPill variant="positive" size="compact">
                    {metrics.netWorthBreakEvenYear
                      ? `${metrics.netWorthBreakEvenYear} years`
                      : "N/A"}
                  </InsightPill>
                </Title>
                <Text size="xs" c="dimmed" mt={2}>
                  {metrics.netWorthBreakEvenYear
                    ? "Owner wealth ≥ renter"
                    : "No break-even in horizon"}
                </Text>
                {!metrics.netWorthBreakEvenYear && (
                  <Text size="xs" c="dimmed" style={{ opacity: 0.8 }} mt={4}>
                    Gap: {formatCurrency(Math.abs(netWorthDelta))}
                  </Text>
                )}
              </div>
            </Stack>
            <Anchor
              href={`#${DASHBOARD_SECTION_IDS.breakEven}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToDashboardSection(DASHBOARD_SECTION_IDS.breakEven);
              }}
              underline="always"
              style={cardJumpLinkStyle}
            >
              {metrics.cashLossBreakEvenYear
                ? `Why year ${metrics.cashLossBreakEvenYear}? See break-even analysis`
                : "See break-even & recommendation"}
            </Anchor>
          </Stack>
        </ColorAccentCard>
      </Box>
    </Box>
  );
}
