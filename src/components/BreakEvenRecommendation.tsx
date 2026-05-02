import { Badge, Group, List, Paper, Stack, Text, Title } from "@mantine/core";
import type {
  Metrics,
  ScenarioInputs,
  TimelinePoint,
} from "../features/scenario/ScenarioInputs";
import { formatCurrency } from "../utils/formatting";

interface BreakEvenRecommendationProps {
  metrics: Metrics;
  timeline: TimelinePoint[];
  inputs: ScenarioInputs;
}

export function BreakEvenRecommendation({
  metrics,
  timeline,
  inputs,
}: BreakEvenRecommendationProps) {
  const lastPoint = timeline[timeline.length - 1];
  const horizonYears = lastPoint?.year ?? 0;
  const ownerNetWorth = lastPoint?.ownerNetWorth ?? 0;
  const renterNetWorth = lastPoint?.renterNetWorth ?? 0;
  const netWorthDelta = ownerNetWorth - renterNetWorth;

  const cashBreakEvenWithinHorizon =
    metrics.cashLossBreakEvenYear !== null &&
    metrics.cashLossBreakEvenYear <= horizonYears;
  const netWorthBreakEvenWithinHorizon =
    metrics.netWorthBreakEvenYear !== null &&
    metrics.netWorthBreakEvenYear <= horizonYears;

  const recommendation = (() => {
    if (
      netWorthDelta > 0 &&
      netWorthBreakEvenWithinHorizon &&
      cashBreakEvenWithinHorizon
    ) {
      return {
        label: "Buy",
        color: "blue",
        summary:
          "Buying wins on net worth and cash flow within the analysis horizon.",
      };
    }
    if (netWorthDelta > 0 && netWorthBreakEvenWithinHorizon) {
      return {
        label: "Buy",
        color: "blue",
        summary:
          "Buying ends ahead on net worth, but cash flow stays higher for longer.",
      };
    }
    if (netWorthDelta < 0 && !netWorthBreakEvenWithinHorizon) {
      return {
        label: "Rent",
        color: "cyan",
        summary:
          "Renting preserves a higher net worth within the analysis horizon.",
      };
    }
    return {
      label: "Mixed",
      color: "orange",
      summary:
        "The outcome is mixed based on cash flow and net worth break-even timing.",
    };
  })();

  const adjustmentSuggestions = (() => {
    if (netWorthDelta >= 0) {
      return [
        "Keep the horizon long enough to capture net worth break-even",
        "Watch interest rates and closing costs to protect the advantage",
      ];
    }
    return [
      "Increase down payment or lower the purchase price",
      "Seek a lower mortgage rate or reduce closing costs",
      "Extend the time horizon to capture appreciation",
    ];
  })();

  return (
    <Paper withBorder radius="md" p="lg">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3}>Recommendation</Title>
          <Badge color={recommendation.color} size="lg" radius="sm">
            {recommendation.label}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {recommendation.summary}
        </Text>

        <Stack gap="xs">
          <Text fw={600} size="sm">
            Break-even summary
          </Text>
          <List spacing="xs" size="sm">
            <List.Item>
              Cash-flow break-even: {metrics.cashLossBreakEvenYear ?? "N/A"}
              {metrics.cashLossBreakEvenYear
                ? ` years`
                : ` (not within ${horizonYears} years)`}
            </List.Item>
            <List.Item>
              Net worth break-even: {metrics.netWorthBreakEvenYear ?? "N/A"}
              {metrics.netWorthBreakEvenYear
                ? ` years`
                : ` (not within ${horizonYears} years)`}
            </List.Item>
            <List.Item>
              Final net worth gap: {formatCurrency(Math.abs(netWorthDelta))} (
              {netWorthDelta >= 0 ? "owner" : "renter"} ahead)
            </List.Item>
          </List>
          <Text size="sm" c="dimmed" mt="xs" style={{ lineHeight: 1.55 }}>
            Cash-flow break-even is the first year where average monthly owner
            unrecoverable costs (interest, taxes, insurance, maintenance, and
            PMI when applicable—not principal) are no longer above average
            monthly rent for that year. Early years are often tilted toward
            renting on cash loss because interest is front-loaded; as the
            amortization schedule shifts toward principal and rent grows, the
            monthly comparison can flip—which is why the timing is a specific
            year rather than immediate.
            {inputs.mortgageInterestTaxDeductionEnabled
              ? " When enabled, owner costs subtract the portion of mortgage interest you can effectively recoup by writing it off (deducting it) against taxable income, estimated at your combined marginal rate—if you qualify and itemize."
              : null}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Text fw={600} size="sm">
            Adjustments to improve break-even
          </Text>
          <List spacing="xs" size="sm">
            {adjustmentSuggestions.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
          </List>
        </Stack>
      </Stack>
    </Paper>
  );
}
