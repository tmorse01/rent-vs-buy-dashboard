import { Box, Divider, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import type {
  ScenarioInputs,
  TimelinePoint,
} from "../features/scenario/ScenarioInputs";
import { formatCurrency, formatPercent } from "../utils/formatting";
import { COLORS } from "../theme/colors";
import {
  monthlyMortgageInterestTaxBenefit,
  RESIDENTIAL_RENTAL_MACRS_YEARS,
} from "../calculations/timeline";

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
    p.pmi -
    p.houseHackRentalIncomeMonthly;

  const taxBenefit = p.mortgageInterestTaxBenefitMonthly;
  const depreciationTaxBenefit = p.rentalDepreciationTaxBenefitMonthly;
  const effectiveMarginalRate = Math.min(
    50,
    Math.max(0, inputs.marginalTaxRate),
  );

  const interestTaxSavingsFromModel = monthlyMortgageInterestTaxBenefit(
    inputs,
    p.mortgageInterest,
  );
  /** After modeled tax write-off + excluding principal (equity)—matches timeline unrecoverable. */
  const ownerComparableMonthly = Math.max(0, p.ownerUnrecoverableMonthly);
  const renterMonthly = p.rentMonthly;

  const cashDifference = ownerCashMonthly - renterMonthly;
  /** Rent vs homeowner’s portion that truly doesn’t build equity—matches modeled unrecoverable costs. */
  const comparableDifference = ownerComparableMonthly - renterMonthly;

  const showComparableBreakdown =
    taxBenefit > 0 ||
    depreciationTaxBenefit > 0 ||
    (inputs.houseHackEnabled && p.houseHackRentalIncomeMonthly > 0) ||
    ((p.mortgagePrincipal ?? 0) > 0 && Number.isFinite(p.mortgagePrincipal));

  const depreciationDeductionAnnual =
    inputs.houseHackEnabled &&
    inputs.rentalDepreciationTaxBenefitEnabled &&
    inputs.totalSquareFootage > 0 &&
    inputs.rentalSquareFootage > 0 &&
    inputs.rentalSquareFootage <= inputs.totalSquareFootage
      ? (() => {
          const landPct = Math.min(
            50,
            Math.max(0, inputs.landValuePercentOfPurchase),
          );
          const depreciableBuilding = inputs.homePrice * (1 - landPct / 100);
          return (
            (depreciableBuilding *
              (inputs.rentalSquareFootage / inputs.totalSquareFootage)) /
            RESIDENTIAL_RENTAL_MACRS_YEARS
          );
        })()
      : 0;

  const chartMax = Math.max(
    ownerCashMonthly,
    renterMonthly,
    showComparableBreakdown ? ownerComparableMonthly : 0,
    inputs.houseHackEnabled ? p.houseHackRentalIncomeMonthly : 0,
    1,
  );

  const whoPaysMoreCash =
    ownerCashMonthly - renterMonthly >= 0 ? "owner" : "renter";

  return (
    <Paper p="xl" withBorder radius="md" shadow="sm" style={{ width: "100%" }}>
      <Stack gap="lg">
        <Box>
          <Title order={4} mb="xs" fw={600}>
            Monthly payment snapshot
          </Title>
          <Text size="sm" c="dimmed">
            Side-by-side cash flow for month {p.month} (year {p.year}).
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
                {p.mortgageInterest <= 0 ? null : inputs.mortgageInterestTaxDeductionEnabled ? (
                  <Paper
                    p="sm"
                    radius="sm"
                    withBorder
                    mt={4}
                    style={{
                      borderColor: "var(--mantine-color-gray-4)",
                      background: "var(--mantine-color-gray-0)",
                    }}
                  >
                    <Stack gap={6}>
                      <Text size="xs" fw={600}>
                        Estimated tax savings
                      </Text>
                      <Text size="xs" c="dimmed">
                        Deducting interest reduces your taxable income.
                      </Text>
                      <Text size="xs" c="dimmed" ff="monospace">
                        {formatCurrency(p.mortgageInterest)} (interest) ×{" "}
                        {formatPercent(effectiveMarginalRate, 2)} (marginal) ≈{" "}
                        <Text
                          span
                          fw={600}
                          ff="monospace"
                          c="var(--mantine-color-green-7)"
                        >
                          {formatCurrency(interestTaxSavingsFromModel)}
                        </Text>
                      </Text>
                    </Stack>
                  </Paper>
                ) : (
                  <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
                    Enable <Text span fw={600}>Model mortgage interest tax benefit</Text> in scenario inputs to estimate tax savings.
                  </Text>
                )}
              </Stack>
              <GroupRow label="Property tax" value={p.propertyTax} />
              <GroupRow label="Insurance" value={p.insurance} />
              <GroupRow label="Maintenance" value={p.maintenance} />
              {p.pmi > 0 ? <GroupRow label="PMI" value={p.pmi} /> : null}
              {inputs.houseHackEnabled && p.houseHackRentalIncomeMonthly > 0 ? (
                <GroupRow
                  label="+ Gross rental income (offsets cash)"
                  value={p.houseHackRentalIncomeMonthly}
                  valueColor="var(--mantine-color-green-8)"
                  prefix="+"
                />
              ) : null}
              {inputs.houseHackEnabled &&
              inputs.rentalDepreciationTaxBenefitEnabled &&
              depreciationTaxBenefit > 0 ? (
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
                      Estimated depreciation tax savings
                    </Text>
                    <Text size="xs" c="dimmed">
                      Rough annual rental-use depreciation deduction (building
                      only, incl. sq-ft allocation) divided by{" "}
                      {RESIDENTIAL_RENTAL_MACRS_YEARS} yrs, × marginal rate /
                      month.
                    </Text>
                    <Text size="xs" c="dimmed" ff="monospace">
                      ≈ {formatCurrency(depreciationDeductionAnnual)}/yr
                      deduction →{" "}
                      <Text
                        span
                        fw={600}
                        ff="monospace"
                        c="var(--mantine-color-green-7)"
                      >
                        {formatCurrency(depreciationTaxBenefit)}/mo
                      </Text>{" "}
                      modeled tax shield
                    </Text>
                  </Stack>
                </Paper>
              ) : null}
              <Divider my="xs" />
              <GroupRow
                label="Total cash outflow (net)"
                value={ownerCashMonthly}
                strong
              />
              {showComparableBreakdown ? (
                <>
                  {inputs.mortgageInterestTaxDeductionEnabled && taxBenefit > 0 ? (
                    <GroupRow
                      label="− Estimated tax savings (interest write-off)"
                      value={taxBenefit}
                      valueColor="var(--mantine-color-green-7)"
                      prefix="−"
                    />
                  ) : null}

                  {inputs.rentalDepreciationTaxBenefitEnabled &&
                  depreciationTaxBenefit > 0 ? (
                    <GroupRow
                      label="− Estimated tax savings (rental depreciation)"
                      value={depreciationTaxBenefit}
                      valueColor="var(--mantine-color-green-7)"
                      prefix="−"
                    />
                  ) : null}

                  {(p.mortgagePrincipal ?? 0) > 0 ? (
                    <>
                      <GroupRow
                        label="− Principal (builds equity)"
                        value={p.mortgagePrincipal}
                        valueColor={COLORS.owner.primary}
                        prefix="−"
                      />
                      <Text size="xs" c="dimmed" mt={-4}>
                        Unlike rent or interest, principal payments build home equity.
                      </Text>
                    </>
                  ) : null}

                  <GroupRow
                    label="Comparable unrecoverable costs"
                    value={ownerComparableMonthly}
                    strong
                  />
                  <Text size="xs" c="dimmed" mt={-4}>
                    The true "lost" cost of owning—after equity, modeled interest
                    write-offs, gross rental offsets, and rental depreciation
                    tax shield. Comparable to tenant rent here.
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
                label="Owner — unrecoverable costs"
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
              ? `Owning requires ${formatCurrency(cashDifference)} more out-of-pocket this month.`
              : `Renting requires ${formatCurrency(-cashDifference)} more out-of-pocket this month.`}
          </Text>
          {showComparableBreakdown ? (
            <Text size="sm">
              <Text span fw={600}>
                Unrecoverable cost difference:
              </Text>{" "}
              {comparableDifference >= 0
                ? `Owning "loses" ${formatCurrency(comparableDifference)} more this month than renting.`
                : `Renting "loses" ${formatCurrency(-comparableDifference)} more this month than owning.`}
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
  prefix?: "−" | "+";
}) {
  const display =
    prefix === "−"
      ? `−${formatCurrency(value)}`
      : prefix === "+"
        ? `+${formatCurrency(value)}`
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
