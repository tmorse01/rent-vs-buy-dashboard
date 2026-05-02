import { Box, Divider, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import type {
  ScenarioInputs,
  TimelinePoint,
} from "../features/scenario/ScenarioInputs";
import { formatCurrency, formatPercent } from "../utils/formatting";
import { COLORS } from "../theme/colors";
import { monthlyMortgageInterestTaxBenefit } from "../calculations/timeline";

function clampPct(x: number): string {
  return `${Math.min(100, Math.max(0, x))}%`;
}

interface MonthlyPaymentBreakdownProps {
  /** Representative month (typically first month): month index 0-based. */
  snapshotPoint: TimelinePoint | null;
  inputs: ScenarioInputs;
}

export function MonthlyPaymentBreakdown({
  snapshotPoint,
  inputs,
}: MonthlyPaymentBreakdownProps) {
  if (!snapshotPoint) {
    return (
      <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
        <Text size="sm" c="dimmed">
          Add scenario inputs to see a monthly payment comparison.
        </Text>
      </Paper>
    );
  }

  const p = snapshotPoint;
  const ownerCashMonthly =
    p.mortgagePayment +
    p.propertyTax +
    p.insurance +
    p.maintenance +
    p.pmi;

  const taxBenefit = p.mortgageInterestTaxBenefitMonthly;
  const effectiveMarginalRate = Math.min(50, Math.max(0, inputs.marginalTaxRate));

  const interestTaxSavingsFromModel = monthlyMortgageInterestTaxBenefit(
    inputs,
    p.mortgageInterest,
  );
  const netInterestAfterRecoup =
    inputs.mortgageInterestTaxDeductionEnabled && p.mortgageInterest > 0
      ? Math.max(0, p.mortgageInterest - interestTaxSavingsFromModel)
      : p.mortgageInterest;
  const pctOfInterestRecoupedViaTax =
    p.mortgageInterest > 0 && interestTaxSavingsFromModel > 0
      ? (interestTaxSavingsFromModel / p.mortgageInterest) * 100
      : 0;
  /** After modeled tax write-off + excluding principal (equity)—matches timeline unrecoverable. */
  const ownerComparableMonthly = Math.max(0, p.ownerUnrecoverableMonthly);
  const renterMonthly = p.rentMonthly;

  const cashDifference = ownerCashMonthly - renterMonthly;
  /** Rent vs homeowner’s portion that truly doesn’t build equity—matches modeled unrecoverable costs. */
  const comparableDifference = ownerComparableMonthly - renterMonthly;

  const showComparableBreakdown =
    taxBenefit > 0 ||
    (p.mortgagePrincipal > 0 && Number.isFinite(p.mortgagePrincipal));

  const chartMax = Math.max(
    ownerCashMonthly,
    renterMonthly,
    showComparableBreakdown ? ownerComparableMonthly : 0,
    1,
  );

  const whoPaysMoreCash = cashDifference >= 0 ? "owner" : "renter";

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="lg">
        <Box>
          <Title order={4} mb="xs" fw={600}>
            Monthly payment snapshot
          </Title>
          <Text size="sm" c="dimmed">
            Side-by-side cash flow for month {p.month} (year {p.year}) of your
            horizon. Mortgage includes principal plus interest.
            {inputs.mortgageInterestTaxDeductionEnabled
              ? " Mortgage interest you can deduct from taxable income (the write-off) effectively returns part of that interest through lower taxes—we approximate it as interest × your combined marginal rate (itemizing assumed)."
              : null}
          </Text>
        </Box>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text fw={600} size="sm" mb="sm" style={{ color: COLORS.owner.primary }}>
              Owner (buy)
            </Text>
            <Stack gap={6}>
              <GroupRow label="Mortgage payment" value={p.mortgagePayment} />
              <Stack gap={6} mt={4} pl="xs">
                <Text size="xs" c="dimmed">
                  Principal {formatCurrency(p.mortgagePrincipal)} · Interest{" "}
                  {formatCurrency(p.mortgageInterest)}
                </Text>
                {p.mortgageInterest <= 0 ? (
                  <Text size="xs" c="dimmed">
                    No interest portion this month, so nothing is modeled as
                    deductible mortgage interest.
                  </Text>
                ) : inputs.mortgageInterestTaxDeductionEnabled ? (
                  <>
                    <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
                      You can effectively recoup part of the{" "}
                      <Text span fw={600}>
                        {formatCurrency(p.mortgageInterest)} interest
                      </Text>{" "}
                      by{" "}
                      <Text span fw={600}>
                        reducing taxable income
                      </Text>{" "}
                      when you itemize and deduct qualifying mortgage
                      interest—your combined marginal rate is how much tax that
                      reduction avoids on each dollar of interest (modeled below).
                    </Text>
                    <Paper
                      p="sm"
                      radius="sm"
                      withBorder
                      style={{
                        borderColor: "var(--mantine-color-gray-4)",
                        background: "var(--mantine-color-gray-0)",
                      }}
                    >
                      <Stack gap={6}>
                        <Text size="xs" fw={600}>
                          Estimated tax savings this month (crunched)
                        </Text>
                        <Text size="xs" c="dimmed" ff="monospace">
                          {formatCurrency(p.mortgageInterest)} ×{" "}
                          {formatPercent(effectiveMarginalRate, 2)}
                          marginal ≈{" "}
                          <Text
                            span
                            fw={600}
                            ff="monospace"
                            c="var(--mantine-color-green-7)"
                          >
                            {formatCurrency(interestTaxSavingsFromModel)}
                          </Text>
                        </Text>
                        {inputs.marginalTaxRate !== effectiveMarginalRate ? (
                          <Text size="xs" c="dimmed">
                            Uses a capped marginal rate of 0%–50% for this estimate.
                          </Text>
                        ) : null}
                        <Text size="xs" c="dimmed">
                          That is roughly{" "}
                          <Text span fw={600}>
                            {formatPercent(pctOfInterestRecoupedViaTax, 1)}
                          </Text>{" "}
                          of this month&apos;s interest returned through lower
                          taxes (itemizing assumed). Net interest economic cost
                          after this modeled recoup:{" "}
                          <Text span fw={600}>
                            {formatCurrency(netInterestAfterRecoup)}
                          </Text>
                          .
                        </Text>
                      </Stack>
                    </Paper>
                  </>
                ) : (
                  <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
                    Turn on{" "}
                    <Text span fw={600}>
                      Model mortgage interest tax benefit
                    </Text>{" "}
                    in scenario inputs to crunch how much of this{" "}
                    {formatCurrency(p.mortgageInterest)} interest you might recoup
                    by lowering taxable income at your marginal rate.
                  </Text>
                )}
              </Stack>
              <GroupRow label="Property tax" value={p.propertyTax} />
              <GroupRow label="Insurance" value={p.insurance} />
              <GroupRow label="Maintenance" value={p.maintenance} />
              {p.pmi > 0 ? <GroupRow label="PMI" value={p.pmi} /> : null}
              <Divider my="xs" />
              <GroupRow
                label="Total cash outflow"
                value={ownerCashMonthly}
                strong
              />
              {showComparableBreakdown ? (
                <>
                  {inputs.mortgageInterestTaxDeductionEnabled && taxBenefit > 0 ? (
                    <>
                      <GroupRow
                        label="− Estimated tax savings (interest write-off)"
                        value={taxBenefit}
                        valueColor="var(--mantine-color-green-7)"
                        prefix="−"
                      />
                      <Text size="xs" c="dimmed" mt={-4}>
                        Same monthly savings figure as under principal / interest,
                        subtracted here from total owner cash outflow.
                      </Text>
                    </>
                  ) : inputs.mortgageInterestTaxDeductionEnabled &&
                    p.mortgageInterest > 0 ? (
                    <Text size="xs" c="dimmed">
                      No modeled interest write-off savings this month (e.g.,
                      marginal rate 0%).
                    </Text>
                  ) : null}

                  {(p.mortgagePrincipal ?? 0) > 0 ? (
                    <>
                      <GroupRow
                        label="− Principal (builds equity; not counted as lost)"
                        value={p.mortgagePrincipal}
                        valueColor={COLORS.owner.primary}
                        prefix="−"
                      />
                      <Text size="xs" c="dimmed" mt={-4}>
                        This stays in home equity—you’re not forfeiting it the
                        way you do with rent or interest on a loan.
                      </Text>
                    </>
                  ) : null}

                  <GroupRow
                    label="Comparable unrecoverable this month"
                    value={ownerComparableMonthly}
                    strong
                  />
                  <Text size="xs" c="dimmed" mt={-4}>
                    Models write-off savings (when on) and treats principal paid
                    as equity, not a loss. Matches unrecoverable costs elsewhere in
                    the dashboard.
                  </Text>
                </>
              ) : inputs.mortgageInterestTaxDeductionEnabled &&
                p.mortgageInterest <= 0 ? (
                <Text size="xs" c="dimmed">
                  No deductible interest modeled this month (e.g., loan paid off).
                  Compare total cash vs rent above.
                </Text>
              ) : null}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text fw={600} size="sm" mb="sm" style={{ color: COLORS.renter.primary }}>
              Renter
            </Text>
            <Stack gap={6}>
              <GroupRow label="Rent" value={renterMonthly} />
              <Divider my="xs" />
              <GroupRow label="Total" value={renterMonthly} strong />
            </Stack>
          </Grid.Col>
        </Grid>

        <Box>
          <Text fw={600} size="sm" mb="xs">
            Compared to rent
          </Text>
          <Stack gap="xs">
            <ComparisonBar
              label="Rent"
              amount={renterMonthly}
              max={chartMax}
              color={COLORS.renter.primary}
            />
            <ComparisonBar
              label="Owner — cash"
              amount={ownerCashMonthly}
              max={chartMax}
              color={COLORS.owner.primary}
            />
            {showComparableBreakdown ? (
              <ComparisonBar
                label="Owner — unrecoverable (write-off modeled, excludes principal)"
                amount={ownerComparableMonthly}
                max={chartMax}
                color="var(--mantine-color-green-7)"
              />
            ) : null}
          </Stack>
        </Box>

        <Divider />

        <Stack gap={6}>
          <Text size="sm">
            <Text span fw={600}>
              Cash difference:
            </Text>{" "}
            {whoPaysMoreCash === "owner"
              ? `You pay ${formatCurrency(cashDifference)} more per month to own vs rent before tax.`
              : `Rent is ${formatCurrency(-cashDifference)} higher than owner cash outflow this month.`}
          </Text>
          {showComparableBreakdown ? (
            <Text size="sm">
              <Text span fw={600}>
                Comparable to rent (unrecoverable cash only):
              </Text>{" "}
              {comparableDifference >= 0
                ? `Owning’s “lost” slice is ${formatCurrency(comparableDifference)} more per month than rent (principal excluded—it builds equity${inputs.mortgageInterestTaxDeductionEnabled ? "; write-off modeled when applicable" : ""}).`
                : `Rent exceeds that owner burden by ${formatCurrency(-comparableDifference)} per month.`}
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}

function GroupRow({
  label,
  value,
  strong,
  valueColor,
  prefix,
}: {
  label: string;
  value: number;
  strong?: boolean;
  valueColor?: string;
  prefix?: string;
}) {
  const display =
    prefix === "−"
      ? `−${formatCurrency(value)}`
      : formatCurrency(value);
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 12,
      }}
    >
      <Text size="sm" c="dimmed" style={{ flex: 1 }}>
        {label}
      </Text>
      <Text
        size="sm"
        fw={strong ? 600 : 500}
        style={{ color: valueColor, whiteSpace: "nowrap" }}
      >
        {display}
      </Text>
    </Box>
  );
}

function ComparisonBar({
  label,
  amount,
  max,
  color,
}: {
  label: string;
  amount: number;
  max: number;
  color: string;
}) {
  const widthPct = (amount / max) * 100;
  return (
    <Box>
      <GroupRow label={label} value={amount} />
      <Box
        mt={4}
        style={{
          height: 10,
          borderRadius: 4,
          background: "var(--mantine-color-gray-2)",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            height: "100%",
            width: clampPct(widthPct),
            borderRadius: 4,
            background: color,
            transition: "width 160ms ease",
          }}
        />
      </Box>
    </Box>
  );
}
